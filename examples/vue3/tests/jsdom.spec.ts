// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { AuiButton } from '@anchor-ui/core/button';
import type { AuiInput } from '@anchor-ui/core/input';
import type { AuiSegmented } from '@anchor-ui/core/segmented';
import JsdomForm from './fixtures/JsdomForm.vue';

/**
 * 表單元件在 jsdom 中的行為（其餘範例測試使用 happy-dom）。
 *
 * jsdom 有 attachInternals，但回傳的 ElementInternals 只有無障礙屬性，沒有 setFormValue、setValidity、form；
 * 元件須判斷為不支援並改走退回方案（隱藏 input、以 DOM 查找表單），不可在設定值時拋錯。
 */
describe('Anchor UI form controls under jsdom', () => {
  let wrapper: ReturnType<typeof mount<typeof JsdomForm>> | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  const mountForm = async () => {
    wrapper = mount(JsdomForm, { attachTo: document.body });
    const form = wrapper.find('form').element;
    const [query, note] = form.querySelectorAll<AuiInput>('aui-input');
    const segmented = form.querySelector<AuiSegmented>('aui-segmented')!;
    const [submit, reset] = form.querySelectorAll<AuiButton>('aui-button');
    await Promise.all([query, note, segmented, submit, reset].map((el) => el.updateComplete));
    return { form, query, note, segmented, submit, reset };
  };

  const typeInto = async (el: AuiInput, value: string) => {
    const control = el.shadowRoot!.querySelector<HTMLInputElement>('.control')!;
    control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
  };

  it('runs on a jsdom whose ElementInternals has no form API', () => {
    // jsdom 補上表單 API 後，這組測試就不再涵蓋退回方案：屆時改以模擬方式保留（見 src/test-utils/form-fallback.ts）
    class Probe extends HTMLElement {}
    customElements.define('jsdom-internals-probe', Probe);
    const internals = new Probe().attachInternals();
    expect(typeof internals.setFormValue).toBe('undefined');
    expect('role' in internals).toBe(true);
  });

  it('submits v-model values through <aui-button type="submit">', async () => {
    const { form, query, segmented, submit } = await mountForm();
    expect(query.form).toBe(form);
    expect(submit.form).toBe(form);

    await typeInto(query, 'changed');
    expect(wrapper!.vm.query).toBe('changed');
    segmented.shadowRoot!.querySelectorAll<HTMLButtonElement>('button')[1].click();
    await segmented.updateComplete;
    expect(wrapper!.vm.mode).toBe('b');

    const submitted: [string, FormDataEntryValue][][] = [];
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitted.push([...new FormData(form)]);
    });
    submit.click();
    await settle();
    expect(submitted).toEqual([
      [
        ['q', 'changed'],
        ['note', '預設'],
        ['mode', 'b'],
      ],
    ]);
  });

  it('validates each control, but the form validation does not include them', async () => {
    const { form, query } = await mountForm();
    await typeInto(query, '');
    expect(query.checkValidity()).toBe(false);
    expect(query.validity?.valueMissing).toBe(true);
    // 退回方案的限制（happy-dom 相同）：沒有 ElementInternals，元件不屬於表單的驗證範圍，
    // 送出前不會被擋下；README 的「在測試環境中使用」說明以個別元件的 checkValidity() 測試驗證
    expect(form.checkValidity()).toBe(true);
  });

  it('restores default values through <aui-button type="reset">', async () => {
    const { note, segmented, reset } = await mountForm();
    await typeInto(note, '改過');
    expect(note.value).toBe('改過');

    reset.click();
    await settle();
    await Promise.all([note.updateComplete, segmented.updateComplete]);
    expect(note.value).toBe('預設');
  });
});
