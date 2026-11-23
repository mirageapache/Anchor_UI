# Anchor UI — 開發排程與 Phase 階段規劃 (Development Schedule)

> **文件定位**：本文件依據 [`anchor-ui-components-list.md`] 所定義的 20 款獨立共用元件清單與 [`anchor-ui-planning.md`] 的工程策略，將共用元件庫的開發劃分為 **Phase 0 至 Phase 4** 五個階段，並完整納入 **Pre-commit 檢核、自動化測試、CI/CD 交付流水線與發布自動化** 等工程實作任務，提供具體任務拆解、跨框架驗證重點、預估工期與驗收標準，作為後續迭代開發的排程基準。

---

## 一、開發排程整體藍圖 (Roadmap Overview)

### 1. 核心開發與工程方針

1. **基底先行與品質防線 (Tokens & Quality First)**：樣式系統（Tokens）為單一事實來源，必須最先就定位；同時在第一天即建立 Git Hooks（Pre-commit）與基礎 CI，杜絕不良代碼合入。
2. **小步快跑、早期驗證 (PoC Early)**：Phase 1 僅挑選少數核心原子元件，立即以 `yalc` 軟連結接入 Vue 3 與 Angular 專案，提早暴露 Web Component 跨框架綁定問題。
3. **自動化驗證護航 (Test & A11y Automation)**：自 Phase 1 起導入單元/元件測試與 `axe-core` 無障礙自動化檢測，Phase 2 導入視覺回歸比對與 Bundle 體積監控。
4. **高頻核心優先 (High-Value First)**：Phase 2 優先實作常用功能，及早讓各專案享受到元件庫效益。
5. **發布流水線自動化 (CD & Release Automation)**：建立基於 Conventional Commits 與 release-please 的自動化語意發布流水線（CD），確保版本升級與 CHANGELOG 零人工作業失誤。

---

### 2. Phase 階段時程與工程流水線全景圖

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 0: 基礎建設、Tokens 系統與工程管線 (Foundation, Tokens & Engineering Setup)       │
│ [Tokens SCSS/CSS] ──▶ [Reset & Focus Ring] ──▶ [Storybook 基底]                         │
│ └── 工程任務: ESLint/Stylelint ──▶ Husky + lint-staged + Commitlint ──▶ GitHub Actions CI│
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ 依賴樣式變數、基底與 CI 防線
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: 技術驗證、最小可用原子與測試基底 (PoC, Core Atoms & Testing Framework)         │
│ [Button] ──▶ [Tag] ──▶ [Tooltip] ──▶ [Icon Button]                                      │
│ ├── 測試任務: Web Test Runner / Vitest ──▶ axe-core 無障礙自動化測試 ──▶ CI Test Pipeline│
│ └── 跨框架驗證: yalc 軟連結至 Vue 3 / Angular 測試專案，驗證屬性/事件/主題切換           │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ 依賴基礎原子與測試框架
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: 高頻互動控制項、核心回饋與視覺回歸 (Form Controls, Core Feedback & Visual QA)  │
│ ├── 工程先行: Tree-shaking 建置架構 ──▶ size-limit 體積門禁 ──▶ 視覺回歸 ──▶ 浮層模組   │
│ ├── 表單元件: [Input & Field] ──▶ [Output] ──▶ [Segmented Control] ──▶ 跨框架表單       │
│ └── 浮層回饋: [Modal] ──▶ [Alert (基於 Modal)] ──▶ [Toast (Top Layer)]                  │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ 依賴輸入與操作原子
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: 業務複合型元件與自動化預覽 (Molecules, Business Containers & Preview CI)       │
│ [Card & Grid] ──▶ [Accordion / Doc] ──▶ [FileUpload Dropzone]                             │
│ [Favorite Toggle]  ──▶ [Header]          ──▶ [Kbd]                                     │
│ └── 工程任務: 跨框架 CI 整合冒煙測試 ──▶ Storybook 自動化部署 (GitHub Pages / PR Preview)│
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ 依賴基礎與複合元件
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: 進階功能、獨立導覽抽屜與 CD 正式發布 (Advanced Features, Navigation & CD)      │
│ [Code View] ──▶ [Drawer] ──▶ [Navbar] ──▶ [Footer]                                      │
│ └── 工程任務: release-please CD 流水線 ──▶ GitHub Release 附 tarball 發布 (v1.0.0)      │
│ └── 導入任務: 目標專案正式鎖版導入 ──▶ 安全漏洞掃描 (npm audit / Dependabot)            │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、各階段詳細排程規劃 (Detailed Phase Breakdown)

---

### Phase 0：基礎建設、Tokens 系統與工程管線 (Foundation, Tokens & Engineering Setup)

- **階段定位**：建立元件庫工程骨架、樣式單一事實來源，以及本地與 CI 的第一道代碼品質防線。
- **預估工期**：1.5 週
- **主要目標**：
  1. 建立 Vite（Library Mode）+ Lit + TypeScript + SCSS 的套件工程架構。
  2. 將 `design-system.md` 規範完整轉化為獨立可引用的 CSS Custom Properties。
  3. 建置全域 Reset、焦點環、無障礙 Utility 與 Storybook 基礎展示環境。
  4. **建立完整的 Pre-commit 檢核機制與 GitHub Actions 基礎 CI 流水線**。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                              | 說明與具體內容                                                                                                                                                                                                                                                    |
