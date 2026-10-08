import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { tagStyles } from './tag.styles.js';
import type { TagSize, TagVariant } from './tag.types.js';

/**
 * Anchor UI — Tag / Badge 元件 (`<aui-tag>`)
 *
 * 採用 JetBrains Mono 等寬字體呈現的專業標籤，用於技術分類、版本標號、格式與狀態標記。
 * 支援 7 種語意色彩變體（另有 6 個相容別名）、3 種尺寸規格、膠囊圓角 (pill)、可點擊互動 (interactive)、
 * 可移除操作 (removable)，並預設落實全小寫標籤規範（支援 preserve-case 跳脫）。
 *
 * @element aui-tag
 *
 * @slot - 標籤主體文字內容
 * @slot prefix - 標籤前綴圖示或狀態小圓點
 * @slot suffix - 標籤後綴圖示
 *
 * @csspart base - 標籤本體外層容器
 * @csspart action - 前綴、主體與後綴的包裝容器（interactive 時為 role="button" 的可聚焦元素）
 * @csspart prefix - 前綴內容包裝容器
 * @csspart content - 主體文字包裝容器
 * @csspart suffix - 後綴內容包裝容器
 * @csspart remove-button - 移除按鈕（當 removable 為 true 時）
 *
 * @fires aui-remove - 當點擊移除按鈕時觸發，支援 bubbles 與 composed
 */
export class AuiTag extends LitElement {
  static override styles = tagStyles;

  /**
   * 語意色彩變體：7 種核心語意色，另有相容別名
   * deep-blue→brand、green→success、amber / accent→warning、red→danger、blue→info
   */
  @property({ type: String, reflect: true })
  variant: TagVariant = 'neutral';

  /**
   * 尺寸規格階層
   */
  @property({ type: String, reflect: true })
  size: TagSize = 'sm';

  /**
   * 是否呈現全圓角膠囊造型
   */
  @property({ type: Boolean, reflect: true })
  pill = false;

  /**
   * 是否保留文字原始大小寫（預設依規範轉為全小寫）
   */
  @property({ type: Boolean, reflect: true, attribute: 'preserve-case' })
  preserveCase = false;

  /**
   * 是否顯示移除按鈕
   */
  @property({ type: Boolean, reflect: true })
  removable = false;

  /**
   * 是否啟用點擊互動（例如篩選標籤）
   */
  @property({ type: Boolean, reflect: true })
  interactive = false;

  /**
   * 移除按鈕的無障礙語意標籤
   */
  @property({ type: String, attribute: 'remove-label' })
  removeLabel = '移除標籤';

  /**
   * 互動語意（role="button" / tabindex）放在 shadow 內的 action 元素而非 host，
   * 使移除鈕成為其兄弟節點而非子節點：避免 nested-interactive，
   * 也讓移除鈕的 Enter / Space 不會被標籤本體的鍵盤處理攔截。
   */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private handleActionKeyDown = (event: KeyboardEvent): void => {
    if (this.interactive && (event.key === 'Enter' || event.key === ' ')) {
      // 避免空白鍵滾動頁面
      event.preventDefault();
      this.click();
    }
  };

  private handleRemoveClick = (event: MouseEvent): void => {
    event.stopPropagation();
    const removeEvent = new CustomEvent('aui-remove', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { tag: this },
    });
    this.dispatchEvent(removeEvent);
  };

  override render() {
    return html`
      <span
        part="base"
        class=${classMap({
          tag: true,
          [`tag--${this.variant}`]: !!this.variant,
          [`tag--${this.size}`]: !!this.size,
          'tag--pill': this.pill,
          'tag--preserve-case': this.preserveCase,
          'tag--interactive': this.interactive,
          'tag--removable': this.removable,
        })}
      >
        <span
          class="tag__action"
          part="action"
          role=${this.interactive ? 'button' : nothing}
          tabindex=${this.interactive ? '0' : nothing}
          @keydown=${this.handleActionKeyDown}
        >
          <span class="tag__prefix" part="prefix">
            <slot name="prefix"></slot>
          </span>

          <span class="tag__content" part="content">
            <slot></slot>
          </span>

          <span class="tag__suffix" part="suffix">
            <slot name="suffix"></slot>
          </span>
        </span>

        ${
          this.removable
            ? html`
                <button
                  type="button"
                  class="tag__remove"
                  part="remove-button"
                  aria-label=${this.removeLabel}
                  title=${this.removeLabel}
                  @click=${this.handleRemoveClick}
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path
                      d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
                    />
                  </svg>
                </button>
              `
            : nothing
        }
      </span>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-tag')) {
  customElements.define('aui-tag', AuiTag);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-tag': AuiTag;
  }
}
