import { LitElement, CSSResultGroup, PropertyValues } from 'lit';
import { PopoverCloseReason, PopoverPlacement } from './popover.types.js';
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
export declare class AuiPopover extends LitElement {
    static styles: CSSResultGroup;
    /** 是否開啟 */
    open: boolean;
    /** 面板相對於觸發元素的方位；空間不足時自動翻轉與平移 */
    placement: PopoverPlacement;
    /** 與觸發元素之主軸距離（像素） */
    distance: number;
    /** 與觸發元素之副軸偏移（像素） */
    skidding: number;
    /** 面板的無障礙名稱；未設定時以觸發元素作為名稱 */
    label: string;
    private isVisible;
    protected panel: HTMLElement;
    /** 面板的角色，也是觸發元素的 aria-haspopup（子類別可覆寫，例如選單為 menu） */
    protected readonly popupRole: 'dialog' | 'menu';
    /** 目前的觸發元素（trigger slot 中的第一個元素） */
    protected triggerElement: HTMLElement | null;
    /** 已開始開啟、尚未開始關閉（進場動畫的 rAF 前即為 true，與視覺狀態 isVisible 分開追蹤） */
    private isShowing;
    /** 退場動畫中（aui-hide 已分派、aui-after-hide 尚未分派） */
    private isHiding;
    /** 開/關轉場序號：延遲執行的回呼若序號已過期即放棄，避免快速開關時互相覆蓋 */
    private transitionId;
    /** 下一次關閉的原因（hide() 等設定 open 前記下） */
    private pendingReason;
    /** 進行中的關閉原因（aui-after-hide 使用） */
    private hideReason;
    /** 點擊外部的當下焦點是否在本元件內（決定關閉後是否還原焦點） */
    private focusWasInside;
    private cleanupAutoUpdate;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    /**
     * 開關的決定在渲染前處理：可取消的 aui-show / aui-hide 在此分派，被取消時改回的 open 與原本的變化
     * 在同一次渲染套用（在 updated() 才改狀態會再排一次更新，open attribute 也會先反映再改回）。
     * 實際開啟須等面板已渲染，在 updated() 處理
     */
    willUpdate(changed: PropertyValues<this>): void;
    updated(changed: PropertyValues<this>): void;
    /** 開啟面板 */
    show(): void;
    /** 關閉面板（`aui-hide` 的 `detail.reason` 為 `api`） */
    hide(): void;
    /** 切換開啟狀態 */
    toggle(): void;
    /** 以指定原因關閉（子類別可用，例如選單選取項目後關閉） */
    protected close(reason: PopoverCloseReason): void;
    /**
     * 開啟後移入焦點：預設為面板內第一個可聚焦的元素（有 autofocus 者優先），沒有時為面板本身。
     * 巢狀浮層（另一個 Popover 的面板、Modal 等）的內容不列入。子類別可覆寫（例如選單聚焦第一個項目）
     */
    protected focusPanel(): Promise<void>;
    /** 元素是否位於面板內容中另一個浮層的內容裡（巢狀 Popover 的觸發元素仍屬於本面板） */
    private inNestedOverlay;
    /** 面板內容（預設 slot）中的所有元素，依文件順序 */
    protected panelElements(): Element[];
    /** 節點是否位於本元件內（觸發元素、面板內容，含其中各層 Shadow DOM） */
    protected containsDeep(node: Node | null): boolean;
    private syncTrigger;
    private syncTriggerState;
    /**
     * 未設定 label 時以觸發元素命名面板。aria-labelledby 的 IDREF 無法從 Shadow DOM 指向 light DOM，
     * 以元素參照（ariaLabelledByElements）設定：參照可指向外層 tree 的元素
     */
    private syncPanelName;
    /** 開啟（aui-show 已在 willUpdate() 分派且未被取消） */
    private startShow;
    private startHide;
    /**
     * 結束關閉：退場動畫結束，或退場中被重新開啟而中斷。
     * 中斷時也先把面板移出 Top Layer：重新開啟若被 aui-show 取消，面板不會以透明狀態留在最上層
     */
    private finishHide;
    /**
     * aui-hide / aui-after-hide 的事件設定。事件名稱在呼叫端以字串常值寫出：
     * custom-elements-manifest 會把 new CustomEvent(變數) 的變數名稱誤當成事件名稱
     */
    private hideEventInit;
    /**
     * 關閉時把焦點還給觸發元素（只在焦點位於本元件內時，不搶走使用者已移到別處的焦點）。
     * 點擊外部時焦點會移到被點擊的元素：只在點擊前焦點位於本元件內、且點擊的預設行為完成後焦點落空（回到 body）才還原
     */
    private restoreFocus;
    private handleTriggerSlotChange;
    private handleTriggerClick;
    private handleKeyDown;
    private handleFocusOut;
    private handleDocumentPointerDown;
    /** 重新計算面板位置 */
    reposition(): Promise<void>;
    private startAutoUpdate;
    private stopAutoUpdate;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-popover': AuiPopover;
    }
}
//# sourceMappingURL=popover.d.ts.map