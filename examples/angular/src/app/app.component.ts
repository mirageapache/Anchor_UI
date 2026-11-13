import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTheme, toggleTheme } from '@anchor-ui/core';
import type {
  AuiTooltip,
  ButtonSize,
  ButtonVariant,
  OutputStatus,
  SegmentedOption,
} from '@anchor-ui/core';

interface TagItem {
  id: number;
  label: string;
  variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  active: boolean;
}

import template from './app.component.html?raw';
import styles from './app.component.css?raw';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template,
  styles: [styles],
})
export class AppComponent {
  // ─── 全域主題切換（使用元件庫的主題 API） ───
  isDark = getTheme() === 'dark';

  handleToggleTheme(): void {
    this.isDark = toggleTheme() === 'dark';
  }

  // ─── 1. Button 狀態 ───
  buttonClickCount = 0;
  buttonVariant: ButtonVariant = 'primary';
  buttonSize: ButtonSize = 'md';
  buttonLoading = false;
  buttonDisabled = false;
  inputValue = 'Angular 19 Signal & Reactive State';
  lastSubmittedValue = '';

  handleButtonClick(): void {
    this.buttonClickCount++;
  }

  handleFormSubmit(): void {
    this.lastSubmittedValue = this.inputValue;
  }

  // ─── 2. Tag 狀態 ───
  tags: TagItem[] = [
    { id: 1, label: 'angular-19', variant: 'brand', active: true },
    { id: 2, label: 'typescript', variant: 'info', active: false },
    { id: 3, label: 'web-components', variant: 'purple', active: true },
    { id: 4, label: 'signals', variant: 'success', active: false },
    { id: 5, label: 'deprecated', variant: 'danger', active: false },
  ];
  isPill = true;
  selectedTagName = 'angular-19';

  handleTagClick(tag: TagItem): void {
    tag.active = !tag.active;
    this.selectedTagName = tag.label;
  }

  handleTagRemove(id: number): void {
    this.tags = this.tags.filter((t) => t.id !== id);
  }

  resetTags(): void {
    this.tags = [
      { id: 1, label: 'angular-19', variant: 'brand', active: true },
      { id: 2, label: 'typescript', variant: 'info', active: false },
      { id: 3, label: 'web-components', variant: 'purple', active: true },
      { id: 4, label: 'signals', variant: 'success', active: false },
      { id: 5, label: 'deprecated', variant: 'danger', active: false },
    ];
  }

  // ─── 3. Tooltip 狀態 ───
  tooltipContent = '即時 Angular 動態提示內容';
  tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  hasArrow = true;
  preventTooltipShow = false;
  tooltipEvents: string[] = [];

  @ViewChild('tooltipRef')
  private tooltipRef!: ElementRef<AuiTooltip>;

  /** 透過 @ViewChild 取得元素並呼叫元件方法 */
  showTooltip(): void {
    void this.tooltipRef.nativeElement.show();
  }

  hideTooltip(): void {
    void this.tooltipRef.nativeElement.hide();
  }

  /** 可取消的 (aui-show)：勾選「阻止開啟」時呼叫 preventDefault() */
  handleTooltipShow(event: Event): void {
    if (this.preventTooltipShow) {
      event.preventDefault();
      this.tooltipEvents.push('aui-show（已取消）');
      return;
    }
    this.tooltipEvents.push('aui-show');
  }

  logTooltipEvent(event: Event): void {
    this.tooltipEvents.push(event.type);
  }

  // ─── 4. IconButton 狀態 ───
  copySnippet = 'npm install @anchor-ui/core';
  iconPreset: 'copy' | 'download' | 'refresh' | 'external' = 'copy';
  copyFeedbackText = '';
  downloadUrl = '';
  statusChanges: string[] = [];

  handleCopySuccess(event: Event): void {
    const customEvent = event as CustomEvent<{ value: string }>;
    this.copyFeedbackText = `已成功複製：${customEvent.detail.value}`;
  }

  handleDownload(event: Event): void {
    const customEvent = event as CustomEvent<{ filename?: string }>;
    this.copyFeedbackText = `下載事件觸發：${customEvent.detail.filename || 'default'}`;
  }

  handleCopyError(): void {
    this.copyFeedbackText = '複製失敗：沒有可複製的內容';
  }

  handleDownloadError(event: Event): void {
    const customEvent = event as CustomEvent<{ url: string }>;
    this.copyFeedbackText = `下載被拒絕：${customEvent.detail.url}`;
  }

  handleStatusChange(event: Event): void {
    const { status, previousStatus } = (
      event as CustomEvent<{ status: string; previousStatus: string }>
    ).detail;
    this.statusChanges.push(`${previousStatus}→${status}`);
  }

  // ─── 5. 表單元件 ngModel / formControl 狀態（TASK-209） ───
  textValue = 'Hello, Anchor UI!';
  mode = 'encode';
  decodeDisabled = false;
  modeOptions: SegmentedOption[] = this.buildModeOptions();
  lastChangedMode = '';
  submittedData = '';
  outputCopyText = '';
  reactiveControl = new FormControl('Reactive value', { nonNullable: true });

  /** 以 UTF-8 進行 Base64 編碼／解碼，解碼失敗時以錯誤狀態呈現 */
  get conversion(): { text: string; status: OutputStatus } {
    if (!this.textValue) return { text: '', status: 'success' };
    try {
      if (this.mode === 'encode') {
        const bytes = new TextEncoder().encode(this.textValue);
        return { text: btoa(String.fromCharCode(...bytes)), status: 'success' };
      }
      const bytes = Uint8Array.from(atob(this.textValue.trim()), (char) => char.charCodeAt(0));
      return { text: new TextDecoder('utf-8', { fatal: true }).decode(bytes), status: 'success' };
    } catch {
      return { text: '無效的 Base64 輸入', status: 'error' };
    }
  }

  /**
   * 以新的陣列重新綁定 [options]（不用 getter：每次變更偵測都回傳新陣列，
   * 會觸發 ExpressionChangedAfterItHasBeenChecked 並讓元件不必要地重新渲染）
   */
  setDecodeDisabled(disabled: boolean): void {
    this.decodeDisabled = disabled;
    this.modeOptions = this.buildModeOptions();
  }

  private buildModeOptions(): SegmentedOption[] {
    return [
      { value: 'encode', label: '編碼' },
      { value: 'decode', label: '解碼', disabled: this.decodeDisabled },
    ];
  }

  /** <aui-field> 內建複製鈕成功時，(aui-copy) 由欄位冒出 */
  handleOutputCopy(event: Event): void {
    this.outputCopyText = (event as CustomEvent<{ value: string }>).detail.value;
  }

  /** 原生 (change) 事件（取代 Phase 1 原規劃的 (auiChange)）：觸發時元件的 value 已更新 */
  handleModeChange(event: Event): void {
    this.lastChangedMode = (event.target as HTMLElement & { value: string }).value;
  }

  /** 以原生 FormData 讀取表單元件的提交值 */
  handleControlsSubmit(event: Event): void {
    const form = event.target as HTMLFormElement;
    this.submittedData = JSON.stringify(Object.fromEntries(new FormData(form)));
  }
}
