// TASK-502：由 Custom Elements Manifest（custom-elements.json，pnpm analyze 產生）產生框架的模板型別宣告：
//
//   dist/frameworks/vue.d.ts    → @anchor-ui/core/vue    （擴充 Vue 的 GlobalComponents，供 vue-tsc 檢查範本）
//   dist/frameworks/react.d.ts  → @anchor-ui/core/react  （擴充 React 19 的 JSX.IntrinsicElements）
//
// 屬性的型別直接取自元件類別（Pick<AuiButton, 'variant' | …>），因此與元件既有的型別（ButtonVariant 等）一致；
// manifest 只提供「哪些是可設定的公開屬性」。事件型別取自 JSDoc 的 @fires {CustomEvent<Detail>}，
// 其中的型別名稱必須由全量入口匯出（產生的宣告檔從 ../index.js 匯入）。
//
// 由 pnpm build 執行（在 vite build 之後，輸出到 dist/）。
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifestPath = join(root, 'custom-elements.json');
const outDir = join(root, 'dist/frameworks');

/** 事件型別中可直接使用的全域型別（其餘名稱都從全量入口匯入） */
const GLOBAL_TYPES = new Set(['CustomEvent', 'Event']);

/**
 * 元件分派的原生事件；其餘事件一律以 aui- 開頭。manifest 會把 new CustomEvent(變數) 的變數名稱
 * 誤當成事件名稱，以此擋下這類錯誤（請在 dispatchEvent 處以字串常值寫出事件名稱）
 */
const NATIVE_EVENTS = new Set(['input', 'change']);

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!existsSync(manifestPath)) fail('找不到 custom-elements.json，請先執行 pnpm analyze');
if (!existsSync(join(root, 'dist/index.d.ts'))) fail('找不到 dist/index.d.ts，請先執行 vite build');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

/** 列出目錄下所有檔案（遞迴） */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory() ? listFiles(join(dir, item.name)) : [join(dir, item.name)],
  );
}

/**
 * 使用 defaultTrue converter 的 attribute（只有字串 "false" 視為 false，例如 close-on-escape="false"）。
 * manifest 不記錄 converter，因此從原始碼的 @property 宣告取得
 */
const stringFalseAttributes = new Set(
  listFiles(join(root, 'src'))
    .filter((file) => file.endsWith('.ts') && !/\.(test|stories)\.ts$/.test(file))
    .flatMap((file) => {
      const code = readFileSync(file, 'utf-8');
      const matches = [...code.matchAll(/attribute:\s*'([\w-]+)',\s*converter:\s*defaultTrue\b/g)];
      // 這個樣式只認得「attribute 緊接 converter」的寫法：中間多一個選項（如 reflect）就不會被找到，
      // 該屬性在產生的型別中會默默少了 "true" / "false" 的字串形式。數量對不上時直接失敗
      const uses = [...code.matchAll(/\bconverter:\s*defaultTrue\b/g)].length;
      if (uses !== matches.length) {
        fail(
          `${file}：有 ${uses} 處 converter: defaultTrue，但只辨識出 ${matches.length} 個 attribute。` +
            "請寫成 { attribute: '…', converter: defaultTrue }（兩個選項相鄰、依此順序）",
        );
      }
      return matches;
    })
    .map(([, attribute]) => attribute),
);

const uniqueSorted = (names) => [...new Set(names)].sort();

/** 從 manifest 整理每個元件：標籤、類別、可設定的屬性（含對應 attribute 者）與事件 */
const elements = manifest.modules
  .flatMap((mod) => mod.declarations ?? [])
  .filter((declaration) => declaration.customElement && declaration.tagName)
  .map((declaration) => {
    const fields = (declaration.members ?? []).filter(
      (member) => member.kind === 'field' && !member.static && !member.readonly,
    );
    const attributeFields = fields.filter((member) => member.attribute);
    const events = (declaration.events ?? []).map((event) => {
      if (!event.name.startsWith('aui-') && !NATIVE_EVENTS.has(event.name)) {
        fail(
          `<${declaration.tagName}> 的事件名稱「${event.name}」不是 aui- 開頭：manifest 可能把 new CustomEvent(變數) 的變數名稱當成事件名稱，請改以字串常值寫出；若確實是元件分派的原生事件，請加入 NATIVE_EVENTS`,
        );
      }
      if (!event.type?.text) {
        fail(
          `<${declaration.tagName}> 的事件 ${event.name} 沒有型別：請在 @fires 加上 {CustomEvent<…>}`,
        );
      }
      return { name: event.name, type: event.type.text };
    });
    return {
      tag: declaration.tagName,
      className: declaration.name,
      props: uniqueSorted(fields.map((member) => member.name)),
      attributeProps: uniqueSorted(attributeFields.map((member) => member.name)),
      stringFalseProps: uniqueSorted(
        attributeFields
          .filter((member) => stringFalseAttributes.has(member.attribute))
          .map((member) => member.name),
      ),
      events: events.sort((a, b) => a.name.localeCompare(b.name)),
    };
  })
  .sort((a, b) => a.tag.localeCompare(b.tag));

