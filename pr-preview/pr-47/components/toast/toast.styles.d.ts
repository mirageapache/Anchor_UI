/** 通知卡片 <aui-toast> */
export declare const toastStyles: import('lit').CSSResult;
/**
 * 堆疊通知的 Viewport（由 ToastService 建立的 popover div，透過其 Shadow DOM 套用）。
 * 自訂樣式會覆蓋瀏覽器對 [popover] 的預設樣式（置中、邊框、背景），因此須自行隱藏關閉狀態。
 *
 * 位置由 data-placement 決定（ToastService.configure({ placement })，預設 bottom-right；屬性缺少或無效時同預設）：
 *
 * - 對齊：位置名稱是實體方向（left / right），因此使用實體的 left / right 而不是 inset-inline，
 *   RTL 頁面上「右下」仍在右下。置中以 left: calc((100% - 寬度) / 2) 計算，不使用 margin: auto
 *   （頁面的全域 reset，如本套件 styles.css 的 * { margin: 0 }，套用在 Viewport 元素上時優先於 :host 的規則）
 *   也不使用 translate（視窗寬度為奇數時會落在半個像素上，文字變模糊）。
 * - 堆疊方向：DOM 順序固定為由舊到新（螢幕閱讀器依出現順序讀出）。下方位置用 column（最新的在最下面），
 *   上方位置用 column-reverse（最新的在最上面），新通知永遠出現在靠近螢幕邊緣的一側。
 *   上方位置時 Tab 會由下往上經過各通知的關閉鈕，這是保留 DOM 順序的取捨。
 * - 超出視窗高度：通知的總高度超過 max-height 時，讓「最舊的」往螢幕外溢出、最新的留在畫面上
 *   （兩種方向都用 justify-content: flex-end：column 的主軸終點在下方、column-reverse 的在上方，
 *   都是最新通知所在的那一側，溢出的部分因此落在最舊的那一端）。
 * - 動畫方向：以 CSS 變數傳給通知卡片（自訂屬性會繼承進 <aui-toast> 的 Shadow DOM）。
 *   進場從所在的邊緣滑入；退場時靠左往左、靠右往右，置中沒有左右方向，改往所在的邊緣（上或下）滑出。
 * - 小螢幕（手機）：不論設定為何，一律顯示在中間上方
 *   （下方常被瀏覽器工具列、虛擬鍵盤或主要操作按鈕佔用），並避開瀏海等安全區域。
 *   直向以寬度 480px 以下判斷，通知橫向撐滿；橫向以「高度 480px 以下且為橫向」判斷
 *   （手機橫放時寬度超過 480px，但高度只有 360–430px；平板的短邊至少 600px，不受影響），
 *   此時寬度足夠，通知維持一般寬度並置中，不撐滿整個畫面。
 *   媒體查詢內的選擇器列出 [data-placement]，讓優先度不低於依位置設定的規則。
 *
 * 說明集中寫在這裡而不是樣式內：css 範本中的註解會原樣進入發布產物。
 */
export declare const toastViewportStyles: import('lit').CSSResult;
//# sourceMappingURL=toast.styles.d.ts.map