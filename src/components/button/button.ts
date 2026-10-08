import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { buttonStyles } from './button.styles.js';
import { interceptInactiveClick } from '../../internal/inactive-click.js';
import { spinnerIcon, spinnerStyles } from '../../internal/spinner.js';
import type { ButtonSize, ButtonType, ButtonVariant } from './button.types.js';

/**
 * Anchor UI — Button 元件 (`<aui-button>`)
 *
 * 系統核心互動元件，支援 5 種語意層級變體、3 種尺寸規格、鍵盤可聚焦性、
 * 點擊微縮放動態、載入中 Spinner 以及與宿主表單（form）的原生提交互動。
 *
 * @element aui-button
 *
 * @slot - 按鈕主體文字內容
 * @slot prefix - 按鈕前綴圖示或標籤
 * @slot suffix - 按鈕後綴圖示
 *
 * @csspart button - 內部原生 `<button>` 元素容器
 * @csspart spinner - 載入中動畫指示器
 * @csspart prefix - 前綴內容包裝容器
 * @csspart label - 主內容包裝容器
 * @csspart suffix - 後綴內容包裝容器
 */
export class AuiButton extends LitElement {
  static override styles = [spinnerStyles, buttonStyles];

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * 宣告為 form-associated custom element：透過 ElementInternals 取得表單擁有者，
   * 支援 `form="id"` 屬性指向外部表單（closest('form') 無法做到）
   */
  static formAssociated = true;

  /** 不支援 ElementInternals 的環境（happy-dom、舊版瀏覽器）為 null，改以 DOM 查找表單 */
  private readonly internals: ElementInternals | null;

  /**
   * 語意層級變體
   */
  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'primary';

  /**
   * 尺寸規格
   */
  @property({ type: String, reflect: true })
  size: ButtonSize = 'md';

  /**
   * 按鈕原生行為類型
   */
  @property({ type: String, reflect: true })
  type: ButtonType = 'button';

  /**
   * 是否處於停用狀態
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 是否處於載入中狀態（阻止點擊並顯示 Spinner）
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * 是否撐滿父層容器寬度
   */
  @property({ type: Boolean, reflect: true, attribute: 'full-width' })
  fullWidth = false;

  constructor() {
    super();
    this.internals = typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    // 捕獲階段攔截點擊：當處於 disabled 或 loading 時徹底中斷冒泡與監聽
    this.addEventListener('click', this.handleHostClick, { capture: true });
  }

  /**
   * 所屬的表單（包含以 `form` 屬性指定的外部表單）
   */
  get form(): HTMLFormElement | null {
    if (this.internals) return this.internals.form;

    const formId = this.getAttribute('form');
    if (formId) {
      const root = this.getRootNode() as Document | ShadowRoot;
      const referenced = root.getElementById?.(formId);
      return referenced instanceof HTMLFormElement ? referenced : null;
    }
    return this.closest('form');
  }

  private handleHostClick = (event: MouseEvent) => {
    if (interceptInactiveClick(event, this.disabled || this.loading)) return;

    // 與所屬 Form 表單原生連動
    const form = this.form;
    if (!form) return;
    if (this.type === 'submit') {
      event.preventDefault();
      form.requestSubmit();
    } else if (this.type === 'reset') {
      event.preventDefault();
      form.reset();
    }
  };

  override render() {
    // loading 只以 aria-disabled 標示並由 handleHostClick 攔截點擊，不設原生 disabled：
    // 否則聚焦中的按鈕進入 loading 時會失去焦點（焦點掉回 body）
    const isInactive = this.disabled || this.loading;

    return html`
      <button
        part="button"
        class=${classMap({
          btn: true,
          [`btn--${this.variant}`]: true,
          [`btn--${this.size}`]: true,
          'btn--disabled': this.disabled,
          'btn--loading': this.loading,
        })}
        type=${this.type}
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${isInactive ? 'true' : 'false'}
      >
        ${
          this.loading
            ? html`
                <span class="btn__spinner" part="spinner" aria-hidden="true">${spinnerIcon}</span>
              `
            : html`
                <span class="btn__prefix" part="prefix">
                  <slot name="prefix"></slot>
                </span>
              `
        }

        <span class="btn__label" part="label">
          <slot></slot>
        </span>

        ${
          !this.loading
            ? html`
                <span class="btn__suffix" part="suffix">
                  <slot name="suffix"></slot>
                </span>
              `
            : nothing
        }
      </button>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-button')) {
  customElements.define('aui-button', AuiButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-button': AuiButton;
  }
}
