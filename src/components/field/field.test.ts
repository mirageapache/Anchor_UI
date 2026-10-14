import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './index.js';
import type { AuiField } from './field.js';
import type { AuiInput } from '../input/input.js';
import type { AuiIconButton } from '../icon-button/icon-button.js';

const part = <T extends Element = HTMLElement>(field: AuiField, name: string) =>
  field.shadowRoot!.querySelector<T>(`[part~="${name}"]`);

/** 等待欄位與輸入框完成 slotchange 後的更新 */
async function settle(field: AuiField): Promise<void> {
  await field.updateComplete;
  await field.updateComplete;
  const input = field.querySelector<AuiInput>('aui-input');
  await input?.updateComplete;
}

/** 以假的 clipboard.writeText 執行測試，回傳寫入的內容 */
async function withClipboard(run: (written: string[]) => Promise<void>): Promise<void> {
  const written: string[] = [];
  const original = navigator.clipboard.writeText;
  navigator.clipboard.writeText = async (text: string) => {
    written.push(text);
  };
  try {
    await run(written);
  } finally {
    navigator.clipboard.writeText = original;
  }
}

describe('AuiField (<aui-field>)', () => {
  it('renders the label and description', async () => {
    const field = await fixture<AuiField>(html`
      <aui-field label="API Key" description="Found in your account settings">
        <aui-input></aui-input>
      </aui-field>
    `);
    expect(part(field, 'label')!.textContent!.trim()).to.equal('API Key');
    expect(part(field, 'description')!.textContent!.trim()).to.equal(
      'Found in your account settings',
    );
    expect(getComputedStyle(part(field, 'label')!).textTransform).to.equal('uppercase');
  });

  it('passes label and description to the slotted input', async () => {
    const field = await fixture<AuiField>(html`
      <aui-field label="Email" description="We never share it">
        <aui-input></aui-input>
      </aui-field>
    `);
    await settle(field);
    const input = field.querySelector<AuiInput>('aui-input')!;
    expect(input.label).to.equal('Email');
    expect(input.description).to.equal('We never share it');

    field.label = 'Work email';
    field.description = '';
    await settle(field);
    expect(input.label).to.equal('Work email');
    expect(input.description).to.equal('');
  });

  it('hides the visible label and description from assistive technology only when an input receives them', async () => {
    const withInput = await fixture<AuiField>(html`
      <aui-field label="Name" description="Hint"><aui-input></aui-input></aui-field>
    `);
    await settle(withInput);
    expect(part(withInput, 'label')!.getAttribute('aria-hidden')).to.equal('true');
    expect(part(withInput, 'description')!.getAttribute('aria-hidden')).to.equal('true');

    const withoutInput = await fixture<AuiField>(html`
      <aui-field label="Name" description="Hint"><span>static content</span></aui-field>
    `);
    await settle(withoutInput);
    expect(part(withoutInput, 'label')!.hasAttribute('aria-hidden')).to.be.false;
    expect(part(withoutInput, 'description')!.hasAttribute('aria-hidden')).to.be.false;
  });

  it('withdraws its label and description when the input leaves the field', async () => {
    const field = await fixture<AuiField>(html`
      <aui-field label="Title" description="Desc"><aui-input></aui-input></aui-field>
    `);
    await settle(field);
    const input = field.querySelector<AuiInput>('aui-input')!;
    expect(input.label).to.equal('Title');

    document.body.appendChild(input);
    await settle(field);
    try {
      expect(input.label).to.equal('');
      expect(input.description).to.equal('');
    } finally {
      input.remove();
    }
  });

  it('links to a replacement input', async () => {
    const field = await fixture<AuiField>(html`
      <aui-field label="Replace me"><aui-input></aui-input></aui-field>
    `);
    await settle(field);
    const replacement = document.createElement('aui-input');
    field.querySelector('aui-input')!.replaceWith(replacement);
    await settle(field);
    expect(replacement.label).to.equal('Replace me');
  });

  it('focuses the input when the label is clicked', async () => {
    const field = await fixture<AuiField>(html`
      <aui-field label="Click me"><aui-input></aui-input></aui-field>
    `);
    await settle(field);
    part(field, 'label')!.click();
    const input = field.querySelector<AuiInput>('aui-input')!;
    expect(document.activeElement).to.equal(input);
    expect(input.shadowRoot!.activeElement).to.equal(input.shadowRoot!.querySelector('.control'));
  });

  it('hides the head when there is no label and no action', async () => {
    const field = await fixture<AuiField>(html`<aui-field><aui-input></aui-input></aui-field>`);
    await settle(field);
    expect(getComputedStyle(part(field, 'head')!).display).to.equal('none');

    field.copyable = true;
    await settle(field);
    expect(getComputedStyle(part(field, 'head')!).display).to.equal('flex');
  });

  it('shows the head for slotted custom actions', async () => {
    const field = await fixture<AuiField>(html`
      <aui-field>
        <button slot="actions">Generate</button>
        <aui-input></aui-input>
      </aui-field>
    `);
    await settle(field);
    expect(getComputedStyle(part(field, 'head')!).display).to.equal('flex');
  });

  describe('copy button', () => {
    it('is only rendered when copyable', async () => {
      const field = await fixture<AuiField>(html`<aui-field><aui-input></aui-input></aui-field>`);
      expect(part(field, 'copy-button')).to.be.null;
      field.copyable = true;
      await settle(field);
      expect(part(field, 'copy-button')).to.exist;
    });

    it('copies the current value, including values set by code', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field label="Token" copyable><aui-input value="first"></aui-input></aui-field>
      `);
      await settle(field);
      const input = field.querySelector<AuiInput>('aui-input')!;
      const button = part<AuiIconButton>(field, 'copy-button')!;
      expect(button.label).to.equal('複製 Token');

      await withClipboard(async (written) => {
        input.value = 'second';
        const copied = oneEvent(field, 'aui-copy');
        button.click();
        const event = await copied;
        expect(written).to.deep.equal(['second']);
        expect(event.detail.value).to.equal('second');
      });
    });

    it('reports an error when the input is empty', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field copyable><aui-input></aui-input></aui-field>
      `);
      await settle(field);
      await withClipboard(async (written) => {
        const failed = oneEvent(field, 'aui-copy-error');
        part<AuiIconButton>(field, 'copy-button')!.click();
        await failed;
        expect(written).to.deep.equal([]);
      });
    });
  });

  describe('clear button', () => {
    it('clears the input, dispatches input / change and returns focus to the input', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field label="Search" clearable><aui-input value="query"></aui-input></aui-field>
      `);
      await settle(field);
      const input = field.querySelector<AuiInput>('aui-input')!;
      const button = part<AuiIconButton>(field, 'clear-button')!;
      expect(button.label).to.equal('清除 Search');

      const events: string[] = [];
      input.addEventListener('input', () => events.push(`input:${input.value}`));
      input.addEventListener('change', () => events.push(`change:${input.value}`));

      button.click();
      expect(input.value).to.equal('');
      expect(events).to.deep.equal(['input:', 'change:']);
      expect(document.activeElement).to.equal(input);
    });

    it('is disabled while the input is disabled or readonly', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field clearable><aui-input value="locked" readonly></aui-input></aui-field>
      `);
      await settle(field);
      const input = field.querySelector<AuiInput>('aui-input')!;
      const button = () => part<AuiIconButton>(field, 'clear-button')!;
      expect(button().disabled).to.be.true;

      input.readOnly = false;
      await settle(field);
      expect(button().disabled).to.be.false;

      input.disabled = true;
      await settle(field);
      expect(button().disabled).to.be.true;

      button().click();
      expect(input.value).to.equal('locked');
    });

    it('stops observing the input after the field is disconnected', async () => {
      const field = await fixture<AuiField>(html`
        <aui-field clearable><aui-input></aui-input></aui-field>
      `);
      await settle(field);
      const input = field.querySelector<AuiInput>('aui-input')!;
      const parent = field.parentNode!;

      field.remove();
      input.disabled = true;
      await input.updateComplete;
      await new Promise((resolve) => setTimeout(resolve));
      expect(part<AuiIconButton>(field, 'clear-button')!.disabled).to.be.false;

      // 重新連接時補同步斷開期間的變化，並恢復觀察
      parent.appendChild(field);
      await settle(field);
      expect(part<AuiIconButton>(field, 'clear-button')!.disabled).to.be.true;

      input.disabled = false;
      await settle(field);
      expect(part<AuiIconButton>(field, 'clear-button')!.disabled).to.be.false;
    });
  });
});
