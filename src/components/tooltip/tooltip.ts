import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  computePosition,
  autoUpdate,
  flip,
  shift,
  offset,
  arrow as floatingArrow,
  type Placement,
} from '@floating-ui/dom';
import { tooltipStyles } from './tooltip.styles.js';
import type { TooltipPlacement, TooltipTrigger } from './tooltip.types.js';

let tooltipIdCounter = 0;

/** 隱藏描述節點使用的內部 slot 名稱 */
const DESCRIPTION_SLOT = 'aui-tooltip-description';

/**
 * Anchor UI — Tooltip 元件 (`<aui-tooltip>`)
 *
 * 全域浮動氣泡提示元件，提供 Shadcn/ui 風格冷黑外觀、微縮放動畫（0.95 -> 1.0）、
 * 支援原生 Popover API 進入 Top Layer（免受 overflow: hidden 裁切）與 @floating-ui/dom 邊界碰撞檢測。
 *
 * @element aui-tooltip
 *
 * @slot - 觸發目標元素（Trigger）
 * @slot content - 提示內容（當需要渲染豐富 HTML 時使用）
 *
 * @csspart trigger - 觸發目標包裝容器
 * @csspart popup - 浮層氣泡容器本體
 * @csspart content - 提示文字/內容容器
 * @csspart arrow - 箭頭指標元素
 *
 * @fires aui-show - 氣泡開始展開前觸發（可被 preventDefault 取消）
 * @fires aui-after-show - 氣泡完全展開且進場動畫結束後觸發
 * @fires aui-hide - 氣泡開始收合前觸發（可被 preventDefault 取消）
 * @fires aui-after-hide - 氣泡完全隱藏且退場動畫結束後觸發
 */
export class AuiTooltip extends LitElement {
  static override styles = tooltipStyles;

  private readonly tooltipId = `aui-tooltip-${++tooltipIdCounter}`;
  private cleanupAutoUpdate: (() => void) | null = null;
  private showTimeoutId: number | null = null;
  private hideTimeoutId: number | null = null;
  private targetElement: HTMLElement | null = null;
  /** 目前被寫入 aria-describedby 的目標與所寫入的 id（用於精準移除，不覆蓋使用者後續變更） */
  private describedTarget: HTMLElement | null = null;
  private describedById = '';
  /**
   * 置於 host light DOM 的隱藏描述節點。
   * aria-describedby 為 IDREF，無法跨 Shadow DOM 邊界解析，
   * 因此必須在觸發目標所在的同一棵 tree 內提供描述文字。
   */
  private descriptionElement: HTMLElement | null = null;

  @query('.tooltip__popup')
  private popupElement!: HTMLElement;

  @query('.tooltip__arrow')
  private arrowElement?: HTMLElement;

  @query('.tooltip__trigger')
  private triggerWrapper!: HTMLElement;

  /**
   * 提示文字內容（簡易純文字）
   */
  @property({ type: String })
  content = '';

  /**
   * 浮動定位方位（共 12 種方位）
   */
  @property({ type: String, reflect: true })
  placement: TooltipPlacement = 'top';

  /**
   * 是否停用提示功能
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 是否處於展開顯示狀態
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * 是否顯示指向目標之小箭頭
   */
  @property({ type: Boolean, reflect: true })
  arrow = false;

  /**
   * 與目標元素之主軸距離（像素，預設 8px）
   */
  @property({ type: Number })
  distance = 8;

  /**
   * 與目標元素之副軸偏移（像素，預設 0px）
   */
  @property({ type: Number })
  skidding = 0;

  /**
   * 滑鼠移入展開之延遲時間（毫秒，預設 150ms）
   */
  @property({ type: Number })
  delay = 150;

  /**
   * 滑鼠移出收合之延遲時間（毫秒，預設 100ms）
   */
  @property({ type: Number, attribute: 'hide-delay' })
  hideDelay = 100;

  /**
   * 觸發展開之行為，支援空格組合（例如 'hover focus'、'click'、'manual'）
   */
  @property({ type: String })
  trigger = 'hover focus';

  /**
   * 目標元素之 DOM ID（當不將目標包在 slot 內時使用）
   */
  @property({ type: String, attribute: 'for' })
  for = '';

  /**
   * 是否使觸發包裝層以區塊元素（display: block）呈現
   */
  @property({ type: Boolean, reflect: true })
  block = false;

