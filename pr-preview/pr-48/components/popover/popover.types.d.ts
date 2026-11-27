/**
 * Anchor UI — Popover Types
 */
/** 面板相對於觸發元素的 12 種方位 */
export type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
/**
 * 關閉原因：
 * - `trigger`：再次點擊觸發元素
 * - `escape`：按下 ESC
 * - `outside`：點擊面板與觸發元素以外的地方
 * - `focus-out`：焦點移到面板與觸發元素以外（例如以 Tab 離開）
 * - `select`：選取了選單項目（`<aui-menu>`）
 * - `api`：以程式關閉（`hide()` 或將 `open` 設為 false），或開啟中被移出頁面
 */
export type PopoverCloseReason = 'trigger' | 'escape' | 'outside' | 'focus-out' | 'select' | 'api';
/** `aui-hide` 與 `aui-after-hide` 事件資料 */
export interface PopoverHideDetail {
    reason: PopoverCloseReason;
}
//# sourceMappingURL=popover.types.d.ts.map