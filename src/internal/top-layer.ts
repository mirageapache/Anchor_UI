import { sharedState } from './shared-state.js';

/**
 * Top Layer 工具（Modal、Alert、Toast 共用）。
 *
 * 1. 堆疊順序：Top Layer 中越晚進入的元素越上層，`raisePopover()` 把已開啟的 popover 重新提升到最上面。
 * 2. modal 的 inert 邊界：`<dialog>.showModal()` 開啟時，dialog 子樹以外的所有節點都會變成 inert——
 *    即使是 Top Layer 中位於 dialog 之上的 popover 也一樣：看得到，卻無法互動、也不會被螢幕閱讀器播報。
 *    因此 modal 開啟期間，需要保持可互動的浮層（如 Toast Viewport）必須移入最上層 modal 的子樹。
 *
 * 使用方式：
 * - Modal 開啟時呼叫 `pushModalLayer(container)` 登記可收容外部浮層的容器，關閉時呼叫回傳的函式。
 * - Toast 等浮層呼叫 `followTopModal(element)`，之後會自動在「最上層 modal 的容器」與原位置之間移動。
 *
 * 詳見 note/04-top-layer.md。
 */

interface TopLayerState {
  /** 已開啟的 modal 所提供的容器，最後一個為最上層 */
  layers: Element[];
  listeners: Set<() => void>;
}

const state = sharedState<TopLayerState>('top-layer@1', () => ({
  layers: [],
  listeners: new Set(),
}));

function notify(): void {
  for (const listener of [...state.listeners]) listener();
}

/** 將已開啟的 popover 重新提升至 Top Layer 最上層；未開啟則不處理 */
export function raisePopover(element: HTMLElement): void {
  if (!element.matches(':popover-open')) return;
  element.hidePopover();
  element.showPopover();
}

/**
 * 登記一個已開啟的 modal 層，回傳移除函式（可重複呼叫）。
 *
 * @param container 可收容外部浮層的元素，必須位於該 modal dialog 的 flat tree 子樹內：
 *   可以是 dialog 內的元素；若 dialog 位於 Shadow DOM，可傳入 host，並由 dialog 內的具名 slot 分配
 *   （搭配 `followTopModal(el, { slot })`）。
 */
export function pushModalLayer(container: Element): () => void {
  state.layers.push(container);
  notify();

  let popped = false;
  return () => {
    if (popped) return;
    popped = true;
    const index = state.layers.lastIndexOf(container);
    if (index !== -1) state.layers.splice(index, 1);
    notify();
  };
}

/** 目前最上層 modal 所提供的容器；沒有開啟中的 modal 時為 null */
export function getTopModalLayer(): Element | null {
  return state.layers.at(-1) ?? null;
}

export interface FollowTopModalOptions {
  /** 移入容器時套用的 slot 名稱（容器為 Shadow DOM 中 dialog 的 host 時使用） */
  slot?: string;
}

/**
 * 讓元素跟隨最上層 modal：有 modal 開啟時移入其容器，全部關閉後回到原位置。
 * 移動時 popover 會被瀏覽器關閉，因此原本開啟的 popover 會在移動後重新開啟（並位於 Top Layer 最上層）。
 *
 * @returns 停止跟隨的函式，並將元素移回原位置
 */
export function followTopModal(
  element: HTMLElement,
  options: FollowTopModalOptions = {},
): () => void {
  const home = element.parentNode;
  const homeNextSibling = element.nextSibling;
  const homeSlot = element.getAttribute('slot');

  const moveTo = (container: Element | null) => {
    const parent = container ?? home;
    if (!parent || element.parentNode === parent) return;

    const wasOpen = element.matches(':popover-open');
    if (container) {
      if (options.slot) element.slot = options.slot;
      container.appendChild(element);
    } else {
      if (homeSlot === null) element.removeAttribute('slot');
      else element.slot = homeSlot;
      const before = homeNextSibling?.parentNode === home ? homeNextSibling : null;
      home!.insertBefore(element, before);
    }
    if (wasOpen && !element.matches(':popover-open')) element.showPopover();
  };

  const listener = () => moveTo(getTopModalLayer());
  state.listeners.add(listener);
  listener();

  return () => {
    state.listeners.delete(listener);
    moveTo(null);
  };
}
