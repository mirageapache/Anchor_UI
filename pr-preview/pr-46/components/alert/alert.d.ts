import { LitElement, PropertyValues } from 'lit';
import { AlertIcon, AlertMode } from './alert.types.js';
/**
 * Anchor UI — Alert 元件 (`<aui-alert>`)
 *
 * SweetAlert2 風格的提示、確認與輸入對話框，以 `<aui-modal>` 為外框組成：
 * 焦點限制與返還、背景捲動鎖定、ESC 與遮罩關閉皆由 Modal 處理，可於 Modal 內再開啟。
 * 命令式呼叫請使用 `AlertService.alert()` / `confirm()` / `prompt()`。
 *
 * - **鍵盤**：Enter 確認、ESC 取消；焦點在按鈕上時 Enter 啟動該按鈕（輸入法組字中的 Enter 不算）。
 *   預設 slot 內的互動內容（連結、表單控制項…）保有自己的 Enter 行為；`destructive` 時 Enter 只在
 *   prompt 的輸入框內確認，其餘須按下確定鈕。
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
 * @fires {CustomEvent<null>} aui-show - 開始開啟前觸發（可被 preventDefault 取消；來自內部 `<aui-modal>`）
 * @fires {CustomEvent<null>} aui-after-show - 完全開啟後觸發（來自內部 `<aui-modal>`）
 * @fires {CustomEvent<ModalHideDetail>} aui-hide - 開始關閉前觸發（可被 preventDefault 取消；來自內部 `<aui-modal>`）
 * @fires {CustomEvent<ModalHideDetail>} aui-after-hide - 完全關閉後觸發（來自內部 `<aui-modal>`）
 * @fires {CustomEvent<AlertConfirmDetail>} aui-confirm - 以確定關閉後觸發，`detail.value` 為 prompt 的輸入值
 * @fires {CustomEvent<AlertCancelDetail>} aui-cancel - 以取消關閉後觸發，`detail.reason` 為取消原因
 */
export declare class AuiAlert extends LitElement {
    static styles: import('lit').CSSResult;
    private modal;
    private input?;
    private contentSlot?;
    /**
     * 是否開啟
     */
    open: boolean;
    /**
     * 對話框模式
     */
    mode: AlertMode;
    /**
     * 狀態圖示（未設定則不顯示）
     */
    icon?: AlertIcon;
    /**
     * 標題
     */
    heading: string;
    /**
     * 訊息內容（保留換行）
     */
    message: string;
    /**
     * 確定鈕文字
     */
    confirmText: string;
    /**
     * 取消鈕文字（confirm 與 prompt 模式）
     */
    cancelText: string;
    /**
     * 破壞性操作：確定鈕改為危險樣式，初始焦點落在取消鈕
     */
    destructive: boolean;
    /**
     * prompt 模式的輸入框預設值
     */
    inputValue: string;
    /**
     * prompt 模式的輸入框佔位提示
     */
    inputPlaceholder: string;
    /**
     * prompt 模式輸入框的無障礙名稱（預設為標題）
     */
    inputLabel: string;
    /**
     * 是否允許點擊遮罩關閉（視同取消；HTML 中以 `close-on-backdrop="false"` 停用）
     */
    closeOnBackdrop: boolean;
    /**
     * 自動關閉的等待時間（毫秒，例如 3000 為 3 秒）；0 為不自動關閉。開啟時開始計時，時間到視同取消
     */
    timer: number;
    /** 本次開啟的結果；由按鈕、Enter、自動關閉或 Modal 的關閉原因決定 */
    private decision;
    /** 內部 Modal 正在關閉（aui-hide 已分派、aui-after-hide 尚未）時的關閉原因；否則為 null */
    private closingReason;
    /** 自動關閉計時（可暫停：滑鼠停在對話框上時） */
    private readonly autoClose;
    constructor();
    disconnectedCallback(): void;
    /** 本次更新中與內部 Modal 的同步（等待 Modal 決定是否真的開啟 / 關閉）；updateComplete 會一併等待 */
    private syncing;
    /**
     * 開啟對話框。開啟完成（`aui-after-show` 之後）、被取消（`aui-show` 被 preventDefault）
     * 或被之後的關閉取代時 resolve；結果請以 `open` 判斷
     */
    show(): Promise<void>;
    /**
     * 以取消關閉對話框（原因為 `api`）。關閉完成（`aui-cancel` 之後）、被取消（`aui-hide` 被 preventDefault）
     * 或被之後的開啟取代時 resolve；結果請以 `open` 判斷
     */
    hide(): Promise<void>;
    /**
     * 等待 open 與內部 Modal 同步完成，再等待 Modal 目前的轉場結束
     * （Modal 的 show() / hide() 在狀態已相同時只等待轉場）
     */
    private transitionEnd;
    /**
     * updateComplete 也等待與內部 Modal 的同步：resolve 時已知 Modal 是否真的開啟 / 關閉
     * （aui-show / aui-hide 是否被取消），同步撤回 open 而有後續更新時回傳 false
     */
    protected getUpdateComplete(): Promise<boolean>;
    /**
     * 以確定關閉對話框（與點擊確定鈕相同）
     */
    confirm(): void;
    /**
     * 以取消關閉對話框（與點擊取消鈕相同）
     */
    cancel(): void;
    updated(changed: PropertyValues<this>): void;
    /** 把 open 同步到內部 Modal；Modal 取消開啟或關閉時同步回 Alert */
    private syncModal;
    /** 記下進行中的關閉原因（aui-hide 被取消時 Modal 保持開啟，下一次關閉會覆寫） */
    private handleModalHide;
    /** Modal 完全關閉後（不論原因）決定結果並分派 aui-confirm / aui-cancel */
    private handleModalAfterHide;
    /** 結束一次關閉：以按鈕 / Enter / 計時的結果為準，否則依 Modal 的關閉原因視為取消 */
    private reportResult;
    private closeByTimer;
    /** 事件是否發生在對話框面板內（而非遮罩） */
    private isInPanel;
    /** 滑鼠停在面板上時暫停自動關閉，移到遮罩上時繼續 */
    private handlePointerOver;
    /** 點擊面板內容：使用者正在處理對話框，不再自動關閉 */
    private handlePointerDown;
    /**
     * 任何鍵盤操作都代表使用者正在處理對話框，不再自動關閉。
     * Enter 確認：焦點在按鈕上、或正在以輸入法組字時，交由原生行為處理。
     *
     * - 來自預設 slot 的內容（連結、select、checkbox、textarea…）或已被處理（defaultPrevented）的 Enter
     *   不屬於對話框：不攔截、不確認。
     * - `destructive` 時只有 prompt 輸入框內的 Enter 會確認：焦點可能因點擊訊息而落在面板上，
     *   此時的 Enter 不可執行破壞性操作。
     * - 長按 Enter 的重複按鍵一律忽略（含按鈕的原生啟動）：以 Enter 開啟對話框時若按住不放，
     *   重複的 keydown 會在使用者看到內容前就確認或取消。
     * - Safari 以 Enter 選字時會先結束組字再分派 keydown（`isComposing` 為 false），
     *   只能從 `keyCode === 229`（輸入法處理中）辨識。
     */
    private handleKeyDown;
    private handleConfirmClick;
    private handleCancelClick;
    /** 無障礙名稱：標題（有圖示時前綴狀態，如「錯誤：刪除失敗」），否則為圖示狀態或模式名稱 */
    private get accessibleName();
    private renderIcon;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-alert': AuiAlert;
    }
}
//# sourceMappingURL=alert.d.ts.map