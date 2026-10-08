# Anchor UI — 開發排程與 Phase 階段規劃 (Development Schedule)

> **文件定位**：本文件依據 [`anchor-ui-components-list.md`] 所定義的 20 款獨立共用元件清單與 [`anchor-ui-planning.md`] 的工程策略，將共用元件庫的開發劃分為 **Phase 0 至 Phase 4** 五個階段，並完整納入 **Pre-commit 檢核、自動化測試、CI/CD 交付流水線與發布自動化** 等工程實作任務，提供具體任務拆解、跨框架驗證重點、預估工期與驗收標準，作為後續迭代開發的排程基準。

---

## 一、開發排程整體藍圖 (Roadmap Overview)

### 1. 核心開發與工程方針

1. **基底先行與品質防線 (Tokens & Quality First)**：樣式系統（Tokens）為單一事實來源，必須最先就定位；同時在第一天即建立 Git Hooks（Pre-commit）與基礎 CI，杜絕不良代碼合入。
2. **小步快跑、早期驗證 (PoC Early)**：Phase 1 僅挑選少數核心原子元件，立即以 `yalc` 軟連結接入 Vue 3 與 Angular 專案，提早暴露 Web Component 跨框架綁定問題。
3. **自動化驗證護航 (Test & A11y Automation)**：自 Phase 1 起導入單元/元件測試與 `axe-core` 無障礙自動化檢測，Phase 2 導入視覺回歸比對與 Bundle 體積監控。
4. **高頻核心優先 (High-Value First)**：Phase 2 優先實作常用功能，及早讓各專案享受到元件庫效益。
5. **發布流水線自動化 (CD & Release Automation)**：建立基於 Conventional Commits 與 Changesets 的自動化語意發布流水線（CD），確保版本升級與 CHANGELOG 零人工作業失誤。

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
│ ├── 表單元件: [Input & Field] ──▶ [Output Row] ──▶ [Segmented Control] ──▶ 跨框架表單   │
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
│ └── 工程任務: Changesets / Semantic Release CD 流水線 ──▶ 私有 npm 自動發布 (v1.0.0)    │
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

