// TASK-201: 驗證建置產物的 Tree-shaking、exports / sideEffects 設定與發布內容。
// 需先執行 pnpm build。以 esbuild 與 Vite（rolldown）模擬消費端各自打包「只引用單一元件」的情境。
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { build as esbuild } from 'esbuild';
import { build as viteBuild } from 'vite';

const root = resolve(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
const failures = [];
const fail = (message) => failures.push(message);
const toPosix = (path) => path.split('\\').join('/');

/** 列出 src/components 下的元件資料夾（具 index.ts 者） */
const components = readdirSync(join(root, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(root, 'src/components', d.name, 'index.ts')))
  .map((d) => d.name);

/** 由原始碼的相對 import 推得元件之間的相依（例如 icon-button → tooltip） */
function componentDeps(name, seen = new Set()) {
  if (seen.has(name)) return seen;
  seen.add(name);
  const dir = join(root, 'src/components', name);
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.ts') || file.includes('.test.')) continue;
    const source = readFileSync(join(dir, file), 'utf-8');
    for (const [, dep] of source.matchAll(/(?:from|import)\s+'\.\.\/([\w-]+)\//g)) {
      if (components.includes(dep)) componentDeps(dep, seen);
    }
  }
  return seen;
}

const tagOf = (name) => `aui-${name}`;
const definedTags = (code) =>
  new Set([...code.matchAll(/customElements\.define\(\s*["']([\w-]+)["']/g)].map((m) => m[1]));

/** 列出 dist 下所有檔案（相對於套件根目錄，POSIX 路徑） */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? listFiles(join(dir, d.name)) : [toPosix(relative(root, join(dir, d.name)))],
  );
}

const sideEffects = Array.isArray(pkg.sideEffects) ? pkg.sideEffects : [];
const isSideEffectful = (file) =>
  sideEffects.some((pattern) =>
    pattern.startsWith('**/*') ? file.endsWith(pattern.slice(4)) : `./${file}` === pattern,
  );

// ── 1. exports：每個元件都有個別入口，且指向的檔案存在 ──
for (const name of components) {
  const entry = pkg.exports?.[`./${name}`];
  if (!entry) {
    fail(`exports 缺少 "./${name}"`);
    continue;
  }
  for (const key of ['types', 'import']) {
    if (!entry[key] || !existsSync(join(root, entry[key]))) {
      fail(`exports["./${name}"].${key} 指向的檔案不存在：${entry[key]}`);
    }
  }
}

// ── 2. sideEffects：會註冊元件的模組與元件入口都必須宣告為有副作用 ──
const distFiles = existsSync(join(root, 'dist')) ? listFiles(join(root, 'dist')) : [];
if (!distFiles.length) fail('找不到 dist/，請先執行 pnpm build');
for (const file of distFiles.filter((f) => f.endsWith('.js'))) {
  const code = readFileSync(join(root, file), 'utf-8');
  if (definedTags(code).size && !isSideEffectful(file)) {
    fail(`${file} 會註冊 Custom Element，但未列入 sideEffects`);
  }
}
for (const name of components) {
  const entry = pkg.exports?.[`./${name}`]?.import;
  if (entry && !isSideEffectful(entry.replace(/^\.\//, ''))) {
    fail(`元件入口 ${entry} 未列入 sideEffects（bare import 時可能被整個移除）`);
  }
}

// ── 3. Tree-shaking：消費端只引用單一元件時，不得夾帶其他元件 ──
const external = ['lit', 'lit/*', '@floating-ui/dom'];
const tmp = mkdtempSync(join(tmpdir(), 'aui-verify-'));

async function bundleWithEsbuild(file) {
  const result = await esbuild({
    entryPoints: [file],
    bundle: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
    external,
  });
  return result.outputFiles.map((f) => f.text).join('\n');
}

async function bundleWithVite(file) {
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
  return chunks.map((c) => c.code ?? '').join('\n');
}

const bundlers = { esbuild: bundleWithEsbuild, vite: bundleWithVite };

try {
  for (const name of components) {
    const entry = pkg.exports?.[`./${name}`]?.import;
    if (!entry || !existsSync(join(root, entry))) continue;
    const consumer = join(tmp, `consumer-${name}.js`);
    // 以 bare import 模擬 import '@anchor-ui/core/<name>'（路徑取自 exports 對應的實際檔案）
    writeFileSync(consumer, `import ${JSON.stringify(toPosix(join(root, entry)))};\n`);

    const expected = [...componentDeps(name)].map(tagOf).sort();
    for (const [bundler, bundle] of Object.entries(bundlers)) {
      const tags = [...definedTags(await bundle(consumer))].sort();
      if (JSON.stringify(tags) !== JSON.stringify(expected)) {
        fail(
          `[${bundler}] 只引用 ${name}：預期註冊 ${expected.join(', ')}，實際為 ${tags.join(', ') || '（無）'}`,
        );
      }
    }
  }

  // 全量入口須註冊所有元件
  const fullConsumer = join(tmp, 'consumer-full.js');
  writeFileSync(
    fullConsumer,
    `import ${JSON.stringify(toPosix(join(root, pkg.exports['.'].import)))};\n`,
  );
  const fullTags = [...definedTags(await bundleWithEsbuild(fullConsumer))].sort();
  const allTags = components.map(tagOf).sort();
  if (JSON.stringify(fullTags) !== JSON.stringify(allTags)) {
    fail(`全量入口應註冊 ${allTags.join(', ')}，實際為 ${fullTags.join(', ')}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// ── 4. 發布內容：不得包含測試、stories 與 test-utils ──
const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf-8',
    shell: process.platform === 'win32',
  }),
);
const leaked = packed[0].files
  .map((f) => f.path)
  .filter((p) => /\.test\.|(^|\/)stories\/|(^|\/)test-utils\//.test(p));
if (leaked.length)
  fail(`發布內容包含不應發布的檔案（${leaked.length} 個），例如：${leaked.slice(0, 3).join(', ')}`);

// ── 5. @floating-ui/dom 為 external，不得打包進產物 ──
// 函式名稱會被改寫，改以字串常值判斷：'clippingAncestors' 是 floating-ui 原始碼中的預設邊界值
const distJs = distFiles.filter((f) => f.endsWith('.js'));
const bundledFloating = distJs.filter((f) =>
  /["']clippingAncestors["']/.test(readFileSync(join(root, f), 'utf-8')),
);
if (bundledFloating.length) fail(`@floating-ui/dom 被打包進產物：${bundledFloating.join(', ')}`);
const importsFloating = distJs.some((f) =>
  /from\s*["']@floating-ui\/dom["']/.test(readFileSync(join(root, f), 'utf-8')),
);
if (distJs.length && !importsFloating) fail('產物中找不到對 @floating-ui/dom 的外部 import');

// ── 結果 ──
if (failures.length) {
  console.error(`✗ 套件驗證失敗（${failures.length} 項）：`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `✓ 套件驗證通過：${components.length} 個元件的 exports、sideEffects、Tree-shaking 與發布內容皆正確`,
);
