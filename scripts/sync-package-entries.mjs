// 依 src/components 的元件清單，更新 package.json 中元件相關的 exports 與 sideEffects。
// 新增或移除元件後執行 pnpm sync:package；pnpm verify:package 會檢查兩者是否一致。
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { componentPackageEntries, isComponentExport, listComponents } from './components.mjs';

const root = resolve(import.meta.dirname, '..');
const path = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(path, 'utf-8'));
const { exports: componentExports, sideEffects } = componentPackageEntries(listComponents(root));

// exports 順序：全量入口 → 各元件入口 → 其他（CSS、SCSS…），保留非元件項目原樣
const otherExports = Object.entries(pkg.exports).filter(
  ([key, value]) => key !== '.' && !isComponentExport(value),
);
pkg.exports = { '.': pkg.exports['.'], ...componentExports, ...Object.fromEntries(otherExports) };
pkg.sideEffects = sideEffects;

const next = `${JSON.stringify(pkg, null, 2)}\n`;
if (next === readFileSync(path, 'utf-8').replace(/\r\n/g, '\n')) {
  console.log('✓ package.json 的元件 exports / sideEffects 已是最新');
} else {
  writeFileSync(path, next);
  console.log('✓ 已更新 package.json 的元件 exports / sideEffects');
}
