// TASK-307: 跨框架冒煙測試。以 npm pack 產出的 tarball 安裝到小型的 Vue 3 / Angular 專案並做正式建置，
// 驗證「實際發布的產物」而不是 workspace 內的原始碼：exports、sideEffects（Tree-shaking）、型別宣告與發布內容。
// TASK-501: angular-ssr 另外啟動建置出的 SSR 伺服器，檢查伺服器輸出與瀏覽器端的 hydration（見 scripts/smoke-ssr.mjs）。
//
//   node scripts/smoke-test.mjs                         所有框架都測（自動打包，需先 pnpm build）
//   node scripts/smoke-test.mjs vue3                    只測 Vue 3（可為 vue3 / angular / angular-ssr，可列出多個）
//   node scripts/smoke-test.mjs angular --tarball <檔案>  使用指定的 tarball（CI 使用 build job 產出的檔案）
//   node scripts/smoke-test.mjs --keep                  保留暫存的專案目錄以便檢查
//
// 測試專案位於 smoke/<framework>/，刻意不放進 pnpm workspace：它們必須像外部專案一樣，
// 只透過 tarball 取得元件庫。相依版本由各自的 package-lock.json 鎖定（npm ci）。
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { listComponents } from './components.mjs';
import { npm } from './npm.mjs';
import { INSTALL_LIFECYCLE_SCRIPTS, pack } from './pack.mjs';
import { checkServerRendering } from './smoke-ssr.mjs';

const root = resolve(import.meta.dirname, '..');

/** 按需載入的測試專案（smoke/vue3、smoke/angular 的 src）引用的元件入口；field 會帶入 icon-button → tooltip */
const IMPORTED_ENTRIES = ['button', 'input', 'field', 'card', 'toast'];
const ON_DEMAND_TAGS = [...IMPORTED_ENTRIES, 'icon-button', 'tooltip'].map((name) => `aui-${name}`);
const ALL_TAGS = listComponents(root).map((name) => `aui-${name}`);

/**
 * 各測試專案的設定。
 * - expectedTags：打包結果必須恰好註冊的元件（按需載入的專案藉此驗證 Tree-shaking）
 * - typeCoverage：產生引用每個入口型別宣告的檔案（需搭配 skipLibCheck: false）
 * - ssr：建置後啟動 SSR 伺服器並以瀏覽器檢查 hydration
 */
const FRAMEWORKS = {
  vue3: { expectedTags: ON_DEMAND_TAGS, typeCoverage: true },
  angular: { expectedTags: ON_DEMAND_TAGS, typeCoverage: true },
  // 在元件檔載入全量入口（業務專案最常見的寫法），伺服器的 bundle 也會載入全部元件
  'angular-ssr': { expectedTags: ALL_TAGS, typeCoverage: false, ssr: true },
};
/** 測試專案範本中的文字：出現在打包結果中代表應用程式本身確實被編譯進產物 */
const APP_MARKER = 'Installed from the tarball';

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

let options;
try {
  options = parseArgs({
    allowPositionals: true,
    options: { tarball: { type: 'string' }, keep: { type: 'boolean', default: false } },
  });
} catch (error) {
  fail(
    `${error.message}\n  用法：node scripts/smoke-test.mjs [vue3|angular|angular-ssr …] [--tarball <檔案>] [--keep]`,
  );
}
const { keep, tarball: tarballArg } = options.values;
const frameworkNames = Object.keys(FRAMEWORKS);
const unknown = options.positionals.filter((name) => !frameworkNames.includes(name));
if (unknown.length) fail(`未知的框架：${unknown.join(', ')}（可用：${frameworkNames.join(', ')}）`);
const frameworks = options.positionals.length ? [...new Set(options.positionals)] : frameworkNames;

/** 列出目錄下所有檔案（遞迴，回傳絕對路徑） */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

/** 列出 exports 物件中所有指向的檔案路徑（遞迴展開條件式 exports） */
function exportTargets(value) {
  if (typeof value === 'string') return [value];
  return Object.values(value ?? {}).flatMap(exportTargets);
}

/**
 * 產生只含型別匯入的檔案，讓型別檢查涵蓋全量入口與每一個元件入口的型別宣告
 * （測試專案的 skipLibCheck 為 false；沒有被引用的 .d.ts 不會被檢查）。
 * 型別匯入在編譯後會被移除，不影響打包結果與 Tree-shaking 的檢查。
 */
