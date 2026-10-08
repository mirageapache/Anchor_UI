# Anchor UI — 共用元件清單與規格說明 (Components Catalog)

> **文件定位**：本文件依據 [`design-system.md`] 的樣式規範與 [`anchor-ui-planning.md`] 的架構規劃，整理出 Anchor UI 共用元件庫所有預計實作之元件項目、分類、功能與狀態能力說明。
>
> 📌 **相關文件**：
>
> - 實際開發排程與 Phase 階段劃分，請參閱：[`anchor-ui-development-schedule.md`]
> - 樣式規範與 Design Tokens 字典，請參閱：[`design-system.md`]

---

## 一、元件總覽與詳細規格說明

共計盤點出 **20 項** 可共用之 UI 元件與系統模組，依據原子設計理念（Atomic Design）與功能角色劃分如下：

### 1. 基礎設施 (Foundation)

_非獨立 UI 元件，但為所有元件實作之外觀基礎與依賴單一事實來源。_

- **Design Tokens & Base System**：
  - **說明**：包含 CSS Custom Properties 變數字典（色彩、字級、間距、圓角、動態過渡）。
  - **核心規範**：Minimal Reset、無障礙雙層焦點環（Focus Ring：`:focus-visible`）、輔助 Utilities（`.sr-only`、`.section-label`、`.container`）與執行期深淺雙主題（`data-theme="dark"`）切換。

---

### 2. 原子級元件 (Atoms & Primitives)

1. **Button（通用按鈕）**
   - **自訂標籤**：`<aui-button>`
   - **說明**：系統中最核心的互動元件，支援 4 種語意層級：Primary（品牌主色）、Accent（琥珀金強調）、Ghost（次要邊框）、Danger（破壞性危險操作）。
   - **狀態與能力**：支援 Hover、Active（縮放反饋）、Disabled、鍵盤 Focus 高亮；預設 `md` 尺寸符合 40px 最低觸控規範，`sm`（32px）供高密度介面使用（仍高於 WCAG 2.5.8 AA 的 24px 目標尺寸下限）。

2. **Icon Button（圖示操作按鈕）**
   - **自訂標籤**：`<aui-icon-button>`
   - **說明**：專為複製（Copy）、下載（Download）、關閉等動作設計的 32×32px 方形微型操作鈕。
   - **狀態與能力**：具備 Active 成功回饋狀態（背景與圖示變換為 Success 翠綠色），內建無障礙 aria-label 提示。

3. **Tag / Badge（標籤與徽章）**
   - **自訂標籤**：`<aui-tag>`
   - **說明**：採用 JetBrains Mono 等寬字體呈現的專業標籤，用於技術分類、版本、格式與狀態標記。
   - **狀態與能力**：支援 7 種語意色彩變體（Brand/Blue、Success/Green、Warning/Amber、Purple、Danger/Red、Info、Neutral），具備半透明低飽和背景（Dim）與對應邊框。

4. **Segmented Control（分段控制器 / 模式切換）**
   - **自訂標籤**：`<aui-segmented>`
   - **說明**：膠囊軌道造型的二選一或多選一切換器，常用於編碼/解碼切換、格式選擇或檢視模式切換。
   - **狀態與能力**：滑塊或按鈕高亮過渡、完整的鍵盤左右方向鍵切換支援。

5. **Kbd（鍵盤鍵帽）**
   - **自訂標籤**：`<aui-kbd>`
   - **說明**：內嵌於介面中標註快捷鍵的鍵帽微元件（如 `⌘K`、`Ctrl+C`、`Enter`），具備等寬微立體邊框風格。
   - **狀態與能力**：純展示型微元件，常用於搜尋觸發列、指令面板或按鈕提示中。