| ------------ | :--: | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-001** | 架構 | 元件庫工程初始化                      | 配置 `package.json`、`tsconfig.json`、Vite 打包腳本（ESM/DTS 產出）、Path Alias。                                                                                                                                                                                 |
| **TASK-002** | 樣式 | 色彩 Tokens 實作                      | 實作 `_colors.scss`，包含 Brand 主色、Surface 背景階層、Text 文字階層，以及 **6 種語意色**（Danger、Warning、Success、Info、Purple、Neutral）與 Dim/Border 衍生色。                                                                                               |
| **TASK-003** | 樣式 | 字型、間距、圓角與動態 Tokens         | 實作 `_typography.scss`（Inter / JetBrains Mono）、`_spacing.scss`（4px/8px 尺度）、`_radius.scss` 與 `_motion.scss`。                                                                                                                                            |
| **TASK-004** | 樣式 | 主題切換機制實踐                      | 於根目錄匯出 `:root`（淺色）與 `[data-theme="dark"]`（深色），確保深淺色平滑過渡（`transition: 200ms ease`）。                                                                                                                                                    |
| **TASK-005** | 樣式 | 全域 Base 樣式                        | 實作 Minimal Reset、雙層無障礙焦點環（`:focus-visible`）與輔助類別（`.sr-only`、`.section-label`、`.container`）。                                                                                                                                                |
| **TASK-006** | 展示 | Storybook 環境配置                    | 建立 Storybook 預覽環境，加入雙主題切換工具列外掛，撰寫 Design Tokens 視覺展示頁面。                                                                                                                                                                              |
| **TASK-007** | 工程 | 程式碼品質與靜態檢查配置              | 配置 **ESLint**（整合 `@typescript-eslint` 與 Lit 語法外掛）、**Prettier**（排版格式化）與 **Stylelint**（SCSS 變數與屬性排序）。                                                                                                                                 |
| **TASK-008** | 工程 | **Pre-commit 檢核機制建置**           | 導入 **Husky** + **lint-staged**：<br>1. `pre-commit` hook：僅對暫存檔案執行 ESLint、Stylelint、Prettier 修復與 `tsc --noEmit` 型別檢查。<br>2. `commit-msg` hook：導入 **Commitlint**，強制 Conventional Commits 規範（`feat:`, `fix:`, `docs:`, `chore:` 等）。 |
| **TASK-009** | 工程 | **基礎 CI 流程建置 (GitHub Actions)** | 建置 `.github/workflows/ci.yml`：在 PR 與 push 時自動執行代碼檢驗（Lint、Stylelint、Typecheck、Tokens 編譯打包驗證）。                                                                                                                                            |

#### 交付成果 (Deliverables)

- 獨立匯出之樣式產物：`@anchor-ui/tokens`（SCSS 源碼）與預編譯 `style.css`。
- 可正常運行的 Storybook，展示所有色彩調色盤、文字階層與間距格線。
- 運作正常的本地 Pre-commit Hook 與 GitHub Actions PR 驗證流水線。

#### 驗收條件 (Acceptance Criteria)

- [✅] 外部專案單純引入編譯後 CSS 即可直接使用所有 Design Tokens 變數。
- [✅] 切換 `html[data-theme="dark"]` 時，所有語意色、文字色、背景色自動且無閃爍切換。
- [✅] 提交代碼時，若有 Lint 錯誤、格式不合、型別不通過或 Commit 訊息未符合規範，Git commit 應被正確中斷阻擋。
- [✅] 發起 PR 時，GitHub Actions CI 能在 2 分鐘內完成靜態檢查與 Build 檢核。

---

### Phase 1：技術驗證、最小可用原子與測試基底 (PoC, Core Atoms & Testing Framework)

- **階段定位**：以最小高頻元件集驗證 Lit Web Component 與前端框架（Vue 3 / Angular）的整合能力，並建立自動化測試基底。
- **預估工期**：2.0 週
- **主要目標**：
  1. 實作 4 個高複用、邏輯單純之核心原子元件。
  2. 建立標準 Lit 元件結構模板（Props/Attributes、Custom Events、Shadow DOM 樣式封裝）。
  3. 透過 `yalc` 軟連結至實際 Vue 3 與 Angular 專案，驗證跨框架整合無阻礙。
  4. **建立單元測試、元件測試與無障礙（a11y）自動化檢驗管線**。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                                     | 說明與具體內容                                                                                                                                                                                                                                                                |
| ------------ | :--: | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-101** | 元件 | `Button` 元件實作 (`<aui-button>`)           | 支援 Primary、Accent、Ghost、Danger 四種變體；支援 disabled、loading、active 點擊縮放、40px 最低觸控高度。                                                                                                                                                                    |
| **TASK-102** | 元件 | `Tag / Badge` 元件實作 (`<aui-tag>`)         | 採用 JetBrains Mono 等寬字體；支援 7 種語意色彩變體；全小寫標籤規範。                                                                                                                                                                                                         |
| **TASK-103** | 元件 | `Tooltip` 元件實作 (`<aui-tooltip>`)         | Shadcn 風格冷黑浮層；微縮放動態（0.95 -> 1.0）；浮動定位（Popper/Floating UI 或原生 Popover API 封裝）。                                                                                                                                                                      |
| **TASK-104** | 元件 | `Icon Button` 元件實作 (`<aui-icon-button>`) | 32×32px 觸控盒；內建 Copy/Download 狀態切換動態；結合 Tooltip 與無障礙標籤。                                                                                                                                                                                                  |
| **TASK-105** | 工程 | **元件單元測試框架建置** [✅]                | 配置 **Web Test Runner** + **`@open-wc/testing`** + **Playwright Chromium**，完成 4 大原子元件 38 項單元測試，總覆蓋率達 92.13%。                                                                                                                                             |
| **TASK-106** | 工程 | **無障礙自動化檢測 (a11y)** [✅]             | 於測試管線中整合 **`axe-core`**，為每個原子元件撰寫色彩對比度、ARIA 角色與鍵盤可聚焦性自動化測試（共 58 項 a11y 檢驗案例全數通過，淺色／深色主題皆涵蓋所有變體）。                                                                                                            |
| **TASK-107** | 整合 | **Vue 3 整合測試專案建立** [✅]              | 設定 `vite.config` 之 `compilerOptions.isCustomElement`；驗證 `@click`、props 綁定與響應式更新。                                                                                                                                                                              |
| **TASK-108** | 整合 | **Angular 整合測試專案建立** [✅]            | 引入 `CUSTOM_ELEMENTS_SCHEMA`；驗證屬性 `[variant]` 與自訂事件 `(aui-remove)`／`(aui-copy)`／`(aui-download)` 雙向連通性，事件皆由元件實際互動觸發（12 項整合測試全數通過）。原規劃之 `(auiChange)` 於 Phase 1 元件中不存在，已於 Phase 2 TASK-209 改以原生 `(change)` 補驗。 |
| **TASK-109** | 流程 | **yalc 本地開發工作流定型** [✅]             | 驗證 `yalc publish` ➜ `yalc add @anchor-ui/core` ➜ `yalc push` 元件熱更新流程；新增 `yalc:publish` / `yalc:push` / `dev:yalc` 腳本。                                                                                                                                          |
| **TASK-110** | 工程 | **CI 自動化測試管線整合** [✅]               | 擴充 GitHub Actions CI：新增自動執行元件單元測試、無障礙檢測與程式碼覆蓋率（Codecov / LCOV）產出。                                                                                                                                                                            |

