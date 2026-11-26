import { LitElement, PropertyValues } from 'lit';
/**
 * Anchor UI — Field 元件 (`<aui-field>`)
 *
 * 表單欄位容器：上方標題列（左側標題、右側快捷複製／清除按鈕），下方為控制項與次要描述。
 * 控制項為直接子層的 `<aui-input>`、`<aui-output>` 或 `<aui-segmented>`：標題與描述會傳入控制項，
 * 由其在自身 Shadow DOM 內完成無障礙關聯（IDREF 無法跨 Shadow DOM 邊界）；
 * 畫面上的標題與描述因此對輔助科技隱藏，避免重複朗讀。點擊標題會聚焦控制項。
 *
 * 欄位只註冊自己渲染的 `<aui-icon-button>`；控制項請另行載入（`@anchor-ui/core/input`、`@anchor-ui/core/output`、`@anchor-ui/core/segmented`）。
 *
 * @element aui-field
 *
 * @slot - 欄位控制項，須為直接子層的 `<aui-input>`、`<aui-output>` 或 `<aui-segmented>`
 * @slot actions - 標題列右側的自訂操作鈕（排在內建複製／清除鈕之前）
 *
 * @csspart head - 標題列容器
 * @csspart label - 標題文字
 * @csspart actions - 操作鈕容器
 * @csspart copy-button - 內建複製鈕（`<aui-icon-button>`）
 * @csspart clear-button - 內建清除鈕（`<aui-icon-button>`）
 * @csspart description - 次要描述文字
 *
 * @fires {CustomEvent<CopyDetail>} aui-copy - 複製鈕成功複製控制項內容時觸發（來自內建 `<aui-icon-button>`）
 * @fires {CustomEvent<CopyErrorDetail>} aui-copy-error - 複製失敗或控制項為空時觸發（來自內建 `<aui-icon-button>`）
 */
export declare class AuiField extends LitElement {
    static styles: import('lit').CSSResult;
    /**
     * 欄位標題（同時作為控制項的無障礙名稱）
     */
    label: string;
    /**
     * 次要描述（同時作為控制項的無障礙描述）
     */
    description: string;
    /**
     * 是否顯示複製鈕（複製控制項目前的值）
     */
    copyable: boolean;
    /**
     * 是否顯示清除鈕（清空輸入框並分派 input / change）；
     * 輸入框停用、唯讀，或控制項不是 `<aui-input>` 時停用
     */
    clearable: boolean;
    /**
     * 複製鈕的名稱；會接上欄位的標題（如「複製 輸出」）
     */
    copyLabel: string;
    /**
     * 複製成功後短暫顯示的提示文字
     */
    copiedLabel: string;
    /**
     * 清除鈕的名稱與提示文字；名稱會接上欄位的標題（如「清除 關鍵字」）
     */
    clearLabel: string;
    /** 目前關聯的控制項 */
    private control;
    /** 清除鈕是否停用 */
    private clearDisabled;
    private hasSlottedActions;
    /** 觀察輸入框的 disabled / readonly 屬性，同步清除鈕狀態 */
    private readonly controlObserver;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private observeControl;
    private syncClearDisabled;
    /** 從預設 slot 的元素中找出控制項並建立關聯 */
    private linkControl;
    private handleDefaultSlotChange;
    private handleActionsSlotChange;
    willUpdate(): void;
    private handleLabelClick;
    /** 於點擊當下讀取控制項的值，避免以程式設定 value 後複製到舊內容 */
    private handleCopy;
    private handleClear;
    updated(changed: PropertyValues): void;
    /**
     * 把欄位的標題或描述傳入控制項。欄位沒有設定時不覆寫控制項自己的值（例如 `<aui-input label="…">`）；
     * 欄位的值被清空時，只撤回先前由欄位帶入、且未被改動的值
     */
    private pushText;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-field': AuiField;
    }
}
//# sourceMappingURL=field.d.ts.map