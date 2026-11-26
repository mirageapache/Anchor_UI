import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defaultTrue } from './converters.js';
import { rememberFocus } from './focus-return.js';
import { lockScroll } from './scroll-lock.js';
import { MODAL_OVERLAY_SLOT, getModalLayers, pushModalLayer } from './top-layer.js';
import { transitionTimeMs } from './transition.js';

/**
 * 關閉原因（各元件的 `*CloseReason` 型別與此相同）
 * - `escape`：按下 ESC（或瀏覽器的返回手勢等關閉要求）
 * - `backdrop`：點擊遮罩
 * - `close-button`：點擊頁首的關閉鈕
 * - `api`：以程式關閉（`hide()` 或將 `open` 設為 false），或開啟中被移出頁面
 */
export type DialogCloseReason = 'escape' | 'backdrop' | 'close-button' | 'api';

interface DialogHideDetail {
  reason: DialogCloseReason;
}

/** `renderDialog()` 的設定 */
interface DialogRenderOptions {
  /** class 前綴（如 `modal`），與 `dialogBaseStyles()` 的參數相同 */
  prefix: string;
  /** 面板的額外 class（尺寸、方向等元件自己的變化） */
  panelClass: string;
  /** dialog 的 role；未指定時為原生的 `dialog` */
  role?: 'alertdialog';
}

/**
 * 以本基底實作的元件標籤：尋找初始焦點時略過巢狀於其中的 `[autofocus]`（屬於內層對話框）。
 * 新增子類別時須一併加入
 */
const DIALOG_HOSTS = 'aui-modal, aui-drawer, aui-alert';

/**
 * 立即關閉（不可取消、不播放動畫）的方法名稱。以 `Symbol.for` 登記，頁面上有多份程式庫時
 * 外層對話框仍能關閉另一份程式庫的內層對話框
 */
const FORCE_CLOSE = Symbol.for('aui.modal-dialog.force-close');

interface ForceClosable {
  [FORCE_CLOSE]?: () => void;
}

/** node 是否位於 ancestor 的子樹內（跨越 Shadow DOM 邊界） */
function isComposedDescendant(node: Node, ancestor: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === ancestor) return true;
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/**
 * 模態對話框的共用基底（`<aui-modal>`、`<aui-drawer>`）。
 *
 * 處理原生 `<dialog>.showModal()` 的開關生命週期：可取消的 `aui-show` / `aui-hide`、
 * 進退場動畫（進場由子類別的 CSS `@starting-style` 定義，退場時 `isLeaving` 為 true）、
 * ESC 與點擊遮罩關閉、背景捲動鎖定、焦點返還、modal 層登記（`pushModalLayer`），
 * 以及瀏覽器自行關閉或開啟中被移出頁面時的狀態同步。
 *
 * 子類別的 `render()` 回傳 `renderDialog()`：共用的 `<dialog>` 結構（事件綁定、面板、頁首、內容、頁尾、
 * overlay slot 與無障礙描述）只有這一份，子類別以 class 前綴與面板的 class 決定外觀
 * （樣式為 `dialogBaseStyles(prefix)` 加上元件自己的版面）。面板的 CSS transition 決定動畫時長；
 * 點擊 dialog 本身（面板以外的區域）即為點擊遮罩。
 */
export abstract class ModalDialogElement extends LitElement {
  @query('dialog')
  private dialog!: HTMLDialogElement;

  @query('[part="panel"]')
  private panel!: HTMLElement;

  /**
   * 是否開啟（可直接設定，等同呼叫 show() / hide()）
   */
  @property({ type: Boolean, reflect: true })
  open = false;

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

  /**
   * 頁首關閉鈕的無障礙名稱
   */
  @property({ type: String, attribute: 'close-label' })
  closeLabel = '關閉';

  /** 退場動畫中（套用 --leaving 樣式）；進場的起始狀態由 CSS @starting-style 定義 */
  @state()
  private isLeaving = false;

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
  private pendingReason: DialogCloseReason = 'api';

  /** 退場動畫中這次關閉的原因 */
  private hidingReason: DialogCloseReason = 'api';

  /** 本次點擊是否從遮罩開始按下（避免從面板內拖曳到遮罩放開時誤關閉） */
  private pointerDownOnBackdrop = false;

  private releaseScroll: (() => void) | null = null;
  private restoreFocus: (() => void) | null = null;
  private popLayer: (() => void) | null = null;

  /**
   * 開啟。開啟完成（`aui-after-show` 之後）、被取消（`aui-show` 被 preventDefault）
   * 或被之後的關閉取代時 resolve；結果請以 `open` 判斷
   */
  async show(): Promise<void> {
    this.open = true;
    await this.transitionEnd();
  }

