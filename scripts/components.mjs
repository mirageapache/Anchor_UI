// 元件清單的唯一來源：src/components 下具 index.ts 的資料夾即為一個元件（個別入口 @anchor-ui/core/<name>）。
// 供 vite.config.ts、.size-limit.mjs、scripts/verify-package.mjs、scripts/sync-package-entries.mjs 共用。
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} root 專案根目錄
 * @returns {string[]} 元件名稱（資料夾名稱），依字母排序
 */
export function listComponents(root) {
  const dir = join(root, 'src/components');
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'index.ts')))
    .map((d) => d.name)
    .sort();
}

/**
 * 依元件清單產生 package.json 中與元件相關的 exports 與 sideEffects。
 * 由 `pnpm sync:package` 寫入 package.json，`pnpm verify:package` 檢查兩者一致。
 *
 * exports 說明：除了 import 之外也提供 default 條件（指向同一個 ESM 檔）。只有 import 時，
 * 不送出 import 條件的解析器（Jest 預設的 CommonJS 模式等）在轉換程式碼之前就會回報找不到模組，
 * 使用端無法靠「把套件加入轉換清單」解決。
 *
 * sideEffects 說明：
 * - "**\/*.scss"：./tokens 與 ./reset 指向 SCSS 原始碼，從 JS 引入時（交給打包工具的 sass loader）不可被移除。
 * - 元件入口（index.js）與註冊元件的模組（<name>.js，呼叫 customElements.define）必須保留。
 * - "./src/**\/*.ts"：sideEffects 也會作用於元件庫自身的建置，缺少時元件之間僅為註冊而寫的
 *   import（如 icon-button 的 import '../tooltip/index.js'）會在建置時被移除；src 不在發布內容中，
 *   對消費端沒有影響。
 *
 * @param {string[]} components
 */
export function componentPackageEntries(components) {
  return {
    exports: Object.fromEntries(
      components.map((name) => [
        `./${name}`,
        {
          types: `./dist/components/${name}/index.d.ts`,
          import: `./dist/components/${name}/index.js`,
          default: `./dist/components/${name}/index.js`,
        },
      ]),
    ),
    sideEffects: [
      '**/*.css',
      '**/*.scss',
      './dist/index.js',
      ...components.flatMap((name) => [
        `./dist/components/${name}/index.js`,
        `./dist/components/${name}/${name}.js`,
      ]),
      './src/**/*.ts',
    ],
  };
}

/** exports 中屬於「元件個別入口」的 key（指向 dist/components/ 者） */
export const isComponentExport = (value) =>
  typeof value === 'object' && String(value?.import ?? '').startsWith('./dist/components/');
