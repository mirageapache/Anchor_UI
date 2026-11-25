# Anchor UI

<p>
  <a href="https://github.com/mirageapache/Anchor_UI/actions/workflows/ci.yml"><img src="https://github.com/mirageapache/Anchor_UI/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
  <a href="https://github.com/mirageapache/Anchor_UI/releases/latest"><img src="https://img.shields.io/github/v/release/mirageapache/Anchor_UI?sort=semver" alt="Release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/mirageapache/Anchor_UI" alt="License: MIT" /></a>
  <a href="https://mirageapache.github.io/Anchor_UI/"><img src="https://img.shields.io/badge/docs-Storybook-ff4785?logo=storybook&logoColor=white" alt="Storybook" /></a>
</p>

> 跨專案前端共用 UI 元件庫（Enterprise Shared Web Component Library）

Anchor UI 是一套以 **Web Component（[Lit](https://lit.dev/)）** 實作的跨框架共用元件庫，提供單一的視覺與互動標準，可直接用在 **Vue 3、Angular、React** 或純 HTML 應用中，不必為每個框架各寫一套元件。

**線上元件文件**：<https://mirageapache.github.io/Anchor_UI/>（Storybook：每個元件的範例、互動展示與 API 表）

---

## 核心特性

- **框架無關**：基於瀏覽器標準的 Custom Elements，同一份元件在各框架中共用。
- **按需載入**：每個元件都有獨立入口，只打包用到的元件。
- **Design Tokens**：色彩、字體、間距、圓角與動態皆為 CSS 變數，可單獨引入，也可覆寫成自己的品牌樣式。
- **深淺雙主題**：由 `<html data-theme="dark">` 切換，執行期平滑過渡。
- **無障礙**：鍵盤操作、焦點管理與螢幕閱讀器標示皆經 axe-core 檢測，文字對比符合 WCAG AA。
- **表單整合**：輸入類元件為 form-associated custom element，可參與原生 `<form>` 提交、驗證與重設，也支援 Vue `v-model` 與 Angular 表單。
- **輕量解耦**：不綁定整頁版型，抽屜、導覽列、頁尾、彈窗皆為獨立元件，可自由組合。
- **TypeScript**：附完整型別宣告。

---

## 元件一覽

每個元件都可從個別入口按需載入（`import '@anchor-ui/core/<入口>'`），用法與 API 表（屬性、事件、slot、CSS part）見[線上文件](https://mirageapache.github.io/Anchor_UI/)各元件的 Docs 頁。

| 分類 | 元件                                                         | 標籤                                                                                           | 入口                                                                   |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 基礎 | 按鈕、圖示按鈕、標籤、鍵帽                                   | `aui-button`、`aui-icon-button`、`aui-tag`、`aui-kbd`                                          | `button`、`icon-button`、`tag`、`kbd`                                  |
| 表單 | 輸入框、欄位、分段控制器、輸出框                             | `aui-input`、`aui-field`、`aui-segmented`、`aui-output`                                        | `input`、`field`、`segmented`、`output`                                |
| 浮層 | 提示氣泡、通知、彈窗、確認對話框                             | `aui-tooltip`、`aui-toast`、`aui-modal`、`aui-alert`                                           | `tooltip`、`toast`、`modal`、`alert`                                   |
| 複合 | 卡片、摺疊面板、檔案拖放區、收藏鈕、工具頁標頭、程式碼檢視區 | `aui-card`、`aui-accordion`、`aui-dropzone`、`aui-favorite-btn`、`aui-header`、`aui-code-view` | `card`、`accordion`、`dropzone`、`favorite-btn`、`header`、`code-view` |
| 導覽 | 側邊抽屜、頂部導覽列、頁尾                                   | `aui-drawer`、`aui-navbar`、`aui-footer`                                                       | `drawer`、`navbar`、`footer`                                           |

Toast 與 Alert 另有以程式呼叫的服務：`ToastService`（`@anchor-ui/core/toast`）、`AlertService`（`@anchor-ui/core/alert`）。

---

## 在其他專案中導入 (Installation)

> 套件以 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 附上的 tarball 發布（不在 npm registry 上）。以下以 `v1.0.0` 為例，換成需要的版本即可。

### 1. 前置需求

- **需要打包工具**（Vite、Angular CLI、webpack 等）：套件為純 ESM，並以 bare import 引用 `lit`，需由打包工具解析，無法直接用 `<script>` 載入。
- **TypeScript** 的 `moduleResolution` 需為 `"bundler"`、`"node16"` 或 `"nodenext"`，才能解析 `@anchor-ui/core/button` 這類子路徑入口（Vite 與 Angular 新專案的預設值皆符合）。
- **ESM-only**：不提供 CommonJS 輸出。在 CommonJS 環境（如部分 Jest / SSR 設定）中，請把 `@anchor-ui/core` 加入打包工具的轉換清單（例如 Vite 的 `ssr.noExternal`）。

### 2. 安裝

直接以 Release 附檔的網址安裝（repo 為公開，不需登入）：

```bash
npm install https://github.com/mirageapache/Anchor_UI/releases/download/v1.0.0/anchor-ui-core-1.0.0.tgz
# 或
pnpm add https://github.com/mirageapache/Anchor_UI/releases/download/v1.0.0/anchor-ui-core-1.0.0.tgz
```

- `package.json` 的相依會記錄成這個網址，其他人安裝時會下載同一個檔案；`lit` 與 `@floating-ui/dom` 會一併自動安裝。
- 也可以先下載 tarball 再安裝：`gh release download v1.0.0 --repo mirageapache/Anchor_UI --pattern "*.tgz"`，接著 `npm install ./anchor-ui-core-1.0.0.tgz`。這種做法需把 `.tgz` 提交進專案，否則其他人安裝不到。

### 3. 載入樣式

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
- TypeScript 專案若對 CSS import 報 `TS2882`（找不到型別宣告），代表缺少 `/// <reference types="vite/client" />`；Vite 範本預設已有（`src/vite-env.d.ts`）。

### 4. 載入字型

套件只定義字型的 tokens，**不附字型檔**。請自行引入 Inter 與 JetBrains Mono，否則會退回系統字型。

方式 A — npm 套件（打包工具專案推薦）：

```bash
npm install @fontsource/inter @fontsource/jetbrains-mono
```

```ts
// main.ts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
```

方式 B — Google Fonts（HTML `<head>`）：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### 5. 註冊元件

```ts
// 方式 A — 按需載入（推薦）：只註冊用到的元件，未引用的元件不會進入打包結果
import '@anchor-ui/core/button';
import '@anchor-ui/core/tooltip';

// 方式 B — 全量載入：一次註冊所有元件
import '@anchor-ui/core';
```

載入後即可在 HTML / 範本中使用 `<aui-button>` 等標籤：

```html
<aui-button variant="primary">送出</aui-button>
```

- 元件會自動註冊自己內部用到的元件，例如 `@anchor-ui/core/icon-button` 會一併註冊 `<aui-tooltip>`。但放進其他元件裡的元件需另行載入：`@anchor-ui/core/field` 不會註冊放在欄位中的 `<aui-input>` / `<aui-output>` / `<aui-segmented>`。
- 型別可從全量入口或個別入口取得，例如 `import type { ButtonVariant } from '@anchor-ui/core/button'`。
- 全域服務從各自的入口取得：`import { ToastService } from '@anchor-ui/core/toast'`、`import { AlertService } from '@anchor-ui/core/alert'`。

### 6. 框架設定（Vue 3 / Angular）

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

**在 Vue 範本中綁定屬性**：Vue 只在元素上有**同名 property** 時直接設定 property，否則寫成 HTML attribute，而 `false` 會寫成字串 `"false"`。元件的布林屬性只看 attribute 是否存在，因此多字的布林屬性以 kebab-case 動態綁定 `false` 時，會被當成 **true**：

```html
<!-- ✗ 寫成 attribute full-width="false"，按鈕仍是全寬 -->
<aui-button :full-width="isWide">送出</aui-button>

<!-- ✓ 以下三種寫法都會正確設定 false -->
<aui-button :fullWidth="isWide">送出</aui-button>
<aui-button :full-width.camel="isWide">送出</aui-button>
<aui-button :full-width="isWide || null">送出</aui-button>
```

- 動態綁定多字的屬性時一律使用 camelCase（或 `.camel` 修飾符）。注意 `.prop` 不會轉換名稱，`:full-width.prop` 設定的是名為 `full-width` 的 property，元件讀不到。
- 單字的屬性（`:disabled`、`:open`）與陣列 / 物件屬性（`:options`、`:columns`）元素上都有同名 property，直接綁定即可。
- 靜態寫在範本中的布林屬性（`<aui-button full-width>`）不受影響。

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

完整可執行的設定可參考 [`examples/vue3`](examples/vue3) 與 [`examples/angular`](examples/angular)；Angular SSR 見[伺服器端渲染](#10-伺服器端渲染angular-ssr)。

### 7. 綁定表單元件

`<aui-input>` 與 `<aui-segmented>` 會在元件上分派原生 `input` / `change`（觸發時 `value` 已更新），可直接使用框架的雙向綁定：

```html
<!-- Vue 3：設定 isCustomElement 後即可使用 v-model（含 .lazy 與輸入法組字） -->
<aui-input v-model="text"></aui-input>
<aui-segmented v-model="mode" :options="modes"></aui-segmented>

<!-- Angular：自訂元素需加上 ngDefaultControl，才會套用內建的 DefaultValueAccessor -->
<aui-input name="text" [(ngModel)]="text" ngDefaultControl required></aui-input>
<aui-segmented [formControl]="mode" [options]="modes" ngDefaultControl></aui-segmented>
```

- 也可以直接放在原生 `<form>` 中：值會隨表單提交，`required` 等驗證、`form.reset()` 與 `<fieldset disabled>` 皆有效，單行輸入框按 Enter 會送出表單。
- Angular 的驗證器（如 `required`）、touched 狀態與 `control.disable()` 皆可運作；其他事件請直接綁定原生 `(change)` 或 `aui-` 前綴的自訂事件。
- 與原生 `<input>` 相同，同一個元素不可同時設定 `value` 屬性與 `v-model`。
- 以 Vitest + happy-dom 測試 Angular 時，zone.js 無法正確包裝 happy-dom 的 `MutationObserver`，需在 zone.js 之前載入修正（參考 [`examples/angular/src/test-setup-happy-dom.ts`](examples/angular/src/test-setup-happy-dom.ts)）。happy-dom 也不會把 Shadow DOM 內的事件 retarget 到元件本身，輸入法組字這類依賴 `event.target` 的行為請在真實瀏覽器驗證。

### 8. 切換主題

```ts
import { setTheme, toggleTheme } from '@anchor-ui/core';

setTheme('dark'); // 或 'light'
toggleTheme();
```

- `setTheme` / `getTheme` / `toggleTheme` 只由全量入口 `@anchor-ui/core` 匯出，引用它們會一併註冊所有元件。只想按需載入時，可直接設定 `document.documentElement.dataset.theme = 'dark'`（移除該屬性即回到淺色）。
- `<aui-navbar>` 內建主題切換開關，會跟著 `<html data-theme>` 同步。

### 9. 監聽 `aui-` 自訂事件

元件的自訂事件皆以 `aui-` 開頭，會冒泡並穿出 Shadow DOM（`bubbles` + `composed`），方便在外層統一監聽。代價是**內層元件的同名事件也會傳到外層**：例如 Modal 內容中的 Tooltip（包含 `<aui-icon-button>`、`<aui-field>` 複製鈕的提示）或巢狀 Modal 關閉時，外層 Modal 的 `aui-hide` 監聽器同樣會收到，且這些事件不一定帶有 `detail.reason`。只處理元件自身的事件時，請先比對事件來源：

```ts
modal.addEventListener('aui-hide', (event) => {
  if (event.target !== event.currentTarget) return; // 來自內層的 Tooltip / Modal
  console.log((event as CustomEvent<{ reason: string }>).detail.reason);
});
```

### 10. 伺服器端渲染（Angular SSR）

伺服器端只輸出元件的標籤、attribute 與標籤內的文字，瀏覽器載入元件庫後才升級為完整的元件（建立 Shadow DOM、套用樣式）；Angular 的 hydration 會沿用伺服器輸出的 DOM。元件內部（Shadow DOM）不在伺服器端渲染，因此 JS 載入前的畫面與搜尋引擎只看得到標籤內的文字。

- **載入元件庫**：在元件檔或 `main.ts` import 都可以，伺服器端 import 不會出錯（Lit 在 Node 會提供最小的 `HTMLElement` / `customElements` 實作）。
- **屬性綁定**：範本中的靜態 attribute（`variant="primary"`）會出現在伺服器輸出的 HTML；`[options]`、`[headingLevel]` 這類 property 綁定只在瀏覽器端套用。
- **命令式 API**：`setTheme()`、`ToastService`、`AlertService` 只在瀏覽器端呼叫：放在事件處理中，或頁面載入時放在 `afterNextRender`（只在瀏覽器端執行）。`constructor`、`ngOnInit` 會在伺服器與瀏覽器各執行一次，誤在伺服器端呼叫時：`setTheme()` 與 `ToastService` 不做任何事（由瀏覽器端那一次顯示）；`AlertService` 需要使用者回應，回傳的 Promise 會以「只能在瀏覽器端使用」的錯誤 reject。

```ts
import { afterNextRender, Component } from '@angular/core';
import { setTheme, ToastService } from '@anchor-ui/core';

@Component({/* … */})
export class AppComponent {
  constructor() {
    afterNextRender(() => {
      setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
      ToastService.info('歡迎回來');
    });
  }
}
```

- **主題**：`setTheme()` 不會影響伺服器輸出的 `<html>`，深色主題的使用者會先看到淺色頁面，hydration 後才切換。要避免時，在伺服器端渲染時就設定 `<html>` 的 `data-theme`（例如依 cookie 透過 Angular 的 `DOCUMENT` 設定）。
- **升級前的版面**：元件 JS 載入前，標籤內的文字會以未套用樣式的狀態顯示。可以先隱藏尚未升級的元件，但請逐一列出標籤：單獨的 `:not(:defined)` 也會選到 `<app-root>` 等 Angular 元件（它們不是自訂元素），整個頁面都會被隱藏。

```css
aui-button:not(:defined),
aui-card:not(:defined) {
  visibility: hidden;
}
```

- **伺服器的 Host 檢查**：Angular 19.2 起，SSR 伺服器只接受 `angular.json` 的 `security.allowedHosts` 中列出的 Host，其他 Host 的請求會改為客戶端渲染（伺服器 log 出現 `Header "host" … is not allowed`），與元件庫無關。

完整可執行的設定可參考 [`smoke/angular-ssr`](smoke/angular-ssr)（CI 中以 tarball 安裝並檢查伺服器輸出與 hydration）。

---

## 升級版本

到 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 查看新版本的變更說明，再以新版本的網址重新安裝。

- 以網址安裝的相依不會被 `npm update` 自動升級，版本完全由網址決定，需手動更換。
- 版號遵循 SemVer；`-beta` 結尾的是預覽版，正式專案請使用正式版。
- 版本規則、升級後的檢查清單與各版本需要注意的變更見[升級遷移手冊](doc/anchor-ui-upgrade-guide.md)。

---

## 參與開發

專案結構、開發與建置指令、測試與發布流程見[開發指南](doc/development.md)。

---

## 授權 (License)

本專案以 [MIT License](./LICENSE) 授權，Copyright (c) 2026 mirageapache。發布的套件（GitHub Release 的 tarball）也附有同一份 `LICENSE`。
