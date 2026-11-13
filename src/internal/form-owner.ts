/**
 * 不支援 ElementInternals 的環境（happy-dom、舊版瀏覽器）中，以 DOM 查找元素的表單擁有者：
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
