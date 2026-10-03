import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './index.js';
import type { AuiTooltip } from './tooltip.js';

describe('AuiTooltip Accessibility (<aui-tooltip>)', () => {
  before(async () => {
    if (!document.getElementById('aui-tokens')) {
      const link = document.createElement('link');
      link.id = 'aui-tokens';
      link.rel = 'stylesheet';
      link.href = '/dist/tokens.css';
      document.head.appendChild(link);

      const style = document.createElement('style');
      style.id = 'aui-test-base';
      style.textContent = `
        body {
          background-color: var(--color-bg, #ffffff);
          color: var(--color-text-primary, #0f172a);
        }
      `;
      document.head.appendChild(style);

      await new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    }
  });

  describe('axe-core automated WCAG audit', () => {
    it('passes axe audit in closed state', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Settings and preferences">
          <button id="trigger-btn">Settings</button>
        </aui-tooltip>
      `);
      await expect(el).to.be.accessible();
    });

    it('passes axe audit in open state with text content', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Copy current snippet to clipboard" open>
          <button id="copy-btn">Copy</button>
        </aui-tooltip>
      `);
      await expect(el).to.be.accessible();
    });

    it('passes axe audit with rich slot content', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip open>
          <button id="info-btn">Info</button>
          <div slot="content">
            <strong>System Status</strong>
            <p>All services operational.</p>
          </div>
        </aui-tooltip>
      `);
      await expect(el).to.be.accessible();
    });

    it('passes axe audit in dark theme mode', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const el = await fixture<AuiTooltip>(html`
          <aui-tooltip content="Dark mode tooltip info" open>
            <button id="dark-btn">Dark Mode Button</button>
          </aui-tooltip>
        `);
        await expect(el).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('ARIA roles and linkage (WCAG 1.4.13 & 4.1.2)', () => {
    it('provides role="tooltip" and dynamic aria-hidden on popup container', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Help text">
          <button id="target">Help</button>
        </aui-tooltip>
      `);

      const popup = el.shadowRoot?.querySelector('.tooltip__popup');
      expect(popup?.getAttribute('role')).to.equal('tooltip');
      expect(popup?.getAttribute('aria-hidden')).to.equal('true');

      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');
      expect(popup?.getAttribute('aria-hidden')).to.equal('false');

      setTimeout(() => el.hide());
      await oneEvent(el, 'aui-hide');
      await el.updateComplete;
      expect(popup?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('associates trigger element with popup via aria-describedby when visible', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Detailed action description">
          <button id="action-btn">Action</button>
        </aui-tooltip>
      `);

      const triggerBtn = el.querySelector('#action-btn') as HTMLButtonElement;
      const popup = el.shadowRoot?.querySelector('.tooltip__popup') as HTMLElement;
      const tooltipId = popup.id;
      expect(tooltipId).to.exist;

      // Closed initially: no aria-describedby
      expect(triggerBtn.hasAttribute('aria-describedby')).to.be.false;

      // Show tooltip: aria-describedby links to popup id
      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');
      expect(triggerBtn.getAttribute('aria-describedby')).to.equal(tooltipId);

      // Hide tooltip: aria-describedby is cleaned up
      setTimeout(() => el.hide());
      await oneEvent(el, 'aui-hide');
      await el.updateComplete;
      expect(triggerBtn.hasAttribute('aria-describedby')).to.be.false;
    });

    it('preserves existing aria-describedby on target element when closing', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Tooltip addon">
          <button id="action-btn" aria-describedby="external-hint">Action</button>
        </aui-tooltip>
      `);

      const triggerBtn = el.querySelector('#action-btn') as HTMLButtonElement;
      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');
      expect(triggerBtn.getAttribute('aria-describedby')).to.contain('external-hint');

      setTimeout(() => el.hide());
      await oneEvent(el, 'aui-hide');
      await el.updateComplete;
      expect(triggerBtn.getAttribute('aria-describedby')).to.equal('external-hint');
    });
  });

  describe('Keyboard dismissibility and focus control', () => {
    it('dismisses open tooltip on Escape key press (WCAG 1.4.13 Dismissible)', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Dismissible with escape key">
          <button id="esc-btn">Target</button>
        </aui-tooltip>
      `);

      setTimeout(() => el.show());
      await oneEvent(el, 'aui-after-show');
      expect(el.open).to.be.true;

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;
      expect(el.open).to.be.false;
    });

    it('opens on focusin and closes on focusout in focus trigger mode', async () => {
      const el = await fixture<AuiTooltip>(html`
        <aui-tooltip content="Keyboard accessible tooltip" trigger="focus">
          <button id="focus-target">Focusable Target</button>
        </aui-tooltip>
      `);

      const triggerBtn = el.querySelector('#focus-target') as HTMLButtonElement;

      triggerBtn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await oneEvent(el, 'aui-after-show');
      expect(el.open).to.be.true;

      triggerBtn.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      await oneEvent(el, 'aui-hide');
      expect(el.open).to.be.false;
    });
  });
});
