import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './index.js';
import type { AuiTag } from './tag.js';

describe('AuiTag Accessibility (<aui-tag>)', () => {
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
    it('passes axe audit in default static state', async () => {
      const el = await fixture<AuiTag>(html`<aui-tag>Static Tag</aui-tag>`);
      await expect(el).to.be.accessible();
    });

    it('passes axe audit for all 7 semantic color variants in light theme', async () => {
      const variants = [
        'neutral',
        'brand',
        'success',
        'warning',
        'danger',
        'info',
        'purple',
      ] as const;
      for (const variant of variants) {
        const el = await fixture<AuiTag>(html`<aui-tag .variant=${variant}>${variant}</aui-tag>`);
        await expect(el).to.be.accessible();
      }
    });

    it('passes axe audit for interactive and removable tags', async () => {
      const interactiveEl = await fixture<AuiTag>(
        html`<aui-tag interactive>Filter Category</aui-tag>`,
      );
      await expect(interactiveEl).to.be.accessible();

      const removableEl = await fixture<AuiTag>(
        html`<aui-tag removable remove-label="Remove Filter">Removable Item</aui-tag>`,
      );
      await expect(removableEl).to.be.accessible();
    });

    it('passes axe audit in dark theme mode', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const variants = [
          'brand',
          'success',
          'warning',
          'danger',
          'info',
          'purple',
          'neutral',
        ] as const;
        for (const variant of variants) {
          const el = await fixture<AuiTag>(
            html`<aui-tag .variant=${variant}>Dark ${variant}</aui-tag>`,
          );
          await expect(el).to.be.accessible();
        }
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('ARIA roles and attributes', () => {
    it('sets role="button" and tabindex="0" only when interactive', async () => {
      const staticEl = await fixture<AuiTag>(html`<aui-tag>Static</aui-tag>`);
      expect(staticEl.hasAttribute('role')).to.be.false;
      expect(staticEl.hasAttribute('tabindex')).to.be.false;

      const interactiveEl = await fixture<AuiTag>(html`<aui-tag interactive>Interactive</aui-tag>`);
      expect(interactiveEl.getAttribute('role')).to.equal('button');
      expect(interactiveEl.getAttribute('tabindex')).to.equal('0');
    });

    it('provides accessible name and title for removal button', async () => {
      const defaultEl = await fixture<AuiTag>(html`<aui-tag removable>Item</aui-tag>`);
      const defaultBtn = defaultEl.shadowRoot?.querySelector<HTMLButtonElement>('.tag__remove');
      expect(defaultBtn?.getAttribute('aria-label')).to.equal('Remove tag');
      expect(defaultBtn?.getAttribute('title')).to.equal('Remove tag');

      const customEl = await fixture<AuiTag>(
        html`<aui-tag removable remove-label="Delete Tag">Item</aui-tag>`,
      );
      const customBtn = customEl.shadowRoot?.querySelector<HTMLButtonElement>('.tag__remove');
      expect(customBtn?.getAttribute('aria-label')).to.equal('Delete Tag');
      expect(customBtn?.getAttribute('title')).to.equal('Delete Tag');
    });

    it('removes accessibility attributes when interactive is turned off dynamically', async () => {
      const el = await fixture<AuiTag>(html`<aui-tag interactive>Toggleable</aui-tag>`);
      expect(el.getAttribute('role')).to.equal('button');
      expect(el.getAttribute('tabindex')).to.equal('0');

      el.interactive = false;
      await el.updateComplete;
      expect(el.hasAttribute('role')).to.be.false;
      expect(el.hasAttribute('tabindex')).to.be.false;
    });
  });

  describe('Keyboard navigation and focusability', () => {
    it('allows keyboard focus when interactive', async () => {
      const el = await fixture<AuiTag>(html`<aui-tag interactive>Focusable Tag</aui-tag>`);
      el.focus();
      expect(document.activeElement).to.equal(el);
    });

    it('triggers click when Enter or Space is pressed on interactive tag', async () => {
      const el = await fixture<AuiTag>(html`<aui-tag interactive>Pressable Tag</aui-tag>`);
      let clickCount = 0;
      el.addEventListener('click', () => {
        clickCount++;
      });

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(clickCount).to.equal(1);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(clickCount).to.equal(2);
    });

    it('dispatches aui-remove event when remove button is clicked or activated', async () => {
      const el = await fixture<AuiTag>(html`<aui-tag removable>Removable</aui-tag>`);
      const removeBtn = el.shadowRoot?.querySelector<HTMLButtonElement>('.tag__remove');

      setTimeout(() => removeBtn?.click());
      const event = await oneEvent(el, 'aui-remove');
      expect(event).to.exist;
    });
  });
});
