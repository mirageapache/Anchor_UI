import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';

// 匯入 Web Components 定義與型別
import '@anchor-ui/core';
import type { AuiButton, AuiTag, AuiTooltip, AuiIconButton } from '@anchor-ui/core';

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
    it('renders all four Anchor UI web components without Vue compiler warnings', () => {
      expect(wrapper.find('aui-button#target-button').exists()).toBe(true);
      expect(wrapper.find('aui-tag#tag-1').exists()).toBe(true);
      expect(wrapper.find('aui-tooltip#test-tooltip').exists()).toBe(true);
      expect(wrapper.find('aui-icon-button#target-icon-btn').exists()).toBe(true);
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
  });

  describe('6. Theme switcher (CSS Custom Properties in Shadow DOM)', () => {
    it('toggles data-theme attribute on document root', async () => {
      const themeBtn = wrapper.find('aui-button#theme-toggle-btn');

      expect(document.documentElement.getAttribute('data-theme')).toBeNull();

      await themeBtn.trigger('click');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      await themeBtn.trigger('click');
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });
});