| 任務代號     | 類別 | 工作項目                                     | 說明與具體內容                                                                                                                                                                                                                                        |
| ------------ | :--: | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-101** | 元件 | `Button` 元件實作 (`<aui-button>`)           | 支援 Primary、Accent、Ghost、Danger 四種變體；支援 disabled、loading、active 點擊縮放、40px 最低觸控高度。                                                                                                                                            |
| **TASK-102** | 元件 | `Tag / Badge` 元件實作 (`<aui-tag>`)         | 採用 JetBrains Mono 等寬字體；支援 7 種語意色彩變體；全小寫標籤規範。                                                                                                                                                                                 |
| **TASK-103** | 元件 | `Tooltip` 元件實作 (`<aui-tooltip>`)         | Shadcn 風格冷黑浮層；微縮放動態（0.95 -> 1.0）；浮動定位（Popper/Floating UI 或原生 Popover API 封裝）。                                                                                                                                              |
| **TASK-104** | 元件 | `Icon Button` 元件實作 (`<aui-icon-button>`) | 32×32px 觸控盒；內建 Copy/Download 狀態切換動態；結合 Tooltip 與無障礙標籤。                                                                                                                                                                          |
| **TASK-105** | 工程 | **元件單元測試框架建置** [✅]                | 配置 **Web Test Runner** + **`@open-wc/testing`** + **Playwright Chromium**，完成 4 大原子元件 38 項單元測試，總覆蓋率達 92.13%。                                                                                                                     |
| **TASK-106** | 工程 | **無障礙自動化檢測 (a11y)** [✅]             | 於測試管線中整合 **`axe-core`**，為每個原子元件撰寫色彩對比度、ARIA 角色與鍵盤可聚焦性自動化測試（共 58 項 a11y 檢驗案例全數通過，淺色／深色主題皆涵蓋所有變體）。                                                                                    |
| **TASK-107** | 整合 | **Vue 3 整合測試專案建立** [✅]              | 設定 `vite.config` 之 `compilerOptions.isCustomElement`；驗證 `@click`、props 綁定與響應式更新。                                                                                                                                                      |
| **TASK-108** | 整合 | **Angular 整合測試專案建立** [✅]            | 引入 `CUSTOM_ELEMENTS_SCHEMA`；驗證屬性 `[variant]` 與自訂事件 `(aui-remove)`／`(aui-copy)`／`(aui-download)` 雙向連通性，事件皆由元件實際互動觸發（12 項整合測試全數通過）。原規劃之 `(auiChange)` 於 Phase 1 元件中不存在，待表單類元件實作後補驗。 |
| **TASK-109** | 流程 | **yalc 本地開發工作流定型** [✅]             | 驗證 `yalc publish` ➜ `yalc add @anchor-ui/core` ➜ `yalc push` 元件熱更新流程；新增 `yalc:publish` / `yalc:push` / `dev:yalc` 腳本。                                                                                                                  |
| **TASK-110** | 工程 | **CI 自動化測試管線整合** [✅]               | 擴充 GitHub Actions CI：新增自動執行元件單元測試、無障礙檢測與程式碼覆蓋率（Codecov / LCOV）產出。                                                                                                                                                    |

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
- **浮層層級（Top Layer）**：Modal / Alert 使用原生 `<dialog>.showModal()`（Top Layer、背景 inert、ESC 由 `cancel` 事件處理）；Toast Viewport 使用 Popover API 進入 Top Layer，避免 Modal 開啟時被遮蓋或變為不可操作。
- **環境相容**：`ElementInternals` 等 API 在 happy-dom 等測試環境不存在，須提供退回方案，不可在元件建構時直接拋錯。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                                                        | 說明與具體內容                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | :--: | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-201** | 工程 | **建置架構調整（Tree-shaking 與發布產物）**                     | 1. Vite 改為多入口（或 `preserveModules`），產出各元件獨立模組。<br>2. `package.json` `exports` 新增各元件入口（如 `@anchor-ui/core/button`），並以 `sideEffects` 僅標記會註冊元件與載入 CSS 的模組。<br>3. `@floating-ui/dom` 改為 external（已列於 `dependencies`），避免重複打包。<br>4. 型別宣告排除 `*.test.ts`、stories 與 `test-utils`。                                                                                                                                  |
| **TASK-202** | 工程 | **Bundle 體積門禁監控 (Size Limit)**                            | 整合 **`size-limit`** 至 CI，逐一檢查各元件入口（gzip、不含消費端自備的 `lit`）。預算以 TASK-201 完成後的實測值為基準 **+10%**（參考 Phase 1 單檔實測：Button 3.2 KB、Tag 3.4 KB、Tooltip 11.1 KB、IconButton 16.8 KB，Tooltip 與 IconButton 含 floating-ui）；新元件於首次合併時建立基準。超出預算即 CI 失敗，並於 PR 留言列出差異。                                                                                                                                            |
| **TASK-203** | 工程 | **視覺回歸測試建置 (Visual Regression)**                        | 沿用現有 Web Test Runner + Playwright，導入 **`@web/test-runner-visual-regression`**：<br>1. 於固定的 Playwright 官方容器中產生與比對基準圖，避免本機與 CI 的作業系統差異。<br>2. 測試環境自行載入 Inter 與 JetBrains Mono 字型檔（元件庫本身不打包字型），並等待 `document.fonts.ready`。<br>3. 以 `reducedMotion: 'reduce'` 停用轉場與動畫。<br>4. 基準圖納入版本控制；更新須透過 PR 並附差異圖供審查。<br>5. 先涵蓋 Phase 1 四個元件的淺色／深色主題。                        |
| **TASK-204** | 工程 | **共用浮層基礎模組 (`src/internal/`)**                          | 供 Modal、Alert 與 Phase 4 Drawer 共用：<br>1. 背景捲動鎖定：支援巢狀開啟的計數，並補償捲軸寬度避免版面跳動。<br>2. 焦點返還：記錄開啟時實際聚焦的元素（穿透 Shadow DOM 逐層取得 `activeElement`），關閉後還原。<br>3. Top Layer 堆疊順序工具。                                                                                                                                                                                                                                  |
| **TASK-205** | 工程 | 版本與發布產物規範                                              | 補記 Phase 1 里程碑 `v0.1.0-alpha` 並建立 Git Tag；Phase 2 結束時更新為 `v0.2.0-beta`。Phase 4 導入 Changesets 前，以 yalc 與 `npm pack` 產出之 tarball 交付測試專案。                                                                                                                                                                                                                                                                                                           |
| **TASK-206** | 元件 | `Input & Field` 元件 (`<aui-input>`, `<aui-field>`)             | 支援單行／多行等寬輸入；Focus 雙層光環；整合 Field 標題列（Label + 右側快捷複製／清除按鈕，沿用 `<aui-icon-button>`）。<br>**表單參與**：form-associated（`ElementInternals.setFormValue`、`required` 驗證、`formResetCallback`、`formDisabledCallback`），不支援時退回隱藏 input。<br>**標題關聯**：`<aui-field>` 將標題與描述傳入 `<aui-input>`，由 input 於自身 Shadow DOM 內完成 label／描述關聯。                                                                           |
| **TASK-207** | 元件 | `Output Row` 元件 (`<aui-output-row>`)                          | 結果展示列；左側 4px 垂直語意邊條（綠色成功／紅色錯誤）；等寬字體與長文字換行溢位防護；成功／錯誤狀態除顏色外亦以文字或 `role` 傳達。                                                                                                                                                                                                                                                                                                                                            |
| **TASK-208** | 元件 | `Segmented Control` 元件 (`<aui-segmented>`)                    | 膠囊軌道單選切換器；選中項高亮背景過渡；採 radiogroup 模式（roving tabindex：Tab 僅停留在選中項，左右方向鍵／Home／End 巡覽並自動選取）；form-associated，於 host 分派 `input` 與 `change`。                                                                                                                                                                                                                                                                                     |
| **TASK-209** | 整合 | 表單元件跨框架整合測試                                          | 於 `examples/vue3` 與 `examples/angular` 驗證：Vue 3 `v-model`（`input` 事件時讀取 host 的 `value`）與 Angular `ngModel` / `formControl`（搭配 `ngDefaultControl`）雙向同步；一併補驗 Phase 1 TASK-108 遺留的表單事件綁定（原規劃之 `(auiChange)` 改以原生 `(change)` 驗證）。                                                                                                                                                                                                   |
| **TASK-210** | 元件 | `Modal` 通用彈窗外框容器 (`<aui-modal>`)                        | 以原生 `<dialog>.showModal()` 實作（Top Layer、背景 inert、`::backdrop` 模糊遮罩）；大中小三種尺寸規格（sm/md/lg）；Header/Body/Footer 插槽；ESC 與點擊遮罩關閉（可配置）；使用 TASK-204 的捲動鎖定與焦點返還；分派可取消的 `aui-show` / `aui-hide` 與 `aui-after-show` / `aui-after-hide` 事件。                                                                                                                                                                                |
| **TASK-211** | 元件 | `Alert` 提示與確認對話框 (`<aui-alert>`, `AlertService`)        | **以 `<aui-modal>` 為基礎組成**，不重複實作焦點、捲動與 ESC 邏輯；SweetAlert2 風格成功／失敗／警告／資訊向量圖示（遵循減少動畫設定）；`AlertService.alert()` / `confirm()` / `prompt()` 回傳 Promise；Enter 確認、ESC 取消；破壞性確認的初始焦點落在取消鈕；支援於 Modal 內再開啟。                                                                                                                                                                                              |
| **TASK-212** | 元件 | `Toast Notification` 元件與服務 (`<aui-toast>`, `ToastService`) | 右下角堆疊 Viewport（Popover API 進入 Top Layer，新通知出現時重新提升至最上層，確保 Modal 開啟時仍可見可操作）；Success、Error、Warning、Info、Loading 5 種狀態；`ToastService.success('複製成功')` 等單例 API，並支援更新既有通知（如 Loading 轉 Success）；佇列管理與同時顯示上限；以 live region 播報（Error 為 `role="alert"`，其餘為 `role="status"`）；滑鼠懸停或聚焦時暫停自動關閉；單例以 `globalThis` 上的 `Symbol.for()` 共用，避免微前端重複載入時產生多個 Viewport。 |
| **TASK-213** | 展示 | 表單與回饋 Storybook 交互測試                                   | 以 `@storybook/test` 撰寫複雜表單與非同步通知的 play function 互動情境，並以 Storybook Test Runner 於 CI 對 `build-storybook` 產物執行。                                                                                                                                                                                                                                                                                                                                         |
| **TASK-214** | 工程 | CI 擴充與時間預算                                               | 新增 Visual Regression 與 Size Limit job（與既有 job 平行執行），並將 `examples/vue3`、`examples/angular` 的生產建置納入 CI；整體 PR CI 維持在 8 分鐘內完成。                                                                                                                                                                                                                                                                                                                    |

