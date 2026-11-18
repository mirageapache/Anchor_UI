import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import {
  emulateMedia,
  resetMouse,
  sendKeys,
  sendMouse,
  setViewport,
} from '@web/test-runner-commands';
import './index.js';
import '../modal/index.js';
import type { AuiDrawer } from './drawer.js';
import type { DrawerHideDetail } from './drawer.types.js';
import type { AuiModal } from '../modal/modal.js';
import { followTopModal, getTopModalLayer } from '../../internal/top-layer.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import { isScrollLocked } from '../../internal/scroll-lock.js';

/**
 * 開關的生命週期與 <aui-modal> 共用（src/internal/modal-dialog.ts），完整的邊界情況由 modal.test.ts 涵蓋；
 * 這裡驗證 Drawer 的接線（事件、關閉方式、焦點、modal 層）與 Drawer 自身的版面與動畫。
 */

const dialogOf = (el: AuiDrawer) => el.shadowRoot!.querySelector('dialog')!;
const part = (el: AuiDrawer, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;
const panelOf = (el: AuiDrawer) => part(el, 'panel');

/** 開啟並等待進場完成 */
async function open(el: AuiDrawer | AuiModal): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.open = true;
  await shown;
}

/** 執行關閉動作並回傳 aui-after-hide 的關閉原因 */
async function closeWith(el: AuiDrawer | AuiModal, action: () => unknown): Promise<string> {
  const hidden = oneEvent(el, 'aui-after-hide');
  await action();
  return ((await hidden) as CustomEvent<DrawerHideDetail>).detail.reason;
}

/** 取得使用者啟用：沒有啟用時，Chrome 會忽略 cancel 事件的 preventDefault()。須在開啟前呼叫 */
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

