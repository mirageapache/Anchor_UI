// TASK-201: 驗證建置產物（需先執行 pnpm build）。每一項檢查各自獨立，依序執行後統一回報：
//   1. exports       每個元件都有個別入口、指向的檔案存在，且與 pnpm sync:package 產生的內容一致
//   2. sideEffects   註冊元件的模組與元件入口皆宣告為有副作用，且與產生的內容一致
//   3. 型別宣告       發布的 .d.ts 中相對 import 皆可解析；不發布沒有對應程式的內部型別
//   4. Tree-shaking  以 esbuild 與 Vite（rolldown）模擬消費端只引用單一元件，不得夾帶允許清單以外的元件
//   5. 發布內容       不得包含測試、stories 與 test-utils
//   6. 外部相依       @floating-ui/dom 為 external，不得打包進產物
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, matchesGlob, relative, resolve } from 'node:path';
import { build as esbuild } from 'esbuild';
import { build as viteBuild } from 'vite';
import { componentPackageEntries, isComponentExport, listComponents } from './components.mjs';

const root = resolve(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
const components = listComponents(root);
const expectedEntries = componentPackageEntries(components);
const toPosix = (path) => path.split('\\').join('/');

/**
 * 元件之間「允許」的相依（明確列出，不從原始碼推算）。
 * 新增跨元件相依時必須刻意修改此清單，否則 Tree-shaking 檢查會失敗——
 * 避免誤加一行 import 就讓「只用 Button」也被迫打包其他元件。
 */
const ALLOWED_COMPONENT_DEPS = {
  'icon-button': ['tooltip'],
  field: ['icon-button'],
  alert: ['button', 'input', 'modal'],
};

// ── 共用工具 ──

const tagOf = (name) => `aui-${name}`;
const definedTags = (code) =>
  new Set([...code.matchAll(/customElements\.define\(\s*["']([\w-]+)["']/g)].map((m) => m[1]));

/** 列出目錄下所有檔案（相對於套件根目錄，POSIX 路徑） */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? listFiles(join(dir, d.name)) : [toPosix(relative(root, join(dir, d.name)))],
  );
}

/**
 * 檔案是否符合 package.json 的 sideEffects 樣式（依打包工具的慣例比對）：
 * 開頭的 ./ 代表套件根目錄；不含 / 的樣式比對任何目錄下的同名檔案。
 */
function isSideEffectful(file) {
  return (pkg.sideEffects ?? []).some((pattern) => {
    let glob = pattern.replace(/^\.\//, '');
    if (!glob.includes('/')) glob = `**/${glob}`;
    return matchesGlob(file, glob);
  });
}

// ── 1. exports ──
function checkExports() {
  const failures = [];
  for (const name of components) {
    const entry = pkg.exports?.[`./${name}`];
    if (!entry) {
      failures.push(`exports 缺少 "./${name}"（請執行 pnpm sync:package）`);
      continue;
    }
    for (const key of ['types', 'import']) {
      if (!entry[key] || !existsSync(join(root, entry[key]))) {
        failures.push(`exports["./${name}"].${key} 指向的檔案不存在：${entry[key]}`);
      }
    }
  }
  const actual = Object.fromEntries(
    Object.entries(pkg.exports ?? {}).filter(([, value]) => isComponentExport(value)),
  );
  if (JSON.stringify(actual) !== JSON.stringify(expectedEntries.exports)) {
    failures.push('exports 的元件入口與元件清單不一致（請執行 pnpm sync:package）');
  }
  return failures;
}

// ── 2. sideEffects ──
function checkSideEffects(distFiles) {
  const failures = [];
  for (const file of distFiles.filter((f) => f.endsWith('.js'))) {
    const code = readFileSync(join(root, file), 'utf-8');
    if (definedTags(code).size && !isSideEffectful(file)) {
      failures.push(`${file} 會註冊 Custom Element，但未列入 sideEffects`);
    }
  }
  for (const name of components) {
    const entry = pkg.exports?.[`./${name}`]?.import;
    if (entry && !isSideEffectful(entry.replace(/^\.\//, ''))) {
      failures.push(`元件入口 ${entry} 未列入 sideEffects（bare import 時可能被整個移除）`);
    }
  }
  if (JSON.stringify(pkg.sideEffects) !== JSON.stringify(expectedEntries.sideEffects)) {
    failures.push('sideEffects 與元件清單不一致（請執行 pnpm sync:package）');
  }
  return failures;
}

// ── 3. 型別宣告 ──
function checkTypeDeclarations(publishedFiles) {
  const failures = [];
  const published = new Set(publishedFiles);
  for (const file of publishedFiles.filter((f) => f.endsWith('.d.ts'))) {
    // 內部模組不對外：沒有對應程式的內部型別不應發布（避免內部 API 型別外洩）
    if (file.startsWith('dist/internal/') && !published.has(file.replace(/\.d\.ts$/, '.js'))) {
      failures.push(`${file} 沒有對應的 .js，屬未使用的內部型別，不應發布`);
    }
    const source = readFileSync(join(root, file), 'utf-8');
    const specifiers = [
      ...source.matchAll(/(?:from\s+|import\(\s*)["'](\.{1,2}\/[^"']+)["']/g),
    ].map((m) => m[1]);
    for (const specifier of specifiers) {
      const target = toPosix(join(dirname(file), specifier)).replace(/\.js$/, '.d.ts');
      if (!published.has(target)) {
        failures.push(`${file} 引用的 ${specifier} 沒有對應的型別檔（${target}）`);
      }
    }
  }
  return failures;
}

// ── 4. Tree-shaking ──

/** 依允許清單展開（含遞移相依）的元件集合 */
function allowedClosure(name, seen = new Set()) {
  if (seen.has(name)) return seen;
  seen.add(name);
  for (const dep of ALLOWED_COMPONENT_DEPS[name] ?? []) allowedClosure(dep, seen);
  return seen;
}

/**
 * 原始碼中以相對路徑引用的其他元件（只看直接相依）。
 * `import type` / `export type` 在編譯後會被移除，不構成執行期相依，不列入。
 */
function sourceComponentImports(name) {
  const dir = join(root, 'src/components', name);
  const deps = new Set();
  const statement = /\b(?:import|export)\s+(type\s+)?(?:[\w*{}\s,]+?\s+from\s+)?'\.\.\/([\w-]+)\//g;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.ts') || file.includes('.test.')) continue;
    const source = readFileSync(join(dir, file), 'utf-8');
    for (const [, typeOnly, dep] of source.matchAll(statement)) {
      if (!typeOnly && components.includes(dep) && dep !== name) deps.add(dep);
    }
  }
  return deps;
}

/** 由打包結果包含的模組路徑，推得被打包進來的元件（不論是否有註冊動作） */
const componentsInModules = (moduleIds) =>
  new Set(
    moduleIds
      .map((id) => toPosix(id).match(/\/dist\/components\/([\w-]+)\//)?.[1])
      .filter((name) => name && components.includes(name)),
  );

/** 元件類別名稱：icon-button → AuiIconButton */
const classNameOf = (name) =>
  'Aui' + name.replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());

async function bundleWithEsbuild(file) {
  const result = await esbuild({
    entryPoints: [file],
    bundle: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
    metafile: true,
    external: ['lit', 'lit/*', '@floating-ui/dom'],
  });
  return {
    code: result.outputFiles.map((f) => f.text).join('\n'),
    modules: Object.keys(result.metafile.inputs).map((input) => resolve(input)),
  };
}

async function bundleWithVite(file, tmp) {
  const output = await viteBuild({
    configFile: false,
    logLevel: 'silent',
    root: tmp,
    build: {
      write: false,
      minify: false,
      rollupOptions: { input: file, external: [/^lit/, /^@floating-ui\//] },
    },
  });
  const chunks = (Array.isArray(output) ? output : [output]).flatMap((o) => o.output);
  return {
    code: chunks.map((c) => c.code ?? '').join('\n'),
    modules: chunks.flatMap((c) => c.moduleIds ?? Object.keys(c.modules ?? {})),
  };
}

async function checkTreeShaking() {
  const failures = [];
  const tmp = mkdtempSync(join(tmpdir(), 'aui-verify-'));
  const bundlers = { esbuild: bundleWithEsbuild, vite: bundleWithVite };
  try {
    for (const name of components) {
      // 原始碼引用的其他元件必須都在允許清單中
      const allowed = new Set(ALLOWED_COMPONENT_DEPS[name] ?? []);
      for (const dep of sourceComponentImports(name)) {
        if (!allowed.has(dep)) {
          failures.push(
            `${name} 的原始碼引用了 ${dep}，但未列於 ALLOWED_COMPONENT_DEPS（若為刻意的相依，請更新允許清單）`,
          );
        }
      }

      const entry = pkg.exports?.[`./${name}`]?.import;
      if (!entry || !existsSync(join(root, entry))) continue;
      const entryPath = JSON.stringify(toPosix(join(root, entry)));
      // 模擬 import '@anchor-ui/core/<name>' 與 import { AuiXxx } from '@anchor-ui/core/<name>'
      const className = classNameOf(name);
      const consumers = {
        'bare import': `import ${entryPath};\n`,
        'named import': `import { ${className} } from ${entryPath};\nconsole.log(${className});\n`,
      };

      const expectedNames = [...allowedClosure(name)].sort();
      const expectedTags = expectedNames.map(tagOf);
      for (const [scenario, source] of Object.entries(consumers)) {
        const consumer = join(tmp, `consumer-${name}-${scenario.replace(' ', '-')}.js`);
        writeFileSync(consumer, source);
        for (const [bundler, bundle] of Object.entries(bundlers)) {
          const { code, modules } = await bundle(consumer, tmp);
          const label = `[${bundler}] 只引用 ${name}（${scenario}）`;
          const tags = [...definedTags(code)].sort();
          if (JSON.stringify(tags) !== JSON.stringify(expectedTags)) {
            failures.push(
              `${label}：預期註冊 ${expectedTags.join(', ')}，實際為 ${tags.join(', ') || '（無）'}`,
            );
          }
          // 不論是否有註冊動作，都不得打包允許清單以外的元件程式碼
          const bundled = [...componentsInModules(modules)].sort();
          const unexpected = bundled.filter((c) => !expectedNames.includes(c));
          if (unexpected.length) {
            failures.push(`${label}：打包進了其他元件的程式碼：${unexpected.join(', ')}`);
          }
          if (!bundled.includes(name)) {
            failures.push(`${label}：打包結果找不到 ${name} 本身的模組（模組分析可能失效）`);
          }
        }
      }
    }

    // 全量入口須註冊所有元件
    const fullConsumer = join(tmp, 'consumer-full.js');
    writeFileSync(
      fullConsumer,
      `import ${JSON.stringify(toPosix(join(root, pkg.exports['.'].import)))};\n`,
    );
    const fullTags = [...definedTags((await bundleWithEsbuild(fullConsumer)).code)].sort();
    const allTags = components.map(tagOf).sort();
    if (JSON.stringify(fullTags) !== JSON.stringify(allTags)) {
      failures.push(`全量入口應註冊 ${allTags.join(', ')}，實際為 ${fullTags.join(', ')}`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  return failures;
}

// ── 5. 發布內容 ──
function listPublishedFiles() {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: root,
      encoding: 'utf-8',
      shell: process.platform === 'win32',
    }),
  );
  return packed[0].files.map((f) => f.path);
}

function checkPublishedFiles(publishedFiles) {
  const leaked = publishedFiles.filter((p) =>
    /\.test\.|(^|\/)stories\/|(^|\/)test-utils\//.test(p),
  );
  return leaked.length
    ? [`發布內容包含不應發布的檔案（${leaked.length} 個），例如：${leaked.slice(0, 3).join(', ')}`]
    : [];
}

// ── 6. 外部相依 ──
function checkExternalDeps(distFiles) {
  const failures = [];
  const distJs = distFiles.filter((f) => f.endsWith('.js'));
  // 函式名稱會被改寫，改以字串常值判斷：'clippingAncestors' 是 floating-ui 原始碼中的預設邊界值
  const bundled = distJs.filter((f) =>
    /["']clippingAncestors["']/.test(readFileSync(join(root, f), 'utf-8')),
  );
  if (bundled.length) failures.push(`@floating-ui/dom 被打包進產物：${bundled.join(', ')}`);
  const imports = distJs.some((f) =>
    /from\s*["']@floating-ui\/dom["']/.test(readFileSync(join(root, f), 'utf-8')),
  );
  if (distJs.length && !imports) failures.push('產物中找不到對 @floating-ui/dom 的外部 import');
  return failures;
}

// ── 執行 ──
const distFiles = existsSync(join(root, 'dist')) ? listFiles(join(root, 'dist')) : [];
if (!distFiles.length) {
  console.error('✗ 找不到 dist/，請先執行 pnpm build');
  process.exit(1);
}
const publishedFiles = listPublishedFiles();

const results = {
  exports: checkExports(),
  sideEffects: checkSideEffects(distFiles),
  型別宣告: checkTypeDeclarations(publishedFiles),
  'Tree-shaking': await checkTreeShaking(),
  發布內容: checkPublishedFiles(publishedFiles),
  外部相依: checkExternalDeps(distFiles),
};

const failures = Object.entries(results).flatMap(([check, messages]) =>
  messages.map((message) => `[${check}] ${message}`),
);
if (failures.length) {
  console.error(`✗ 套件驗證失敗（${failures.length} 項）：`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `✓ 套件驗證通過：${components.length} 個元件的 ${Object.keys(results).join('、')}皆正確`,
);
