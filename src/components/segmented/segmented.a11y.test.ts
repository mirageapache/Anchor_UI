import { expect, fixture, html } from '@open-wc/testing';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import '../field/index.js';
import type { AuiSegmented } from './segmented.js';
import type { AuiField } from '../field/field.js';
import type { SegmentedOption } from './segmented.types.js';

const MODES: SegmentedOption[] = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
  { value: 'off', label: 'Off', disabled: true },
];

const group = (el: AuiSegmented) => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;
const buttons = (el: AuiSegmented) => [
  ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option'),
];

describe('AuiSegmented Accessibility (<aui-segmented>)', () => {
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
    const templates = () => [
      html`<aui-segmented label="Mode" .options=${MODES} value="encode"></aui-segmented>`,
      html`<aui-segmented label="Mode" .options=${MODES}></aui-segmented>`,
      html`<aui-segmented
        label="Mode"
        description="How the input is converted"
        .options=${MODES}
        value="decode"
        required
      ></aui-segmented>`,
      html`<aui-segmented label="Mode" .options=${MODES} value="encode" disabled></aui-segmented>`,
    ];

    for (const theme of ['light', 'dark'] as const) {
      it(`passes axe audit in all states (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          for (const template of templates()) {
            const el = await fixture<AuiSegmented>(template);
            await expect(el).to.be.accessible();
          }
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });

  describe('computed accessibility tree', () => {
    it('exposes a named, described radiogroup', async () => {
      const el = await fixture<AuiSegmented>(html`
        <aui-segmented
          label="Conversion mode"
          description="Choose how to convert"
          .options=${MODES}
        ></aui-segmented>
      `);
      const node = await getAxNode(group(el));
      expect(node.role).to.equal('radiogroup');
      expect(node.name).to.equal('Conversion mode');
      expect(node.description).to.equal('Choose how to convert');
    });

    it('names each radio exactly by its label (the width placeholder is not read)', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented label="Mode" .options=${MODES} value="encode"></aui-segmented>`,
      );
      for (const [index, option] of MODES.entries()) {
        const node = await getAxNode(buttons(el)[index]);
        expect(node.role).to.equal('radio');
        expect(node.name).to.equal(option.label);
      }
    });

    it('marks the group as required', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented label="Mode" .options=${MODES} required></aui-segmented>`,
      );
      expect(group(el).getAttribute('aria-required')).to.equal('true');
    });
  });

  describe('inside <aui-field>', () => {
    it('reads the field label and description as the group name and description', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field label="Mode" description="Applies to the output below">
          <aui-segmented .options=${MODES} value="decode"></aui-segmented>
        </aui-field>
      `);
      await field.updateComplete;
      const el = field.querySelector<AuiSegmented>('aui-segmented')!;
      await el.updateComplete;

      const node = await getAxNode(group(el));
      expect(node.name).to.equal('Mode');
      expect(node.description).to.equal('Applies to the output below');
      await expect(field).to.be.accessible();
    });

    it('focuses the selected option when the field label is clicked', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field label="Mode"
          ><aui-segmented .options=${MODES} value="decode"></aui-segmented
        ></aui-field>
      `);
      await field.updateComplete;
      const el = field.querySelector<AuiSegmented>('aui-segmented')!;
      await el.updateComplete;

      field.shadowRoot!.querySelector<HTMLElement>('[part="label"]')!.click();
      expect(el.shadowRoot!.activeElement).to.equal(buttons(el)[1]);
    });
  });
});
