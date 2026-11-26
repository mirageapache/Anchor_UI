import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import './index.js';
import '../button/index.js';
import type { AuiMenu } from './menu.js';
import { getAxNode } from '../../test-utils/ax.js';

const panelOf = (el: AuiMenu) => el.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;

/** 導覽列的使用者選單 */
const userMenu = () => html`
  <div style="padding: 24px;">
    <aui-menu label="使用者選單">
      <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
      <a href="#profile">個人資料</a>
      <button value="settings">設定</button>
      <button value="billing" aria-disabled="true">帳單（未開通）</button>
      <hr />
      <button value="logout">登出</button>
    </aui-menu>
  </div>
`;

async function open(el: AuiMenu): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.show();
  await shown;
}

describe('AuiMenu Accessibility (<aui-menu>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
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

  after(() => emulateMedia({ reducedMotion: 'no-preference' }));

  describe('axe-core automated WCAG audit', () => {
    it('passes axe audit when closed and open, in light theme', async () => {
      const wrapper = await fixture<HTMLElement>(userMenu());
      await expect(wrapper).to.be.accessible();
      await open(wrapper.querySelector('aui-menu')!);
      await expect(wrapper).to.be.accessible();
    });

    it('passes axe audit when open in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const wrapper = await fixture<HTMLElement>(userMenu());
        await open(wrapper.querySelector('aui-menu')!);
        await expect(wrapper).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('menu button semantics', () => {
    it('exposes the trigger as a menu button', async () => {
      const wrapper = await fixture<HTMLElement>(userMenu());
      const el = wrapper.querySelector<AuiMenu>('aui-menu')!;
      const host = el.querySelector('aui-button')!;
      await host.updateComplete;
      const inner = host.shadowRoot!.querySelector('button')!;

      let node = await getAxNode(inner);
      expect(node.role).to.equal('button');
      expect(node.properties.hasPopup).to.equal('menu');
      expect(node.properties.expanded).to.equal(false);
      expect(node.properties.controls).to.equal(1);

      await open(el);
      await host.updateComplete;
      node = await getAxNode(inner);
      expect(node.properties.expanded).to.equal(true);
    });

    it('exposes a named menu with menu items, a separator and a disabled item', async () => {
      const wrapper = await fixture<HTMLElement>(userMenu());
      const el = wrapper.querySelector<AuiMenu>('aui-menu')!;
      await open(el);

      const menu = await getAxNode(panelOf(el));
      expect(menu.role).to.equal('menu');
      expect(menu.name).to.equal('使用者選單');

      const profile = await getAxNode(el.querySelector('a')!);
      expect(profile.role).to.equal('menuitem');
      expect(profile.name).to.equal('個人資料');

      const billing = await getAxNode(el.querySelector('[value="billing"]')!);
      expect(billing.role).to.equal('menuitem');
      expect(billing.properties.disabled).to.equal(true);

      const separator = await getAxNode(el.querySelector('hr')!);
      expect(separator.role).to.equal('separator');
    });

    it('is named by the trigger when no label is set', async () => {
      const el = await fixture<AuiMenu>(html`
        <aui-menu><aui-button slot="trigger">更多操作</aui-button><button>編輯</button></aui-menu>
      `);
      await open(el);
      const node = await getAxNode(panelOf(el));
      expect(node.role).to.equal('menu');
      expect(node.name).to.equal('更多操作');
    });
  });

  describe('forced colors (Windows high contrast)', () => {
    before(() => emulateMedia({ forcedColors: 'active' }));
    after(() => emulateMedia({ forcedColors: 'none' }));

    it('outlines the focused item even when focus is not :focus-visible (pointer hover)', async () => {
      const wrapper = await fixture<HTMLElement>(userMenu());
      const el = wrapper.querySelector<AuiMenu>('aui-menu')!;
      await open(el);
      const item = el.querySelector<HTMLElement>('[value="logout"]')!;
      expect(getComputedStyle(item).outlineStyle).to.equal('none');
      // 滑鼠移到項目上時焦點跟著移動
      item.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true }));
      expect(el.querySelector(':focus')).to.equal(item);
      expect(getComputedStyle(item).outlineStyle).to.equal('solid');
    });
  });
});