#### 交付成果 (Deliverables)

- 4 款核心原子元件源碼與 Storybook 操作範例。
- 具備單元測試與 a11y 檢驗的自動化測試套件（覆蓋率門檻 ≥ 85%）。
- 跨框架整合範例專案（包含 Vue 3 與 Angular 示範頁面）。
- Anchor UI **v0.1.0-alpha** 版本發布（本地 yalc 套件）。

#### 驗收條件 (Acceptance Criteria)

- [✅] `<aui-button>`、`<aui-tag>`、`<aui-tooltip>`、`<aui-icon-button>` 在 Vue 3 與 Angular 中皆無需特殊 wrapper 即可原生使用。
- [✅] 元件內部樣式受 Shadow DOM 保護，同時能正常讀取外部全域 CSS Custom Properties（主題變數切換正常）。
- [✅] 所有元件通過 `axe-core` 檢驗，無任何 WCAG 2.1 AA 違規（淺色與深色主題皆涵蓋所有變體）。AAA 對比度（7:1）不列為目標。
- [✅] GitHub Actions CI 自動跑完所有測試案例，PR 綠燈才允許 Merge。（CI 已於 PR #1 實際執行並全數通過；`main` 以 Ruleset 強制透過 PR 並要求三項 CI 檢查通過）

---

### Phase 2：高頻互動控制項、核心回饋與視覺回歸 (Form Controls, Core Feedback & Visual QA)

- **階段定位**：打造涵蓋日常應用 80% 表單輸入與全域狀態回饋的核心控制項，並在開發元件**之前**先建立 Tree-shaking 建置架構、體積門禁與視覺回歸防線，讓本階段新增的每個元件從第一天就受到保護。
- **預估工期**：4.0 ~ 4.5 週
- **主要目標**：
  1. **工程防線先行**：調整建置架構使 Tree-shaking 生效、導入產物體積門禁（Bundle Size Guard）與自動化視覺回歸測試（Visual Regression），並建立共用浮層基礎模組。
  2. 完成等寬文字輸入框、標頭欄位容器與語意結果展示列，並可參與原生表單、與 Vue 3 / Angular 表單機制雙向綁定。
  3. 實作模式切換分段控制器，具備完整鍵盤巡覽無障礙支援。
  4. 實作 Modal 通用彈窗容器、以 Modal 為基礎的 Alert 提示對話框服務，以及全域 Toast 服務，提供跨專案統一的通知與彈窗體驗。

#### 設計原則（承接 Phase 1 經驗）

