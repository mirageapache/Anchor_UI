import { LitElement, html, nothing, svg, type PropertyValues, type SVGTemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { alertStyles } from './alert.styles.js';
import type {
  AlertCancelDetail,
  AlertCancelReason,
  AlertConfirmDetail,
  AlertIcon,
  AlertMode,
} from './alert.types.js';
import type { AuiInput } from '../input/input.js';
import type { AuiModal } from '../modal/modal.js';
import type { ModalHideDetail } from '../modal/modal.types.js';
import { PausableTimer } from '../../internal/pausable-timer.js';
import '../button/index.js';
import '../input/index.js';
import '../modal/index.js';

/** 預設為 true 的布林屬性：只有字串 "false" 視為 false（與 <aui-modal> 相同） */
const defaultTrue = {
  fromAttribute: (value: string | null) => value !== 'false',
  toAttribute: (value: boolean) => (value ? null : 'false'),
};

/**
 * 圖示的符號（圓環另外繪製），以 pathLength="1" 支援描繪動畫。
 * 須使用 svg 標籤：以 html 建立的 <path> 屬於 HTML 命名空間，瀏覽器不會繪製。
 */
const GLYPHS: Record<AlertIcon, SVGTemplateResult> = {
  success: svg`<path class="alert__glyph" pathLength="1" d="M15 27 L23 35 L38 19"></path>`,
  error: svg`<path class="alert__glyph" pathLength="1" d="M18 18 L34 34 M34 18 L18 34"></path>`,
  warning: svg`<path class="alert__glyph" pathLength="1" d="M26 14 V30 M26 37 V38"></path>`,
  info: svg`<path class="alert__glyph" pathLength="1" d="M26 14 V15 M26 22 V38"></path>`,
};

/** 圖示狀態的文字（無障礙名稱使用），讓狀態不只依賴圖示與顏色 */
const ICON_TEXT: Record<AlertIcon, string> = {
  success: '成功',
  error: '錯誤',
  warning: '警告',
  info: '資訊',
};

/** 沒有標題與圖示時的無障礙名稱 */
const MODE_NAME: Record<AlertMode, string> = {
  alert: '提示',
  confirm: '確認',
  prompt: '輸入',
};

type Decision =
  { confirmed: true; value: string } | { confirmed: false; reason: AlertCancelReason };

/**
 * Anchor UI — Alert 元件 (`<aui-alert>`)
 *
 * SweetAlert2 風格的提示、確認與輸入對話框，以 `<aui-modal>` 為外框組成：
 * 焦點限制與返還、背景捲動鎖定、ESC 與遮罩關閉皆由 Modal 處理，可於 Modal 內再開啟。
 * 命令式呼叫請使用 `AlertService.alert()` / `confirm()` / `prompt()`。
 *
 * - **鍵盤**：Enter 確認、ESC 取消；焦點在按鈕上時 Enter 啟動該按鈕（輸入法組字中的 Enter 不算）。
 * - **初始焦點**：prompt 為輸入框；`destructive` 為取消鈕（避免誤按 Enter 執行破壞性操作）；其餘為確定鈕。
 * - **無障礙**：以 `alertdialog` 呈現，標題（含圖示狀態）為名稱、訊息為描述；圖示遵循減少動畫設定。
 * - **自動關閉**：設定 `timer`（毫秒）後時間到即以取消關閉（原因 `timer`）。依 WCAG 2.2.1，
 *   滑鼠停在對話框上時暫停計時，使用者以鍵盤操作或點擊對話框內容後不再自動關閉；
 *   螢幕閱讀器使用者可能來不及讀完，重要訊息請勿使用。
 *
 * @element aui-alert
 *
 * @slot - 訊息下方的額外內容
 *
 * @csspart icon - 狀態圖示
 * @csspart title - 標題
 * @csspart message - 訊息
 * @csspart input - prompt 模式的 `<aui-input>`
 * @csspart actions - 按鈕列
 * @csspart confirm-button - 確定鈕（`<aui-button>`）
 * @csspart cancel-button - 取消鈕（`<aui-button>`）
 *
 * @fires aui-show - 開始開啟前觸發（可被 preventDefault 取消；來自內部 `<aui-modal>`）
 * @fires aui-after-show - 完全開啟後觸發（來自內部 `<aui-modal>`）
 * @fires aui-hide - 開始關閉前觸發（可被 preventDefault 取消；來自內部 `<aui-modal>`）
 * @fires aui-after-hide - 完全關閉後觸發（來自內部 `<aui-modal>`）
 * @fires aui-confirm - 以確定關閉後觸發，`detail.value` 為 prompt 的輸入值
 * @fires aui-cancel - 以取消關閉後觸發，`detail.reason` 為取消原因
 */
export class AuiAlert extends LitElement {
  static override styles = alertStyles;

  @query('aui-modal')
  private modal!: AuiModal;

  @query('aui-input')
  private input?: AuiInput;

  /**
   * 是否開啟
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * 對話框模式
   */
  @property({ type: String, reflect: true })
  mode: AlertMode = 'alert';

  /**
   * 狀態圖示（未設定則不顯示）
   */
  @property({ type: String, reflect: true })
  icon?: AlertIcon;

  /**
   * 標題
   */
  @property({ type: String })
  heading = '';

  /**
   * 訊息內容（保留換行）
   */
  @property({ type: String })
  message = '';

  /**
   * 確定鈕文字
   */
  @property({ type: String, attribute: 'confirm-text' })
  confirmText = '確定';

  /**
   * 取消鈕文字（confirm 與 prompt 模式）
   */
  @property({ type: String, attribute: 'cancel-text' })
  cancelText = '取消';

  /**
   * 破壞性操作：確定鈕改為危險樣式，初始焦點落在取消鈕
   */
  @property({ type: Boolean, reflect: true })
  destructive = false;

  /**
   * prompt 模式的輸入框預設值
   */
  @property({ type: String, attribute: 'input-value' })
  inputValue = '';

  /**
   * prompt 模式的輸入框佔位提示
   */
  @property({ type: String, attribute: 'input-placeholder' })
  inputPlaceholder = '';

  /**
   * prompt 模式輸入框的無障礙名稱（預設為標題）
   */
  @property({ type: String, attribute: 'input-label' })
  inputLabel = '';

  /**
   * 是否允許點擊遮罩關閉（視同取消；HTML 中以 `close-on-backdrop="false"` 停用）
   */
  @property({ attribute: 'close-on-backdrop', converter: defaultTrue })
  closeOnBackdrop = true;

  /**
   * 自動關閉的等待時間（毫秒，例如 3000 為 3 秒）；0 為不自動關閉。開啟時開始計時，時間到視同取消
   */
  @property({ type: Number })
  timer = 0;

  /** 本次開啟的結果；由按鈕、Enter、自動關閉或 Modal 的關閉原因決定 */
  private decision: Decision | null = null;

  /** 自動關閉計時（可暫停：滑鼠停在對話框上時） */
  private readonly autoClose = new PausableTimer(() => this.closeByTimer());

  constructor() {
    super();
    this.addEventListener('aui-after-hide', this.handleModalAfterHide);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.autoClose.stop();
  }

  /**
   * 開啟對話框
   */
  async show(): Promise<void> {
    this.open = true;
  }

  /**
   * 以取消關閉對話框（原因為 `api`）
   */
  async hide(): Promise<void> {
    this.open = false;
  }

  /**
   * 以確定關閉對話框（與點擊確定鈕相同）
   */
  confirm(): void {
    if (!this.open) return;
    this.decision = {
      confirmed: true,
      value: this.mode === 'prompt' ? (this.input?.value ?? '') : '',
    };
    this.open = false;
  }

  /**
   * 以取消關閉對話框（與點擊取消鈕相同）
   */
  cancel(): void {
    if (!this.open) return;
    this.decision = { confirmed: false, reason: 'cancel-button' };
    this.open = false;
  }

  override async updated(changed: PropertyValues<this>): Promise<void> {
    if (!this.modal) return;
    // 開啟中變更 timer：以新的時間重新計時
    if (changed.has('timer') && !changed.has('open') && this.open && this.modal.open) {
      this.autoClose.start(this.timer);
    }
    if (!changed.has('open')) return;

    if (this.open && !this.modal.open) {
      this.decision = null;
      if (this.input) this.input.value = this.inputValue;
      this.modal.open = true;
      await this.modal.updateComplete;
      // aui-show 被取消時 Modal 不會開啟，同步回 Alert
      if (!this.modal.open) this.open = false;
      else this.autoClose.start(this.timer);
    } else if (!this.open && this.modal.open) {
      this.autoClose.stop();
      this.decision ??= { confirmed: false, reason: 'api' };
      await this.modal.hide();
      await this.modal.updateComplete;
      // aui-hide 被取消時 Modal 保持開啟，撤回這次的結果
      if (this.modal.open) {
        this.decision = null;
        this.open = true;
      }
    }
  }

  /** Modal 完全關閉後（不論原因）決定結果並分派 aui-confirm / aui-cancel */
  private handleModalAfterHide = (event: Event) => {
    if (event.composedPath()[0] !== this.modal) return;
    const { reason } = (event as CustomEvent<ModalHideDetail>).detail;
    const decision: Decision = this.decision ?? {
      confirmed: false,
      reason: reason === 'escape' || reason === 'backdrop' ? reason : 'api',
    };
    this.decision = null;
    this.open = false;

    if (decision.confirmed) {
      this.dispatchEvent(
        new CustomEvent<AlertConfirmDetail>('aui-confirm', {
          detail: { value: decision.value },
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      this.dispatchEvent(
        new CustomEvent<AlertCancelDetail>('aui-cancel', {
          detail: { reason: decision.reason },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  private closeByTimer(): void {
    if (!this.open) return;
    this.decision = { confirmed: false, reason: 'timer' };
    this.open = false;
  }

  /** 事件是否發生在對話框面板內（而非遮罩） */
  private isInPanel(event: Event): boolean {
    return event
      .composedPath()
      .some((node) => node instanceof HTMLElement && node.getAttribute('part') === 'panel');
  }

  /** 滑鼠停在面板上時暫停自動關閉，移到遮罩上時繼續 */
  private handlePointerOver = (event: PointerEvent) => {
    if (this.isInPanel(event)) this.autoClose.pause();
    else this.autoClose.resume();
  };

  /** 點擊面板內容：使用者正在處理對話框，不再自動關閉 */
  private handlePointerDown = (event: PointerEvent) => {
    if (this.isInPanel(event)) this.autoClose.stop();
  };

  /**
   * 任何鍵盤操作都代表使用者正在處理對話框，不再自動關閉。
   * Enter 確認：焦點在按鈕或多行輸入框上、或正在以輸入法組字時，交由原生行為處理
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    this.autoClose.stop();
    if (event.key !== 'Enter' || event.isComposing) return;
    const origin = event.composedPath()[0];
    if (origin instanceof HTMLButtonElement || origin instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    this.confirm();
  };

  private handleConfirmClick = () => {
    this.confirm();
  };

  private handleCancelClick = () => {
    this.cancel();
  };

  /** 無障礙名稱：標題（有圖示時前綴狀態，如「錯誤：刪除失敗」），否則為圖示狀態或模式名稱 */
  private get accessibleName(): string {
    const iconText = this.icon ? ICON_TEXT[this.icon] : '';
    if (this.heading) return iconText ? `${iconText}：${this.heading}` : this.heading;
    return iconText || MODE_NAME[this.mode];
  }

  private renderIcon() {
    if (!this.icon || !GLYPHS[this.icon]) return nothing;
    return html`
      <span part="icon" class="alert__icon alert__icon--${this.icon}" aria-hidden="true">
        <svg
          viewBox="0 0 52 52"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle class="alert__ring" pathLength="1" cx="26" cy="26" r="24"></circle>
          ${GLYPHS[this.icon]}
        </svg>
      </span>
    `;
  }

  override render() {
    const withCancel = this.mode !== 'alert';
    const confirmFocus = this.mode !== 'prompt' && !this.destructive;
    const cancelFocus = this.mode !== 'prompt' && this.destructive;

    return html`
      <aui-modal
        size="sm"
        dialog-role="alertdialog"
        no-close-button
        .label=${this.accessibleName}
        .description=${this.message}
        .closeOnBackdrop=${this.closeOnBackdrop}
        @keydown=${this.handleKeyDown}
        @pointerover=${this.handlePointerOver}
        @pointerdown=${this.handlePointerDown}
      >
        ${this.renderIcon()}
        ${this.heading ? html`<h2 part="title" class="alert__title">${this.heading}</h2>` : nothing}
        <p
          part="message"
          class=${classMap({ alert__message: true, 'alert__message--empty': !this.message })}
        >
          ${this.message}
        </p>
        <slot></slot>
        ${
          this.mode === 'prompt'
            ? html`
                <aui-input
                  part="input"
                  class="alert__input"
                  .value=${this.inputValue}
                  .placeholder=${this.inputPlaceholder}
                  .label=${this.inputLabel || this.heading || MODE_NAME.prompt}
                  autofocus
                ></aui-input>
              `
            : nothing
        }
        <div part="actions" class="alert__actions">
          ${
            withCancel
              ? html`
                  <aui-button
                    part="cancel-button"
                    variant="ghost"
                    ?autofocus=${cancelFocus}
                    @click=${this.handleCancelClick}
                    >${this.cancelText}</aui-button
                  >
                `
              : nothing
          }
          <aui-button
            part="confirm-button"
            variant=${this.destructive ? 'danger' : 'primary'}
            ?autofocus=${confirmFocus}
            @click=${this.handleConfirmClick}
            >${this.confirmText}</aui-button
          >
        </div>
      </aui-modal>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-alert')) {
  customElements.define('aui-alert', AuiAlert);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-alert': AuiAlert;
  }
}
