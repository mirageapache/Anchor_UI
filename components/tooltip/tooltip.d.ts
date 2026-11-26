import { LitElement, PropertyValues } from 'lit';
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
 * @fires {CustomEvent<null>} aui-show - 氣泡開始展開前觸發（可被 preventDefault 取消）
 * @fires {CustomEvent<null>} aui-after-show - 氣泡完全展開且進場動畫結束後觸發
 * @fires {CustomEvent<null>} aui-hide - 氣泡開始收合前觸發（可被 preventDefault 取消）
 * @fires {CustomEvent<null>} aui-after-hide - 氣泡完全隱藏且退場動畫結束後觸發
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
    /** 滑鼠在觸發目標或氣泡本體上 */
    private hovering;
    /** 觸發目標具有鍵盤焦點（:focus-visible） */
    private focused;
    /**
     * 這次開啟來自 hover / focus（相對於 show()、open 屬性與 click）。
     * 這類開啟取決於當下的指標與焦點，元素被移出頁面後不再成立，重新插入時不還原
     */
    private openedByInteraction;
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
     * 開啟期間（展開到開始收合）提示應作為目標的描述。與 describedTarget 分開記錄：
     * 提示文字與目標名稱相同時不寫入描述，但內容或目標改變後仍須重新判斷。
     */
    private describing;
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
     * 是否使觸發包裝層以區塊元素（display: block）呈現；包裝層的寬高跟隨 host，
     * 例如在 host 上設定高度後，觸發元素以 `height: 100%` 即可撐滿
     */
    block: boolean;
    private isVisible;
    /** `for` 指定的目標尚未出現時，等待它加入的觀察器 */
    private targetObserver;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** 初次渲染後綁定觸發目標；`open` 的初始值由同一輪的 updated() 處理 */
    firstUpdated(): void;
    /**
     * 收合在渲染前處理：退場樣式（移除 --visible）與 open 的變化在同一次渲染套用。
     * 若在 updated() 才改 isVisible，Lit 會再排一次更新（開發模式的 change-in-update 警告）。
     * 開啟須等 popover 已渲染，仍在 updated() 處理
     */
    willUpdate(changedProperties: PropertyValues<this>): void;
    updated(changedProperties: PropertyValues<this>): void;
    /**
     * 設定觸發目標節點（自訂 for 屬性指定或預設 slot 目標）
     */
    private setupTarget;
    private attachTargetListeners;
    private detachTargetListeners;
    private handleTargetMouseEnter;
    /** hover 與 focus 任一成立就維持顯示（APG）：滑鼠離開時若目標仍有鍵盤焦點，不收合 */
    private handleTargetMouseLeave;
    private handlePopupMouseEnter;
    private handlePopupMouseLeave;
    /**
     * 依 hide-delay 延遲收合（滑鼠離開觸發目標或氣泡本體時共用）
     */
    private scheduleHide;
    /**
     * 只在鍵盤焦點（:focus-visible）時開啟：以滑鼠操作後由程式移回的焦點
     * （選單、對話框關閉時把焦點還給觸發按鈕）或滑鼠點擊帶來的焦點不算，否則提示會無預警彈出並停留到失焦。
     * 判斷對象是實際取得焦點的元素（目標為自訂元素時，是其 Shadow DOM 內的元素）
     */
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
    /** 由 hover / focus 開啟（見 openedByInteraction） */
    private showByInteraction;
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
    /** 完成關閉：popover 離開 top layer、停止定位並分派 aui-after-hide */
    private finishHide;
    /**
     * 重新計算並校正浮層位置
     */
    reposition(): Promise<void>;
    private startAutoUpdate;
    private stopAutoUpdate;
    /**
     * 提示內容的純文字（rich content slot 優先，否則使用 content 屬性）
     */
    private get hasContent();
    /** 開啟中更換 content slot 的內容：作為描述的文字須跟著更新（content 屬性的變更由 updated() 處理） */
    private handleContentSlotChange;
    private get descriptionText();
    /** 開啟時：提示開始作為目標的描述 */
    private addAriaDescribedBy;
    /** 收合或移出頁面時：解除描述 */
    private clearAriaDescribedBy;
    /**
     * 提示文字是否與目標的無障礙名稱相同（例如圖示按鈕的 aria-label 與提示同為「刪除」）。
     * 相同時不作為描述，否則螢幕閱讀器會把同一段文字念兩次。
     * 只比對 aria-label 與文字內容；以 aria-labelledby 命名的目標無法可靠取得名稱，一律視為不同。
     */
    private duplicatesTargetName;
    /** 依目前的目標與提示內容，寫入或移除 aria-describedby */
    private syncAriaDescribedBy;
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