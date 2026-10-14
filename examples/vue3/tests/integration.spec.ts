import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';

// 匯入 Web Components 定義與型別
import { getTheme } from '@anchor-ui/core';
import type {
  AuiButton,
  AuiTag,
  AuiTooltip,
  AuiIconButton,
  AuiInput,
  AuiSegmented,
  AuiOutput,
  AuiField,
} from '@anchor-ui/core';

/**
 * happy-dom 沒有真實剪貼簿：模擬 Secure Context 與 navigator.clipboard.writeText
 */
function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('isSecureContext', true);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  return writeText;
}

/** 取得 <aui-input> 內部的原生控制項（等待 Lit 完成渲染） */
async function controlOf(el: AuiInput): Promise<HTMLInputElement | HTMLTextAreaElement> {
  await el.updateComplete;
  return el.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('.control')!;
}

/** 模擬使用者在 <aui-input> 內輸入：改變內部控制項的值並分派原生 input 事件 */
async function typeInto(el: AuiInput, text: string): Promise<void> {
  const control = await controlOf(el);
  control.value = text;
  control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await nextTick();
}

/** 模擬內容提交（失焦）：內部控制項分派原生 change，由元件於 host 重新分派 */
async function commit(el: AuiInput): Promise<void> {
  const control = await controlOf(el);
  control.dispatchEvent(new Event('change', { bubbles: true }));
  await nextTick();
}

/** 點擊 <aui-segmented> 的第 index 個選項 */
async function clickOption(el: AuiSegmented, index: number): Promise<void> {
  await el.updateComplete;
  el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')[index].click();
  await nextTick();
}

