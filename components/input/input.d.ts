import { LitElement, PropertyValues } from 'lit';
import { InputType } from './input.types.js';
/**
 * Anchor UI — Input 元件 (`<aui-input>`)
 *
 * 等寬字體的單行／多行文字輸入框，具備 Focus 雙層光環與錯誤狀態。
 * 為 form-associated custom element：可參與原生 `<form>` 提交、`required` 等驗證、
 * `form.reset()` 與 `<fieldset disabled>`；不支援 ElementInternals 時退回以 light DOM 隱藏 input 提交。
 * 單行輸入時按 Enter 會送出所屬表單（與原生 `<input>` 相同：有送出按鈕時等同點擊它，
 * 沒有時僅在表單只有一個單行欄位時送出）；在 `keydown` 監聽器中 `preventDefault()` 可取消。
 *
 * 標題與描述（`label` / `description`）在元件自身的 Shadow DOM 內與輸入框建立關聯，
 * 因 IDREF 無法跨 Shadow DOM 邊界解析；搭配 `<aui-field>` 時由 field 自動傳入。
 *
 * @element aui-input
 *
 * @csspart control - 內部原生 `<input>` 或 `<textarea>` 元素
 *
 * @fires input - 每次輸入時分派（原生事件穿出 Shadow DOM），觸發時 `value` 已更新
 * @fires change - 內容提交時（失焦或 Enter）於 host 重新分派，觸發時 `value` 已更新
 */
export declare class AuiInput extends LitElement {
    static styles: import('lit').CSSResult;
    static shadowRootOptions: ShadowRootInit;
    /** 宣告為 form-associated custom element，透過 ElementInternals 參與表單 */
    static formAssociated: boolean;
    /** 表單參與（ElementInternals 或隱藏 input 退回方案） */
    private readonly formControl;
    /** 不支援 ElementInternals 的環境（happy-dom、舊版瀏覽器）為 null */
    private get internals();
    private currentValue;
    /**
     * 對應原生的 dirty value flag：值被使用者或程式改動後，
     * `value` 屬性（即 defaultValue）的變更不再覆寫目前值；`form.reset()` 時清除。
     */
    private dirty;
    private customValidityMessage;
    private control?;
    /** 由所屬 `<fieldset disabled>` 或自身 disabled 屬性決定的表單停用狀態 */
    private formDisabled;
    /**
     * 目前的值。以程式設定後，`value` 屬性的變更不再覆寫（與原生 input 相同）
     */
    get value(): string;
    set value(next: string);
    /**
     * 預設值，對應 HTML 的 `value` 屬性；`form.reset()` 時還原為此值
     */
    defaultValue: string;
    /**
     * 表單欄位名稱（提交時的鍵）
     */
    name: string;
    /**
     * 單行輸入框的原生類型；不支援的類型（如 `file`、`checkbox`、`number`）以 `text` 呈現
     */
    type: InputType;
    /**
     * 是否為多行輸入（改以 `<textarea>` 呈現，可垂直調整高度）
     */
    multiline: boolean;
    /**
     * 多行輸入的預設可見行數
     */
    rows: number;
    /**
     * 佔位提示文字
     */
    placeholder: string;
    /**
     * 無障礙名稱（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的標題自動帶入
     */
    label: string;
    /**
     * 無障礙描述（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的描述自動帶入
     */
    description: string;
    /**
     * 是否處於停用狀態（不可聚焦、不隨表單提交）
     */
    disabled: boolean;
    /**
     * 是否唯讀（可聚焦與選取，不可編輯，不參與驗證）
     */
    readOnly: boolean;
    /**
     * 是否為必填（空值時阻擋表單提交）
     */
    required: boolean;
    /**
     * 是否以錯誤狀態呈現（紅色邊框並輸出 aria-invalid），用於伺服器端或自訂驗證結果
     */
    invalid: boolean;
    /**
     * 最少字元數
     */
    minLength?: number;
    /**
     * 最多字元數
     */
    maxLength?: number;
    /**
     * 單行輸入的格式驗證正規表示式（多行輸入不支援）
     */
    pattern?: string;
    /**
     * 瀏覽器自動完成提示（如 'email'、'off'）
     */
    autocomplete?: string;
    /**
     * 所屬的表單（包含以 `form` 屬性指定的外部表單）
     */
    get form(): HTMLFormElement | null;
    /**
     * 驗證狀態（首次渲染前，於不支援 ElementInternals 的環境為 undefined）
     */
    get validity(): ValidityState | undefined;
    /**
     * 驗證失敗時的提示訊息
     */
    get validationMessage(): string;
    /**
     * 是否參與表單驗證（停用、唯讀時為 false）
     */
    get willValidate(): boolean;
    /**
     * 檢查是否通過驗證（失敗時分派 invalid 事件）
     */
    checkValidity(): boolean;
    /**
     * 檢查是否通過驗證，失敗時於輸入框旁顯示瀏覽器原生提示
     */
    reportValidity(): boolean;
    /**
     * 設定自訂驗證錯誤訊息；傳入空字串即清除
     */
    setCustomValidity(message: string): void;
    /**
     * 清空內容，並如同使用者操作般分派 `input` 與 `change`（讓框架的雙向綁定同步）。
     * 停用、唯讀或已為空值時不動作。
     */
    clear(): void;
    /** @internal 表單 reset 時還原為預設值 */
    formResetCallback(): void;
    /** @internal 自身 disabled 屬性或所屬 `<fieldset disabled>` 改變時由瀏覽器呼叫 */
    formDisabledCallback(disabled: boolean): void;
    /** @internal 瀏覽器還原表單狀態（返回上一頁、自動填入）時呼叫 */
    formStateRestoreCallback(restored: string | File | FormData | null): void;
    private get isDisabled();
    /** 更新目前值並同步表單值（同步執行，事件監聽者讀取 FormData 時即為最新值） */
    private applyValue;
    /** 以內部原生控制項為唯一驗證來源，鏡像至 ElementInternals */
    private syncValidity;
    private handleInput;
    /** 原生 change 不具 composed、不會穿出 Shadow DOM，須於 host 重新分派 */
    private handleChange;
    /**
     * 單行輸入按 Enter：送出所屬表單（隱式送出）。內部的 <input> 位於 Shadow DOM、沒有表單擁有者，
     * 瀏覽器不會代為處理。輸入法選字中的 Enter 與帶修飾鍵的 Enter 不算
     */
    private handleKeydown;
    willUpdate(changed: PropertyValues<this>): void;
    updated(): void;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-input': AuiInput;
    }
}
//# sourceMappingURL=input.d.ts.map