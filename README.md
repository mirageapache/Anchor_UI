# Anchor UI

> 跨專案前端共用 UI 元件庫（Enterprise Shared Web Component Library）

---

## 專案簡介

Anchor UI 是一套以 **Web Component (Lit)** 為核心實作的跨框架共用元件庫。旨在提供單一視覺與互動標準，可無縫整合至 **Vue 3、Angular、React** 或純 HTML 應用中，無需為各框架重複造輪子。

### 核心特性

- **框架無關 (Framework-Agnostic)**：基於瀏覽器標準 Custom Elements，一份代碼跨框架共用。
- **純 CSS Custom Properties Tokens**：樣式核心完全與邏輯解耦，任何專案皆可單獨引入 Tokens。
- **無縫雙主題 (Light / Dark)**：由 `<html>` 的 `data-theme="dark"` 屬性驅動，執行期平滑過渡（`200ms ease`）。
- **輕量解耦**：不綁定整頁版型容器，抽屜（Drawer）、導覽列（Navbar）、頁尾（Footer）、彈窗（Modal / Alert）皆為獨立模組。

### 元件一覽

每個元件都可從個別入口按需載入（`import '@anchor-ui/core/<入口>'`），用法、範例與 API 表（屬性、事件、slot、CSS part）見[線上 Storybook](https://mirageapache.github.io/Anchor_UI/) 各元件的 Docs 頁。

| 分類 | 元件                                                         | 標籤                                                                                           | 入口                                                                   |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 基礎 | 按鈕、圖示按鈕、標籤、鍵帽                                   | `aui-button`、`aui-icon-button`、`aui-tag`、`aui-kbd`                                          | `button`、`icon-button`、`tag`、`kbd`                                  |
| 表單 | 輸入框、欄位、分段控制器、輸出框                             | `aui-input`、`aui-field`、`aui-segmented`、`aui-output`                                        | `input`、`field`、`segmented`、`output`                                |
| 浮層 | 提示氣泡、通知、彈窗、確認對話框                             | `aui-tooltip`、`aui-toast`、`aui-modal`、`aui-alert`                                           | `tooltip`、`toast`、`modal`、`alert`                                   |
| 複合 | 卡片、摺疊面板、檔案拖放區、收藏鈕、工具頁標頭、程式碼檢視區 | `aui-card`、`aui-accordion`、`aui-dropzone`、`aui-favorite-btn`、`aui-header`、`aui-code-view` | `card`、`accordion`、`dropzone`、`favorite-btn`、`header`、`code-view` |
| 導覽 | 側邊抽屜、頂部導覽列、頁尾                                   | `aui-drawer`、`aui-navbar`、`aui-footer`                                                       | `drawer`、`navbar`、`footer`                                           |

Toast 與 Alert 另有程式呼叫的服務：`ToastService`（`@anchor-ui/core/toast`）、`AlertService`（`@anchor-ui/core/alert`）。

---

## 技術架構

| 層級              | 技術選型                                      | 說明                                               |
| ----------------- | --------------------------------------------- | -------------------------------------------------- |
| **核心技術**      | [Lit 3](https://lit.dev/)                     | 輕量且標準的 Web Component 開發框架                |
| **程式語言**      | [TypeScript](https://www.typescriptlang.org/) | 嚴格型別定義、裝飾器語法支援                       |
| **Design Tokens** | Pure SCSS / CSS Variables                     | 色彩、字體、間距、圓角與動態單一事實來源           |
| **打包工具**      | [Vite](https://vitejs.dev/) (Library Mode)    | 產出標準 ESM 模組、`.d.ts` 型別宣告與獨立 CSS      |
| **元件預覽**      | [Storybook 10](https://storybook.js.org/)     | 元件展示、文件化與深淺主題互動測試                 |
| **代碼品質**      | ESLint + Stylelint + Prettier                 | TypeScript、Lit 範本與 SCSS 樣式靜態檢查           |
| **Git 防線**      | Husky + lint-staged + Commitlint              | Pre-commit 自動檢查修復、Conventional Commits 規範 |

---

## 專案結構

```text
Anchor_UI/
├── .github/workflows/ci.yml     # GitHub Actions 基礎 CI
├── .husky/                      # Git Hooks (pre-commit, commit-msg)
├── .storybook/                  # Storybook 配置與雙主題切換工具列
├── doc/                         # 規格規劃文件
│   ├── anchor-ui-spec.md        # 架構規格規劃
│   ├── design-system.md         # 樣式系統與 Design Tokens 字典
│   ├── anchor-ui-components-list.md # 共用元件規格清單
│   ├── anchor-ui-development-schedule.md # Phase 0 ~ 4 開發排程
│   ├── anchor-ui-release-guide.md # 發布流程（release-please）
│   └── anchor-ui-upgrade-guide.md # 升級遷移手冊（給使用端）
├── src/
│   ├── tokens/                  # Design Tokens (色彩、文字、間距、圓角、動態)
│   ├── base/                    # 全域基底 (Reset、Focus 環、Utilities)
│   ├── components/              # Web Components 元件實作（每個資料夾一個元件）
│   ├── stories/                 # Storybook 視覺展示頁
│   ├── env.d.ts                 # 型別環境宣告
│   ├── index.ts                 # 套件主入口
│   └── styles.scss              # 全域總樣式入口
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── vite.config.ts
```

---

## 快速開始

### 1. 安裝相依套件

本專案使用 `pnpm` 進行套件管理：

```bash
pnpm install
```

### 2. 開發與預覽

啟動 Storybook 互動展示站台（內建 Light / Dark 主題切換工具列）：

```bash
pnpm storybook
```

啟動 Vite 本地開發伺服器：

```bash
pnpm dev
```

### 3. 套件打包建置

編譯輸出至 `dist/`（包含 ESM 腳本、型別定義與獨立樣式檔）：

```bash
pnpm build
```

建置 Storybook 靜態文件庫：

```bash
pnpm build-storybook
```

驗證建置產物（Tree-shaking、`exports` / `sideEffects` 設定與發布內容，需先 `pnpm build`）：

```bash
pnpm verify:package
```

---

## 在其他專案中導入 (Installation)

> 套件透過 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 附上的 tarball 發布（不在 npm registry 上）。以下以 `v0.3.0` 為例，換成需要的版本即可。

### 1. 前置需求

- **需要打包工具**（Vite、Angular CLI、webpack 等）：套件為純 ESM，並以 bare import 引用 `lit`，需由打包工具解析，無法直接用 `<script>` 載入 `dist/`。
- **TypeScript** 的 `moduleResolution` 需為 `"bundler"`、`"node16"` 或 `"nodenext"`，才能解析 `@anchor-ui/core/button` 這類子路徑入口（Vite 與 Angular 新專案的預設值皆符合）。

### 2. 安裝

直接以 Release 附檔的網址安裝（repo 為公開，不需登入）：

```bash
npm install https://github.com/mirageapache/Anchor_UI/releases/download/v0.3.0/anchor-ui-core-0.3.0.tgz
# 或
pnpm add https://github.com/mirageapache/Anchor_UI/releases/download/v0.3.0/anchor-ui-core-0.3.0.tgz
```

- `package.json` 的相依會記錄成這個網址，其他人 `npm install` 時會下載同一個檔案；`lit` 與 `@floating-ui/dom` 會一併自動安裝。
- `v0.2.0-beta`（含）以前的 tarball 帶有本元件庫開發用的 `prepare: husky` 腳本，安裝時套件管理器可能提示有腳本待核准（npm `install-scripts`、pnpm「Ignored build scripts」）：**不需核准**，消費端用不到。之後的版本已不含此腳本。
- 也可以先下載 tarball 再安裝：`gh release download v0.3.0 --repo mirageapache/Anchor_UI --pattern "*.tgz"`，接著 `npm install ./anchor-ui-core-0.3.0.tgz`。這種做法需把 `.tgz` 提交進專案，否則其他人安裝不到。

### 3. 載入樣式與字型

在應用程式進入點載入**其中一個**樣式檔：

| 檔案                         | 內容                                                                                                | 何時使用                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `@anchor-ui/core/styles.css` | Design Tokens + 全域 reset 與基礎樣式（`box-sizing`、`margin: 0`、`body` 字型與背景色、focus 樣式） | 新專案（推薦）                       |
| `@anchor-ui/core/tokens.css` | 只有 Design Tokens（CSS 變數，含深色主題）                                                          | 既有專案已有自己的 reset，不想被覆蓋 |

```ts
// main.ts
import '@anchor-ui/core/styles.css';
```

- `styles.css` 已包含 tokens，不需要再載入 `tokens.css`。
- SCSS 專案也可改用原始碼：`@use '@anchor-ui/core/tokens';`、`@use '@anchor-ui/core/reset';`。
- 字型檔不隨套件提供，請依 [字體載入](#字體載入-font-loading) 自行引入 Inter 與 JetBrains Mono，否則會退回系統字型。
- TypeScript 專案若對 CSS import 報 `TS2882`（找不到型別宣告），代表缺少 `/// <reference types="vite/client" />`；Vite 範本預設已有（`src/vite-env.d.ts`）。

### 4. 註冊元件

```ts
// 方式 A — 按需載入（推薦）：只註冊用到的元件，未引用的元件不會進入打包結果
import '@anchor-ui/core/button';
import '@anchor-ui/core/tooltip';

// 方式 B — 全量載入：一次註冊所有元件
import '@anchor-ui/core';
```

載入後即可在 HTML / 範本中使用 `<aui-button>` 等標籤。

- 元件依賴會自動帶入，例如 `@anchor-ui/core/icon-button` 會一併註冊 `<aui-tooltip>`。元件只會自動註冊自己渲染的元件：`@anchor-ui/core/field` 會帶入 `<aui-icon-button>`，但放進欄位的 `<aui-input>` / `<aui-output>` / `<aui-segmented>` 需另行載入。
- 型別可從全量入口或個別入口取得，例如 `import type { ButtonVariant } from '@anchor-ui/core/button'`。
- 全域服務從各自的入口取得：`import { ToastService } from '@anchor-ui/core/toast'`、`import { AlertService } from '@anchor-ui/core/alert'`。
- 主題切換函式 `setTheme` / `getTheme` / `toggleTheme` 只由全量入口 `@anchor-ui/core` 匯出，引用它們會一併註冊所有元件。只想按需載入時，可直接設定 `document.documentElement.dataset.theme = 'dark'`（移除該屬性即回到淺色）。
- `lit` 與 `@floating-ui/dom` 不打包進元件庫，由消費端的打包工具處理。

### 5. 框架設定（Vue 3 / Angular）

**Vue 3（Vite）**：告訴 Vue 編譯器 `aui-` 開頭的標籤是自訂元素，否則會出現「Failed to resolve component」警告：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: { isCustomElement: (tag) => tag.startsWith('aui-') },
      },
    }),
  ],
});
```

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import '@anchor-ui/core/styles.css';
import '@anchor-ui/core/button';

createApp(App).mount('#app');
```

