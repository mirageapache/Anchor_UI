import { expect, fixture, html } from '@open-wc/testing';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiFooter } from './footer.js';
import type { FooterColumn } from './footer.types.js';

const part = (el: AuiFooter, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Components', href: '#components' },
      { label: 'Tokens', href: '#tokens' },
    ],
  },
  {
    heading: 'Resources',
    links: [{ label: 'GitHub', href: 'https://github.com/example', external: true }],
  },
];

const fullFooter = (width: number) => html`
  <aui-footer
    copyright-holder="Anchor UI"
    copyright-since="2024"
    version="1.0.0"
    .columns=${COLUMNS}
    style="width: ${width}px"
  >
    <a slot="links" href="#privacy">Privacy</a>
    <a slot="links" href="#terms">Terms</a>
    <a slot="social" href="https://github.com/example" aria-label="GitHub">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="currentColor"></circle>
      </svg>
    </a>
  </aui-footer>
`;

describe('AuiFooter Accessibility (<aui-footer>)', () => {
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
      for (const width of [1000, 400]) {
        it(`passes axe audit (${width}px, ${theme})`, async () => {
          if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
          try {
            const el = await fixture<AuiFooter>(fullFooter(width));
            await expect(el).to.be.accessible();
          } finally {
            document.documentElement.removeAttribute('data-theme');
          }
        });
      }
    }
  });

  describe('computed accessibility tree', () => {
    it('is a contentinfo landmark with named navigation landmarks', async () => {
      const el = await fixture<AuiFooter>(fullFooter(1000));
      expect((await getAxNode(part(el, 'base'))).role).to.equal('contentinfo');
      const columns = await getAxNode(part(el, 'columns'));
      expect([columns.role, columns.name]).to.deep.equal(['navigation', '網站導覽']);
      const links = await getAxNode(part(el, 'links'));
      expect([links.role, links.name]).to.deep.equal(['navigation', '頁尾連結']);
    });

    it('names each link list after its column heading', async () => {
      const el = await fixture<AuiFooter>(fullFooter(1000));
      const lists = el.shadowRoot!.querySelectorAll('ul');
      // getAxNode 以全域變數傳遞目標，須逐一呼叫
      const names: string[] = [];
      for (const list of lists) names.push((await getAxNode(list)).name);
      expect(names).to.deep.equal(['Product', 'Resources']);
    });

    it('announces that external links open in a new tab', async () => {
      const el = await fixture<AuiFooter>(fullFooter(1000));
      const external = el.shadowRoot!.querySelector('a[target="_blank"]')!;
      // 提示為絕對定位的視覺隱藏文字，名稱計算時會與連結文字以空白分隔
      expect((await getAxNode(external)).name).to.equal('GitHub （另開新視窗）');
    });
  });
});