- **跨 Shadow DOM 的無障礙關聯**：`aria-describedby`、`aria-labelledby`、`<label for>` 等 IDREF 無法跨 Shadow DOM 邊界解析，標題與描述的關聯必須在目標元素所在的同一棵 tree 內完成，並以瀏覽器實際計算的無障礙樹驗證。
- **表單控制項事件**：原生 `change` 事件不具 `composed`，不會穿出 Shadow DOM，表單元件須在 host 上重新分派 `input` 與 `change`，且事件觸發時 `value` 屬性已同步更新。表單控制項沿用原生事件名稱以支援框架表單機制，其餘自訂事件維持 `aui-` 前綴。
- **浮層層級（Top Layer）**：Modal / Alert 使用原生 `<dialog>.showModal()`（Top Layer、背景 inert、ESC 由 `cancel` 事件處理）；Toast Viewport 使用 Popover API 進入 Top Layer。注意 modal dialog 開啟時，dialog 子樹以外的所有節點（包含 Top Layer 中較晚顯示的 popover）都會變為 inert，無法操作也不會被螢幕閱讀器播報；重新提升至最上層只能解決「看得到」，因此 Modal 開啟期間 Toast Viewport 必須移入最上層 modal 的 DOM 子樹（詳見 `note/04-top-layer.md`）。
- **環境相容**：`ElementInternals` 等 API 在 happy-dom 等測試環境不存在，須提供退回方案，不可在元件建構時直接拋錯。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                                                             | 說明與具體內容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | :--: | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-201** | 工程 | **建置架構調整（Tree-shaking 與發布產物）** [✅]                     | 1. Vite 改為多入口（或 `preserveModules`），產出各元件獨立模組。<br>2. `package.json` `exports` 新增各元件入口（如 `@anchor-ui/core/button`），並以 `sideEffects` 僅標記會註冊元件與載入 CSS 的模組。<br>3. `@floating-ui/dom` 改為 external（已列於 `dependencies`），避免重複打包。<br>4. 型別宣告排除 `*.test.ts`、stories 與 `test-utils`。                                                                                                                                                                                    |
| **TASK-202** | 工程 | **Bundle 體積門禁監控 (Size Limit)** [✅]                            | 整合 **`size-limit`** 至 CI，逐一檢查各元件入口（gzip、不含消費端自備的 `lit`）。預算以 TASK-201 完成後的實測值為基準 **+10%**（參考 Phase 1 單檔實測：Button 3.2 KB、Tag 3.4 KB、Tooltip 11.1 KB、IconButton 16.8 KB，Tooltip 與 IconButton 含 floating-ui）；新元件於首次合併時建立基準。超出預算即 CI 失敗，並於 PR 留言列出差異。                                                                                                                                                                                              |
| **TASK-203** | 工程 | **視覺回歸測試建置 (Visual Regression)** [✅]                        | 沿用現有 Web Test Runner + Playwright，導入 **`@web/test-runner-visual-regression`**：<br>1. 於固定的 Playwright 官方容器中產生與比對基準圖，避免本機與 CI 的作業系統差異。<br>2. 測試環境自行載入 Inter 與 JetBrains Mono 字型檔（元件庫本身不打包字型），並等待 `document.fonts.ready`。<br>3. 以 `reducedMotion: 'reduce'` 停用轉場與動畫。<br>4. 基準圖納入版本控制；更新須透過 PR 並附差異圖供審查。<br>5. 先涵蓋 Phase 1 四個元件的淺色／深色主題。                                                                          |
| **TASK-204** | 工程 | **共用浮層基礎模組 (`src/internal/`)** [✅]                          | 供 Modal、Alert 與 Phase 4 Drawer 共用：<br>1. 背景捲動鎖定：支援巢狀開啟的計數，並補償捲軸寬度避免版面跳動。<br>2. 焦點返還：記錄開啟時實際聚焦的元素（穿透 Shadow DOM 逐層取得 `activeElement`），關閉後還原。<br>3. Top Layer 工具：堆疊順序（重新提升至最上層），以及 modal 開啟期間將浮層（如 Toast Viewport）移入最上層 modal 子樹、關閉後移回，避開 modal 造成的 inert 邊界。                                                                                                                                               |
| **TASK-205** | 工程 | 版本與發布產物規範 [✅]                                              | 補記 Phase 1 里程碑 `v0.1.0-alpha` 並建立 Git Tag；Phase 2 結束時更新為 `v0.2.0-beta`。Phase 4 導入 release-please 前，以 yalc 與 `npm pack` 產出之 tarball 交付測試專案。                                                                                                                                                                                                                                                                                                                                                         |
| **TASK-206** | 元件 | `Input & Field` 元件 (`<aui-input>`, `<aui-field>`) [✅]             | 支援單行／多行等寬輸入；Focus 雙層光環；整合 Field 標題列（Label + 右側快捷複製／清除按鈕，沿用 `<aui-icon-button>`）。<br>**表單參與**：form-associated（`ElementInternals.setFormValue`、`required` 驗證、`formResetCallback`、`formDisabledCallback`），不支援時退回隱藏 input。<br>**標題關聯**：`<aui-field>` 將標題與描述傳入 `<aui-input>`，由 input 於自身 Shadow DOM 內完成 label／描述關聯。                                                                                                                             |
| **TASK-207** | 元件 | `Output` 元件 (`<aui-output>`) [✅]                                  | 結果輸出框；左側 4px 垂直語意邊條（綠色成功／琥珀警告／紅色錯誤）；等寬字體與長文字換行溢位防護；成功／警告／錯誤狀態除顏色外亦以文字或 `role` 傳達。                                                                                                                                                                                                                                                                                                                                                                              |
| **TASK-208** | 元件 | `Segmented Control` 元件 (`<aui-segmented>`) [✅]                    | 膠囊軌道單選切換器；選中項高亮背景過渡；採 radiogroup 模式（roving tabindex：Tab 僅停留在選中項，左右方向鍵／Home／End 巡覽並自動選取）；form-associated，於 host 分派 `input` 與 `change`。                                                                                                                                                                                                                                                                                                                                       |
| **TASK-209** | 整合 | 表單元件跨框架整合測試 [✅]                                          | 於 `examples/vue3` 與 `examples/angular` 驗證：Vue 3 `v-model`（`input` 事件時讀取 host 的 `value`）與 Angular `ngModel` / `formControl`（搭配 `ngDefaultControl`）雙向同步；一併補驗 Phase 1 TASK-108 遺留的表單事件綁定（原規劃之 `(auiChange)` 改以原生 `(change)` 驗證）。                                                                                                                                                                                                                                                     |
| **TASK-210** | 元件 | `Modal` 通用彈窗外框容器 (`<aui-modal>`) [✅]                        | 以原生 `<dialog>.showModal()` 實作（Top Layer、背景 inert、`::backdrop` 模糊遮罩）；大中小三種尺寸規格（sm/md/lg）；Header/Body/Footer 插槽；ESC 與點擊遮罩關閉（可配置）；使用 TASK-204 的捲動鎖定與焦點返還；分派可取消的 `aui-show` / `aui-hide` 與 `aui-after-show` / `aui-after-hide` 事件。                                                                                                                                                                                                                                  |
| **TASK-211** | 元件 | `Alert` 提示與確認對話框 (`<aui-alert>`, `AlertService`) [✅]        | **以 `<aui-modal>` 為基礎組成**，不重複實作焦點、捲動與 ESC 邏輯；SweetAlert2 風格成功／失敗／警告／資訊向量圖示（遵循減少動畫設定）；`AlertService.alert()` / `confirm()` / `prompt()` 回傳 Promise；Enter 確認、ESC 取消；破壞性確認的初始焦點落在取消鈕；支援於 Modal 內再開啟。                                                                                                                                                                                                                                                |
| **TASK-212** | 元件 | `Toast Notification` 元件與服務 (`<aui-toast>`, `ToastService`) [✅] | 右下角堆疊 Viewport（Popover API 進入 Top Layer，新通知出現時重新提升至最上層；Modal 開啟期間透過 TASK-204 移入最上層 modal 子樹，確保仍可見、可操作且可被播報）；Success、Error、Warning、Info、Loading 5 種狀態；`ToastService.success('複製成功')` 等單例 API，並支援更新既有通知（如 Loading 轉 Success）；佇列管理與同時顯示上限；以 live region 播報（Error 為 `role="alert"`，其餘為 `role="status"`）；滑鼠懸停或聚焦時暫停自動關閉；單例以 `globalThis` 上的 `Symbol.for()` 共用，避免微前端重複載入時產生多個 Viewport。 |
| **TASK-213** | 展示 | 表單與回饋 Storybook 交互測試 [✅]                                   | 以 `storybook/test` 撰寫複雜表單與非同步通知的 play function 互動情境，並以 `@storybook/addon-vitest`（Vitest browser mode + Playwright Chromium）於 CI 執行，之後再執行 `build-storybook`。                                                                                                                                                                                                                                                                                                                                       |
| **TASK-214** | 工程 | CI 擴充與時間預算 [✅]                                               | 新增 Visual Regression 與 Size Limit job（與既有 job 平行執行），並將 `examples/vue3`、`examples/angular` 的生產建置納入 CI；整體 PR CI 維持在 8 分鐘內完成。                                                                                                                                                                                                                                                                                                                                                                      |

