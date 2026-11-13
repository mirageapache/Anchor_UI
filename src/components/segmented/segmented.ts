import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { segmentedStyles } from './segmented.styles.js';
import { FormControlController } from '../../internal/form-control.js';
import type { SegmentedOption } from './segmented.types.js';

let valueMissingMessage: string | undefined;

/** 必填未選取時的提示訊息：借用瀏覽器原生 radio 的在地化文字 */
function radioValueMissingMessage(): string {
  if (valueMissingMessage === undefined) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.required = true;
    valueMissingMessage = radio.validationMessage || '請選擇其中一個選項。';
  }
  return valueMissingMessage;
}

/**
 * Anchor UI — Segmented Control 元件 (`<aui-segmented>`)
 *
 * 膠囊軌道單選切換器，選中項以品牌色實心高亮並平滑過渡。
 * 採 WAI-ARIA radiogroup 模式（roving tabindex）：Tab 只停留在選中項，
 * 左右（上下）方向鍵、Home、End 巡覽並自動選取，停用的選項會被略過；RTL 時左右方向對調。
 *
 * 為 form-associated custom element：可參與原生 `<form>` 提交（未選取時不提交）、`required` 驗證、
 * `form.reset()` 與 `<fieldset disabled>`；不支援 ElementInternals 時退回以 light DOM 隱藏 input 提交。
 * 使用者改變選取時於 host 分派 `input` 與 `change`，觸發時 `value` 已更新。
 *
 * @element aui-segmented
 *
 * @csspart base - 膠囊軌道（radiogroup）
 * @csspart option - 每個選項按鈕（radio）
 * @csspart option-checked - 選中的選項
 * @csspart option-disabled - 停用的選項
 *
 * @fires input - 使用者改變選取時分派，觸發時 `value` 已更新
 * @fires change - 使用者改變選取時於 `input` 之後分派，觸發時 `value` 已更新
 */
export class AuiSegmented extends LitElement {
  static override styles = segmentedStyles;

  /** 宣告為 form-associated custom element，透過 ElementInternals 參與表單 */
  static formAssociated = true;

  /** 表單參與（ElementInternals 或隱藏 input 退回方案） */
  private readonly formControl = new FormControlController(this, () => this.formResetCallback());

  private currentValue = '';

  /**
   * 對應原生的 dirty 狀態：值被使用者或程式改動後，
   * `value` 屬性（即 defaultValue）的變更不再覆寫目前值；`form.reset()` 時清除。
   */
  private dirty = false;

  private customValidityMessage = '';

  @queryAll('.option')
  private optionButtons!: NodeListOf<HTMLButtonElement>;

  /** 由所屬 `<fieldset disabled>` 或自身 disabled 屬性決定的表單停用狀態 */
  @state()
  private formDisabled = false;

  /**
   * 選項清單；於 HTML 中可用 JSON 字串設定 `options` 屬性
   */
  @property({ type: Array })
  options: SegmentedOption[] = [];

  /**
   * 目前選取的值（未選取為空字串）。以程式設定後，`value` 屬性的變更不再覆寫
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
   * 預設選取的值，對應 HTML 的 `value` 屬性；`form.reset()` 時還原為此值
   */
  @property({ attribute: 'value' })
  defaultValue = '';

  /**
   * 表單欄位名稱（提交時的鍵）
   */
  @property({ type: String, reflect: true })
  name = '';

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
   * 是否停用整個控制器（不可聚焦、不隨表單提交）
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 是否為必填（未選取時阻擋表單提交）
   */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * 所屬的表單（包含以 `form` 屬性指定的外部表單）
   */
  get form(): HTMLFormElement | null {
    return this.formControl.form;
  }

  /**
   * 驗證狀態（不支援 ElementInternals 的環境為 undefined）
   */
  get validity(): ValidityState | undefined {
    return this.formControl.internals?.validity;
  }

  /**
   * 驗證失敗時的提示訊息
   */
  get validationMessage(): string {
    return this.formControl.internals?.validationMessage ?? this.validityProblem?.message ?? '';
  }

  /**
   * 是否參與表單驗證（停用時為 false）
   */
  get willValidate(): boolean {
    return this.formControl.internals?.willValidate ?? !this.isDisabled;
  }

  /**
   * 檢查是否通過驗證（失敗時分派 invalid 事件）
   */
  checkValidity(): boolean {
    return this.formControl.internals?.checkValidity() ?? !this.validityProblem;
  }

  /**
   * 檢查是否通過驗證，失敗時於控制器旁顯示瀏覽器原生提示
   */
  reportValidity(): boolean {
    return this.formControl.internals?.reportValidity() ?? !this.validityProblem;
  }

  /**
   * 設定自訂驗證錯誤訊息；傳入空字串即清除
   */
  setCustomValidity(message: string): void {
    this.customValidityMessage = message;
    this.syncValidity();
  }

