import { LitElement, html, type TemplateResult } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { iconButtonStyles } from './icon-button.styles.js';
import type {
  CopyDetail,
  DownloadDetail,
  IconButtonAction,
  IconButtonColor,
  IconButtonPreset,
  IconButtonShape,
  IconButtonSize,
  IconButtonStatus,
  IconButtonVariant,
  StatusChangeDetail,
} from './icon-button.types.js';
import type { TooltipPlacement } from '../tooltip/tooltip.types.js';
import type { AuiTooltip } from '../tooltip/tooltip.js';
import '../tooltip/index.js';

/* ─── 預設向量圖示庫 (Crisp 24x24 Vector SVGs) ─── */
const SVG_ICONS: Record<IconButtonPreset | 'spinner', TemplateResult> = {
  copy: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
  `,
  download: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,
  check: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,
  close: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,
  refresh: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
    </svg>
  `,
  external: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  `,
  more: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="1.5"></circle>
      <circle cx="19" cy="12" r="1.5"></circle>
      <circle cx="5" cy="12" r="1.5"></circle>
    </svg>
  `,
  spinner: html`
    <svg
      class="spinner-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
    </svg>
  `,
};

/**
 * Anchor UI — Icon Button 元件 (`<aui-icon-button>`)
 *
 * 專為複製 (Copy)、下載 (Download)、關閉、重新整理等動作打造之 32×32px 方形微型操作鈕。
 * 具備 Active 成功回饋狀態（背景與圖示變換為 Success 翠綠色）、平滑淡入淡出切換、
 * 深度結合 `<aui-tooltip>` 與螢幕閱讀器無障礙標籤播報。
 *
 * @element aui-icon-button
 *
 * @slot - 預設自訂圖示內容
 * @slot icon - 明確指定之閒置圖示
 * @slot success-icon - 自訂成功回饋圖示（預設為彈出打勾符號）
 * @slot loading-icon - 自訂載入中圖示（預設為 Spinner）
 *
 * @csspart button - 內部原生 `<button>` 元素容器
 * @csspart tooltip - 內建 `<aui-tooltip>` 浮層容器
 * @csspart icon-wrapper - 圖示定位容器
 * @csspart idle-icon - 閒置狀態圖示層
 * @csspart success-icon - 成功回饋狀態圖示層
 * @csspart loading-icon - 載入中狀態圖示層
 *
 * @fires aui-copy - 複製文字至剪貼簿成功時觸發
 * @fires aui-copy-error - 剪貼簿存取失敗時觸發
 * @fires aui-download - 觸發下載行為時分派
 * @fires aui-status-change - 元件狀態發生改變時觸發
 */
export class AuiIconButton extends LitElement {
  static override styles = iconButtonStyles;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private feedbackTimer: number | null = null;

  @query('.icon-btn')
  private buttonElement?: HTMLButtonElement;

  @query('aui-tooltip')
  private tooltipElement?: AuiTooltip;

  /**
   * 樣式風格變體
   */
  @property({ type: String, reflect: true })
  variant: IconButtonVariant = 'ghost';

  /**
   * 語意色彩與懸停控制（預設 'brand'，支援 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral'）
   */
  @property({ type: String, reflect: true })
  color: IconButtonColor = 'brand';

  /**
   * 尺寸規格（sm: 28px, md: 32px, lg: 40px，預設 32px 觸控盒）
   */
  @property({ type: String, reflect: true })
  size: IconButtonSize = 'md';

  /**
   * 外觀幾何形狀（rounded: 6px 圓角, circle: 圓形, square: 直角）
   */
  @property({ type: String, reflect: true })
  shape: IconButtonShape = 'rounded';

  /**
   * 內建預設圖示名（例如 'copy', 'download', 'close', 'check', 'refresh', 'external', 'more'）
   */
  @property({ type: String, reflect: true })
  preset?: IconButtonPreset;

