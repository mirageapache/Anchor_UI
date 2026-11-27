/**
 * 取得可參與表單的 ElementInternals；環境不支援時回傳 null，元件改走退回方案（以 DOM 查找表單擁有者等）。
 *
 * 只檢查 `attachInternals` 是否存在並不夠：jsdom 的 ElementInternals 只實作無障礙屬性（`role`、`aria*`），
 * 沒有 `setFormValue`、`setValidity`、`form`。`attachInternals` 對同一個元素只能呼叫一次，
 * 因此先呼叫再檢查回傳的物件。須於元件建構式中呼叫。
 */
export function attachFormInternals(host: HTMLElement): ElementInternals | null {
  if (typeof host.attachInternals !== 'function') return null;
  const internals = host.attachInternals();
  const formAssociated =
    typeof internals.setFormValue === 'function' &&
    typeof internals.setValidity === 'function' &&
    'form' in internals;
  return formAssociated ? internals : null;
}

/**
 * 不支援 ElementInternals 的環境（happy-dom、jsdom、舊版瀏覽器）中，以 DOM 查找元素的表單擁有者：
 * 優先採用 `form="id"` 屬性指向的外部表單，否則為最近的祖先 `<form>`。
 */
export function findFormOwner(host: HTMLElement): HTMLFormElement | null {
  const formId = host.getAttribute('form');
  if (formId) {
    const root = host.getRootNode() as Document | ShadowRoot;
    const referenced = root.getElementById?.(formId);
    return referenced instanceof HTMLFormElement ? referenced : null;
  }
  return host.closest('form');
}