#### 交付成果 (Deliverables)

- 6 款高頻互動元件（Input & Field、Output Row、Segmented Control、Modal、Alert、Toast）與全域回饋單例服務（`ToastService`、`AlertService`）。
- 共用浮層基礎模組（捲動鎖定、焦點返還、Top Layer 堆疊）。
- 支援個別元件入口與 Tree-shaking 的建置產物。
- 雙主題截圖快照比對測試機制。
- CI Bundle Size 檢查與 PR 差異報告。
- Anchor UI **v0.2.0-beta** 版本（以 yalc 與 `npm pack` tarball 交付；正式 registry 發布於 Phase 4 TASK-405）。

#### 驗收條件 (Acceptance Criteria)

**工程防線**

- [ ] 元件庫 Tree-shaking 正常運作：消費端僅引用 Button 時，打包結果不含其他元件的程式碼（以自動化測試驗證）。
- [ ] size-limit 於 CI 逐一檢查各元件入口，超出預算（基準 +10%）時 PR 檢查失敗並留言列出差異。
- [ ] 視覺回歸測試在深淺色模式下皆通過比對，像素差異 > 0.1% 時 CI 自動阻擋；同一 commit 重跑結果一致，無偶發失敗。
- [ ] 發布產物不含測試、stories 與 `test-utils` 檔案；`package.json` 版本與 Git Tag 對齊里程碑。
- [ ] PR CI 全部 job 於 8 分鐘內完成。

