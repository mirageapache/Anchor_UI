import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import type { AuiButton } from './button.js';

describe('AuiButton (<aui-button>)', () => {
  it('renders with default attributes and shadow DOM structure', async () => {
    const el = await fixture<AuiButton>(html`<aui-button>Click Me</aui-button>`);
    expect(el).to.exist;
    expect(el.variant).to.equal('primary');
    expect(el.size).to.equal('md');
    expect(el.type).to.equal('button');
    expect(el.disabled).to.be.false;
    expect(el.loading).to.be.false;
    expect(el.fullWidth).to.be.false;

    const innerBtn = el.shadowRoot?.querySelector('button');
    expect(innerBtn).to.exist;
    expect(innerBtn?.getAttribute('part')).to.equal('button');
    expect(innerBtn?.classList.contains('btn--primary')).to.be.true;
    expect(innerBtn?.classList.contains('btn--md')).to.be.true;
    expect(innerBtn?.getAttribute('aria-disabled')).to.equal('false');
    expect(innerBtn?.getAttribute('aria-busy')).to.equal('false');
  });

  it('reflects variant and size property changes to attribute and classes', async () => {
    const el = await fixture<AuiButton>(
      html`<aui-button variant="danger" size="lg">Delete</aui-button>`,
    );
    expect(el.getAttribute('variant')).to.equal('danger');
    expect(el.getAttribute('size')).to.equal('lg');

    const innerBtn = el.shadowRoot?.querySelector('button');
    expect(innerBtn?.classList.contains('btn--danger')).to.be.true;
    expect(innerBtn?.classList.contains('btn--lg')).to.be.true;

    el.variant = 'ghost';
    el.size = 'sm';
    await el.updateComplete;

    expect(el.getAttribute('variant')).to.equal('ghost');
    expect(el.getAttribute('size')).to.equal('sm');
    expect(innerBtn?.classList.contains('btn--ghost')).to.be.true;
    expect(innerBtn?.classList.contains('btn--sm')).to.be.true;
  });

  it('reflects full-width property to host attribute', async () => {
    const el = await fixture<AuiButton>(html`<aui-button full-width>Full Width</aui-button>`);
    expect(el.hasAttribute('full-width')).to.be.true;
    expect(el.fullWidth).to.be.true;

    el.fullWidth = false;
    await el.updateComplete;
    expect(el.hasAttribute('full-width')).to.be.false;
  });

  it('handles click events under normal active state', async () => {
    const el = await fixture<AuiButton>(html`<aui-button>Submit</aui-button>`);
    let clicked = false;
    el.addEventListener('click', () => {
      clicked = true;
    });

    el.click();
    expect(clicked).to.be.true;
  });

  it('blocks click events when disabled', async () => {
    const el = await fixture<AuiButton>(html`<aui-button disabled>Disabled</aui-button>`);
    let clicked = false;
    el.addEventListener('click', () => {
      clicked = true;
    });

    const innerBtn = el.shadowRoot?.querySelector('button');
    expect(innerBtn?.hasAttribute('disabled')).to.be.true;
    expect(innerBtn?.getAttribute('aria-disabled')).to.equal('true');

    el.click();
    expect(clicked).to.be.false;
  });

  it('renders spinner and blocks click events when loading', async () => {
    const el = await fixture<AuiButton>(html`<aui-button loading>Loading...</aui-button>`);
    let clicked = false;
    el.addEventListener('click', () => {
      clicked = true;
    });

    const innerBtn = el.shadowRoot?.querySelector('button');
    expect(innerBtn?.getAttribute('aria-busy')).to.equal('true');
    expect(innerBtn?.hasAttribute('disabled')).to.be.true;

    const spinner = el.shadowRoot?.querySelector('.btn__spinner');
    expect(spinner).to.exist;

    el.click();
    expect(clicked).to.be.false;
  });

  it('supports prefix and suffix slots', async () => {
    const el = await fixture<AuiButton>(html`
      <aui-button>
        <span slot="prefix" id="test-prefix">★</span>
        Action
        <span slot="suffix" id="test-suffix">→</span>
      </aui-button>
    `);

    const prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]');
    const suffixSlot = el.shadowRoot?.querySelector('slot[name="suffix"]');
    expect(prefixSlot).to.exist;
    expect(suffixSlot).to.exist;
  });

  it('delegates focus and blur correctly', async () => {
    const el = await fixture<AuiButton>(html`<aui-button>Focusable</aui-button>`);
    const innerBtn = el.shadowRoot?.querySelector('button');

    el.focus();
    expect(el.shadowRoot?.activeElement).to.equal(innerBtn);

    el.blur();
    expect(el.shadowRoot?.activeElement).to.be.null;
  });

  it('submits surrounding form when type is submit', async () => {
    let formSubmitted = false;
    const form = await fixture<HTMLFormElement>(html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();
          formSubmitted = true;
        }}
      >
        <aui-button type="submit">Submit Form</aui-button>
      </form>
    `);

    const btn = form.querySelector('aui-button') as AuiButton;
    btn.click();
    expect(formSubmitted).to.be.true;
  });

  it('resets surrounding form when type is reset', async () => {
    let formReset = false;
    const form = await fixture<HTMLFormElement>(html`
      <form
        @reset=${() => {
          formReset = true;
        }}
      >
        <input name="test" value="original" />
        <aui-button type="reset">Reset Form</aui-button>
      </form>
    `);

    const btn = form.querySelector('aui-button') as AuiButton;
    btn.click();
    expect(formReset).to.be.true;
  });
});