**Angular**：在使用 `aui-` 標籤的元件（或 NgModule）加上 `CUSTOM_ELEMENTS_SCHEMA`，樣式加進 `angular.json`，元件在 `main.ts` 註冊：

```ts
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {}
```

```jsonc
// angular.json → projects.<app>.architect.build.options
"styles": ["node_modules/@anchor-ui/core/dist/styles.css", "src/styles.css"]
```

```ts
// src/main.ts
import '@anchor-ui/core/button';
```

完整可執行的設定可參考 [`examples/vue3`](examples/vue3) 與 [`examples/angular`](examples/angular)。

### 6. 在 Vue / Angular 中綁定表單元件

`<aui-input>` 與 `<aui-segmented>` 會在 host 上分派原生 `input` / `change`（觸發時 `value` 已更新），可直接使用框架的雙向綁定：

```html
<!-- Vue 3：於 vite.config 以 compilerOptions.isCustomElement 排除 aui- 前綴後即可使用 v-model（含 .lazy 與輸入法組字） -->
<aui-input v-model="text"></aui-input>
<aui-segmented v-model="mode" :options="modes"></aui-segmented>

<!-- Angular：自訂元素需加上 ngDefaultControl，才會套用內建的 DefaultValueAccessor -->
<aui-input name="text" [(ngModel)]="text" ngDefaultControl required></aui-input>
<aui-segmented [formControl]="mode" [options]="modes" ngDefaultControl></aui-segmented>
```

