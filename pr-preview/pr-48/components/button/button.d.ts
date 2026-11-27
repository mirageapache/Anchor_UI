import { LitElement } from 'lit';
import { POPUP_TRIGGER, PopupTrigger, PopupTriggerState } from '../../internal/popup-trigger.js';
import { ButtonSize, ButtonType, ButtonVariant } from './button.types.js';
/**
 * Anchor UI — Button 元件 (`<aui-button>`)
 *
 * 系統核心互動元件，支援 5 種語意層級變體、3 種尺寸規格、鍵盤可聚焦性、
 * 點擊微縮放動態、載入中 Spinner 以及與宿主表單（form）的原生提交互動。
 * `type="submit"` / `"reset"` 的表單動作與原生按鈕相同，是點擊的預設行為：在 `click` 監聽器中
 * `preventDefault()` 可取消（因此在事件分派完畢後才執行）；所屬的 `<fieldset disabled>` 也會停用按鈕。
 * host 上的 `aria-describedby`（例如被 `<aui-tooltip>` 包住時的提示描述）會轉交給內部的 `<button>`；
 * 作為 `<aui-popover>` 的觸發元素時，展開狀態（`aria-expanded` 等）也會寫在內部的 `<button>` 上。
 *
 * @element aui-button
 *
 * @slot - 按鈕主體文字內容
 * @slot prefix - 按鈕前綴圖示或標籤
 * @slot suffix - 按鈕後綴圖示
 *
 * @csspart button - 內部原生 `<button>` 元素容器
 * @csspart spinner - 載入中動畫指示器
 * @csspart prefix - 前綴內容包裝容器
 * @csspart label - 主內容包裝容器
 * @csspart suffix - 後綴內容包裝容器
 */
export declare class AuiButton extends LitElement implements PopupTrigger {
    static styles: import('lit').CSSResult[];
    static shadowRootOptions: ShadowRootInit;
    /**
     * 宣告為 form-associated custom element：透過 ElementInternals 取得表單擁有者，
     * 支援 `form="id"` 屬性指向外部表單（closest('form') 無法做到）
     */
    static formAssociated: boolean;
    /** 不支援 ElementInternals 表單參與的環境（happy-dom、jsdom、舊版瀏覽器）為 null，改以 DOM 查找表單 */
    private readonly internals;
    /**
     * 語意層級變體
     */
    variant: ButtonVariant;
    /**
     * 尺寸規格
     */
    size: ButtonSize;
    /**
     * 按鈕原生行為類型
     */
    type: ButtonType;
    /**
     * 是否處於停用狀態
     */
    disabled: boolean;
    /**
     * 是否處於載入中狀態（阻止點擊並顯示 Spinner）
     */
    loading: boolean;
    /**
     * 是否撐滿父層容器寬度
     */
    fullWidth: boolean;
    /**
     * host 上的 aria-describedby（例如 `<aui-tooltip>` 開啟時寫入的提示描述）。
     * 實際取得焦點的是 Shadow DOM 內的 `<button>`，而 IDREF 無法跨越 Shadow DOM，
     * 因此在 host 所在的 tree 中解析為元素，再以 ariaDescribedByElements 交給內部按鈕
     */
    private hostDescribedBy;
    /** 由所屬 `<fieldset disabled>` 或自身 disabled 屬性決定的表單停用狀態 */
    private formDisabled;
    /** 作為彈出式元件（如 `<aui-popover>`）的觸發元素時的展開狀態，寫在內部的 `<button>` 上 */
    private popupTrigger;
    /** @internal 由彈出式元件呼叫（見 src/internal/popup-trigger.ts） */
    [POPUP_TRIGGER](state: PopupTriggerState | null): void;
    constructor();
    /**
     * 所屬的表單（包含以 `form` 屬性指定的外部表單）
     */
    get form(): HTMLFormElement | null;
    /** @internal 自身 disabled 屬性或所屬 `<fieldset disabled>` 改變時由瀏覽器呼叫 */
    formDisabledCallback(disabled: boolean): void;
    private get isDisabled();
    private handleHostClick;
    /** host 的 aria-describedby 所指向的元素；指向的元素須在設定屬性前已存在 */
    private get describedByElements();
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-button': AuiButton;
    }
}
//# sourceMappingURL=button.d.ts.map