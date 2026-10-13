import { expect } from '@open-wc/testing';
import { followTopModal, getTopModalLayer, pushModalLayer, raisePopover } from './top-layer.js';

/** inert 的元素無法取得焦點：以此判斷是否可互動 */
function canFocus(el: HTMLElement): boolean {
  el.focus();
  return document.activeElement === el || el.matches(':focus-within');
}

/** 建立 modal dialog，並在其子樹內提供收容外部浮層的容器 */
function createModal(): { dialog: HTMLDialogElement; container: HTMLDivElement } {
  const dialog = document.createElement('dialog');
  const container = document.createElement('div');
  dialog.append(document.createElement('button'), container);
  document.body.appendChild(dialog);
  return { dialog, container };
}

/** 模擬 Toast Viewport：popover="manual" 且內含可互動按鈕 */
function createViewport(): { viewport: HTMLDivElement; action: HTMLButtonElement } {
  const viewport = document.createElement('div');
  viewport.popover = 'manual';
  const action = document.createElement('button');
  action.textContent = 'Dismiss';
  viewport.appendChild(action);
  document.body.appendChild(viewport);
  viewport.showPopover();
  return { viewport, action };
}

/**
 * 以 Shadow DOM 中的 <dialog> 搭配具名 slot 提供容器，對應未來 <aui-modal> 的實作方式：
 * 外部浮層以 light DOM 子元素掛入 host，經 slot 分配後位於 dialog 的 flat tree 子樹內。
 */
class ShadowModalHost extends HTMLElement {
  dialog: HTMLDialogElement;
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = '<dialog><button>Inside</button><slot name="overlay"></slot></dialog>';
    this.dialog = root.querySelector('dialog')!;
  }
}
if (!customElements.get('shadow-modal-host')) {
  customElements.define('shadow-modal-host', ShadowModalHost);
}

describe('internal/top-layer', () => {
  const cleanups: Array<() => void> = [];
  afterEach(() => {
    while (cleanups.length) cleanups.pop()!();
    document.querySelectorAll('dialog').forEach((d) => d.open && d.close());
    document.body
      .querySelectorAll('dialog, [popover], shadow-modal-host')
      .forEach((n) => n.remove());
  });

  describe('raisePopover', () => {
    it('moves an open popover back to the top of the top layer', () => {
      const first = document.createElement('div');
      const second = document.createElement('div');
      for (const el of [first, second]) {
        el.popover = 'manual';
        el.style.cssText = 'position: fixed; inset: 0; margin: 0; width: 100px; height: 100px;';
      }
      document.body.append(first, second);
      first.showPopover();
      second.showPopover();
      expect(document.elementFromPoint(50, 50)).to.equal(second);

      raisePopover(first);
      expect(first.matches(':popover-open')).to.be.true;
      // 越晚進入 Top Layer 越上層：重新提升後 first 位於 second 之上
      expect(document.elementFromPoint(50, 50)).to.equal(first);
    });

    it('ignores popovers that are not open', () => {
      const popover = document.createElement('div');
      popover.popover = 'manual';
      document.body.appendChild(popover);
      raisePopover(popover);
      expect(popover.matches(':popover-open')).to.be.false;
    });
  });

  describe('modal layer stack', () => {
    it('tracks the topmost modal layer and pops in any order', () => {
      const a = document.createElement('div');
      const b = document.createElement('div');
      expect(getTopModalLayer()).to.be.null;

      const popA = pushModalLayer(a);
      const popB = pushModalLayer(b);
      expect(getTopModalLayer()).to.equal(b);

      popA(); // 非最上層先關閉
      expect(getTopModalLayer()).to.equal(b);
      popB();
      popB(); // 重複呼叫無副作用
      expect(getTopModalLayer()).to.be.null;
    });
  });

  describe('followTopModal (inert boundary of modal dialogs)', () => {
    it('confirms the problem: a popover outside an open modal dialog is inert', () => {
      const { dialog } = createModal();
      dialog.showModal();
      const { action } = createViewport(); // 即使在 dialog 之後顯示（視覺上在上層）
      expect(canFocus(action)).to.be.false;
    });

    it('keeps a popover interactive by moving it into the topmost modal subtree', () => {
      const { viewport, action } = createViewport();
      cleanups.push(followTopModal(viewport));

      const { dialog, container } = createModal();
      dialog.showModal();
      cleanups.push(pushModalLayer(container));

      expect(viewport.parentElement).to.equal(container);
      expect(viewport.matches(':popover-open'), 'stays open after moving').to.be.true;
      expect(canFocus(action)).to.be.true;
    });

    it('follows nested modals and returns home when all modals close', () => {
      const { viewport, action } = createViewport();
      const home = viewport.parentElement!;
      cleanups.push(followTopModal(viewport));

      const outer = createModal();
      outer.dialog.showModal();
      const popOuter = pushModalLayer(outer.container);
      const inner = createModal();
      inner.dialog.showModal();
      const popInner = pushModalLayer(inner.container);

      expect(viewport.parentElement).to.equal(inner.container);
      expect(canFocus(action)).to.be.true;

      inner.dialog.close();
      popInner();
      expect(viewport.parentElement).to.equal(outer.container);
      expect(canFocus(action)).to.be.true;

      outer.dialog.close();
      popOuter();
      expect(viewport.parentElement).to.equal(home);
      expect(viewport.matches(':popover-open')).to.be.true;
    });

    it('works with a dialog inside Shadow DOM through a named slot (aui-modal design)', () => {
      const { viewport, action } = createViewport();
      cleanups.push(followTopModal(viewport, { slot: 'overlay' }));

      const host = document.createElement('shadow-modal-host') as ShadowModalHost;
      document.body.appendChild(host);
      host.dialog.showModal();
      cleanups.push(pushModalLayer(host));

      expect(viewport.parentElement).to.equal(host);
      expect(viewport.slot).to.equal('overlay');
      expect(canFocus(action)).to.be.true;
    });

    it('moves the element home and stops following when disposed', () => {
      const { viewport } = createViewport();
      const home = viewport.parentElement!;
      const stop = followTopModal(viewport);

      const { dialog, container } = createModal();
      dialog.showModal();
      const pop = pushModalLayer(container);
      expect(viewport.parentElement).to.equal(container);

      stop();
      expect(viewport.parentElement).to.equal(home);
      pop();
      expect(viewport.parentElement).to.equal(home);
    });
  });
});