6. **Input & Form Field（表單欄位與輸入框）**
   - **自訂標籤**：`<aui-input>`, `<aui-field>`
   - **說明**：包含單行/多行等寬文字輸入框（`input`），以及由標題、次要描述、右側快速動作鈕（如複製、清除）組成的欄位容器（`field` 與 `field-head`）。
   - **狀態與能力**：支援 Focus 品牌雙層光環、Placeholder 淺色提示、Disabled、唯讀模式與高度自動/手動調整。

7. **Output Row（結果輸出列）**
   - **自訂標籤**：`<aui-output-row>`
   - **說明**：用於展示運算或轉換結果的單行/區塊文字框，左側帶有 4px 語意垂直指示條。
   - **狀態與能力**：支援成功態（翠綠底綠字）與錯誤態（淺紅底紅字），文字採等寬且具備安全折行與溢位處理。

---

### 3. 浮層與回饋元件 (Overlays & Feedback)

8. **Tooltip（懸浮氣泡提示）**
   - **自訂標籤**：`<aui-tooltip>`
   - **說明**：全域浮層氣泡，當滑鼠懸停或鍵盤聚焦於小按鈕/圖示時，提供微型說明文字（Shadcn/ui 風格深色冷黑外觀）。
   - **狀態與能力**：微縮放進出場動畫（0.95 -> 1.0）、動態邊界碰撞檢測、掛載於 Body 避免父容器 overflow 裁切。

9. **Toast Notification System（吐司通知系統）**
   - **自訂標籤 / 服務**：`<aui-toast>`, `ToastService`
   - **說明**：固定於螢幕右下角的堆疊式全域通知元件，支援單一實例廣播呼叫。
   - **狀態與能力**：支援 5 種狀態（Success、Error、Warning、Info、Loading），平滑滑入滑出動畫、自動定時關閉、手動關閉。

10. **Modal（通用彈窗外框容器）**
    - **自訂標籤**：`<aui-modal>`
    - **說明**：彈窗的外層對話框框架（類似 Bootstrap Modal），負責彈窗的遮罩、外框、尺寸規格、層級與開闔動畫。內部預留 Header、Body、Footer 插槽，開發者可在內部自由置入客製業務表單、資料明細或複雜互動功能。
    - **狀態與能力**：支援大中小三種尺寸規格（`size="sm" | "md" | "lg"`）、背景半透明模糊遮罩（Backdrop Blur）、點擊遮罩關閉（可配置開關）、鍵盤 ESC 鍵退出、焦點鎖定（Focus Trap）、開啟時鎖定背景頁面捲動，以及自訂內容 Slot 插槽與開關狀態事件監聽。

11. **Alert（提示與確認對話框）**
    - **自訂標籤 / 服務**：`<aui-alert>`, `AlertService`
    - **說明**：專門負責反饋提示與二次確認的輕量對話框（功能外觀類似 SweetAlert2），嚴格限定於 Alert / Confirm / Prompt 提示使用，不作為複雜業務頁面的承載容器。
    - **狀態與能力**：支援彈跳向量圖示（成功打勾 Success、失敗打叉 Error、警告驚嘆號 Warning、資訊 Info）、可自訂提示標題、內容說明文字、確認與取消按鈕文字與色彩樣式；提供命令式 TypeScript 單例呼叫（如 `AlertService.confirm(...)`、`AlertService.alert(...)`）與宣告式標籤元件；內建 ESC 鍵取消、Enter 鍵快速確認與無障礙焦點管理。

---

### 4. 複合型元件 (Molecules & Organisms)

12. **Card（卡片）**
    - **自訂標籤**：`<aui-card>`
    - **說明**：用於首頁或分類導覽的工具卡片，展示工具名稱、簡介描述、標籤群與連結。
    - **狀態與能力**：支援 Hover 微抬升（`translateY(-2px)`）與外框品牌色高亮、HOT 推薦外框特效、文字行數裁切（Line Clamp）。

