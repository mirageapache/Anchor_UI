import { LitElement, PropertyValues } from 'lit';
import { SegmentedOption } from './segmented.types.js';
/**
 * Anchor UI — Segmented Control 元件 (`<aui-segmented>`)
 *
 * 膠囊軌道單選切換器，選中項以品牌色實心高亮並平滑過渡。
 * 採 WAI-ARIA radiogroup 模式（roving tabindex）：Tab 只停留在選中項，
 * 左右（上下）方向鍵、Home、End 巡覽並自動選取，停用的選項會被略過；RTL 時左右方向對調。
 *
 * 為 form-associated custom element：可參與原生 `<form>` 提交（未選取時不提交）、`required` 驗證、
 * `form.reset()` 與 `<fieldset disabled>`；不支援 ElementInternals 時退回以 light DOM 隱藏 input 提交。
 * 使用者改變選取時於 host 分派 `input` 與 `change`，觸發時 `value` 已更新。
 *
 * @element aui-segmented
 *
 * @csspart base - 膠囊軌道（radiogroup）
 * @csspart option - 每個選項按鈕（radio）
 * @csspart option-checked - 選中的選項
 * @csspart option-disabled - 停用的選項
 *
 * @fires input - 使用者改變選取時分派，觸發時 `value` 已更新
 * @fires change - 使用者改變選取時於 `input` 之後分派，觸發時 `value` 已更新
 */
export declare class AuiSegmented extends LitElement {
    static styles: import('lit').CSSResult;
    /** 宣告為 form-associated custom element，透過 ElementInternals 參與表單 */
    static formAssociated: boolean;
    /** 表單參與（ElementInternals 或隱藏 input 退回方案） */
    private readonly formControl;
    private currentValue;
    /**
     * 對應原生的 dirty 狀態：值被使用者或程式改動後，
     * `value` 屬性（即 defaultValue）的變更不再覆寫目前值；`form.reset()` 時清除。
     */
    private dirty;
    private customValidityMessage;
    private optionButtons;
    /** 由所屬 `<fieldset disabled>` 或自身 disabled 屬性決定的表單停用狀態 */
    private formDisabled;
    private optionItems;
    /**
     * 選項清單；於 HTML 中可用 JSON 字串設定 `options` 屬性。
     * 非陣列（如框架首幀綁定的 null / undefined、格式錯誤的 JSON 屬性）視為空清單，非物件的項目會被略過，
     * 非字串的 `value`（如數字）會轉為字串。不需修正時保留原本的陣列
     */
    get options(): SegmentedOption[];
    set options(next: SegmentedOption[]);
    /**
     * 目前選取的值（未選取為空字串）。以程式設定後，`value` 屬性的變更不再覆寫
     */
    get value(): string;
    set value(next: string);
    /**
     * 預設選取的值，對應 HTML 的 `value` 屬性；`form.reset()` 時還原為此值
     */
    defaultValue: string;
    /**
     * 表單欄位名稱（提交時的鍵）
     */
    name: string;
    /**
     * 無障礙名稱（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的標題自動帶入
     */
    label: string;
    /**
     * 無障礙描述（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的描述自動帶入
     */
    description: string;
    /**
     * 是否停用整個控制器（不可聚焦、不隨表單提交）
     */
    disabled: boolean;
    /**
     * 是否為必填（未選取時阻擋表單提交）
     */
    required: boolean;
    /**
     * 所屬的表單（包含以 `form` 屬性指定的外部表單）
     */
    get form(): HTMLFormElement | null;
    /**
     * 驗證狀態（不支援 ElementInternals 的環境為 undefined）
     */
    get validity(): ValidityState | undefined;
    /**
     * 驗證失敗時的提示訊息
     */
    get validationMessage(): string;
    /**
     * 是否參與表單驗證（停用時為 false）
     */
    get willValidate(): boolean;
    /**
     * 檢查是否通過驗證（失敗時分派 invalid 事件）
     */
    checkValidity(): boolean;
    /**
     * 檢查是否通過驗證，失敗時於控制器旁顯示瀏覽器原生提示
     */
    reportValidity(): boolean;
    /**
     * 設定自訂驗證錯誤訊息；傳入空字串即清除
     */
    setCustomValidity(message: string): void;
    /**
     * 聚焦目前的 Tab 停留點（選中項，未選取時為第一個可用選項）
     */
    focus(options?: FocusOptions): void;
    /** @internal 表單 reset 時還原為預設值 */
    formResetCallback(): void;
    /** @internal 自身 disabled 屬性或所屬 `<fieldset disabled>` 改變時由瀏覽器呼叫 */
    formDisabledCallback(disabled: boolean): void;
    /** @internal 瀏覽器還原表單狀態（返回上一頁）時呼叫 */
    formStateRestoreCallback(restored: string | File | FormData | null): void;
    private get isDisabled();
    private get selectedIndex();
    /** roving tabindex 的停留點：選中且可用的選項，否則為第一個可用選項 */
    private get tabStopIndex();
    /** 目前的驗證問題（自訂錯誤優先）；通過驗證為 null */
    private get validityProblem();
    private applyValue;
    /** 只有值對應到現有選項時才提交（與未選取的 radio 群組相同） */
    private syncFormValue;
    private syncValidity;
    /** 由 index 往 direction 方向找下一個可用選項（循環）；找不到時回傳原 index */
    private step;
    /** 使用者選取：聚焦該選項，值改變時分派 input 與 change */
    private selectByUser;
    private handleClick;
    private handleKeyDown;
    willUpdate(changed: PropertyValues<this>): void;
    updated(): void;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-segmented': AuiSegmented;
    }
}
//# sourceMappingURL=segmented.d.ts.map