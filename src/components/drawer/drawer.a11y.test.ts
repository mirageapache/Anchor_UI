import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import './index.js';
import '../button/index.js';
import type { AuiDrawer } from './drawer.js';

const dialogOf = (el: AuiDrawer) => el.shadowRoot!.querySelector('dialog')!;

async function openDrawer(el: AuiDrawer): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.open = true;
  await shown;
}

async function closeDrawer(el: AuiDrawer): Promise<void> {
  const hidden = oneEvent(el, 'aui-after-hide');
  await el.hide();
  await hidden;
}

describe('AuiDrawer Accessibility (<aui-drawer>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
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

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  const fullDrawer = () => html`
    <aui-drawer heading="Filters">
      <nav aria-label="Sections">
        <a href="#overview">Overview</a>
        <a href="#settings">Settings</a>
      </nav>
      <aui-button slot="footer" variant="ghost">Reset</aui-button>
      <aui-button slot="footer">Apply</aui-button>
    </aui-drawer>
  `;

  describe('axe-core automated WCAG audit', () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const placement of ['left', 'right'] as const) {
        it(`passes axe audit while open (${placement}, ${theme})`, async () => {
          if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
          try {
            const el = await fixture<AuiDrawer>(fullDrawer());
            el.placement = placement;
            await openDrawer(el);
            await expect(el).to.be.accessible();
            await closeDrawer(el);
          } finally {
            document.documentElement.removeAttribute('data-theme');
          }
        });
      }
    }
  });

  describe('computed accessibility tree', () => {
    it('is a dialog named by its heading', async () => {
      const el = await fixture<AuiDrawer>(fullDrawer());
      await openDrawer(el);
      const node = await getAxNode(dialogOf(el));
      expect(node.role).to.equal('dialog');
      expect(node.name).to.equal('Filters');
      await closeDrawer(el);
    });

    it('uses label as the name and supports a description', async () => {
      const el = await fixture<AuiDrawer>(html`
        <aui-drawer label="Main menu" description="Site navigation">
          <span slot="header">Logo</span>Body
        </aui-drawer>
      `);
      await openDrawer(el);
      const node = await getAxNode(dialogOf(el));
      expect(node.name).to.equal('Main menu');
      expect(node.description).to.equal('Site navigation');
      await closeDrawer(el);
    });

    it('names the close button', async () => {
      const el = await fixture<AuiDrawer>(fullDrawer());
      await openDrawer(el);
      const button = el.shadowRoot!.querySelector<HTMLElement>('[part="close-button"]')!;
      const node = await getAxNode(button);
      expect(node.role).to.equal('button');
      expect(node.name).to.equal('關閉');
      await closeDrawer(el);
    });
  });

  describe('keyboard', () => {
    it('keeps Tab focus inside the drawer', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          ${fullDrawer()}
          <button id="after">After</button>
        </div>
      `);
      const el = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      await openDrawer(el);

      const outside = [wrapper.querySelector('#before'), wrapper.querySelector('#after')];
      for (let i = 0; i < 8; i++) {
        await sendKeys({ press: 'Tab' });
        const active = getDeepActiveElement();
        expect(outside, `Tab #${i + 1} must not leave the drawer`).to.not.include(active);
      }
      await closeDrawer(el);
    });
  });
});
