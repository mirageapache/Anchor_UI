import { LitElement } from 'lit';
import { TooltipPlacement } from './tooltip.types.js';
/**
 * Anchor UI — Tooltip 元件 (`<aui-tooltip>`)
 *
 * 全域浮動氣泡提示元件，提供 Shadcn/ui 風格冷黑外觀、微縮放動畫（0.95 -> 1.0）、
 * 支援原生 Popover API 進入 Top Layer（免受 overflow: hidden 裁切）與 @floating-ui/dom 邊界碰撞檢測。
 *
 * 下列事件皆 `bubbles` + `composed`，會與 `<aui-modal>` 的同名事件一起傳到外層的監聽器（例如放在 Modal 內時），
 * 外層請以 `event.target` 區分來源。
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
export declare class AuiTooltip extends LitElement {
    static styles: import('lit').CSSResult;
    private readonly tooltipId;
    private cleanupAutoUpdate;
    private showTimeoutId;
    private hideTimeoutId;
    private targetElement;
    /** popover 是否已開啟（進場動畫的 rAF 前即為 true，與視覺狀態 isVisible 分開追蹤） */
    private isShowing;
    /** 退場動畫中（aui-hide 已分派、aui-after-hide 尚未分派） */
    private isHiding;
    /**
     * 開/關轉場序號：每次開始開啟或關閉都會遞增，
     * 延遲執行的 rAF / setTimeout 回呼若序號已過期即放棄，避免快速開關時互相覆蓋狀態
     */
    private transitionId;
    /** 目前被寫入 aria-describedby 的目標與所寫入的 id（用於精準移除，不覆蓋使用者後續變更） */
    private describedTarget;
    private describedById;
    /**
     * 置於 host light DOM 的隱藏描述節點。
     * aria-describedby 為 IDREF，無法跨 Shadow DOM 邊界解析，
     * 因此必須在觸發目標所在的同一棵 tree 內提供描述文字。
     */
    private descriptionElement;
    private popupElement;
    private arrowElement?;
    private triggerWrapper;
    /**
     * 提示文字內容（簡易純文字）
     */
    content: string;
    /**
     * 浮動定位方位（共 12 種方位）
     */
    placement: TooltipPlacement;
    /**
     * 是否停用提示功能
     */
    disabled: boolean;
    /**
     * 是否處於展開顯示狀態
     */
    open: boolean;
    /**
     * 是否顯示指向目標之小箭頭
     */
    arrow: boolean;
    /**
     * 與目標元素之主軸距離（像素，預設 8px）
     */
    distance: number;
    /**
     * 與目標元素之副軸偏移（像素，預設 0px）
     */
    skidding: number;
    /**
     * 滑鼠移入展開之延遲時間（毫秒，預設 150ms）
     */
    delay: number;
    /**
     * 滑鼠移出收合之延遲時間（毫秒，預設 100ms）
     */
    hideDelay: number;
    /**
     * 觸發展開之行為，支援空格組合（例如 'hover focus'、'click'、'manual'）
     */
    trigger: string;
    /**
     * 目標元素之 DOM ID（當不將目標包在 slot 內時使用）
     */
    for: string;
    /**
     * 是否使觸發包裝層以區塊元素（display: block）呈現
     */
    block: boolean;
    private isVisible;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** 初次渲染後綁定觸發目標；`open` 的初始值由同一輪的 updated() 處理 */
    firstUpdated(): void;
    updated(changedProperties: Map<string, unknown>): void;
    /**
     * 設定觸發目標節點（自訂 for 屬性指定或預設 slot 目標）
     */
    private setupTarget;
    private attachTargetListeners;
    private detachTargetListeners;
    private handleTargetMouseEnter;
    private handleTargetMouseLeave;
    private handlePopupMouseEnter;
    private handlePopupMouseLeave;
    /**
     * 依 hide-delay 延遲收合（滑鼠離開觸發目標或氣泡本體時共用）
     */
    private scheduleHide;
    private handleTargetFocusIn;
    private handleTargetFocusOut;
    private handleTargetClick;
    /**
     * WCAG 1.4.13 規範：按下 Escape 鍵時應能直接關閉由 hover / focus 觸發的氣泡。
     * 此監聽只在氣泡開啟期間掛上；manual 模式由應用程式自行控制開關，不攔截 Escape；
     * 已被其他元件處理（defaultPrevented）的 Escape 也不再重複處理。
     */
    private handleDocumentKeyDown;
    private hasTrigger;
    private clearTimeouts;
    /**
     * 主動開啟 Tooltip
     */
    show(): Promise<void>;
    /**
     * 主動關閉 Tooltip
     */
    hide(): Promise<void>;
    /**
     * 切換 Tooltip 展開/收合狀態
     */
    toggle(): Promise<void>;
    private internalShow;
    private internalHide;
    /**
     * 重新計算並校正浮層位置
     */
    reposition(): Promise<void>;
    private startAutoUpdate;
    private stopAutoUpdate;
    /**
     * 提示內容的純文字（rich content slot 優先，否則使用 content 屬性）
     */
    private get descriptionText();
    private addAriaDescribedBy;
    private removeAriaDescribedBy;
    /**
     * 將隱藏描述節點掛到 host 的 light DOM（與 slotted / for 目標位於同一棵 tree），回傳其 id
     */
    private mountDescription;
    private handleSlotChange;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-tooltip': AuiTooltip;
    }
}
//# sourceMappingURL=tooltip.d.ts.map