  @state()
  private isVisible = false;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleDocumentKeyDown);

    // 重新插入 DOM（框架重排節點、拖曳排序等）時，disconnectedCallback 已解除目標監聽，
    // 而 firstUpdated 只會執行一次，因此須在此重新綁定並還原開啟狀態
    if (this.hasUpdated) {
      this.setupTarget();
      if (this.open && !this.disabled) {
        this.internalShow();
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.clearTimeouts();
    this.stopAutoUpdate();
    this.detachTargetListeners();
    this.removeAriaDescribedBy();
    // 離開 document 時瀏覽器會自動關閉 popover，同步內部可視狀態
    this.isVisible = false;
  }

  override firstUpdated(): void {
    this.setupTarget();
    if (this.open && !this.disabled) {
      this.show();
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('disabled') && this.disabled && this.open) {
      this.hide();
    }

    if (changedProperties.has('for')) {
      this.setupTarget();
    }

    if (changedProperties.has('content') && this.descriptionElement?.isConnected) {
      this.descriptionElement.textContent = this.descriptionText;
    }

    if (changedProperties.has('open')) {
      if (this.open && !this.isVisible) {
        this.internalShow();
      } else if (!this.open && this.isVisible) {
        this.internalHide();
      }
    } else if (
      this.open &&
      (changedProperties.has('placement') ||
        changedProperties.has('distance') ||
        changedProperties.has('skidding') ||
        changedProperties.has('arrow'))
    ) {
      this.reposition();
    }
  }

  /**
   * 設定觸發目標節點（自訂 for 屬性指定或預設 slot 目標）
   */
  private setupTarget(): void {
    // 目標切換時，描述關聯須跟著從舊目標移到新目標
    const wasDescribed = this.describedTarget !== null;
    this.removeAriaDescribedBy();
    this.detachTargetListeners();

    if (this.for) {
      const root = this.getRootNode() as Document | ShadowRoot;
      this.targetElement = root.getElementById(this.for) as HTMLElement;
    } else {
      // 預設以 slot 內的第一個元素或 wrapper 本身作為目標
      const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
      const assigned = slot?.assignedElements({ flatten: true }) || [];
      this.targetElement = (assigned[0] as HTMLElement) || this.triggerWrapper;
    }

    this.attachTargetListeners();

    if (wasDescribed) {
      this.addAriaDescribedBy();
    }
  }

  private attachTargetListeners(): void {
    if (!this.targetElement) return;

    const triggers = this.trigger.split(/\s+/);

    if (triggers.includes('hover')) {
      this.targetElement.addEventListener('mouseenter', this.handleTargetMouseEnter);
      this.targetElement.addEventListener('mouseleave', this.handleTargetMouseLeave);
    }

    if (triggers.includes('focus')) {
      this.targetElement.addEventListener('focusin', this.handleTargetFocusIn);
      this.targetElement.addEventListener('focusout', this.handleTargetFocusOut);
    }

    if (triggers.includes('click')) {
      this.targetElement.addEventListener('click', this.handleTargetClick);
    }
  }

  private detachTargetListeners(): void {
    if (!this.targetElement) return;

    this.targetElement.removeEventListener('mouseenter', this.handleTargetMouseEnter);
    this.targetElement.removeEventListener('mouseleave', this.handleTargetMouseLeave);
    this.targetElement.removeEventListener('focusin', this.handleTargetFocusIn);
    this.targetElement.removeEventListener('focusout', this.handleTargetFocusOut);
    this.targetElement.removeEventListener('click', this.handleTargetClick);
  }

  private handleTargetMouseEnter = (): void => {
    if (this.disabled || !this.hasTrigger('hover')) return;
    this.clearTimeouts();
    if (this.delay > 0) {
      this.showTimeoutId = window.setTimeout(() => this.show(), this.delay);
    } else {
      this.show();
    }
  };

  private handleTargetMouseLeave = (): void => {
    if (this.disabled || !this.hasTrigger('hover')) return;
    this.clearTimeouts();
    if (this.hideDelay > 0) {
      this.hideTimeoutId = window.setTimeout(() => this.hide(), this.hideDelay);
    } else {
      this.hide();
    }
  };

  private handlePopupMouseEnter = (): void => {
    // 支援 WCAG 1.4.13：當滑鼠移到氣泡本體時維持可視，不自動關閉
    if (this.hasTrigger('hover')) {
      this.clearTimeouts();
    }
  };

  private handlePopupMouseLeave = (): void => {
    if (this.hasTrigger('hover')) {
      this.clearTimeouts();
      if (this.hideDelay > 0) {
        this.hideTimeoutId = window.setTimeout(() => this.hide(), this.hideDelay);
      } else {
        this.hide();
      }
    }
  };

  private handleTargetFocusIn = (): void => {
    if (this.disabled || !this.hasTrigger('focus')) return;
    this.clearTimeouts();
    this.show();
  };

  private handleTargetFocusOut = (): void => {
    if (this.disabled || !this.hasTrigger('focus')) return;
    this.clearTimeouts();
    this.hide();
  };

  private handleTargetClick = (): void => {
    if (this.disabled || !this.hasTrigger('click')) return;
    this.clearTimeouts();
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent): void => {
    // WCAG 1.4.13 規範：按下 Escape 鍵時應能直接關閉氣泡
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.hide();
    }
  };

  private hasTrigger(type: TooltipTrigger): boolean {
    return this.trigger.split(/\s+/).includes(type);
  }

  private clearTimeouts(): void {
    if (this.showTimeoutId !== null) {
      window.clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  /**
   * 主動開啟 Tooltip
   */
  async show(): Promise<void> {
    if (this.open || this.disabled) return;
    this.open = true;
  }

  /**
   * 主動關閉 Tooltip
   */
  async hide(): Promise<void> {
    if (!this.open) return;
    this.open = false;
  }

  /**
   * 切換 Tooltip 展開/收合狀態
   */
  async toggle(): Promise<void> {
    if (this.open) {
      await this.hide();
    } else {
      await this.show();
    }
  }

  private async internalShow(): Promise<void> {
    if (!this.popupElement || this.disabled) return;

    const event = new CustomEvent('aui-show', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);

    if (event.defaultPrevented) {
      this.open = false;
      return;
    }

    // 支援原生 Popover API 進入 Top Layer
    if (typeof this.popupElement.showPopover === 'function') {
      try {
        this.popupElement.showPopover();
      } catch {
        // 忽略重複開啟或不支持的例外
      }
    }

    this.startAutoUpdate();
    this.addAriaDescribedBy();

    // 確保 DOM 渲染並定位後套用進場動畫 (0.95 -> 1.0)
    requestAnimationFrame(() => {
      this.isVisible = true;
      this.dispatchEvent(new CustomEvent('aui-after-show', { bubbles: true, composed: true }));
    });
  }

  private async internalHide(): Promise<void> {
    if (!this.popupElement) return;

    const event = new CustomEvent('aui-hide', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);

    if (event.defaultPrevented) {
      this.open = true;
      return;
    }

    this.isVisible = false;
    this.removeAriaDescribedBy();

    // 等待 150ms 進出場動畫結束後關閉 popover 並停止監聽
    window.setTimeout(() => {
      if (!this.open) {
        if (typeof this.popupElement.hidePopover === 'function') {
          try {
            this.popupElement.hidePopover();
          } catch {
            // 忽略例外
          }
        }
        this.stopAutoUpdate();
        this.dispatchEvent(new CustomEvent('aui-after-hide', { bubbles: true, composed: true }));
      }
    }, 160);
  }

  /**
   * 重新計算並校正浮層位置
   */
  async reposition(): Promise<void> {
    if (!this.popupElement) return;
    const target = this.targetElement || this.triggerWrapper;
    if (!target) return;

    const middleware = [
      offset({ mainAxis: this.distance, crossAxis: this.skidding }),
      flip({ fallbackAxisSideDirection: 'start', padding: 8 }),
      shift({ padding: 8 }),
    ];

    if (this.arrow && this.arrowElement) {
      middleware.push(floatingArrow({ element: this.arrowElement, padding: 4 }));
    }

    const { x, y, placement, middlewareData } = await computePosition(target, this.popupElement, {
      placement: this.placement as Placement,
      middleware,
      strategy: 'fixed',
    });

    this.popupElement.style.left = `${Math.round(x)}px`;
    this.popupElement.style.top = `${Math.round(y)}px`;
    this.popupElement.setAttribute('data-placement', placement);

    // 根據方位設定 transform-origin，使微縮放動畫朝向目標元素自然展開
    const transformOrigins: Record<string, string> = {
      top: 'bottom center',
      'top-start': 'bottom left',
      'top-end': 'bottom right',
      bottom: 'top center',
      'bottom-start': 'top left',
      'bottom-end': 'top right',
      left: 'right center',
      'left-start': 'right top',
      'left-end': 'right bottom',
      right: 'left center',
      'right-start': 'left top',
      'right-end': 'left bottom',
    };
    this.popupElement.style.setProperty(
      '--tooltip-transform-origin',
      transformOrigins[placement] || 'center',
    );

    // 校正箭頭位置
    if (this.arrow && this.arrowElement && middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;
      this.arrowElement.style.left = arrowX != null ? `${arrowX}px` : '';
      this.arrowElement.style.top = arrowY != null ? `${arrowY}px` : '';
    }
  }

  private startAutoUpdate(): void {
    this.stopAutoUpdate();
    const target = this.targetElement || this.triggerWrapper;
    if (target && this.popupElement) {
      this.cleanupAutoUpdate = autoUpdate(target, this.popupElement, () => {
        this.reposition();
      });
    }
  }

  private stopAutoUpdate(): void {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }
  }

  /**
   * 提示內容的純文字（rich content slot 優先，否則使用 content 屬性）
   */
  private get descriptionText(): string {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="content"]');
    const slotted = (slot?.assignedNodes({ flatten: true }) ?? [])
      .map((node) => node.textContent ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    return slotted || this.content;
  }

  private addAriaDescribedBy(): void {
    const target = this.targetElement;
    if (!target) return;
    this.removeAriaDescribedBy();

    // 目標位於本元件 shadow root 內（slot 無元素時退回 wrapper）可直接指向 popup；
    // 否則（slotted 元素或 for 指定的外部元素）必須指向同一棵 tree 內的描述節點
    const id = target.getRootNode() === this.shadowRoot ? this.tooltipId : this.mountDescription();

    const ids = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    if (!ids.includes(id)) ids.push(id);
    target.setAttribute('aria-describedby', ids.join(' '));

    this.describedTarget = target;
    this.describedById = id;
  }

  private removeAriaDescribedBy(): void {
    const target = this.describedTarget;
    if (target) {
      // 只移除本元件寫入的 id，保留使用者原有或期間新增的描述
      const ids = (target.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter((id) => id && id !== this.describedById);
      if (ids.length > 0) {
        target.setAttribute('aria-describedby', ids.join(' '));
      } else {
        target.removeAttribute('aria-describedby');
      }
    }
    this.describedTarget = null;
    this.describedById = '';
    this.descriptionElement?.remove();
  }

  /**
   * 將隱藏描述節點掛到 host 的 light DOM（與 slotted / for 目標位於同一棵 tree），回傳其 id
   */
  private mountDescription(): string {
    if (!this.descriptionElement) {
      const description = document.createElement('span');
      description.id = `${this.tooltipId}-description`;
      // 指派到專用的隱藏 slot，避免被預設 slot 當成觸發目標，也不會被渲染出來
      description.slot = DESCRIPTION_SLOT;
      description.hidden = true;
      this.descriptionElement = description;
    }
    this.descriptionElement.textContent = this.descriptionText;
    if (this.descriptionElement.parentNode !== this) {
      this.appendChild(this.descriptionElement);
    }
    return this.descriptionElement.id;
  }

  private handleSlotChange = (): void => {
    if (!this.for) {
      this.setupTarget();
    }
  };

  override render() {
    return html`
      <div part="trigger" class="tooltip__trigger" @slotchange=${this.handleSlotChange}>
        <slot></slot>
      </div>

      <div
        id=${this.tooltipId}
        part="popup"
        class=${classMap({
          tooltip__popup: true,
          'tooltip__popup--visible': this.isVisible,
        })}
        role="tooltip"
        popover="manual"
        aria-hidden=${this.isVisible ? 'false' : 'true'}
        @mouseenter=${this.handlePopupMouseEnter}
        @mouseleave=${this.handlePopupMouseLeave}
      >
        <div part="content" class="tooltip__content">
          <slot name="content">${this.content}</slot>
        </div>

        ${this.arrow ? html`<div part="arrow" class="tooltip__arrow"></div>` : nothing}
      </div>

      <div hidden><slot name=${DESCRIPTION_SLOT}></slot></div>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-tooltip')) {
  customElements.define('aui-tooltip', AuiTooltip);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-tooltip': AuiTooltip;
  }
}