#### 交付成果 (Deliverables)

- 6 款高頻互動元件（Input & Field、Output、Segmented Control、Modal、Alert、Toast）與全域回饋單例服務（`ToastService`、`AlertService`）。
- 共用浮層基礎模組（捲動鎖定、焦點返還、Top Layer 堆疊）。
- 支援個別元件入口與 Tree-shaking 的建置產物。
- 雙主題截圖快照比對測試機制。
- CI Bundle Size 檢查與 PR 差異報告。
- Anchor UI **v0.2.0-beta** 版本（以 yalc 與 `npm pack` tarball 交付；正式交付方式於 Phase 4 TASK-405 定為 GitHub Release 附 tarball）。

#### 驗收條件 (Acceptance Criteria)

**工程防線**

- [✅] 元件庫 Tree-shaking 正常運作：消費端僅引用 Button 時，打包結果不含其他元件的程式碼（以自動化測試驗證）。
- [✅] size-limit 於 CI 逐一檢查各元件入口，超出預算（基準 +10%）時 PR 檢查失敗並留言列出差異。
- [✅] 視覺回歸測試在深淺色模式下皆通過比對，像素差異 > 0.1% 時 CI 自動阻擋；同一 commit 重跑結果一致，無偶發失敗。
- [✅] 發布產物不含測試、stories 與 `test-utils` 檔案；`package.json` 版本與 Git Tag 對齊里程碑。（發布產物內容由 `pnpm verify:package` 檢查；`v0.2.0-beta` 已由 PR #8 發布並建立 Git Tag）
- [✅] PR CI 全部 job 於 8 分鐘內完成。

**表單控制項**

- [✅] Input 與 Segmented Control 於 host 上分派 `input` 與 `change` 事件，事件觸發時 `value` 已更新；Vue 3 `v-model` 與 Angular `ngModel`（`ngDefaultControl`）皆可雙向同步。
- [✅] 表單元件可參與原生 `<form>`：提交時帶出 `name` / `value`、`required` 未填時阻擋提交、`form.reset()` 還原初始值、`<fieldset disabled>` 時一併停用。
- [✅] `<aui-field>` 的標題與描述可被讀出為輸入框的無障礙名稱與描述（以瀏覽器實際計算的無障礙樹驗證）。
- [✅] Segmented Control 可用方向鍵、Home、End 巡覽並選取，Tab 僅停留在選中項。
- [✅] Output 長文字安全換行、無橫向溢位，成功／警告／錯誤狀態不只依賴顏色傳達。

**浮層與回饋**

- [✅] Toast 具備佇列管理能力，多筆通知快速觸發時依序垂直堆疊，不產生位置重疊破版；Modal 或 Alert 開啟時，Toast 仍顯示於最上層、可操作且可被螢幕閱讀器播報。（以 Chromium 無障礙樹驗證 Modal 內的 live region 未被 inert，並以 Tab 鍵抵達通知）
- [✅] Toast 以 live region 播報內容，滑鼠懸停或聚焦時暫停自動關閉（WCAG 2.2.1）。
- [✅] Modal 與 Alert 開啟時正確鎖定背景捲動（巢狀開啟時正確計數）、背景不可互動、ESC 可關閉；關閉後焦點返還至觸發元素（含位於 Shadow DOM 內的觸發元素）。

**品質基準（延續 Phase 1）**

- [✅] 所有新元件通過 `axe-core` 檢驗，無任何 WCAG 2.1 AA 違規（淺色與深色主題皆涵蓋所有變體），且可完整以鍵盤操作。
- [✅] 單元測試覆蓋率維持 statements / functions / lines ≥ 85%、branches ≥ 75%。

---

### Phase 3：業務複合型元件與自動化預覽 (Molecules, Business Containers & Preview CI)

- **階段定位**：提供可直接拼裝出完整工具產品頁面、分類首頁與說明文件的複合元件，並建置預覽站台持續部署。
- **預估工期**：2.0 ~ 2.5 週
- **主要目標**：
  1. 實作工具首頁展示核心：Card（自適應 Grid）與 Header。
  2. 實作檔案上傳拖放區與說明文件收折手風琴。
  3. 實作微互動輔助元件：Favorite Toggle 按鈕與 Kbd 鍵帽。
  4. **建立跨框架 CI 整合冒煙測試與 Storybook 預覽站台自動化部署**。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                                             | 說明與具體內容                                                                                                                                                                                                                                                              |
| ------------ | :--: | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-301** | 元件 | `Card & Grid` 元件 (`<aui-card>`, `.card-grid`) [✅] | 支援內在自適應格線（`auto-fill, minmax(270px, 1fr)`）；Hover 微浮凸（`translateY(-2px)`）；HOT 邊框變體；描述兩行裁切。                                                                                                                                                     |
| **TASK-302** | 元件 | `Accordion / Doc` 元件 (`<aui-accordion>`) [✅]      | 原生 `<details>`/`<summary>` 語意封裝；展開時外框平滑高亮；提供 FAQ 與使用指南預設排版。                                                                                                                                                                                    |
| **TASK-303** | 元件 | `Dropzone` 元件 (`<aui-dropzone>`) [✅]              | 虛線框拖曳上傳；Dragover 狀態琥珀金染色；點擊觸發原生檔案選取器；檔案格式過濾與提示。                                                                                                                                                                                       |
| **TASK-304** | 元件 | `Favorite Toggle Button` (`<aui-favorite-btn>`) [✅] | 星號收藏按鈕；點擊微縮放彈跳動態；已收藏狀態實心琥珀金高亮與事件拋出。                                                                                                                                                                                                      |
| **TASK-305** | 元件 | `Header` 複合元件 (`<aui-header>`) [✅]              | 整合 Tag 標籤、HOT 徽標、H1 主標題、我的最愛收藏鈕與簡述文字的統一頁首容器。                                                                                                                                                                                                |
| **TASK-306** | 元件 | `Kbd` 鍵帽微元件 (`<aui-kbd>`) [✅]                  | 鍵盤按鍵微元件，等寬字體微立體邊框風格，用於介面操作指引。                                                                                                                                                                                                                  |
| **TASK-307** | 工程 | **跨框架 CI 整合冒煙測試** [✅]                      | 範例專案的生產建置已於 Phase 2 TASK-214 納入 CI；本任務於 GitHub Actions 建立矩陣工作流（Matrix Workflow），每次發起 PR 時以 `npm pack` 產出的 tarball 安裝至 Vue 3 與 Angular 小型專案並建置，驗證實際發布產物（`exports`、`sideEffects`、型別宣告），提早抓出破壞性變更。 |
| **TASK-308** | 工程 | **Storybook 自動化預覽部署 (Preview CD)** [✅]       | 建置 GitHub Actions 部署腳本：<br>1. PR 建立時自動建置 Storybook 並發布至預覽環境（如 GitHub Pages 或臨時預覽站點），自動留言 PR 預覽連結。<br>2. `main` 分支更新時自動發布最新版線上元件文檔庫。                                                                           |

