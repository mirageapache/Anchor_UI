import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import './index.js';
import type { AuiSegmented } from './segmented.js';
import type { SegmentedOption } from './segmented.types.js';

const MODES: SegmentedOption[] = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
  { value: 'auto', label: 'Auto' },
];

const buttons = (el: AuiSegmented) => [
  ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option'),
];

const focused = (el: AuiSegmented) => el.shadowRoot!.activeElement;

/** 記錄 host 上的 input / change 事件與觸發當下的 value */
function recordEvents(el: AuiSegmented): string[] {
  const events: string[] = [];
  el.addEventListener('input', () => events.push(`input:${el.value}`));
  el.addEventListener('change', () => events.push(`change:${el.value}`));
  return events;
}

describe('AuiSegmented (<aui-segmented>)', () => {
  describe('rendering', () => {
    it('renders one radio per option inside a radiogroup', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="decode"></aui-segmented>`,
      );
      const group = el.shadowRoot!.querySelector('[part="base"]')!;
      expect(group.getAttribute('role')).to.equal('radiogroup');
      expect(buttons(el).map((b) => b.textContent!.trim())).to.deep.equal([
        'Encode',
        'Decode',
        'Auto',
      ]);
      expect(buttons(el).map((b) => b.getAttribute('role'))).to.deep.equal([
        'radio',
        'radio',
        'radio',
      ]);
      expect(buttons(el).map((b) => b.getAttribute('aria-checked'))).to.deep.equal([
        'false',
        'true',
        'false',
      ]);
      expect(buttons(el)[1].getAttribute('part')).to.equal('option option-checked');
    });

    it('accepts options as a JSON attribute', async () => {
      const el = await fixture<AuiSegmented>(html`
        <aui-segmented
          options='[{"value":"a","label":"A"},{"value":"b","label":"B","disabled":true}]'
        ></aui-segmented>
      `);
      expect(el.options).to.have.length(2);
      expect(buttons(el)[1].disabled).to.be.true;
      expect(buttons(el)[1].getAttribute('part')).to.equal('option option-disabled');
    });

    it('keeps the track width stable when the selection changes', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      const width = () => el.getBoundingClientRect().width;
      const before = width();
      el.value = 'auto';
      await el.updateComplete;
      expect(width()).to.equal(before);
    });

    it('highlights the checked option with the brand color', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      const [checked, unchecked] = buttons(el);
      expect(getComputedStyle(checked).backgroundColor).to.not.equal(
        getComputedStyle(unchecked).backgroundColor,
      );
      expect(getComputedStyle(checked).fontWeight).to.equal('600');
    });
  });

  describe('value and defaultValue', () => {
    it('uses the value attribute as the default and follows it until changed', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      expect(el.value).to.equal('encode');
      el.setAttribute('value', 'decode');
      await el.updateComplete;
      expect(el.value).to.equal('decode');

      el.value = 'auto';
      el.setAttribute('value', 'encode');
      await el.updateComplete;
      expect(el.value).to.equal('auto');
    });

    it('selects nothing when the value matches no option', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="unknown"></aui-segmented>`,
      );
      expect(el.value).to.equal('unknown');
      expect(buttons(el).every((b) => b.getAttribute('aria-checked') === 'false')).to.be.true;
    });

    it('selects the option once it appears in options', async () => {
      const el = await fixture<AuiSegmented>(html`<aui-segmented value="b"></aui-segmented>`);
      el.options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      await el.updateComplete;
      expect(buttons(el)[1].getAttribute('aria-checked')).to.equal('true');
    });
  });

  describe('mouse selection and events', () => {
    it('selects on click and dispatches input then change with the value updated', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      const events = recordEvents(el);
      buttons(el)[2].click();
      expect(el.value).to.equal('auto');
      expect(events).to.deep.equal(['input:auto', 'change:auto']);
      expect(focused(el)).to.equal(buttons(el)[2]);
    });

    it('dispatches input as composed and change as bubbling', async () => {
      const wrapper = await fixture<HTMLDivElement>(
        html`<div><aui-segmented .options=${MODES}></aui-segmented></div>`,
      );
      const el = wrapper.querySelector<AuiSegmented>('aui-segmented')!;
      const seen: Event[] = [];
      wrapper.addEventListener('input', (event) => seen.push(event));
      wrapper.addEventListener('change', (event) => seen.push(event));
      buttons(el)[0].click();
      expect(seen.map((event) => event.type)).to.deep.equal(['input', 'change']);
      expect(seen[0].composed).to.be.true;
      expect(seen.every((event) => event.target === el)).to.be.true;
    });

    it('does not dispatch when clicking the already selected option', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      const events = recordEvents(el);
      buttons(el)[0].click();
      expect(events).to.deep.equal([]);
    });

    it('does not dispatch events for programmatic value changes', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES}></aui-segmented>`,
      );
      const events = recordEvents(el);
      el.value = 'decode';
      await el.updateComplete;
      expect(events).to.deep.equal([]);
    });

    it('ignores disabled options and a disabled control', async () => {
      const options = [...MODES.slice(0, 2), { value: 'off', label: 'Off', disabled: true }];
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${options} value="encode"></aui-segmented>`,
      );
      const events = recordEvents(el);
      buttons(el)[2].click();
      expect(el.value).to.equal('encode');

      el.disabled = true;
      await el.updateComplete;
      expect(buttons(el).every((b) => b.disabled)).to.be.true;
      buttons(el)[1].click();
      expect(el.value).to.equal('encode');
      expect(events).to.deep.equal([]);
    });
  });

  describe('keyboard (radiogroup with roving tabindex)', () => {
    it('keeps a single tab stop on the selected option', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="decode"></aui-segmented>`,
      );
      expect(buttons(el).map((b) => b.tabIndex)).to.deep.equal([-1, 0, -1]);
    });

    it('puts the tab stop on the first enabled option when nothing is selected', async () => {
      const options = [{ value: 'x', label: 'X', disabled: true }, ...MODES];
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${options}></aui-segmented>`,
      );
      expect(buttons(el).map((b) => b.tabIndex)).to.deep.equal([-1, 0, -1, -1]);
    });

    it('Tab enters on the selected option and leaves the group on the next Tab', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">before</button>
          <aui-segmented .options=${MODES} value="auto"></aui-segmented>
          <button id="after">after</button>
        </div>
      `);
      const el = wrapper.querySelector<AuiSegmented>('aui-segmented')!;
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(focused(el)).to.equal(buttons(el)[2]);
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(wrapper.querySelector('#after'));
    });

    it('moves and selects with arrow keys, wrapping around', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      const events = recordEvents(el);
      el.focus();

      await sendKeys({ press: 'ArrowRight' });
      expect(el.value).to.equal('decode');
      expect(focused(el)).to.equal(buttons(el)[1]);

      await sendKeys({ press: 'ArrowDown' });
      expect(el.value).to.equal('auto');

      await sendKeys({ press: 'ArrowRight' });
      expect(el.value, 'wraps to the first option').to.equal('encode');

      await sendKeys({ press: 'ArrowLeft' });
      expect(el.value, 'wraps to the last option').to.equal('auto');

      await sendKeys({ press: 'ArrowUp' });
      expect(el.value).to.equal('decode');
      expect(events.filter((e) => e.startsWith('change'))).to.have.length(5);
    });

    it('jumps with Home and End', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="decode"></aui-segmented>`,
      );
      el.focus();
      await sendKeys({ press: 'End' });
      expect(el.value).to.equal('auto');
      expect(focused(el)).to.equal(buttons(el)[2]);
      await sendKeys({ press: 'Home' });
      expect(el.value).to.equal('encode');
      expect(focused(el)).to.equal(buttons(el)[0]);
    });

    it('skips disabled options while navigating', async () => {
      const options = [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C', disabled: true },
        { value: 'd', label: 'D' },
        { value: 'e', label: 'E', disabled: true },
      ];
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${options} value="b"></aui-segmented>`,
      );
      el.focus();
      await sendKeys({ press: 'ArrowRight' });
      expect(el.value).to.equal('d');
      await sendKeys({ press: 'ArrowRight' });
      expect(el.value, 'wraps past disabled options').to.equal('b');
      await sendKeys({ press: 'End' });
      expect(el.value).to.equal('d');
      await sendKeys({ press: 'Home' });
      expect(el.value).to.equal('b');
    });

    it('swaps left and right in RTL', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented dir="rtl" .options=${MODES} value="decode"></aui-segmented>`,
      );
      el.focus();
      await sendKeys({ press: 'ArrowLeft' });
      expect(el.value).to.equal('auto');
      await sendKeys({ press: 'ArrowRight' });
      expect(el.value).to.equal('decode');
    });

    it('selects the focused option with Space', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES}></aui-segmented>`,
      );
      const events = recordEvents(el);
      el.focus();
      expect(focused(el)).to.equal(buttons(el)[0]);
      await sendKeys({ press: 'Space' });
      expect(el.value).to.equal('encode');
      expect(events).to.deep.equal(['input:encode', 'change:encode']);
    });

    it('ignores unrelated keys', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="encode"></aui-segmented>`,
      );
      el.focus();
      await sendKeys({ press: 'a' });
      expect(el.value).to.equal('encode');
    });
  });

  describe('form participation (ElementInternals)', () => {
    it('submits the selected value and nothing when unselected', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-segmented name="mode" .options=${MODES}></aui-segmented></form>
      `);
      const el = form.querySelector<AuiSegmented>('aui-segmented')!;
      expect(el.form).to.equal(form);
      expect(new FormData(form).has('mode')).to.be.false;

      buttons(el)[1].click();
      expect(new FormData(form).get('mode')).to.equal('decode');
    });

    it('updates the form value before input / change listeners run', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-segmented name="mode" .options=${MODES}></aui-segmented></form>
      `);
      const el = form.querySelector<AuiSegmented>('aui-segmented')!;
      const snapshots: Array<FormDataEntryValue | null> = [];
      el.addEventListener('change', () => snapshots.push(new FormData(form).get('mode')));
      buttons(el)[2].click();
      expect(snapshots).to.deep.equal(['auto']);
    });

    it('blocks submission while required and unselected', async () => {
      let submitted = 0;
      const form = await fixture<HTMLFormElement>(html`
        <form
          @submit=${(event: Event) => {
            event.preventDefault();
            submitted++;
          }}
        >
          <aui-segmented name="mode" .options=${MODES} required></aui-segmented>
        </form>
      `);
      const el = form.querySelector<AuiSegmented>('aui-segmented')!;
      expect(el.willValidate).to.be.true;
      expect(el.checkValidity()).to.be.false;
      expect(el.validity?.valueMissing).to.be.true;
      expect(el.validationMessage).to.not.equal('');

      form.requestSubmit();
      expect(submitted).to.equal(0);

      buttons(el)[0].click();
      expect(el.checkValidity()).to.be.true;
      form.requestSubmit();
      expect(submitted).to.equal(1);
    });

    it('supports setCustomValidity()', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} value="auto"></aui-segmented>`,
      );
      el.setCustomValidity('此模式暫不開放');
      expect(el.checkValidity()).to.be.false;
      expect(el.validity?.customError).to.be.true;
      expect(el.validationMessage).to.equal('此模式暫不開放');
      el.setCustomValidity('');
      expect(el.checkValidity()).to.be.true;
    });

    it('restores the default value on form.reset()', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-segmented name="mode" .options=${MODES} value="encode"></aui-segmented></form>
      `);
      const el = form.querySelector<AuiSegmented>('aui-segmented')!;
      buttons(el)[2].click();
      expect(el.value).to.equal('auto');

      form.reset();
      await el.updateComplete;
      expect(el.value).to.equal('encode');
      expect(buttons(el)[0].getAttribute('aria-checked')).to.equal('true');
      expect(new FormData(form).get('mode')).to.equal('encode');
    });

    it('is disabled by a disabled fieldset and excluded from submission', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <fieldset>
            <aui-segmented name="mode" .options=${MODES} value="encode" required></aui-segmented>
          </fieldset>
        </form>
      `);
      const fieldset = form.querySelector('fieldset')!;
      const el = form.querySelector<AuiSegmented>('aui-segmented')!;

      fieldset.disabled = true;
      await el.updateComplete;
      expect(buttons(el).every((b) => b.disabled)).to.be.true;
      expect(el.disabled).to.be.false;
      expect(new FormData(form).has('mode')).to.be.false;

      fieldset.disabled = false;
      await el.updateComplete;
      expect(buttons(el).some((b) => b.disabled)).to.be.false;
      expect(new FormData(form).get('mode')).to.equal('encode');
    });

    it('restores a string state via formStateRestoreCallback', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES}></aui-segmented>`,
      );
      el.formStateRestoreCallback('decode');
      el.formStateRestoreCallback(null);
      expect(el.value).to.equal('decode');
    });
  });

  describe('fallback without ElementInternals (e.g. happy-dom)', () => {
    const proto = HTMLElement.prototype as { attachInternals?: unknown };
    let original: unknown;

    beforeEach(() => {
      original = proto.attachInternals;
      proto.attachInternals = undefined;
    });

    afterEach(() => {
      proto.attachInternals = original;
    });

    it('submits through a hidden input, follows selection and resets', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-segmented name="mode" .options=${MODES} value="encode"></aui-segmented></form>
      `);
      const el = form.querySelector<AuiSegmented>('aui-segmented')!;
      expect(new FormData(form).get('mode')).to.equal('encode');

      buttons(el)[1].click();
      await el.updateComplete;
      expect(new FormData(form).get('mode')).to.equal('decode');

      form.reset();
      await el.updateComplete;
      expect(el.value).to.equal('encode');
      expect(new FormData(form).get('mode')).to.equal('encode');

      el.value = '';
      await el.updateComplete;
      expect(el.querySelector('input[type="hidden"]')).to.be.null;
    });

    it('reports validity without ElementInternals', async () => {
      const el = await fixture<AuiSegmented>(
        html`<aui-segmented .options=${MODES} required></aui-segmented>`,
      );
      expect(el.validity).to.be.undefined;
      expect(el.willValidate).to.be.true;
      expect(el.checkValidity()).to.be.false;
      expect(el.reportValidity()).to.be.false;
      expect(el.validationMessage).to.not.equal('');

      el.value = 'auto';
      expect(el.checkValidity()).to.be.true;

      el.disabled = true;
      await el.updateComplete;
      expect(el.willValidate).to.be.false;
    });
  });
});