  /**
   * 關閉（關閉原因為 `api`）。關閉完成（`aui-after-hide` 之後）、被取消（`aui-hide` 被 preventDefault）
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
    this[FORCE_CLOSE]();
  }

  /**
   * 立即關閉：不播放動畫、不返還焦點，補發不可取消的關閉事件。
   * 用於被移出頁面，以及外層對話框關閉時（內層的 dialog 會隨外層一起不再渲染，見 closeNestedDialogs）
   */
  private [FORCE_CLOSE](): void {
    if (!this.isShown && !this.dialog?.open) return;

    const wasShown = this.isShown;
    // 退場動畫中：aui-hide 已分派，沿用當時的關閉原因
    const reason = wasShown ? this.pendingReason : this.hidingReason;
    this.pendingReason = 'api';
    this.beginTransition();
    this.isShown = false;
    this.isLeaving = false;
    this.open = false;
    this.dialog.close();
    this.releaseResources({ restoreFocus: false });

    if (wasShown) this.dispatchHide(reason, { cancelable: false });
    this.dispatchAfterHide(reason);
    this.settleTransition();
  }

  /**
   * 關閉位於本對話框子樹內、仍開啟的對話框（含其他元件 Shadow DOM 內的，如 Alert 內部的 Modal）。
   * 外層的 dialog 關閉後為 `display: none`，內層的 dialog 隨之不再渲染，卻仍是 Top Layer 中的 modal：
   * 畫面上什麼都沒有，頁面卻保持 inert 且無法捲動。因此外層關閉時一併結束內層（由上而下）
   */
  private closeNestedDialogs(): void {
    for (const layer of getModalLayers().reverse()) {
      if (layer !== this && isComposedDescendant(layer, this)) {
        (layer as ForceClosable)[FORCE_CLOSE]?.();
      }
    }
  }

  private requestClose(reason: DialogCloseReason): void {
    if (!this.open) return;
    this.pendingReason = reason;
    this.open = false;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    super.willUpdate(changed);
    // 首次渲染前直接由子元素判斷插槽內容，不必等 slotchange
    if (!this.hasUpdated) {
      const slots = [...this.children].map((child) => child.slot);
      this.hasHeaderSlot = slots.includes('header');
      this.hasFooterSlot = slots.includes('footer');
    }

    if (!changed.has('open')) return;
    // 每次處理 open 的變化都取用並清除關閉原因：關閉要求在同一個 task 內被撤回（open 又設回 true）時，
    // 殘留的原因不可套用到之後以 `open = false` 觸發的關閉
    const reason = this.pendingReason;
    this.pendingReason = 'api';
    // 關閉在渲染前處理：退場樣式（isLeaving）與 open 的變化在同一次渲染套用。
    // 若在 updated() 才改 isLeaving，Lit 會再排一次更新（開發模式的 change-in-update 警告）
    if (!this.open && this.isShown) this.startHide(reason);
    // 退場動畫中重新開啟：dialog 已渲染且仍開著，同樣在渲染前處理（取消退場樣式）
    else if (this.open && !this.isShown && this.dialog?.open) this.startShow();
  }