- Angular 的驗證器（如 `required`）、touched 狀態與 `control.disable()` 皆可運作；其他事件請直接綁定原生 `(change)` 或 `aui-` 前綴的自訂事件。
- 與原生 `<input>` 相同，同一個元素不可同時設定 `value` 屬性與 `v-model`。
- 以 Vitest + happy-dom 測試 Angular 時，zone.js 無法正確包裝 happy-dom 的 `MutationObserver`，需在 zone.js 之前載入修正（參考 `examples/angular/src/test-setup-happy-dom.ts`）。happy-dom 也不會把 Shadow DOM 內的事件 retarget 到 host，輸入法組字這類依賴 `event.target` 的行為請在真實瀏覽器驗證。

### 7. 監聽 `aui-` 自訂事件

`aui-show` / `aui-hide` / `aui-after-show` / `aui-after-hide` 等事件皆會冒泡並穿出 Shadow DOM（`bubbles` + `composed`），以便在外層統一監聽。代價是**內層元件的同名事件也會傳到外層**：例如 Modal 內容中的 Tooltip（包含 `<aui-icon-button>`、`<aui-field>` 複製鈕的提示）或巢狀 Modal 關閉時，外層 Modal 的 `aui-hide` 監聽器同樣會收到，且這些事件不一定帶有 `detail.reason`。只處理元件自身的事件時，請先比對事件來源：

