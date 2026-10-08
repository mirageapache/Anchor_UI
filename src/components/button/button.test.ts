import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
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
    expect(innerBtn?.getAttribute('aria-disabled')).to.equal('true');

    const spinner = el.shadowRoot?.querySelector('.btn__spinner');
    expect(spinner).to.exist;

    el.click();
    innerBtn?.click();
    expect(clicked).to.be.false;
  });

  it('keeps keyboard focus on the button while loading', async () => {
    const el = await fixture<AuiButton>(html`<aui-button>Save</aui-button>`);
    const innerBtn = el.shadowRoot!.querySelector('button')!;
    el.focus();
    expect(el.shadowRoot!.activeElement).to.equal(innerBtn);

    // 進入 loading 時若把原生 button 設為 disabled，焦點會掉回 body
    el.loading = true;
    await el.updateComplete;
    expect(innerBtn.hasAttribute('disabled')).to.be.false;
    expect(el.shadowRoot!.activeElement).to.equal(innerBtn);
    expect(document.activeElement).to.equal(el);

    // 鍵盤在 loading 期間仍無法觸發
    let clicked = false;
    el.addEventListener('click', () => {
      clicked = true;
    });
    await sendKeys({ press: 'Enter' });
    expect(clicked).to.be.false;

    el.loading = false;
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).to.equal(innerBtn);
  });

  it('does not submit the form while loading', async () => {
    let formSubmitted = false;
    const form = await fixture<HTMLFormElement>(html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();
          formSubmitted = true;
        }}
      >
        <aui-button type="submit" loading>Submit</aui-button>
      </form>
    `);
    form.querySelector<AuiButton>('aui-button')!.click();
    expect(formSubmitted).to.be.false;
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

  describe('design tokens', () => {
    // 本測試檔未載入 tokens.css，可驗證每個 var() 都有字面 fallback
    it('renders every variant from literal fallbacks when tokens are not loaded', async () => {
      const expected = {
        primary: { bg: 'rgb(15, 76, 129)', color: 'rgb(255, 255, 255)' },
        accent: { bg: 'rgb(245, 158, 11)', color: 'rgb(15, 23, 42)' },
        ghost: { bg: 'rgba(0, 0, 0, 0)', color: 'rgb(71, 85, 105)' },
        danger: { bg: 'rgb(220, 38, 38)', color: 'rgb(255, 255, 255)' },
        success: { bg: 'rgb(4, 120, 87)', color: 'rgb(255, 255, 255)' },
      } as const;
      for (const [variant, colors] of Object.entries(expected)) {
        const el = await fixture<AuiButton>(
          html`<aui-button .variant=${variant as AuiButton['variant']}>${variant}</aui-button>`,
        );
        const style = getComputedStyle(el.shadowRoot!.querySelector('button')!);
        expect(style.backgroundColor, `${variant} background`).to.equal(colors.bg);
        expect(style.color, `${variant} text`).to.equal(colors.color);
      }

      const ghost = await fixture<AuiButton>(html`<aui-button variant="ghost">Ghost</aui-button>`);
      const ghostStyle = getComputedStyle(ghost.shadowRoot!.querySelector('button')!);
      expect(ghostStyle.borderTopColor).to.equal('rgb(203, 213, 225)');
    });

    it('takes on-color text from tokens instead of hardcoded values', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="--color-on-solid: rgb(1, 2, 3); --color-on-accent: rgb(4, 5, 6);">
          <aui-button variant="primary">Primary</aui-button>
          <aui-button variant="danger">Danger</aui-button>
          <aui-button variant="success">Success</aui-button>
          <aui-button variant="accent">Accent</aui-button>
        </div>
      `);
      const colors = [...wrapper.querySelectorAll<AuiButton>('aui-button')].map(
        (el) => getComputedStyle(el.shadowRoot!.querySelector('button')!).color,
      );
      expect(colors).to.deep.equal([
        'rgb(1, 2, 3)',
        'rgb(1, 2, 3)',
        'rgb(1, 2, 3)',
        'rgb(4, 5, 6)',
      ]);
    });

    it('derives the variant shadow from the variant color token', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="--color-brand-600: rgb(0, 0, 255);">
          <aui-button variant="primary">Primary</aui-button>
        </div>
      `);
      const btn = wrapper.querySelector<AuiButton>('aui-button')!;
      const shadow = getComputedStyle(btn.shadowRoot!.querySelector('button')!).boxShadow;

      // 以相同 color-mix 算式的探針元素取得瀏覽器序列化後的預期色值
      const probe = document.createElement('span');
      probe.style.color = 'color-mix(in srgb, rgb(0, 0, 255) 20%, transparent)';
      wrapper.appendChild(probe);
      const expectedColor = getComputedStyle(probe).color;
      expect(shadow).to.contain(expectedColor);
    });
  });

  it('is form-associated and exposes its form owner', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><aui-button type="submit">Submit</aui-button></form>
    `);
    const btn = form.querySelector('aui-button') as AuiButton;
    expect(btn.form).to.equal(form);
  });

  it('submits the form referenced by the form attribute (outside the form)', async () => {
    let submitted = false;
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <form
          id="remote-form"
          @submit=${(e: Event) => {
            e.preventDefault();
            submitted = true;
          }}
        ></form>
        <aui-button type="submit" form="remote-form">Submit</aui-button>
      </div>
    `);
    const btn = wrapper.querySelector('aui-button') as AuiButton;
    expect(btn.form).to.equal(wrapper.querySelector('form'));
    btn.click();
    expect(submitted).to.be.true;
  });

  it('falls back to DOM lookup where ElementInternals is unavailable (e.g. happy-dom)', async () => {
    const proto = HTMLElement.prototype as { attachInternals?: unknown };
    const original = proto.attachInternals;
    proto.attachInternals = undefined;
    try {
      let submitted = 0;
      const wrapper = await fixture<HTMLDivElement>(html`
        <div
          @submit=${(e: Event) => {
            e.preventDefault();
            submitted++;
          }}
        >
          <form><aui-button type="submit">Inside</aui-button></form>
          <form id="fallback-remote-form"></form>
          <aui-button type="submit" form="fallback-remote-form">Outside</aui-button>
        </div>
      `);
      const [inside, outside] = [...wrapper.querySelectorAll<AuiButton>('aui-button')];
      const forms = wrapper.querySelectorAll('form');
      expect(inside.form).to.equal(forms[0]);
      expect(outside.form).to.equal(forms[1]);

      inside.click();
      outside.click();
      expect(submitted).to.equal(2);
    } finally {
      proto.attachInternals = original;
    }
  });

  it('respects the form validity when submitting (requestSubmit semantics)', async () => {
    let submitted = false;
    const form = await fixture<HTMLFormElement>(html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();
          submitted = true;
        }}
      >
        <input name="email" required />
        <aui-button type="submit">Submit</aui-button>
      </form>
    `);
    form.querySelector<AuiButton>('aui-button')!.click();
    expect(submitted).to.be.false;
  });
});
