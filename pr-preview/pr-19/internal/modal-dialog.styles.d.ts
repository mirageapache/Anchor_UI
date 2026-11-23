import { CSSResult } from 'lit';
/**
 * `ModalDialogElement` 子類別共用的樣式（`<aui-modal>`、`<aui-drawer>`）：
 * 撐滿視窗的透明 dialog、遮罩的淡入淡出、面板的基本外觀，以及頁首（標題、關閉鈕）、內容、頁尾的結構。
 *
 * 各元件只需補上自己的版面差異（面板的位置、尺寸與進退場動畫、各區塊的內距）。
 * 須排在元件自己的樣式之前：`static styles = [dialogBaseStyles('modal'), modalStyles]`，
 * 元件的樣式才能覆寫這裡的預設值。遮罩與面板的 `transition` 由元件定義，
 * 對應的 `prefers-reduced-motion` 也寫在元件的樣式中（須在 transition 之後才能覆蓋）。
 *
 * @param prefix class 前綴，與 `renderDialog()` 的 `prefix` 相同（只可傳入程式中的常數）
 */
export declare function dialogBaseStyles(prefix: string): CSSResult;
//# sourceMappingURL=modal-dialog.styles.d.ts.map