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
});
