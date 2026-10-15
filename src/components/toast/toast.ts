import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { keyed } from 'lit/directives/keyed.js';
import { toastStyles } from './toast.styles.js';
import { spinnerIcon, spinnerStyles } from '../../internal/spinner.js';
import { STATUS_ICONS, STATUS_TEXT } from '../../internal/status-icons.js';
import type { ToastVariant } from './toast.types.js';

const VARIANTS = new Set<ToastVariant>(['success', 'error', 'warning', 'info', 'loading']);

/**
 * Anchor UI — Toast 元件 (`<aui-toast>`)
 *
 * 通知卡片：狀態圖示、標題、訊息與關閉鈕，支援 Success、Error、Warning、Info、Loading 5 種狀態。
 * 一般請使用 `ToastService`（右下角堆疊、佇列、自動關閉與懸停暫停）；直接放在頁面上時為靜態卡片，
 * 點擊關閉鈕只會分派 `aui-close`，由使用端自行移除。
 *
 * - **播報**：文字區為 live region（Error 為 `role="alert"`，其餘為 `role="status"`），前綴狀態文字（如「錯誤：」）。
 *   插入頁面時先渲染空的 live region、下一幀才填入內容，讓螢幕閱讀器以「內容變更」播報；
 *   之後更新訊息（例如 loading 轉 success）也會再次播報。
 * - **動態**：進場滑入、退場淡出（遵循減少動畫設定）；被移動時（例如隨 Modal 移入其子樹）不重播進場動畫。
 *
 * @element aui-toast
 *
 * @slot - 訊息之後的額外內容
 *
 * @csspart base - 卡片
 * @csspart icon - 狀態圖示
 * @csspart content - 文字區（live region）
 * @csspart title - 標題
 * @csspart message - 訊息
 * @csspart close-button - 關閉鈕
 *
 * @fires aui-close - 點擊關閉鈕時觸發（ToastService 建立的通知會隨之關閉）
 */
export class AuiToast extends LitElement {
  static override styles = [spinnerStyles, toastStyles];

  /**
   * 狀態
   */
  @property({ type: String, reflect: true })
  variant: ToastVariant = 'info';

  /**
   * 標題
   */
  @property({ type: String })
  heading = '';

  /**
   * 訊息
   */
  @property({ type: String })
  message = '';

  /**
   * 是否隱藏關閉鈕
   */
  @property({ type: Boolean, attribute: 'no-close-button' })
  noCloseButton = false;

  /**
   * @internal 退場動畫中（由 ToastService 設定）
   */
  @property({ type: Boolean, reflect: true })
  leaving = false;

  /** live region 是否已填入內容（插入頁面後下一幀才填入） */
  @state()
  private announced = false;

  /** 進場動畫是否已播放完畢 */
  @state()
  private entered = false;

  private announceScheduled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.announced || this.announceScheduled) return;
    this.announceScheduled = true;
    // 兩幀：確保空的 live region 已進入無障礙樹，填入內容時才會被視為變更而播報
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.announced = true;
      }),
    );
  }

  private get resolvedVariant(): ToastVariant {
    return VARIANTS.has(this.variant) ? this.variant : 'info';
  }

  private handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget) this.entered = true;
  };

  private handleClose = () => {
    this.dispatchEvent(new CustomEvent('aui-close', { bubbles: true, composed: true }));
  };

  private renderContent(variant: ToastVariant) {
    if (!this.announced) return nothing;
    const statusText = variant === 'loading' ? '載入中' : STATUS_TEXT[variant];
    return html`
      <span class="sr-only">${statusText}：</span>
      ${this.heading ? html`<div part="title" class="toast__title">${this.heading}</div>` : nothing}
      <div part="message" class="toast__message">${this.message}<slot></slot></div>
    `;
  }

  override render() {
    const variant = this.resolvedVariant;
    const role = variant === 'error' ? 'alert' : 'status';

    return html`
      <div
        part="base"
        class=${classMap({
          toast: true,
          [`toast--${variant}`]: true,
          'toast--entered': this.entered,
        })}
        @animationend=${this.handleAnimationEnd}
      >
        <span part="icon" class="toast__icon" aria-hidden="true">
          ${variant === 'loading' ? spinnerIcon : STATUS_ICONS[variant]}
        </span>
        ${
          // role 改變（例如 loading 轉 error）時建立新的 live region：alert 的插入會被立即播報
          keyed(
            role,
            html`
              <div part="content" class="toast__content" role=${role} aria-atomic="true">
                ${this.renderContent(variant)}
              </div>
            `,
          )
        }
        ${
          this.noCloseButton
            ? nothing
            : html`
                <button
                  part="close-button"
                  class="toast__close"
                  type="button"
                  aria-label="關閉通知"
                  @click=${this.handleClose}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              `
        }
      </div>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-toast')) {
  customElements.define('aui-toast', AuiToast);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-toast': AuiToast;
  }
}
