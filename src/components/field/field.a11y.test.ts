import { expect, fixture, html } from '@open-wc/testing';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiField } from './field.js';
import type { AuiInput } from '../input/input.js';

/** 等待欄位與輸入框完成 slotchange 後的更新 */
async function settle(field: AuiField): Promise<void> {
  await field.updateComplete;
  await field.updateComplete;
  await field.querySelector<AuiInput>('aui-input')?.updateComplete;
}

const controlOf = (field: AuiField) =>
  field.querySelector<AuiInput>('aui-input')!.shadowRoot!.querySelector<HTMLElement>('.control')!;

const actionButton = (field: AuiField, name: string) =>
  field
    .shadowRoot!.querySelector(`[part~="${name}"]`)!
    .shadowRoot!.querySelector<HTMLButtonElement>('button')!;

describe('AuiField Accessibility (<aui-field>)', () => {
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

  const fullField = () => html`
    <aui-field label="Access token" description="Paste the token from settings" copyable clearable>
      <aui-input value="tok_123"></aui-input>
    </aui-field>
  `;

  describe('axe-core automated WCAG audit', () => {
    it('passes axe audit with label, description and actions', async () => {
      const field = await fixture<AuiField>(fullField());
      await settle(field);
      await expect(field).to.be.accessible();
    });

    it('passes axe audit in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const field = await fixture<AuiField>(fullField());
        await settle(field);
        await expect(field).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('accessible name and description (computed accessibility tree)', () => {
    it('reads the field label and description as the input name and description', async () => {
      const field = await fixture<AuiField>(fullField());
      await settle(field);
      const node = await getAxNode(controlOf(field));
      expect(node.role).to.equal('textbox');
      expect(node.name).to.equal('Access token');
      expect(node.description).to.equal('Paste the token from settings');
    });

    it('works for multiline inputs and follows label changes', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field label="Request body"><aui-input multiline></aui-input></aui-field>
      `);
      await settle(field);
      expect((await getAxNode(controlOf(field))).name).to.equal('Request body');

      field.label = 'Response body';
      await settle(field);
      expect((await getAxNode(controlOf(field))).name).to.equal('Response body');
    });

    it('names the built-in action buttons after the field', async () => {
      const field = await fixture<AuiField>(fullField());
      await settle(field);
      expect((await getAxNode(actionButton(field, 'copy-button'))).name).to.equal(
        '複製 Access token',
      );
      expect((await getAxNode(actionButton(field, 'clear-button'))).name).to.equal(
        '清除 Access token',
      );
    });
  });
});
