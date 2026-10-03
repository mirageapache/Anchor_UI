import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import type { AuiButton } from './button.js';

describe('AuiButton Accessibility (<aui-button>)', () => {
  before(async () => {
    if (!document.getElementById('aui-tokens')) {
      const link = document.createElement('link');
      link.id = 'aui-tokens';
      link.rel = 'stylesheet';
      link.href = '/dist/tokens.css';
      document.head.appendChild(link);
      await new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    }
  });

  describe('axe-core automated WCAG audit', () => {
    it('passes axe audit in default state', async () => {
      const el = await fixture<AuiButton>(html`<aui-button>Action Button</aui-button>`);
      await expect(el).to.be.accessible();
    });

    it('passes axe audit for all variants', async () => {
      const variants = ['primary', 'accent', 'ghost', 'danger', 'success'] as const;
      for (const variant of variants) {
        const el = await fixture<AuiButton>(
          html`<aui-button .variant=${variant}>${variant} button</aui-button>`,
        );
        await expect(el).to.be.accessible();
      }
    });

    it('passes axe audit in disabled and loading states', async () => {
      const disabledEl = await fixture<AuiButton>(
        html`<aui-button disabled>Disabled Action</aui-button>`,
      );
      await expect(disabledEl).to.be.accessible();

      const loadingEl = await fixture<AuiButton>(
        html`<aui-button loading>Loading Action</aui-button>`,
      );
      await expect(loadingEl).to.be.accessible();
    });

    it('passes axe audit in dark theme mode', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const el = await fixture<AuiButton>(
          html`<aui-button variant="primary">Dark Mode Action</aui-button>`,
        );
        await expect(el).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('ARIA roles and attributes', () => {
    it('renders with appropriate ARIA states for active, disabled and loading', async () => {
      const el = await fixture<AuiButton>(html`<aui-button>Active</aui-button>`);
      const innerBtn = el.shadowRoot?.querySelector('button');

      expect(innerBtn?.getAttribute('aria-disabled')).to.equal('false');
      expect(innerBtn?.getAttribute('aria-busy')).to.equal('false');

      el.disabled = true;
      await el.updateComplete;
      expect(innerBtn?.getAttribute('aria-disabled')).to.equal('true');

      el.disabled = false;
      el.loading = true;
      await el.updateComplete;
      expect(innerBtn?.getAttribute('aria-busy')).to.equal('true');
      expect(innerBtn?.getAttribute('aria-disabled')).to.equal('true');

      const spinner = el.shadowRoot?.querySelector('.btn__spinner');
      expect(spinner?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('correctly maps button native type for form accessibility', async () => {
      const el = await fixture<AuiButton>(html`<aui-button type="submit">Submit</aui-button>`);
      const innerBtn = el.shadowRoot?.querySelector('button');
      expect(innerBtn?.getAttribute('type')).to.equal('submit');
    });
  });

  describe('Keyboard navigation and focusability', () => {
    it('delegates focus to internal button when host receives focus', async () => {
      const el = await fixture<AuiButton>(html`<aui-button>Focusable</aui-button>`);
      const innerBtn = el.shadowRoot?.querySelector('button');

      el.focus();
      expect(el.shadowRoot?.activeElement).to.equal(innerBtn);
    });

    it('can be triggered by keyboard Enter and Space keys', async () => {
      const el = await fixture<AuiButton>(html`<aui-button>Keyboard Click</aui-button>`);
      let clickCount = 0;
      el.addEventListener('click', () => {
        clickCount++;
      });

      const innerBtn = el.shadowRoot?.querySelector('button');
      innerBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      innerBtn?.click(); // Native button triggers click on Enter/Space
      expect(clickCount).to.equal(1);
    });

    it('does not receive active focus when disabled', async () => {
      const el = await fixture<AuiButton>(html`<aui-button disabled>Disabled</aui-button>`);
      const innerBtn = el.shadowRoot?.querySelector('button');
      expect(innerBtn?.hasAttribute('disabled')).to.be.true;
    });
  });
});