**表單控制項**

- [ ] Input 與 Segmented Control 於 host 上分派 `input` 與 `change` 事件，事件觸發時 `value` 已更新；Vue 3 `v-model` 與 Angular `ngModel`（`ngDefaultControl`）皆可雙向同步。
- [ ] 表單元件可參與原生 `<form>`：提交時帶出 `name` / `value`、`required` 未填時阻擋提交、`form.reset()` 還原初始值、`<fieldset disabled>` 時一併停用。
- [ ] `<aui-field>` 的標題與描述可被讀出為輸入框的無障礙名稱與描述（以瀏覽器實際計算的無障礙樹驗證）。
- [ ] Segmented Control 可用方向鍵、Home、End 巡覽並選取，Tab 僅停留在選中項。
- [ ] Output Row 長文字安全換行、無橫向溢位，成功／錯誤狀態不只依賴顏色傳達。

**浮層與回饋**

- [ ] Toast 具備佇列管理能力，多筆通知快速觸發時依序垂直堆疊，不產生位置重疊破版；Modal 或 Alert 開啟時，Toast 仍顯示於最上層且可操作。
- [ ] Toast 以 live region 播報內容，滑鼠懸停或聚焦時暫停自動關閉（WCAG 2.2.1）。
- [ ] Modal 與 Alert 開啟時正確鎖定背景捲動（巢狀開啟時正確計數）、背景不可互動、ESC 可關閉；關閉後焦點返還至觸發元素（含位於 Shadow DOM 內的觸發元素）。

