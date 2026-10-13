# Anchor UI — 前端共用元件庫規劃文件

> 本文件承接 [`design-system.md`]（樣式系統規範）與 [`anchor-ui-components-list.md`]（共用元件規格清單），作為建立跨專案共用元件庫的架構與技術規劃。

---

## 一、專案定位

- 跨專案共用的 UI 元件庫，目標是讓未來每個新專案（前端）都能直接安裝使用，減少重複造輪子並維持視覺風格一致。
- 以 [`design-system.md`] 的 Design Tokens 與 [`anchor-ui-components-list.md`] 定義的 **20 項獨立共用元件** 為單一事實來源（Single Source of Truth）。
- 堅持「**輕量、非綁定式**」理念：移除整頁版型（Layout）容器，將抽屜（Drawer）、頂部導覽（Navbar）、頁尾（Footer）解耦為獨立元件，彈窗拆分為通用外框容器（Modal）與提示對話框（Alert），讓各專案保有最大彈性。
- 採階段性推進與自動化驗證，隨實際需求逐步擴充（避免過度工程，詳見第五與第六節）。

---

## 二、技術選型

| 層級          | 技術                            | 說明                                                                   |
| ------------- | ------------------------------- | ---------------------------------------------------------------------- |
| Design Tokens | 純 CSS Custom Properties        | 完全框架無關，直接沿用 design-system.md 變數系統，任何專案都能單獨引用 |
| 互動元件      | Web Component (以 **Lit** 實作) | 一份程式碼可在 Vue 3、Angular 與 React 等前端框架中共用                |
| 打包工具      | Vite (library mode)             | 產出符合 Web Component 的 ES Module + CSS，支援 tree-shaking           |
| 型別          | TypeScript                      | 元件 props/events 型別定義，跨框架使用時也有型別提示                   |
| 元件展示      | Storybook                       | 元件展示、文檔化與視覺回歸測試                                         |

**跨框架整合注意事項**

- Vue 3：需在 `vite.config` 設定 `compilerOptions.isCustomElement` 排除自訂元素的編譯檢查。
- Angular：需在對應 Module 加入 `CUSTOM_ELEMENTS_SCHEMA`，並留意 property vs attribute 綁定差異。

---

## 三、專案結構

依據模組化與獨立元件原則組織專案目錄：

```text
anchor-ui/
├── src/
│   ├── tokens/                  # Design Tokens 根源（色彩、文字、間距、圓角、動態）
│   │   ├── _colors.scss
│   │   ├── _typography.scss
│   │   ├── _spacing.scss
│   │   ├── _radius.scss
│   │   ├── _motion.scss
│   │   └── index.scss
│   ├── base/                    # 全域基底（Reset / Focus / Utilities）
│   ├── components/              # Lit Web Component 元件（共 20 項獨立共用元件）
│   │   ├── button/              # <aui-button>
│   │   ├── icon-button/         # <aui-icon-button>
│   │   ├── tag/                 # <aui-tag>
│   │   ├── segmented/           # <aui-segmented>
│   │   ├── kbd/                 # <aui-kbd>
│   │   ├── input/               # <aui-input>, <aui-field>
│   │   ├── output-row/          # <aui-output-row>
│   │   ├── tooltip/             # <aui-tooltip>
│   │   ├── toast/               # <aui-toast>, ToastService
│   │   ├── modal/               # <aui-modal> (通用彈窗外框容器)
│   │   ├── alert/               # <aui-alert>, AlertService (提示與確認對話框)
│   │   ├── card/                # <aui-card>
│   │   ├── accordion/           # <aui-accordion>
│   │   ├── dropzone/            # <aui-dropzone>
│   │   ├── favorite-btn/        # <aui-favorite-btn>
│   │   ├── code-view/           # <aui-code-view>
│   │   ├── header/              # <aui-header>
│   │   ├── drawer/              # <aui-drawer> (獨立可收合抽屜側邊欄)
│   │   ├── navbar/              # <aui-navbar> (獨立頂部導覽列)
│   │   └── footer/              # <aui-footer> (獨立通用頁尾)
│   └── index.ts                 # 套件入口匯出
├── package.json
└── tsconfig.json
```

---

