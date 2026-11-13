import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import './index.js';
import type { AuiInput } from './input.js';

/** 取得內部原生控制項 */
const controlOf = (el: AuiInput) =>
  el.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('.control')!;

/** 聚焦輸入框並以鍵盤在既有內容後方輸入文字（真實的使用者輸入路徑） */
async function typeInto(el: AuiInput, text: string): Promise<void> {
  el.focus();
  // delegatesFocus 聚焦時與 Tab 相同會全選內容，先把游標移到結尾以免覆蓋
  // （email 等類型不支援選取範圍，且這些測試中皆為空值，不需處理）
  const control = controlOf(el);
  if (control.value) control.setSelectionRange(control.value.length, control.value.length);
  await sendKeys({ type: text });
  await el.updateComplete;
}

describe('AuiInput (<aui-input>)', () => {
  describe('rendering', () => {
    it('renders a single-line input with default properties', async () => {
      const el = await fixture<AuiInput>(html`<aui-input></aui-input>`);
      expect(el.value).to.equal('');
      expect(el.type).to.equal('text');
      expect(el.multiline).to.be.false;

      const control = controlOf(el);
      expect(control.localName).to.equal('input');
      expect(control.getAttribute('part')).to.equal('control');
      expect(control.type).to.equal('text');
      expect(control.hasAttribute('aria-invalid')).to.be.false;
      expect(getComputedStyle(control).fontFamily).to.contain('monospace');
    });

    it('renders a textarea with the given rows when multiline', async () => {
      const el = await fixture<AuiInput>(
        html`<aui-input multiline rows="5" value=${'line 1\nline 2'}></aui-input>`,
      );
      const control = controlOf(el);
      expect(control.localName).to.equal('textarea');
      expect((control as HTMLTextAreaElement).rows).to.equal(5);
      expect(control.value).to.equal('line 1\nline 2');
      expect(getComputedStyle(control).resize).to.equal('vertical');
    });

    it('passes native constraints and hints to the inner control', async () => {
      const el = await fixture<AuiInput>(html`
        <aui-input
          type="email"
          placeholder="name@example.com"
          minlength="3"
          maxlength="20"
          pattern=".+@example\\.com"
          autocomplete="email"
          required
          readonly
        ></aui-input>
      `);
      const control = controlOf(el) as HTMLInputElement;
      expect(control.type).to.equal('email');
      expect(control.placeholder).to.equal('name@example.com');
      expect(control.minLength).to.equal(3);
      expect(control.maxLength).to.equal(20);
      expect(control.pattern).to.equal('.+@example\\.com');
      expect(control.autocomplete).to.equal('email');
      expect(control.required).to.be.true;
      expect(control.readOnly).to.be.true;
    });

    it('marks the control invalid with aria-invalid when invalid is set', async () => {
      const el = await fixture<AuiInput>(html`<aui-input invalid></aui-input>`);
      const control = controlOf(el);
      expect(control.getAttribute('aria-invalid')).to.equal('true');
      expect(control.classList.contains('control--invalid')).to.be.true;

      el.invalid = false;
      await el.updateComplete;
      expect(control.hasAttribute('aria-invalid')).to.be.false;
    });

    it('delegates focus to the inner control', async () => {
      const el = await fixture<AuiInput>(html`<aui-input></aui-input>`);
      el.focus();
      expect(el.shadowRoot!.activeElement).to.equal(controlOf(el));
    });
  });

  describe('value and defaultValue', () => {
    it('uses the value attribute as the default value', async () => {
      const el = await fixture<AuiInput>(html`<aui-input value="hello"></aui-input>`);
      expect(el.defaultValue).to.equal('hello');
      expect(el.value).to.equal('hello');
      expect(controlOf(el).value).to.equal('hello');
    });

    it('follows the value attribute until the value is changed (dirty value flag)', async () => {
      const el = await fixture<AuiInput>(html`<aui-input value="a"></aui-input>`);
      el.setAttribute('value', 'b');
      await el.updateComplete;
      expect(el.value).to.equal('b');

      el.value = 'typed';
      el.setAttribute('value', 'c');
      await el.updateComplete;
      expect(el.value).to.equal('typed');
      expect(el.defaultValue).to.equal('c');
    });

    it('renders programmatic value changes into the control', async () => {
      const el = await fixture<AuiInput>(html`<aui-input></aui-input>`);
      el.value = 'set by code';
      await el.updateComplete;
      expect(controlOf(el).value).to.equal('set by code');
    });

    it('treats null / undefined as an empty string', async () => {
      const el = await fixture<AuiInput>(html`<aui-input value="x"></aui-input>`);
      el.value = null as unknown as string;
      expect(el.value).to.equal('');
    });
  });

  describe('events', () => {
    it('dispatches input on the host with the value already updated', async () => {
      const el = await fixture<AuiInput>(html`<aui-input></aui-input>`);
      const seen: Array<{ target: EventTarget | null; value: string }> = [];
      el.addEventListener('input', (event) => seen.push({ target: event.target, value: el.value }));

      await typeInto(el, 'ab');
      expect(seen.map((entry) => entry.value)).to.deep.equal(['a', 'ab']);
      expect(seen.every((entry) => entry.target === el)).to.be.true;
    });

    it('re-dispatches change on the host exactly once, with the value updated', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`<div><aui-input></aui-input></div>`);
      const el = wrapper.querySelector<AuiInput>('aui-input')!;
      const values: string[] = [];
      wrapper.addEventListener('change', (event) => {
        expect(event.target).to.equal(el);
        values.push(el.value);
      });

      await typeInto(el, 'xyz');
      controlOf(el).blur();
      expect(values).to.deep.equal(['xyz']);
    });

    it('fires input and change on multiline textareas too', async () => {
      const el = await fixture<AuiInput>(html`<aui-input multiline></aui-input>`);
      const events: string[] = [];
      el.addEventListener('input', () => events.push(`input:${el.value}`));
      el.addEventListener('change', () => events.push(`change:${el.value}`));

      await typeInto(el, 'hi');
      controlOf(el).blur();
      expect(events).to.deep.equal(['input:h', 'input:hi', 'change:hi']);
    });

    it('clear() empties the value and dispatches input and change', async () => {
      const el = await fixture<AuiInput>(html`<aui-input value="text"></aui-input>`);
      const events: string[] = [];
      el.addEventListener('input', (event) => {
        expect((event as Event).composed).to.be.true;
        events.push(`input:${el.value}`);
      });
      el.addEventListener('change', () => events.push(`change:${el.value}`));

      el.clear();
      expect(el.value).to.equal('');
      expect(events).to.deep.equal(['input:', 'change:']);

      // 已為空值時不重複分派
      el.clear();
      expect(events).to.have.length(2);
    });

    it('clear() does nothing when disabled or readonly', async () => {
      for (const template of [
        html`<aui-input value="keep" disabled></aui-input>`,
        html`<aui-input value="keep" readonly></aui-input>`,
      ]) {
        const el = await fixture<AuiInput>(template);
        let dispatched = 0;
        el.addEventListener('input', () => dispatched++);
        el.clear();
        expect(el.value).to.equal('keep');
        expect(dispatched).to.equal(0);
      }
    });
  });

  describe('framework binding contract (Vue v-model / Angular DefaultValueAccessor)', () => {
    /**
     * 依 Vue vModelText 與 Angular DefaultValueAccessor 的演算法，在 host 上綁定 model：
     * 讀取 event.target.value、輸入法組字期間忽略 input、compositionend 時對 event.target 重新分派 input。
     * 這依賴瀏覽器把 Shadow DOM 內的事件 retarget 到 host（happy-dom 不支援，因此於此以真實 Chromium 驗證）。
     */
    function bindModel(el: AuiInput): { model: string } {
      const state = { model: el.value };
      type Composing = EventTarget & { composing?: boolean; value: string };
      el.addEventListener('compositionstart', (event) => {
        (event.target as Composing).composing = true;
      });
      el.addEventListener('compositionend', (event) => {
        const target = event.target as Composing;
        if (!target.composing) return;
        target.composing = false;
        target.dispatchEvent(new Event('input'));
      });
      el.addEventListener('input', (event) => {
        const target = event.target as Composing;
        if (target.composing) return;
        state.model = target.value;
      });
      return state;
    }

    it('retargets input and composition events to the host', async () => {
      const el = await fixture<AuiInput>(html`<aui-input></aui-input>`);
      const targets: Array<EventTarget | null> = [];
      for (const type of ['compositionstart', 'input', 'compositionend']) {
        el.addEventListener(type, (event) => targets.push(event.target));
      }
      const control = controlOf(el);
      control.dispatchEvent(
        new CompositionEvent('compositionstart', { bubbles: true, composed: true }),
      );
      control.value = 'x';
      control.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      control.dispatchEvent(
        new CompositionEvent('compositionend', { bubbles: true, composed: true }),
      );
      expect(targets).to.have.length(3);
      expect(targets.every((target) => target === el)).to.be.true;
    });

    it('fires blur on the host when focus leaves (Angular touched state)', async () => {
      const wrapper = await fixture<HTMLDivElement>(
        html`<div><aui-input></aui-input><button>next</button></div>`,
      );
      const el = wrapper.querySelector<AuiInput>('aui-input')!;
      const targets: Array<EventTarget | null> = [];
      el.addEventListener('blur', (event) => targets.push(event.target));

      el.focus();
      wrapper.querySelector('button')!.focus();
      expect(targets).to.deep.equal([el]);
    });

    it('lets a framework model wait for IME composition to finish', async () => {
      const el = await fixture<AuiInput>(html`<aui-input value="Hello"></aui-input>`);
      const binding = bindModel(el);
      const control = controlOf(el);
      const compose = (text: string) => {
        control.value = text;
        control.dispatchEvent(
          new InputEvent('input', { bubbles: true, composed: true, isComposing: true }),
        );
      };

      control.dispatchEvent(
        new CompositionEvent('compositionstart', { bubbles: true, composed: true }),
      );
      compose('ㄋ');
      compose('ㄋㄧˇ');
      compose('你');
      expect(binding.model, 'not synced while composing').to.equal('Hello');
      expect(el.value, 'the element itself follows every input').to.equal('你');

      control.dispatchEvent(
        new CompositionEvent('compositionend', { bubbles: true, composed: true }),
      );
      expect(binding.model).to.equal('你');
    });
  });

  describe('form participation (ElementInternals)', () => {
    it('submits its name and value with the form', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-input name="token" value="abc"></aui-input></form>
      `);
      const el = form.querySelector<AuiInput>('aui-input')!;
      expect(el.form).to.equal(form);
      expect(new FormData(form).get('token')).to.equal('abc');

      await typeInto(el, '123');
      expect(new FormData(form).get('token')).to.equal('abc123');
    });

    it('submits an empty value when never edited (like a native input)', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-input name="untouched"></aui-input></form>
      `);
      expect(new FormData(form).has('untouched')).to.be.true;
      expect(new FormData(form).get('untouched')).to.equal('');
    });

    it('updates the form value synchronously, before host input listeners run', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-input name="q"></aui-input></form>
      `);
      const el = form.querySelector<AuiInput>('aui-input')!;
      const snapshots: Array<FormDataEntryValue | null> = [];
      el.addEventListener('input', () => snapshots.push(new FormData(form).get('q')));
      await typeInto(el, 'z');
      expect(snapshots).to.deep.equal(['z']);
    });

    it('blocks submission while required and empty', async () => {
      let submitted = 0;
      const form = await fixture<HTMLFormElement>(html`
        <form
          @submit=${(event: Event) => {
            event.preventDefault();
            submitted++;
          }}
        >
          <aui-input name="title" required></aui-input>
        </form>
      `);
      const el = form.querySelector<AuiInput>('aui-input')!;
      expect(el.willValidate).to.be.true;
      expect(el.checkValidity()).to.be.false;
      expect(el.validity?.valueMissing).to.be.true;
      expect(el.validationMessage).to.not.equal('');

      form.requestSubmit();
      expect(submitted).to.equal(0);

      await typeInto(el, 'ok');
      expect(el.checkValidity()).to.be.true;
      form.requestSubmit();
      expect(submitted).to.equal(1);
    });

    it('re-validates after programmatic value changes', async () => {
      const el = await fixture<AuiInput>(html`<aui-input required></aui-input>`);
      expect(el.checkValidity()).to.be.false;
      el.value = 'filled';
      await el.updateComplete;
      expect(el.checkValidity()).to.be.true;
    });

    it('mirrors native type and length constraints of the inner control', async () => {
      const el = await fixture<AuiInput>(html`<aui-input type="email"></aui-input>`);
      await typeInto(el, 'not-an-email');
      expect(el.validity?.typeMismatch).to.be.true;
      expect(el.checkValidity()).to.be.false;
    });

    it('supports setCustomValidity()', async () => {
      const el = await fixture<AuiInput>(html`<aui-input value="taken"></aui-input>`);
      el.setCustomValidity('此名稱已被使用');
      expect(el.checkValidity()).to.be.false;
      expect(el.validity?.customError).to.be.true;
      expect(el.validationMessage).to.equal('此名稱已被使用');

      // 重新渲染後仍保留自訂錯誤
      el.placeholder = 'changed';
      await el.updateComplete;
      expect(el.validity?.customError).to.be.true;

      el.setCustomValidity('');
      expect(el.checkValidity()).to.be.true;
    });

    it('is barred from validation while readonly', async () => {
      const el = await fixture<AuiInput>(html`<aui-input required readonly></aui-input>`);
      expect(el.willValidate).to.be.false;
      expect(el.checkValidity()).to.be.true;
    });

    it('restores the default value on form.reset()', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-input name="note" value="initial"></aui-input></form>
      `);
      const el = form.querySelector<AuiInput>('aui-input')!;
      await typeInto(el, ' edited');
      expect(el.value).to.equal('initial edited');

      form.reset();
      await el.updateComplete;
      expect(el.value).to.equal('initial');
      expect(controlOf(el).value).to.equal('initial');
      expect(new FormData(form).get('note')).to.equal('initial');

      // reset 後回到「未改動」狀態，再次跟隨 value 屬性
      el.setAttribute('value', 'next default');
      await el.updateComplete;
      expect(el.value).to.equal('next default');
    });

    it('is disabled by a disabled fieldset and excluded from submission', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <fieldset><aui-input name="city" value="Taipei"></aui-input></fieldset>
        </form>
      `);
      const fieldset = form.querySelector('fieldset')!;
      const el = form.querySelector<AuiInput>('aui-input')!;

      fieldset.disabled = true;
      await el.updateComplete;
      expect(controlOf(el).disabled).to.be.true;
      expect(el.disabled, 'own disabled property is untouched').to.be.false;
      expect(new FormData(form).has('city')).to.be.false;

      fieldset.disabled = false;
      await el.updateComplete;
      expect(controlOf(el).disabled).to.be.false;
      expect(new FormData(form).get('city')).to.equal('Taipei');
    });

    it('is excluded from submission when disabled', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-input name="secret" value="x" disabled></aui-input></form>
      `);
      expect(new FormData(form).has('secret')).to.be.false;
      expect(controlOf(form.querySelector<AuiInput>('aui-input')!).disabled).to.be.true;
    });

    it('restores a string state via formStateRestoreCallback', async () => {
      const el = await fixture<AuiInput>(html`<aui-input></aui-input>`);
      el.formStateRestoreCallback('restored');
      el.formStateRestoreCallback(null);
      expect(el.value).to.equal('restored');
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

    it('submits through a hidden light-DOM input and follows value changes', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form><aui-input name="code" value="A1"></aui-input></form>
      `);
      const el = form.querySelector<AuiInput>('aui-input')!;
      const hidden = el.querySelector<HTMLInputElement>('input[type="hidden"]')!;
      expect(hidden.name).to.equal('code');
      expect(new FormData(form).get('code')).to.equal('A1');

      await typeInto(el, 'B2');
      expect(new FormData(form).get('code')).to.equal('A1B2');

      el.disabled = true;
      await el.updateComplete;
      expect(new FormData(form).has('code')).to.be.false;

      el.name = '';
      await el.updateComplete;
      expect(el.querySelector('input[type="hidden"]')).to.be.null;
    });

    it('resolves its form owner and restores the default value on reset', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <form id="fallback-input-form"></form>
          <aui-input name="remote" value="start" form="fallback-input-form"></aui-input>
        </div>
      `);
      const form = wrapper.querySelector('form')!;
      const el = wrapper.querySelector<AuiInput>('aui-input')!;
      expect(el.form).to.equal(form);
      expect(new FormData(form).get('remote')).to.equal('start');

      el.value = 'changed';
      await el.updateComplete;
      expect(new FormData(form).get('remote')).to.equal('changed');

      form.reset();
      await el.updateComplete;
      expect(el.value).to.equal('start');
      expect(new FormData(form).get('remote')).to.equal('start');
    });

    it('validates through the inner control', async () => {
      const el = await fixture<AuiInput>(html`<aui-input required></aui-input>`);
      expect(el.willValidate).to.be.true;
      expect(el.checkValidity()).to.be.false;
      expect(el.reportValidity()).to.be.false;
      expect(el.validity?.valueMissing).to.be.true;

      el.value = 'done';
      await el.updateComplete;
      expect(el.checkValidity()).to.be.true;
    });
  });
});
