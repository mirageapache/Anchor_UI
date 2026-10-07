# 前端共用元件庫樣式系統規範 (Design System & Style Guide)

> **版本**：v0.1.0  
> **適用範圍**：前端共用元件庫（Shared UI Component Library）與跨專案基底樣式  
> **核心風格**：工具導向 (Utility-First)、現代精準 (Precision & Slate-Navy Aesthetic)、高可存取性 (WCAG AA/AAA)

---

## 目錄

- [一、設計哲學與視覺定位](#一設計哲學與視覺定位)
- [二、Design Tokens 完整字典 (CSS Custom Properties)](#二design-tokens-完整字典-css-custom-properties)
  - [2.1 主題色彩 (Color Tokens)](#21-主題色彩-color-tokens)
  - [2.2 字型與文字階層 (Typography Tokens)](#22-字型與文字階層-typography-tokens)
  - [2.3 間距系統 (Spacing Scale)](#23-間距系統-spacing-scale)
  - [2.4 圓角系統 (Border Radius)](#24-圓角系統-border-radius)
  - [2.5 版面與動態 (Layout & Motion)](#25-版面與動態-layout--motion)
- [三、全域基底樣式 (Global Base & Utilities)](#三全域基底樣式-global-base--utilities)
  - [3.1 Minimal Reset](#31-minimal-reset)
  - [3.2 無障礙焦點環 (Accessible Focus Ring)](#32-無障礙焦點環-accessible-focus-ring)
  - [3.3 輔助 Utilities (.sr-only, .section-label, .container)](#33-輔助-utilities)
- [四、原子級元件規範 (Atoms & Primitives)](#四原子級元件規範-atoms--primitives)
  - [4.1 按鈕系統 (Buttons: Primary / Accent / Ghost / Danger)](#41-按鈕系統-buttons)
  - [4.2 分段控制器 (Segmented Control & Mode Switch)](#42-分段控制器-segmented-control)
  - [4.3 圖示操作鈕 (Icon Buttons: Copy & Download)](#43-圖示操作鈕-icon-buttons)
  - [4.4 標籤系統 (Category Tags & Badges)](#44-標籤系統-category-tags--badges)
  - [4.5 輸入框與表單欄位 (Inputs & Field Layouts)](#45-輸入框與表單欄位-inputs--field-layouts)
  - [4.6 輸出框與程式碼檢視 (Output Rows & Code View)](#46-輸出框與程式碼檢視-output-rows--code-view)
- [五、複合型與浮層元件規範 (Molecules, Organisms & Overlays)](#五複合型與浮層元件規範-molecules-organisms--overlays)
  - [5.1 卡片 (Card & Responsive Grid)](#51-卡片-card)
  - [5.2 拖放檔案上傳區 (Dropzone)](#52-拖放檔案上傳區-dropzone)
  - [5.3 標頭列 (Header)](#53-標頭列-header)
  - [5.4 手風琴說明與 FAQ (Doc / Accordion)](#54-手風琴說明與-faq-doc-accordion)
  - [5.5 懸浮氣泡提示 (Tooltip)](#55-懸浮氣泡提示-tooltip)
  - [5.6 吐司通知 (Toast Notification System)](#56-吐司通知-toast-notification-system)
  - [5.7 通用彈窗外框容器 (Modal)](#57-通用彈窗外框容器-modal)
  - [5.8 提示與確認對話框 (Alert)](#58-提示與確認對話框-alert)
  - [5.9 可收合抽屜側邊欄 (Drawer)](#59-可收合抽屜側邊欄-drawer)
  - [5.10 頂部導覽列 (Navbar)](#510-頂部導覽列-navbar)
  - [5.11 通用頁尾 (Footer)](#511-通用頁尾-footer)
- [六、前端共用元件專案建置與發佈指南](#六前端共用元件專案建置與發佈指南)

---

## 一、設計哲學與視覺定位

1. **工具感與精準性優先 (Utility-First & Precision)**
   - 使用者帶著明確目的與高效率需求而來，介面重視高資訊密度、乾淨無干擾、邊框明晰與字元精準對齊。
   - 拒絕過度裝飾的厚重視覺或圓潤插畫，強調俐落的幾何結構與狀態反饋。
2. **Signature Element (識別元素)**
   - **等寬語意標籤 (Monospace Semantic Tokens)**：工具分類、程式碼、技術標記使用 `JetBrains Mono` 搭配語意色彩低飽和背景（Dim Background）與微透明邊框，營造如現代 IDE 語法高亮般的專業感。
3. **無縫雙主題 (Dual Theme: Light / Dark)**
   - **Light Mode**：以現代 Slate-50（`#f8fafc`）為基底，結合純白卡片（`#ffffff`）與深海軍藍主調，清爽不刺眼。
   - **Dark Mode**：以 Slate-900（`#0f172a`）深邃冷黑為底，搭配 Slate-800（`#1e293b`）與加亮的天空藍/翠綠語意色，層次鮮明。
   - 由 `<html>` 的 `data-theme="dark"` 屬性驅動 CSS Custom Properties，支援執行期零重新渲染切換，平滑過渡（`200ms ease`）。
4. **無障礙高對比保證 (Accessibility Standards)**
   - 嚴格遵守 WCAG 2.1 AA/AAA 規範，明亮色與暗色模式的文字/背景對比度均達 4.5:1（重要輸出與標題達 7:1 以上）。
   - 觸控目標尺寸明確規範：圖示按鈕 ≥ 32×32px，主要操作鈕 ≥ 40px，行動端漢堡鈕 ≥ 44×44px。
   - 支援 `prefers-reduced-motion: reduce`，全站動態過渡自動降為 0ms。

---

## 二、Design Tokens 完整字典 (CSS Custom Properties)

樣式系統的單一事實來源（Single Source of Truth），所有共用元件均使用這些 CSS 變數定義外觀。

### 2.1 主題色彩 (Color Tokens)

```scss
/* ─── 預設淺色模式 (Light Mode: :root) ─── */
:root {
  color-scheme: light;

  /* Brand Primary (海軍藍主色系) */
  --color-brand-50: #f0f6fa;
  --color-brand-100: #ddecf6;
  --color-brand-500: #1b6ca8;
  --color-brand-600: #0f4c81; // 品牌核心主色
  --color-brand-700: #0a3356;
  --color-brand-800: #07223b;
  --color-brand-dim: color-mix(in srgb, var(--color-brand-600) 12%, transparent);
  --color-brand-border: color-mix(in srgb, var(--color-brand-600) 25%, transparent);
  --color-brand-text: var(--color-brand-600); // 品牌文字色 (海軍藍)

  /* Background / Surface (表面與背景層級) */
  --color-base: #ffffff; // 輸入框、程式區塊底色
  --color-bg: #f8fafc; // 全站頁面背景 (Slate-50)
  --color-surface: #f1f5f9; // 側欄、分段控制器軌道、次要容器 (Slate-100)
  --color-surface-plus: #ffffff; // 工具卡片背景 (浮凸一階)
  --color-border: #e2e8f0; // 分隔線、一般邊框 (Slate-200)
  --color-ghost-border: #cbd5e1; // Ghost 按鈕邊框 (Slate-300，確保清晰度)
  --color-output-bg: #f0fdf4; // 成功輸出框淺綠底色 (Emerald-50)
  --color-output-placeholder: var(--color-text-muted);
  --color-error-bg: #fef2f2; // 錯誤輸出框淺紅底色 (Red-50)

  /* Text (文字階層) */
  --color-text-primary: #0f172a; // 主標題、內文、輸入文字 (Slate-900)
  --color-text-secondary: #475569; // 卡片描述、輔助說明 (Slate-600)
  --color-text-muted: #64748b; // Placeholder、中繼標籤 (Slate-500)

  /* Tooltip (反白浮層：淺色底上的冷黑氣泡) */
  --color-tooltip-bg: #0f172a; // Slate-900
  --color-tooltip-text: #f8fafc; // Slate-50 (WCAG AAA)
  --color-tooltip-border: rgb(255 255 255 / 14%);

  /* ─── 語意與狀態色完整系統 (Semantic Status & Actions) ─── */

  /* 1. Danger (Red): 錯誤、刪除、危險操作 */
  --color-danger: #ef4444; // Red 500: 主狀態色
  --color-danger-hover: #dc2626; // Red 600: 懸停態 (加深)
  --color-danger-light: #f87171; // Red 400: 次級裝飾、淺態
  --color-danger-text: #b91c1c; // Red 700: 淺底高對比文字 (WCAG AA > 4.5:1)
  --color-danger-dim: color-mix(in srgb, var(--color-danger) 10%, transparent);
  --color-danger-border: color-mix(in srgb, var(--color-danger) 25%, transparent);
  --color-danger-solid: #dc2626; // Red 600: 實心按鈕底色 (白字 4.83:1 AA)
  --color-danger-solid-hover: #b91c1c; // Red 700: 實心按鈕懸停 (白字 6.47:1)

  /* 2. Warning (Amber): 效能警告、提示、星號收藏、HOT 徽章 (統一整併 Accent) */
  --color-warning: #f59e0b; // Amber 500: 主狀態色
  --color-warning-hover: #d97706; // Amber 600: 懸停態 (加深)
  --color-warning-light: #fbbf24; // Amber 400: 次級裝飾、淺態
  --color-warning-text: #b45309; // Amber 700: 淺底高對比文字 (WCAG AA > 4.5:1)
  --color-warning-dim: color-mix(in srgb, var(--color-warning) 14%, transparent);
  --color-warning-border: color-mix(in srgb, var(--color-warning) 30%, transparent);

  /* 3. Success (Emerald): 成功輸出、就緒狀態、複製成功 */
  --color-success: #10b981; // Emerald 500: 主狀態色
  --color-success-hover: #059669; // Emerald 600: 懸停態 (加深)
  --color-success-light: #34d399; // Emerald 400: 次級裝飾、淺態
  --color-success-text: #047857; // Emerald 700: 淺底深綠輸出文字 (WCAG AA > 4.5:1)
  --color-success-dim: color-mix(in srgb, var(--color-success) 10%, transparent);
  --color-success-border: color-mix(in srgb, var(--color-success) 28%, transparent);
  --color-success-solid: #047857; // Emerald 700: 實心按鈕底色 (白字 5.48:1 AA)
  --color-success-solid-hover: #065f46; // Emerald 800: 實心按鈕懸停 (白字 7.68:1)

  /* 4. Info (Sky Blue): 資訊提示、Tooltip、系統導覽 */
  --color-info: #0284c7; // Sky 600: 主狀態色
  --color-info-hover: #0369a1; // Sky 700: 懸停態 (加深)
  --color-info-light: #38bdf8; // Sky 400: 次級裝飾、淺態
  --color-info-text: #0369a1; // Sky 700: 淺底高對比文字 (WCAG AA > 4.5:1)
  --color-info-dim: color-mix(in srgb, var(--color-info) 12%, transparent);
  --color-info-border: color-mix(in srgb, var(--color-info) 25%, transparent);

  /* 5. Purple (Violet): WASM、進階演算法、特化工具標示 */
  --color-purple: #8b5cf6; // Violet 500: 主狀態色
  --color-purple-hover: #7c3aed; // Violet 600: 懸停態 (加深)
  --color-purple-light: #a78bfa; // Violet 400: 次級裝飾、淺態
  --color-purple-text: #6d28d9; // Violet 700: 淺底高對比文字 (WCAG AA > 4.5:1)
  --color-purple-dim: color-mix(in srgb, var(--color-purple) 12%, transparent);
  --color-purple-border: color-mix(in srgb, var(--color-purple) 25%, transparent);

  /* 6. Neutral (Slate): 次要中性分類、一般停用/草稿狀態 */
  --color-neutral: #64748b; // Slate 500: 主狀態色
  --color-neutral-hover: #475569; // Slate 600: 懸停態 (加深)
  --color-neutral-light: #94a3b8; // Slate 400: 次級裝飾、淺態
  --color-neutral-text: #334155; // Slate 700: 淺底次要中性文字 (WCAG AA > 4.5:1)
  --color-neutral-dim: color-mix(in srgb, var(--color-neutral) 10%, transparent);
  --color-neutral-border: color-mix(in srgb, var(--color-neutral) 22%, transparent);

  /* 向下相容別名 (Alias: accent 統一映射至 warning) */
  --color-accent: var(--color-warning);
  --color-accent-hover: var(--color-warning-hover);
  --color-accent-light: var(--color-warning-light);
  --color-accent-text: var(--color-warning-text);
  --color-accent-dim: var(--color-warning-dim);
  --color-accent-border: var(--color-warning-border);
}

/* ─── 深色模式 (Dark Mode: [data-theme="dark"]) ─── */
[data-theme='dark'] {
  color-scheme: dark;

  /* Brand Primary (加亮的海軍藍) */
  --color-brand-50: #0b1f33;
  --color-brand-100: #102f4c;
  --color-brand-500: #38bdf8;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #0c4a6e;
  --color-brand-dim: color-mix(in srgb, var(--color-brand-500) 15%, transparent);
  --color-brand-border: color-mix(in srgb, var(--color-brand-500) 30%, transparent);
  --color-brand-text: var(--color-brand-500); // 品牌文字色 (加亮淺天藍)

  /* Background / Surface */
  --color-base: #1e293b; // Slate-800
  --color-bg: #0f172a; // Slate-900 (深邃黑底)
  --color-surface: #1e293b; // Slate-800
  --color-surface-plus: #334155; // Slate-700 (卡片背景)
  --color-border: #334155;
  --color-ghost-border: #475569;
  --color-output-bg: #064e3b; // 深翠綠底色
  --color-output-placeholder: #6ee7b7; // Emerald-300: 清晰翠綠提示 (WCAG AA 6.38:1)
  --color-error-bg: #450a0a; // 深紅底色

  /* Text */
  --color-text-primary: #f8fafc; // Slate-50
  --color-text-secondary: #94a3b8; // Slate-400
  --color-text-muted: #64748b; // Slate-500

  /* Tooltip (深色底上提亮一階，與頁面背景區隔) */
  --color-tooltip-bg: #1e293b; // Slate-800
  --color-tooltip-text: #f8fafc; // Slate-50 (WCAG AAA)
  --color-tooltip-border: rgb(255 255 255 / 18%);

  /* ─── 語意與狀態色 (Dark Mode: 提升亮度確保清晰度與對比度) ─── */

  /* 1. Danger (Red) */
  --color-danger: #f87171; // Red 400
  --color-danger-hover: #fca5a5; // Red 300 (暗色 hover 調亮)
  --color-danger-light: #fecaca; // Red 200
  --color-danger-text: #fecaca; // Red 200 (WCAG AAA)
  --color-danger-dim: color-mix(in srgb, var(--color-danger) 15%, transparent);
  --color-danger-border: color-mix(in srgb, var(--color-danger) 30%, transparent);
  // 實心按鈕為白字，暗色模式不套用「hover 調亮」原則，維持與淺色相同以確保 AA 對比
  --color-danger-solid: #dc2626; // Red 600 (白字 4.83:1)
  --color-danger-solid-hover: #b91c1c; // Red 700 (白字 6.47:1)

  /* 2. Warning (Amber) */
  --color-warning: #fbbf24; // Amber 400
  --color-warning-hover: #fcd34d; // Amber 300 (暗色 hover 調亮)
  --color-warning-light: #fde68a; // Amber 200
  --color-warning-text: #fde68a; // Amber 200 (WCAG AAA)
  --color-warning-dim: color-mix(in srgb, var(--color-warning) 18%, transparent);
  --color-warning-border: color-mix(in srgb, var(--color-warning) 35%, transparent);

  /* 3. Success (Emerald) */
  --color-success: #34d399; // Emerald 400
  --color-success-hover: #6ee7b7; // Emerald 300 (暗色 hover 調亮)
  --color-success-light: #a7f3d0; // Emerald 200
  --color-success-text: #a7f3d0; // Emerald 200 (WCAG AAA 7.58:1)
  --color-success-dim: color-mix(in srgb, var(--color-success) 15%, transparent);
  --color-success-border: color-mix(in srgb, var(--color-success) 30%, transparent);
  // 實心按鈕為白字，暗色模式維持與淺色相同以確保 AA 對比
  --color-success-solid: #047857; // Emerald 700 (白字 5.48:1)
  --color-success-solid-hover: #065f46; // Emerald 800 (白字 7.68:1)

  /* 4. Info (Sky Blue) */
  --color-info: #38bdf8; // Sky 400
  --color-info-hover: #7dd3fc; // Sky 300 (暗色 hover 調亮)
  --color-info-light: #bae6fd; // Sky 200
  --color-info-text: #bae6fd; // Sky 200 (WCAG AAA)
  --color-info-dim: color-mix(in srgb, var(--color-info) 15%, transparent);
  --color-info-border: color-mix(in srgb, var(--color-info) 30%, transparent);

  /* 5. Purple (Violet) */
  --color-purple: #a78bfa; // Violet 400
  --color-purple-hover: #c4b5fd; // Violet 300 (暗色 hover 調亮)
  --color-purple-light: #ddd6fe; // Violet 200
  --color-purple-text: #ddd6fe; // Violet 200 (WCAG AAA)
  --color-purple-dim: color-mix(in srgb, var(--color-purple) 15%, transparent);
  --color-purple-border: color-mix(in srgb, var(--color-purple) 30%, transparent);

  /* 6. Neutral (Slate) */
  --color-neutral: #94a3b8; // Slate 400
  --color-neutral-hover: #cbd5e1; // Slate 300 (暗色 hover 調亮)
  --color-neutral-light: #e2e8f0; // Slate 200
  --color-neutral-text: #e2e8f0; // Slate 200 (WCAG AAA)
  --color-neutral-dim: color-mix(in srgb, var(--color-neutral) 12%, transparent);
  --color-neutral-border: color-mix(in srgb, var(--color-neutral) 25%, transparent);

  /* 向下相容別名 (Alias: accent 統一映射至 warning) */
  --color-accent: var(--color-warning);
  --color-accent-hover: var(--color-warning-hover);
  --color-accent-light: var(--color-warning-light);
  --color-accent-text: var(--color-warning-text);
  --color-accent-dim: var(--color-warning-dim);
  --color-accent-border: var(--color-warning-border);
}
```

---

### 2.2 字型與文字階層 (Typography Tokens)

採用對齊 **Tailwind CSS** 的標準字體尺度（Type Scale）、行高（Leading）與字重（Font Weight），為跨專案導入提供通用的文字階層：

```scss
:root {
  /* 字型家族 (Font Families) */
  --font-ui: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace;

  /* Tailwind CSS 標準字體階層 (Font Sizes) */
  --text-2xs: 0.6875rem; // 11px: 微型標籤、區塊微標籤、次要徽章
  --text-xs: 0.75rem; // 12px: 輔助說明、次要標註、Tooltip、卡片描述
  --text-sm: 0.875rem; // 14px: 主要內文、控制項、表單輸入/輸出、代碼區、按鈕
  --text-base: 1rem; // 16px: 標準內文、彈窗/面板輸入框、卡片標題
  --text-lg: 1.125rem; // 18px: 強調段落、副標題
  --text-xl: 1.25rem; // 20px: 區塊與分組標題 (H3)
  --text-2xl: 1.5rem; // 24px: 彈窗標題、小頁首 (H2)
  --text-3xl: 1.875rem; // 30px: 頁面主標題 (H1)
  --text-4xl: 2.25rem; // 36px: 大型展示標題、Hero Text
  --text-5xl: 3rem; // 48px: 超大數字/重點數據展示

  /* 字重 (Font Weights) - 對齊 Tailwind CSS */
  --weight-medium: 500; // font-medium
  --weight-semibold: 600; // font-semibold
  --weight-bold: 700; // font-bold
  --weight-black: 900; // font-black

  /* 行高 (Line Heights) - 對齊 Tailwind CSS */
  --leading-none: 1; // leading-none: 徽章、圖標
  --leading-tight: 1.25; // leading-tight: 大標題 (H1, H2)
  --leading-snug: 1.375; // leading-snug: 卡片標題、Modal 大標
  --leading-normal: 1.5; // leading-normal: 標準文字段落
  --leading-relaxed: 1.625; // leading-relaxed: 長篇閱讀文章、說明文件
  --leading-loose: 2; // leading-loose: 鬆散代碼與清單
}
```

| Token         | rem         | px     | Tailwind Utility | 典型用途                                                                   |
| ------------- | ----------- | ------ | ---------------- | -------------------------------------------------------------------------- |
| `--text-2xs`  | `0.6875rem` | `11px` | `text-2xs`       | 分類 Tag (`.tag`)、大寫微標籤 (`.section-label`)                           |
| `--text-xs`   | `0.75rem`   | `12px` | `text-xs`        | 輔助說明、卡片描述 (`.card__desc`)、Tooltip (`.app-tooltip`)               |
| `--text-sm`   | `0.875rem`  | `14px` | `text-sm`        | 主要內文 (`body`)、按鈕 (`.btn`)、輸入框 (`.input`)、代碼區 (`.code-view`) |
| `--text-base` | `1rem`      | `16px` | `text-base`      | 標準內文、指令面板輸入 (`.cp-input`)、卡片標題                             |
| `--text-lg`   | `1.125rem`  | `18px` | `text-lg`        | 強調段落、次小標題                                                         |
| `--text-xl`   | `1.25rem`   | `20px` | `text-xl`        | 區塊與分組標題、側欄大標                                                   |
| `--text-2xl`  | `1.5rem`    | `24px` | `text-2xl`       | 彈窗標題、小頁首                                                           |
| `--text-3xl`  | `1.875rem`  | `30px` | `text-3xl`       | 頁面主標題 (`h1`)                                                          |
| `--text-4xl`  | `2.25rem`   | `36px` | `text-4xl`       | 展示標題、Hero Text                                                        |
| `--text-5xl`  | `3rem`      | `48px` | `text-5xl`       | 重點指標數據、超大展示字                                                   |

#### 字型應用準則

1. **Inter**：用於所有標題、按鈕、導覽列、說明段落與表單標籤。
2. **JetBrains Mono**：專門用於輸入框（Input）、輸出框（Output）、程式碼（Code/Pre）、分類標籤（Tag）與鍵盤鍵帽（Kbd）。
3. **大小寫規範**：
   - 內文與描述採用句首大寫（Sentence case）。
   - 標籤（Tag）全小寫（例：`json`, `uuid`, `wasm`）。
   - 區塊標題（Section Label）為唯一全大寫例外（例：`INPUT`, `OUTPUT`），並搭配 `letter-spacing: 0.1em`。

---

### 2.3 間距系統 (Spacing Scale)

採用基於 4px / 8px 的對齊格線系統：

| Token         | 數值   | 典型用途                               |
| ------------- | ------ | -------------------------------------- |
| `--space-xs`  | `4px`  | 元素內部細微間隙、標籤內行距、圖示微調 |
| `--space-sm`  | `8px`  | 相鄰按鈕間距、欄位與標題間隔           |
| `--space-ms`  | `12px` | 卡片垂直內距、控制項內左右間距         |
| `--space-md`  | `16px` | 標準卡片內距、表單欄位下外距           |
| `--space-lg`  | `24px` | 區塊間距、頁面邊界 gutter              |
| `--space-xl`  | `40px` | 主要段落區隔、頁面大模組間隔           |
| `--space-xxl` | `64px` | 頁首與頁底留白、Empty State 內距       |

---

### 2.4 圓角系統 (Border Radius)

| Token           | 數值     | 典型用途                                          |
| --------------- | -------- | ------------------------------------------------- |
| `--radius-sm`   | `6px`    | 標籤 Tag、圖示小按鈕、模式切換選項、Tooltip       |
| `--radius-md`   | `8px`    | 標準按鈕 (`.btn`)、輸入框 (`.input`)、Toast       |
| `--radius-lg`   | `12px`   | 工具卡片 (`.card`)、分段控制器外框 (`.segmented`) |
| `--radius-xl`   | `16px`   | 彈窗對話框 (`.alert`)、指令面板 (`.cp-dialog`)    |
| `--radius-pill` | `9999px` | 圓形圖標、頭像、Logo、全角按鈕                    |

---

### 2.5 版面與動態 (Layout & Motion)

```scss
:root {
  /* Layout */
  --layout-max-width: 1600px;
  --layout-gutter: 24px;
  --nav-height: 64px;

  /* Motion */
  --transition-fast: 100ms ease; // 按鈕 active、圖示 hover
  --transition-base: 150ms ease; // 邊框顏色切換、懸浮微抬升
  --transition-theme: 200ms ease; // 深淺模式切換背景與文字過渡
}
```

---

## 三、全域基底樣式 (Global Base & Utilities)

### 3.1 Minimal Reset

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  min-height: 100vh;
  min-height: 100dvh;
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition:
    background-color var(--transition-theme),
    color var(--transition-theme);
}

// 避免超長 Hash、Base64 或 URL 撐爆元件排版
input,
button,
textarea,
select,
p,
pre,
code {
  overflow-wrap: break-word;
}

// 表單元件字型繼承
input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}
```

### 3.2 無障礙焦點環 (Accessible Focus Ring)

嚴格實踐 WCAG 2.1 焦點可見性標準，不影響滑鼠點擊，僅在鍵盤導航時顯現高對比雙層焦點環：

```scss
:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

### 3.3 輔助 Utilities

```scss
// 螢幕閱讀器專用隱藏 (無障礙)
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// 大寫區塊標籤 (如 INPUT, OUTPUT)
.section-label {
  font-size: var(--text-2xs);
  font-weight: var(--weight-regular);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

// 頁面主容器
.container {
  width: 100%;
  max-width: var(--layout-max-width);
  margin-inline: auto;
  padding-inline: var(--layout-gutter);

  @media (max-width: 640px) {
    padding-inline: 16px;
  }
}

// 無障礙動態偏好降級
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 四、原子級元件規範 (Atoms & Primitives)

共用元件庫中的基礎元素樣式定義。

### 4.1 按鈕系統 (Buttons)

提供 **Primary (主要)**、**Accent (醒目)**、**Ghost (次要線框)**、**Danger (破壞性)** 四種階層。

```scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px; // 符合觸控目標規範
  padding-inline: var(--space-lg);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  border: 0;
  border-radius: var(--radius-md);
  text-decoration: none !important;
  cursor: pointer;
  transition:
    filter var(--transition-fast),
    background var(--transition-base),
    box-shadow var(--transition-base),
    transform var(--transition-fast);

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

// 1. Primary: 品牌海軍藍實心 (主要 CTA)
.btn-primary {
  background: var(--color-brand-600);
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 76, 129, 0.2);

  &:hover {
    background: var(--color-brand-700);
    filter: brightness(1.05);
  }
}

// 2. Accent: 琥珀金高反差 (核心轉檔、加值功能)
.btn-accent {
  background: var(--color-accent);
  color: #ffffff;
  font-weight: var(--weight-bold);
  box-shadow: 0 1px 2px rgba(245, 158, 11, 0.25);

  &:hover {
    background: var(--color-accent-hover);
  }
}

// 3. Ghost: 次要線框操作 (載入範例、清除、副操作)
.ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid var(--color-ghost-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    border-color var(--transition-base),
    color var(--transition-base);

  &:hover {
    border-color: var(--color-brand-500);
    color: var(--color-text-primary);
  }
}

// 4. Danger: 刪除或破壞性按鈕
.btn-danger {
  color: #ffffff;
  // 白字實心底使用 -solid token：--color-danger (#ef4444) 配白字僅 3.76:1，未達 AA
  background-color: var(--color-danger-solid);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-base);

  &:hover {
    background-color: var(--color-danger-solid-hover);
  }
}
```

---

### 4.2 分段控制器 (Segmented Control)

膠囊軌道包容原生 `<input type="radio">`，鍵盤無障礙可完整左右切換，選中時享有品牌色實心高亮。

```scss
.segmented {
  display: inline-flex;
  gap: 2px;
  margin: 0;
  padding: 3px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.segmented__option {
  display: inline-flex;
  margin: 0;
  cursor: pointer;

  // 原生 radio 隱藏但保留鍵盤操作性
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  span {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 var(--space-ms);
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    border-radius: var(--radius-md);
    transition:
      background var(--transition-base),
      color var(--transition-base),
      box-shadow var(--transition-base);
  }

  &:hover span {
    color: var(--color-text-primary);
  }

  // 選中態
  input:checked + span {
    color: #ffffff;
    font-weight: var(--weight-semibold);
    background: var(--color-brand-600);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  input:focus-visible + span {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
}
```

---

### 4.3 圖示操作鈕 (Icon Buttons)

標準化 32×32px 觸控盒，內嵌 18×18px 向量 SVG，專為「複製 (Copy)」與「下載 (Download)」打造一致互動體驗：

```scss
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background var(--transition-base),
    color var(--transition-base);

  &:hover,
  &.is-active {
    background: var(--color-accent-dim);
    color: var(--color-accent-text);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
}
```

---

### 4.4 標籤系統 (Category Tags & Badges)

JetBrains Mono 專屬等寬標籤，代表性的 IDE 語義色 Token 外觀：

```scss
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);

  // 語意色彩多態 (直接食用全域語意 Tokens，深淺色自動適應)
  &[data-variant='blue'],
  &[data-variant='brand'] {
    color: var(--color-brand-text);
    background: var(--color-brand-dim);
    border-color: var(--color-brand-border);
  }

  &[data-variant='green'],
  &[data-variant='success'] {
    color: var(--color-success-text);
    background: var(--color-success-dim);
    border-color: var(--color-success-border);
  }

  &[data-variant='amber'],
  &[data-variant='warning'] {
    color: var(--color-warning-text);
    background: var(--color-warning-dim);
    border-color: var(--color-warning-border);
  }

  &[data-variant='purple'] {
    color: var(--color-purple-text);
    background: var(--color-purple-dim);
    border-color: var(--color-purple-border);
  }

  &[data-variant='red'],
  &[data-variant='danger'] {
    color: var(--color-danger-text);
    background: var(--color-danger-dim);
    border-color: var(--color-danger-border);
  }

  &[data-variant='info'] {
    color: var(--color-info-text);
    background: var(--color-info-dim);
    border-color: var(--color-info-border);
  }

  &[data-variant='neutral'] {
    color: var(--color-neutral-text);
    background: var(--color-neutral-dim);
    border-color: var(--color-neutral-border);
  }
}
```

---

### 4.5 輸入框與表單欄位 (Inputs & Field Layouts)

```scss
.field {
  margin-bottom: var(--space-md);
}

.field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px; // 保持包含複製鈕時高度一致，避免晃動
  margin-bottom: var(--space-xs);
}

.field-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
}

.input {
  display: block;
  width: 100%;
  resize: vertical;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background: var(--color-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-dim);
  }
}
```

---

### 4.6 輸出框與程式碼檢視 (Output Rows & Code View)

#### 1. 單行/區塊結果列 (`.output-row`)

帶有 4px 左側語意邊條，成功為翠綠、錯誤為珊瑚紅：

```scss
.output-row {
  display: flex;
  align-items: center;
  min-height: 3.5rem;
  padding: 12px 16px;
  background: var(--color-output-bg);
  border: 1px solid var(--color-success-border);
  border-left: 4px solid var(--color-success);
  border-radius: var(--radius-md);

  &.is-error {
    background: var(--color-error-bg);
    border-color: var(--color-danger-border);
    border-left-color: var(--color-danger);
  }
}

.output-text {
  display: block;
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-success-text);
  white-space: pre-wrap;
  word-break: break-all;

  .is-error & {
    color: var(--color-danger-text);
  }
}
```

#### 2. IDE 風格程式碼預覽 (`.code-view`)

支援 **Sticky 行號列**、**行展開/收折**、**水平捲動且行號不位移**：

```scss
.code-view {
  margin: 0;
  padding: 8px 0;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.code-line {
  display: flex;
  align-items: flex-start;
  width: max-content;
  min-width: 100%;
}

.code-gutter {
  position: sticky;
  left: 0;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
  padding: 0 10px 0 6px;
  background: var(--color-surface);
  user-select: none;
}

.code-lineno {
  display: inline-block;
  min-width: 2.5ch;
  text-align: right;
  color: var(--color-text-muted);
}

.fold-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;

  svg {
    transform: rotate(90deg); // 展開朝下
    transition: transform var(--transition-base);
  }

  &.is-collapsed svg {
    transform: rotate(0); // 收合朝右
  }
}

.code-text {
  white-space: pre;
  padding-right: 14px;
}
```

---

## 五、複合型與浮層元件規範 (Molecules, Organisms & Overlays)

### 5.1 工具卡片 (Card & Responsive Grid)

採用內在響應式格線：容器依自身寬度自適應填補欄數，無需大量 Media Queries。

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
  gap: var(--space-md);
  list-style: none;
  padding: 0;
}

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-ms) 18px;
  color: inherit;
  text-decoration: none;
  background: var(--color-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    transform var(--transition-base);

  &:hover {
    border-color: var(--color-brand-600);
    box-shadow: 0 6px 20px -4px rgba(15, 76, 129, 0.12);
    transform: translateY(-2px);
  }

  &.card--hot {
    border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  }

  &:active {
    transform: translateY(0);
  }
}

.card__name {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  transition: color var(--transition-fast);

  .card:hover & {
    color: var(--color-brand-600);
  }
}

.card__desc {
  margin: var(--space-xs) 0 var(--space-ms);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

---

### 5.2 拖放檔案上傳區 (FileUpload Dropzone)

虛線框提示「可拖放」，當懸浮拖曳時整塊染上 accent 琥珀色微透明底色：

```scss
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xl) var(--space-md);
  margin-bottom: var(--space-md);
  text-align: center;
  color: var(--color-text-secondary);
  background: var(--color-base);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color var(--transition-base),
    background var(--transition-base);

  &.is-dragging {
    border-color: var(--color-accent);
    background: var(--color-accent-dim);
  }

  &:focus-within {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
}

.dropzone__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
```

---

### 5.3 工具標頭列 (Tool Header)

整合工具標籤、HOT 徽標、H1 主標題、星號收藏按鈕與工具簡介：

```scss
.header {
  margin-bottom: var(--space-lg);
}

.header__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  h1 {
    font-size: var(--text-3xl);
    font-weight: var(--weight-black);
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
  }
}

.header__fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);

  &:hover,
  &.is-favorite {
    color: #f59e0b;
    transform: scale(1.1);
  }

  &.is-favorite svg {
    fill: #f59e0b;
    stroke: #d97706;
  }
}
```

---

### 5.4 手風琴說明與 FAQ (Doc / Accordion)

基於標準語意 HTML `<details>` 與 `<summary>`，具備自動縮排層次與平滑外框高亮：

```scss
.doc {
  background: var(--color-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  margin-top: var(--space-md);
  margin-bottom: var(--space-xl);
  transition: border-color var(--transition-base);

  &[open] {
    border-color: var(--color-brand-border);
  }
}

.doc__summary {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  cursor: pointer;
  user-select: none;

  &:hover {
    color: var(--color-brand-600);
  }

  &:focus-visible {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
}

.doc__body {
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--color-border);
  line-height: var(--leading-normal);

  p,
  ul,
  ol {
    margin-bottom: var(--space-sm);
    padding-inline-start: var(--space-lg);
  }
}
```

---

### 5.5 懸浮氣泡提示 (Tooltip)

Shadcn/ui 風格黑色懸浮氣泡，帶微縮放動畫（`scale: 0.95 -> 1`），掛載於 body 脫離元件層級：

```scss
.app-tooltip {
  position: absolute;
  z-index: 10000;
  max-width: 260px;
  padding: 5px 10px;
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  line-height: 1.35;
  color: var(--color-tooltip-text);
  background-color: var(--color-tooltip-bg);
  border: 1px solid var(--color-tooltip-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
  pointer-events: none;
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);

  &.is-visible {
    opacity: 1;
    transform: scale(1);
  }
}
```

> 深色模式不另寫選擇器：`[data-theme='dark']` 覆寫 `--color-tooltip-*` token 後，經 CSS 繼承穿透 Shadow DOM 自動生效。避免使用 `:host-context()`（Firefox / Safari 不支援）。

---

### 5.6 吐司通知 (Toast Notification System)

固定於視窗右下角堆疊，支援 5 種狀態（Success、Error、Warning、Info、Loading），彈出 cubic-bezier 平滑滑入：

```scss
.toast-viewport {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 380px;
  width: calc(100vw - 32px);
  pointer-events: none;
}

.toast-card {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: var(--space-ms);
  padding: 12px 14px;
  background: var(--color-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  animation: toast-slide-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  &.toast-success .toast-icon {
    color: var(--color-success-text);
  }
  &.toast-error .toast-icon {
    color: var(--color-danger);
  }
  &.toast-warning .toast-icon {
    color: var(--color-warning);
  }
  &.toast-info .toast-icon {
    color: var(--color-info);
  }
  &.toast-loading .toast-icon {
    color: var(--color-brand-600);
  }
}

@keyframes toast-slide-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

### 5.7 通用彈窗外框容器 (Modal)

彈窗的外層對話框框架（類似 Bootstrap Modal），負責彈窗的遮罩、外框、尺寸規格、層級與開闔動畫。內部預留 Header、Body、Footer 插槽，開發者可在內部自由置入客製業務表單、資料明細或複雜互動功能：

```scss
/* ─── 5.7 通用彈窗外框容器 (Modal: <aui-modal>) ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  animation: modal-fade-in 0.18s ease-out;
}

.modal-dialog {
  width: 100%;
  max-height: calc(100dvh - 32px);
  display: flex;
  flex-direction: column;
  background: var(--color-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  animation: modal-pop-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  // 尺寸規格變體
  &--sm {
    max-width: 420px;
  }

  &--md {
    max-width: 600px;
  }

  &--lg {
    max-width: 840px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);

  .modal-title {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
  }
}

.modal-body {
  flex: 1 1 auto;
  padding: var(--space-lg);
  overflow-y: auto;
  color: var(--color-text-secondary);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-pop-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

---

### 5.8 提示與確認對話框 (Alert)

專門負責反饋提示與二次確認的輕量對話框（功能外觀類似 SweetAlert2），嚴格限定於 Alert / Confirm / Prompt 提示使用，不作為複雜業務頁面的承載容器。提供命令式 TypeScript 單例呼叫（`AlertService.confirm(...)`、`AlertService.alert(...)`）與宣告式元件標籤：

```scss
/* ─── 5.8 提示與確認對話框 (Alert: <aui-alert>, AlertService) ─── */
.alert-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  animation: alert-fade-in 0.18s ease-out;
}

.alert {
  width: 100%;
  max-width: 440px;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: alert-pop-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.swal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: swal-icon-bounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &--success {
    border: 3px solid var(--color-success);
    color: var(--color-success);
  }

  &--error {
    border: 3px solid var(--color-danger);
    color: var(--color-danger);
  }

  &--warning {
    border: 3px solid var(--color-warning);
    color: var(--color-warning);
  }

  &--info {
    border: 3px solid var(--color-info);
    color: var(--color-info);
  }
}

.alert-title {
  margin-bottom: var(--space-xs);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}

.alert-message {
  margin-bottom: var(--space-lg);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
}

.alert-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

@keyframes alert-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes alert-pop-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes swal-icon-bounce {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

### 5.9 可收合抽屜側邊欄 (Drawer)

獨立的可收合側邊欄元件（Off-canvas Drawer），不綁死特定的頁面整體版型 Layout，各專案可自由嵌入。常用於行動端滑入選單、側邊過濾面板或操作設定欄。支援左右滑出方向（`placement="left" | "right"`）、背景遮罩與捲動鎖定：

```scss
/* ─── 5.9 可收合抽屜側邊欄 (Drawer: <aui-drawer>) ─── */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  animation: drawer-fade-in 0.2s ease-out;
}

.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 950;
  width: 280px;
  max-width: 85vw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-base);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  transition: transform var(--transition-theme);

  // 方向支援
  &--left,
  &[placement='left'] {
    left: 0;
    border-right: 1px solid var(--color-border);
    transform: translateX(-100%);

    &.is-open {
      transform: translateX(0);
    }
  }

  &--right,
  &[placement='right'] {
    right: 0;
    border-left: 1px solid var(--color-border);
    transform: translateX(100%);

    &.is-open {
      transform: translateX(0);
    }
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--nav-height);
  padding: 0 var(--space-lg);
  border-bottom: 1px solid var(--color-border);

  .drawer-title {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
  }
}

.drawer-body {
  flex: 1 1 auto;
  padding: var(--space-md) var(--space-lg);
  overflow-y: auto;
}

.drawer-footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

@keyframes drawer-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

### 5.10 頂部導覽列 (Navbar)

獨立的站台頂部導覽列元件（Site Header），固定或吸頂於視窗上方（高度 64px）。整合品牌 Logo（含 Accent 亮點圓點）、自訂導覽選單插槽、快捷搜尋觸發鈕（內嵌 `⌘K` 鍵帽）與深淺主題切換開關，漢堡選單按鈕可與 Drawer 連動開闔：

```scss
/* ─── 5.10 頂部導覽列 (Navbar: <aui-navbar>) ─── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: var(--nav-height);
  background: var(--color-base);
  border-bottom: 1px solid var(--color-border);
  transition:
    background-color var(--transition-theme),
    border-color var(--transition-theme);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: var(--layout-max-width);
  margin-inline: auto;
  padding-inline: var(--layout-gutter);
}

.navbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none !important;

  .brand-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--color-brand-600);
    border-radius: var(--radius-md);
    color: #ffffff;
  }

  .brand-dot {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: var(--color-accent);
    border: 2px solid var(--color-brand-600);
    border-radius: 50%;
  }

  .brand-title {
    font-size: var(--text-base);
    font-weight: var(--weight-bold);
    color: var(--color-text-primary);
  }
}

.navbar-search {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 36px;
  padding: 0 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  cursor: pointer;
  transition:
    border-color var(--transition-base),
    background-color var(--transition-base);

  &:hover {
    border-color: var(--color-brand-500);
    color: var(--color-text-secondary);
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
```

---

### 5.11 通用頁尾 (Footer)

獨立的站台通用頁尾元件，置於專案頁面最底層。提供統一風格的版權宣告（Copyright）、專案版本資訊、社群/GitHub 快速連結與次要選單插槽，支援 Minimal 與 Columns 排版插槽：

```scss
/* ─── 5.11 通用頁尾 (Footer: <aui-footer>) ─── */
.footer {
  width: 100%;
  margin-top: auto;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  transition:
    background-color var(--transition-theme),
    border-color var(--transition-theme);

  // 簡潔單列版型
  &--minimal {
    padding-block: var(--space-md);

    .footer-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-sm);
      max-width: var(--layout-max-width);
      margin-inline: auto;
      padding-inline: var(--layout-gutter);
    }
  }

  // 多欄排版版型
  &--columns {
    padding-block: var(--space-xl) var(--space-md);

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-lg);
      max-width: var(--layout-max-width);
      margin-inline: auto;
      padding-inline: var(--layout-gutter);
      margin-bottom: var(--space-lg);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-sm);
      max-width: var(--layout-max-width);
      margin-inline: auto;
      padding-top: var(--space-md);
      padding-inline: var(--layout-gutter);
      border-top: 1px solid var(--color-border);
    }
  }
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  list-style: none;
  padding: 0;
  margin: 0;

  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--transition-base);

    &:hover {
      color: var(--color-brand-text);
    }
  }
}
```

---

## 六、前端共用元件專案建置與發佈指南

若要以本樣式系統為基底建立一個**跨專案前端共用元件函式庫**（Shared UI Component Library），建議採用以下專案架構：

### 6.1 目錄結構

```text
packages/ui/ (或獨立 repo)
├── src/
│   ├── tokens/                  # Design Tokens 根源
│   │   ├── _colors.scss
│   │   ├── _typography.scss
│   │   ├── _spacing.scss
│   │   ├── _radius.scss
│   │   ├── _motion.scss
│   │   └── index.scss           # 匯出 :root 與 [data-theme="dark"]
│   ├── base/                    # 全域基底
│   │   ├── _reset.scss
│   │   ├── _focus.scss
│   │   └── _utilities.scss
│   ├── components/              # Lit Web Component 元件 (共 20 項獨立共用元件)
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
│   └── index.ts                 # 元件庫進入點
├── package.json
└── tsconfig.json
```

### 6.2 模組化打包與匯出策略

1. **樣式分離匯出 (CSS / SCSS)**：
   - 使用者可以單獨引用 Token：`@import '@my-org/ui/tokens';`
   - 使用者可以單獨引用全域重置：`@import '@my-org/ui/reset';`
   - 預設提供打包好的完整樣式檔：`import '@my-org/ui/style.css';`
2. **Framework-Agnostic Tokens**：
   - 所有的色彩、字級、間距均定義在標準 CSS 自定義屬性（Custom Properties）中。無論元件是以 Angular、React、Vue 還是 Vanilla JS 實作，皆能無縫共用同一個樣式核心。
3. **動態主題切換實踐**：
   - 共用元件庫不要寫死深色邏輯在各元件內部，統一讀取父層或根節點的 CSS 變數。切換主題只需在宿主應用的 `document.documentElement` 上切換 `data-theme="dark"` 屬性即可。