#### 交付成果 (Deliverables)

- 6 款業務複合型元件。
- 完整「工具原型頁面」Storybook 展示案例（展示 Header + Dropzone + Input + Output + Accordion 組合）。
- 具備 PR 自動留言預覽網址的 Storybook CD 流程。
- Anchor UI **v0.3.0** 版本。

#### 驗收條件 (Acceptance Criteria)

- [✅] `Card` 在不同容器寬度下自動排版填滿，縮放視窗無橫向溢位破版。（`.card-grid` 於 200px～1200px 容器寬度下的欄數、等寬填滿與無橫向溢位皆以自動化測試驗證）
- [✅] `FileUpload Dropzone` 拖放外部檔案（如 JSON、圖片）能正確截獲 File 物件並拋出 `aui-file-drop` 事件。（自訂事件一律使用 `aui-` 前綴；以合成的拖放事件於自動化測試驗證，`detail.files` 為可讀取內容的 File 物件）
- [✅] 每個 PR 均會自動產生獨立的 Storybook 預覽連結，供團隊即時檢驗視覺與互動。（已於 PR #9 實測：部署至 `pr-preview/pr-9/` 並由機器人留言連結。限制：只處理以 `main` 為目標的 PR，來自 fork 的 PR 因權杖唯讀不會部署預覽）
- [✅] 跨框架 CI 冒煙測試成功跑過 Vue 3 與 Angular 的生產編譯。（已於 PR #9 實測：`Framework Smoke Test (vue3)`、`Framework Smoke Test (angular)` 通過，並已加入 `main` Ruleset 的必要檢查。CI 只在以 `main` 為目標的 PR 與 `main` 的 push 執行，與其他 job 相同）

---

### Phase 4：進階功能、獨立導覽抽屜與 CD 正式發布 (Advanced Features, Navigation & CD)

- **階段定位**：完成進階代碼檢視區與獨立導覽抽屜元件（Drawer、Navbar、Footer），建立全自動化 CD 發布管線，並於正式業務專案鎖版導入。
- **預估工期**：2.5 ~ 3.0 週
- **主要目標**：
  1. 實作 IDE 風格程式碼檢視區（Sticky 行號與摺疊）。
  2. 實作獨立的可收合側邊抽屜（Drawer: `<aui-drawer>`），支援左右側滑出與遮罩鎖定，不綁死特定版型，可自由嵌入各專案。
  3. 實作獨立的站台頂部導覽列（Navbar: `<aui-navbar>`）與通用頁尾（Footer: `<aui-footer>`），提供品牌統一視覺基底。
  4. **建立 CD 自動化語意發布流水線（release-please，`v0.3.0` 起使用），正式版以 GitHub Release 附 tarball 交付**（主要供自己的專案使用，暫不發布至 npm registry）。
  5. 選定第一個業務專案正式安裝導入，完成生產環境驗證。
  6. 補上 MIT 授權檔（`LICENSE`），讓其他人可明確合法使用。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                                        | 說明與具體內容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | :--: | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-401** | 元件 | `Code View` 元件 (`<aui-code-view>`) [✅]       | 等寬代碼預覽；左側 Sticky 黏性行號列（水平捲動行號不位移）；支援程式碼區塊折疊展開。依縮排自動判斷摺疊區塊、不做語法高亮；每 200 行一段以 `content-visibility: auto` 延遲渲染，13,602 行（Lit dev mode）初次渲染約 120–170 ms、摺疊至重繪完成約 100–125 ms，捲動平均每幀 16.7 ms（p95 約 18 ms）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **TASK-402** | 元件 | `Drawer` 側邊抽屜元件 (`<aui-drawer>`) [✅]     | 獨立可收合側欄（Off-canvas Drawer）；支援左右側滑出（`placement="left" \| "right"`）；遮罩與背景捲動鎖定；不綁死特定 Layout 版型，可靈活嵌入各專案。與 Modal 共用開關生命週期（`src/internal/modal-dialog.ts`），寬度以 `--aui-drawer-width` 調整。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **TASK-403** | 元件 | `Navbar` 頂部導覽列 (`<aui-navbar>`) [✅]       | 64px 獨立頂部導覽列；整合 Logo（Accent 圓點）、搜尋按鈕（內嵌 ⌘K 鍵帽）、導覽選單與主題切換開關。漢堡選單以 `menu-drawer` 連動 Drawer；⌘K / Ctrl+K 快捷鍵分派 `aui-search`；主題開關分派可取消的 `aui-theme-change` 後切換。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **TASK-404** | 元件 | `Footer` 通用頁尾 (`<aui-footer>`) [✅]         | 獨立通用頁尾；版權聲明、版本資訊、外部連結與次要選單插槽；支援 Minimal 與 Columns 自適應排版。多欄以 `columns` 資料屬性提供，版權年份自動帶入今年。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **TASK-405** | 工程 | **CD 自動化發布管線建立 (release-please)** [✅] | 原規劃 Changesets，改用 **release-please** + GitHub Actions（專案已以 commitlint 強制 Conventional Commits，不需另寫變更說明檔）：<br>1. 合併進 `main` 時，依 commit 類型自動開啟或更新 release PR（版號、`CHANGELOG.md`）；自動計算的版號一律為 `-beta` 預覽版，正式版以 `chore(release)` commit 的 `Release-As` footer 指定（Phase 4 結束時以 `Release-As: 1.0.0-beta`、`Release-As: 1.0.0` 發布）。<br>2. release PR 合併後，自動上 Git Tag、等待 CI、建置驗證並建立附上 tarball 的 GitHub Release，再將 `main` 合併回 `develop`。<br>3. 交付方式決定為 **GitHub Release 附 tarball**（主要供自己的專案使用），暫不發布至 npm registry；日後要發布時以 `npm publish release/<檔名>.tgz` 發布同一個 tarball。<br>已於 `v0.3.0`（PR #17）實際走完一次。流程見 `doc/anchor-ui-release-guide.md`。 |
