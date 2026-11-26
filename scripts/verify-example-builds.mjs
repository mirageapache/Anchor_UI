// 檢查範例專案（examples/vue3、examples/angular、examples/react）的正式建置結果確實包含應用程式與元件庫。
//   node scripts/verify-example-builds.mjs      於 pnpm build:examples 之後執行
//
// 建置指令成功不代表產物正確：examples/angular 曾因 tsconfig 的 "noEmit": true，
// 讓 AnalogJS 的 Angular 外掛對每個模組輸出空內容，vite build 仍顯示成功，
// 產物卻只有 670 bytes 的 preload polyfill（於 TASK-307 的冒煙測試中發現）。
// 範例專案引用全量入口（import '@anchor-ui/core'），因此建置結果必須註冊所有元件並包含 design tokens。
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { listComponents } from './components.mjs';

const root = resolve(import.meta.dirname, '..');
const EXAMPLES = ['vue3', 'angular', 'react'];

/** 列出目錄下所有檔案（遞迴，回傳絕對路徑） */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

const expectedTags = listComponents(root).map((name) => `aui-${name}`);
/** 各範例的範本中都有的文字：出現在產物中代表應用程式本身（而不只是元件庫）確實被編譯進去 */
const APP_MARKER = 'npm install @anchor-ui/core';
const failures = [];

for (const example of EXAMPLES) {
  const dist = join(root, 'examples', example, 'dist');
  if (!existsSync(dist)) {
    failures.push(`examples/${example}：找不到 dist/（請先執行 pnpm build:examples）`);
    continue;
  }
  const files = listFiles(dist);
  const read = (extension) =>
    files
      .filter((file) => file.endsWith(extension))
      .map((file) => readFileSync(file, 'utf-8'))
      .join('\n');
  const code = read('.js');
  const styles = read('.css');

  const registered = new Set(
    [...code.matchAll(/customElements\.define\(\s*["'`](aui-[\w-]+)["'`]/g)].map(
      (match) => match[1],
    ),
  );
  const missing = expectedTags.filter((tag) => !registered.has(tag));
  if (missing.length) {
    failures.push(
      `examples/${example}：建置結果沒有註冊 ${missing.length} 個元件（${missing.slice(0, 3).join(', ')}…），應用程式可能沒有被編譯進產物`,
    );
  }
  if (!code.includes(APP_MARKER)) {
    failures.push(
      `examples/${example}：建置結果不含應用程式的範本內容（應用程式沒有被編譯進產物）`,
    );
  }
  if (!styles.includes('--color-brand-600')) {
    failures.push(`examples/${example}：建置結果的 CSS 不含 design tokens`);
  }
}

if (failures.length) {
  console.error(`✗ 範例專案建置結果檢查失敗（${failures.length} 項）：`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `✓ 範例專案建置結果正確：${EXAMPLES.join('、')} 皆註冊 ${expectedTags.length} 個元件並包含 design tokens`,
);
