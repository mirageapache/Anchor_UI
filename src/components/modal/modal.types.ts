/**
 * Anchor UI — Modal Types
 */

/**
 * 尺寸規格（面板最大寬度：sm 420px、md 600px、lg 840px）
 */
export type ModalSize = 'sm' | 'md' | 'lg';

/**
 * 對話框角色：一般對話框，或需要使用者立即回應的警示對話框（如 Alert 的確認）
 */
export type ModalRole = 'dialog' | 'alertdialog';

/**
 * 關閉原因
 * - `escape`：按下 ESC（或瀏覽器的返回手勢等關閉要求）
 * - `backdrop`：點擊遮罩
 * - `close-button`：點擊頁首的關閉鈕
 * - `api`：以程式關閉（`hide()` 或將 `open` 設為 false），或開啟中被移出頁面
 */
export type ModalCloseReason = 'escape' | 'backdrop' | 'close-button' | 'api';

/**
 * `aui-hide` 與 `aui-after-hide` 事件資料
 */
export interface ModalHideDetail {
  reason: ModalCloseReason;
}