13. **Accordion（手風琴說明與 FAQ）**
    - **自訂標籤**：`<aui-accordion>`
    - **說明**：基於語意 `<details>` 與 `<summary>` 的內容收折區塊，用於工具下方展示操作說明、限制規範或常見問題。
    - **狀態與能力**：展開時外框平滑高亮、標題旋轉箭頭指示、支援多區塊手風琴聯動或獨立開闔。

14. **FileUpload Dropzone（拖放檔案上傳區）**
    - **自訂標籤**：`<aui-dropzone>`
    - **說明**：虛線框外觀的拖放式檔案上傳區，提示使用者拖入檔案或點擊瀏覽選檔。
    - **狀態與能力**：拖曳懸浮（Dragover）整塊染上 Accent 琥珀色與邊框加亮、原生 input[type=file] 同步連動、支援檔案格式限制提示。

15. **Favorite Toggle Button（收藏星號按鈕）**
    - **自訂標籤**：`<aui-favorite-btn>`
    - **說明**：星號形狀的開關切換按鈕，用於將常用工具或項目加入我的最愛。
    - **狀態與能力**：點擊放大微動態、已收藏時實心琥珀色高亮、未收藏時灰階線條。

16. **Code View（IDE 風格程式碼檢視區）**
    - **自訂標籤**：`<aui-code-view>`
    - **說明**：專為展示轉換結果（JSON、代碼、格式化文本）設計的進階檢視區。
    - **狀態與能力**：支援左側 Sticky 黏性行號列（水平捲動時行號不位移）、語法區塊折疊（Fold/Unfold）、行高階層。

17. **Header（頁面工具標頭列）**
    - **自訂標籤**：`<aui-header>`
    - **說明**：頁面頂部的複合展示列，整合工具分類標籤、HOT 推薦徽章、H1 主標題、我的最愛收藏鈕與簡述文字。
    - **狀態與能力**：純展示與事件轉發型複合元件，提供統一的頁首層次與字級節奏。

---

### 5. 導覽與抽屜側欄 (Navigation & Drawer)

18. **Drawer（可收合抽屜側邊欄）**
    - **自訂標籤**：`<aui-drawer>`
    - **說明**：獨立的可收合側邊欄元件（Off-canvas Drawer），不綁死特定的頁面整體版型 Layout，各專案可自由嵌入。常用於行動端滑入選單、側邊過濾面板或操作設定欄。
    - **狀態與能力**：支援左右滑出方向（`placement="left" | "right"`）、展開與收合平滑過渡動態、半透明背景遮罩、點擊遮罩或 ESC 鍵關閉、抽屜開啟時鎖定背景捲動。

19. **Navbar（頂部導覽列）**
    - **自訂標籤**：`<aui-navbar>`
    - **說明**：獨立的站台頂部導覽列元件（Site Header），固定或吸頂於視窗上方（高度 64px）。整合品牌 Logo（含 Accent 亮點圓點）、自訂導覽選單插槽、快捷搜尋觸發鈕（內嵌 `⌘K` 鍵帽）與深淺主題切換開關。
    - **狀態與能力**：隨滾動 Sticky/Fixed 吸頂樣式、深淺主題切換事件驅動、響應式漢堡選單觸發按鈕（可與 Drawer 連動開關）。

20. **Footer（通用頁尾）**
    - **自訂標籤**：`<aui-footer>`
    - **說明**：獨立的站台通用頁尾元件，置於專案頁面最底層。提供統一風格的版權宣告（Copyright）、專案版本資訊、社群/GitHub 快速連結與次要選單插槽。
    - **狀態與能力**：支援簡潔單列（Minimal）與多欄導覽（Columns）版型插槽、自適應響應式排列、雙主題色彩自動適配。

---

## 二、元件清單總覽對照表 (Component Inventory)