if (!elements.length) fail('custom-elements.json 中沒有任何元件');

/**
 * 全量入口（dist/index.d.ts）實際匯出的名稱：從入口沿著 `export * from` 走訪。
 * 只看「dist/ 裡有沒有宣告」是不夠的：宣告在 x.types.ts 卻沒有從元件的 index.ts 轉出的型別，
 * 產生的宣告檔一樣匯入不到（使用端開著 skipLibCheck 時，事件型別會默默變成 any）
 */
function exportedNames() {
  const names = new Set();
  const visited = new Set();
  const visit = (file) => {
    if (visited.has(file)) return;
    visited.add(file);
    if (!existsSync(file)) fail(`找不到型別宣告 ${file}（由全量入口轉出），請先執行 vite build`);
    const code = readFileSync(file, 'utf-8');
    const declaration =
      /^export (?:declare )?(?:abstract )?(?:interface|type|class|const|function|enum) (\w+)/gm;
    for (const [, name] of code.matchAll(declaration)) names.add(name);
    // export { A, B as C }、export type { A }（有無 from 皆同：列出的就是對外的名稱）
    for (const [, list] of code.matchAll(/^export (?:type )?\{([^}]*)\}/gm)) {
      for (const item of list.split(',')) {
        const name = item
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)
          .at(-1);
        if (name) names.add(name);
      }
    }
    for (const [, specifier] of code.matchAll(/^export \* from ['"](\.[^'"]+)['"]/gm)) {
      visit(join(dirname(file), specifier.replace(/\.js$/, '.d.ts')));
    }
  };
  visit(join(root, 'dist', 'index.d.ts'));
  return names;
}

/** 宣告檔要從全量入口匯入的型別：元件類別與事件型別中出現的名稱（→ 出處，供錯誤訊息使用） */
const importedTypes = new Map(elements.map((element) => [element.className, '元件類別']));
for (const { tag, events } of elements) {
  for (const { name: eventName, type } of events) {
    for (const [name] of type.matchAll(/\b[A-Z]\w*/g)) {
      if (!GLOBAL_TYPES.has(name)) importedTypes.set(name, `<${tag}> 的 ${eventName}`);
    }
  }
}
// 產生的宣告檔從 ../index.js 匯入這些名稱：沒有匯出的型別（或 File 等未列入 GLOBAL_TYPES 的全域型別）
// 會讓使用端的型別檢查失敗，在此提早指出
const exported = exportedNames();
const missing = [...importedTypes].filter(([name]) => !exported.has(name));
if (missing.length) {
  fail(
    `以下型別沒有由元件庫匯出：${missing.map(([name, source]) => `${name}（${source}）`).join('、')}。` +
      '請從元件的 index.ts 匯出；全域型別則加入 GLOBAL_TYPES',
  );
}

const quote = (value) => `'${value}'`;
const propUnion = (props) => (props.length ? props.map(quote).join(' | ') : 'never');
const eventMap = (events, indent) =>
  events.length
    ? `{\n${events.map((event) => `${indent}  ${quote(event.name)}: ${event.type};`).join('\n')}\n${indent}}`
    : '{}';

/** 一個元件的宣告：`'aui-x': AuiCustomElement<型別參數…>;`（typeArgs 由各框架決定） */
const entry = (tag, typeArgs, indent) =>
  `${indent}${quote(tag)}: AuiCustomElement<\n` +
  typeArgs.map((arg) => `${indent}  ${arg}`).join(',\n') +
  `\n${indent}>;`;

const HEADER = `// 由 scripts/generate-framework-types.mjs 依 custom-elements.json 產生，請勿手動修改。
import type {
${[...importedTypes.keys()]
  .sort()
  .map((name) => `  ${name},`)
  .join('\n')}
} from '../index.js';
`;