  /** 開啟須等 dialog 已渲染（首次渲染即開啟時），因此在 updated() 處理 */
  override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has('open') && this.open && !this.isShown) this.startShow();
  }

  private startShow(): void {
    // 不在頁面上的 dialog 無法 showModal()（例如設定 open 後在同一個 task 內被移除）：不開啟
    if (!this.isConnected) {
      this.open = false;
      return;
    }

    const event = new CustomEvent('aui-show', { bubbles: true, composed: true, cancelable: true });
    this.dispatchEvent(event);
    // 監聽者也可能在 aui-show 中把元素移出頁面：同樣無法 showModal()（會拋出 InvalidStateError）
    if (event.defaultPrevented || !this.isConnected) {
      this.open = false;
      return;
    }

    // 退場動畫期間重新開啟時，dialog 仍開著，沿用既有的鎖定與 modal 層；
    // 先結束被中斷的那次關閉（aui-hide 已分派），事件才會成對
    const reopening = this.dialog.open;
    if (reopening) this.dispatchAfterHide(this.hidingReason);
    else {
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

    // 進場由 CSS 的 @starting-style 處理（showModal() 後自動從起始樣式轉場）；
    // 退場動畫中重新開啟時，取消退場樣式即轉場回開啟狀態
    this.isLeaving = false;
    void this.updateComplete.then(() => {
      window.setTimeout(() => {
        if (transitionId !== this.transitionId) return;
        this.dispatchEvent(new CustomEvent('aui-after-show', { bubbles: true, composed: true }));
        this.settleTransition();
      }, transitionTimeMs(this.panel));
    });
  }

  private startHide(reason: DialogCloseReason): void {
    if (!this.dispatchHide(reason, { cancelable: true })) {
      this.open = true;
      return;
    }

    const transitionId = this.beginTransition();
    this.isShown = false;
    this.isLeaving = true;
    this.hidingReason = reason;
    this.closeNestedDialogs();

    void this.updateComplete.then(() => {
      window.setTimeout(() => {
        if (transitionId !== this.transitionId) return;
        this.dialog.close();
        this.isLeaving = false;
        this.releaseResources({ restoreFocus: true });
        this.dispatchAfterHide(reason);
        this.settleTransition();
      }, transitionTimeMs(this.panel));
    });
  }

  /** 初始焦點：內容中帶 autofocus 的元素（不含巢狀對話框內的），否則為面板本身 */
  private applyInitialFocus(transitionId: number): void {
    // 元素本身是對話框（如 <aui-modal autofocus>）時 closest() 回傳它自己，同樣略過
    const autofocus = [...this.querySelectorAll<HTMLElement>('[autofocus]')].find(
      (element) => element.closest(DIALOG_HOSTS) === this,
    );
    if (!autofocus) {
      this.panel.focus();
      return;
    }
    autofocus.focus();
    if (autofocus.matches(':focus-within')) return;

    // 目標無法取得焦點（隱藏、停用、位於未開啟的浮層內…）：改聚焦面板，
    // 否則焦點會留在 showModal() 預設的位置（通常是頁首的關閉鈕，Enter 就會關閉對話框）。
    // 自訂元素（如 <aui-button>）若與對話框同時建立並開啟，首次渲染前內部還沒有可聚焦的元素：
    // 同樣先聚焦面板，渲染完成後再移到目標
    this.panel.focus();
    const pending = (autofocus as Partial<{ updateComplete: Promise<unknown> }>).updateComplete;
    if (pending) {
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

  /** 分派 aui-hide，回傳是否繼續關閉（未被取消） */
  private dispatchHide(reason: DialogCloseReason, { cancelable }: { cancelable: boolean }) {
    return this.dispatchEvent(
      new CustomEvent<DialogHideDetail>('aui-hide', {
        detail: { reason },
        bubbles: true,
        composed: true,
        cancelable,
      }),
    );
  }

  private dispatchAfterHide(reason: DialogCloseReason): void {
    this.dispatchEvent(
      new CustomEvent<DialogHideDetail>('aui-after-hide', {
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
    this.isLeaving = false;
    this.open = false;
    if (wasShown) this.dispatchHide('escape', { cancelable: false });
    this.closeNestedDialogs();
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

  /**
   * 共用的 `<dialog>` 結構；子類別的 `render()` 回傳其結果。
   * part 名稱（dialog、panel、header、title、close-button、body、footer）對所有子類別相同
   */
  protected renderDialog({ prefix, panelClass, role }: DialogRenderOptions) {
    const hasHeader = Boolean(this.heading) || this.hasHeaderSlot;
    const ariaLabel = !this.heading && this.label ? this.label : undefined;

    return html`
      <dialog
        part="dialog"
        class=${classMap({ [prefix]: true, [`${prefix}--leaving`]: this.isLeaving })}
        aria-labelledby=${ifDefined(this.heading ? 'title' : undefined)}
        aria-label=${ifDefined(ariaLabel)}
        aria-describedby=${ifDefined(this.description ? 'description' : undefined)}
        role=${ifDefined(role)}
        @cancel=${this.handleCancel}
        @close=${this.handleNativeClose}
        @pointerdown=${this.handlePointerDown}
        @click=${this.handleClick}
      >
        <div part="panel" class="${prefix}__panel ${panelClass}" tabindex="-1">
          <div
            part="header"
            class=${classMap({
              [`${prefix}__header`]: true,
              [`${prefix}__header--empty`]: !hasHeader,
            })}
          >
            ${
              this.heading
                ? html`<h2 part="title" id="title" class="${prefix}__title">${this.heading}</h2>`
                : nothing
            }
            <slot name="header" @slotchange=${this.handleSlotChange}></slot>
            ${this.renderCloseButton(`${prefix}__close`)}
          </div>
          <div part="body" class="${prefix}__body">
            <slot></slot>
          </div>
          <div
            part="footer"
            class=${classMap({
              [`${prefix}__footer`]: true,
              [`${prefix}__footer--empty`]: !this.hasFooterSlot,
            })}
          >
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
        <slot name=${MODAL_OVERLAY_SLOT}></slot>
        ${this.renderDescription()}
      </dialog>
    `;
  }

  /** 頁首關閉鈕（`no-close-button` 時不渲染） */
  private renderCloseButton(className: string) {
    if (this.noCloseButton) return nothing;
    return html`
      <button
        part="close-button"
        class=${className}
        type="button"
        aria-label=${this.closeLabel || '關閉'}
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
    `;
  }

  /**
   * `description` 的文字（id 為 `description`，由 dialog 的 aria-describedby 參照）。
   * `hidden`：只作為描述的來源，不出現在瀏覽模式的閱讀順序中（Alert 的訊息已顯示在畫面上，否則會被讀兩次）；
   * 被 aria-describedby 參照的隱藏元素仍會計入描述
   */
  private renderDescription() {
    if (!this.description) return nothing;
    return html`<span id="description" hidden>${this.description}</span>`;
  }
}
