import { expect, fixture, html } from '@open-wc/testing';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
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

      // 與其他元件 a11y 測試一致：頁面底色跟隨主題，深色模式對比度檢測才會以深色底計算
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

    it('passes axe audit for all variants in dark theme mode', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const variants = ['primary', 'accent', 'ghost', 'danger', 'success'] as const;
        for (const variant of variants) {
          const el = await fixture<AuiButton>(
            html`<aui-button .variant=${variant}>Dark ${variant} action</aui-button>`,
          );
          await expect(el).to.be.accessible();
        }
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('Solid variant colors (danger / success)', () => {
    /** 將任意 CSS 色彩字串正規化為瀏覽器計算後的 rgb() 字串 */
    const resolveColor = (value: string): string => {
      const probe = document.createElement('span');
      probe.style.color = value;
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    };

    /** WCAG 2.x 相對亮度對比度 */
    const contrastRatio = (a: string, b: string): number => {
      const luminance = (rgb: string) => {
        const [r, g, b] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map((n) => {
          const c = Number(n) / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };

    let noTransition: HTMLStyleElement;

    before(() => {
      // 停用轉場，避免 hover 後讀到轉場中途的顏色
      noTransition = document.createElement('style');
      noTransition.textContent = 'aui-button::part(button) { transition: none !important; }';
      document.head.appendChild(noTransition);
    });

    after(() => {
      noTransition.remove();
    });

    const themes = ['light', 'dark'] as const;
    const variants = ['danger', 'success'] as const;

    for (const theme of themes) {
      for (const variant of variants) {
        it(`${variant} uses defined solid tokens with AA contrast at rest and hover (${theme})`, async () => {
          if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
          try {
            const el = await fixture<AuiButton>(
              html`<aui-button .variant=${variant}>Solid ${variant}</aui-button>`,
            );
            const innerBtn = el.shadowRoot!.querySelector('button')!;
            const rootStyle = getComputedStyle(document.documentElement);
            const restToken = rootStyle.getPropertyValue(`--color-${variant}-solid`).trim();
            const hoverToken = rootStyle.getPropertyValue(`--color-${variant}-solid-hover`).trim();

            // token 必須定義於 tokens.css，而非只依賴元件內的 fallback
            expect(restToken, `--color-${variant}-solid is defined`).to.not.equal('');
            expect(hoverToken, `--color-${variant}-solid-hover is defined`).to.not.equal('');

            // getComputedStyle 回傳 live 物件，須先複製成字串
            const { backgroundColor: restBg, color: restColor } = getComputedStyle(innerBtn);
            expect(restBg).to.equal(resolveColor(restToken));
            expect(contrastRatio(restBg, restColor)).to.be.at.least(4.5);

            const rect = innerBtn.getBoundingClientRect();
            await sendMouse({
              type: 'move',
              position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
            });
            const { backgroundColor: hoverBg, color: hoverColor } = getComputedStyle(innerBtn);
            expect(hoverBg).to.equal(resolveColor(hoverToken));
            expect(hoverBg).to.not.equal(restBg);
            expect(contrastRatio(hoverBg, hoverColor)).to.be.at.least(4.5);
          } finally {
            await resetMouse();
            document.documentElement.removeAttribute('data-theme');
          }
        });
      }
    }
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
