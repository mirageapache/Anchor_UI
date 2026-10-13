# 共用浮層基礎模組：背景捲動鎖定與焦點返還

> 對應任務：Phase 2 TASK-204「共用浮層基礎模組（`src/internal/`）」
> 使用者：Modal（TASK-210）、Alert（TASK-211）、Toast（TASK-212）、Phase 4 的 Drawer
> Top Layer 與 inert 的觀念見 [04-top-layer.md](./04-top-layer.md)。

## 1. 為什麼要「共用」

Modal、Alert、Drawer 都是「蓋在頁面上方」的浮層，需要同一組基礎能力。如果各自實作：

- 邏輯重複、修一個 bug 要改三個地方。
- **狀態會互相打架**：例如 Modal 中再開 Alert，Alert 關閉時把 Modal 的捲動鎖定也解除了。

所以先把這些能力做成 `src/internal/` 下的共用模組（與 Phase 1 抽出的共用 Spinner、點擊攔截相同作法）。

## 2. 背景捲動鎖定 (Scroll Lock)

### 需求

浮層開啟時，背後的頁面不應跟著滾動。

### 兩個難點

**① 巢狀開啟要計數**

```
開啟 Modal  → 計數 1 → 鎖定
  開啟 Alert → 計數 2
  關閉 Alert → 計數 1 → 不能解除（Modal 還開著）
關閉 Modal  → 計數 0 → 解除
```

**② 捲軸消失造成版面跳動**

`overflow: hidden` 會讓捲軸消失，頁面可用寬度變大，內容往右「跳」一下。需要補上原本捲軸的寬度。

### 實作示意

```ts
let lockCount = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/** 鎖定背景捲動；回傳解除函式（重複呼叫解除函式不會重複扣計數） */
export function lockScroll(): () => void {
  const html = document.documentElement;
  if (lockCount++ === 0) {
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = 'hidden';
    if (scrollbarWidth > 0) html.style.paddingRight = `${scrollbarWidth}px`;
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--lockCount === 0 && saved) {
      html.style.overflow = saved.overflow;
      html.style.paddingRight = saved.paddingRight;
      saved = null;
    }
  };
}
```

使用方式：

```ts
const release = lockScroll(); // 開啟時
// …
release(); // 關閉時
```

### 補充

- 另一種避免版面跳動的方式是 CSS 的 `scrollbar-gutter: stable`，預留捲軸空間；但會改變全站版面，元件庫不宜擅自設定，交由使用專案決定。
- 微前端同時載入兩份元件庫時，兩份模組各有自己的計數器。若需要跨副本共用，可把狀態放在 `globalThis[Symbol.for('anchor-ui.scroll-lock')]`。

## 3. 焦點返還 (Focus Return)

### 需求

鍵盤使用者按按鈕開啟 Modal，關閉後焦點應回到那顆按鈕，而不是掉回頁面最上方。這是 WAI-ARIA 對話框模式的基本要求。

### 難點：Shadow DOM

`document.activeElement` 只會回傳最外層的 shadow host。使用者實際聚焦的是 `<aui-button>` 內部的 `<button>`，但 `document.activeElement` 回傳的是 `<aui-button>`。若觸發按鈕又包在另一個元件的 Shadow DOM 中，就需要一層層往下找。

### 實作示意

```ts
/** 穿透 Shadow DOM，取得實際聚焦的元素 */
export function getDeepActiveElement(): Element | null {
  let el = document.activeElement;
  while (el?.shadowRoot?.activeElement) {
    el = el.shadowRoot.activeElement;
  }
  return el;
}

/** 開啟浮層時呼叫；回傳「還原焦點」函式 */
export function rememberFocus(): () => void {
  const previous = getDeepActiveElement() as HTMLElement | null;
  return () => {
    // 觸發元素可能已被移除（例如清單項目被刪除），此時不還原
    if (previous?.isConnected) previous.focus();
  };
}
```

### 補充

- 原生 `<dialog>` 關閉時，瀏覽器也會嘗試把焦點還給開啟前的元素；但跨 Shadow DOM、程式化開啟（例如 `AlertService.confirm()`）等情境不一定可靠，自行記錄更保險。
- 開啟時的**初始焦點**也要設計：一般對話框聚焦第一個可操作元素；破壞性確認（例如「確定刪除？」）應聚焦在「取消」，避免誤按 Enter 直接刪除。

## 4. 焦點限制 (Focus Trap)

模態對話框開啟時，Tab 鍵不應跑到背後的頁面。

- 使用 `<dialog>.showModal()` 時，對話框以外的內容會自動變成 inert，**不需要自己寫焦點循環的程式**。
- 若浮層不是 modal dialog（例如自行實作的抽屜），可以對主要內容加上 `inert` 屬性達到相同效果。

## 5. 在 Anchor UI 的實作（TASK-204）

| 模組                           | 匯出                                                                           | 說明                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `src/internal/scroll-lock.ts`  | `lockScroll()`、`isScrollLocked()`                                             | 巢狀計數、捲軸補償、還原鎖定前的 inline 樣式；解除函式可重複呼叫                                   |
| `src/internal/focus-return.ts` | `getDeepActiveElement()`、`rememberFocus()`                                    | 穿透多層 Shadow DOM；觸發元素已移除或原本無焦點時不處理                                            |
| `src/internal/top-layer.ts`    | `raisePopover()`、`pushModalLayer()`、`getTopModalLayer()`、`followTopModal()` | 見 [04-top-layer.md](./04-top-layer.md) 第 6 節                                                    |
| `src/internal/shared-state.ts` | `sharedState()`                                                                | 計數與堆疊存放在 `globalThis[Symbol.for('anchor-ui.<key>')]`，微前端載入多份元件庫時共用同一份狀態 |

使用者：Modal（TASK-210）、Alert（TASK-211）、Toast（TASK-212）與 Phase 4 的 Drawer。

### 測試時踩到的坑：headless 瀏覽器預設沒有捲軸

Playwright 啟動 headless Chromium 時預設帶 `--hide-scrollbars`，捲軸寬度為 0，「捲軸補償」的測試因此**不論有沒有補償都會通過**（以突變測試發現）。
解法：測試設定加上 `ignoreDefaultArgs: ['--hide-scrollbars']`，測試中以 `html::-webkit-scrollbar { width: 17px }` 固定捲軸寬度，並先斷言捲軸寬度確實為 17px 再驗證——前提不成立時測試會明確失敗，而不是默默通過。

## 參考資料

- WAI-ARIA APG：[Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- MDN：[`scrollbar-gutter`](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)
- MDN：[`DocumentOrShadowRoot.activeElement`](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
