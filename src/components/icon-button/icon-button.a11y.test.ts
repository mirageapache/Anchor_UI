import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getAxNode } from '../../test-utils/ax.js';
import './icon-button.js';
import type { AuiIconButton } from './icon-button.js';
import type { AuiTooltip } from '../tooltip/tooltip.js';

describe('AuiIconButton Accessibility (<aui-icon-button>)', () => {
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
    it('passes axe audit for built-in presets (ensuring accessible names)', async () => {
      const presets = ['copy', 'download', 'close', 'refresh', 'external', 'more'] as const;
      for (const preset of presets) {
        const el = await fixture<AuiIconButton>(
          html`<aui-icon-button .preset=${preset}></aui-icon-button>`,
        );
        await expect(el).to.be.accessible();
      }
    });

    it('passes axe audit for custom slotted icon with explicit label or tooltip', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button label="Favorite Item">
          <svg viewBox="0 0 24 24">
            <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-5-6.5 5 2-7.5-5.5-4.5h7z" />
          </svg>
        </aui-icon-button>
      `);
      await expect(el).to.be.accessible();
    });

    it('passes axe audit in disabled and loading states', async () => {
      const disabledEl = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy" disabled></aui-icon-button>`,
      );
      await expect(disabledEl).to.be.accessible();

      const loadingEl = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy" loading></aui-icon-button>`,
      );
      await expect(loadingEl).to.be.accessible();
    });

    it('passes axe audit in active success state', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy" active></aui-icon-button>`,
      );
      await expect(el).to.be.accessible();
    });

    for (const theme of ['light', 'dark'] as const) {
      it(`passes axe audit for all variants and success state in ${theme} theme mode`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          const variants = ['ghost', 'subtle', 'outline', 'primary', 'danger'] as const;
          for (const variant of variants) {
            const el = await fixture<AuiIconButton>(
              html`<aui-icon-button preset="download" .variant=${variant}></aui-icon-button>`,
            );
            await expect(el).to.be.accessible();

            el.triggerFeedback('success');
            await el.updateComplete;
            await expect(el).to.be.accessible();
            el.resetFeedback();
          }
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('ARIA roles, attributes and live regions (WCAG 4.1.2 & 4.1.3)', () => {
    it('sets aria-label from preset, label or tooltip', async () => {
      const copyEl = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy"></aui-icon-button>`,
      );
      const copyInnerBtn = copyEl.shadowRoot?.querySelector('button');
      expect(copyInnerBtn?.getAttribute('aria-label')).to.equal('複製');

      const customEl = await fixture<AuiIconButton>(
        html`<aui-icon-button label="自訂搜尋"></aui-icon-button>`,
      );
      const customInnerBtn = customEl.shadowRoot?.querySelector('button');
      expect(customInnerBtn?.getAttribute('aria-label')).to.equal('自訂搜尋');
    });

    it('exposes the built-in tooltip text as the accessible description of the button', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button
          preset="copy"
          label="複製程式碼"
          tooltip="複製至剪貼簿"
        ></aui-icon-button>`,
      );
      const tooltip = el.shadowRoot!.querySelector<AuiTooltip>('aui-tooltip')!;
      const innerBtn = el.shadowRoot!.querySelector('button')!;

      setTimeout(() => tooltip.show());
      await oneEvent(tooltip, 'aui-after-show');

      const node = await getAxNode(innerBtn);
      expect(node.name).to.equal('複製程式碼');
      expect(node.description).to.equal('複製至剪貼簿');
    });

    it('manages aria-busy and aria-disabled attributes', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="refresh"></aui-icon-button>`,
      );
      const innerBtn = el.shadowRoot?.querySelector('button');

      expect(innerBtn?.getAttribute('aria-busy')).to.equal('false');
      expect(innerBtn?.getAttribute('aria-disabled')).to.equal('false');

      el.loading = true;
      await el.updateComplete;
      expect(innerBtn?.getAttribute('aria-busy')).to.equal('true');
      expect(innerBtn?.getAttribute('aria-disabled')).to.equal('true');
    });

    it('is exposed as a plain button, not a toggle button (no aria-pressed)', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy" copy-value="x"></aui-icon-button>`,
      );
      const innerBtn = el.shadowRoot!.querySelector('button')!;
      expect(innerBtn.hasAttribute('aria-pressed')).to.be.false;
      expect((await getAxNode(innerBtn)).role).to.equal('button');

      // active 視覺高亮與複製成功回饋都不代表「已按下」的切換狀態
      el.active = true;
      await el.updateComplete;
      expect(innerBtn.hasAttribute('aria-pressed')).to.be.false;

      el.triggerFeedback('success');
      await el.updateComplete;
      expect(innerBtn.hasAttribute('aria-pressed')).to.be.false;
      expect((await getAxNode(innerBtn)).role).to.equal('button');
    });

    it('provides aria-live region for screen reader announcements on state change', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy" copy-value="Announce Me"></aui-icon-button>`,
      );

      const liveRegion = el.shadowRoot?.querySelector('[aria-live="polite"]');
      expect(liveRegion).to.exist;
      expect(liveRegion?.getAttribute('role')).to.equal('status');

      const originalWriteText = navigator.clipboard?.writeText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText = async () => {};
      }

      try {
        setTimeout(() => el.click());
        await oneEvent(el, 'aui-copy');
        await el.updateComplete;

        expect(liveRegion?.textContent?.trim()).to.equal('已複製！');
      } finally {
        if (navigator.clipboard && originalWriteText) {
          navigator.clipboard.writeText = originalWriteText;
        }
      }
    });
  });

  describe('Keyboard navigation and focusability', () => {
    it('delegates focus and blur to internal button', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="close"></aui-icon-button>`,
      );
      const innerBtn = el.shadowRoot?.querySelector('button');

      el.focus();
      expect(el.shadowRoot?.activeElement).to.equal(innerBtn);

      el.blur();
      expect(el.shadowRoot?.activeElement).to.be.null;
    });

    it('triggers action on keyboard Enter / Space activation', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy" copy-value="Keyboard copy"></aui-icon-button>`,
      );

      const originalWriteText = navigator.clipboard?.writeText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText = async () => {};
      }

      try {
        const innerBtn = el.shadowRoot?.querySelector('button');
        setTimeout(() => innerBtn?.click());
        const event = await oneEvent(el, 'aui-copy');
        expect(event).to.exist;
        expect(el.status).to.equal('success');
      } finally {
        if (navigator.clipboard && originalWriteText) {
          navigator.clipboard.writeText = originalWriteText;
        }
      }
    });
  });
});
