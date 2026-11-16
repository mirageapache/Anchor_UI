import { LitElement, PropertyValues } from 'lit';
import { ModalRole, ModalSize } from './modal.types.js';
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
export declare class AuiModal extends LitElement {
    static styles: import('lit').CSSResult;
    private dialog;
    private panel;
    /**
     * 是否開啟（可直接設定，等同呼叫 show() / hide()）
     */
    open: boolean;
    /**
     * 尺寸規格
     */
    size: ModalSize;
    /**
     * 標題，顯示於頁首並作為對話框的無障礙名稱
     */
    heading: string;
    /**
     * 無障礙名稱：未設定 `heading`（例如以 header slot 自訂標題）時使用
     */
    label: string;
    /**
     * 無障礙描述（僅供螢幕閱讀器，不顯示）：內容位於其他 Shadow DOM、無法以 IDREF 關聯時使用（例如 Alert 的訊息）
     */
    description: string;
    /**
     * 對話框角色；需要使用者立即回應的確認對話框使用 `alertdialog`
     */
    dialogRole: ModalRole;
    /**
     * 是否允許按 ESC 關閉（HTML 中以 `close-on-escape="false"` 停用）。
     * 依瀏覽器規範，攔下 ESC 需要使用者互動：連續按 ESC 而期間沒有任何點擊或輸入時，
     * 瀏覽器仍會強制關閉（防止頁面困住使用者），此時 `aui-hide` 不可取消、原因為 `escape`。
     */
    closeOnEscape: boolean;
    /**
     * 是否允許點擊遮罩關閉（HTML 中以 `close-on-backdrop="false"` 停用）
     */
    closeOnBackdrop: boolean;
    /**
     * 是否隱藏頁首的關閉鈕
     */
    noCloseButton: boolean;
    /** 退場動畫中（套用 modal--leaving）；進場的起始狀態由 CSS @starting-style 定義 */
    private isLeaving;
    private hasHeaderSlot;
    private hasFooterSlot;
    /** dialog 是否處於（或正在進入）開啟狀態；退場動畫期間為 false */
    private isShown;
    /** 轉場序號：延遲執行的回呼若序號已過期即放棄，避免快速開關時互相覆蓋 */
    private transitionId;
    /** 目前轉場的結束通知：轉場完成、被下一次轉場取代或中止時 resolve（供 show() / hide() 等待） */
    private transitionSettled;
    private settleTransition;
    /** 下一次關閉的原因（由觸發關閉的操作設定） */
    private pendingReason;
    /** 退場動畫中這次關閉的原因 */
    private hidingReason;
    /** 本次點擊是否從遮罩開始按下（避免從面板內拖曳到遮罩放開時誤關閉） */
    private pointerDownOnBackdrop;
    private releaseScroll;
    private restoreFocus;
    private popLayer;
    /**
     * 開啟對話框。開啟完成（`aui-after-show` 之後）、被取消（`aui-show` 被 preventDefault）
     * 或被之後的關閉取代時 resolve；結果請以 `open` 判斷
     */
    show(): Promise<void>;
    /**
     * 關閉對話框（關閉原因為 `api`）。關閉完成（`aui-after-hide` 之後）、被取消（`aui-hide` 被 preventDefault）
     * 或被之後的開啟取代時 resolve；結果請以 `open` 判斷
     */
    hide(): Promise<void>;
    /**
     * 等待 open 的變化處理完畢，再等待目前的轉場結束。
     * aui-show / aui-hide 被取消時會撤回 open 而再更新一次，因此等到沒有後續更新為止。
     * 不在頁面上的元素不會開啟（從未連接過的 Lit 元素 updateComplete 也不會 resolve），直接返回
     */
    private transitionEnd;
    /** 開始新的轉場：前一次轉場視為已被取代（其等待者隨即 resolve），回傳新的序號 */
    private beginTransition;
    /**
     * 開啟中（或退場動畫中）被移出頁面：瀏覽器只會把 dialog 移出 Top Layer，不觸發 close 且保留 open 屬性，
     * 重新插入後會成為蓋住整頁、卻不是 modal 的 dialog。因此自行關閉 dialog、釋放鎖定與 modal 層，
     * 並補發關閉事件（無法取消），讓依關閉結果運作的元件（如 Alert）得到結果
     */
    disconnectedCallback(): void;
    private requestClose;
    willUpdate(): void;
    updated(changed: PropertyValues<this>): void;
    private startShow;
    private startHide;
    /** 初始焦點：內容中帶 autofocus 的元素（不含巢狀 modal 內的），否則為面板本身 */
    private applyInitialFocus;
    /** 依開啟時的相反順序釋放：先移除 modal 層，再解除捲動鎖定與返還焦點 */
    private releaseResources;
    private dispatchAfterHide;
    /** ESC：由元件接手（才能播放退場動畫並分派可取消的 aui-hide） */
    private handleCancel;
    /**
     * 瀏覽器自行關閉 dialog：例如沒有使用者互動時，Chrome 的關閉要求防濫用機制會忽略 cancel 的
     * preventDefault() 並直接關閉。此時無法取消，只同步狀態並釋放資源。
     *
     * 注意 close 事件是在 dialog.close() 之後才以 task 非同步分派：元件自行關閉後若已立即重新開啟，
     * 收到的會是過期的事件，因此以 dialog 當下是否仍開啟判斷，而非呼叫 close() 時的旗標。
     */
    private handleNativeClose;
    private handlePointerDown;
    private handleClick;
    private handleCloseButton;
    private handleSlotChange;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-modal': AuiModal;
    }
}
//# sourceMappingURL=modal.d.ts.map