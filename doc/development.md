# Anchor UI 開發指南

> 給參與開發 Anchor UI 元件庫本身的人：專案結構、開發與建置、常用命令與本地聯調。
> 在其他專案中使用元件庫請見 [README](../README.md)。

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
├── .github/workflows/           # CI、發布（release-please）、Storybook 部署、通知
├── .husky/                      # Git Hooks (pre-commit, commit-msg)
├── .storybook/                  # Storybook 配置與雙主題切換工具列
├── doc/                         # 規格規劃文件
│   ├── anchor-ui-spec.md        # 架構規格規劃
│   ├── design-system.md         # 樣式系統與 Design Tokens 字典
│   ├── anchor-ui-components-list.md # 共用元件規格清單
│   ├── anchor-ui-development-schedule.md # Phase 0 ~ 4 開發排程
│   ├── anchor-ui-release-guide.md # 發布流程（release-please）
│   ├── anchor-ui-upgrade-guide.md # 升級遷移手冊（給使用端）
│   └── development.md           # 本文件
├── examples/                    # Vue 3 / Angular 整合範例與測試
├── smoke/                       # 以 tarball 安裝的跨框架冒煙測試專案
├── src/
│   ├── tokens/                  # Design Tokens (色彩、文字、間距、圓角、動態)
│   ├── base/                    # 全域基底 (Reset、Focus 環、Utilities)
│   ├── components/              # Web Components 元件實作（每個資料夾一個元件）
│   ├── internal/                # 元件共用的內部模組（不對外匯出）
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

本專案使用 `pnpm` 進行套件管理（版本由 `package.json` 的 `packageManager` 指定，Node 版本見 `.nvmrc`）：

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

## 常用命令 (Scripts)

**建置與產物檢查**

| 指令                  | 說明                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `pnpm build`          | 編譯至 `dist/`：全量入口 `index.js`、各元件入口 `components/<name>/index.js`、型別定義、`styles.css`、`tokens.css` |
| `pnpm verify:package` | 驗證建置產物的 `exports`／`sideEffects`、型別宣告、Tree-shaking 與發布內容（需先 build）                           |
| `pnpm size`           | 以 size-limit 檢查各元件入口的 gzip 體積是否超出預算（需先 build，設定見 `.size-limit.mjs`）                       |
| `pnpm sync:package`   | 依 `src/components` 重新產生 `package.json` 中元件的 `exports` 與 `sideEffects`（新增或移除元件後執行）            |
| `pnpm check:versions` | 檢查 Playwright 映像與套件版本、pnpm 版本（`packageManager`）是否一致                                              |
| `pnpm audit:runtime`  | 檢查發布套件的 runtime 相依是否有 High / Critical 漏洞                                                             |

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

在不發布新版本的情況下，於真實的 Vue 3 / Angular 專案測試本套件：

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

啟用方式、限制（來自 fork 的 PR 沒有預覽）與常見狀況見 [`note/07-deployment.md`](../note/07-deployment.md) 第 6 節。

---

## 版本與發布

- 版號遵循 SemVer，每個 Phase 先發布 `-beta` 預覽版，測試通過後再發布正式版（例如 `v0.3.0-beta` → `v0.3.0`）。
- 發布由 [release-please](https://github.com/googleapis/release-please) 自動化：變更合併進 `main` 後，會依 Conventional Commits 自動開啟或更新一個 release PR（版號與 `CHANGELOG.md`）；合併該 PR 即自動打 tag，並建立附上 tarball 的 [GitHub Release](https://github.com/mirageapache/Anchor_UI/releases)。
- 完整流程、預覽版切換為正式版的方式與檢查清單見 [`anchor-ui-release-guide.md`](anchor-ui-release-guide.md)。

---

## 相關規劃文件

- [架構規格規劃書 (`anchor-ui-spec.md`)](anchor-ui-spec.md)
- [樣式系統與 Design Tokens 字典 (`design-system.md`)](design-system.md)
- [共用元件規格清單 (`anchor-ui-components-list.md`)](anchor-ui-components-list.md)
- [開發排程與里程碑 (`anchor-ui-development-schedule.md`)](anchor-ui-development-schedule.md)
- [發布流程 (`anchor-ui-release-guide.md`)](anchor-ui-release-guide.md)
- [升級遷移手冊 (`anchor-ui-upgrade-guide.md`)](anchor-ui-upgrade-guide.md)
