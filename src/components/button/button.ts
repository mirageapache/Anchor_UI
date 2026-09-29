import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { buttonStyles } from './button.styles.js';
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
  static override styles = buttonStyles;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

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
    // 捕獲階段攔截點擊：當處於 disabled 或 loading 時徹底中斷冒泡與監聽
    this.addEventListener('click', this.handleHostClick, { capture: true });
  }

  private handleHostClick = (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    // 與周圍 Form 表單原生連動
    if (this.type === 'submit') {
      const form = this.closest('form');
      if (form) {
        event.preventDefault();
        form.requestSubmit();
      }
    } else if (this.type === 'reset') {
      const form = this.closest('form');
      if (form) {
        event.preventDefault();
        form.reset();
      }
    }
  };

  /**
   * 主動聚焦內部原生按鈕
   */
  override focus(options?: FocusOptions): void {
    this.shadowRoot?.querySelector<HTMLButtonElement>('button')?.focus(options);
  }

  /**
   * 主動移除內部原生按鈕焦點
   */
  override blur(): void {
    this.shadowRoot?.querySelector<HTMLButtonElement>('button')?.blur();
  }

  override render() {
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
        ?disabled=${isInactive}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${isInactive ? 'true' : 'false'}
      >
        ${
          this.loading
            ? html`
                <span class="btn__spinner" part="spinner" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                  </svg>
                </span>
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
