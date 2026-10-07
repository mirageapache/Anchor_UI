import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './index.js';
import type { AuiTooltip } from './tooltip.js';

describe('AuiTooltip (<aui-tooltip>)', () => {
  it('renders with default attributes and hidden popup', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Helpful information">
        <button id="btn">Hover me</button>
      </aui-tooltip>
    `);
    expect(el).to.exist;
    expect(el.content).to.equal('Helpful information');
    expect(el.placement).to.equal('top');
    expect(el.open).to.be.false;
    expect(el.disabled).to.be.false;
    expect(el.arrow).to.be.false;

    const popup = el.shadowRoot?.querySelector('.tooltip__popup');
    expect(popup).to.exist;
    expect(popup?.classList.contains('tooltip__popup--visible')).to.be.false;
    expect(popup?.getAttribute('aria-hidden')).to.equal('true');
  });

  it('shows and hides programmatically via show() and hide()', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Tooltip message">
        <button id="target-btn">Target</button>
      </aui-tooltip>
    `);

    setTimeout(() => el.show());
    await oneEvent(el, 'aui-after-show');
    expect(el.open).to.be.true;

    const popup = el.shadowRoot?.querySelector('.tooltip__popup');
    expect(popup?.classList.contains('tooltip__popup--visible')).to.be.true;
    expect(popup?.getAttribute('aria-hidden')).to.equal('false');

    const targetBtn = el.querySelector('#target-btn') as HTMLButtonElement;
    expect(targetBtn.getAttribute('aria-describedby')).to.exist;

    setTimeout(() => el.hide());
    await oneEvent(el, 'aui-hide');
    await el.updateComplete;
    expect(el.open).to.be.false;
    expect(popup?.classList.contains('tooltip__popup--visible')).to.be.false;
  });

  it('toggles visibility with toggle()', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Toggle tooltip">
        <button>Toggle</button>
      </aui-tooltip>
    `);

    setTimeout(() => el.toggle());
    await oneEvent(el, 'aui-after-show');
    expect(el.open).to.be.true;

    setTimeout(() => el.toggle());
    await oneEvent(el, 'aui-hide');
    expect(el.open).to.be.false;
  });

  it('does not show when disabled is true', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Disabled tip" disabled>
        <button>Target</button>
      </aui-tooltip>
    `);

    await el.show();
    await el.updateComplete;
    expect(el.open).to.be.false;

    const popup = el.shadowRoot?.querySelector('.tooltip__popup');
    expect(popup?.classList.contains('tooltip__popup--visible')).to.be.false;
  });

  it('can be prevented by canceling aui-show event', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Cancellable">
        <button>Target</button>
      </aui-tooltip>
    `);

    el.addEventListener('aui-show', (e: Event) => {
      e.preventDefault();
    });

    el.show();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it('supports custom rich content via slot="content"', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip>
        <button>Target</button>
        <div slot="content"><strong>Rich</strong> <em>Content</em></div>
      </aui-tooltip>
    `);

    const contentSlot = el.shadowRoot?.querySelector('slot[name="content"]');
    expect(contentSlot).to.exist;
  });

  it('renders arrow element when arrow is true', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="With arrow" arrow open>
        <button>Target</button>
      </aui-tooltip>
    `);

    const arrow = el.shadowRoot?.querySelector('.tooltip__arrow');
    expect(arrow).to.exist;
  });

  it('hides on Escape key press when open', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Press escape">
        <button>Target</button>
      </aui-tooltip>
    `);

    setTimeout(() => el.show());
    await oneEvent(el, 'aui-after-show');
    expect(el.open).to.be.true;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it('handles click trigger mode', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Click tooltip" trigger="click">
        <button id="click-target">Click Target</button>
      </aui-tooltip>
    `);

    const target = el.querySelector('#click-target') as HTMLButtonElement;
    setTimeout(() => target.click());
    await oneEvent(el, 'aui-after-show');
    expect(el.open).to.be.true;

    setTimeout(() => target.click());
    await oneEvent(el, 'aui-hide');
    expect(el.open).to.be.false;
  });

  it('handles focus trigger mode', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Focus tip" trigger="focus">
        <button id="focus-btn">Focus Target</button>
      </aui-tooltip>
    `);
    const btn = el.querySelector('#focus-btn') as HTMLButtonElement;
    btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await oneEvent(el, 'aui-after-show');
    expect(el.open).to.be.true;

    btn.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await oneEvent(el, 'aui-hide');
    expect(el.open).to.be.false;
  });

  it('locates target via for attribute', async () => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <button id="external-btn">External</button>
        <aui-tooltip for="external-btn" content="Linked tip"></aui-tooltip>
      </div>
    `);
    const tooltip = container.querySelector('aui-tooltip') as AuiTooltip;
    const btn = container.querySelector('#external-btn') as HTMLButtonElement;
    expect(tooltip).to.exist;
    expect(btn).to.exist;
  });

  it('handles hover trigger mode with mouseenter and mouseleave', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Hover tip" .delay=${0} .hideDelay=${0}>
        <button id="hover-btn">Hover Target</button>
      </aui-tooltip>
    `);
    const btn = el.querySelector('#hover-btn') as HTMLButtonElement;
    btn.dispatchEvent(new MouseEvent('mouseenter'));
    await oneEvent(el, 'aui-after-show');
    expect(el.open).to.be.true;

    btn.dispatchEvent(new MouseEvent('mouseleave'));
    await oneEvent(el, 'aui-hide');
    expect(el.open).to.be.false;
  });

  it('repositions when placement or distance changes while open', async () => {
    const el = await fixture<AuiTooltip>(html`
      <aui-tooltip content="Dynamic placement" open>
        <button>Target</button>
      </aui-tooltip>
    `);
    el.placement = 'bottom-start';
    el.distance = 12;
    await el.updateComplete;
    expect(el.placement).to.equal('bottom-start');
  });

  it('reads --color-tooltip-* tokens from ancestors through Shadow DOM', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div
        style="--color-tooltip-bg: rgb(1, 2, 3); --color-tooltip-text: rgb(4, 5, 6); --color-tooltip-border: rgb(7, 8, 9);"
      >
        <aui-tooltip content="Themed tooltip" open>
          <button>Target</button>
        </aui-tooltip>
      </div>
    `);
    const el = wrapper.querySelector<AuiTooltip>('aui-tooltip')!;
    await el.updateComplete;

    const popup = el.shadowRoot!.querySelector<HTMLElement>('.tooltip__popup')!;
    const style = getComputedStyle(popup);
    expect(style.backgroundColor).to.equal('rgb(1, 2, 3)');
    expect(style.color).to.equal('rgb(4, 5, 6)');
    expect(style.borderTopColor).to.equal('rgb(7, 8, 9)');
  });

  describe('rapid open/close before the enter animation frame', () => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    it('does not get stuck visible when closed before the show frame runs', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Race tip" .delay=${0} .hideDelay=${0}>
          <button>Target</button>
        </aui-tooltip>
      `);
      const popup = el.shadowRoot!.querySelector<HTMLElement>('.tooltip__popup')!;
      const btn = el.querySelector('button') as HTMLButtonElement;
      let afterShowCount = 0;
      el.addEventListener('aui-after-show', () => afterShowCount++);

      // 兩次獨立的更新週期都落在同一個 animation frame 之前
      el.show();
      await el.updateComplete;
      el.hide();
      await el.updateComplete;

      await nextFrame();
      await nextFrame();
      await wait(200);

      expect(el.open).to.be.false;
      expect(afterShowCount).to.equal(0);
      expect(popup.classList.contains('tooltip__popup--visible')).to.be.false;
      expect(popup.matches(':popover-open')).to.be.false;
      expect(btn.hasAttribute('aria-describedby')).to.be.false;

      // 之後仍可正常開關
      btn.dispatchEvent(new MouseEvent('mouseenter'));
      await oneEvent(el, 'aui-after-show');
      expect(popup.classList.contains('tooltip__popup--visible')).to.be.true;
      btn.dispatchEvent(new MouseEvent('mouseleave'));
      await oneEvent(el, 'aui-after-hide');
      expect(popup.matches(':popover-open')).to.be.false;
    });

    it('stays open when re-opened during the exit animation', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Reopen tip">
          <button>Target</button>
        </aui-tooltip>
      `);
      const popup = el.shadowRoot!.querySelector<HTMLElement>('.tooltip__popup')!;

      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');

      el.hide();
      await el.updateComplete;
      // 退場動畫（約 160ms）結束前重新開啟，舊的收合計時器不得關閉新的 popover
      setTimeout(() => el.show(), 50);
      await oneEvent(el, 'aui-after-show');
      await wait(250);

      expect(el.open).to.be.true;
      expect(popup.matches(':popover-open')).to.be.true;
      expect(popup.classList.contains('tooltip__popup--visible')).to.be.true;
    });
  });

  describe('when moved within the DOM (disconnect → reconnect)', () => {
    it('re-binds trigger listeners after being re-inserted', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <section id="from">
            <aui-tooltip content="Movable tip" .delay=${0} .hideDelay=${0}>
              <button>Target</button>
            </aui-tooltip>
          </section>
          <section id="to"></section>
        </div>
      `);
      const el = wrapper.querySelector('aui-tooltip') as AuiTooltip;
      const btn = el.querySelector('button') as HTMLButtonElement;

      // 模擬框架重排節點（Vue keyed list 重排、拖曳排序等）
      wrapper.querySelector('#to')!.appendChild(el);
      await el.updateComplete;

      btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await oneEvent(el, 'aui-after-show');
      expect(el.open).to.be.true;

      btn.dispatchEvent(new MouseEvent('mouseleave'));
      await oneEvent(el, 'aui-hide');
      expect(el.open).to.be.false;
    });

    it('re-binds listeners on a for-referenced target after being re-inserted', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="moved-for-target">Target</button>
          <aui-tooltip for="moved-for-target" content="Tip" trigger="click"></aui-tooltip>
        </div>
      `);
      const el = wrapper.querySelector('aui-tooltip') as AuiTooltip;
      const btn = wrapper.querySelector('button') as HTMLButtonElement;

      el.remove();
      wrapper.appendChild(el);
      await el.updateComplete;

      setTimeout(() => btn.click());
      await oneEvent(el, 'aui-after-show');
      expect(el.open).to.be.true;
    });

    it('keeps an open tooltip visible and positioned after being re-inserted', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-tooltip content="Open tip">
            <button>Target</button>
          </aui-tooltip>
        </div>
      `);
      const el = wrapper.querySelector('aui-tooltip') as AuiTooltip;
      const popup = el.shadowRoot!.querySelector<HTMLElement>('.tooltip__popup')!;
      const btn = el.querySelector('button') as HTMLButtonElement;

      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');

      el.remove();
      setTimeout(() => wrapper.appendChild(el));
      await oneEvent(el, 'aui-after-show');

      expect(el.open).to.be.true;
      expect(popup.matches(':popover-open')).to.be.true;
      expect(popup.classList.contains('tooltip__popup--visible')).to.be.true;
      expect(btn.getAttribute('aria-describedby')).to.exist;

      // 重新插入後仍可正常關閉
      setTimeout(() => el.hide());
      await oneEvent(el, 'aui-after-hide');
      expect(popup.matches(':popover-open')).to.be.false;
    });

    it('does not leave a stale aria-describedby on the target after removal', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Tip">
          <button aria-describedby="hint">Target</button>
        </aui-tooltip>
      `);
      const btn = el.querySelector('button') as HTMLButtonElement;

      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');
      // 開啟期間使用者另外加入的描述，關閉時不應被舊快照覆蓋
      btn.setAttribute('aria-describedby', `${btn.getAttribute('aria-describedby')} late-hint`);

      el.remove();
      expect(btn.getAttribute('aria-describedby')).to.equal('hint late-hint');
    });
  });
});
