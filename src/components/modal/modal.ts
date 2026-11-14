import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { modalStyles } from './modal.styles.js';
import { defaultTrue } from '../../internal/converters.js';
import { rememberFocus } from '../../internal/focus-return.js';
import { lockScroll } from '../../internal/scroll-lock.js';
import { MODAL_OVERLAY_SLOT, pushModalLayer } from '../../internal/top-layer.js';
import { transitionTimeMs } from '../../internal/transition.js';
import type { ModalCloseReason, ModalHideDetail, ModalRole, ModalSize } from './modal.types.js';

/**
 * Anchor UI — Modal 元件 (`<aui-modal>`)
 *
 * 通用彈窗外框容器：以原生 `<dialog>.showModal()` 進入 Top Layer，背景自動變為 inert，
 * 並以 `::backdrop` 呈現模糊遮罩。提供 sm / md / lg 三種寬度，以及 Header / Body / Footer 插槽；
 * 沒有內容的頁首與頁尾不會顯示。
 *
 * - **關閉**：ESC、點擊遮罩（皆可關閉設定）、頁首關閉鈕或 `hide()`；`aui-hide` 可取消並帶有關閉原因。
 * - **捲動與焦點**：開啟時鎖定背景捲動（巢狀開啟正確計數），關閉後焦點返還至觸發元素（可穿透 Shadow DOM）。
 * - **初始焦點**：聚焦內容中帶有 `autofocus` 屬性的元素，否則聚焦面板本身。
 * - **巢狀浮層**：開啟期間登記為最上層 modal，Toast 等浮層會移入 dialog 內的 `overlay` slot，
 *   避免被 modal 的 inert 邊界擋住（見 note/04-top-layer.md）。
 * - **事件冒泡**：下列事件皆 `bubbles` + `composed`，內容中 Tooltip 或巢狀 Modal 的同名事件也會傳到這裡
 *   （且不一定帶有 `detail.reason`）；只處理自身事件時請先檢查 `event.target === event.currentTarget`。
 *
 * @element aui-modal
 *
 * @slot - 內容（Body）
 * @slot header - 頁首的額外內容（排在 `heading` 標題之後）
 * @slot footer - 頁尾內容，通常為操作按鈕（靠右排列）
 * @slot overlay - 內部使用：開啟期間收容 Toast 等需保持可互動的外部浮層
 *
 * @csspart dialog - 原生 `<dialog>`（`::part(dialog)::backdrop` 可調整遮罩）
 * @csspart panel - 對話框面板
 * @csspart header - 頁首
 * @csspart title - 標題（`heading`）
 * @csspart close-button - 頁首關閉鈕
 * @csspart body - 內容區（超出高度時可捲動）
 * @csspart footer - 頁尾
 *
 * @fires aui-show - 開始開啟前觸發（可被 preventDefault 取消）
 * @fires aui-after-show - 完全開啟且進場動畫結束後觸發
 * @fires aui-hide - 開始關閉前觸發（可被 preventDefault 取消），`detail.reason` 為關閉原因
 * @fires aui-after-hide - 完全關閉且退場動畫結束後觸發，`detail.reason` 為關閉原因
 */
export class AuiModal extends LitElement {
  static override styles = modalStyles;

  @query('dialog')
  private dialog!: HTMLDialogElement;

  @query('.modal__panel')
  private panel!: HTMLElement;

  /**
   * 是否開啟（可直接設定，等同呼叫 show() / hide()）
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * 尺寸規格
   */
  @property({ type: String, reflect: true })
  size: ModalSize = 'md';

  /**
   * 標題，顯示於頁首並作為對話框的無障礙名稱
   */
  @property({ type: String })
  heading = '';

  /**
   * 無障礙名稱：未設定 `heading`（例如以 header slot 自訂標題）時使用
   */
  @property({ type: String })
  label = '';

  /**
   * 無障礙描述（僅供螢幕閱讀器，不顯示）：內容位於其他 Shadow DOM、無法以 IDREF 關聯時使用（例如 Alert 的訊息）
   */
  @property({ type: String })
  description = '';

  /**
   * 對話框角色；需要使用者立即回應的確認對話框使用 `alertdialog`
   */
  @property({ type: String, attribute: 'dialog-role' })
  dialogRole: ModalRole = 'dialog';

