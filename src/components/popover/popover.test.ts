import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import './index.js';
import '../button/index.js';
import '../icon-button/index.js';
import '../modal/index.js';
import type { AuiPopover } from './popover.js';
import type { PopoverHideDetail } from './popover.types.js';
import type { AuiModal } from '../modal/modal.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import { isPopoverOpen } from '../../internal/top-layer.js';
import { trackChangeInUpdate } from '../../test-utils/lit.js';

const panelOf = (el: AuiPopover) => el.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** 等待開啟完成（aui-after-show） */
async function opened(el: AuiPopover, action: () => unknown): Promise<void> {
  const event = oneEvent(el, 'aui-after-show');
  await action();
  await event;
}

/** 執行動作並等待關閉完成，回傳 aui-after-hide 的關閉原因 */
async function closedBy(el: AuiPopover, action: () => unknown): Promise<string> {
  const event = oneEvent(el, 'aui-after-hide');
  await action();
  return ((await event) as CustomEvent<PopoverHideDetail>).detail.reason;
}

/** 在元素中心點擊（真實的滑鼠事件，含 pointerdown 與預設的焦點移動） */
async function clickOn(element: Element): Promise<void> {
  const rect = element.getBoundingClientRect();
  await sendMouse({
    type: 'click',
    position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
  });
}

const basic = () => html`
  <div style="padding: 40px;">
    <aui-popover>
      <button slot="trigger" id="trigger">Notifications</button>
      <p>3 new messages</p>
      <a href="#first" id="first">First message</a>
      <button id="second">Mark all as read</button>
    </aui-popover>
    <button id="outside">Outside</button>
    <p id="text">Plain text</p>
  </div>
`;

async function setup() {
  const wrapper = await fixture<HTMLElement>(basic());
  const el = wrapper.querySelector<AuiPopover>('aui-popover')!;
  await el.updateComplete;
  const trigger = wrapper.querySelector<HTMLButtonElement>('#trigger')!;
  return { wrapper, el, trigger, panel: panelOf(el) };
}