  /**
   * 聚焦目前的 Tab 停留點（選中項，未選取時為第一個可用選項）
   */
  override focus(options?: FocusOptions): void {
    this.optionButtons[this.tabStopIndex]?.focus(options);
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

  /** @internal 瀏覽器還原表單狀態（返回上一頁）時呼叫 */
  formStateRestoreCallback(restored: string | File | FormData | null): void {
    if (typeof restored === 'string') this.value = restored;
  }

  private get isDisabled(): boolean {
    return this.disabled || this.formDisabled;
  }

  private get selectedIndex(): number {
    return this.currentValue === ''
      ? -1
      : this.options.findIndex((option) => option.value === this.currentValue);
  }

  /** roving tabindex 的停留點：選中且可用的選項，否則為第一個可用選項 */
  private get tabStopIndex(): number {
    const selected = this.selectedIndex;
    if (selected >= 0 && !this.options[selected].disabled) return selected;
    return this.options.findIndex((option) => !option.disabled);
  }

  /** 目前的驗證問題（自訂錯誤優先）；通過驗證為 null */
  private get validityProblem(): { flags: ValidityStateFlags; message: string } | null {
    if (this.isDisabled) return null;
    if (this.customValidityMessage) {
      return { flags: { customError: true }, message: this.customValidityMessage };
    }
    if (this.required && this.selectedIndex < 0) {
      return { flags: { valueMissing: true }, message: radioValueMissingMessage() };
    }
    return null;
  }

  private applyValue(next: string): void {
    const previous = this.currentValue;
    this.currentValue = String(next ?? '');
    this.syncFormValue();
    this.syncValidity();
    this.requestUpdate('value', previous);
  }

  /** 只有值對應到現有選項時才提交（與未選取的 radio 群組相同） */
  private syncFormValue(): void {
    this.formControl.setValue(this.selectedIndex >= 0 ? this.currentValue : null);
  }

  private syncValidity(): void {
    const internals = this.formControl.internals;
    if (!internals) return;
    const problem = this.validityProblem;
    if (problem) {
      internals.setValidity(problem.flags, problem.message, this.optionButtons[this.tabStopIndex]);
    } else {
      internals.setValidity({});
    }
  }

  /** 由 index 往 direction 方向找下一個可用選項（循環）；找不到時回傳原 index */
  private step(from: number, direction: 1 | -1): number {
    const count = this.options.length;
    for (let offset = 1; offset <= count; offset++) {
      const index = (from + direction * offset + count) % count;
      if (!this.options[index].disabled) return index;
    }
    return from;
  }

  /** 使用者選取：聚焦該選項，值改變時分派 input 與 change */
  private selectByUser(index: number): void {
    const option = this.options[index];
    if (!option || option.disabled || this.isDisabled) return;
    this.optionButtons[index]?.focus();
    if (option.value === this.currentValue) return;
    this.value = option.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private handleClick = (event: Event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.option');
    if (button) this.selectByUser(Number(button.dataset.index));
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.option');
    if (!button || this.isDisabled) return;
    const current = Number(button.dataset.index);
    const rtl = getComputedStyle(this).direction === 'rtl';
    const forward = (key: string) =>
      key === 'ArrowDown' || key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const backward = (key: string) =>
      key === 'ArrowUp' || key === (rtl ? 'ArrowRight' : 'ArrowLeft');

    let next: number;
    if (forward(event.key)) next = this.step(current, 1);
    else if (backward(event.key)) next = this.step(current, -1);
    else if (event.key === 'Home') next = this.step(this.options.length - 1, 1);
    else if (event.key === 'End') next = this.step(0, -1);
    else return;

    event.preventDefault();
    this.selectByUser(next);
  };

  override willUpdate(changed: PropertyValues<this>): void {
    // 未被改動前，value 跟隨預設值（與原生表單控制項相同）
    if (changed.has('defaultValue') && !this.dirty) {
      this.applyValue(this.defaultValue);
    } else if (changed.has('options')) {
      // 選項改變可能讓目前的值對應或不再對應到選項
      this.syncFormValue();
    }
  }

  override updated(): void {
    // 驗證錨點（選項按鈕）於渲染後才存在
    this.syncValidity();
  }

  override render() {
    const isDisabled = this.isDisabled;
    const selected = this.selectedIndex;
    const tabStop = this.tabStopIndex;

    return html`
      <div
        part="base"
        class=${classMap({ segmented: true, 'segmented--disabled': isDisabled })}
        role="radiogroup"
        aria-label=${ifDefined(this.label || undefined)}
        aria-describedby=${ifDefined(this.description ? 'description' : undefined)}
        aria-required=${ifDefined(this.required ? 'true' : undefined)}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        ${this.options.map((option, index) => {
          const checked = index === selected;
          const parts = [
            'option',
            checked && 'option-checked',
            option.disabled && 'option-disabled',
          ];
          return html`
            <button
              type="button"
              part=${parts.filter(Boolean).join(' ')}
              class="option"
              role="radio"
              aria-checked=${checked ? 'true' : 'false'}
              tabindex=${index === tabStop ? 0 : -1}
              data-index=${index}
              ?disabled=${isDisabled || Boolean(option.disabled)}
            >
              <span class="option__label" data-text=${option.label}>${option.label}</span>
            </button>
          `;
        })}
      </div>
      ${
        this.description
          ? html`<span id="description" class="sr-only">${this.description}</span>`
          : nothing
      }
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-segmented')) {
  customElements.define('aui-segmented', AuiSegmented);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-segmented': AuiSegmented;
  }
}
