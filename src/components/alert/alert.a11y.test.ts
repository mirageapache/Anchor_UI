import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiAlert } from './alert.js';

const dialogOf = (el: AuiAlert) =>
  el.shadowRoot!.querySelector('aui-modal')!.shadowRoot!.querySelector('dialog')!;

async function openAlert(el: AuiAlert): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.open = true;
  await shown;
}

async function closeAlert(el: AuiAlert): Promise<void> {
  const hidden = oneEvent(el, 'aui-after-hide');
  el.cancel();
  await hidden;
}

async function axOf(template: TemplateResult) {
  const el = await fixture<AuiAlert>(template);
  await openAlert(el);
  const node = await getAxNode(dialogOf(el));
  await closeAlert(el);
  return node;
}

describe('AuiAlert Accessibility (<aui-alert>)', () => {
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

  describe('axe-core automated WCAG audit', () => {
    const templates = () => [
      html`<aui-alert icon="success" heading="Saved" message="All changes are saved."></aui-alert>`,
      html`<aui-alert
        mode="confirm"
        icon="warning"
        heading="Delete project?"
        message="This cannot be undone."
        destructive
      ></aui-alert>`,
      html`<aui-alert mode="prompt" icon="info" heading="Rename" input-value="draft"></aui-alert>`,
      html`<aui-alert icon="error" message="Something went wrong."></aui-alert>`,
    ];

    for (const theme of ['light', 'dark'] as const) {
      it(`passes axe audit in every mode (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          for (const template of templates()) {
            const el = await fixture<AuiAlert>(template);
            await openAlert(el);
            await expect(el).to.be.accessible();
            await closeAlert(el);
          }
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('computed accessibility tree', () => {
    it('is an alertdialog named by the icon state and title, described by the message', async () => {
      const node = await axOf(html`
        <aui-alert icon="error" heading="Delete failed" message="The file is in use."></aui-alert>
      `);
      expect(node.role).to.equal('alertdialog');
      expect(node.name).to.equal('錯誤：Delete failed');
      expect(node.description).to.equal('The file is in use.');
    });

    it('falls back to the icon state, then the mode, when there is no title', async () => {
      expect(
        (await axOf(html`<aui-alert icon="success" message="Saved"></aui-alert>`)).name,
      ).to.equal('成功');
      expect(
        (await axOf(html`<aui-alert mode="confirm" message="Proceed?"></aui-alert>`)).name,
      ).to.equal('確認');
    });

    it('names the prompt input', async () => {
      const el = await fixture<AuiAlert>(html`
        <aui-alert mode="prompt" heading="Rename" input-label="New file name"></aui-alert>
      `);
      await openAlert(el);
      const control = el
        .shadowRoot!.querySelector('aui-input')!
        .shadowRoot!.querySelector<HTMLElement>('.control')!;
      const node = await getAxNode(control);
      expect(node.role).to.equal('textbox');
      expect(node.name).to.equal('New file name');
      await closeAlert(el);
    });
  });
});
