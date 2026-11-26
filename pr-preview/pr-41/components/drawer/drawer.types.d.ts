import { DialogCloseReason } from '../../internal/modal-dialog.js';
/**
 * 滑出方向：從視窗左側或右側滑入
 */
export type DrawerPlacement = 'left' | 'right';
/**
 * 關閉原因（與 Modal、Drawer 共用的 `DialogCloseReason` 相同）
 * - `escape`：按下 ESC（或瀏覽器的返回手勢等關閉要求）
 * - `backdrop`：點擊遮罩
 * - `close-button`：點擊頁首的關閉鈕
 * - `api`：以程式關閉（`hide()` 或將 `open` 設為 false），或開啟中被移出頁面
 */
export type DrawerCloseReason = DialogCloseReason;
/**
 * `aui-hide` 與 `aui-after-hide` 事件資料
 */
export interface DrawerHideDetail {
    reason: DrawerCloseReason;
}
//# sourceMappingURL=drawer.types.d.ts.map