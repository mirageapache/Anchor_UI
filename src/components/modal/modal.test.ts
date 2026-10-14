import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import './index.js';
import '../button/index.js';
import type { AuiModal } from './modal.js';
import type { ModalHideDetail } from './modal.types.js';
import { followTopModal, getTopModalLayer } from '../../internal/top-layer.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import { isScrollLocked } from '../../internal/scroll-lock.js';

const dialogOf = (el: AuiModal) => el.shadowRoot!.querySelector('dialog')!;
const panelOf = (el: AuiModal) => el.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;
const part = (el: AuiModal, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;

/** 開啟並等待進場完成 */
async function openModal(el: AuiModal): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.open = true;
  await shown;
}

/** 執行關閉動作並回傳 aui-after-hide 的關閉原因 */
async function closeWith(el: AuiModal, action: () => unknown): Promise<string> {
  const hidden = oneEvent(el, 'aui-after-hide');
  await action();
  return ((await hidden) as CustomEvent<ModalHideDetail>).detail.reason;
}

/**
 * 取得使用者啟用（user activation）：沒有啟用時，Chrome 會忽略 cancel 事件的 preventDefault()。
 * 須在開啟前呼叫（開啟後點擊頁面會點到遮罩）。
 */
async function activateUser(): Promise<void> {
  const button = document.createElement('button');
  button.textContent = 'activate';
  button.style.cssText = 'position: fixed; top: 0; left: 0;';
  document.body.appendChild(button);
  try {
    await sendMouse({ type: 'click', position: [5, 5] });
  } finally {
    button.remove();
  }
}