**品質基準（延續 Phase 1）**

- [ ] 所有新元件通過 `axe-core` 檢驗，無任何 WCAG 2.1 AA 違規（淺色與深色主題皆涵蓋所有變體），且可完整以鍵盤操作。
- [ ] 單元測試覆蓋率維持 statements / functions / lines ≥ 85%、branches ≥ 75%。

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

| 任務代號     | 類別 | 工作項目                                        | 說明與具體內容                                                                                                                                                                                                                                                              |
| ------------ | :--: | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-301** | 元件 | `Card & Grid` 元件 (`<aui-card>`, `.card-grid`) | 支援內在自適應格線（`auto-fill, minmax(270px, 1fr)`）；Hover 微浮凸（`translateY(-2px)`）；HOT 邊框變體；描述兩行裁切。                                                                                                                                                     |
| **TASK-302** | 元件 | `Accordion / Doc` 元件 (`<aui-accordion>`)      | 原生 `<details>`/`<summary>` 語意封裝；展開時外框平滑高亮；提供 FAQ 與使用指南預設排版。                                                                                                                                                                                    |
| **TASK-303** | 元件 | `Dropzone` 元件 (`<aui-dropzone>`)              | 虛線框拖曳上傳；Dragover 狀態琥珀金染色；點擊觸發原生檔案選取器；檔案格式過濾與提示。                                                                                                                                                                                       |
| **TASK-304** | 元件 | `Favorite Toggle Button` (`<aui-favorite-btn>`) | 星號收藏按鈕；點擊微縮放彈跳動態；已收藏狀態實心琥珀金高亮與事件拋出。                                                                                                                                                                                                      |
| **TASK-305** | 元件 | `Header` 複合元件 (`<aui-header>`)              | 整合 Tag 標籤、HOT 徽標、H1 主標題、我的最愛收藏鈕與簡述文字的統一頁首容器。                                                                                                                                                                                                |
| **TASK-306** | 元件 | `Kbd` 鍵帽微元件 (`<aui-kbd>`)                  | 鍵盤按鍵微元件，等寬字體微立體邊框風格，用於介面操作指引。                                                                                                                                                                                                                  |
| **TASK-307** | 工程 | **跨框架 CI 整合冒煙測試**                      | 範例專案的生產建置已於 Phase 2 TASK-214 納入 CI；本任務於 GitHub Actions 建立矩陣工作流（Matrix Workflow），每次發起 PR 時以 `npm pack` 產出的 tarball 安裝至 Vue 3 與 Angular 小型專案並建置，驗證實際發布產物（`exports`、`sideEffects`、型別宣告），提早抓出破壞性變更。 |
| **TASK-308** | 工程 | **Storybook 自動化預覽部署 (Preview CD)**       | 建置 GitHub Actions 部署腳本：<br>1. PR 建立時自動建置 Storybook 並發布至預覽環境（如 GitHub Pages 或臨時預覽站點），自動留言 PR 預覽連結。<br>2. `main` 分支更新時自動發布最新版線上元件文檔庫。                                                                           |

#### 交付成果 (Deliverables)

- 6 款業務複合型元件。
- 完整「工具原型頁面」Storybook 展示案例（展示 Header + Dropzone + Input + Output + Accordion 組合）。
- 具備 PR 自動留言預覽網址的 Storybook CD 流程。
- Anchor UI **v0.3.0** 版本。

#### 驗收條件 (Acceptance Criteria)

