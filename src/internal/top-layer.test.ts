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

  describe('raisePopover with nested popovers (#4)', () => {
    const fill = 'position: fixed; inset: 0; margin: 0; width: 200px; height: 200px;';

    for (const childType of ['auto', 'manual'] as const) {
      it(`keeps an open ${childType} child popover open and above its parent`, () => {
        const parent = document.createElement('div');
        parent.popover = 'manual';
        parent.style.cssText = fill;
        const child = document.createElement('div');
        child.popover = childType;
        child.style.cssText = 'position: fixed; inset: 0; margin: 0; width: 50px; height: 50px;';
        parent.appendChild(child);
        document.body.appendChild(parent);
        parent.showPopover();
        child.showPopover();

        raisePopover(parent);

        expect(parent.matches(':popover-open')).to.be.true;
        expect(child.matches(':popover-open'), 'child popover stays open').to.be.true;
        expect(document.elementFromPoint(10, 10), 'child stays above parent').to.equal(child);
      });
    }

    it('keeps an open popover inside Shadow DOM (e.g. an open aui-tooltip) above the parent', () => {
      const parent = document.createElement('div');
      parent.popover = 'manual';
      parent.style.cssText = fill;
      const host = document.createElement('div');
      const inner = document.createElement('div');
      inner.popover = 'manual';
      inner.style.cssText = 'position: fixed; inset: 0; margin: 0; width: 50px; height: 50px;';
      host.attachShadow({ mode: 'open' }).appendChild(inner);
      parent.appendChild(host);
      document.body.appendChild(parent);
      parent.showPopover();
      inner.showPopover();

      raisePopover(parent);

      expect(inner.matches(':popover-open')).to.be.true;
      expect(host.shadowRoot!.elementFromPoint(10, 10)).to.equal(inner);
    });
  });

  describe('followTopModal edge cases', () => {
    it('falls back to <body> without throwing when the original parent is removed (#2)', () => {
      const home = document.createElement('section');
      document.body.appendChild(home);
      const first = createViewport();
      const second = createViewport();
      home.append(first.viewport, second.viewport);
      first.viewport.showPopover();
      second.viewport.showPopover();
      const stopFirst = followTopModal(first.viewport);
      const stopSecond = followTopModal(second.viewport);
      cleanups.push(stopFirst, stopSecond);

      const { dialog, container } = createModal();
      dialog.showModal();
      const pop = pushModalLayer(container);
      home.remove(); // 例如框架切換頁面時拆掉原本的區塊

      dialog.close();
      expect(() => pop()).to.not.throw();
      for (const { viewport } of [first, second]) {
        expect(viewport.parentElement, 'every follower is moved back').to.equal(document.body);
        expect(viewport.matches(':popover-open')).to.be.true;
      }
    });

    it('returns to where the element was inserted after following started (#3)', () => {
      const viewport = document.createElement('div');
      viewport.popover = 'manual';
      cleanups.push(followTopModal(viewport)); // 尚未插入頁面就開始跟隨

      const home = document.createElement('section');
      document.body.appendChild(home);
      home.appendChild(viewport);
      viewport.showPopover();

      const { dialog, container } = createModal();
      dialog.showModal();
      const pop = pushModalLayer(container);
      expect(viewport.parentElement).to.equal(container);

      dialog.close();
      pop();
      expect(viewport.parentElement, 'not stuck inside the closed dialog').to.equal(home);
      expect(viewport.matches(':popover-open')).to.be.true;
      home.remove();
    });

    it('keeps notifying other followers when one of them throws', () => {
      const { viewport: good } = createViewport();
      cleanups.push(followTopModal(good));
      // reportError 會觸發 window 的 error 事件，測試框架會當成未捕捉的錯誤，因此暫時替換以收集錯誤
      const errors: unknown[] = [];
      const originalReportError = globalThis.reportError;
      globalThis.reportError = (error: unknown) => errors.push(error);
      // 以自訂的會拋錯元素模擬未知的失敗（登記完成後才開始拋錯，模擬 modal 開啟時才發生的錯誤）
      const broken = document.createElement('div');
      document.body.appendChild(broken);
      let failing = false;
      const originalMatches = broken.matches.bind(broken);
      Object.defineProperty(broken, 'matches', {
        value: (selector: string) => {
          if (failing) throw new Error('boom');
          return originalMatches(selector);
        },
      });
      const stopBroken = followTopModal(broken);
      failing = true;
      cleanups.push(() => {
        failing = false;
        stopBroken();
      });

      const { dialog, container } = createModal();
      dialog.showModal();
      try {
        cleanups.push(pushModalLayer(container));
        expect(good.parentElement, 'healthy follower still moved').to.equal(container);
        expect(errors.length, 'error is reported, not swallowed').to.be.greaterThan(0);
      } finally {
        failing = false; // 之後的清理（移除 modal 層）不再模擬錯誤
        globalThis.reportError = originalReportError;
      }
    });
  });
});
