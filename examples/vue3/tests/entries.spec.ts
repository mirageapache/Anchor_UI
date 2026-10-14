import { describe, it, expect, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import OnDemandField from './fixtures/OnDemandField.vue';
// 個別元件入口的型別匯出（@anchor-ui/core/<name>）
import type { AuiField } from '@anchor-ui/core/field';
import { AuiInput } from '@anchor-ui/core/input';

/**
 * 按需載入（package.json exports 的個別元件入口）。
 * 此檔不引入全量入口；Vitest 每個測試檔使用獨立環境，因此元件註冊表只反映本檔的匯入。
 */
describe('Vue 3 + per-component entries (@anchor-ui/core/<name>)', () => {
  let wrapper: ReturnType<typeof mount> | undefined;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('registers only the imported components and what they render themselves', () => {
    expect(customElements.get('aui-input')).toBe(AuiInput);
    expect(customElements.get('aui-field')).toBeDefined();
    // field 會渲染內建的複製／清除鈕，因此連同 icon-button 與其相依的 tooltip 一起註冊
    expect(customElements.get('aui-icon-button')).toBeDefined();
    expect(customElements.get('aui-tooltip')).toBeDefined();

    for (const tag of ['aui-button', 'aui-tag', 'aui-output', 'aui-segmented']) {
      expect(customElements.get(tag), `${tag} should not be registered`).toBeUndefined();
    }
  });

  it('works with v-model when loaded on demand', async () => {
    wrapper = mount(OnDemandField, { attachTo: document.body });
    const input = wrapper.find('aui-input#on-demand-input').element as AuiInput;
    await input.updateComplete;
    expect(input.value).toBe('on demand');

    const control = input.shadowRoot!.querySelector<HTMLInputElement>('.control')!;
    control.value = 'typed';
    control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await nextTick();
    expect(wrapper.find('#on-demand-text').text()).toBe('typed');

    const field = wrapper.find('aui-field#on-demand-field').element as AuiField;
    await field.updateComplete;
    field.shadowRoot!.querySelector<HTMLElement>('[part~="clear-button"]')!.click();
    await nextTick();
    expect(wrapper.find('#on-demand-text').text()).toBe('');
  });
});
