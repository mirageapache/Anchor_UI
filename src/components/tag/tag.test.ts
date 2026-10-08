import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
import './index.js';
import { AuiTag } from './tag.js';

describe('AuiTag (<aui-tag>)', () => {
  it('renders with default attributes and base structure', async () => {
    const el = await fixture<AuiTag>(html`<aui-tag>typescript</aui-tag>`);
    expect(el).to.exist;
    expect(el.variant).to.equal('neutral');
    expect(el.size).to.equal('sm');
    expect(el.pill).to.be.false;
    expect(el.preserveCase).to.be.false;
    expect(el.removable).to.be.false;
    expect(el.interactive).to.be.false;

    const base = el.shadowRoot?.querySelector('.tag');
    expect(base).to.exist;
    expect(base?.classList.contains('tag--neutral')).to.be.true;
    expect(base?.classList.contains('tag--sm')).to.be.true;
  });

  it('reflects variant, size, pill and preserve-case attributes', async () => {
    const el = await fixture<AuiTag>(
      html`<aui-tag variant="brand" size="lg" pill preserve-case>v1.0.0</aui-tag>`,
    );
    expect(el.getAttribute('variant')).to.equal('brand');
    expect(el.getAttribute('size')).to.equal('lg');
    expect(el.hasAttribute('pill')).to.be.true;
    expect(el.hasAttribute('preserve-case')).to.be.true;

    const base = el.shadowRoot?.querySelector('.tag');
    expect(base?.classList.contains('tag--brand')).to.be.true;
    expect(base?.classList.contains('tag--lg')).to.be.true;
    expect(base?.classList.contains('tag--pill')).to.be.true;
    expect(base?.classList.contains('tag--preserve-case')).to.be.true;
  });

  it('supports prefix and suffix slots', async () => {
    const el = await fixture<AuiTag>(html`
      <aui-tag>
        <span slot="prefix">●</span>
        active
        <span slot="suffix">↗</span>
      </aui-tag>
    `);

    const prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]');
    const suffixSlot = el.shadowRoot?.querySelector('slot[name="suffix"]');
    expect(prefixSlot).to.exist;
    expect(suffixSlot).to.exist;
  });

  it('manages interactive accessibility attributes and keyboard activation', async () => {
    const el = await fixture<AuiTag>(html`<aui-tag interactive>Filter Tag</aui-tag>`);
    const action = el.shadowRoot!.querySelector<HTMLElement>('.tag__action')!;
    // 互動語意位於 shadow 內的 action 元素，host 本身不帶 role / tabindex
    expect(action.getAttribute('role')).to.equal('button');
    expect(action.getAttribute('tabindex')).to.equal('0');
    expect(el.hasAttribute('role')).to.be.false;
    expect(el.hasAttribute('tabindex')).to.be.false;

    const base = el.shadowRoot?.querySelector('.tag');
    expect(base?.classList.contains('tag--interactive')).to.be.true;

    let clicked = false;
    el.addEventListener('click', () => {
      clicked = true;
    });

    // Enter key triggers click
    action.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }),
    );
    expect(clicked).to.be.true;

    clicked = false;
    // Space key triggers click
    action.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }));
    expect(clicked).to.be.true;

    // Disabling interactive removes role and tabindex
    el.interactive = false;
    await el.updateComplete;
    expect(action.hasAttribute('role')).to.be.false;
    expect(action.hasAttribute('tabindex')).to.be.false;
    expect(base?.classList.contains('tag--interactive')).to.be.false;
  });

  it('renders remove button with default label and fires aui-remove event when clicked', async () => {
    const el = await fixture<AuiTag>(html`<aui-tag removable>Removable</aui-tag>`);
    const removeBtn = el.shadowRoot?.querySelector<HTMLButtonElement>('.tag__remove');
    expect(removeBtn).to.exist;
    expect(removeBtn?.getAttribute('aria-label')).to.equal('Remove tag');
    expect(removeBtn?.getAttribute('title')).to.equal('Remove tag');

    const base = el.shadowRoot?.querySelector('.tag');
    expect(base?.classList.contains('tag--removable')).to.be.true;

    setTimeout(() => removeBtn?.click());
    const ev = (await oneEvent(el, 'aui-remove')) as CustomEvent<{ tag: AuiTag }>;
    expect(ev).to.exist;
    expect(ev.detail.tag).to.equal(el);
  });

  it('supports custom remove-label attribute', async () => {
    const el = await fixture<AuiTag>(
      html`<aui-tag removable remove-label="Delete item">Removable</aui-tag>`,
    );
    const removeBtn = el.shadowRoot?.querySelector<HTMLButtonElement>('.tag__remove');
    expect(removeBtn?.getAttribute('aria-label')).to.equal('Delete item');
    expect(removeBtn?.getAttribute('title')).to.equal('Delete item');
  });

  describe('interactive hover feedback', () => {
    it('does not rely on :host-context() (unsupported in Firefox / Safari)', () => {
      const cssText = [AuiTag.styles]
        .flat()
        .map((style) => String(style))
        .join(' ')
        .replace(/\/\*[\s\S]*?\*\//g, ''); // 忽略註解中的說明文字
      expect(cssText.includes(':host-context'), 'styles use :host-context()').to.be.false;
    });

    for (const theme of ['light', 'dark'] as const) {
      it(`tints the tag toward its text color on hover (${theme})`, async () => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          const el = await fixture<AuiTag>(html`<aui-tag interactive>filter</aui-tag>`);
          const base = el.shadowRoot!.querySelector<HTMLElement>('.tag')!;
          expect(getComputedStyle(base).backgroundImage).to.equal('none');

          const rect = base.getBoundingClientRect();
          await sendMouse({
            type: 'move',
            position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
          });
          const hover = getComputedStyle(base);
          // 以文字色（currentColor）疊色：淺色主題變深、深色主題變亮，不需要依主題切換的 filter
          expect(hover.backgroundImage).to.contain('linear-gradient');
          expect(hover.filter).to.equal('none');
        } finally {
          await resetMouse();
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  });
});
