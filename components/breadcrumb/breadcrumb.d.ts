import { LitElement, nothing } from 'lit';
import { BreadcrumbItem } from './breadcrumb.types.js';
/**
 * Anchor UI — Breadcrumb 元件 (`<aui-breadcrumb>`)
 *
 * 頁首的階層導覽：以 `items` 傳入從網站首頁到目前頁面的各層，最後一層為目前頁面。
 *
 * - 無障礙：`<nav>` landmark（名稱取自 `label`）內的有序清單；目前頁面帶 `aria-current="page"`
 *   （有 `href` 時仍為連結）；分隔符號不進入無障礙樹。
 * - 連結：`href` 只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定（如 `javascript:`）與省略 `href` 的層級為純文字。
 * - 可放進 `<aui-header>` 的 `breadcrumb` slot（沒有層級時請不要放入：Header 無法得知內容為空，會留下空白間距）。
 * - 層級以 `items` 屬性傳入（不支援只寫 HTML），元件升級前與伺服器端渲染的輸出不會顯示路徑。
 *
 * @element aui-breadcrumb
 *
 * @csspart base - `<nav>` 外層容器
 * @csspart list - 有序清單（`<ol>`）
 * @csspart item - 每一層（`<li>`）
 * @csspart link - 連結
 * @csspart text - 沒有連結的層級
 * @csspart current - 目前頁面（另帶有 `link` 或 `text`）
 * @csspart separator - 分隔符號
 */
export declare class AuiBreadcrumb extends LitElement {
    static styles: import('lit').CSSResult;
    /** 各層的文字與連結，依序從網站首頁到目前頁面（最後一層） */
    items: BreadcrumbItem[];
    /** 導覽區的無障礙名稱 */
    label: string;
    /** 層級之間的分隔符號（不會被輔助科技讀出） */
    separator: string;
    /** 一層的內容：有安全連結時為連結，否則為文字；最後一層帶 aria-current="page" */
    private renderLevel;
    render(): import('lit').TemplateResult<1> | typeof nothing;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-breadcrumb': AuiBreadcrumb;
    }
}
//# sourceMappingURL=breadcrumb.d.ts.map