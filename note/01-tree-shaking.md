# Tree-shaking 與套件副作用 (sideEffects)

> 對應任務：Phase 2 TASK-201「建置架構調整」

## 1. 是什麼

**Tree-shaking** 是打包工具（Vite / Rollup / Rolldown、webpack、esbuild）的最佳化：分析程式實際用到哪些 `export`，把沒用到的程式碼「搖掉」，不放進最終產物。就像搖樹讓枯葉掉落。

```ts
// utils.ts
export function used() {
  /* … */
}
export function unused() {
  /* … */
} // ← 沒人 import，打包時會被移除

// app.ts
import { used } from './utils';
used();
```

## 2. 生效的前提

Tree-shaking 不是自動發生的，需要同時滿足：

| 前提                | 說明                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| **使用 ES Modules** | `import` / `export` 是靜態語法，打包工具在編譯期就能分析相依；CommonJS 的 `require()` 可以動態呼叫，難以分析。 |
| **模組是分開的**    | 打包工具以「模組」為單位判斷去留。若套件發布時已把所有程式合併成一個檔案，消費端就沒有東西可以分開刪除。       |
| **模組沒有副作用**  | 見下一節。                                                                                                     |

## 3. 副作用 (Side Effect) 是什麼

**副作用**：模組「一被載入就會執行、並影響外部」的程式碼。例如：

```ts
// 載入這個檔案就會向瀏覽器註冊 <aui-button>，這就是副作用
customElements.define('aui-button', AuiButton);

// 其他常見副作用
import './styles.css'; // 載入全域樣式
window.myGlobal = 123; // 修改全域物件
Array.prototype.foo = () => {}; // 修改內建原型
```

打包工具無法確定「刪掉這段會不會壞」，所以**只要模組可能有副作用，即使它的 export 沒被用到也會保留整個模組**。

### `package.json` 的 `sideEffects` 欄位

這個欄位用來告訴打包工具「哪些檔案有副作用」，其餘檔案若沒被使用就可以安全刪除：

```jsonc
{
  "sideEffects": false                          // 整個套件都沒有副作用
}
{
  "sideEffects": ["**/*.css", "./dist/button.js"] // 只有這些檔案有副作用
}
```

- 沒有宣告時，打包工具會**保守地假設所有檔案都有副作用**。
- 宣告錯誤（把有副作用的檔案標成無副作用）會導致必要程式被刪掉，例如元件沒被註冊、CSS 沒被載入，這種錯誤只在消費端打包後才會出現，要特別小心。

### `/*#__PURE__*/` 註解

標記「這個函式呼叫沒有副作用，結果沒被使用就可以刪」，常見於打包後的程式碼：

```js
const button = /*#__PURE__*/ createComponent();
```

## 4. Web Component 元件庫的特殊之處

Web Component 必須呼叫 `customElements.define()` 註冊後才能使用，而註冊**本身就是副作用**。因此元件庫通常提供兩種入口：

```ts
import '@anchor-ui/core'; // 全量入口：一次註冊所有元件（簡單，但體積大）
import '@anchor-ui/core/button'; // 個別入口：只註冊 Button（按需載入，體積最小）
```

- 個別入口的檔案「需要」副作用（就是要註冊元件），所以必須列在 `sideEffects` 中。
- 但只要消費端沒有 import 某個元件的入口，那個元件就完全不會進入產物——這就是按需載入的效果。

## 5. 套件端要做的設定

### (1) 建置輸出多個入口

```ts
// vite.config.ts（示意）
build: {
  lib: {
    entry: {
      index: 'src/index.ts',                    // 全量入口
      button: 'src/components/button/index.ts', // 個別入口
      tooltip: 'src/components/tooltip/index.ts',
    },
    formats: ['es'],
  },
}
```

另一種做法是 Rollup / Rolldown 的 `output.preserveModules: true`，保留原始碼的模組結構逐檔輸出。

### (2) `exports` 開放個別入口

```jsonc
"exports": {
  ".":        { "types": "./dist/index.d.ts",  "import": "./dist/index.js" },
  "./button": { "types": "./dist/button.d.ts", "import": "./dist/button.js" }
}
```

`exports` 同時也是「封裝邊界」：沒列出的路徑，消費端無法 import（避免依賴內部檔案）。

### (3) 相依套件設為 external

列在 `dependencies` 的套件（例如 `@floating-ui/dom`）應設為 external，不要打包進自己的產物，交給消費端的打包工具處理，才能與其他套件共用同一份、避免重複。

## 6. 如何驗證

不要只看自己的 `dist/` 大小，要**模擬消費端**打包：

```bash
# 建一個只 import Button 的檔案，用 esbuild 打包後檢查內容
echo "import '@anchor-ui/core/button';" > consumer.js
npx esbuild consumer.js --bundle --format=esm --minify --external:lit --outfile=out.js
gzip -c out.js | wc -c          # 體積
grep -o "aui-[a-z-]*" out.js | sort -u   # 檢查是否混入其他元件的標籤名稱
```

esbuild 的 `--metafile` 搭配 [Bundle Buddy](https://www.bundle-buddy.com/) 或 esbuild 官網的分析工具，可以看到每個模組佔多少體積。

## 7. 在 Anchor UI 的現況（Phase 1 結束時實測）

消費端只寫 `import { AuiButton } from '@anchor-ui/core'`：

| 情況                          | gzip 體積                                          |
| ----------------------------- | -------------------------------------------------- |
| 單獨打包 Button               | 3.2 KB                                             |
| 透過目前的單一入口引用 Button | **20.8 KB**（Tag、Tooltip、IconButton 全部被帶入） |

原因：只有單一入口 `dist/index.js`、元件載入即註冊（副作用）、沒有宣告 `sideEffects`、`exports` 只有 `"."`。TASK-201 就是要逐一解決這四點。

## 8. 常見陷阱

- **只做了多入口卻沒做 `exports`**：消費端無法 import 個別入口。
- **`sideEffects: false` 一刀切**：會讓元件的註冊與 CSS 被刪掉，元件變成「未知元素」。
- **入口之間互相 import 全量入口**：例如元件內部 `import '../../index.js'`，會把全部元件又帶回來。
- **共用程式碼被重複打包**：多入口時，被多個元件共用的程式（如 Spinner）應拆成共用 chunk，而不是每個入口各複製一份。

## 參考資料

- MDN：[Tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
- webpack：[Tree Shaking 與 sideEffects](https://webpack.js.org/guides/tree-shaking/)
- Vite：[Library Mode](https://vite.dev/guide/build#library-mode)
- Node.js：[Package entry points (`exports`)](https://nodejs.org/api/packages.html#package-entry-points)