describe('Vue 3 + Anchor UI Integration Test Suite (TASK-107)', () => {
  let wrapper: ReturnType<typeof mount>;

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    // 掛到 document 上：Lit 元件需 connected 才會渲染 Shadow DOM（例如 Tag 的移除鈕）
    wrapper = mount(App, { attachTo: document.body });
  });

  describe('1. Custom Element recognition (compilerOptions.isCustomElement)', () => {
    it('renders all Anchor UI web components without Vue compiler warnings', () => {
      expect(wrapper.find('aui-button#target-button').exists()).toBe(true);
      expect(wrapper.find('aui-tag#tag-1').exists()).toBe(true);
      expect(wrapper.find('aui-tooltip#test-tooltip').exists()).toBe(true);
      expect(wrapper.find('aui-icon-button#target-icon-btn').exists()).toBe(true);
      expect(wrapper.find('aui-field#field-text').exists()).toBe(true);
      expect(wrapper.find('aui-input#input-text').exists()).toBe(true);
      expect(wrapper.find('aui-segmented#segmented-mode').exists()).toBe(true);
      expect(wrapper.find('aui-output#output-result').exists()).toBe(true);
    });
  });

  describe('2. Button (@click, reactive props & form submission)', () => {
    it('binds native @click event to Vue reactive state counter', async () => {
      const button = wrapper.find('aui-button#target-button');
      const counterText = wrapper.find('#click-counter-text');

      expect(counterText.text()).toContain('0 次');

      await button.trigger('click');
      expect(counterText.text()).toContain('1 次');

      await button.trigger('click');
      expect(counterText.text()).toContain('2 次');
    });

    it('reactively updates variant, size, loading and disabled props', async () => {
      const button = wrapper.find('aui-button#target-button');
      const btnEl = button.element as AuiButton;
      const selectVariant = wrapper.find<HTMLSelectElement>('#select-button-variant');
      const selectSize = wrapper.find<HTMLSelectElement>('#select-button-size');
      const chkLoading = wrapper.find<HTMLInputElement>('#chk-button-loading');
      const chkDisabled = wrapper.find<HTMLInputElement>('#chk-button-disabled');

      // Vue 3 DOM property 綁定驗證
      expect(btnEl.variant).toBe('primary');
      expect(btnEl.size).toBe('md');
      expect(btnEl.loading).toBe(false);
      expect(btnEl.disabled).toBe(false);

      // 切換為 danger, lg, loading=true, disabled=true
      await selectVariant.setValue('danger');
      await selectSize.setValue('lg');
      await chkLoading.setValue(true);
      await chkDisabled.setValue(true);

      expect(btnEl.variant).toBe('danger');
      expect(btnEl.size).toBe('lg');
      expect(btnEl.loading).toBe(true);
      expect(btnEl.disabled).toBe(true);
    });

    it('submits surrounding form with native Vue submit event', async () => {
      const formInput = wrapper.find<HTMLInputElement>('#form-input');
      const form = wrapper.find('form');

      await formInput.setValue('Custom Vue 3 Payload');
      await form.trigger('submit');

      const resultText = wrapper.find('#form-result-text');
      expect(resultText.exists()).toBe(true);
      expect(resultText.text()).toContain('Custom Vue 3 Payload');
    });

    it('submits the Vue form when <aui-button type="submit"> is clicked', async () => {
      await wrapper.find<HTMLInputElement>('#form-input').setValue('Submitted by aui-button');
      (wrapper.find('aui-button#form-submit-btn').element as AuiButton).click();
      await nextTick();

      expect(wrapper.find('#form-result-text').text()).toContain('Submitted by aui-button');
    });
  });

  describe('3. Tag (v-for, reactive pill, interactive click & @aui-remove)', () => {
    it('renders tag list with v-for and reactively updates pill attribute', async () => {
      const tagElements = wrapper.findAll('aui-tag');
      expect(tagElements.length).toBeGreaterThanOrEqual(5);

      const chkPill = wrapper.find<HTMLInputElement>('#chk-tag-pill');
      expect((tagElements[0].element as AuiTag).pill).toBe(true);

      await chkPill.setValue(false);
      const updatedTag = wrapper.find('aui-tag#tag-1');
      expect((updatedTag.element as AuiTag).pill).toBe(false);
    });

    it('updates selected tag label when clicked', async () => {
      const tag2 = wrapper.find('aui-tag#tag-2');
      await tag2.trigger('click');

      const selectionText = wrapper.find('#tag-selection-text');
      expect(selectionText.text()).toContain('typescript');
    });

    it('handles custom event @aui-remove and updates reactive list length', async () => {
      const countTextBefore = wrapper.find('#tag-count-text');
      expect(countTextBefore.text()).toContain('5 個');

      const tag1 = wrapper.find('aui-tag#tag-1').element as AuiTag;
      await tag1.updateComplete;
      // 點擊元件內部的移除鈕，由元件本身分派 aui-remove（而非測試手動分派）
      tag1.shadowRoot!.querySelector<HTMLButtonElement>('.tag__remove')!.click();
      await nextTick();

      const countTextAfter = wrapper.find('#tag-count-text');
      expect(countTextAfter.text()).toContain('4 個');
      expect(wrapper.find('aui-tag#tag-1').exists()).toBe(false);
    });
  });

  describe('4. Tooltip (reactive content and placement)', () => {
    it('reactively updates tooltip content and placement', async () => {
      const tooltip = wrapper.find('aui-tooltip#test-tooltip');
      const tooltipEl = tooltip.element as AuiTooltip;
      const inputContent = wrapper.find<HTMLInputElement>('#input-tooltip-content');
      const selectPlacement = wrapper.find<HTMLSelectElement>('#select-tooltip-placement');

      expect(tooltipEl.content).toBe('即時動態提示文字內容');
      expect(tooltipEl.placement).toBe('top');

      await inputContent.setValue('Updated tooltip description');
      await selectPlacement.setValue('bottom');

      expect(tooltipEl.content).toBe('Updated tooltip description');
      expect(tooltipEl.placement).toBe('bottom');
    });

    const eventLog = () => wrapper.find('#tooltip-event-log code').text();

    it('opens and closes through template-ref methods, emitting all four events', async () => {
      const tooltip = wrapper.find('aui-tooltip#test-tooltip').element as AuiTooltip;
      await tooltip.updateComplete;

      await wrapper.find('aui-button#btn-tooltip-show').trigger('click');
      await vi.waitFor(() => expect(eventLog()).toContain('aui-after-show'));
      expect(tooltip.open).toBe(true);

      await wrapper.find('aui-button#btn-tooltip-hide').trigger('click');
      await vi.waitFor(() => expect(eventLog()).toContain('aui-after-hide'));
      expect(tooltip.open).toBe(false);
      expect(eventLog()).toBe('aui-show → aui-after-show → aui-hide → aui-after-hide');
    });

    it('cancels opening when the Vue handler calls preventDefault() on aui-show', async () => {
      const tooltip = wrapper.find('aui-tooltip#test-tooltip').element as AuiTooltip;
      await tooltip.updateComplete;
      await wrapper.find<HTMLInputElement>('#chk-tooltip-prevent').setValue(true);

      await wrapper.find('aui-button#btn-tooltip-show').trigger('click');
      await vi.waitFor(() => expect(eventLog()).toContain('aui-show（已取消）'));
      // 等待一段時間，確認沒有接著展開
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(tooltip.open).toBe(false);
      expect(eventLog()).not.toContain('aui-after-show');
    });
  });

  describe('5. IconButton (reactive presets and custom events @aui-copy / @aui-download)', () => {
    it('reactively updates preset property', async () => {
      const iconBtn = wrapper.find('aui-icon-button#target-icon-btn');
      const iconBtnEl = iconBtn.element as AuiIconButton;
      const selectPreset = wrapper.find<HTMLSelectElement>('#select-icon-preset');

      expect(iconBtnEl.preset).toBe('copy');

      await selectPreset.setValue('download');
      expect(iconBtnEl.preset).toBe('download');
    });

    it('copies the bound copy-value on click and handles the emitted @aui-copy', async () => {
      const writeText = mockClipboard();
      await wrapper.find<HTMLInputElement>('#input-copy-snippet').setValue('npm test snippet');

      const iconBtn = wrapper.find('aui-icon-button#target-icon-btn').element as AuiIconButton;
      iconBtn.click();

      await vi.waitFor(() => {
        expect(wrapper.find('#icon-feedback-text').text()).toContain(
          '已成功複製：npm test snippet',
        );
      });
      expect(writeText).toHaveBeenCalledWith('npm test snippet');
    });

    it('handles the @aui-download emitted by the component in download mode', async () => {
      await wrapper.find<HTMLSelectElement>('#select-icon-preset').setValue('download');
      const iconBtn = wrapper.find('aui-icon-button#target-icon-btn').element as AuiIconButton;
      iconBtn.click();

      await vi.waitFor(() => {
        // detail.filename 來自模板上的 download-filename 屬性
        expect(wrapper.find('#icon-feedback-text').text()).toContain(
          '下載事件觸發：anchor-ui.json',
        );
      });
    });

    it('handles @aui-copy-error when there is nothing to copy', async () => {
      const writeText = mockClipboard();
      await wrapper.find<HTMLInputElement>('#input-copy-snippet').setValue('');
      (wrapper.find('aui-icon-button#target-icon-btn').element as AuiIconButton).click();

      await vi.waitFor(() => {
        expect(wrapper.find('#icon-feedback-text').text()).toContain('複製失敗');
      });
      expect(writeText).not.toHaveBeenCalled();
    });

    it('handles @aui-download-error for a disallowed download-url', async () => {
      await wrapper.find<HTMLSelectElement>('#select-icon-preset').setValue('download');
      await wrapper.find<HTMLInputElement>('#input-download-url').setValue('javascript:alert(1)');
      (wrapper.find('aui-icon-button#target-icon-btn').element as AuiIconButton).click();

      await vi.waitFor(() => {
        expect(wrapper.find('#icon-feedback-text').text()).toContain(
          '下載被拒絕：javascript:alert(1)',
        );
      });
    });

    it('reports every @aui-status-change transition', async () => {
      mockClipboard();
      const iconBtn = wrapper.find('aui-icon-button#target-icon-btn').element as AuiIconButton;
      iconBtn.click();
      await vi.waitFor(() => {
        expect(wrapper.find('#icon-status-text').text()).toContain('idle→success');
      });

      iconBtn.resetFeedback();
      await nextTick();
      expect(wrapper.find('#icon-status-text').text()).toContain('idle→success、success→idle');
    });
  });

  describe('6. Form controls with v-model (TASK-209)', () => {
    /** <script setup> 的狀態（@vue/test-utils 透過 wrapper.vm 暴露） */
    const state = () => wrapper.vm as unknown as { textValue: string; mode: string; notes: string };
    const input = () => wrapper.find('aui-input#input-text').element as AuiInput;
    const segmented = () => wrapper.find('aui-segmented#segmented-mode').element as AuiSegmented;
    const output = () => wrapper.find('aui-output#output-result').element as AuiOutput;

    it('writes the v-model value into <aui-input> (model → element)', async () => {
      expect(input().value).toBe('Hello, Anchor UI!');
      expect((await controlOf(input())).value).toBe('Hello, Anchor UI!');

      state().textValue = 'Set from Vue';
      await nextTick();
      expect(input().value).toBe('Set from Vue');
      expect((await controlOf(input())).value).toBe('Set from Vue');
    });

    it('updates the v-model value on input (element → model)', async () => {
      await typeInto(input(), 'Typed by user');
      expect(state().textValue).toBe('Typed by user');
      expect(wrapper.find('#model-text').text()).toContain('Typed by user');
    });

    it('binds <aui-segmented> with v-model in both directions', async () => {
      expect(segmented().value).toBe('encode');

      await clickOption(segmented(), 1);
      expect(state().mode).toBe('decode');
      expect(wrapper.find('#model-mode').text()).toContain('decode');

      state().mode = 'encode';
      await nextTick();
      await segmented().updateComplete;
      expect(segmented().value).toBe('encode');
      const checked = segmented().shadowRoot!.querySelector('[aria-checked="true"]');
      expect(checked?.textContent?.trim()).toBe('編碼');
    });

    it('handles the native @change of <aui-segmented> with the value already updated', async () => {
      await clickOption(segmented(), 1);
      expect(wrapper.find('#model-mode').text()).toContain('change 事件：decode');
    });

    it('drives <aui-output> value and status from reactive state', async () => {
      await typeInto(input(), 'Hi');
      expect(output().value).toBe('SGk=');
      expect(output().status).toBe('success');

      await clickOption(segmented(), 1);
      await typeInto(input(), '/w==');
      // 0xFF 不是合法的 UTF-8，解碼失敗時以錯誤狀態呈現
      expect(output().status).toBe('error');
      expect(output().value).toBe('無效的 Base64 輸入');
    });

    it('syncs v-model.lazy only on change', async () => {
      const notes = wrapper.find('aui-input#input-notes').element as AuiInput;
      await typeInto(notes, 'draft');
      expect(state().notes, 'input events are ignored by .lazy').toBe('');

      await commit(notes);
      expect(state().notes).toBe('draft');
      expect(wrapper.find('#model-notes').text()).toContain('change 1 次');
    });

    it('emits @aui-copy from the <aui-field> copy button with the output value', async () => {
      const writeText = mockClipboard();
      await typeInto(input(), 'Hi');
      await output().updateComplete;

      const field = wrapper.find('aui-field#field-output').element as AuiField;
      await field.updateComplete;
      field.shadowRoot!.querySelector<HTMLElement>('[part~="copy-button"]')!.click();

      await vi.waitFor(() => expect(wrapper.find('#output-copy-text').text()).toContain('SGk='));
      expect(writeText).toHaveBeenCalledWith('SGk=');
    });

    it('rebinds :options when the reactive array changes', async () => {
      await wrapper.find<HTMLInputElement>('#chk-decode-disabled').setValue(true);
      await segmented().updateComplete;
      expect(segmented().options[1].disabled).toBe(true);
      const decodeButton =
        segmented().shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')[1];
      expect(decodeButton.disabled).toBe(true);

      await clickOption(segmented(), 1);
      expect(state().mode, 'disabled option cannot be selected').toBe('encode');
    });

    it('clears the model through the <aui-field> clear button', async () => {
      const field = wrapper.find('aui-field#field-text').element as AuiField;
      await field.updateComplete;
      const clearButton = field.shadowRoot!.querySelector<HTMLElement>('[part~="clear-button"]')!;
      clearButton.click();
      await nextTick();
      expect(state().textValue).toBe('');
      expect(output().value).toBe('');
    });

    it('submits the bound values with a native form (FormData)', async () => {
      await typeInto(input(), 'payload');
      await clickOption(segmented(), 1);
      await input().updateComplete;
      await segmented().updateComplete;

      // 以 <aui-button type="submit"> 實際提交，而非直接分派 submit 事件
      (wrapper.find('aui-button#controls-submit-btn').element as AuiButton).click();
      await nextTick();
      const submitted = JSON.parse(wrapper.find('#submitted-data code').text()) as Record<
        string,
        string
      >;
      expect(submitted).toMatchObject({ mode: 'decode', text: 'payload', notes: '' });
    });
  });

  describe('7. Theme switcher (toggleTheme / getTheme API)', () => {
    it('toggles the theme through the library theme API', async () => {
      const themeBtn = wrapper.find('aui-button#theme-toggle-btn');
      const root = document.documentElement;

      expect(root.getAttribute('data-theme')).toBeNull();
      expect(getTheme()).toBe('light');

      await themeBtn.trigger('click');
      expect(root.getAttribute('data-theme')).toBe('dark');
      expect(getTheme()).toBe('dark');
      expect(themeBtn.text()).toContain('切換淺色模式');
      // 切換期間短暫套用過渡 class，結束後移除
      expect(root.classList.contains('theme-transitioning')).toBe(true);
      await vi.waitFor(() => expect(root.classList.contains('theme-transitioning')).toBe(false));

      await themeBtn.trigger('click');
      expect(root.getAttribute('data-theme')).toBeNull();
      expect(getTheme()).toBe('light');
      expect(themeBtn.text()).toContain('切換深色模式');
    });
  });
});
