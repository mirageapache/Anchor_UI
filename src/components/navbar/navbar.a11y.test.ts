import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import './index.js';
import type { AuiNavbar } from './navbar.js';

const part = (el: AuiNavbar, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;

const fullNavbar = (width: number) => html`
  <div style="width: ${width}px">
    <aui-navbar brand="Anchor UI" brand-href="#home" menu-drawer="menu">
      <a href="#docs" aria-current="page">Docs</a>
      <a href="#components">Components</a>
      <a href="#tokens">Tokens</a>
    </aui-navbar>
  </div>
`;

async function render(width: number): Promise<AuiNavbar> {
  const wrapper = await fixture<HTMLDivElement>(fullNavbar(width));
  const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
  await el.updateComplete;
  return el;
}

describe('AuiNavbar Accessibility (<aui-navbar>)', () => {
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
      for (const width of [1024, 500]) {
        it(`passes axe audit (${width}px, ${theme})`, async () => {
          if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
          try {
            const el = await render(width);
            await expect(el).to.be.accessible();
          } finally {
            document.documentElement.removeAttribute('data-theme');
          }
        });
      }
    }
  });

  describe('computed accessibility tree', () => {
    it('is a banner landmark containing a named navigation landmark', async () => {
      const el = await render(1024);
      expect((await getAxNode(part(el, 'base'))).role).to.equal('banner');
      const nav = await getAxNode(part(el, 'nav'));
      expect(nav.role).to.equal('navigation');
      expect(nav.name).to.equal('主要導覽');
    });

    it('names the brand link, search button, menu button and theme switch', async () => {
      const el = await render(500);
      const brand = await getAxNode(part(el, 'brand'));
      expect(brand.role).to.equal('link');
      expect(brand.name).to.equal('Anchor UI');

      const search = await getAxNode(part(el, 'search-button'));
      expect(search.role).to.equal('button');
      expect(search.name).to.equal('搜尋');

      const menu = await getAxNode(part(el, 'menu-button'));
      expect(menu.role).to.equal('button');
      expect(menu.name).to.equal('開啟選單');
      expect(part(el, 'menu-button').getAttribute('aria-expanded')).to.equal('false');

      const toggle = await getAxNode(part(el, 'theme-toggle'));
      expect(toggle.role).to.equal('switch');
      expect(toggle.name).to.equal('深色模式');
      expect(part(el, 'theme-toggle').getAttribute('aria-checked')).to.equal('false');
    });
  });

  describe('keyboard', () => {
    it('tabs through brand, menu links, search and theme switch in visual order', async () => {
      const before = document.createElement('button');
      before.textContent = 'before';
      const el = await render(1024);
      el.parentElement!.prepend(before);
      before.focus();

      const expected = [
        part(el, 'brand'),
        el.querySelector('a[href="#docs"]'),
        el.querySelector('a[href="#components"]'),
        el.querySelector('a[href="#tokens"]'),
        part(el, 'search-button'),
        part(el, 'theme-toggle'),
      ];
      for (const [i, target] of expected.entries()) {
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement() === target, `Tab #${i + 1}`).to.be.true;
      }
    });

    it('starts with the menu button when narrow (the menu links are hidden)', async () => {
      const before = document.createElement('button');
      before.textContent = 'before';
      const el = await render(500);
      el.parentElement!.prepend(before);
      before.focus();

      for (const target of [
        part(el, 'menu-button'),
        part(el, 'brand'),
        part(el, 'search-button'),
      ]) {
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement() === target).to.be.true;
      }
    });
  });
});