describe('AuiDrawer (<aui-drawer>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
    await setViewport({ width: 800, height: 600 });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('opening and closing', () => {
    it('is closed by default and opens as a modal dialog with aui-show / aui-after-show', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Menu">Body</aui-drawer>`);
      expect(el.open).to.be.false;
      expect(el.placement).to.equal('left');
      expect(getComputedStyle(dialogOf(el)).display).to.equal('none');

      const events: string[] = [];
      el.addEventListener('aui-show', () => events.push('aui-show'));
      el.addEventListener('aui-after-show', () => events.push('aui-after-show'));
      await open(el);
      expect(events).to.deep.equal(['aui-show', 'aui-after-show']);
      expect(el.hasAttribute('open')).to.be.true;
      expect(dialogOf(el).matches(':modal')).to.be.true;
      expect(isScrollLocked()).to.be.true;
      expect(getTopModalLayer() === el).to.be.true;

      expect(await closeWith(el, () => el.hide())).to.equal('api');
      expect(dialogOf(el).open).to.be.false;
      expect(isScrollLocked()).to.be.false;
      expect(getTopModalLayer()).to.be.null;
    });

    it('stays closed when aui-show is cancelled, and open when aui-hide is cancelled', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Cancel"></aui-drawer>`);
      el.addEventListener('aui-show', (event) => event.preventDefault(), { once: true });
      await el.show();
      expect(el.open).to.be.false;
      expect(dialogOf(el).open).to.be.false;

      await open(el);
      el.addEventListener('aui-hide', (event) => event.preventDefault(), { once: true });
      await el.hide();
      expect(el.open).to.be.true;
      expect(dialogOf(el).open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('closes on Escape with reason "escape" unless close-on-escape="false"', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Escape"></aui-drawer>`);
      await activateUser();
      await open(el);
      expect(await closeWith(el, () => sendKeys({ press: 'Escape' }))).to.equal('escape');

      el.closeOnEscape = false;
      await activateUser();
      await open(el);
      await sendKeys({ press: 'Escape' });
      await el.updateComplete;
      expect(el.open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('closes on a backdrop click (reason "backdrop"), not on a panel click', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Backdrop">Body</aui-drawer>`);
      await open(el);
      const rect = panelOf(el).getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      await el.updateComplete;
      expect(el.open, 'panel click keeps it open').to.be.true;

      // 左側抽屜：遮罩在面板右側
      const reason = closeWith(el, () =>
        sendMouse({ type: 'click', position: [window.innerWidth - 10, 300] }),
      );
      expect(await reason).to.equal('backdrop');
    });

    it('ignores backdrop clicks when close-on-backdrop="false"', async () => {
      const el = await fixture<AuiDrawer>(
        html`<aui-drawer heading="Sticky" close-on-backdrop="false"></aui-drawer>`,
      );
      expect(el.closeOnBackdrop).to.be.false;
      await open(el);
      await sendMouse({ type: 'click', position: [window.innerWidth - 10, 300] });
      await el.updateComplete;
      expect(el.open).to.be.true;
      await closeWith(el, () => el.hide());
    });

    it('closes with the header close button (reason "close-button") unless hidden', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Close button"></aui-drawer>`);
      await open(el);
      const button = part(el, 'close-button');
      expect(button.getAttribute('aria-label')).to.equal('關閉');
      expect(await closeWith(el, () => button.click())).to.equal('close-button');

      el.noCloseButton = true;
      await el.updateComplete;
      expect(part(el, 'close-button')).to.be.null;
    });

    it('releases its resources and emits non-cancelable close events when removed while open', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Removed"></aui-drawer>`);
      await open(el);
      const events: Array<{ type: string; reason: string; cancelable: boolean }> = [];
      for (const type of ['aui-hide', 'aui-after-hide']) {
        el.addEventListener(type, (event) => {
          const { detail, cancelable } = event as CustomEvent<DrawerHideDetail>;
          events.push({ type, reason: detail.reason, cancelable });
        });
      }

      el.remove();
      expect(events).to.deep.equal([
        { type: 'aui-hide', reason: 'api', cancelable: false },
        { type: 'aui-after-hide', reason: 'api', cancelable: false },
      ]);
      expect(dialogOf(el).open).to.be.false;
      expect(isScrollLocked()).to.be.false;
      expect(getTopModalLayer()).to.be.null;
    });
  });

  describe('layout', () => {
    it('slides in from the left by default, full height and 280px wide', async () => {
      const el = await fixture<AuiDrawer>(html`<aui-drawer heading="Left">Body</aui-drawer>`);
      await open(el);
      const rect = panelOf(el).getBoundingClientRect();
      expect(rect.left).to.equal(0);
      expect(rect.top).to.equal(0);
      expect(rect.height).to.equal(window.innerHeight);
      expect(rect.width).to.equal(280);
      expect(getComputedStyle(panelOf(el)).borderRightWidth).to.equal('1px');
      await closeWith(el, () => el.hide());
    });

    it('sits on the right edge with placement="right"', async () => {
      const el = await fixture<AuiDrawer>(
        html`<aui-drawer heading="Right" placement="right">Body</aui-drawer>`,
      );
      await open(el);
      const rect = panelOf(el).getBoundingClientRect();
      expect(rect.right).to.equal(window.innerWidth);
      expect(getComputedStyle(panelOf(el)).borderLeftWidth).to.equal('1px');

      // 右側抽屜：遮罩在面板左側
      const reason = closeWith(el, () => sendMouse({ type: 'click', position: [10, 300] }));
      expect(await reason).to.equal('backdrop');
    });

    it('falls back to the left side for an unknown placement', async () => {
      const el = await fixture<AuiDrawer>(
        html`<aui-drawer heading="Unknown" placement="top">Body</aui-drawer>`,
      );
      await open(el);
      expect(panelOf(el).getBoundingClientRect().left).to.equal(0);
      await closeWith(el, () => el.hide());
    });

    it('takes its width from --aui-drawer-width, capped at 85% of the viewport', async () => {
      const el = await fixture<AuiDrawer>(
        html`<aui-drawer heading="Wide" style="--aui-drawer-width: 400px">Body</aui-drawer>`,
      );
      await open(el);
      expect(panelOf(el).getBoundingClientRect().width).to.equal(400);

      el.style.setProperty('--aui-drawer-width', '2000px');
      expect(panelOf(el).getBoundingClientRect().width).to.be.closeTo(window.innerWidth * 0.85, 1);
      await closeWith(el, () => el.hide());
    });

    it('hides the header and footer without content, and shows them for content', async () => {
      const bare = await fixture<AuiDrawer>(
        html`<aui-drawer no-close-button label="Bare">Body</aui-drawer>`,
      );
      await open(bare);
      expect(getComputedStyle(part(bare, 'header')).display).to.equal('none');
      expect(getComputedStyle(part(bare, 'footer')).display).to.equal('none');
      expect(dialogOf(bare).getAttribute('aria-label')).to.equal('Bare');
      await closeWith(bare, () => bare.hide());

      const full = await fixture<AuiDrawer>(html`
        <aui-drawer heading="Filters">
          Body
          <button slot="footer">Apply</button>
        </aui-drawer>
      `);
      await open(full);
      expect(getComputedStyle(part(full, 'header')).display).to.equal('flex');
      expect(part(full, 'header').getBoundingClientRect().height).to.equal(64);
      expect(getComputedStyle(part(full, 'footer')).display).to.equal('flex');
      expect(dialogOf(full).getAttribute('aria-labelledby')).to.equal('title');
      expect(part(full, 'title').textContent).to.equal('Filters');
      await closeWith(full, () => full.hide());
    });

    it('scrolls long content inside the body', async () => {
      const el = await fixture<AuiDrawer>(html`
        <aui-drawer heading="Long">
          <div style="height: 2000px">Tall</div>
          <button slot="footer">Apply</button>
        </aui-drawer>
      `);
      await open(el);
      const body = part(el, 'body');
      expect(body.scrollHeight).to.be.above(body.clientHeight);
      expect(part(el, 'footer').getBoundingClientRect().bottom).to.equal(window.innerHeight);
      await closeWith(el, () => el.hide());
    });
  });

  describe('animation', () => {
    before(async () => {
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    after(async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
    });

    const translateX = (el: AuiDrawer) =>
      new DOMMatrix(getComputedStyle(panelOf(el)).transform).m41;

    for (const placement of ['left', 'right'] as const) {
      it(`slides in from and out to the ${placement} edge`, async () => {
        const el = await fixture<AuiDrawer>(
          html`<aui-drawer heading="Slide" placement=${placement}></aui-drawer>`,
        );
        const sign = placement === 'left' ? -1 : 1;
        const shown = oneEvent(el, 'aui-after-show');
        el.open = true;
        await el.updateComplete;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        expect(Math.sign(translateX(el)), 'offscreen on the first frame').to.equal(sign);
        await shown;
        expect(translateX(el)).to.be.closeTo(0, 0.5);

        const hidden = oneEvent(el, 'aui-after-hide');
        void el.hide(); // hide() 會等到退場動畫結束，這裡要檢查動畫中的狀態
        await el.updateComplete; // 處理 open
        await el.updateComplete; // 加上 drawer--leaving 的渲染
        expect(dialogOf(el).classList.contains('drawer--leaving')).to.be.true;
        expect(dialogOf(el).open, 'still open while sliding out').to.be.true;
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(Math.sign(translateX(el)), 'moving towards its edge').to.equal(sign);
        await hidden;
        expect(dialogOf(el).open).to.be.false;
      });
    }
  });

  describe('focus', () => {
    it('focuses the [autofocus] element, ignoring ones inside nested dialogs', async () => {
      const el = await fixture<AuiDrawer>(html`
        <aui-drawer heading="Autofocus">
          <aui-modal heading="Nested"><button autofocus>Nested</button></aui-modal>
          <input id="search" autofocus />
        </aui-drawer>
      `);
      await open(el);
      expect(document.activeElement).to.equal(el.querySelector('#search'));
      await closeWith(el, () => el.hide());
    });

    it('does not pick a nested dialog host that itself carries [autofocus]', async () => {
      const el = await fixture<AuiDrawer>(html`
        <aui-drawer heading="Outer">
          <aui-modal heading="Nested" autofocus></aui-modal>
          <input id="search" autofocus />
        </aui-drawer>
      `);
      await open(el);
      expect(document.activeElement).to.equal(el.querySelector('#search'));
      await closeWith(el, () => el.hide());
    });

    it('lets a modal ignore [autofocus] elements inside a nested drawer', async () => {
      const modal = await fixture<AuiModal>(html`
        <aui-modal heading="Modal">
          <aui-drawer heading="Nested"><button autofocus>Nested</button></aui-drawer>
          <input id="name" autofocus />
        </aui-modal>
      `);
      await open(modal);
      expect(document.activeElement).to.equal(modal.querySelector('#name'));
      await closeWith(modal, () => modal.hide());
    });

    it('focuses the panel without [autofocus], and returns focus to the trigger after closing', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="trigger">Menu</button>
          <button id="outside">Outside</button>
          <aui-drawer heading="Menu"><a href="#a">Link</a></aui-drawer>
        </div>
      `);
      const trigger = wrapper.querySelector<HTMLButtonElement>('#trigger')!;
      const el = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      trigger.focus();
      await open(el);
      expect(getDeepActiveElement()).to.equal(panelOf(el));

      const outside = wrapper.querySelector<HTMLButtonElement>('#outside')!;
      outside.focus();
      expect(document.activeElement, 'the page behind is inert').to.not.equal(outside);

      await closeWith(el, () => el.hide());
      expect(document.activeElement).to.equal(trigger);
    });
  });

  describe('nesting and top layer', () => {
    it('stacks a modal opened from the drawer: Escape closes the modal first', async () => {
      const el = await fixture<AuiDrawer>(html`
        <aui-drawer heading="Settings">
          <button id="open-modal">Open</button>
          <aui-modal heading="Confirm"><button autofocus>OK</button></aui-modal>
        </aui-drawer>
      `);
      const modal = el.querySelector<AuiModal>('aui-modal')!;
      await activateUser();
      await open(el);
      el.querySelector<HTMLButtonElement>('#open-modal')!.focus();
      await open(modal);
      expect(getTopModalLayer() === modal).to.be.true;

      await closeWith(modal, () => sendKeys({ press: 'Escape' }));
      expect(el.open, 'the drawer stays open').to.be.true;
      expect(isScrollLocked()).to.be.true;
      expect(getTopModalLayer() === el).to.be.true;
      expect(document.activeElement).to.equal(el.querySelector('#open-modal'));

      await closeWith(el, () => el.hide());
      expect(isScrollLocked()).to.be.false;
    });

    it('hosts followTopModal() overlays in its overlay slot', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <div id="viewport"><button id="toast-action">Undo</button></div>
          <aui-drawer heading="Overlay host"></aui-drawer>
        </div>
      `);
      const viewport = wrapper.querySelector<HTMLElement>('#viewport')!;
      const el = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      const stop = followTopModal(viewport, { slot: 'overlay' });
      try {
        await open(el);
        expect(viewport.parentElement === el).to.be.true;
        expect(viewport.assignedSlot?.name).to.equal('overlay');
        const action = viewport.querySelector<HTMLButtonElement>('#toast-action')!;
        action.focus();
        expect(document.activeElement, 'not inert inside the drawer').to.equal(action);

        await closeWith(el, () => el.hide());
        expect(viewport.parentElement).to.equal(wrapper);
      } finally {
        stop();
      }
    });
  });
});