describe('AuiModal (<aui-modal>)', () => {
  before(async () => {
    // 多數測試不需要動畫，減少動畫可讓轉場時長為 0
    await emulateMedia({ reducedMotion: 'reduce' });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('opening', () => {
    it('is closed by default', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Title">Body</aui-modal>`);
      expect(el.open).to.be.false;
      expect(dialogOf(el).open).to.be.false;
      expect(getComputedStyle(dialogOf(el)).display).to.equal('none');
    });

    it('opens as a modal dialog in the top layer and emits aui-show / aui-after-show', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Title">Body</aui-modal>`);
      const events: string[] = [];
      el.addEventListener('aui-show', () => events.push('aui-show'));
      el.addEventListener('aui-after-show', () => events.push('aui-after-show'));

      await openModal(el);
      expect(events).to.deep.equal(['aui-show', 'aui-after-show']);
      expect(el.hasAttribute('open')).to.be.true;
      expect(dialogOf(el).open).to.be.true;
      expect(dialogOf(el).matches(':modal')).to.be.true;
      expect(isScrollLocked()).to.be.true;

      await closeWith(el, () => el.hide());
      expect(isScrollLocked()).to.be.false;
    });

    it('opens when rendered with the open attribute', async () => {
      const el = await fixture<AuiModal>(
        html`<aui-modal open heading="Initially open"></aui-modal>`,
      );
      await el.updateComplete;
      expect(dialogOf(el).open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('supports show() and hide()', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Methods"></aui-modal>`);
      const shown = oneEvent(el, 'aui-after-show');
      await el.show();
      await shown;
      expect(el.open).to.be.true;
      expect(await closeWith(el, () => el.hide())).to.equal('api');
      expect(el.open).to.be.false;
      expect(dialogOf(el).open).to.be.false;
    });

    it('stays closed when aui-show is cancelled', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Cancel show"></aui-modal>`);
      el.addEventListener('aui-show', (event) => event.preventDefault());
      let afterShow = 0;
      el.addEventListener('aui-after-show', () => afterShow++);

      el.open = true;
      await el.updateComplete;
      await el.updateComplete;
      expect(el.open).to.be.false;
      expect(dialogOf(el).open).to.be.false;
      expect(isScrollLocked()).to.be.false;
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(afterShow).to.equal(0);
    });
  });

  describe('closing', () => {
    it('stays open when aui-hide is cancelled, and reports the reason', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Cancel hide"></aui-modal>`);
      await openModal(el);
      const reasons: string[] = [];
      const keepOpen = (event: Event) => {
        reasons.push((event as CustomEvent<ModalHideDetail>).detail.reason);
        event.preventDefault();
      };
      el.addEventListener('aui-hide', keepOpen);

      await el.hide();
      await el.updateComplete;
      await el.updateComplete;
      expect(reasons).to.deep.equal(['api']);
      expect(el.open).to.be.true;
      expect(dialogOf(el).open).to.be.true;

      el.removeEventListener('aui-hide', keepOpen);
      await closeWith(el, () => el.hide());
    });

    it('closes on Escape with reason "escape"', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Escape"></aui-modal>`);
      await activateUser();
      await openModal(el);
      expect(await closeWith(el, () => sendKeys({ press: 'Escape' }))).to.equal('escape');
      expect(el.open).to.be.false;
    });

    it('ignores Escape when close-on-escape="false"', async () => {
      const el = await fixture<AuiModal>(
        html`<aui-modal heading="No escape" close-on-escape="false"></aui-modal>`,
      );
      expect(el.closeOnEscape).to.be.false;
      await activateUser();
      await openModal(el);
      await sendKeys({ press: 'Escape' });
      await el.updateComplete;
      expect(el.open).to.be.true;
      expect(dialogOf(el).open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('is force-closed by the browser on a repeated Escape without new user activation', async () => {
      const el = await fixture<AuiModal>(
        html`<aui-modal heading="Repeated escape" close-on-escape="false"></aui-modal>`,
      );
      await activateUser();
      await openModal(el);
      await sendKeys({ press: 'Escape' });
      await el.updateComplete;
      expect(el.open, 'the first Escape is prevented').to.be.true;

      // 攔下 ESC 會消耗使用者啟用；沒有新的互動時，瀏覽器忽略 preventDefault() 並直接關閉
      const hide = oneEvent(el, 'aui-hide');
      const reason = closeWith(el, () => sendKeys({ press: 'Escape' }));
      expect(((await hide) as CustomEvent).cancelable).to.be.false;
      expect(await reason).to.equal('escape');
      expect(el.open).to.be.false;
      expect(isScrollLocked()).to.be.false;
    });

    it('closes on a backdrop click with reason "backdrop", but not on a panel click', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Backdrop">Body</aui-modal>`);
      await openModal(el);

      const rect = panelOf(el).getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      await el.updateComplete;
      expect(el.open, 'panel click keeps it open').to.be.true;

      expect(await closeWith(el, () => sendMouse({ type: 'click', position: [5, 5] }))).to.equal(
        'backdrop',
      );
    });

    it('does not close when a drag starts in the panel and ends on the backdrop', async () => {
      const el = await fixture<AuiModal>(
        html`<aui-modal heading="Drag">Selectable text</aui-modal>`,
      );
      await openModal(el);
      const rect = panelOf(el).getBoundingClientRect();

      await sendMouse({
        type: 'move',
        position: [Math.round(rect.x + 20), Math.round(rect.y + 60)],
      });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: [5, 5] });
      await sendMouse({ type: 'up' });
      await el.updateComplete;
      expect(el.open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('ignores backdrop clicks when close-on-backdrop="false"', async () => {
      const el = await fixture<AuiModal>(
        html`<aui-modal heading="Static" close-on-backdrop="false"></aui-modal>`,
      );
      await openModal(el);
      await sendMouse({ type: 'click', position: [5, 5] });
      await el.updateComplete;
      expect(el.open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('treats only the string "false" as false for default-true attributes', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal close-on-backdrop=""></aui-modal>`);
      expect(el.closeOnBackdrop).to.be.true;
      el.setAttribute('close-on-backdrop', 'false');
      expect(el.closeOnBackdrop).to.be.false;
      el.removeAttribute('close-on-backdrop');
      expect(el.closeOnBackdrop).to.be.true;
    });

    it('closes with the header close button (reason "close-button") unless hidden', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Close button"></aui-modal>`);
      await openModal(el);
      const button = part(el, 'close-button');
      expect(button.getAttribute('aria-label')).to.equal('關閉');
      expect(await closeWith(el, () => button.click())).to.equal('close-button');

      el.noCloseButton = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('[part="close-button"]')).to.be.null;
    });

    it('syncs state when the browser closes the dialog by itself', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Forced close"></aui-modal>`);
      await openModal(el);
      const hide = oneEvent(el, 'aui-hide');
      const afterHide = oneEvent(el, 'aui-after-hide');

      // 模擬瀏覽器略過 cancel 直接關閉（如 Chrome 在沒有使用者啟用時的 ESC）
      dialogOf(el).close();
      const hideEvent = (await hide) as CustomEvent<ModalHideDetail>;
      expect(hideEvent.cancelable).to.be.false;
      expect(((await afterHide) as CustomEvent<ModalHideDetail>).detail.reason).to.equal('escape');
      await el.updateComplete;
      expect(el.open).to.be.false;
      expect(isScrollLocked()).to.be.false;
      expect(getTopModalLayer()).to.be.null;
    });

    it('releases the scroll lock and modal layer when removed while open', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Removed"></aui-modal>`);
      await openModal(el);
      expect(getTopModalLayer()).to.equal(el);

      el.remove();
      expect(isScrollLocked()).to.be.false;
      expect(getTopModalLayer()).to.be.null;
      expect(el.open).to.be.false;
    });
  });

  describe('animation', () => {
    before(async () => {
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    after(async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
    });

    it('waits for the exit transition before closing the dialog', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Animated"></aui-modal>`);
      await openModal(el);
      expect(dialogOf(el).classList.contains('modal--visible')).to.be.true;

      const hidden = oneEvent(el, 'aui-after-hide');
      await el.hide();
      await el.updateComplete;
      expect(dialogOf(el).classList.contains('modal--visible')).to.be.false;
      expect(dialogOf(el).open, 'still open while animating out').to.be.true;
      await hidden;
      expect(dialogOf(el).open).to.be.false;
    });

    it('can be reopened during the exit transition', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Reopen"></aui-modal>`);
      await openModal(el);
      let afterHide = 0;
      el.addEventListener('aui-after-hide', () => afterHide++);

      await el.hide();
      await el.updateComplete;
      await openModal(el);
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(afterHide).to.equal(0);
      expect(dialogOf(el).open).to.be.true;
      expect(dialogOf(el).classList.contains('modal--visible')).to.be.true;

      await closeWith(el, () => el.hide());
      expect(isScrollLocked()).to.be.false;
    });
  });

  describe('layout', () => {
    it('hides the header and footer when they have no content', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal no-close-button>Body only</aui-modal>`);
      await openModal(el);
      expect(getComputedStyle(part(el, 'header')).display).to.equal('none');
      expect(getComputedStyle(part(el, 'footer')).display).to.equal('none');
      await closeWith(el, () => el.hide());
    });

    it('shows the header for heading or slotted header content, and the footer for footer content', async () => {
      const el = await fixture<AuiModal>(html`
        <aui-modal>
          <span slot="header">Custom header</span>
          Body
          <button slot="footer">OK</button>
        </aui-modal>
      `);
      await openModal(el);
      expect(getComputedStyle(part(el, 'header')).display).to.equal('flex');
      expect(getComputedStyle(part(el, 'footer')).display).to.equal('flex');

      el.querySelector('[slot="footer"]')!.remove();
      await el.updateComplete;
      await el.updateComplete;
      expect(getComputedStyle(part(el, 'footer')).display).to.equal('none');
      await closeWith(el, () => el.hide());
    });

    it('applies the size as the panel max-width', async () => {
      const el = await fixture<AuiModal>(html`<aui-modal heading="Sizes"></aui-modal>`);
      await openModal(el);
      for (const [size, width] of [
        ['sm', '420px'],
        ['md', '600px'],
        ['lg', '840px'],
      ] as const) {
        el.size = size;
        await el.updateComplete;
        expect(getComputedStyle(panelOf(el)).maxWidth).to.equal(width);
      }
      await closeWith(el, () => el.hide());
    });

    it('scrolls long content inside the body instead of overflowing the viewport', async () => {
      const el = await fixture<AuiModal>(html`
        <aui-modal heading="Long">
          <div style="height: 3000px">Tall content</div>
          <button slot="footer">OK</button>
        </aui-modal>
      `);
      await openModal(el);
      expect(panelOf(el).getBoundingClientRect().bottom).to.be.at.most(window.innerHeight);
      const body = part(el, 'body');
      expect(body.scrollHeight).to.be.greaterThan(body.clientHeight);
      await closeWith(el, () => el.hide());
    });
  });

  describe('focus', () => {
    it('focuses the [autofocus] element, ignoring ones inside nested modals', async () => {
      const el = await fixture<AuiModal>(html`
        <aui-modal heading="Autofocus">
          <aui-modal heading="Nested"><button autofocus>Nested</button></aui-modal>
          <input id="name" autofocus />
        </aui-modal>
      `);
      await openModal(el);
      expect(document.activeElement).to.equal(el.querySelector('#name'));
      await closeWith(el, () => el.hide());
    });

    it('focuses the panel when there is no [autofocus] element', async () => {
      const el = await fixture<AuiModal>(
        html`<aui-modal heading="Panel focus"><button>A</button></aui-modal>`,
      );
      await openModal(el);
      expect(getDeepActiveElement()).to.equal(panelOf(el));
      await closeWith(el, () => el.hide());
    });

    it('returns focus to the trigger inside Shadow DOM after closing', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-button id="trigger">Open</aui-button>
          <aui-modal heading="Return focus"><button autofocus>Inside</button></aui-modal>
        </div>
      `);
      const trigger = wrapper.querySelector<HTMLElement>('#trigger')!;
      const el = wrapper.querySelector<AuiModal>('aui-modal')!;
      trigger.focus();
      const innerButton = trigger.shadowRoot!.querySelector('button');
      expect(getDeepActiveElement()).to.equal(innerButton);

      await openModal(el);
      expect(document.activeElement).to.equal(el.querySelector('button'));
      await closeWith(el, () => el.hide());
      expect(getDeepActiveElement()).to.equal(innerButton);
    });

    it('makes the page behind it inert', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="outside">Outside</button>
          <aui-modal heading="Inert"><button autofocus>Inside</button></aui-modal>
        </div>
      `);
      const el = wrapper.querySelector<AuiModal>('aui-modal')!;
      await openModal(el);
      const outside = wrapper.querySelector<HTMLButtonElement>('#outside')!;
      outside.focus();
      expect(document.activeElement, 'inert elements cannot take focus').to.not.equal(outside);
      await closeWith(el, () => el.hide());
    });
  });

  describe('nesting and top layer', () => {
    it('stacks nested modals: Escape closes the top one, scroll lock is counted', async () => {
      const outer = await fixture<AuiModal>(html`
        <aui-modal heading="Outer">
          <button id="open-inner">Open inner</button>
          <aui-modal id="inner" heading="Inner"><button autofocus>Inner button</button></aui-modal>
        </aui-modal>
      `);
      const inner = outer.querySelector<AuiModal>('#inner')!;
      await activateUser();
      await openModal(outer);
      outer.querySelector<HTMLButtonElement>('#open-inner')!.focus();
      await openModal(inner);
      expect(getTopModalLayer()).to.equal(inner);

      await closeWith(inner, () => sendKeys({ press: 'Escape' }));
      expect(outer.open, 'only the top modal closes').to.be.true;
      expect(isScrollLocked(), 'outer still locks scrolling').to.be.true;
      expect(getTopModalLayer()).to.equal(outer);
      expect(document.activeElement).to.equal(outer.querySelector('#open-inner'));

      await closeWith(outer, () => outer.hide());
      expect(isScrollLocked()).to.be.false;
      expect(getTopModalLayer()).to.be.null;
    });

    it('hosts followTopModal() overlays in its overlay slot, keeping them interactive', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <div id="viewport"><button id="toast-action">Undo</button></div>
          <aui-modal heading="Overlay host"></aui-modal>
        </div>
      `);
      const viewport = wrapper.querySelector<HTMLElement>('#viewport')!;
      const el = wrapper.querySelector<AuiModal>('aui-modal')!;
      const stop = followTopModal(viewport, { slot: 'overlay' });
      try {
        await openModal(el);
        expect(viewport.parentElement).to.equal(el);
        expect(viewport.assignedSlot?.name).to.equal('overlay');
        const action = viewport.querySelector<HTMLButtonElement>('#toast-action')!;
        action.focus();
        expect(document.activeElement, 'not inert inside the modal').to.equal(action);

        await closeWith(el, () => el.hide());
        expect(viewport.parentElement).to.equal(wrapper);
      } finally {
        stop();
      }
    });
  });
});
