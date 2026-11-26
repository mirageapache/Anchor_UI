import { LitElement } from 'lit';
import { FooterColumn, FooterHeadingLevel } from './footer.types.js';
/**
 * Anchor UI — Footer 元件 (`<aui-footer>`)
 *
 * 站台通用頁尾：版權宣告、專案版本、次要選單與社群連結，以及選用的多欄導覽。
 * 不綁定頁面版型、撐滿容器寬度；放在 flex 直向排列的頁面容器中時會被推到底部（`margin-top: auto`）。
 *
 * - **版型**：沒有 `columns` 時為簡潔單列（Minimal）；設定 `columns` 時上方為多欄導覽（Columns），
 *   下方為版權列。欄寬自動排列，窄版（寬度 < 640px）時版權列改為直向堆疊。
 * - **版權**：設定 `copyright-holder` 即顯示「© 今年 名稱」，年份取自瀏覽器的當下日期；
 *   `copyright-since` 早於今年時顯示為範圍（© 2024–2026）。要自訂整段內容時使用 `copyright` slot。
 * - **外部連結**：`columns` 中 `external` 的連結另開新視窗，並為輔助科技補上「（另開新視窗）」；
 *   放進 `links` / `social` slot 的外部連結請自行加上 `target` 與 `rel`。
 * - **連結協定**：`columns` 的 `href` 只接受 http(s)、`mailto:`、`tel:` 與相對路徑；
 *   其他協定（如 `javascript:`）不會輸出 `href`，該項目顯示為沒有連結的文字。
 *
 * 外層為 `<footer>`（contentinfo landmark），一個頁面只應放一個。
 *
 * @element aui-footer
 *
 * @slot copyright - 自訂版權宣告（取代 `copyright-holder` 產生的文字）
 * @slot links - 次要選單（通常為多個 `<a>`），位於 `<nav>` 內
 * @slot social - 社群或 GitHub 等圖示連結（請為圖示連結提供無障礙名稱）
 *
 * @csspart base - 外層 `<footer>`
 * @csspart columns - 多欄導覽的 `<nav>`
 * @csspart column - 一欄
 * @csspart column-heading - 欄位標題
 * @csspart bottom - 版權列
 * @csspart copyright - 版權宣告
 * @csspart version - 版本資訊
 * @csspart links - 次要選單的 `<nav>`
 * @csspart social - 社群連結容器
 */
export declare class AuiFooter extends LitElement {
    static styles: import('lit').CSSResult;
    /**
     * 多欄導覽：每欄為標題與連結清單（只能以 property 設定）。
     * 以參照比較變化：修改內容時請指派新的陣列，直接 push 不會重新渲染
     */
    columns: FooterColumn[];
    /** 版權所有者；設定後顯示「© 年份 名稱」 */
    copyrightHolder: string;
    /** 版權起始年份；早於今年時顯示為範圍 */
    copyrightSince?: number;
    /** 專案版本（如 `1.0.0`，顯示為 `v1.0.0`） */
    version: string;
    /** 欄位標題的層級（1–6），依頁面的標題結構調整 */
    headingLevel: FooterHeadingLevel;
    /** 多欄導覽的無障礙名稱 */
    columnsLabel: string;
    /** 次要選單的無障礙名稱 */
    linksLabel: string;
    /** 外部連結提供給輔助科技的提示 */
    externalLabel: string;
    constructor();
    /** 「© 年份 名稱」：年份為瀏覽器的當下年份；起始年份早於今年時顯示為範圍 */
    private copyrightText;
    private renderLink;
    /**
     * 框架可能綁定 null 等非陣列值，一律視為沒有欄位；資料來自使用端（API 回應等），不信任型別：
     * 不是物件的欄位與連結略過，links 不是陣列時視為沒有連結，避免單一筆壞資料讓整個頁尾無法渲染
     */
    private get columnList();
    private renderColumns;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-footer': AuiFooter;
    }
}
//# sourceMappingURL=footer.d.ts.map