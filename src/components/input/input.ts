import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { inputStyles } from './input.styles.js';
import { findFormOwner } from '../../internal/form-owner.js';
import type { InputType } from './input.types.js';

/**
 * Anchor UI — Input 元件 (`<aui-input>`)
 *
 * 等寬字體的單行／多行文字輸入框，具備 Focus 雙層光環與錯誤狀態。
 * 為 form-associated custom element：可參與原生 `<form>` 提交、`required` 等驗證、
 * `form.reset()` 與 `<fieldset disabled>`；不支援 ElementInternals 時退回以 light DOM 隱藏 input 提交。
 *
 * 標題與描述（`label` / `description`）在元件自身的 Shadow DOM 內與輸入框建立關聯，
 * 因 IDREF 無法跨 Shadow DOM 邊界解析；搭配 `<aui-field>` 時由 field 自動傳入。
 *
 * @element aui-input
 *
 * @csspart control - 內部原生 `<input>` 或 `<textarea>` 元素
 *
 * @fires input - 每次輸入時分派（原生事件穿出 Shadow DOM），觸發時 `value` 已更新
 * @fires change - 內容提交時（失焦或 Enter）於 host 重新分派，觸發時 `value` 已更新
 */
export class AuiInput extends LitElement {
  static override styles = inputStyles;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** 宣告為 form-associated custom element，透過 ElementInternals 參與表單 */
  static formAssociated = true;

  /** 不支援 ElementInternals 的環境（happy-dom、舊版瀏覽器）為 null，改以隱藏 input 參與表單 */
  private readonly internals: ElementInternals | null;

  /** 退回方案：放在 light DOM、隨表單提交的隱藏 input */
  private fallbackInput: HTMLInputElement | null = null;

  /** 退回方案：監聽 reset 事件的表單 */
  private fallbackForm: HTMLFormElement | null = null;

  private currentValue = '';

  /**
   * 對應原生的 dirty value flag：值被使用者或程式改動後，
   * `value` 屬性（即 defaultValue）的變更不再覆寫目前值；`form.reset()` 時清除。
   */
  private dirty = false;

  private customValidityMessage = '';

  @query('.control')
  private control?: HTMLInputElement | HTMLTextAreaElement;

  /** 由所屬 `<fieldset disabled>` 或自身 disabled 屬性決定的表單停用狀態 */
  @state()
  private formDisabled = false;

  /**
   * 目前的值。以程式設定後，`value` 屬性的變更不再覆寫（與原生 input 相同）
   */
  @property({ attribute: false })
  get value(): string {
    return this.currentValue;
  }

  set value(next: string) {
    this.dirty = true;
    this.applyValue(next);
  }

  /**
   * 預設值，對應 HTML 的 `value` 屬性；`form.reset()` 時還原為此值
   */
  @property({ attribute: 'value' })
  defaultValue = '';

  /**
   * 表單欄位名稱（提交時的鍵）
   */
  @property({ type: String, reflect: true })
  name = '';

  /**
   * 單行輸入框的原生類型
   */
  @property({ type: String, reflect: true })
  type: InputType = 'text';

  /**
   * 是否為多行輸入（改以 `<textarea>` 呈現，可垂直調整高度）
   */
  @property({ type: Boolean, reflect: true })
  multiline = false;

  /**
   * 多行輸入的預設可見行數
   */
  @property({ type: Number })
  rows = 3;

  /**
   * 佔位提示文字
   */
  @property({ type: String })
  placeholder = '';

  /**
   * 無障礙名稱（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的標題自動帶入
   */
  @property({ type: String })
  label = '';

  /**
   * 無障礙描述（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的描述自動帶入
   */
  @property({ type: String })
  description = '';

  /**
   * 是否處於停用狀態（不可聚焦、不隨表單提交）
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 是否唯讀（可聚焦與選取，不可編輯，不參與驗證）
   */
  @property({ type: Boolean, reflect: true, attribute: 'readonly' })
  readOnly = false;

  /**
   * 是否為必填（空值時阻擋表單提交）
   */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * 是否以錯誤狀態呈現（紅色邊框並輸出 aria-invalid），用於伺服器端或自訂驗證結果
   */
  @property({ type: Boolean, reflect: true })
  invalid = false;

  /**
   * 最少字元數
   */
  @property({ type: Number, attribute: 'minlength' })
  minLength?: number;

  /**
   * 最多字元數
   */
  @property({ type: Number, attribute: 'maxlength' })
  maxLength?: number;

  /**
   * 單行輸入的格式驗證正規表示式（多行輸入不支援）
   */
  @property({ type: String })
  pattern?: string;

  /**
   * 瀏覽器自動完成提示（如 'email'、'off'）
   */
  @property({ type: String })
  autocomplete?: string;

  constructor() {
    super();
    this.internals = typeof this.attachInternals === 'function' ? this.attachInternals() : null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.internals) {
      this.fallbackForm = findFormOwner(this);
      this.fallbackForm?.addEventListener('reset', this.handleFallbackReset);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.fallbackForm?.removeEventListener('reset', this.handleFallbackReset);
    this.fallbackForm = null;
  }

  /**
   * 所屬的表單（包含以 `form` 屬性指定的外部表單）
   */
  get form(): HTMLFormElement | null {
    return this.internals ? this.internals.form : findFormOwner(this);
  }

  /**
   * 驗證狀態（首次渲染前，於不支援 ElementInternals 的環境為 undefined）
   */
  get validity(): ValidityState | undefined {
    return this.internals?.validity ?? this.control?.validity;
  }

