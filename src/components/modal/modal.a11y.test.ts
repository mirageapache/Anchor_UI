import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import './index.js';
import '../button/index.js';
import type { AuiModal } from './modal.js';

const dialogOf = (el: AuiModal) => el.shadowRoot!.querySelector('dialog')!;

async function openModal(el: AuiModal): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.open = true;
  await shown;
}

async function closeModal(el: AuiModal): Promise<void> {
  const hidden = oneEvent(el, 'aui-after-hide');
  await el.hide();
  await hidden;
}

describe('AuiModal Accessibility (<aui-modal>)', () => {
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

  const fullModal = () => html`
    <aui-modal heading="Delete project" size="sm">
      <p>This permanently deletes the project and all of its data.</p>
      <aui-button slot="footer" variant="ghost">Cancel</aui-button>
      <aui-button slot="footer" variant="danger">Delete</aui-button>
    </aui-modal>
  `;

  describe('axe-core automated WCAG audit', () => {
    for (const theme of ['light', 'dark'] as const) {
      it(`passes axe audit while open (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          const el = await fixture<AuiModal>(fullModal());
          await openModal(el);
          await expect(el).to.be.accessible();
          await closeModal(el);
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('computed accessibility tree', () => {
    it('is a dialog named by its heading', async () => {
      const el = await fixture<AuiModal>(fullModal());
      await openModal(el);
      const node = await getAxNode(dialogOf(el));
      expect(node.role).to.equal('dialog');
      expect(node.name).to.equal('Delete project');
      await closeModal(el);
    });

    it('uses label as the name when there is no heading', async () => {
      const el = await fixture<AuiModal>(html`
        <aui-modal label="Custom dialog"><span slot="header">Custom header</span>Body</aui-modal>
      `);
      await openModal(el);
      expect((await getAxNode(dialogOf(el))).name).to.equal('Custom dialog');
      await closeModal(el);
    });

    it('names the close button', async () => {
      const el = await fixture<AuiModal>(fullModal());
      await openModal(el);
      const button = el.shadowRoot!.querySelector<HTMLElement>('[part="close-button"]')!;
      const node = await getAxNode(button);
      expect(node.role).to.equal('button');
      expect(node.name).to.equal('關閉');
      await closeModal(el);
    });
  });

  describe('keyboard', () => {
    it('keeps Tab focus inside the dialog', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          ${fullModal()}
          <button id="after">After</button>
        </div>
      `);
      const el = wrapper.querySelector<AuiModal>('aui-modal')!;
      await openModal(el);

      const outside = [wrapper.querySelector('#before'), wrapper.querySelector('#after')];
      for (let i = 0; i < 8; i++) {
        await sendKeys({ press: 'Tab' });
        const active = getDeepActiveElement();
        expect(outside, `Tab #${i + 1} must not leave the dialog`).to.not.include(active);
      }
      await closeModal(el);
    });
  });
});