- [ ] `Card` 在不同容器寬度下自動排版填滿，縮放視窗無橫向溢位破版。
- [ ] `FileUpload Dropzone` 拖放外部檔案（如 JSON、圖片）能正確截獲 File 物件並拋出 `file-drop` 事件。
- [ ] 每個 PR 均會自動產生獨立的 Storybook 預覽連結，供團隊即時檢驗視覺與互動。
- [ ] 跨框架 CI 冒煙測試成功跑過 Vue 3 與 Angular 的生產編譯。

---

### Phase 4：進階功能、獨立導覽抽屜與 CD 正式發布 (Advanced Features, Navigation & CD)

- **階段定位**：完成進階代碼檢視區與獨立導覽抽屜元件（Drawer、Navbar、Footer），建立全自動化 CD 發布管線，並於正式業務專案鎖版導入。
- **預估工期**：2.5 ~ 3.0 週
- **主要目標**：
  1. 實作 IDE 風格程式碼檢視區（Sticky 行號與摺疊）。
  2. 實作獨立的可收合側邊抽屜（Drawer: `<aui-drawer>`），支援左右側滑出與遮罩鎖定，不綁死特定版型，可自由嵌入各專案。
  3. 實作獨立的站台頂部導覽列（Navbar: `<aui-navbar>`）與通用頁尾（Footer: `<aui-footer>`），提供品牌統一視覺基底。
  4. **建立基於 Changesets 的 CD 自動化語意發布流水線，發布至私有 npm / GitHub Packages**。
  5. 選定第一個業務專案正式安裝導入，完成生產環境驗證。

#### 任務拆解 (Task Breakdown)

| 任務代號     | 類別 | 工作項目                               | 說明與具體內容                                                                                                                                                                                                                                                                                                            |
| ------------ | :--: | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TASK-401** | 元件 | `Code View` 元件 (`<aui-code-view>`)   | 等寬代碼預覽；左側 Sticky 黏性行號列（水平捲動行號不位移）；支援程式碼區塊折疊展開。                                                                                                                                                                                                                                      |
| **TASK-402** | 元件 | `Drawer` 側邊抽屜元件 (`<aui-drawer>`) | 獨立可收合側欄（Off-canvas Drawer）；支援左右側滑出（`placement="left" \| "right"`）；遮罩與背景捲動鎖定；不綁死特定 Layout 版型，可靈活嵌入各專案。                                                                                                                                                                      |
| **TASK-403** | 元件 | `Navbar` 頂部導覽列 (`<aui-navbar>`)   | 64px 獨立頂部導覽列；整合 Logo（Accent 圓點）、搜尋按鈕（內嵌 ⌘K 鍵帽）、導覽選單與主題切換開關。                                                                                                                                                                                                                         |
| **TASK-404** | 元件 | `Footer` 通用頁尾 (`<aui-footer>`)     | 獨立通用頁尾；版權聲明、版本資訊、外部連結與次要選單插槽；支援 Minimal 與 Columns 自適應排版。                                                                                                                                                                                                                            |
| **TASK-405** | 工程 | **CD 自動化發布管線建立 (Changesets)** | 導入 **`@changesets/cli`** + GitHub Actions：<br>1. 開發者發起 PR 時透過 `pnpm changeset` 記錄變更類型（patch/minor/major）。<br>2. 合併進 `main` 時，自動產生 Version PR。<br>3. Version PR 合併後，CD 自動更新 `package.json`、生成 `CHANGELOG.md`、上 Git Tag，並自動 `npm publish` 發布至私有 npm / GitHub Packages。 |
| **TASK-406** | 工程 | **相依性安全掃描與合規審查**           | 配置 **Dependabot**（或 Snyk）與 CI 流程之 `npm audit --production`，設定安全性漏洞阻擋機制。                                                                                                                                                                                                                             |
| **TASK-407** | 導入 | 跨專案正式導入與版本鎖定驗證           | 選定一個實際專案（如 ToolBox 前端）正式安裝 `@my-org/anchor-ui@1.0.0`，驗證正式環境打包與運行。                                                                                                                                                                                                                           |
| **TASK-408** | 文檔 | 元件庫使用手冊與 API 文件交付          | 完善 Readme、Storybook 互動文檔、Vue 3 / Angular 安裝指南與升級遷移手冊。                                                                                                                                                                                                                                                 |