```ts
modal.addEventListener('aui-hide', (event) => {
  if (event.target !== event.currentTarget) return; // 來自內層的 Tooltip / Modal
  console.log((event as CustomEvent<{ reason: string }>).detail.reason);
});
```

### 8. 升級版本

到 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 查看新版本的變更說明，再以新版本的網址重新安裝：

```bash
npm install https://github.com/mirageapache/Anchor_UI/releases/download/v0.3.0/anchor-ui-core-0.3.0.tgz
```

- 以網址安裝的相依不會被 `npm update` 自動升級，版本完全由網址決定，需手動更換。
- `v1.0.0` 之前屬於 `0.x` 階段，任何版本都可能有不相容的變更，升級後請重新建置並檢查畫面。
- 版本規則、升級後的檢查清單與各版本需要注意的變更見 [升級遷移手冊](doc/anchor-ui-upgrade-guide.md)。

---

## 常用命令 (Scripts)

**建置與產物檢查**

| 指令                  | 說明                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `pnpm build`          | 編譯至 `dist/`：全量入口 `index.js`、各元件入口 `components/<name>/index.js`、型別定義、`styles.css`、`tokens.css` |
| `pnpm verify:package` | 驗證建置產物的 `exports`／`sideEffects`、型別宣告、Tree-shaking 與發布內容（需先 build）                           |
| `pnpm size`           | 以 size-limit 檢查各元件入口的 gzip 體積是否超出預算（需先 build，設定見 `.size-limit.mjs`）                       |
| `pnpm sync:package`   | 依 `src/components` 重新產生 `package.json` 中元件的 `exports` 與 `sideEffects`（新增或移除元件後執行）            |
| `pnpm check:versions` | 檢查 Playwright 映像與套件版本、pnpm 版本（`packageManager`）是否一致                                              |

