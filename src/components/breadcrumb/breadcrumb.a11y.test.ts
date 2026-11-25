import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import '../header/index.js';
import type { AuiBreadcrumb } from './breadcrumb.js';
import type { BreadcrumbItem } from './breadcrumb.types.js';
import { getAxNode } from '../../test-utils/ax.js';

const trail: BreadcrumbItem[] = [
  { label: '首頁', href: '/' },
  { label: '工具', href: '/tools' },
  { label: 'JSON 格式化' },
];

const inHeader = () => html`
  <div style="width: 480px;">
    <aui-header heading="JSON 格式化" description="格式化、驗證與壓縮 JSON。">
      <aui-breadcrumb slot="breadcrumb" .items=${trail}></aui-breadcrumb>
    </aui-header>
  </div>
`;

describe('AuiBreadcrumb Accessibility (<aui-breadcrumb>)', () => {
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
    it('passes axe audit inside a header in light theme', async () => {
      const el = await fixture(inHeader());
      await expect(el).to.be.accessible();
    });

    it('passes axe audit in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const el = await fixture(inHeader());
        await expect(el).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('semantics', () => {
    it('is a navigation landmark named by the label', async () => {
      const el = await fixture<AuiBreadcrumb>(
        html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
      );
      const node = await getAxNode(el.shadowRoot!.querySelector('nav')!);
      expect(node.role).to.equal('navigation');
      expect(node.name).to.equal('麵包屑');
    });

    it('exposes an ordered list whose current page has aria-current="page"', async () => {
      const el = await fixture<AuiBreadcrumb>(
        html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
      );
      const list = await getAxNode(el.shadowRoot!.querySelector('ol')!);
      expect(list.role).to.equal('list');
      // Chromium 的 CDP 無障礙樹不提供 aria-current，改以屬性檢查（目前頁面只有一個）
      const current = [...el.shadowRoot!.querySelectorAll('[aria-current]')];
      expect(
        current.map((node) => [node.getAttribute('aria-current'), node.textContent]),
      ).to.deep.equal([['page', 'JSON 格式化']]);
      const link = await getAxNode(el.shadowRoot!.querySelector('a')!);
      expect(link.role).to.equal('link');
      expect(link.name).to.equal('首頁');
    });

    it('keeps the separators out of the accessibility tree', async () => {
      const el = await fixture<AuiBreadcrumb>(
        html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
      );
      const separator = await getAxNode(el.shadowRoot!.querySelector('[part="separator"]')!);
      expect(separator.ignored).to.be.true;
      // 分隔符號不會混進連結的名稱
      const link = await getAxNode(el.shadowRoot!.querySelectorAll('a')[1]);
      expect(link.name).to.equal('工具');
    });
  });
});
