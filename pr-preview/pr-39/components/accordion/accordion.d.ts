import { LitElement, PropertyValues } from 'lit';
import { AccordionVariant } from './accordion.types.js';
/**
 * Anchor UI — Accordion 元件 (`<aui-accordion>`)
 *
 * 以原生 `<details>` / `<summary>` 封裝的內容收折區塊，用於操作說明、限制規範或常見問題。
 * 展開時外框平滑高亮、標題箭頭旋轉；鍵盤操作（Enter / Space）沿用原生行為。
 *
 * 設定相同 `name` 的手風琴互斥：展開其中一個時，同一個根節點（document 或 shadow root）內
 * 其他同名的手風琴會自動收合；未設定 `name` 時各自獨立開闔。
 * 一開始就有多個同名項目展開、或把展開中的項目插入已有展開項目的群組時，保留文件順序中最前面的那一個。
 * 巢狀的手風琴（彼此為祖先／後代）不互相收合。
 * （原生 `<details name>` 的分組不跨 Shadow DOM，因此由元件自行處理。）
 *
 * 內容中的段落與清單（`<p>`、`<ul>`、`<ol>`）會套用預設的間距與縮排。
 *
 * `aui-toggle` 會冒泡並穿出 Shadow DOM，巢狀手風琴的事件也會傳到外層；
 * 只處理自身的事件時請比對 `event.target === event.currentTarget`。
 *
 * @element aui-accordion
 *
 * @slot - 收折的內容
 * @slot heading - 標題（未提供時使用 `heading` 屬性）
 *
 * @csspart base - 原生 `<details>` 外層容器
 * @csspart summary - 可點擊的標題列（原生 `<summary>`）
 * @csspart heading - 標題文字
 * @csspart icon - 展開指示箭頭
 * @csspart body - 內容容器
 *
 * @fires aui-toggle - 展開狀態改變後觸發（使用者操作或程式設定皆會觸發），`detail.open` 為新狀態；支援 bubbles 與 composed
 */
export declare class AuiAccordion extends LitElement {
    static styles: import('lit').CSSResult;
    /** 標題文字 */
    heading: string;
    /** 是否展開 */
    open: boolean;
    /** 互斥群組名稱：同一個根節點內同名的手風琴一次只展開一個 */
    name: string;
    /** 預設排版：`doc`（使用指南）或 `faq`（常見問題） */
    variant: AccordionVariant;
    private details?;
    /** 最近一次以 aui-toggle 通知的狀態，用來避免在狀態沒有實際改變時送出事件 */
    private notifiedOpen?;
    /** 展開 */
    show(): void;
    /** 收合 */
    hide(): void;
    /** 切換展開狀態 */
    toggle(): void;
    /**
     * 將焦點移到標題列。
     * 不使用 delegatesFocus：它會讓點擊內文（例如選取文字）時把焦點移到標題列，內容較長時頁面會捲回頂端。
     */
    focus(options?: FocusOptions): void;
    /** 同時更新 open 屬性與 <details>，避免尚未送達的原生 toggle 事件把狀態改回去 */
    private setOpen;
    connectedCallback(): void;
    /**
     * 原生 toggle：使用者點擊標題列或鍵盤操作時，把 <details> 的狀態同步回 open 屬性。
     * 由程式設定 open 時也會觸發（非同步），此時兩者已一致，不需處理。
     */
    private handleNativeToggle;
    protected updated(changed: PropertyValues<this>): void;
    /**
     * 同一個根節點內其他同名的手風琴。
     * 排除祖先與後代：巢狀的手風琴若互相收合，展開內層會把自己所在的外層關掉。
     */
    private groupMembers;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-accordion': AuiAccordion;
    }
}
//# sourceMappingURL=accordion.d.ts.map