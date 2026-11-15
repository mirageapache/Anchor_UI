import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * host 的 light DOM 中，是否有會被指派到指定 slot 的實際內容（`slotName` 為空字串代表預設 slot）。
 *
 * 直接檢查 light DOM 而不是 slot.assignedNodes()：
 * - 首次渲染前就能得到結果，不必等 slotchange（happy-dom 等環境不會分派第一次 slotchange）。
 * - 範本縮排產生的空白文字節點也會被指派到預設 slot，這裡忽略只含空白的文字節點。
 */
export function hasLightContent(host: Element, slotName = ''): boolean {
  for (const node of host.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (((node as Element).getAttribute('slot') ?? '') === slotName) return true;
    } else if (node.nodeType === Node.TEXT_NODE && slotName === '' && node.textContent?.trim()) {
      return true;
    }
  }
  return false;
}

/**
 * light DOM 內容變動時要求 host 重新渲染，讓 render() 中的 hasLightContent() 保持最新。
 *
 * 不使用 slotchange：框架綁定的文字（如 Vue 的 `{{ text }}`、Lit 的 `${text}`）更新時只會改寫既有文字節點的內容，
 * 指派到 slot 的節點集合不變，slotchange 不會觸發。
 */
export class LightContentController implements ReactiveController {
  private observer?: MutationObserver;

  constructor(private host: ReactiveControllerHost & Element) {
    host.addController(this);
  }

  hostConnected(): void {
    if (typeof MutationObserver === 'undefined') return;
    this.observer ??= new MutationObserver(() => this.host.requestUpdate());
    this.observer.observe(this.host, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot'],
    });
  }

  hostDisconnected(): void {
    this.observer?.disconnect();
  }
}
