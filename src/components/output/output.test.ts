import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import type { AuiOutput } from './output.js';

const base = (el: AuiOutput) => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;
const text = (el: AuiOutput) => el.shadowRoot!.querySelector<HTMLElement>('[part="text"]')!;
const icon = (el: AuiOutput) => el.shadowRoot!.querySelector<HTMLElement>('[part="icon"]');
const srPrefix = (el: AuiOutput) =>
  el.shadowRoot!.querySelector<HTMLElement>('.output__body > .sr-only')?.textContent ?? null;

describe('AuiOutput (<aui-output>)', () => {
  it('renders the placeholder without status when empty', async () => {
    const el = await fixture<AuiOutput>(
      html`<aui-output placeholder="Result will appear here"></aui-output>`,
    );
    expect(el.status).to.equal('success');
    expect(el.getAttribute('status')).to.equal('success');
    expect(text(el).textContent).to.equal('Result will appear here');
    expect(base(el).classList.contains('output--empty')).to.be.true;
    expect(icon(el)).to.be.null;
    expect(srPrefix(el)).to.be.null;
  });

  it('renders a success result with icon and status prefix', async () => {
    const el = await fixture<AuiOutput>(html`<aui-output value="SGVsbG8="></aui-output>`);
    expect(text(el).textContent).to.equal('SGVsbG8=');
    expect(base(el).classList.contains('output--empty')).to.be.false;
    expect(base(el).classList.contains('output--error')).to.be.false;
    expect(icon(el)).to.exist;
    expect(icon(el)!.getAttribute('aria-hidden')).to.equal('true');
    expect(srPrefix(el)).to.equal('成功：');
  });

  it('renders an error result with a distinct icon and prefix', async () => {
    const el = await fixture<AuiOutput>(html`<aui-output value="ok"></aui-output>`);
    const successIcon = icon(el)!.innerHTML;

    el.status = 'error';
    el.value = 'Unexpected token } in JSON at position 12';
    await el.updateComplete;
    expect(el.getAttribute('status')).to.equal('error');
    expect(base(el).classList.contains('output--error')).to.be.true;
    expect(srPrefix(el)).to.equal('錯誤：');
    expect(icon(el)!.innerHTML, 'error icon differs from success icon').to.not.equal(successIcon);
  });

  it('renders a warning result with its own icon and prefix', async () => {
    const el = await fixture<AuiOutput>(html`<aui-output value="ok"></aui-output>`);
    const successIcon = icon(el)!.innerHTML;

    el.status = 'warning';
    await el.updateComplete;
    expect(base(el).classList.contains('output--warning')).to.be.true;
    expect(base(el).classList.contains('output--error')).to.be.false;
    expect(srPrefix(el)).to.equal('警告：');
    const warningIcon = icon(el)!.innerHTML;
    expect(warningIcon).to.not.equal(successIcon);

    el.status = 'error';
    await el.updateComplete;
    expect(base(el).classList.contains('output--warning')).to.be.false;
    expect(icon(el)!.innerHTML).to.not.equal(warningIcon);
  });

  it('does not apply the error style while empty', async () => {
    const el = await fixture<AuiOutput>(
      html`<aui-output status="error" placeholder="Nothing yet"></aui-output>`,
    );
    expect(base(el).classList.contains('output--error')).to.be.false;
    expect(base(el).classList.contains('output--empty')).to.be.true;
  });

  it('falls back to success for an unknown status', async () => {
    const el = await fixture<AuiOutput>(
      html`<aui-output status=${'pending'} value="text"></aui-output>`,
    );
    expect(srPrefix(el)).to.equal('成功：');
    expect(base(el).classList.contains('output--error')).to.be.false;
  });

  it('keeps a stable status live region across status changes', async () => {
    const el = await fixture<AuiOutput>(html`<aui-output value="ok"></aui-output>`);
    const region = base(el);
    expect(region.getAttribute('role')).to.equal('status');

    el.status = 'error';
    await el.updateComplete;
    expect(base(el), 'same element, so the live region keeps announcing').to.equal(region);
    expect(region.getAttribute('role')).to.equal('status');
  });

  it('preserves line breaks and whitespace', async () => {
    const value = '{\n  "id": 1\n}';
    const el = await fixture<AuiOutput>(html`<aui-output .value=${value}></aui-output>`);
    expect(text(el).textContent).to.equal(value);
    expect(getComputedStyle(text(el)).whiteSpace).to.equal('pre-wrap');
    expect(text(el).getClientRects().length).to.equal(1);
    expect(text(el).getBoundingClientRect().height).to.be.greaterThan(
      parseFloat(getComputedStyle(text(el)).lineHeight) * 2.5,
    );
  });

  it('wraps long unbroken text without horizontal overflow', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="width: 240px;">
        <aui-output .value=${'a'.repeat(400)}></aui-output>
        <aui-output .value=${'https://example.com/' + 'segment/'.repeat(40)}></aui-output>
      </div>
    `);
    for (const el of wrapper.querySelectorAll<AuiOutput>('aui-output')) {
      const region = base(el);
      expect(region.scrollWidth, 'no horizontal overflow').to.be.at.most(region.clientWidth);
      expect(el.getBoundingClientRect().width).to.be.at.most(240);
      expect(text(el).getBoundingClientRect().height).to.be.greaterThan(
        parseFloat(getComputedStyle(text(el)).lineHeight) * 2,
      );
    }
  });

  it('uses the monospace font', async () => {
    const el = await fixture<AuiOutput>(html`<aui-output value="mono"></aui-output>`);
    expect(getComputedStyle(text(el)).fontFamily).to.contain('monospace');
  });

  it('renders label and description only for assistive technology', async () => {
    const el = await fixture<AuiOutput>(
      html`<aui-output value="x" label="Result" description="Base64 encoded"></aui-output>`,
    );
    expect(base(el).getAttribute('aria-label')).to.equal('Result');
    const description = el.shadowRoot!.getElementById(base(el).getAttribute('aria-describedby')!)!;
    expect(description.textContent).to.equal('Base64 encoded');
    expect(description.getBoundingClientRect().width).to.be.at.most(1);

    el.label = '';
    el.description = '';
    await el.updateComplete;
    expect(base(el).hasAttribute('aria-label')).to.be.false;
    expect(base(el).hasAttribute('aria-describedby')).to.be.false;
  });
});