function writeTypeCoverage(project) {
  const entries = [
    '@anchor-ui/core',
    ...listComponents(root).map((name) => `@anchor-ui/core/${name}`),
  ];
  const lines = [
    '// 由 scripts/smoke-test.mjs 產生：引用每個入口的型別宣告，確保它們都能被解析並通過型別檢查',
    ...entries.map((entry, index) => `export type * as entry${index} from '${entry}';`),
    '',
  ];
  writeFileSync(join(project, 'src', 'all-entry-types.ts'), lines.join('\n'));
}

/** 檢查安裝後的套件內容（發布產物本身） */
function checkInstalledPackage(project) {
  const failures = [];
  const installed = join(project, 'node_modules/@anchor-ui/core');
  const pkg = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf-8'));
  const expected = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8')).version;

  if (pkg.version !== expected) {
    failures.push(`安裝的版本為 ${pkg.version}，與 package.json 的 ${expected} 不一致`);
  }
  const lifecycle = INSTALL_LIFECYCLE_SCRIPTS.filter((name) => pkg.scripts?.[name]);
  if (lifecycle.length) {
    failures.push(`發布的 package.json 含安裝時會執行的腳本：${lifecycle.join(', ')}`);
  }

  // exports 指向的每個檔案都必須存在於發布內容中（含 styles.css、tokens.css 與 SCSS 原始碼）
  const missingTargets = [...new Set(exportTargets(pkg.exports))].filter(
    (target) => !existsSync(join(installed, target)),
  );
  if (missingTargets.length) {
    failures.push(`exports 指向不存在的檔案：${missingTargets.slice(0, 3).join(', ')}`);
  }

  const files = listFiles(installed);
  const leaked = files.filter((file) => /\.(test|stories)\.|[\\/]test-utils[\\/]/.test(file));
  if (leaked.length) failures.push(`發布內容包含測試或 stories 檔案（${leaked.length} 個）`);
  if (!existsSync(join(installed, 'LICENSE'))) failures.push('安裝的套件缺少 LICENSE');

  // 發布的程式碼引用的外部套件都必須列在 dependencies / peerDependencies：
  // 測試專案為了鎖定版本也自行宣告了 lit 等套件，元件庫漏列相依時安裝仍會成功，因此在此明確檢查。
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
  const undeclared = new Set();
  for (const file of files.filter((path) => /[\\/]dist[\\/].*\.js$/.test(path))) {
    const code = readFileSync(file, 'utf-8');
    for (const [, specifier] of code.matchAll(/(?:from|import)\s*["']([^"'./][^"']*)["']/g)) {
      const name = specifier.startsWith('@')
        ? specifier.split('/').slice(0, 2).join('/')
        : specifier.split('/')[0];
      if (!declared.has(name)) undeclared.add(name);
    }
  }
  if (undeclared.size) {
    failures.push(`dist 引用了未列於 dependencies 的套件：${[...undeclared].join(', ')}`);
  }

  // 元件庫要求的版本與測試專案鎖定的版本不相容時，npm 會在套件底下另裝一份，代表 lockfile 需要更新
  const nestedDir = join(installed, 'node_modules');
  const nested = existsSync(nestedDir)
    ? readdirSync(nestedDir).filter((name) => name !== '.bin')
    : [];
  if (nested.length) {
    failures.push(
      `@anchor-ui/core 底下另外安裝了相依（${nested.join(', ')}）：請更新 smoke/ 專案的 package-lock.json 以符合元件庫要求的版本`,
    );
  }
  return failures;
}

/**
 * 檢查建置結果：打包結果恰好註冊 expectedTags 中的元件。按需載入的測試專案只引用部分元件，
 * 沒有引用的元件不得出現在打包結果中（驗證 exports 的個別入口與 sideEffects 讓 Tree-shaking 生效）。
 * @param {string} project
 * @param {string[]} expectedTags
 */
function checkBuildOutput(project, expectedTags) {
  const failures = [];
  const dist = join(project, 'dist');
  if (!existsSync(dist)) return ['建置後找不到 dist/'];

  const files = listFiles(dist);
  const read = (pattern) =>
    files
      .filter((file) => pattern.test(file))
      .map((file) => readFileSync(file, 'utf-8'))
      .join('\n');
  // .mjs：Angular SSR 的伺服器 bundle（同樣須註冊預期的元件，確認伺服器端也載入了元件庫）
  const code = read(/\.m?js$/);
  const styles = read(/\.css$/);

  // 建置指令成功不代表產物有內容（例如 Angular 的 tsconfig 設了 noEmit 時每個模組都是空的）
  if (!code.includes(APP_MARKER)) {
    failures.push('打包結果不含應用程式的範本內容（應用程式沒有被編譯進產物）');
  }

  // 以「註冊元件」的程式碼判斷（customElements.define('aui-xxx', …)），
  // 而不是單純搜尋標籤名稱：元件內的選擇器字串也會出現其他元件的標籤名稱。
  const registered = new Set(
    [...code.matchAll(/customElements\.define\(\s*["'`](aui-[\w-]+)["'`]/g)].map(
      (match) => match[1],
    ),
  );
  const missing = expectedTags.filter((tag) => !registered.has(tag));
  const unexpected = [...registered].filter((tag) => !expectedTags.includes(tag));

  if (missing.length) {
    failures.push(`打包結果沒有註冊：${missing.join(', ')}（個別入口沒有註冊元件？）`);
  }
  if (unexpected.length) {
    failures.push(`打包結果包含未引用的元件：${unexpected.join(', ')}（Tree-shaking 未生效）`);
  }
  if (!styles.includes('--color-brand-600')) {
    failures.push('打包的 CSS 不含 design tokens（@anchor-ui/core/styles.css 未被載入）');
  }
  return failures;
}

async function run(framework, tarball) {
  const config = FRAMEWORKS[framework];
  const fixture = join(root, 'smoke', framework);
  // 複製到系統暫存目錄：路徑較短（Windows 有 260 字元限制），也不會在 repo 內留下 node_modules
  const project = mkdtempSync(join(tmpdir(), `aui-smoke-${framework}-`));
  const started = Date.now();
  const failures = [];
  try {
    cpSync(fixture, project, {
      recursive: true,
      filter: (source) => !/[\\/](node_modules|dist)$/.test(source),
    });
    if (config.typeCoverage) writeTypeCoverage(project);

    // --ignore-scripts：不執行任何相依的安裝腳本（建置工具的原生程式由平台專屬的可選相依提供）
    npm(['ci', '--no-audit', '--no-fund', '--ignore-scripts'], { cwd: project });
    // --no-save：不改寫 package.json / package-lock.json
    npm(['install', '--no-save', '--no-audit', '--no-fund', '--ignore-scripts', tarball], {
      cwd: project,
    });

    failures.push(...checkInstalledPackage(project));
    try {
      // 型別檢查 + 正式建置（Vue SFC 編譯 / Angular AOT；angular-ssr 另外產生伺服器的 bundle）
      npm(['run', 'build'], { cwd: project });
      failures.push(...checkBuildOutput(project, config.expectedTags));
      if (config.ssr) {
        failures.push(...(await checkServerRendering(project, { appMarker: APP_MARKER })));
      }
    } catch (error) {
      failures.push(error.message);
    }
  } catch (error) {
    failures.push(error.message);
  } finally {
    if (keep) console.log(`  （保留暫存專案：${project}）`);
    else rmSync(project, { recursive: true, force: true, maxRetries: 5 });
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  if (failures.length) {
    console.error(`✗ ${framework}：冒煙測試失敗（${failures.length} 項，${seconds}s）`);
    for (const failure of failures) console.error(`  - ${failure}`);
    return false;
  }
  const ssr = config.ssr ? '、伺服器端渲染與 hydration ' : '';
  console.log(`✓ ${framework}：以 tarball 安裝、型別檢查與正式建置${ssr}皆通過（${seconds}s）`);
  return true;
}

let tarball;
try {
  tarball = tarballArg ? resolve(tarballArg) : pack();
} catch (error) {
  fail(error.message);
}
if (!existsSync(tarball)) fail(`找不到 tarball：${tarball}`);
console.log(`使用 tarball：${tarball}`);

const results = [];
for (const framework of frameworks) results.push(await run(framework, tarball));
process.exit(results.every(Boolean) ? 0 : 1);
