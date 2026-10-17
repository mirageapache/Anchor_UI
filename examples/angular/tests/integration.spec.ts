import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../src/app/app.component';

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
}

/** 點擊 <aui-segmented> 的第 index 個選項 */
async function clickOption(el: AuiSegmented, index: number): Promise<void> {
  await el.updateComplete;
  el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')[index].click();
}

describe('Angular 19 + Anchor UI Integration Test Suite (TASK-108)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    vi.unstubAllGlobals();
  });

  describe('1. Custom Element recognition (CUSTOM_ELEMENTS_SCHEMA)', () => {
    it('renders all Anchor UI web components without Angular schema/template errors', () => {
      const button = compiled.querySelector<AuiButton>('aui-button#target-button');
      const tag = compiled.querySelector<AuiTag>('aui-tag#tag-1');
      const tooltip = compiled.querySelector<AuiTooltip>('aui-tooltip#test-tooltip');
      const iconBtn = compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn');

      expect(button).not.toBeNull();
      expect(tag).not.toBeNull();
      expect(tooltip).not.toBeNull();
      expect(iconBtn).not.toBeNull();
      expect(compiled.querySelector('aui-field#field-text')).not.toBeNull();
      expect(compiled.querySelector('aui-input#input-text')).not.toBeNull();
      expect(compiled.querySelector('aui-segmented#segmented-mode')).not.toBeNull();
      expect(compiled.querySelector('aui-output#output-result')).not.toBeNull();
    });
  });

  describe('2. Button ([variant], [size], [loading], [disabled], (click) & form submit)', () => {
    it('binds native (click) event to Angular component state counter', () => {
      const button = compiled.querySelector<AuiButton>('aui-button#target-button');
      const counterText = compiled.querySelector<HTMLParagraphElement>('#click-counter-text');

      expect(counterText?.textContent).toContain('0 次');

      button?.click();
      fixture.detectChanges();
      expect(counterText?.textContent).toContain('1 次');

      button?.click();
      fixture.detectChanges();
      expect(counterText?.textContent).toContain('2 次');
    });

    it('reactively updates variant, size, loading, and disabled DOM properties via Angular property bindings', () => {
      const button = compiled.querySelector<AuiButton>('aui-button#target-button')!;

      // 初始屬性驗證
      expect(button.variant).toBe('primary');
      expect(button.size).toBe('md');
      expect(button.loading).toBe(false);
      expect(button.disabled).toBe(false);

      // 動態更新 Angular 元件狀態
      component.buttonVariant = 'danger';
      component.buttonSize = 'lg';
      component.buttonLoading = true;
      component.buttonDisabled = true;
      fixture.detectChanges();

      // 驗證 Web Component DOM 屬性是否同步更新
      expect(button.variant).toBe('danger');
      expect(button.size).toBe('lg');
      expect(button.loading).toBe(true);
      expect(button.disabled).toBe(true);
    });

    it('submits surrounding form with native Angular submit event', () => {
      const form = compiled.querySelector<HTMLFormElement>('form')!;

      component.inputValue = 'Custom Angular 19 Payload';
      fixture.detectChanges();

      form.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      const resultText = compiled.querySelector<HTMLParagraphElement>('#form-result-text');
      expect(resultText).not.toBeNull();
      expect(resultText?.textContent).toContain('Custom Angular 19 Payload');
      expect(component.lastSubmittedValue).toBe('Custom Angular 19 Payload');
    });

    it('submits the Angular form when <aui-button type="submit"> is clicked', () => {
      component.inputValue = 'Submitted by aui-button';
      fixture.detectChanges();

      compiled.querySelector<AuiButton>('aui-button#form-submit-btn')!.click();
      fixture.detectChanges();

      expect(component.lastSubmittedValue).toBe('Submitted by aui-button');
      expect(compiled.querySelector('#form-result-text')?.textContent).toContain(
        'Submitted by aui-button',
      );
    });
  });

  describe('3. Tag (*ngFor, [variant], [pill], (click) & custom event (aui-remove))', () => {
    it('renders tag list with *ngFor and reactively updates [pill] property', () => {
      const tagElements = compiled.querySelectorAll<AuiTag>('aui-tag');
      expect(tagElements.length).toBeGreaterThanOrEqual(5);

      const firstTag = tagElements[0];
      expect(firstTag.pill).toBe(true);

      component.isPill = false;
      fixture.detectChanges();

      const updatedTag = compiled.querySelector<AuiTag>('aui-tag#tag-1')!;
      expect(updatedTag.pill).toBe(false);
    });

    it('updates selected tag label when clicked', () => {
      const tag2 = compiled.querySelector<AuiTag>('aui-tag#tag-2')!;
      tag2.click();
      fixture.detectChanges();

      const selectionText = compiled.querySelector<HTMLParagraphElement>('#tag-selection-text');
      expect(selectionText?.textContent).toContain('typescript');
      expect(component.selectedTagName).toBe('typescript');
    });

    it('handles custom event (aui-remove) and updates reactive tag list', async () => {
      const countTextBefore = compiled.querySelector<HTMLParagraphElement>('#tag-count-text');
      expect(countTextBefore?.textContent).toContain('5 個');

      const tag1 = compiled.querySelector<AuiTag>('aui-tag#tag-1')!;
      await tag1.updateComplete;
      // 點擊元件內部的移除鈕，由元件本身分派 aui-remove（而非測試手動分派）
      tag1.shadowRoot!.querySelector<HTMLButtonElement>('.tag__remove')!.click();
      fixture.detectChanges();

      const countTextAfter = compiled.querySelector<HTMLParagraphElement>('#tag-count-text');
      expect(countTextAfter?.textContent).toContain('4 個');
      expect(compiled.querySelector('aui-tag#tag-1')).toBeNull();
    });
  });

  describe('4. Tooltip ([content], [placement], [arrow])', () => {
    it('reactively updates tooltip content, placement, and arrow properties', () => {
      const tooltip = compiled.querySelector<AuiTooltip>('aui-tooltip#test-tooltip')!;

      expect(tooltip.content).toBe('即時 Angular 動態提示內容');
      expect(tooltip.placement).toBe('top');
      expect(tooltip.arrow).toBe(true);

      component.tooltipContent = 'Updated tooltip description from Angular';
      component.tooltipPlacement = 'bottom';
      component.hasArrow = false;
      fixture.detectChanges();

      expect(tooltip.content).toBe('Updated tooltip description from Angular');
      expect(tooltip.placement).toBe('bottom');
      expect(tooltip.arrow).toBe(false);
    });

    const eventLog = () => component.tooltipEvents.join(' → ');

    it('opens and closes through @ViewChild methods, emitting all four events', async () => {
      const tooltip = compiled.querySelector<AuiTooltip>('aui-tooltip#test-tooltip')!;
      await tooltip.updateComplete;

      compiled.querySelector<AuiButton>('aui-button#btn-tooltip-show')!.click();
      await vi.waitFor(() => expect(eventLog()).toContain('aui-after-show'));
      expect(tooltip.open).toBe(true);

      compiled.querySelector<AuiButton>('aui-button#btn-tooltip-hide')!.click();
      await vi.waitFor(() => expect(eventLog()).toContain('aui-after-hide'));
      expect(tooltip.open).toBe(false);
      expect(eventLog()).toBe('aui-show → aui-after-show → aui-hide → aui-after-hide');

      fixture.detectChanges();
      expect(compiled.querySelector('#tooltip-event-log')?.textContent).toContain('aui-after-hide');
    });

    it('cancels opening when the Angular handler calls preventDefault() on (aui-show)', async () => {
      const tooltip = compiled.querySelector<AuiTooltip>('aui-tooltip#test-tooltip')!;
      await tooltip.updateComplete;
      component.preventTooltipShow = true;
      fixture.detectChanges();

      compiled.querySelector<AuiButton>('aui-button#btn-tooltip-show')!.click();
      await vi.waitFor(() => expect(eventLog()).toContain('aui-show（已取消）'));
      // 等待一段時間，確認沒有接著展開
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(tooltip.open).toBe(false);
      expect(eventLog()).not.toContain('aui-after-show');
    });
  });

  describe('5. IconButton ([preset], [copyValue], and custom events (aui-copy) / (aui-download))', () => {
    it('reactively updates preset property', () => {
      const iconBtn = compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn')!;
      expect(iconBtn.preset).toBe('copy');

      component.iconPreset = 'download';
      fixture.detectChanges();

      expect(iconBtn.preset).toBe('download');
    });

    it('copies the bound [copyValue] on click and handles the emitted (aui-copy)', async () => {
      const writeText = mockClipboard();
      component.copySnippet = 'npm test snippet';
      fixture.detectChanges();

      const iconBtn = compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn')!;
      iconBtn.click();

      await vi.waitFor(() => {
        expect(component.copyFeedbackText).toBe('已成功複製：npm test snippet');
      });
      fixture.detectChanges();
      const feedback = compiled.querySelector<HTMLParagraphElement>('#icon-feedback-text');
      expect(feedback?.textContent).toContain('已成功複製：npm test snippet');
      expect(writeText).toHaveBeenCalledWith('npm test snippet');
    });

    it('handles the (aui-download) emitted by the component in download mode', async () => {
      component.iconPreset = 'download';
      fixture.detectChanges();

      const iconBtn = compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn')!;
      iconBtn.click();

      await vi.waitFor(() => {
        // detail.filename 來自模板上的 download-filename 屬性
        expect(component.copyFeedbackText).toBe('下載事件觸發：anchor-ui.json');
      });
      fixture.detectChanges();
      const feedback = compiled.querySelector<HTMLParagraphElement>('#icon-feedback-text');
      expect(feedback?.textContent).toContain('下載事件觸發：anchor-ui.json');
    });

    it('handles (aui-copy-error) when there is nothing to copy', async () => {
      const writeText = mockClipboard();
      component.copySnippet = '';
      fixture.detectChanges();

      compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn')!.click();
      await vi.waitFor(() => expect(component.copyFeedbackText).toContain('複製失敗'));
      expect(writeText).not.toHaveBeenCalled();
    });

    it('handles (aui-download-error) for a disallowed [downloadUrl]', async () => {
      component.iconPreset = 'download';
      component.downloadUrl = 'javascript:alert(1)';
      fixture.detectChanges();

      compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn')!.click();
      await vi.waitFor(() => {
        expect(component.copyFeedbackText).toBe('下載被拒絕：javascript:alert(1)');
      });
    });

    it('reports every (aui-status-change) transition', async () => {
      mockClipboard();
      const iconBtn = compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn')!;
      iconBtn.click();
      await vi.waitFor(() => expect(component.statusChanges).toEqual(['idle→success']));

      iconBtn.resetFeedback();
      expect(component.statusChanges).toEqual(['idle→success', 'success→idle']);
      fixture.detectChanges();
      expect(compiled.querySelector('#icon-status-text')?.textContent).toContain(
        'idle→success、success→idle',
      );
    });
  });

  describe('6. Form controls with ngModel / formControl + ngDefaultControl (TASK-209)', () => {
    const input = () => compiled.querySelector<AuiInput>('aui-input#input-text')!;
    const reactiveInput = () => compiled.querySelector<AuiInput>('aui-input#input-reactive')!;
    const segmented = () => compiled.querySelector<AuiSegmented>('aui-segmented#segmented-mode')!;
    const output = () => compiled.querySelector<AuiOutput>('aui-output#output-result')!;
    const text = (selector: string) => compiled.querySelector(selector)?.textContent ?? '';

    /** ngModel 以非同步（resolved promise）寫入值，需等待穩定後再更新畫面 */
    async function settle(): Promise<void> {
      await fixture.whenStable();
      fixture.detectChanges();
    }

    beforeEach(async () => {
      await settle();
    });

    it('writes the [(ngModel)] value into <aui-input> (model → element)', async () => {
      expect(input().value).toBe('Hello, Anchor UI!');
      expect((await controlOf(input())).value).toBe('Hello, Anchor UI!');

      component.textValue = 'Set from Angular';
      fixture.detectChanges();
      await settle();
      expect(input().value).toBe('Set from Angular');
      expect((await controlOf(input())).value).toBe('Set from Angular');
    });

    it('updates the [(ngModel)] value on input (element → model)', async () => {
      await typeInto(input(), 'Typed by user');
      expect(component.textValue).toBe('Typed by user');
      fixture.detectChanges();
      expect(text('#model-text')).toContain('Typed by user');
    });

    it('binds <aui-segmented> with [(ngModel)] in both directions', async () => {
      expect(segmented().value).toBe('encode');

      await clickOption(segmented(), 1);
      expect(component.mode).toBe('decode');
      // 與真實應用相同：事件之後執行變更偵測，ngModel 才會記錄目前的綁定值
      fixture.detectChanges();

      component.mode = 'encode';
      fixture.detectChanges();
      await settle();
      await segmented().updateComplete;
      expect(segmented().value).toBe('encode');
      const checked = segmented().shadowRoot!.querySelector('[aria-checked="true"]');
      expect(checked?.textContent?.trim()).toBe('編碼');
    });

    it('handles the native (change) event (replacing the planned (auiChange), TASK-108)', async () => {
      await clickOption(segmented(), 1);
      fixture.detectChanges();
      expect(component.lastChangedMode).toBe('decode');
      expect(text('#model-mode')).toContain('change 事件：decode');
    });

    it('drives <aui-output> [value] and [status] from component state', async () => {
      await typeInto(input(), 'Hi');
      fixture.detectChanges();
      expect(output().value).toBe('SGk=');
      expect(output().status).toBe('success');

      await clickOption(segmented(), 1);
      await typeInto(input(), '/w==');
      fixture.detectChanges();
      // 0xFF 不是合法的 UTF-8，解碼失敗時以錯誤狀態呈現
      expect(output().status).toBe('error');
      expect(output().value).toBe('無效的 Base64 輸入');
    });

    it('emits (aui-copy) from the <aui-field> copy button with the output value', async () => {
      const writeText = mockClipboard();
      await typeInto(input(), 'Hi');
      fixture.detectChanges();
      await output().updateComplete;

      const field = compiled.querySelector<AuiField>('aui-field#field-output')!;
      await field.updateComplete;
      field.shadowRoot!.querySelector<HTMLElement>('[part~="copy-button"]')!.click();

      await vi.waitFor(() => expect(component.outputCopyText).toBe('SGk='));
      expect(writeText).toHaveBeenCalledWith('SGk=');
    });

    it('rebinds [options] when a new array is assigned', async () => {
      compiled.querySelector<HTMLInputElement>('#chk-decode-disabled')!.click();
      fixture.detectChanges();
      await segmented().updateComplete;

      expect(component.decodeDisabled).toBe(true);
      expect(segmented().options[1].disabled).toBe(true);
      const decodeButton =
        segmented().shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')[1];
      expect(decodeButton.disabled).toBe(true);

      await clickOption(segmented(), 1);
      expect(component.mode, 'disabled option cannot be selected').toBe('encode');
    });

    it('runs Angular validators and tracks touched state', async () => {
      expect(text('#model-validity')).toContain('valid：true');
      expect(text('#model-validity')).toContain('touched：false');

      // 透過 <aui-field> 的清除鈕清空：元件分派 input，ngModel 隨之更新並觸發 required 驗證
      const field = compiled.querySelector<AuiField>('aui-field#field-text')!;
      await field.updateComplete;
      field.shadowRoot!.querySelector<HTMLElement>('[part~="clear-button"]')!.click();
      fixture.detectChanges();
      expect(component.textValue).toBe('');
      expect(text('#model-validity')).toContain('valid：false');

      // 瀏覽器會把內部控制項的 blur retarget 到 host；happy-dom 不支援，直接於 host 分派
      input().dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();
      expect(text('#model-validity')).toContain('touched：true');
    });

    it('binds [formControl] in both directions, including the disabled state', async () => {
      const control = component.reactiveControl;
      expect(reactiveInput().value).toBe('Reactive value');

      control.setValue('Set via setValue');
      expect(reactiveInput().value).toBe('Set via setValue');

      await typeInto(reactiveInput(), 'Typed into reactive');
      expect(control.value).toBe('Typed into reactive');
      fixture.detectChanges();
      expect(text('#reactive-value')).toContain('Typed into reactive');

      control.disable();
      expect(reactiveInput().disabled).toBe(true);
      expect((await controlOf(reactiveInput())).disabled).toBe(true);

      control.enable();
      expect(reactiveInput().disabled).toBe(false);
    });

    it('submits the bound values with the native form (FormData)', async () => {
      await typeInto(input(), 'payload');
      await clickOption(segmented(), 1);
      await input().updateComplete;
      await segmented().updateComplete;

      // 以 <aui-button type="submit"> 實際提交，而非直接分派 submit 事件
      compiled.querySelector<AuiButton>('aui-button#controls-submit-btn')!.click();
      fixture.detectChanges();
      const submitted = JSON.parse(component.submittedData) as Record<string, string>;
      expect(submitted).toMatchObject({ mode: 'decode', text: 'payload' });
    });
  });

  describe('7. Theme switcher (toggleTheme / getTheme API)', () => {
    it('toggles the theme through the library theme API', async () => {
      const themeBtn = compiled.querySelector<AuiButton>('aui-button#theme-toggle-btn')!;
      const root = document.documentElement;

      expect(root.getAttribute('data-theme')).toBeNull();
      expect(getTheme()).toBe('light');

      themeBtn.click();
      fixture.detectChanges();
      expect(root.getAttribute('data-theme')).toBe('dark');
      expect(getTheme()).toBe('dark');
      expect(component.isDark).toBe(true);
      expect(themeBtn.textContent).toContain('切換淺色模式');
      // 切換期間短暫套用過渡 class，結束後移除
      expect(root.classList.contains('theme-transitioning')).toBe(true);
      await vi.waitFor(() => expect(root.classList.contains('theme-transitioning')).toBe(false));

      themeBtn.click();
      fixture.detectChanges();
      expect(root.getAttribute('data-theme')).toBeNull();
      expect(getTheme()).toBe('light');
      expect(themeBtn.textContent).toContain('切換深色模式');
    });
  });
});