  /**
   * 是否允許按 ESC 關閉（HTML 中以 `close-on-escape="false"` 停用）。
   * 依瀏覽器規範，攔下 ESC 需要使用者互動：連續按 ESC 而期間沒有任何點擊或輸入時，
   * 瀏覽器仍會強制關閉（防止頁面困住使用者），此時 `aui-hide` 不可取消、原因為 `escape`。
   */
  @property({ attribute: 'close-on-escape', converter: defaultTrue })
  closeOnEscape = true;

  /**
   * 是否允許點擊遮罩關閉（HTML 中以 `close-on-backdrop="false"` 停用）
   */
  @property({ attribute: 'close-on-backdrop', converter: defaultTrue })
  closeOnBackdrop = true;

  /**
   * 是否隱藏頁首的關閉鈕
   */
  @property({ type: Boolean, attribute: 'no-close-button' })
  noCloseButton = false;

  /** 進場動畫的目標狀態（開啟後下一幀才套用，讓 transition 生效） */
  @state()
  private isVisible = false;

  @state()
  private hasHeaderSlot = false;

  @state()
  private hasFooterSlot = false;

  /** dialog 是否處於（或正在進入）開啟狀態；退場動畫期間為 false */
  private isShown = false;

  /** 轉場序號：延遲執行的回呼若序號已過期即放棄，避免快速開關時互相覆蓋 */
  private transitionId = 0;

  /** 目前轉場的結束通知：轉場完成、被下一次轉場取代或中止時 resolve（供 show() / hide() 等待） */
  private transitionSettled: Promise<void> = Promise.resolve();
  private settleTransition: () => void = () => {};

  /** 下一次關閉的原因（由觸發關閉的操作設定） */
  private pendingReason: ModalCloseReason = 'api';

  /** 退場動畫中這次關閉的原因 */
  private hidingReason: ModalCloseReason = 'api';

  /** 本次點擊是否從遮罩開始按下（避免從面板內拖曳到遮罩放開時誤關閉） */
  private pointerDownOnBackdrop = false;

  private releaseScroll: (() => void) | null = null;
  private restoreFocus: (() => void) | null = null;
  private popLayer: (() => void) | null = null;

  /**
   * 開啟對話框。開啟完成（`aui-after-show` 之後）、被取消（`aui-show` 被 preventDefault）
   * 或被之後的關閉取代時 resolve；結果請以 `open` 判斷
   */
  async show(): Promise<void> {
    this.open = true;
    await this.transitionEnd();
  }

  /**
   * 關閉對話框（關閉原因為 `api`）。關閉完成（`aui-after-hide` 之後）、被取消（`aui-hide` 被 preventDefault）
   * 或被之後的開啟取代時 resolve；結果請以 `open` 判斷
   */
  async hide(): Promise<void> {
    this.requestClose('api');
    await this.transitionEnd();
  }

  /**
   * 等待 open 的變化處理完畢，再等待目前的轉場結束。
   * aui-show / aui-hide 被取消時會撤回 open 而再更新一次，因此等到沒有後續更新為止。
   * 不在頁面上的元素不會開啟（從未連接過的 Lit 元素 updateComplete 也不會 resolve），直接返回
   */
  private async transitionEnd(): Promise<void> {
    if (!this.isConnected) return;
    let done = false;
    while (!done) done = await this.updateComplete;
    await this.transitionSettled;
  }

  /** 開始新的轉場：前一次轉場視為已被取代（其等待者隨即 resolve），回傳新的序號 */
  private beginTransition(): number {
    this.settleTransition();
    this.transitionSettled = new Promise((resolve) => (this.settleTransition = resolve));
    return ++this.transitionId;
  }

