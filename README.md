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

---

## 技術架構

| 層級              | 技術選型                                      | 說明                                               |
| ----------------- | --------------------------------------------- | -------------------------------------------------- |
| **核心技術**      | [Lit 3](https://lit.dev/)                     | 輕量且標準的 Web Component 開發框架                |
| **程式語言**      | [TypeScript](https://www.typescriptlang.org/) | 嚴格型別定義、裝飾器語法支援                       |
| **Design Tokens** | Pure SCSS / CSS Variables                     | 色彩、字體、間距、圓角與動態單一事實來源           |
| **打包工具**      | [Vite](https://vitejs.dev/) (Library Mode)    | 產出標準 ESM 模組、`.d.ts` 型別宣告與獨立 CSS      |
| **元件預覽**      | [Storybook 8](https://storybook.js.org/)      | 元件展示、文件化與深淺主題互動測試                 |
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
│   ├── anchor-ui-components-list.md # 20 款共用元件規格清單
│   └── anchor-ui-development-schedule.md # Phase 0 ~ 4 開發排程
├── src/
│   ├── tokens/                  # Design Tokens (色彩、文字、間距、圓角、動態)
│   ├── base/                    # 全域基底 (Reset、Focus 環、Utilities)
│   ├── components/              # Web Components 元件實作 (Phase 1 起逐步擴充)
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

---

## 常用命令 (Scripts)

| 指令                   | 說明                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| `pnpm build`           | 編譯專案產物 (`dist/index.js`, `dist/index.d.ts`, `dist/styles.css`) |
| `pnpm storybook`       | 啟動 Storybook 開發環境 (預設 port: 6006)                            |
| `pnpm build-storybook` | 建置 Storybook 靜態部署產物至 `storybook-static/`                    |
| `pnpm typecheck`       | 執行 TypeScript 靜態型別檢驗 (`tsc --noEmit`)                        |
| `pnpm lint`            | 執行 ESLint 檢查 TypeScript 與 Lit 語法                              |
| `pnpm lint:fix`        | 自動修復 ESLint 可修復錯誤                                           |
| `pnpm stylelint`       | 執行 Stylelint 檢查 SCSS 變數與樣式規範                              |
| `pnpm stylelint:fix`   | 自動修復 Stylelint 樣式問題                                          |
| `pnpm format:check`    | 檢查程式碼排版格式 (Prettier)                                        |
| `pnpm format`          | 自動格式化所有代碼 (Prettier)                                        |
| `pnpm yalc:publish`    | 建置並發布至本機 yalc store                                          |
| `pnpm yalc:push`       | 建置並推送更新至所有已 `yalc add` 的專案                             |
| `pnpm dev:yalc`        | 監聽 `src/`，變更時自動建置並 `yalc push`                            |

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

- [架構規格規劃書 (`anchor-ui-spec.md`)](file:///c:/Users/user/Documents/my_repo/Anchor_UI/doc/anchor-ui-spec.md)
- [樣式系統與 Design Tokens 字典 (`design-system.md`)](file:///c:/Users/user/Documents/my_repo/Anchor_UI/doc/design-system.md)
- [共用元件規格清單 (`anchor-ui-components-list.md`)](file:///c:/Users/user/Documents/my_repo/Anchor_UI/doc/anchor-ui-components-list.md)
- [開發排程與里程碑 (`anchor-ui-development-schedule.md`)](file:///c:/Users/user/Documents/my_repo/Anchor_UI/doc/anchor-ui-development-schedule.md)
