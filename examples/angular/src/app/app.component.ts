import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ButtonSize, ButtonVariant } from '@anchor-ui/core';

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
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template,
  styles: [styles],
})
export class AppComponent {
  // ─── 全域主題切換 ───
  isDark = false;

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
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

  // ─── 4. IconButton 狀態 ───
  copySnippet = 'npm install @anchor-ui/core';
  iconPreset: 'copy' | 'download' | 'refresh' | 'external' = 'copy';
  copyFeedbackText = '';

  handleCopySuccess(event: Event): void {
    const customEvent = event as CustomEvent<{ value: string }>;
    this.copyFeedbackText = `已成功複製：${customEvent.detail.value}`;
  }

  handleDownload(event: Event): void {
    const customEvent = event as CustomEvent<{ filename?: string }>;
    this.copyFeedbackText = `下載事件觸發：${customEvent.detail.filename || 'default'}`;
  }
}