  /**
   * 開啟中（或退場動畫中）被移出頁面：瀏覽器只會把 dialog 移出 Top Layer，不觸發 close 且保留 open 屬性，
   * 重新插入後會成為蓋住整頁、卻不是 modal 的 dialog。因此自行關閉 dialog、釋放鎖定與 modal 層，
   * 並補發關閉事件（無法取消），讓依關閉結果運作的元件（如 Alert）得到結果
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (!this.isShown && !this.dialog?.open) return;

    const wasShown = this.isShown;
    // 退場動畫中：aui-hide 已分派，沿用當時的關閉原因
    const reason = wasShown ? this.pendingReason : this.hidingReason;
    this.pendingReason = 'api';
    this.beginTransition();
    this.isShown = false;
    this.isVisible = false;
    this.open = false;
    this.dialog.close();
    this.releaseResources({ restoreFocus: false });

    if (wasShown) {
      this.dispatchEvent(
        new CustomEvent<ModalHideDetail>('aui-hide', {
          detail: { reason },
          bubbles: true,
          composed: true,
        }),
      );
    }
    this.dispatchAfterHide(reason);
    this.settleTransition();
  }

  private requestClose(reason: ModalCloseReason): void {
    if (!this.open) return;
    this.pendingReason = reason;
    this.open = false;
  }

  override willUpdate(): void {
    // 首次渲染前直接由子元素判斷插槽內容，不必等 slotchange
    if (!this.hasUpdated) {
      const slots = [...this.children].map((child) => child.slot);
      this.hasHeaderSlot = slots.includes('header');
      this.hasFooterSlot = slots.includes('footer');
    }
  }

  override updated(changed: PropertyValues<this>): void {
    if (!changed.has('open')) return;
    // 每次處理 open 的變化都取用並清除關閉原因：關閉要求在同一個 task 內被撤回（open 又設回 true）時，
    // 殘留的原因不可套用到之後以 `open = false` 觸發的關閉
    const reason = this.pendingReason;
    this.pendingReason = 'api';
    if (this.open && !this.isShown) {
      this.startShow();
    } else if (!this.open && this.isShown) {
      this.startHide(reason);
    }
  }

  private startShow(): void {
    // 不在頁面上的 dialog 無法 showModal()（例如設定 open 後在同一個 task 內被移除）：不開啟
    if (!this.isConnected) {
      this.open = false;
      return;
    }

    const event = new CustomEvent('aui-show', { bubbles: true, composed: true, cancelable: true });
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      this.open = false;
      return;
    }

    // 退場動畫期間重新開啟時，dialog 仍開著，沿用既有的鎖定與 modal 層
    const reopening = this.dialog.open;
    if (!reopening) {
      const restoreFocus = rememberFocus();
      // 須在 showModal() 前鎖定（隱藏捲軸前才量得到捲軸寬度）；showModal() 失敗時立即歸還，
      // 否則計數永遠不會歸零，整頁無法捲動
      const releaseScroll = lockScroll();
      try {
        this.dialog.showModal();
      } catch (error) {
        releaseScroll();
        this.open = false;
        throw error;
      }
      this.restoreFocus = restoreFocus;
      this.releaseScroll = releaseScroll;
      // 須在 showModal() 之後登記（見 pushModalLayer 說明）
      this.popLayer = pushModalLayer(this);
    }

    const transitionId = this.beginTransition();
    this.isShown = true;
    if (!reopening) this.applyInitialFocus(transitionId);

    requestAnimationFrame(() => {
      if (transitionId !== this.transitionId) return;
      this.isVisible = true;
      void this.updateComplete.then(() => {
        window.setTimeout(() => {
          if (transitionId !== this.transitionId) return;
          this.dispatchEvent(new CustomEvent('aui-after-show', { bubbles: true, composed: true }));
          this.settleTransition();
        }, transitionTimeMs(this.panel));
      });
    });
  }

  private startHide(reason: ModalCloseReason): void {
    const event = new CustomEvent<ModalHideDetail>('aui-hide', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      this.open = true;
      return;
    }

    const transitionId = this.beginTransition();
    this.isShown = false;
    this.isVisible = false;
    this.hidingReason = reason;

    void this.updateComplete.then(() => {
      window.setTimeout(() => {
        if (transitionId !== this.transitionId) return;
        this.dialog.close();
        this.releaseResources({ restoreFocus: true });
        this.dispatchAfterHide(reason);
        this.settleTransition();
      }, transitionTimeMs(this.panel));
    });
  }

  /** 初始焦點：內容中帶 autofocus 的元素（不含巢狀 modal 內的），否則為面板本身 */
  private applyInitialFocus(transitionId: number): void {
    const autofocus = [...this.querySelectorAll<HTMLElement>('[autofocus]')].find(
      (element) => element.closest('aui-modal') === this,
    );
    if (!autofocus) {
      this.panel.focus();
      return;
    }
    autofocus.focus();

    // 自訂元素（如 <aui-button>）若與 modal 同時建立並開啟，首次渲染前內部還沒有可聚焦的元素：
    // 先聚焦面板讓焦點進入對話框，渲染完成後再移到目標
    const pending = (autofocus as Partial<{ updateComplete: Promise<unknown> }>).updateComplete;
    if (pending && !autofocus.matches(':focus-within')) {
      this.panel.focus();
      void pending.then(() => {
        if (transitionId === this.transitionId && this.isShown) autofocus.focus();
      });
    }
  }