**測試**

| 指令                                              | 說明                                                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm test`                                       | 元件與共用模組的單元、無障礙測試（`src/components`、`src/internal`；不含視覺回歸）                        |
| `pnpm test:coverage`                              | 同上並產生覆蓋率報告（門檻：statements／functions／lines 85%、branches 75%）                              |
| `pnpm test:a11y`                                  | 只執行 `*.a11y.test.ts` 的 axe-core 無障礙檢測（需先 build）                                              |
| `pnpm test:visual:docker`                         | 在 Playwright 官方 Docker 映像中執行視覺回歸測試（淺色／深色主題截圖比對）                                |
| `pnpm test:visual:docker:update`                  | 同上，但更新基準圖（`screenshots/Chromium/baseline/`），並列出變更、產生 before／after／diff 供提交前檢視 |
| `pnpm test:vue` / `pnpm test:angular`             | Vue 3 / Angular 範例專案的整合測試（需先 build）                                                          |
| `pnpm typecheck:examples` / `pnpm build:examples` | 範例專案的型別檢查與正式建置（Vue SFC 編譯、Angular AOT；需先 build），建置後檢查產物確實包含所有元件     |
| `pnpm test:storybook`                             | 以 Vitest（@storybook/addon-vitest）在 Chromium 中執行所有 story 與 play function 互動情境                |

**發布**

| 指令                  | 說明                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm release:verify` | 檢查版號是否為合法 SemVer；`--tag v<版號>` 檢查與 tag 一致，`--all-tags` 檢查所有既有 tag                                          |
| `pnpm release:pack`   | 發布預演：建置 → 套件驗證 → 體積 → 版號檢查 → 產出 tarball 至 `release/`（不含安裝時會執行的生命週期腳本）                         |
| `pnpm smoke`          | 跨框架冒煙測試：以 tarball 安裝到 `smoke/` 的 Vue 3 / Angular 專案並做型別檢查與正式建置（需先 build；可指定 `vue3` 或 `angular`） |
| `pnpm test:scripts`   | 部署腳本的測試（`scripts/*.test.mjs`：gh-pages 發布與 PR 預覽留言，對本機暫存 repo 與假 API 驗證）                                 |

**開發與程式碼品質**

| 指令                                    | 說明                                                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm storybook`                        | 啟動 Storybook 開發環境 (預設 port: 6006)                                                                              |
| `pnpm build-storybook`                  | 建置 Storybook 靜態部署產物至 `storybook-static/`                                                                      |
| `pnpm analyze`                          | 由元件的 JSDoc 產生 `custom-elements.json`（Storybook Docs 頁的 API 表；上面兩個指令與 `test:storybook` 會先自動執行） |
| `pnpm typecheck`                        | 執行 TypeScript 靜態型別檢驗 (`tsc --noEmit`)                                                                          |
| `pnpm lint` / `pnpm lint:fix`           | 執行 ESLint 檢查（及自動修復）TypeScript 與 Lit 語法                                                                   |
| `pnpm stylelint` / `pnpm stylelint:fix` | 執行 Stylelint 檢查（及自動修復）SCSS 變數與樣式規範                                                                   |
| `pnpm format:check` / `pnpm format`     | 檢查（及自動格式化）程式碼排版 (Prettier)                                                                              |
| `pnpm yalc:publish`                     | 建置並發布至本機 yalc store                                                                                            |
| `pnpm yalc:push`                        | 建置並推送更新至所有已 `yalc add` 的專案                                                                               |
| `pnpm dev:yalc`                         | 監聽 `src/`，變更時自動建置並 `yalc push`                                                                              |

---

## 本地開發工作流 (yalc)

在不發布到 npm 的情況下，於真實的 Vue 3 / Angular 專案測試本套件：

```bash
# 1. 在 Anchor_UI 發布到本機 store（會先 build）
pnpm yalc:publish

# 2. 在消費端專案安裝（寫入 file:.yalc/@anchor-ui/core）
cd ../my-app && npx yalc add @anchor-ui/core && pnpm install