  /**
   * 按鈕點擊行為模式 ('copy' | 'download' | 'custom' | 'none')
   */
  @property({ type: String, reflect: true })
  action: IconButtonAction = 'none';

  /**
   * 複製至剪貼簿之目標文字（設定後預設點擊即複製該字串）
   */
  @property({ type: String, attribute: 'copy-value' })
  copyValue = '';

  /**
   * 觸發下載之檔案連結 URL
   */
  @property({ type: String, attribute: 'download-url' })
  downloadUrl = '';

  /**
   * 觸發下載之指定檔名
   */
  @property({ type: String, attribute: 'download-filename' })
  downloadFilename = '';

  /**
   * 浮動氣泡提示文字（空字串時自動依 preset 提供預設提示）
   */
  @property({ type: String })
  tooltip = '';

  /**
   * 成功回饋時切換顯示之氣泡提示文字（預設複製為 "已複製！"，下載為 "已下載！"）
   */
  @property({ type: String, attribute: 'success-tooltip' })
  successTooltip = '';

  /**
   * 氣泡提示顯示方位（預設 'top'）
   */
  @property({ type: String, attribute: 'tooltip-placement' })
  tooltipPlacement: TooltipPlacement = 'top';

  /**
   * 是否強制隱藏 Tooltip 氣泡
   */
  @property({ type: Boolean, attribute: 'no-tooltip' })
  noTooltip = false;

  /**
   * 無障礙 aria-label 標籤文字（若無指定則自動回退至 tooltip 內容）
   */
  @property({ type: String, reflect: true })
  label = '';

  /**
   * 是否處於停用狀態
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 是否處於載入運算中（顯示旋轉 Spinner 並阻止重複點擊）
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * 是否處於啟動/成功高亮狀態（反映 is-active 琥珀金視覺）
   */
  @property({ type: Boolean, reflect: true })
  active = false;

  /**
   * 當前運作狀態 ('idle' | 'loading' | 'success' | 'error')
   */
  @property({ type: String, reflect: true })
  status: IconButtonStatus = 'idle';

  /**
   * 成功/錯誤反饋動態維持時間（毫秒，預設 2000ms）
   */
  @property({ type: Number, attribute: 'feedback-duration' })
  feedbackDuration = 2000;

  /**
   * 螢幕閱讀器即時播報文字
   */
  @state()
  private announcement = '';

  constructor() {
    super();
    this.addEventListener('click', this.handleHostClick, { capture: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.feedbackTimer) {
      window.clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }
  }

  /**
   * 計算目前生效之動作類別
   */
  private computeEffectiveAction(): IconButtonAction {
    if (this.action && this.action !== 'none') {
      return this.action;
    }
    if (this.copyValue || this.preset === 'copy') {
      return 'copy';
    }
    if (this.downloadUrl || this.preset === 'download') {
      return 'download';
    }
    return 'none';
  }

  /**
   * 計算成功狀態提示文字
   */
  private computeSuccessTooltip(): string {
    if (this.successTooltip) return this.successTooltip;
    const action = this.computeEffectiveAction();
    if (action === 'copy') return '已複製！';
    if (action === 'download') return '已下載！';
    return '操作成功！';
  }

  /**
   * 計算閒置狀態之提示文字
   */
  private computeIdleTooltip(): string {
    if (this.tooltip) return this.tooltip;
    if (this.preset === 'copy') return '複製';
    if (this.preset === 'download') return '下載';
    if (this.preset === 'close') return '關閉';
    if (this.preset === 'check') return '確認';
    if (this.preset === 'refresh') return '重新整理';
    if (this.preset === 'external') return '另開新視窗';
    if (this.preset === 'more') return '更多選項';
    return '';
  }

  /**
   * 計算無障礙 aria-label
   */
  private computeAriaLabel(): string {
    if (this.status === 'success') {
      return this.computeSuccessTooltip();
    }
    if (this.label) return this.label;
    const idleTooltip = this.computeIdleTooltip();
    if (idleTooltip) return idleTooltip;
    return '按鈕';
  }

  /**
   * 是否啟用 Tooltip 氣泡
   */
  private get hasTooltip(): boolean {
    if (this.noTooltip) return false;
    return Boolean(this.tooltip || this.preset);
  }

  /**
   * 點擊事件處理常式
   */
  private handleHostClick = async (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const action = this.computeEffectiveAction();
    if (action === 'copy') {
      event.preventDefault();
      await this.copy();
    } else if (action === 'download') {
      event.preventDefault();
      await this.download();
    }
  };

  /**
   * 執行複製行為並觸發微動態反饋
   */
  async copy(): Promise<boolean> {
    if (this.disabled || this.loading) return false;

    const textToCopy = this.copyValue;

    try {
      if (textToCopy) {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // 針對未具備 Secure Context 之後備相容方案
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          textarea.style.top = '-9999px';
          textarea.setAttribute('readonly', '');
          document.body.appendChild(textarea);
          textarea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (!successful) throw new Error('execCommand copy failed');
        }
      }

      this.triggerFeedback('success');
      this.dispatchEvent(
        new CustomEvent<CopyDetail>('aui-copy', {
          detail: { value: textToCopy },
          bubbles: true,
          composed: true,
        }),
      );
      return true;
    } catch (err) {
      this.triggerFeedback('error');
      this.dispatchEvent(
        new CustomEvent('aui-copy-error', {
          detail: { error: err },
          bubbles: true,
          composed: true,
        }),
      );
      return false;
    }
  }