| **TASK-406** | 工程 | **相依性安全掃描與合規審查** [✅]               | 1. Dependabot 目前只監控 GitHub Actions，新增 npm 生態系（根目錄與 `examples/*`）。<br>2. 漏洞門檻以**發布的套件**為範圍：runtime `dependencies`（`lit`、`@floating-ui/dom`）須為 0 High / 0 Critical，並在 CI 檢查。`examples/` 與開發工具的漏洞不進入發布產物，由 Dependabot 追蹤更新、不阻擋發布（2026-11-18 時 `pnpm audit --prod` 的 7 High 全部來自 `examples/` 的 Angular 19 與 Vue 依賴）。<br>實作：`pnpm audit:runtime`（`scripts/audit-runtime.mjs`，CI lint job）以 `pnpm ls --prod` 取得根專案的 runtime 相依樹，只對樹內的漏洞套用門檻；Dependabot 的 runtime 相依更新以 `fix(deps)` 提交（觸發發布）、開發相依以 `chore(deps-dev)` 提交。                                                                                                                                          |
| **TASK-407** | 導入 | 跨專案正式導入與版本鎖定驗證                    | 選定一個實際專案（如 ToolBox 前端）以 GitHub Release 的 tarball 網址正式安裝 `@anchor-ui/core@1.0.0`，驗證正式環境打包與運行。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **TASK-408** | 文檔 | 元件庫使用手冊與 API 文件交付 [✅]              | 完善 Readme、Storybook 互動文檔、Vue 3 / Angular 安裝指南與升級遷移手冊。<br>實作：Storybook 加入 addon-docs，每個元件自動產生 Docs 頁，API 表取自 `@custom-elements-manifest/analyzer` 由 JSDoc 產生的 `custom-elements.json`（`pnpm analyze`），另有「快速開始」MDX 頁；README 補上元件一覽並更新安裝範例；新增 `doc/anchor-ui-upgrade-guide.md`。Vue 3 / Angular 安裝指南沿用 README「在其他專案中導入」第 5、6 節。                                                                                                                                                                                                                                                                                                                                                                           |
| **TASK-409** | 文檔 | 授權檔案 (`LICENSE`) [✅]                       | `package.json` 已宣告 `"license": "MIT"`，但 repo 沒有 `LICENSE` 檔，GitHub 顯示為無授權。新增標準 MIT `LICENSE`（著作權人 mirageapache，`package.json` 的 `author` 同步填入），README 補上授權段落；確認 tarball 含 `LICENSE`（`npm pack` 一律收錄），且 `verify:package` 與 `pnpm smoke` 的發布檔案檢查允許它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

#### 交付成果 (Deliverables)

- 完整 20 款獨立共用元件與全域服務（對齊 components-list.md）。
- 全自動化發布流水線（CD），具備 SemVer 與自動 CHANGELOG 生成。
- **Anchor UI v1.0.0 正式穩定版** 發布至 GitHub Releases（附 tarball）。
- 第一個業務專案成功導入並上線運作。
- MIT 授權檔（`LICENSE`）。

#### 驗收條件 (Acceptance Criteria)

- [ ] 業務專案透過 GitHub Release 的 tarball 網址安裝 `@anchor-ui/core` 後能順利編譯通過生產打包（Production Build）。
- [x] `Code View` 載入萬行代碼時捲動順暢無卡頓，Sticky 行號定位精準。
      （2026-11-23 於 Chromium 實測：12,002 行 JSON 初次渲染約 100 ms；每幀捲動 400px 由頂端到底共 629 幀，幀間隔平均與 p95 皆為 16.7 ms、最大 16.8 ms，沒有掉幀。在頂端、1/3、2/3、底部四處水平捲到最右，行號列都固定在左緣，行號與該行程式碼上緣對齊，數字與實際行號一致。）
- [x] `Drawer`、`Navbar` 與 `Footer` 能作為獨立元件自由嵌入不同專案頁面中，Drawer 展開與收合平滑無殘影，Navbar 具備正常吸頂與主題切換事件驅動。
      （2026-11-23 於 Chromium 實測：三者放在 flex、grid 與另一個 Shadow Root 中皆撐滿容器並正常運作，Navbar 的 `menu-drawer` 可開啟同一 Shadow Root 內的右側 Drawer。Drawer 逐幀取樣的位置在展開時單調滑入、收合時單調滑出；關閉後 dialog 離開 Top Layer、面板不佔版面、頁面可點擊。頁面捲動 1500px 後 Navbar 仍貼齊頂端並顯示陰影；主題開關分派 `aui-theme-change` 並切換 `<html data-theme>`，事件被取消時不切換。各元件的單獨入口由 `examples/*/tests/entries.spec.ts` 與 `pnpm smoke` 驗證。）
- [ ] 透過 CD 流水線發布版本全程無人為介入，CHANGELOG 內容與 Git Tag 準確對齊。
- [x] 發布套件的 runtime 依賴經漏洞檢查為 0 High / 0 Critical（範圍見 TASK-406；CI 以 `pnpm audit:runtime` 持續檢查）。
- [ ] repo 有 MIT `LICENSE` 檔，GitHub 頁面正確顯示授權，發布的 tarball 也包含它。
      （`LICENSE` 檔與 tarball 收錄已完成，由 `verify:package` 與 `pnpm smoke` 檢查；GitHub 只偵測預設分支 `main` 上的授權檔，待 PR #19 合併後確認。）

---

