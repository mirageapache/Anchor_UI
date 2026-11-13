import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { findFormOwner } from './form-owner.js';

/** 使用 FormControlController 的元件需具備的屬性 */
export interface FormControlHost extends ReactiveControllerHost, HTMLElement {
  name: string;
  disabled: boolean;
}

/**
 * 表單控制項的共用參與邏輯（form-associated custom element）：
 *
 * - 支援 ElementInternals 時，以 `setFormValue` 提交值，表單擁有者與驗證由 `internals` 提供。
 * - 不支援時（happy-dom、舊版瀏覽器）退回以 light DOM 的隱藏 input 提交，
 *   並監聽所屬表單的 `reset` 事件代替 `formResetCallback`。
 *
 * 須於元件建構式中建立（`attachInternals` 只能在建構時呼叫）。
 */
export class FormControlController implements ReactiveController {
  /** 不支援 ElementInternals 的環境為 null */
  readonly internals: ElementInternals | null;

  private submitValue: string | null = null;
  private fallbackInput: HTMLInputElement | null = null;
  private fallbackForm: HTMLFormElement | null = null;

  constructor(
    private readonly host: FormControlHost,
    /** 退回方案中，所屬表單 reset 時呼叫（支援 ElementInternals 時由 formResetCallback 處理） */
    private readonly onFallbackReset: () => void,
  ) {
    this.internals = typeof host.attachInternals === 'function' ? host.attachInternals() : null;
    host.addController(this);
  }

  /** 所屬的表單（包含以 `form` 屬性指定的外部表單） */
  get form(): HTMLFormElement | null {
    return this.internals ? this.internals.form : findFormOwner(this.host);
  }

  /**
   * 設定隨表單提交的值；null 代表不提交（如未選取任何選項的 radio 群組）。
   * 同步執行，事件監聽者讀取 FormData 時即為最新值。
   */
  setValue(value: string | null): void {
    this.submitValue = value;
    this.internals?.setFormValue(value);
  }

  hostConnected(): void {
    if (this.internals) return;
    this.fallbackForm = findFormOwner(this.host);
    this.fallbackForm?.addEventListener('reset', this.handleFallbackReset);
  }

  hostDisconnected(): void {
    this.fallbackForm?.removeEventListener('reset', this.handleFallbackReset);
    this.fallbackForm = null;
  }

  hostUpdated(): void {
    this.syncFallbackInput();
  }

  private handleFallbackReset = () => {
    this.onFallbackReset();
  };

  /** 退回方案：以 light DOM 的隱藏 input 帶出 name / value */
  private syncFallbackInput(): void {
    if (this.internals) return;
    const { host } = this;
    if (!host.name || this.submitValue === null) {
      this.fallbackInput?.remove();
      this.fallbackInput = null;
      return;
    }
    const input = (this.fallbackInput ??= document.createElement('input'));
    input.type = 'hidden';
    input.name = host.name;
    input.value = this.submitValue;
    input.disabled = host.disabled;
    const formId = host.getAttribute('form');
    if (formId) input.setAttribute('form', formId);
    else input.removeAttribute('form');
    if (input.parentNode !== host) host.append(input);
  }
}