describe('AuiPopover (<aui-popover>)', () => {
  // 減少動態：轉場為 0ms，關閉流程不必等待動畫
  before(() => emulateMedia({ reducedMotion: 'reduce' }));
  after(() => emulateMedia({ reducedMotion: 'no-preference' }));
  afterEach(() => resetMouse());

  describe('rendering', () => {
    it('renders a closed non-modal dialog panel with defaults', async () => {
      const { el, panel } = await setup();
      expect(el.open).to.be.false;
      expect(el.placement).to.equal('bottom-start');
      expect(panel.getAttribute('role')).to.equal('dialog');
      expect(panel.hasAttribute('aria-modal')).to.be.false;
      expect(isPopoverOpen(panel)).to.be.false;
    });

    it('marks a native trigger with aria-haspopup, aria-expanded and aria-controls', async () => {
      const { el, trigger } = await setup();
      expect(trigger.getAttribute('aria-haspopup')).to.equal('dialog');
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
      const controls = (trigger as unknown as { ariaControlsElements: readonly Element[] | null })
        .ariaControlsElements;
      expect(controls?.[0] === el, 'aria-controls points to the popover').to.be.true;
    });
  });

  describe('opening', () => {
    it('opens on trigger click, moves focus into the panel and fires show events', async () => {
      const { el, trigger, panel, wrapper } = await setup();
      const shown = oneEvent(el, 'aui-show');
      await opened(el, () => clickOn(trigger));
      await shown;
      expect(el.open).to.be.true;
      expect(isPopoverOpen(panel)).to.be.true;
      expect(trigger.getAttribute('aria-expanded')).to.equal('true');
      expect(document.activeElement).to.equal(wrapper.querySelector('#first'));
    });

    it('opens from the keyboard (Enter on the trigger)', async () => {
      const { el, trigger } = await setup();
      trigger.focus();
      await opened(el, () => sendKeys({ press: 'Enter' }));
      expect(el.open).to.be.true;
    });

    it('prefers an element with autofocus', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover>
          <button slot="trigger">Open</button>
          <button id="a">A</button>
          <button id="b" autofocus>B</button>
        </aui-popover>
      `);
      await opened(el, () => el.show());
      expect(document.activeElement?.id).to.equal('b');
    });

    it('focuses into custom elements such as <aui-button>', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover>
          <button slot="trigger">Open</button>
          <span>Text</span>
          <aui-button id="action">Action</aui-button>
        </aui-popover>
      `);
      await opened(el, () => el.show());
      expect(document.activeElement?.id).to.equal('action');
      expect(getDeepActiveElement()?.localName).to.equal('button');
    });

    it('focuses the panel itself when the content has nothing focusable', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover
          ><button slot="trigger">Open</button>
          <p>Read only</p></aui-popover
        >
      `);
      await opened(el, () => el.show());
      expect(getDeepActiveElement()).to.equal(panelOf(el));
    });

    it('does not steal focus when rendered open', async () => {
      const outside = document.createElement('button');
      document.body.append(outside);
      outside.focus();
      const el = await fixture<AuiPopover>(html`
        <aui-popover open><button slot="trigger">Open</button><button>Inside</button></aui-popover>
      `);
      await el.updateComplete;
      await frame();
      expect(isPopoverOpen(panelOf(el))).to.be.true;
      expect(document.activeElement).to.equal(outside);
      outside.remove();
    });

    it('positions the panel below the trigger by default', async () => {
      const { el, trigger, panel } = await setup();
      await opened(el, () => el.show());
      await el.reposition();
      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      expect(panelRect.top).to.be.closeTo(triggerRect.bottom + el.distance, 1);
      expect(panelRect.left).to.be.closeTo(triggerRect.left, 1);
      expect(panel.getAttribute('data-placement')).to.equal('bottom-start');
    });

    it('can be cancelled from aui-show', async () => {
      const { el, panel } = await setup();
      el.addEventListener('aui-show', (event) => event.preventDefault(), { once: true });
      el.show();
      await el.updateComplete;
      await frame();
      expect(el.open).to.be.false;
      expect(isPopoverOpen(panel)).to.be.false;
    });
  });

  describe('closing', () => {
    it('closes with ESC and returns focus to the trigger', async () => {
      const { el, trigger } = await setup();
      await opened(el, () => clickOn(trigger));
      expect(await closedBy(el, () => sendKeys({ press: 'Escape' }))).to.equal('escape');
      expect(el.open).to.be.false;
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
      expect(document.activeElement).to.equal(trigger);
    });

    it('closes on a second trigger click', async () => {
      const { el, trigger } = await setup();
      await opened(el, () => clickOn(trigger));
      expect(await closedBy(el, () => clickOn(trigger))).to.equal('trigger');
      expect(document.activeElement).to.equal(trigger);
    });

    it('closes on an outside click and keeps focus on a clicked focusable element', async () => {
      const { el, trigger, wrapper } = await setup();
      await opened(el, () => clickOn(trigger));
      const outside = wrapper.querySelector<HTMLButtonElement>('#outside')!;
      expect(await closedBy(el, () => clickOn(outside))).to.equal('outside');
      await new Promise((resolve) => setTimeout(resolve));
      expect(document.activeElement).to.equal(outside);
    });

    it('returns focus to the trigger after an outside click on a non-focusable area', async () => {
      const { el, trigger, wrapper } = await setup();
      await opened(el, () => clickOn(trigger));
      expect(await closedBy(el, () => clickOn(wrapper.querySelector('#text')!))).to.equal(
        'outside',
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(document.activeElement).to.equal(trigger);
    });

    it('stays open for clicks inside the panel', async () => {
      const { el, trigger, wrapper } = await setup();
      await opened(el, () => clickOn(trigger));
      await clickOn(wrapper.querySelector('p')!);
      await el.updateComplete;
      expect(el.open).to.be.true;
    });

    it('closes without moving focus when Tab leaves the popover', async () => {
      const { el, trigger, wrapper } = await setup();
      await opened(el, () => clickOn(trigger));
      wrapper.querySelector<HTMLButtonElement>('#second')!.focus();
      expect(await closedBy(el, () => sendKeys({ press: 'Tab' }))).to.equal('focus-out');
      expect(document.activeElement?.id).to.equal('outside');
    });

    it('keeps Tab order between the trigger and the panel content', async () => {
      const { el, trigger, wrapper } = await setup();
      await opened(el, () => clickOn(trigger));
      await sendKeys({ press: 'Shift+Tab' });
      expect(document.activeElement).to.equal(trigger);
      expect(el.open).to.be.true;
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(wrapper.querySelector('#first'));
    });

    it('can be cancelled from aui-hide', async () => {
      const { el, panel } = await setup();
      await opened(el, () => el.show());
      el.addEventListener('aui-hide', (event) => event.preventDefault(), { once: true });
      el.hide();
      await el.updateComplete;
      expect(el.open).to.be.true;
      expect(isPopoverOpen(panel)).to.be.true;
    });

    it('reports api as the reason for hide() and toggle()', async () => {
      const { el } = await setup();
      await opened(el, () => el.toggle());
      expect(await closedBy(el, () => el.toggle())).to.equal('api');
    });

    it('closes with events when removed from the page while open', async () => {
      const { el } = await setup();
      await opened(el, () => el.show());
      const reasons: string[] = [];
      for (const type of ['aui-hide', 'aui-after-hide']) {
        el.addEventListener(type, (event) =>
          reasons.push(`${type}:${(event as CustomEvent<PopoverHideDetail>).detail.reason}`),
        );
      }
      el.remove();
      expect(el.open).to.be.false;
      expect(reasons).to.deep.equal(['aui-hide:api', 'aui-after-hide:api']);
    });

    it('closes only the popover when ESC is pressed inside a modal', async () => {
      const modal = await fixture<AuiModal>(html`
        <aui-modal heading="Settings">
          <aui-popover>
            <button slot="trigger">More</button>
            <button>Action</button>
          </aui-popover>
        </aui-modal>
      `);
      const el = modal.querySelector<AuiPopover>('aui-popover')!;
      const shown = oneEvent(modal, 'aui-after-show');
      modal.show();
      await shown;
      await opened(el, () => clickOn(el.querySelector('[slot="trigger"]')!));
      expect(await closedBy(el, () => sendKeys({ press: 'Escape' }))).to.equal('escape');
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(modal.open).to.be.true;
      modal.hide();
    });

    it('does not schedule a second update from updated()', async () => {
      const { el } = await setup();
      const hits = trackChangeInUpdate(el);
      await opened(el, () => el.show());
      await closedBy(el, () => el.hide());
      expect(hits).to.deep.equal([]);
    });
  });

  describe('edge cases', () => {
    it('does not move focus to the trigger on an outside click when focus was elsewhere', async () => {
      const wrapper = await fixture<HTMLElement>(html`
        <div>
          <input id="search" />
          <aui-popover open
            ><button slot="trigger">Open</button>
            <p>Body</p></aui-popover
          >
          <p id="text">Plain text</p>
        </div>
      `);
      const el = wrapper.querySelector<AuiPopover>('aui-popover')!;
      await el.updateComplete;
      await frame();
      wrapper.querySelector<HTMLInputElement>('#search')!.focus();
      expect(await closedBy(el, () => clickOn(wrapper.querySelector('#text')!))).to.equal(
        'outside',
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(document.activeElement).to.not.equal(el.querySelector('button'));
    });

    it('applies a cancelled aui-show in the same update without reflecting open', async () => {
      const { el } = await setup();
      const hits = trackChangeInUpdate(el);
      const reflected: boolean[] = [];
      const observer = new MutationObserver(() => reflected.push(el.hasAttribute('open')));
      observer.observe(el, { attributes: true, attributeFilter: ['open'] });
      el.addEventListener('aui-show', (event) => event.preventDefault(), { once: true });
      el.show();
      await el.updateComplete;
      observer.disconnect();
      expect(el.open).to.be.false;
      expect(hits).to.deep.equal([]);
      expect(reflected).to.deep.equal([]);
    });

    it('focuses an autofocus Lit element that has not rendered yet', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover><button slot="trigger">Open</button><button>First</button></aui-popover>
      `);
      const late = document.createElement('aui-button');
      late.setAttribute('autofocus', '');
      late.textContent = 'Late';
      el.append(late);
      await opened(el, () => el.show());
      await late.updateComplete;
      expect(document.activeElement).to.equal(late);
    });

    it('skips the content of a nested popover when moving focus', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover>
          <button slot="trigger">Open</button>
          <aui-popover>
            <button id="nested-content">Nested content</button>
            <button slot="trigger" id="nested-trigger">Nested trigger</button>
          </aui-popover>
        </aui-popover>
      `);
      await opened(el, () => el.show());
      expect(document.activeElement?.id).to.equal('nested-trigger');
    });

    it('restores attributes a native trigger had before it was used', async () => {
      const el = await fixture<AuiPopover>(html` <aui-popover><p>Body</p></aui-popover> `);
      const own = document.createElement('button');
      own.slot = 'trigger';
      own.setAttribute('aria-haspopup', 'true');
      el.append(own);
      await new Promise((resolve) => setTimeout(resolve));
      expect(own.getAttribute('aria-haspopup')).to.equal('dialog');
      own.remove();
      await new Promise((resolve) => setTimeout(resolve));
      expect(own.getAttribute('aria-haspopup')).to.equal('true');
      expect(own.hasAttribute('aria-expanded')).to.be.false;
    });
  });

  describe('transitions', () => {
    // 實際的退場動畫：測試退場期間的重新開啟與移除
    before(() => emulateMedia({ reducedMotion: 'no-preference' }));
    after(() => emulateMedia({ reducedMotion: 'reduce' }));

    it('waits for the exit transition before leaving the top layer', async () => {
      const { el, panel } = await setup();
      await opened(el, () => el.show());
      const afterHide = oneEvent(el, 'aui-after-hide');
      el.hide();
      await el.updateComplete;
      expect(isPopoverOpen(panel), 'still open during the exit transition').to.be.true;
      await afterHide;
      expect(isPopoverOpen(panel)).to.be.false;
    });

    it('finishes an interrupted close when reopened during the exit transition', async () => {
      const { el, panel } = await setup();
      await opened(el, () => el.show());
      const events: string[] = [];
      for (const type of ['aui-hide', 'aui-after-hide', 'aui-show', 'aui-after-show']) {
        el.addEventListener(type, () => events.push(type));
      }
      el.hide();
      await el.updateComplete;
      await opened(el, () => el.show());
      expect(events).to.deep.equal(['aui-hide', 'aui-after-hide', 'aui-show', 'aui-after-show']);
      expect(isPopoverOpen(panel)).to.be.true;
      // 被中斷的關閉不得在稍後關閉重新開啟的面板
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(isPopoverOpen(panel)).to.be.true;
    });

    it('does not leave an invisible panel when reopening is cancelled', async () => {
      const { el, panel } = await setup();
      await opened(el, () => el.show());
      el.hide();
      await el.updateComplete;
      el.addEventListener('aui-show', (event) => event.preventDefault(), { once: true });
      el.show();
      await el.updateComplete;
      expect(el.open).to.be.false;
      expect(isPopoverOpen(panel)).to.be.false;
    });

    it('reports aui-after-hide when removed during the exit transition', async () => {
      const { el } = await setup();
      await opened(el, () => el.show());
      el.hide();
      await el.updateComplete;
      const reasons: string[] = [];
      el.addEventListener('aui-after-hide', (event) =>
        reasons.push((event as CustomEvent<PopoverHideDetail>).detail.reason),
      );
      el.remove();
      expect(reasons).to.deep.equal(['api']);
    });
  });

  describe('library triggers', () => {
    it('writes the expanded state on the inner button of <aui-button>', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover>
          <aui-button slot="trigger">Account</aui-button>
          <a href="#profile">Profile</a>
        </aui-popover>
      `);
      const host = el.querySelector('aui-button')!;
      await host.updateComplete;
      const inner = host.shadowRoot!.querySelector('button')!;
      expect(inner.getAttribute('aria-haspopup')).to.equal('dialog');
      expect(inner.getAttribute('aria-expanded')).to.equal('false');
      expect(host.hasAttribute('aria-expanded')).to.be.false;

      await opened(el, () => clickOn(host));
      await host.updateComplete;
      expect(inner.getAttribute('aria-expanded')).to.equal('true');
    });

    it('writes the expanded state on the inner button of <aui-icon-button>', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover>
          <aui-icon-button slot="trigger" preset="more" label="More"></aui-icon-button>
          <button>Edit</button>
        </aui-popover>
      `);
      const host = el.querySelector('aui-icon-button')!;
      await host.updateComplete;
      const inner = host.shadowRoot!.querySelector('button')!;
      expect(inner.getAttribute('aria-haspopup')).to.equal('dialog');
      expect(inner.getAttribute('aria-expanded')).to.equal('false');
      el.show();
      await el.updateComplete;
      await host.updateComplete;
      expect(inner.getAttribute('aria-expanded')).to.equal('true');
    });

    it('releases a trigger that is replaced', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover
          ><button slot="trigger" id="old">Old</button>
          <p>Body</p></aui-popover
        >
      `);
      const old = el.querySelector<HTMLButtonElement>('#old')!;
      const next = document.createElement('button');
      next.slot = 'trigger';
      next.textContent = 'New';
      old.replaceWith(next);
      await new Promise((resolve) => setTimeout(resolve));
      expect(old.hasAttribute('aria-expanded')).to.be.false;
      expect(old.hasAttribute('aria-haspopup')).to.be.false;
      expect(next.getAttribute('aria-expanded')).to.equal('false');
    });
  });
});