function vueDeclarations() {
  const entries = elements.map((element) =>
    entry(
      element.tag,
      [
        element.className,
        eventMap(element.events, '      '),
        propUnion(element.props),
        propUnion(element.attributeProps),
        propUnion(element.stringFalseProps),
      ],
      '    ',
    ),
  );
  return `${HEADER}import type { EmitFn, HTMLAttributes, PublicProps } from 'vue';

/**
 * 以靜態 HTML attribute 撰寫時的字串值（\`lines="3"\`、\`heading-level="2"\`、\`disabled=""\`）：
 * 數值為對應的數字字串（字面值聯集只接受其中的值）；布林為空字串，使用 defaultTrue converter 的
 * 屬性另外接受 "true" / "false"（\`close-on-escape="false"\`）；陣列與物件為 JSON 字串。
 */
type AttributeString<Value, StringFalse extends boolean> =
  | ([Extract<Value, number>] extends [never] ? never : \`\${Extract<Value, number>}\`)
  | ([Extract<Value, boolean>] extends [never]
      ? never
      : StringFalse extends true
        ? '' | 'true' | 'false'
        : '')
  | ([Extract<Value, object>] extends [never] ? never : string);

/**
 * 範本上可設定的屬性：
 * - 屬性本身的型別（\`:variant="variant"\`）。
 * - 布林屬性另外接受 null：以 kebab-case 綁定（\`:full-width="isWide || null"\`）時 Vue 寫成 HTML attribute，
 *   null 會移除 attribute（見 README「在 Vue 範本中綁定屬性」）。
 * - 有對應 HTML attribute 的屬性另外接受靜態 attribute 的字串值（見 AttributeString）。
 */
type AuiProps<
  Element,
  Props extends keyof Element,
  AttributeProps extends Props,
  StringFalseProps extends AttributeProps,
> = {
  [K in Props]?:
    | Element[K]
    | (Element[K] extends boolean ? null : never)
    | (K extends AttributeProps
        ? AttributeString<Element[K], K extends StringFalseProps ? true : false>
        : never);
};

/**
 * 依 Vue 文件「Typing custom elements in SFC templates」的寫法：vue-tsc 由 \`$props\` 檢查範本上的屬性，
 * 由 \`$emit\` 檢查事件處理器（\`@aui-file-drop\` 對應 \`onAuiFileDrop\`）。
 */
type AuiCustomElement<
  Element extends HTMLElement,
  Events extends Record<string, Event>,
  Props extends keyof Element,
  AttributeProps extends Props,
  StringFalseProps extends AttributeProps,
> = new () => Element & {
  /** @deprecated 僅供範本型別檢查，請勿在元素 ref 上使用 */
  $props: HTMLAttributes & AuiProps<Element, Props, AttributeProps, StringFalseProps> & PublicProps;
  /** @deprecated 僅供範本型別檢查，請勿在元素 ref 上使用 */
  $emit: EmitFn<{ [K in keyof Events]: (event: Events[K]) => void }>;
};

declare module 'vue' {
  interface GlobalComponents {
${entries.join('\n')}
  }
}
`;
}

function reactDeclarations() {
  // 原生事件（input、change）沿用 React 本身的 onInput / onChange，只列 aui- 自訂事件。
  // JSX 沒有「靜態 attribute」與綁定之分（數值寫成 lines={3}），因此只接受屬性本身的型別
  const entries = elements.map((element) =>
    entry(
      element.tag,
      [
        element.className,
        eventMap(
          element.events.filter((event) => event.name.startsWith('aui-')),
          '        ',
        ),
        propUnion(element.props),
      ],
      '      ',
    ),
  );
  return `${HEADER}import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * React 19 的自訂元素：屬性直接設定為 property；\`on\` 開頭的屬性會以其後的名稱監聽事件
 * （\`onaui-file-drop\` 監聽 \`aui-file-drop\`）。
 */
type AuiCustomElement<
  Element extends HTMLElement,
  Events extends Record<string, Event>,
  Props extends keyof Element,
> = DetailedHTMLProps<HTMLAttributes<Element>, Element> &
  Partial<Pick<Element, Props>> & {
    [K in keyof Events as \`on\${K & string}\`]?: (event: Events[K]) => void;
  };

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
${entries.join('\n')}
    }
  }
}
`;
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'vue.d.ts'), vueDeclarations());
writeFileSync(join(outDir, 'react.d.ts'), reactDeclarations());
console.log(
  `✓ 已產生 ${elements.length} 個元件的框架型別宣告（dist/frameworks/vue.d.ts、react.d.ts）`,
);