  /**
   * 執行下載行為並觸發微動態反饋
   */
  async download(): Promise<void> {
    if (this.disabled || this.loading) return;

    this.dispatchEvent(
      new CustomEvent<DownloadDetail>('aui-download', {
        detail: { url: this.downloadUrl, filename: this.downloadFilename },
        bubbles: true,
        composed: true,
      }),
    );

    if (this.downloadUrl) {
      const anchor = document.createElement('a');
      anchor.href = this.downloadUrl;
      if (this.downloadFilename) {
        anchor.download = this.downloadFilename;
      }
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }

    this.triggerFeedback('success');
  }

  /**
   * 主動觸發狀態反饋（支援 'success' 或 'error'）
   */
  triggerFeedback(type: 'success' | 'error' = 'success'): void {
    if (this.feedbackTimer) {
      window.clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }

    const previousStatus = this.status;
    this.status = type;
    this.active = type === 'success';

    if (type === 'success') {
      this.announcement = this.computeSuccessTooltip();
    } else {
      this.announcement = '操作失敗';
    }

    this.dispatchEvent(
      new CustomEvent<StatusChangeDetail>('aui-status-change', {
        detail: { status: this.status, previousStatus },
        bubbles: true,
        composed: true,
      }),
    );

    // 觸發反饋時主動展現 Tooltip 告知即時結果
    if (this.hasTooltip) {
      this.showTooltipTemporarily();
    }

    this.feedbackTimer = window.setTimeout(() => {
      const prev = this.status;
      this.status = 'idle';
      this.active = false;
      this.announcement = '';
      this.hideTooltipIfShown();

      this.dispatchEvent(
        new CustomEvent<StatusChangeDetail>('aui-status-change', {
          detail: { status: 'idle', previousStatus: prev },
          bubbles: true,
          composed: true,
        }),
      );
      this.feedbackTimer = null;
    }, this.feedbackDuration);
  }

  /**
   * 取消重設反饋狀態
   */
  resetFeedback(): void {
    if (this.feedbackTimer) {
      window.clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }
    this.status = 'idle';
    this.active = false;
    this.announcement = '';
    this.hideTooltipIfShown();
  }

  private showTooltipTemporarily(): void {
    if (this.tooltipElement && !this.tooltipElement.disabled) {
      this.tooltipElement.show();
    }
  }

  private hideTooltipIfShown(): void {
    this.tooltipElement?.hide();
  }