| 序號 | 元件名稱                 | 建議自訂標籤                  | 分類 (Category) | 核心職責與特性簡述                                                                                 |
| :--: | ------------------------ | ----------------------------- | :-------------: | -------------------------------------------------------------------------------------------------- |
|  -   | **Design Tokens & Base** | _(CSS / SCSS)_                |   Foundation    | 樣式系統基石，包含色彩、字型、間距、Reset 與雙主題切換。                                           |
|  1   | **Button**               | `<aui-button>`                |      Atom       | 4 種語意層級按鈕，支援 Hover/Active/Disabled/Loading 狀態。                                        |
|  2   | **Icon Button**          | `<aui-icon-button>`           |      Atom       | 32×32px 微型圖示操作鈕，複製/下載狀態微動態回饋。                                                  |
|  3   | **Tag / Badge**          | `<aui-tag>`                   |      Atom       | JetBrains Mono 等寬標籤，7 種語意色彩多態變體。                                                    |
|  4   | **Segmented Control**    | `<aui-segmented>`             |      Atom       | 膠囊軌道單選切換器，具備平滑選中過渡與鍵盤無障礙。                                                 |
|  5   | **Kbd**                  | `<aui-kbd>`                   |      Atom       | 鍵盤按鍵鍵帽微元件，等寬字體微立體邊框風格。                                                       |
|  6   | **Input & Form Field**   | `<aui-input>`, `<aui-field>`  |      Atom       | 單行/多行等寬輸入框，整合標籤與右側快捷操作鈕。                                                    |
|  7   | **Output Row**           | `<aui-output-row>`            |      Atom       | 結果輸出展示框，4px 左側語意指示條與安全換行防禦。                                                 |
|  8   | **Tooltip**              | `<aui-tooltip>`               |     Overlay     | Shadcn 風格冷黑浮層氣泡，微縮放動態與全域定位。                                                    |
|  9   | **Toast Notification**   | `<aui-toast>`, `ToastService` |     Overlay     | 右下角堆疊全域通知，5 種語意狀態與 TS 單例調用 API。                                               |
|  10  | **Modal**                | `<aui-modal>`                 |     Overlay     | 通用彈窗外框容器（大/中/小尺寸），具備 Header/Body/Footer 插槽供自訂業務功能，似 Bootstrap Modal。 |
|  11  | **Alert**                | `<aui-alert>`, `AlertService` |     Overlay     | 提示與確認彈窗（SweetAlert2 風格），專注於語意圖示、標題、訊息與確認/取消。                        |
|  12  | **Card**                 | `<aui-card>`                  |    Molecule     | 卡片，自適應 Grid、Hover 微浮凸與 HOT 邊框。                                                       |
|  13  | **Accordion**            | `<aui-accordion>`             |    Molecule     | 基於 `<details>` 封裝的收折說明與 FAQ 區塊。                                                       |
|  14  | **FileUpload Dropzone**  | `<aui-dropzone>`              |    Molecule     | 虛線框拖放上傳區，Dragover 琥珀金背景與邊框染色提示。                                              |
|  15  | **Favorite Toggle**      | `<aui-favorite-btn>`          |    Molecule     | 星號收藏按鈕，微縮放彈跳動態與實心琥珀金高亮。                                                     |
|  16  | **Code View**            | `<aui-code-view>`             |    Molecule     | IDE 風格代碼檢視區，Sticky 黏性行號列與程式碼摺疊。                                                |
|  17  | **Header**               | `<aui-header>`                |    Molecule     | 整合標籤、HOT 徽標、H1 標題、收藏鈕與簡述的頁首展示容器。                                          |
|  18  | **Drawer**               | `<aui-drawer>`                |   Navigation    | 可收合抽屜側邊欄，支援側滑展開/收合、遮罩與背景捲動鎖定。                                          |
|  19  | **Navbar**               | `<aui-navbar>`                |   Navigation    | 64px 獨立頂部導覽列，整合 Logo、搜尋按鈕、導覽選單與主題切換。                                     |
|  20  | **Footer**               | `<aui-footer>`                |   Navigation    | 獨立通用頁尾，整合版權宣告、版本資訊、外部連結與次要選單。                                         |
