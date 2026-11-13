import { expect, fixture, html } from '@open-wc/testing';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiOutput } from './output.js';

const base = (el: AuiOutput) => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;

/** WCAG 2.x 相對亮度對比度 */
function contrastRatio(a: string, b: string): number {
  const luminance = (rgb: string) => {
    const [r, g, bl] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map((n) => {
      const c = Number(n) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('AuiOutput Accessibility (<aui-output>)', () => {
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

  const templates = () => [
    html`<aui-output label="Result" value="SGVsbG8gV29ybGQ="></aui-output>`,
    html`<aui-output
      label="Result"
      status="warning"
      value="Trailing whitespace removed"
    ></aui-output>`,
    html`<aui-output label="Result" status="error" value="Invalid input"></aui-output>`,
    html`<aui-output label="Result" placeholder="Result will appear here"></aui-output>`,
  ];

  describe('axe-core automated WCAG audit', () => {
    for (const theme of ['light', 'dark'] as const) {
      it(`passes axe audit for success, warning, error and empty states (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          for (const template of templates()) {
            const el = await fixture<AuiOutput>(template);
            await expect(el).to.be.accessible();
          }
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('status is not conveyed by color alone', () => {
    for (const theme of ['light', 'dark'] as const) {
      it(`status icons and text meet contrast requirements (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          for (const status of ['success', 'warning', 'error'] as const) {
            const el = await fixture<AuiOutput>(
              html`<aui-output .status=${status} value="result"></aui-output>`,
            );
            const background = getComputedStyle(base(el)).backgroundColor;
            const iconColor = getComputedStyle(
              el.shadowRoot!.querySelector('[part="icon"]')!,
            ).color;
            const textColor = getComputedStyle(
              el.shadowRoot!.querySelector('[part="text"]')!,
            ).color;
            // 圖示為非文字元素，WCAG 1.4.11 要求 3:1；文字要求 4.5:1
            expect(contrastRatio(iconColor, background), `${status} icon`).to.be.at.least(3);
            expect(contrastRatio(textColor, background), `${status} text`).to.be.at.least(4.5);
          }
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('computed accessibility tree', () => {
    it('exposes a named status region with description', async () => {
      const el = await fixture<AuiOutput>(html`
        <aui-output label="Encoded" description="Base64 of the input" value="QQ=="></aui-output>
      `);
      const node = await getAxNode(base(el));
      expect(node.role).to.equal('status');
      expect(node.name).to.equal('Encoded');
      expect(node.description).to.equal('Base64 of the input');
    });

    it('includes the status text before the result for screen readers', async () => {
      const el = await fixture<AuiOutput>(
        html`<aui-output status="error" value="Invalid JSON"></aui-output>`,
      );
      // live region 播報的是區域內未被 aria-hidden 隱藏的文字（圖示已隱藏）
      const announced = [...base(el).querySelectorAll<HTMLElement>('span:not([aria-hidden])')]
        .map((span) => span.textContent!.trim())
        .join('');
      expect(announced).to.equal('錯誤：Invalid JSON');
      expect((await getAxNode(base(el))).role).to.equal('status');
    });
  });
});