# 3. 回到 Anchor_UI，持續監聽並推送更新
pnpm dev:yalc          # 或手動：pnpm yalc:push
```

- 消費端的 dev server（Vite / Angular）偵測到 `node_modules/@anchor-ui/core` 變更後會自動重新載入。
- 若 Vite 預打包快取未更新，請於消費端執行 `vite --force`。
- 結束後以 `npx yalc remove @anchor-ui/core`（或 `--all`）還原依賴，避免把 `file:.yalc` 提交進版控。
- `.yalc/` 與 `yalc.lock` 已列入 `.gitignore`。

---

## 線上文件與 PR 預覽

Storybook 由 `.github/workflows/storybook-preview.yml` 自動部署到 GitHub Pages：

- **線上元件文件**（`main` 的最新內容）：<https://mirageapache.github.io/Anchor_UI/>
- **PR 預覽**：以 `main` 為目標的 PR 會自動部署到 `…/pr-preview/pr-<編號>/`，並在 PR 留言連結；PR 關閉後自動移除。

啟用方式、限制（來自 fork 的 PR 沒有預覽）與常見狀況見 [`note/07-deployment.md`](note/07-deployment.md) 第 6 節。

---

## 版本與發布

- 版號遵循 SemVer，每個 Phase 先發布 `-beta` 預覽版，測試通過後再發布正式版（例如 `v0.3.0-beta` → `v0.3.0`）。
- 發布由 [release-please](https://github.com/googleapis/release-please) 自動化：變更合併進 `main` 後，會依 Conventional Commits 自動開啟或更新一個 release PR（版號與 `CHANGELOG.md`）；合併該 PR 即自動打 tag，並建立附上 tarball 的 [GitHub Release](https://github.com/mirageapache/Anchor_UI/releases)。
- 完整流程、預覽版切換為正式版的方式與檢查清單見 [`doc/anchor-ui-release-guide.md`](doc/anchor-ui-release-guide.md)。

---

## 字體載入 (Font Loading)

> **重要**：本套件僅定義字型 Tokens（CSS Custom Properties），**不自動載入字體檔案**。消費端需自行引入以下字型，否則將降級至系統預設字體。

### 方式 A — Google Fonts CDN（HTML `<head>`）

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### 方式 B — npm 套件（推薦用於 Vue / React 等 Bundler 專案）

```bash
pnpm add @fontsource/inter @fontsource/jetbrains-mono
```

```ts
// main.ts / main.js
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
```

---

## ESM-Only 說明

本套件以**純 ESM 格式**發佈（`"type": "module"`）。Lit / Web Components 本身即 ESM-native，不提供 CommonJS 輸出。

若消費端使用 CommonJS 環境（如部分 Jest / Angular SSR 設定），請在 bundler 設定中將 `@anchor-ui/core` 加入 `esmExternals` 或轉換清單（例如 Vite 的 `ssr.noExternal`）。

---

## 相關規劃文件

詳細架構、樣式字典與排程請參考 `doc/` 目錄：

- [架構規格規劃書 (`anchor-ui-spec.md`)](doc/anchor-ui-spec.md)
- [樣式系統與 Design Tokens 字典 (`design-system.md`)](doc/design-system.md)
- [共用元件規格清單 (`anchor-ui-components-list.md`)](doc/anchor-ui-components-list.md)
- [開發排程與里程碑 (`anchor-ui-development-schedule.md`)](doc/anchor-ui-development-schedule.md)
- [發布流程 (`anchor-ui-release-guide.md`)](doc/anchor-ui-release-guide.md)
- [升級遷移手冊 (`anchor-ui-upgrade-guide.md`)](doc/anchor-ui-upgrade-guide.md)

---

## 授權 (License)

本專案以 [MIT License](./LICENSE) 授權，Copyright (c) 2026 mirageapache。發布的套件（GitHub Release 的 tarball）也附有同一份 `LICENSE`。
