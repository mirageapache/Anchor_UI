import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{M as t,a as n,j as r,o as i,y as a}from"./blocks-CvhZDU21.js";function o(e){let r={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`快速開始`}),`
`,(0,c.jsx)(r.h1,{id:`anchor-ui`,children:`Anchor UI`}),`
`,(0,c.jsxs)(r.p,{children:[`以 `,(0,c.jsx)(r.a,{href:`https://lit.dev/`,rel:`nofollow`,children:`Lit`}),` 實作的跨框架 Web Component 元件庫：一份元件可直接用在 Vue 3、Angular、React 或純 HTML 專案。
樣式由 Design Tokens（CSS 變數）驅動，`,(0,c.jsx)(r.code,{children:`<html data-theme="dark">`}),` 切換深色主題。`]}),`
`,(0,c.jsxs)(r.ul,{children:[`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`左側選單`}),`：每個元件都有一頁 `,(0,c.jsx)(r.strong,{children:`Docs`}),`（說明、所有範例與 API 表），以及可互動調整的 stories。`]}),`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`API 表`}),`由元件原始碼的註解自動產生，列出屬性（property，並註明對應的 HTML attribute）、方法、事件、slot、CSS part，以及元件提供的 CSS 變數。`]}),`
`,(0,c.jsx)(r.li,{children:`右上角的主題切換可預覽深淺兩種主題。`}),`
`]}),`
`,(0,c.jsx)(r.h2,{id:`安裝`,children:`安裝`}),`
`,(0,c.jsxs)(r.p,{children:[`套件透過 `,(0,c.jsx)(r.a,{href:`https://github.com/mirageapache/Anchor_UI/releases`,rel:`nofollow`,children:`GitHub Releases`}),` 的 tarball 發布，以網址安裝
（把 `,(0,c.jsx)(r.code,{children:`<版本>`}),` 換成 Releases 頁面上的版本，例如 `,(0,c.jsx)(r.code,{children:`1.0.0`}),`）：`]}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-bash`,children:`npm install https://github.com/mirageapache/Anchor_UI/releases/download/v<版本>/anchor-ui-core-<版本>.tgz
`})}),`
`,(0,c.jsxs)(r.p,{children:[`需要打包工具（Vite、Angular CLI、webpack 等）；`,(0,c.jsx)(r.code,{children:`lit`}),` 與 `,(0,c.jsx)(r.code,{children:`@floating-ui/dom`}),` 會一併安裝。`]}),`
`,(0,c.jsx)(r.h2,{id:`載入樣式與註冊元件`,children:`載入樣式與註冊元件`}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-ts`,children:`// 應用程式進入點
import '@anchor-ui/core/styles.css'; // Design Tokens + 基礎樣式（已有自己的 reset 時改用 tokens.css）

// 按需載入（推薦）：只註冊用到的元件
import '@anchor-ui/core/button';
import '@anchor-ui/core/modal';

// 或全量載入所有元件
import '@anchor-ui/core';
`})}),`
`,(0,c.jsx)(r.pre,{children:(0,c.jsx)(r.code,{className:`language-html`,children:`<aui-button variant="primary">儲存</aui-button>
`})}),`
`,(0,c.jsx)(r.p,{children:`字型檔不隨套件提供，請自行載入 Inter 與 JetBrains Mono（否則退回系統字型）。`}),`
`,(0,c.jsx)(r.h2,{id:`搭配框架`,children:`搭配框架`}),`
`,(0,c.jsxs)(r.ul,{children:[`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`Vue 3`}),`：在 `,(0,c.jsx)(r.code,{children:`vite.config.ts`}),` 以 `,(0,c.jsx)(r.code,{children:`compilerOptions.isCustomElement`}),` 排除 `,(0,c.jsx)(r.code,{children:`aui-`}),` 開頭的標籤；表單元件可直接用 `,(0,c.jsx)(r.code,{children:`v-model`}),`。動態綁定多字的布林屬性請用 camelCase（`,(0,c.jsx)(r.code,{children:`:fullWidth="flag"`}),`），kebab-case 的 `,(0,c.jsx)(r.code,{children:`false`}),` 會被當成 true。`]}),`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`Angular`}),`：使用 `,(0,c.jsx)(r.code,{children:`aui-`}),` 標籤的元件加上 `,(0,c.jsx)(r.code,{children:`CUSTOM_ELEMENTS_SCHEMA`}),`；表單元件的 `,(0,c.jsx)(r.code,{children:`[(ngModel)]`}),` / `,(0,c.jsx)(r.code,{children:`[formControl]`}),` 需加 `,(0,c.jsx)(r.code,{children:`ngDefaultControl`}),`。`]}),`
`]}),`
`,(0,c.jsxs)(r.p,{children:[`完整步驟（含設定範例、表單綁定與測試注意事項）見
`,(0,c.jsx)(r.a,{href:`https://github.com/mirageapache/Anchor_UI#%E5%9C%A8%E5%85%B6%E4%BB%96%E5%B0%88%E6%A1%88%E4%B8%AD%E5%B0%8E%E5%85%A5-installation`,rel:`nofollow`,children:`README 的「在其他專案中導入」`}),`，
升級時見 `,(0,c.jsx)(r.a,{href:`https://github.com/mirageapache/Anchor_UI/blob/main/doc/anchor-ui-upgrade-guide.md`,rel:`nofollow`,children:`升級遷移手冊`}),`。`]}),`
`,(0,c.jsx)(r.h2,{id:`慣例`,children:`慣例`}),`
`,(0,c.jsxs)(r.ul,{children:[`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`事件`}),`：自訂事件都以 `,(0,c.jsx)(r.code,{children:`aui-`}),` 開頭，且會冒泡並穿出 Shadow DOM。浮層元件（Modal、Drawer、Tooltip）的
`,(0,c.jsx)(r.code,{children:`aui-show`}),` / `,(0,c.jsx)(r.code,{children:`aui-hide`}),` 可呼叫 `,(0,c.jsx)(r.code,{children:`preventDefault()`}),` 取消；只處理元件自身的事件時，先比對
`,(0,c.jsx)(r.code,{children:`event.target === event.currentTarget`}),`（內層元件的同名事件也會傳上來）。`]}),`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`樣式客製`}),`：以 `,(0,c.jsx)(r.code,{children:`::part(...)`}),` 調整元件內部（各元件的 CSS part 列在 API 表中），或覆寫 Design Token 的 CSS 變數。`]}),`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`預設為 true 的選項`}),`：在 HTML 中以 `,(0,c.jsx)(r.code,{children:`close-on-escape="false"`}),` 的形式關閉。`]}),`
`,(0,c.jsxs)(r.li,{children:[(0,c.jsx)(r.strong,{children:`主題`}),`：`,(0,c.jsx)(r.code,{children:`setTheme('dark')`}),` / `,(0,c.jsx)(r.code,{children:`toggleTheme()`}),`（由全量入口 `,(0,c.jsx)(r.code,{children:`@anchor-ui/core`}),` 匯出），或直接設定
`,(0,c.jsx)(r.code,{children:`document.documentElement.dataset.theme = 'dark'`}),`。`]}),`
`]})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=a(),r(),i()})))()}l();export{s as default};