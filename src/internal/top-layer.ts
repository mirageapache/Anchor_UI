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
  for (const listener of [...state.listeners]) {
    // 單一 listener 出錯不可中斷其他 listener（例如其餘浮層仍須移出已關閉的 modal）；
    // 錯誤交給全域錯誤處理回報，而不是默默吞掉
    try {
      listener();
    } catch (error) {
      globalThis.reportError?.(error);
    }
  }
}

/** 收集 root 子樹內（含各層 Shadow DOM）已開啟的 popover，依樹狀順序排列 */
function openPopoversWithin(root: Element): HTMLElement[] {
  const result: HTMLElement[] = [];
  const visit = (node: Element) => {
    for (const child of node.children) {
      if (child instanceof HTMLElement && child.matches(':popover-open')) result.push(child);
      if (child.shadowRoot) {
        for (const shadowChild of child.shadowRoot.children) {
          if (shadowChild instanceof HTMLElement && shadowChild.matches(':popover-open')) {
            result.push(shadowChild);
          }
          visit(shadowChild);
        }
      }
      visit(child);
    }
  };
  visit(root);
  return result;
}

/** 重新進入 Top Layer：先移出再放回（瀏覽器沒有直接調整順序的 API） */
function reenterTopLayer(popover: HTMLElement): void {
  if (popover.matches(':popover-open')) popover.hidePopover();
  popover.showPopover();
}

/**
 * 將已開啟的 popover 重新提升至 Top Layer 最上層；未開啟則不處理。
 *
 * 子樹內已開啟的子 popover（含 Shadow DOM 內，例如浮層中開啟的 Tooltip）會一併重新提升，
 * 維持「子 popover 在父 popover 之上」，並重新開啟因父層隱藏而被連帶關閉的 auto popover。
 * 注意：過程中會觸發這些 popover 的 beforetoggle / toggle 事件。
 */
export function raisePopover(element: HTMLElement): void {
  if (!element.matches(':popover-open')) return;
  const nested = openPopoversWithin(element);
  reenterTopLayer(element);
  for (const popover of nested) {
    if (popover.isConnected) reenterTopLayer(popover);
  }
}

/**
 * 登記一個已開啟的 modal 層，回傳移除函式（可重複呼叫）。
 *
 * **須在 `dialog.showModal()` 之後呼叫**：跟隨中的浮層會在登記時重新進入 Top Layer，
 * 若 dialog 尚未開啟，之後才進入 Top Layer 的 dialog（及其 backdrop）會蓋在浮層之上。
 * 關閉時則先 `dialog.close()` 再呼叫移除函式。
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
 * - 「原位置」在元素**由原位置移入 modal 的當下**才記錄，因此元素可以先開始跟隨、之後才插入頁面。
 * - 回到原位置時，若原本的父節點已不在頁面上（例如框架拆掉了該區塊），改放到 `<body>`。
 *
 * @returns 停止跟隨的函式，並將元素移回原位置
 */
export function followTopModal(
  element: HTMLElement,
  options: FollowTopModalOptions = {},
): () => void {
  /** 移入 modal 前的位置；null 表示元素目前位於原位置（未被移入任何 modal） */
  let home: {
    parent: ParentNode | null;
    nextSibling: ChildNode | null;
    slot: string | null;
  } | null = null;

  const moveTo = (container: Element | null) => {
    const wasOpen = element.matches(':popover-open');

    if (container) {
      if (element.parentNode === container) return;
      home ??= {
        parent: element.parentNode,
        nextSibling: element.nextSibling,
        slot: element.getAttribute('slot'),
      };
      if (options.slot) element.slot = options.slot;
      container.appendChild(element);
    } else {
      if (!home) return; // 本來就在原位置
      const { parent, nextSibling, slot } = home;
      home = null;
      if (slot === null) element.removeAttribute('slot');
      else element.slot = slot;
      if (parent?.isConnected) {
        parent.insertBefore(element, nextSibling?.parentNode === parent ? nextSibling : null);
      } else {
        document.body.appendChild(element);
      }
    }

    // 只有位於頁面上的 popover 才能開啟
    if (wasOpen && element.isConnected && !element.matches(':popover-open')) {
      element.showPopover();
    }
  };

  const listener = () => moveTo(getTopModalLayer());
  state.listeners.add(listener);
  listener();

  return () => {
    state.listeners.delete(listener);
    moveTo(null);
  };
}
