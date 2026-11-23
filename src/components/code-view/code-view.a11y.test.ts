import { expect, fixture, html } from '@open-wc/testing';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiCodeView } from './code-view.js';

const CODE = JSON.stringify({ name: 'anchor', deps: { lit: '^3' }, list: [1, 2] }, null, 2);

describe('AuiCodeView Accessibility (<aui-code-view>)', () => {
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
    for (const theme of ['light', 'dark'] as const) {
      it(`passes axe audit, expanded and folded (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          const el = await fixture<AuiCodeView>(
            html`<aui-code-view .code=${CODE} style="width: 240px"></aui-code-view>`,
          );
          await expect(el).to.be.accessible();
          el.foldAll();
          await el.updateComplete;
          await expect(el).to.be.accessible();
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('computed accessibility tree', () => {
    it('is a named region; fold buttons are named by their line range', async () => {
      const el = await fixture<AuiCodeView>(html`<aui-code-view .code=${CODE}></aui-code-view>`);
      const region = await getAxNode(el.shadowRoot!.querySelector('[part="base"]')!);
      expect([region.role, region.name]).to.deep.equal(['region', '程式碼']);

      const button = el.shadowRoot!.querySelector<HTMLElement>('[part="fold-button"]')!;
      const node = await getAxNode(button);
      expect([node.role, node.name]).to.deep.equal(['button', '第 1–9 行']);
      expect(button.getAttribute('aria-expanded')).to.equal('true');
    });

    it('hides line numbers and the fold placeholder from assistive technology', async () => {
      const el = await fixture<AuiCodeView>(html`<aui-code-view .code=${CODE}></aui-code-view>`);
      el.foldAll();
      await el.updateComplete;
      expect((await getAxNode(el.shadowRoot!.querySelector('[part="line-number"]')!)).ignored).to.be
        .true;
      expect((await getAxNode(el.shadowRoot!.querySelector('[part="fold-placeholder"]')!)).ignored)
        .to.be.true;
    });
  });
});
