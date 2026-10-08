import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../src/app/app.component';

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
    it('renders all four Anchor UI web components without Angular schema/template errors', () => {
      const button = compiled.querySelector<AuiButton>('aui-button#target-button');
      const tag = compiled.querySelector<AuiTag>('aui-tag#tag-1');
      const tooltip = compiled.querySelector<AuiTooltip>('aui-tooltip#test-tooltip');
      const iconBtn = compiled.querySelector<AuiIconButton>('aui-icon-button#target-icon-btn');

      expect(button).not.toBeNull();
      expect(tag).not.toBeNull();
      expect(tooltip).not.toBeNull();
      expect(iconBtn).not.toBeNull();
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
  });

  describe('6. Theme switcher (CSS Custom Properties in Shadow DOM)', () => {
    it('toggles data-theme attribute on document root', () => {
      const themeBtn = compiled.querySelector<AuiButton>('aui-button#theme-toggle-btn')!;

      expect(document.documentElement.getAttribute('data-theme')).toBeNull();

      themeBtn.click();
      fixture.detectChanges();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      themeBtn.click();
      fixture.detectChanges();
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });
});