## 四、發佈與版本管理策略

採用 **npm 私有套件**，搭配 **yalc 做開發期同步** 與 **Changesets 自動化發布**：

1. **開發階段**：本機使用 `yalc publish` + `yalc add` 將 anchor-ui 軟連結進正在開發的 Vue 3 / Angular 專案，即時測試、快速迭代。
2. **正式版本**：穩定後透過 Changesets 自動化流水線以 SemVer 發佈為私有 scoped package（如 `@my-org/anchor-ui`）至私有 npm 或 GitHub Packages。
3. **Client 端安裝**：各專案以精確鎖定版本方式安裝（如 `@my-org/anchor-ui@1.0.0`），避免非預期 breaking change。
4. **升級紀錄**：版本升級時於 CHANGELOG 中詳實記錄變更，client 端專案自行決定升級時機。

---

## 五、分階段開發計畫 (Phase 0 ~ Phase 4)

對齊 [`anchor-ui-development-schedule.md`] 的工程劃分，將 20 項元件與工程基建拆解為 5 個階段：

- **Phase 0 — 基礎建設、Tokens 系統與工程管線**
  - 建置 Design Tokens SCSS、CSS 變數字典、雙主題（`data-theme="dark"`）機制。
  - 配置 Minimal Reset、雙層焦點環（`:focus-visible`）與 Husky + Commitlint + GitHub Actions CI 防線。

- **Phase 1 — 技術驗證、最小可用原子與測試基底 (4 款元件)**
  - 實作 4 個高頻核心原子：Button、Tag、Tooltip、Icon Button。
  - 建立 Vitest/Web Test Runner 單元測試與 axe-core 無障礙自動化檢驗。
  - 透過 `yalc` 接入實際 Vue 3 / Angular 專案驗證屬性、事件與主題響應。

- **Phase 2 — 高頻互動控制項、核心回饋與視覺回歸 (6 款元件)**
  - 工程防線先行：調整建置架構使 Tree-shaking 生效（個別元件入口），導入 Bundle 體積門禁與視覺回歸測試（Visual Regression），並建立共用浮層基礎模組。
  - 實作 Input & Field、Output Row、Segmented Control，可參與原生表單並與 Vue 3 / Angular 表單機制雙向綁定。
  - **實作獨立的 Modal（通用彈窗外框容器）與以 Modal 為基礎的 Alert（提示與確認對話框服務）**。
  - 實作全域 Toast 通知服務（`ToastService`），於 Top Layer 顯示，Modal 開啟期間移入 modal 子樹以確保仍可見、可操作且可被播報。

- **Phase 3 — 業務複合型元件與自動化預覽 (6 款元件)**
  - 實作 Card、Accordion、FileUpload Dropzone、Favorite Toggle、Header、Kbd。
  - 建立跨框架 CI 整合冒煙測試與 Storybook PR 自動化預覽站點。

- **Phase 4 — 進階功能、獨立導覽抽屜與 CD 正式發布 (4 款元件)**
  - 實作 IDE 風格 Code View（Sticky 行號與摺疊）。
  - **實作獨立導覽抽屜元件：Drawer（可收合抽屜側邊欄）、Navbar（頂部導覽列）、Footer（通用頁尾）**，不綁死整體頁面 Layout，可自由嵌入各業務專案。
  - 建立 Changesets CD 自動化發布流水線，發布 v1.0.0 正式版，並於實際業務專案鎖版導入。

---

## 六、暫不涵蓋範圍 (避免過度工程)

- **移除整體頁面版型 (Layout)**：各專案版型（如雙欄、單欄、儀表板）結構差異大，Anchor UI 僅提供獨立的 Drawer、Navbar、Footer 元件，不封裝整體 Layout 容器，保留各專案佈局自由度。
- **全域指令面板 (Command Palette)**：不在第一期 20 項核心元件清單中，暫不預先實作，後續視各專案高階搜尋需求另行規劃。
- **複雜表單業務邏輯**：如多步驟表單流程、複雜動態驗證規則，由各專案以各自框架方式實作，元件庫僅提供基礎表單控制項與外觀。
- **公開發布/開源**：初期以組織內部私有套件形式維護，不對外公開發布。

---
