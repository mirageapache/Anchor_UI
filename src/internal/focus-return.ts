/**
 * 焦點返還（Modal、Alert、Drawer 共用）。
 *
 * 鍵盤使用者開啟浮層後，關閉時焦點應回到原本的觸發元素（WAI-ARIA Dialog Pattern）。
 * 難點在 Shadow DOM：`document.activeElement` 只會回傳最外層的 shadow host，
 * 必須逐層進入 shadowRoot 才能取得實際聚焦的元素（例如 <aui-button> 內部的 <button>）。
 *
 * 詳見 note/05-overlay-foundation.md。
 */

/** 穿透 Shadow DOM，取得實際聚焦的元素 */
export function getDeepActiveElement(root: Document | ShadowRoot = document): Element | null {
  let active = root.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/**
 * 記錄目前實際聚焦的元素，回傳「還原焦點」函式。
 * 若觸發元素已被移除（例如刪除確認後該列消失），或開啟時沒有任何元素聚焦，則不做任何事。
 */
export function rememberFocus(): () => void {
  const previous = getDeepActiveElement();
  return () => {
    if (!previous || previous === document.body || !previous.isConnected) return;
    (previous as HTMLElement | SVGElement).focus?.();
  };
}
