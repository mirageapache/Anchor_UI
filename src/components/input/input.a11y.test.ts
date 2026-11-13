import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiInput } from './input.js';

const controlOf = (el: AuiInput) =>
  el.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('.control')!;

describe('AuiInput Accessibility (<aui-input>)', () => {
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
      html`<aui-input label="Username" value="anchor"></aui-input>`,
      html`<aui-input
        label="Notes"
        multiline
        value="multi
line"
      ></aui-input>`,
      html`<aui-input label="Disabled" value="locked" disabled></aui-input>`,
      html`<aui-input label="Readonly" value="read only" readonly></aui-input>`,
      html`<aui-input label="Invalid" value="bad" invalid description="Fix this"></aui-input>`,
    ];

    it('passes axe audit in all states (light theme)', async () => {
      for (const template of templates()) {
        const el = await fixture<AuiInput>(template);
        await expect(el).to.be.accessible();
      }
    });

    it('passes axe audit in all states (dark theme)', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        for (const template of templates()) {
          const el = await fixture<AuiInput>(template);
          await expect(el).to.be.accessible();
        }
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('accessible name and description (computed accessibility tree)', () => {
    it('exposes label and description of a single-line input', async () => {
      const el = await fixture<AuiInput>(
        html`<aui-input label="API Key" description="Starts with sk-"></aui-input>`,
      );
      const node = await getAxNode(controlOf(el));
      expect(node.role).to.equal('textbox');
      expect(node.name).to.equal('API Key');
      expect(node.description).to.equal('Starts with sk-');
    });

    it('exposes label and description of a multiline input', async () => {
      const el = await fixture<AuiInput>(
        html`<aui-input multiline label="Payload" description="JSON only"></aui-input>`,
      );
      const node = await getAxNode(controlOf(el));
      expect(node.role).to.equal('textbox');
      expect(node.name).to.equal('Payload');
      expect(node.description).to.equal('JSON only');
    });

    it('updates the computed name and description when they change', async () => {
      const el = await fixture<AuiInput>(html`<aui-input label="Before"></aui-input>`);
      el.label = 'After';
      el.description = 'Now described';
      await el.updateComplete;
      const node = await getAxNode(controlOf(el));
      expect(node.name).to.equal('After');
      expect(node.description).to.equal('Now described');

      el.description = '';
      await el.updateComplete;
      expect(controlOf(el).hasAttribute('aria-describedby')).to.be.false;
      expect((await getAxNode(controlOf(el))).description).to.equal('');
    });

    it('keeps the label text out of the visual layout', async () => {
      const el = await fixture<AuiInput>(html`<aui-input label="Hidden label"></aui-input>`);
      const label = el.shadowRoot!.querySelector('label')!;
      expect(label.getBoundingClientRect().width).to.be.at.most(1);
    });
  });

  describe('keyboard and focus', () => {
    it('is reachable with Tab and skipped when disabled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">before</button>
          <aui-input label="First"></aui-input>
          <aui-input label="Disabled" disabled></aui-input>
          <button id="after">after</button>
        </div>
      `);
      const [first] = wrapper.querySelectorAll<AuiInput>('aui-input');
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(first);
      expect(first.shadowRoot!.activeElement).to.equal(controlOf(first));

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(wrapper.querySelector('#after'));
    });

    it('shows the double-layer focus ring (brand border + halo) on focus', async () => {
      const noTransition = document.createElement('style');
      noTransition.textContent = 'aui-input::part(control) { transition: none !important; }';
      document.head.appendChild(noTransition);
      try {
        const el = await fixture<AuiInput>(html`<aui-input label="Focus"></aui-input>`);
        const control = controlOf(el);
        const rest = getComputedStyle(control).borderTopColor;
        expect(getComputedStyle(control).boxShadow).to.equal('none');

        el.focus();
        const focused = getComputedStyle(control);
        expect(focused.borderTopColor).to.not.equal(rest);
        expect(focused.boxShadow).to.contain('3px');
      } finally {
        noTransition.remove();
      }
    });
  });
});
