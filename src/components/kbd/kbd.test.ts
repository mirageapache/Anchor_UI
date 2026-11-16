import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import type { AuiKbd } from './kbd.js';

const base = (el: AuiKbd) => el.shadowRoot!.querySelector<HTMLElement>('kbd')!;

describe('AuiKbd (<aui-kbd>)', () => {
  it('renders the key inside a native <kbd> with the default size', async () => {
    const el = await fixture<AuiKbd>(html`<aui-kbd>Enter</aui-kbd>`);
    expect(el.size).to.equal('md');
    expect(el.getAttribute('size')).to.equal('md');
    expect(base(el).tagName).to.equal('KBD');
    expect(base(el).classList.contains('kbd--md')).to.be.true;

    const slot = base(el).querySelector('slot')!;
    expect(
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .join(''),
    ).to.equal('Enter');
  });

  it('uses the monospace font and a thicker bottom border for the keycap look', async () => {
    const el = await fixture<AuiKbd>(html`<aui-kbd>K</aui-kbd>`);
    const style = getComputedStyle(base(el));
    expect(style.fontFamily).to.contain('JetBrains Mono');
    expect(style.borderTopWidth).to.equal('1px');
    expect(style.borderBottomWidth).to.equal('2px');
    expect(style.borderTopStyle).to.equal('solid');
  });

  it('does not add stray whitespace around the key', async () => {
    // 內嵌在文字中使用，範本的縮排不可變成鍵帽內外的空白
    const el = await fixture<AuiKbd>(html`<aui-kbd>K</aui-kbd>`);
    expect(base(el).textContent).to.equal('');
    expect(el.shadowRoot!.textContent).to.equal('');
  });

  it('keeps showing the symbol when label is set and adds no attributes to the host', async () => {
    const el = await fixture<AuiKbd>(html`<aui-kbd label="Command">⌘</aui-kbd>`);
    const plain = await fixture<AuiKbd>(html`<aui-kbd>⌘</aui-kbd>`);
    // 畫面不變：鍵帽大小與沒有 label 時相同，Shadow DOM 內也沒有多餘的文字
    expect(base(el).getBoundingClientRect().width).to.equal(
      base(plain).getBoundingClientRect().width,
    );
    expect(el.shadowRoot!.textContent).to.equal('');
    // 語意透過 ElementInternals 提供，不在使用端的標籤上增加屬性
    expect(el.hasAttribute('role')).to.be.false;
    expect(el.hasAttribute('aria-label')).to.be.false;
  });

  it('keeps the host box equal to the keycap regardless of the surrounding font size', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="font-size: 40px; line-height: 1.5">Title <aui-kbd>K</aui-kbd></div>
    `);
    const el = wrapper.querySelector('aui-kbd')!;
    const host = el.getBoundingClientRect();
    const inner = base(el).getBoundingClientRect();
    expect(host.height).to.equal(inner.height);
    expect(host.width).to.equal(inner.width);
  });

  it('copies the visible keys, not the label', async () => {
    const wrapper = await fixture<HTMLParagraphElement>(
      html`<p><aui-kbd label="Command">⌘</aui-kbd> + <aui-kbd>K</aui-kbd></p>`,
    );
    const selection = getSelection()!;
    selection.selectAllChildren(wrapper);
    try {
      expect(selection.toString().replace(/\s+/g, ' ').trim()).to.equal('⌘ + K');
    } finally {
      selection.removeAllRanges();
    }
  });

  it('sits inline in body text without stretching the line (14px × 1.5 = 21px)', async () => {
    // 設計系統的標準內文行高比鍵帽略高一點；含鍵帽的行不可被撐高，否則多行段落的行距會不一致
    for (const size of ['md', 'sm'] as const) {
      const wrapper = await fixture<HTMLParagraphElement>(html`
        <p style="font-size: 14px; line-height: 1.5; margin: 0">
          Press <aui-kbd .size=${size}>Ctrl</aui-kbd> + <aui-kbd .size=${size}>C</aui-kbd> to copy
        </p>
      `);
      expect(wrapper.getBoundingClientRect().height, size).to.equal(21);
      const [ctrl, c] = [...wrapper.querySelectorAll('aui-kbd')];
      expect(ctrl.getBoundingClientRect().top).to.equal(c.getBoundingClientRect().top);
    }
  });

  it('keeps every line of a wrapped paragraph the same height', async () => {
    const wrapper = await fixture<HTMLParagraphElement>(html`
      <p style="font-size: 14px; line-height: 1.5; margin: 0; width: 160px">
        Plain text on the first line then <aui-kbd>Ctrl</aui-kbd> + <aui-kbd>C</aui-kbd> and more
        plain text that wraps onto further lines
      </p>
    `);
    const height = wrapper.getBoundingClientRect().height;
    expect(height / 21, 'a whole number of 21px lines').to.be.closeTo(
      Math.round(height / 21),
      0.001,
    );
    expect(height).to.be.greaterThan(42);
  });
});
