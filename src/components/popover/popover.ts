import { LitElement, html, type CSSResultGroup, type PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
import { TRANSFORM_ORIGINS } from '../../internal/floating.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import { setPopupTriggerState } from '../../internal/popup-trigger.js';
import { transitionTimeMs } from '../../internal/transition.js';
import { popoverStyles } from './popover.styles.js';
import type { PopoverCloseReason, PopoverHideDetail, PopoverPlacement } from './popover.types.js';

/** 浮層元件：內容在其自身開啟前不可見，開啟本面板時不聚焦其中的元素 */
const OVERLAY_HOSTS = new Set(['aui-popover', 'aui-modal', 'aui-drawer', 'aui-alert']);

/** 原生可取得焦點的元素；自訂元素（如 `<aui-button>`）另以 focus() 後是否真的取得焦點判斷 */
const NATIVE_FOCUSABLE =
  'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable="true"]';

/**
 * Anchor UI — Popover 元件 (`<aui-popover>`)
 *
 * 點擊觸發、承載可互動內容（清單、連結、按鈕）的非強制回應浮層，例如導覽列的通知清單、使用者資訊面板。
 * Tooltip 的語意是說明文字（`role="tooltip"`），不適合放互動內容。
 *
 * - 面板以原生 Popover API 進入 Top Layer（不受 `overflow: hidden` 裁切），位置由 `@floating-ui/dom` 計算並自動避開視窗邊緣。
 * - 觸發元素（`trigger` slot）帶有 `aria-expanded`、`aria-haspopup="dialog"` 與 `aria-controls`；
 *   `<aui-button>`、`<aui-icon-button>` 會寫在其內部的 `<button>` 上。
 * - 面板為 `role="dialog"`（非強制回應），名稱取自 `label`，未設定時取自觸發元素。
 * - 開啟後焦點移入面板（第一個可聚焦的元素，有 `autofocus` 者優先；沒有時為面板本身）。
 * - ESC、再次點擊觸發元素：關閉並把焦點還給觸發元素。點擊外部：關閉，焦點落空時還給觸發元素。
 *   焦點以 Tab 移到外部：關閉，不移動焦點。
 *
 * 下列事件皆 `bubbles` + `composed`；放在其他浮層內時，外層請以 `event.target` 區分來源。
 *
 * @element aui-popover
 *
 * @slot - 面板內容
 * @slot trigger - 觸發元素（建議使用 `<aui-button>`、`<aui-icon-button>` 或原生 `<button>`）
 *
 * @csspart trigger - 觸發元素的包裝容器
 * @csspart panel - 浮層面板
 *
 * @fires {CustomEvent<null>} aui-show - 開始開啟前觸發（可被 preventDefault 取消）
 * @fires {CustomEvent<null>} aui-after-show - 完全開啟且進場動畫結束後觸發
 * @fires {CustomEvent<PopoverHideDetail>} aui-hide - 開始關閉前觸發（可被 preventDefault 取消），`detail.reason` 為關閉原因
 * @fires {CustomEvent<PopoverHideDetail>} aui-after-hide - 完全關閉且退場動畫結束後觸發，`detail.reason` 為關閉原因
 */
export class AuiPopover extends LitElement {
  static override styles: CSSResultGroup = popoverStyles;

  /** 是否開啟 */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** 面板相對於觸發元素的方位；空間不足時自動翻轉與平移 */
  @property({ type: String, reflect: true })
  placement: PopoverPlacement = 'bottom-start';

  /** 與觸發元素之主軸距離（像素） */
  @property({ type: Number })
  distance = 8;

  /** 與觸發元素之副軸偏移（像素） */
  @property({ type: Number })
  skidding = 0;

  /** 面板的無障礙名稱；未設定時以觸發元素作為名稱 */
  @property({ type: String })
  label = '';

  @state()
  private isVisible = false;

  @query('.popover__panel')
  protected panel!: HTMLElement;

  /** 面板的角色，也是觸發元素的 aria-haspopup（子類別可覆寫，例如選單為 menu） */
  protected readonly popupRole: 'dialog' | 'menu' = 'dialog';

  /** 目前的觸發元素（trigger slot 中的第一個元素） */
  protected triggerElement: HTMLElement | null = null;

  /** 已開始開啟、尚未開始關閉（進場動畫的 rAF 前即為 true，與視覺狀態 isVisible 分開追蹤） */
  private isShowing = false;
  /** 退場動畫中（aui-hide 已分派、aui-after-hide 尚未分派） */
  private isHiding = false;
  /** 開/關轉場序號：延遲執行的回呼若序號已過期即放棄，避免快速開關時互相覆蓋 */
  private transitionId = 0;
  /** 下一次關閉的原因（hide() 等設定 open 前記下） */
  private pendingReason: PopoverCloseReason = 'api';
  /** 進行中的關閉原因（aui-after-hide 使用） */
  private hideReason: PopoverCloseReason = 'api';
  /** 點擊外部的當下焦點是否在本元件內（決定關閉後是否還原焦點） */
  private focusWasInside = false;
  private cleanupAutoUpdate: (() => void) | null = null;

  constructor() {
    super();
    // 觸發元素與面板內容都在 light DOM，鍵盤與焦點事件會經過 host
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('focusout', this.handleFocusOut);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // 重新插入頁面（框架重排節點等）：重新綁定觸發元素
    if (this.hasUpdated) this.syncTrigger();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
    this.stopAutoUpdate();
    if (this.triggerElement) setPopupTriggerState(this.triggerElement, null);
    // 移出頁面時瀏覽器會關閉 popover（沒有事件）：同步狀態並補上關閉事件，讓成對監聽的使用端收到結果
    this.transitionId++;
    const wasShowing = this.isShowing;
    const wasHiding = this.isHiding;
    this.isShowing = false;
    this.isHiding = false;
    this.isVisible = false;
    if (wasShowing) {
      this.open = false;
      this.hideReason = 'api';
      this.dispatchEvent(new CustomEvent('aui-hide', this.hideEventInit(false)));
    }
    if (wasShowing || wasHiding) {
      this.dispatchEvent(new CustomEvent('aui-after-hide', this.hideEventInit(false)));
    }
  }

  override firstUpdated(): void {
    this.syncTrigger();
  }

  /**
   * 開關的決定在渲染前處理：可取消的 aui-show / aui-hide 在此分派，被取消時改回的 open 與原本的變化
   * 在同一次渲染套用（在 updated() 才改狀態會再排一次更新，open attribute 也會先反映再改回）。
   * 實際開啟須等面板已渲染，在 updated() 處理
   */
  override willUpdate(changed: PropertyValues<this>): void {
    super.willUpdate(changed);
    if (!changed.has('open')) return;
    if (!this.open && this.isShowing) {
      this.startHide();
    } else if (this.open && !this.isShowing) {
      // 退場動畫中重新開啟：先結束被中斷的關閉，成對監聽 aui-hide / aui-after-hide 的使用端才會收到結果
      if (this.isHiding) this.finishHide();
      const event = new CustomEvent('aui-show', {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      if (!this.dispatchEvent(event)) this.open = false;
    }
  }

  override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has('open') && this.open && !this.isShowing) {
      // 初次渲染就是開啟狀態（例如 HTML 寫了 open）時不搶走頁面的焦點
      this.startShow(changed.get('open') !== undefined);
    } else if (
      this.isShowing &&
      (changed.has('placement') || changed.has('distance') || changed.has('skidding'))
    ) {
      void this.reposition();
    }
    if (changed.has('label')) this.syncPanelName();
  }

  /** 開啟面板 */
  show(): void {
    this.open = true;
  }

  /** 關閉面板（`aui-hide` 的 `detail.reason` 為 `api`） */
  hide(): void {
    this.close('api');
  }

  /** 切換開啟狀態 */
  toggle(): void {
    if (this.open) this.hide();
    else this.show();
  }

  /** 以指定原因關閉（子類別可用，例如選單選取項目後關閉） */
  protected close(reason: PopoverCloseReason): void {
    if (!this.open) return;
    this.pendingReason = reason;
    this.open = false;
  }

  /**
   * 開啟後移入焦點：預設為面板內第一個可聚焦的元素（有 autofocus 者優先），沒有時為面板本身。
   * 巢狀浮層（另一個 Popover 的面板、Modal 等）的內容不列入。子類別可覆寫（例如選單聚焦第一個項目）
   */
  protected async focusPanel(): Promise<void> {
    const transitionId = this.transitionId;
    const candidates = this.panelElements().filter((element) => !this.inNestedOverlay(element));
    const autofocus = candidates.find((element) => element.hasAttribute('autofocus'));
    // 尚未渲染的 Lit 元件（例如剛插入的 <aui-button autofocus>）要等渲染完成才能聚焦（同 Modal）
    const pending = (autofocus as Partial<Pick<LitElement, 'updateComplete'>> | undefined)
      ?.updateComplete;
    if (pending) {
      await pending;
      if (transitionId !== this.transitionId) return;
    }
    const ordered = autofocus ? [autofocus, ...candidates] : candidates;
    for (const element of ordered) {
      if (!element.matches(NATIVE_FOCUSABLE) && !element.localName.includes('-')) continue;
      if (element.matches('[disabled], [tabindex="-1"]')) continue;
      (element as HTMLElement).focus({ preventScroll: true });
      // 自訂元素不一定可聚焦（沒有 delegatesFocus 等），以實際的焦點位置確認
      if (element.matches(':focus-within')) return;
    }
    this.panel?.focus({ preventScroll: true });
  }

  /** 元素是否位於面板內容中另一個浮層的內容裡（巢狀 Popover 的觸發元素仍屬於本面板） */
  private inNestedOverlay(element: Element): boolean {
    for (let node = element.parentElement; node && node !== this; node = node.parentElement) {
      if (!OVERLAY_HOSTS.has(node.localName)) continue;
      const nestedTrigger = element.closest('[slot="trigger"]');
      return !(node.localName === 'aui-popover' && nestedTrigger?.parentElement === node);
    }
    return false;
  }

  /** 面板內容（預設 slot）中的所有元素，依文件順序 */
  protected panelElements(): Element[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    return (slot?.assignedElements({ flatten: true }) ?? []).flatMap((element) => [
      element,
      ...element.querySelectorAll('*'),
    ]);
  }

  /** 節點是否位於本元件內（觸發元素、面板內容，含其中各層 Shadow DOM） */
  protected containsDeep(node: Node | null): boolean {
    let current = node;
    while (current) {
      if (this.contains(current) || this.shadowRoot?.contains(current)) return true;
      const root = current.getRootNode();
      current = root instanceof ShadowRoot ? root.host : null;
    }
    return false;
  }

  private syncTrigger(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    const next = (slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined) ?? null;
    if (next !== this.triggerElement && this.triggerElement) {
      setPopupTriggerState(this.triggerElement, null);
    }
    this.triggerElement = next;
    this.syncTriggerState();
    this.syncPanelName();
    if (this.isShowing) this.startAutoUpdate();
  }

  private syncTriggerState(): void {
    if (!this.triggerElement) return;
    setPopupTriggerState(this.triggerElement, {
      expanded: this.isShowing,
      hasPopup: this.popupRole,
      controls: this,
    });
  }

  /**
   * 未設定 label 時以觸發元素命名面板。aria-labelledby 的 IDREF 無法從 Shadow DOM 指向 light DOM，
   * 以元素參照（ariaLabelledByElements）設定：參照可指向外層 tree 的元素
   */
  private syncPanelName(): void {
    if (!this.panel) return;
    (
      this.panel as HTMLElement & { ariaLabelledByElements: Element[] | null }
    ).ariaLabelledByElements = !this.label && this.triggerElement ? [this.triggerElement] : null;
  }

  /** 開啟（aui-show 已在 willUpdate() 分派且未被取消） */
  private startShow(moveFocus: boolean): void {
    const transitionId = ++this.transitionId;
    this.isShowing = true;
    this.isHiding = false;
    try {
      this.panel.showPopover?.();
    } catch {
      // 不支援 Popover API
    }
    this.syncTriggerState();
    this.startAutoUpdate();
    document.addEventListener('pointerdown', this.handleDocumentPointerDown, true);
    if (moveFocus) void this.focusPanel();

    requestAnimationFrame(() => {
      if (transitionId !== this.transitionId) return;
      this.isVisible = true;
      this.dispatchEvent(new CustomEvent('aui-after-show', { bubbles: true, composed: true }));
    });
  }

  private startHide(): void {
    const reason = this.pendingReason;
    this.pendingReason = 'api';
    this.hideReason = reason;
    if (!this.dispatchEvent(new CustomEvent('aui-hide', this.hideEventInit(true)))) {
      this.open = true;
      return;
    }

    const transitionId = ++this.transitionId;
    this.isShowing = false;
    this.isHiding = true;
    this.isVisible = false;
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
    this.syncTriggerState();
    this.restoreFocus(reason);

    window.setTimeout(() => {
      if (transitionId === this.transitionId) this.finishHide();
    }, transitionTimeMs(this.panel));
  }

  /**
   * 結束關閉：退場動畫結束，或退場中被重新開啟而中斷。
   * 中斷時也先把面板移出 Top Layer：重新開啟若被 aui-show 取消，面板不會以透明狀態留在最上層
   */
  private finishHide(): void {
    this.transitionId++;
    try {
      this.panel.hidePopover?.();
    } catch {
      // 已關閉或不支援 Popover API
    }
    this.stopAutoUpdate();
    this.isHiding = false;
    this.dispatchEvent(new CustomEvent('aui-after-hide', this.hideEventInit(false)));
  }

  /**
   * aui-hide / aui-after-hide 的事件設定。事件名稱在呼叫端以字串常值寫出：
   * custom-elements-manifest 會把 new CustomEvent(變數) 的變數名稱誤當成事件名稱
   */
  private hideEventInit(cancelable: boolean): CustomEventInit<PopoverHideDetail> {
    return { detail: { reason: this.hideReason }, bubbles: true, composed: true, cancelable };
  }

  /**
   * 關閉時把焦點還給觸發元素（只在焦點位於本元件內時，不搶走使用者已移到別處的焦點）。
   * 點擊外部時焦點會移到被點擊的元素：只在點擊前焦點位於本元件內、且點擊的預設行為完成後焦點落空（回到 body）才還原
   */
  private restoreFocus(reason: PopoverCloseReason): void {
    const trigger = this.triggerElement;
    if (!trigger || reason === 'focus-out') return;
    if (reason === 'outside') {
      if (!this.focusWasInside) return;
      window.setTimeout(() => {
        const active = getDeepActiveElement();
        if (!active || active === document.body || this.containsDeep(active)) {
          trigger.focus({ preventScroll: true });
        }
      });
      return;
    }
    if (this.containsDeep(getDeepActiveElement())) trigger.focus({ preventScroll: true });
  }

  private handleTriggerSlotChange = (): void => {
    this.syncTrigger();
  };

  private handleTriggerClick = (): void => {
    if (this.open) this.close('trigger');
    else this.show();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // 已被內層元件（巢狀的浮層等）處理的 ESC 不再處理；preventDefault 也讓外層的 Modal 不因同一次 ESC 關閉
    if (event.key !== 'Escape' || !this.open || event.defaultPrevented) return;
    event.preventDefault();
    this.close('escape');
  };

  private handleFocusOut = (event: FocusEvent): void => {
    if (!this.isShowing) return;
    // relatedTarget 為 null（焦點離開視窗、點擊不可聚焦的區域）時交由點擊外部的處理判斷
    const next = event.relatedTarget as Node | null;
    if (next && !this.containsDeep(next)) this.close('focus-out');
  };

  private handleDocumentPointerDown = (event: PointerEvent): void => {
    if (!this.isShowing || event.composedPath().includes(this)) return;
    this.focusWasInside = this.containsDeep(getDeepActiveElement());
    this.close('outside');
  };

  /** 重新計算面板位置 */
  async reposition(): Promise<void> {
    const reference = this.triggerElement ?? this.shadowRoot?.querySelector('.popover__trigger');
    if (!reference || !this.panel) return;
    const { x, y, placement } = await computePosition(reference, this.panel, {
      placement: this.placement as Placement,
      strategy: 'fixed',
      middleware: [
        offset({ mainAxis: this.distance, crossAxis: this.skidding }),
        flip({ fallbackAxisSideDirection: 'start', padding: 8 }),
        shift({ padding: 8 }),
      ],
    });
    this.panel.style.left = `${Math.round(x)}px`;
    this.panel.style.top = `${Math.round(y)}px`;
    this.panel.setAttribute('data-placement', placement);
    this.panel.style.setProperty('--_aui-popover-origin', TRANSFORM_ORIGINS[placement]);
  }

  private startAutoUpdate(): void {
    this.stopAutoUpdate();
    const reference = this.triggerElement ?? this.shadowRoot?.querySelector('.popover__trigger');
    if (reference && this.panel) {
      this.cleanupAutoUpdate = autoUpdate(reference, this.panel, () => void this.reposition());
    }
  }

  private stopAutoUpdate(): void {
    this.cleanupAutoUpdate?.();
    this.cleanupAutoUpdate = null;
  }

  override render() {
    return html`
      <div class="popover__trigger" part="trigger" @click=${this.handleTriggerClick}>
        <slot name="trigger" @slotchange=${this.handleTriggerSlotChange}></slot>
      </div>
      <div
        class=${classMap({ popover__panel: true, 'popover__panel--visible': this.isVisible })}
        part="panel"
        popover="manual"
        role=${this.popupRole}
        tabindex="-1"
        aria-label=${ifDefined(this.label || undefined)}
      >
        <slot></slot>
      </div>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-popover')) {
  customElements.define('aui-popover', AuiPopover);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-popover': AuiPopover;
  }
}