## 三、各階段工期估算與里程碑檢核表 (Timeline & Milestones)

|    階段     | 階段主題                        | 包含核心工程任務                                                      | 預估工期 | 累計工期 |         版本里程碑         | 關鍵檢核條件 (Gate Criteria)                                                                     |
| :---------: | ------------------------------- | --------------------------------------------------------------------- | :------: | :------: | :------------------------: | ------------------------------------------------------------------------------------------------ |
| **Phase 0** | 基礎建設、Tokens 與工程管線     | ESLint/Stylelint、Pre-commit（Husky+Commitlint）、PR 基礎 CI          |  1.5 週  |  1.5 週  |          `v0.0.1`          | Tokens 獨立打包發布、Pre-commit 生效、PR 基礎 CI 通過。                                          |
| **Phase 1** | 技術驗證、最小可用原子與測試    | 單元測試框架、a11y 自動化檢測、Vue 3 / Angular yalc 軟連結            |  2.0 週  |  3.5 週  |       `v0.1.0-alpha`       | 雙框架整合測試通過、單元測試覆蓋率 ≥ 85%、通過 WCAG AA 檢測。                                    |
| **Phase 2** | 高頻互動控制項、回饋與視覺 QA   | Tree-shaking 建置架構、Bundle Size 門禁、視覺回歸、共用浮層模組       |  4.5 週  |  8.0 週  |       `v0.2.0-beta`        | 表單可與 Vue 3 / Angular 雙向綁定、視覺回歸差異 ≤ 0.1%、體積不超出預算、單獨引用不夾帶其他元件。 |
| **Phase 3** | 業務複合元件與自動化預覽        | 跨框架 CI 冒煙測試、Storybook 自動化 PR 預覽部署                      |  2.5 週  | 10.5 週  |          `v0.3.0`          | 組裝出完整工具頁、PR 自動產出 Storybook 預覽連結。                                               |
| **Phase 4** | 進階功能、獨立導覽抽屜與正式 CD | release-please CD 自動發布、Dependabot 安全掃描、業務專案導入、授權檔 |  3.0 週  | 13.5 週  | **`v1.0.0`**<br>_(正式版)_ | GitHub Release 自動發布成功、業務專案生產上線、發布套件 0 漏洞。                                 |

> **總工期預估**：約 **13 ~ 14 週**（以 1 位前端工程師全職投入估算；若為 2 人協同開發約可壓縮至 7 ~ 8 週）。

---

## 四、工程架構與流水線規範 (Engineering Standards & Pipeline)

### 1. Pre-commit 檢核標準 (Local Git Hooks)

每次執行 `git commit` 時，由 Husky 與 lint-staged 觸發以下檢查：

1. **ESLint (`--fix`)**：檢查 TypeScript 與 Lit 語法、變數作用域、禁止使用未經定義的 CSS properties。
2. **Stylelint (`--fix`)**：檢查 SCSS 命名、巢狀深度、強制使用 Design Tokens 變數，禁止寫死十六進位色彩。
3. **Prettier (`--write`)**：統一檔案縮排（2 spaces）、分號與引號規則。
4. **Typecheck (`tsc --noEmit`)**：針對整體專案執行靜態型別編譯檢驗。
5. **Commitlint**：檢查 Commit 訊息格式，格式必須為：`type(scope): subject`（如 `feat(button): add loading state`）。

---

### 2. CI 流水線標準 (PR Validation Pipeline)

每次發起 Pull Request 或更新分支時，GitHub Actions 自動並行執行：

- **Job 1: Static Analysis**（Lint + Stylelint + Prettier Check + Typecheck）。
- **Job 2: Unit & Component Tests**（執行 Web Test Runner / Vitest，產出測試與覆蓋率報告）。
- **Job 3: Accessibility Tests**（執行 `axe-core`，驗收 WCAG 2.1 AA 標準）。
- **Job 4: Visual Regression Tests**（於固定 Playwright 容器中截圖比對深淺色模式，自帶字型並停用動畫）。
- **Job 5: Build & Size Limit**（編譯生產代碼，驗證 Tree-shaking 與各元件 Bundle Size 不超出預算）。
- **Job 6: Storybook Preview Deploy**（建置 Storybook 並發布 PR 預覽連結）。

---

### 3. CD 發布流水線標準 (Continuous Delivery)

1. **Version Bump**：合併至 `main` 後，release-please 依 Conventional Commits 自動開啟或更新 release PR（版號、`CHANGELOG.md`）；預覽版自動計算，正式版以 `Release-As` 指定。
2. **Release & Tag**：release PR 合併後，自動建立 Git Tag 與草稿 Release。
3. **Package Publishing**：等待必要 CI、建置驗證並打包後，附上 tarball 公開 GitHub Release（不發布至 npm registry）；`main` 的推送同時將最新 Storybook 部署至 GitHub Pages。
4. **Lockstep Deployment**：消費端改用新版的 tarball 網址重新安裝，即鎖定於該版本。
5. 詳細流程與失敗處理見 `doc/anchor-ui-release-guide.md`。

---

### 4. 跨階段風險管理與注意事項 (Risk Management)

1. **跨框架 Custom Element 註冊衝突**
   - _風險_：若多個微前端或獨立專案重複載入相同 Custom Element 標籤（如 `<aui-button>`），會引發瀏覽器拋錯。
   - _對策_：在 Custom Element 定義處加入防禦判斷：`if (!customElements.get('aui-button')) { customElements.define(...); }`。

2. **Shadow DOM 樣式穿透與自訂需求**
   - _風險_：宿主專案有客製化特定間距或局部的需求，但 Shadow DOM 會阻擋外部 CSS。
   - _對策_：所有視覺屬性皆綁定 CSS Custom Properties，並善用 `::part()`（如 `<aui-button part="btn">`）開放指定微調節點。

3. **版本更新與 Breaking Changes 管理**
   - _風險_：元件庫更新導致使用中的專案破版。
   - _對策_：嚴格遵守 **SemVer** 規範，各宿主專案在 `package.json` 中採用精確鎖定版本（例：`"1.0.2"` 而非 `"^1.0.2"`），升級由專案方主動發動並經過回歸測試。