  /** 依開啟時的相反順序釋放：先移除 modal 層，再解除捲動鎖定與返還焦點 */
  private releaseResources({ restoreFocus }: { restoreFocus: boolean }): void {
    this.popLayer?.();
    this.releaseScroll?.();
    if (restoreFocus) this.restoreFocus?.();
    this.popLayer = this.releaseScroll = this.restoreFocus = null;
  }

  private dispatchAfterHide(reason: ModalCloseReason): void {
    this.dispatchEvent(
      new CustomEvent<ModalHideDetail>('aui-after-hide', {
        detail: { reason },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** ESC：由元件接手（才能播放退場動畫並分派可取消的 aui-hide） */
  private handleCancel = (event: Event) => {
    event.preventDefault();
    if (this.closeOnEscape) this.requestClose('escape');
  };

  /**
   * 瀏覽器自行關閉 dialog：例如沒有使用者互動時，Chrome 的關閉要求防濫用機制會忽略 cancel 的
   * preventDefault() 並直接關閉。此時無法取消，只同步狀態並釋放資源。
   *
   * 注意 close 事件是在 dialog.close() 之後才以 task 非同步分派：元件自行關閉後若已立即重新開啟，
   * 收到的會是過期的事件，因此以 dialog 當下是否仍開啟判斷，而非呼叫 close() 時的旗標。
   */
  private handleNativeClose = () => {
    if (this.dialog.open || (!this.isShown && !this.open)) return;
    this.beginTransition();
    const wasShown = this.isShown;
    this.isShown = false;
    this.isVisible = false;
    this.open = false;
    if (wasShown) {
      this.dispatchEvent(
        new CustomEvent<ModalHideDetail>('aui-hide', {
          detail: { reason: 'escape' },
          bubbles: true,
          composed: true,
        }),
      );
    }
    this.releaseResources({ restoreFocus: true });
    this.dispatchAfterHide('escape');
    this.settleTransition();
  };

  private handlePointerDown = (event: PointerEvent) => {
    this.pointerDownOnBackdrop = event.target === this.dialog;
  };

  private handleClick = (event: MouseEvent) => {
    const fromBackdrop = this.pointerDownOnBackdrop && event.target === this.dialog;
    this.pointerDownOnBackdrop = false;
    if (fromBackdrop && this.closeOnBackdrop) this.requestClose('backdrop');
  };

  private handleCloseButton = () => {
    this.requestClose('close-button');
  };

  private handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === 'header') this.hasHeaderSlot = hasContent;
    else if (slot.name === 'footer') this.hasFooterSlot = hasContent;
  };

  override render() {
    const hasHeader = Boolean(this.heading) || this.hasHeaderSlot;
    const ariaLabel = !this.heading && this.label ? this.label : undefined;

    return html`
      <dialog
        part="dialog"
        class=${classMap({ modal: true, 'modal--visible': this.isVisible })}
        aria-labelledby=${ifDefined(this.heading ? 'title' : undefined)}
        aria-label=${ifDefined(ariaLabel)}
        aria-describedby=${ifDefined(this.description ? 'description' : undefined)}
        role=${ifDefined(this.dialogRole === 'alertdialog' ? 'alertdialog' : undefined)}
        @cancel=${this.handleCancel}
        @close=${this.handleNativeClose}
        @pointerdown=${this.handlePointerDown}
        @click=${this.handleClick}
      >
        <div part="panel" class="modal__panel modal__panel--${this.size}" tabindex="-1">
          <div
            part="header"
            class=${classMap({ modal__header: true, 'modal__header--empty': !hasHeader })}
          >
            ${
              this.heading
                ? html`<h2 part="title" id="title" class="modal__title">${this.heading}</h2>`
                : nothing
            }
            <slot name="header" @slotchange=${this.handleSlotChange}></slot>
            ${
              this.noCloseButton
                ? nothing
                : html`
                    <button
                      part="close-button"
                      class="modal__close"
                      type="button"
                      aria-label="關閉"
                      @click=${this.handleCloseButton}
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
          <div part="body" class="modal__body">
            <slot></slot>
          </div>
          <div
            part="footer"
            class=${classMap({ modal__footer: true, 'modal__footer--empty': !this.hasFooterSlot })}
          >
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
        <slot name=${MODAL_OVERLAY_SLOT}></slot>
        ${
          this.description
            ? html`<span id="description" class="sr-only">${this.description}</span>`
            : nothing
        }
      </dialog>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-modal')) {
  customElements.define('aui-modal', AuiModal);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-modal': AuiModal;
  }
}