  /**
   * 驗證失敗時的提示訊息
   */
  get validationMessage(): string {
    return this.internals?.validationMessage ?? this.control?.validationMessage ?? '';
  }

  /**
   * 是否參與表單驗證（停用、唯讀時為 false）
   */
  get willValidate(): boolean {
    return this.internals?.willValidate ?? this.control?.willValidate ?? false;
  }

  /**
   * 檢查是否通過驗證（失敗時分派 invalid 事件）
   */
  checkValidity(): boolean {
    return this.internals?.checkValidity() ?? this.control?.checkValidity() ?? true;
  }

  /**
   * 檢查是否通過驗證，失敗時於輸入框旁顯示瀏覽器原生提示
   */
  reportValidity(): boolean {
    return this.internals?.reportValidity() ?? this.control?.reportValidity() ?? true;
  }

  /**
   * 設定自訂驗證錯誤訊息；傳入空字串即清除
   */
  setCustomValidity(message: string): void {
    this.customValidityMessage = message;
    this.syncValidity();
  }

  /**
   * 清空內容，並如同使用者操作般分派 `input` 與 `change`（讓框架的雙向綁定同步）。
   * 停用、唯讀或已為空值時不動作。
   */
  clear(): void {
    if (this.isDisabled || this.readOnly || !this.value) return;
    this.value = '';
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** @internal 表單 reset 時還原為預設值 */
  formResetCallback(): void {
    this.dirty = false;
    this.applyValue(this.defaultValue);
  }

  /** @internal 自身 disabled 屬性或所屬 `<fieldset disabled>` 改變時由瀏覽器呼叫 */
  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
  }

  /** @internal 瀏覽器還原表單狀態（返回上一頁、自動填入）時呼叫 */
  formStateRestoreCallback(restored: string | File | FormData | null): void {
    if (typeof restored === 'string') this.value = restored;
  }

  private get isDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  /** 更新目前值並同步表單值（同步執行，事件監聽者讀取 FormData 時即為最新值） */
  private applyValue(next: string): void {
    const previous = this.currentValue;
    this.currentValue = String(next ?? '');
    this.internals?.setFormValue(this.currentValue);
    this.requestUpdate('value', previous);
  }

  /** 以內部原生控制項為唯一驗證來源，鏡像至 ElementInternals */
  private syncValidity(): void {
    const control = this.control;
    if (!control) return;
    control.setCustomValidity(this.customValidityMessage);
    if (!this.internals) return;
    if (control.validity.valid || !control.willValidate) {
      this.internals.setValidity({});
    } else {
      this.internals.setValidity(control.validity, control.validationMessage, control);
    }
  }

  /** 退回方案：以 light DOM 的隱藏 input 帶出 name / value */
  private syncFallbackInput(): void {
    if (this.internals) return;
    if (!this.name) {
      this.fallbackInput?.remove();
      this.fallbackInput = null;
      return;
    }
    const input = (this.fallbackInput ??= document.createElement('input'));
    input.type = 'hidden';
    input.name = this.name;
    input.value = this.value;
    input.disabled = this.disabled;
    const formId = this.getAttribute('form');
    if (formId) input.setAttribute('form', formId);
    else input.removeAttribute('form');
    if (input.parentNode !== this) this.append(input);
  }

  private handleFallbackReset = () => {
    this.formResetCallback();
  };

  private handleInput = (event: Event) => {
    this.value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.syncValidity();
  };

  /** 原生 change 不具 composed、不會穿出 Shadow DOM，須於 host 重新分派 */
  private handleChange = (event: Event) => {
    this.value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  override willUpdate(changed: PropertyValues<this>): void {
    // 未被改動前，value 跟隨預設值（與原生 input 的 value 屬性相同）
    if (changed.has('defaultValue') && !this.dirty) {
      this.applyValue(this.defaultValue);
    }
  }

  override updated(): void {
    this.syncValidity();
    this.syncFallbackInput();
  }

  override render() {
    const isDisabled = this.isDisabled;
    const classes = classMap({
      control: true,
      'control--invalid': this.invalid,
    });
    const describedBy = this.description ? 'description' : undefined;
    const ariaInvalid = this.invalid ? 'true' : undefined;
    const placeholder = this.placeholder || undefined;

    const control = this.multiline
      ? html`
          <textarea
            id="control"
            part="control"
            class=${classes}
            .value=${live(this.value)}
            rows=${this.rows}
            placeholder=${ifDefined(placeholder)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            autocomplete=${ifDefined(this.autocomplete)}
            aria-describedby=${ifDefined(describedBy)}
            aria-invalid=${ifDefined(ariaInvalid)}
            ?disabled=${isDisabled}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            @input=${this.handleInput}
            @change=${this.handleChange}
          ></textarea>
        `
      : html`
          <input
            id="control"
            part="control"
            class=${classes}
            type=${this.type}
            .value=${live(this.value)}
            placeholder=${ifDefined(placeholder)}
            minlength=${ifDefined(this.minLength)}
            maxlength=${ifDefined(this.maxLength)}
            pattern=${ifDefined(this.pattern)}
            autocomplete=${ifDefined(this.autocomplete)}
            aria-describedby=${ifDefined(describedBy)}
            aria-invalid=${ifDefined(ariaInvalid)}
            ?disabled=${isDisabled}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            @input=${this.handleInput}
            @change=${this.handleChange}
          />
        `;

    return html`
      ${this.label ? html`<label class="sr-only" for="control">${this.label}</label>` : nothing}
      ${control}
      ${
        this.description
          ? html`<span id="description" class="sr-only">${this.description}</span>`
          : nothing
      }
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-input')) {
  customElements.define('aui-input', AuiInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-input': AuiInput;
  }
}
