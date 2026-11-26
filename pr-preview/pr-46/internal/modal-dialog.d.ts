import { LitElement, PropertyValues } from 'lit';
/**
 * 關閉原因（各元件的 `*CloseReason` 型別與此相同）
 * - `escape`：按下 ESC（或瀏覽器的返回手勢等關閉要求）
 * - `backdrop`：點擊遮罩
 * - `close-button`：點擊頁首的關閉鈕
 * - `api`：以程式關閉（`hide()` 或將 `open` 設為 false），或開啟中被移出頁面
 */
export type DialogCloseReason = 'escape' | 'backdrop' | 'close-button' | 'api';
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
 * 立即關閉（不可取消、不播放動畫）的方法名稱。以 `Symbol.for` 登記，頁面上有多份程式庫時
 * 外層對話框仍能關閉另一份程式庫的內層對話框
 */
declare const FORCE_CLOSE: unique symbol;
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
export declare abstract class ModalDialogElement extends LitElement {
    private dialog;
    private panel;
    /**
     * 是否開啟（可直接設定，等同呼叫 show() / hide()）
     */
    open: boolean;
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
    /**
     * 頁首關閉鈕的無障礙名稱
     */
    closeLabel: string;
    /** 退場動畫中（套用 --leaving 樣式）；進場的起始狀態由 CSS @starting-style 定義 */
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
     * 開啟。開啟完成（`aui-after-show` 之後）、被取消（`aui-show` 被 preventDefault）
     * 或被之後的關閉取代時 resolve；結果請以 `open` 判斷
     */
    show(): Promise<void>;
    /**
     * 關閉（關閉原因為 `api`）。關閉完成（`aui-after-hide` 之後）、被取消（`aui-hide` 被 preventDefault）
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
    /**
     * 立即關閉：不播放動畫、不返還焦點，補發不可取消的關閉事件。
     * 用於被移出頁面，以及外層對話框關閉時（內層的 dialog 會隨外層一起不再渲染，見 closeNestedDialogs）
     */
    private [FORCE_CLOSE];
    /**
     * 關閉位於本對話框子樹內、仍開啟的對話框（含其他元件 Shadow DOM 內的，如 Alert 內部的 Modal）。
     * 外層的 dialog 關閉後為 `display: none`，內層的 dialog 隨之不再渲染，卻仍是 Top Layer 中的 modal：
     * 畫面上什麼都沒有，頁面卻保持 inert 且無法捲動。因此外層關閉時一併結束內層（由上而下）
     */
    private closeNestedDialogs;
    private requestClose;
    willUpdate(changed: PropertyValues<this>): void;
    /** 開啟須等 dialog 已渲染（首次渲染即開啟時），因此在 updated() 處理 */
    updated(changed: PropertyValues<this>): void;
    private startShow;
    private startHide;
    /** 初始焦點：內容中帶 autofocus 的元素（不含巢狀對話框內的），否則為面板本身 */
    private applyInitialFocus;
    /** 依開啟時的相反順序釋放：先移除 modal 層，再解除捲動鎖定與返還焦點 */
    private releaseResources;
    /** 分派 aui-hide，回傳是否繼續關閉（未被取消） */
    private dispatchHide;
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
    /**
     * 共用的 `<dialog>` 結構；子類別的 `render()` 回傳其結果。
     * part 名稱（dialog、panel、header、title、close-button、body、footer）對所有子類別相同
     */
    protected renderDialog({ prefix, panelClass, role }: DialogRenderOptions): import('lit').TemplateResult<1>;
    /** 頁首關閉鈕（`no-close-button` 時不渲染） */
    private renderCloseButton;
    /**
     * `description` 的文字（id 為 `description`，由 dialog 的 aria-describedby 參照）。
     * `hidden`：只作為描述的來源，不出現在瀏覽模式的閱讀順序中（Alert 的訊息已顯示在畫面上，否則會被讀兩次）；
     * 被 aria-describedby 參照的隱藏元素仍會計入描述
     */
    private renderDescription;
}
export {};
//# sourceMappingURL=modal-dialog.d.ts.map