#### 交付成果 (Deliverables)

- 完整 20 款獨立共用元件與全域服務（對齊 components-list.md）。
- 全自動化發布流水線（CD），具備 SemVer 與自動 CHANGELOG 生成。
- **Anchor UI v1.0.0 正式穩定版** 發布至私有 npm。
- 第一個業務專案成功導入並上線運作。

#### 驗收條件 (Acceptance Criteria)

- [ ] 業務專案透過 `npm install @my-org/anchor-ui` 安裝後能順利編譯通過生產打包（Production Build）。
- [ ] `Code View` 載入萬行代碼時捲動順暢無卡頓，Sticky 行號定位精準。
- [ ] `Drawer`、`Navbar` 與 `Footer` 能作為獨立元件自由嵌入不同專案頁面中，Drawer 展開與收合平滑無殘影，Navbar 具備正常吸頂與主題切換事件驅動。
- [ ] 透過 CD 流水線發布版本全程無人為介入，CHANGELOG 內容與 Git Tag 準確對齊。
- [ ] `npm audit` 檢驗結果為 0 High / 0 Critical 漏洞。

---

## 三、各階段工期估算與里程碑檢核表 (Timeline & Milestones)

|    階段     | 階段主題                        | 包含核心工程任務                                                | 預估工期 | 累計工期 |         版本里程碑         | 關鍵檢核條件 (Gate Criteria)                                                                     |
| :---------: | ------------------------------- | --------------------------------------------------------------- | :------: | :------: | :------------------------: | ------------------------------------------------------------------------------------------------ |
| **Phase 0** | 基礎建設、Tokens 與工程管線     | ESLint/Stylelint、Pre-commit（Husky+Commitlint）、PR 基礎 CI    |  1.5 週  |  1.5 週  |          `v0.0.1`          | Tokens 獨立打包發布、Pre-commit 生效、PR 基礎 CI 通過。                                          |
| **Phase 1** | 技術驗證、最小可用原子與測試    | 單元測試框架、a11y 自動化檢測、Vue 3 / Angular yalc 軟連結      |  2.0 週  |  3.5 週  |       `v0.1.0-alpha`       | 雙框架整合測試通過、單元測試覆蓋率 ≥ 85%、通過 WCAG AA 檢測。                                    |
| **Phase 2** | 高頻互動控制項、回饋與視覺 QA   | Tree-shaking 建置架構、Bundle Size 門禁、視覺回歸、共用浮層模組 |  4.5 週  |  8.0 週  |       `v0.2.0-beta`        | 表單可與 Vue 3 / Angular 雙向綁定、視覺回歸差異 ≤ 0.1%、體積不超出預算、單獨引用不夾帶其他元件。 |
| **Phase 3** | 業務複合元件與自動化預覽        | 跨框架 CI 冒煙測試、Storybook 自動化 PR 預覽部署                |  2.5 週  | 10.5 週  |          `v0.3.0`          | 組裝出完整工具頁、PR 自動產出 Storybook 預覽連結。                                               |
| **Phase 4** | 進階功能、獨立導覽抽屜與正式 CD | Changesets CD 自動發布、Dependabot 安全掃描、業務專案導入       |  3.0 週  | 13.5 週  | **`v1.0.0`**<br>_(正式版)_ | 私有 npm 自動發布成功、業務專案生產上線、0 漏洞。                                                |

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

1. **Version Bump**：合併至 `main` 後，Changesets 依據 PR 記錄之 changeset 自動建立版本更新 PR。
2. **Release & Tag**：Version PR 合併後，CD 自動建立 Git Tag、更新 `CHANGELOG.md`。
3. **Package Publishing**：自動發布產物至私有 npm registry 或 GitHub Packages，並將最新 Storybook 發布至線上文檔庫。
4. **Lockstep Deployment**：通知消費端專案可鎖版升級至新版本。

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