  /**
   * 主動聚焦內部原生按鈕
   */
  override focus(options?: FocusOptions): void {
    this.buttonElement?.focus(options);
  }

  /**
   * 主動移除內部原生按鈕焦點
   */
  override blur(): void {
    this.buttonElement?.blur();
  }

  /**
   * 渲染閒置圖示本體（支援 preset 或 slots）
   */
  private renderIdleIcon(): TemplateResult {
    if (this.preset && SVG_ICONS[this.preset]) {
      return SVG_ICONS[this.preset];
    }
    return html`
      <slot name="icon">
        <slot></slot>
      </slot>
    `;
  }

  /**
   * 渲染成功打勾反饋圖示
   */
  private renderSuccessIcon(): TemplateResult {
    return html` <slot name="success-icon"> ${SVG_ICONS.check} </slot> `;
  }

  /**
   * 渲染載入中圖示
   */
  private renderLoadingIcon(): TemplateResult {
    return html` <slot name="loading-icon"> ${SVG_ICONS.spinner} </slot> `;
  }

  override render() {
    const isInactive = this.disabled || this.loading;
    const isSuccess = this.status === 'success';
    const isError = this.status === 'error';
    const isLoading = this.loading || this.status === 'loading';

    const currentTooltipText = isSuccess ? this.computeSuccessTooltip() : this.computeIdleTooltip();

    const ariaLabel = this.computeAriaLabel();

    const buttonTemplate = html`
      <button
        part="button"
        class=${classMap({
          'icon-btn': true,
          [`icon-btn--${this.variant}`]: true,
          [`icon-btn--${this.size}`]: true,
          [`icon-btn--${this.shape}`]: true,
          [`icon-btn--color-${this.color}`]: Boolean(this.color),
          'is-active': this.active || isSuccess,
          'is-success': isSuccess,
          'is-error': isError,
          'is-loading': isLoading,
          'is-disabled': this.disabled,
        })}
        type="button"
        ?disabled=${isInactive}
        aria-label=${ariaLabel}
        aria-busy=${isLoading ? 'true' : 'false'}
        aria-disabled=${isInactive ? 'true' : 'false'}
        aria-pressed=${this.active ? 'true' : 'false'}
      >
        <span class="icon-wrapper" part="icon-wrapper">
          <!-- 1. 閒置圖示層 -->
          <span
            part="idle-icon"
            class=${classMap({
              'icon-layer': true,
              'icon-layer--idle': true,
              'is-hidden': isSuccess || isLoading,
            })}
            aria-hidden="true"
          >
            ${this.renderIdleIcon()}
          </span>

          <!-- 2. 成功打勾圖示層 -->
          <span
            part="success-icon"
            class=${classMap({
              'icon-layer': true,
              'icon-layer--success': true,
              'is-visible': isSuccess,
            })}
            aria-hidden="true"
          >
            ${this.renderSuccessIcon()}
          </span>

          <!-- 3. 載入中 Spinner 圖示層 -->
          <span
            part="loading-icon"
            class=${classMap({
              'icon-layer': true,
              'icon-layer--loading': true,
              'is-visible': isLoading,
            })}
            aria-hidden="true"
          >
            ${this.renderLoadingIcon()}
          </span>
        </span>

        <!-- 螢幕閱讀器狀態即時通報 (Live Region) -->
        <span class="sr-only" role="status" aria-live="polite"> ${this.announcement} </span>
      </button>
    `;

    if (this.hasTooltip && currentTooltipText) {
      return html`
        <aui-tooltip
          part="tooltip"
          .content=${currentTooltipText}
          .placement=${this.tooltipPlacement}
          ?disabled=${this.disabled}
        >
          ${buttonTemplate}
        </aui-tooltip>
      `;
    }

    return buttonTemplate;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-icon-button')) {
  customElements.define('aui-icon-button', AuiIconButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-icon-button': AuiIconButton;
  }
}
