import { LitElement } from 'lit';
import { HeaderHeadingLevel } from './header.types.js';
/**
 * Anchor UI — Header 元件 (`<aui-header>`)
 *
 * 工具頁面頂部的複合展示列：分類標籤、HOT 推薦徽標、主標題（預設為 `<h1>`）、我的最愛收藏鈕與簡述文字，
 * 提供統一的頁首層次與字級節奏。純展示與事件轉發：收藏狀態由 `favorite` 屬性表示，
 * 使用者切換時轉發為 `aui-favorite-change`，是否保存由使用端決定。
 *
 * 內部組合 `<aui-tag>`（HOT 徽標）與 `<aui-favorite-btn>`（收藏鈕），載入本元件時會一併註冊；
 * 放進 `tags` slot 的分類標籤（`<aui-tag>`）需由使用端自行載入。
 *
 * @element aui-header
 *
 * @slot - 簡述文字（未提供時使用 `description` 屬性）
 * @slot heading - 主標題（未提供時使用 `heading` 屬性）
 * @slot tags - 標題上方的分類標籤（如 `<aui-tag>`）
 * @slot actions - 標題列右側的其他操作（如按鈕）
 *
 * @csspart base - 外層容器
 * @csspart tags - 分類標籤與 HOT 徽標所在的列
 * @csspart hot-badge - HOT 徽標（`<aui-tag>`）
 * @csspart title-row - 主標題、收藏鈕與操作所在的列（空間不足時操作會換到下一行）
 * @csspart heading - 主標題（`<h1>` ~ `<h6>`）
 * @csspart favorite-button - 收藏鈕（`<aui-favorite-btn>`）
 * @csspart actions - 右側操作容器
 * @csspart description - 簡述文字
 *
 * @fires aui-favorite-change - 使用者切換收藏鈕後觸發，`detail.favorite` 為新狀態；支援 bubbles 與 composed。可在事件中把 `favorite` 設回原值以取消變更
 */
export declare class AuiHeader extends LitElement {
    static styles: import('lit').CSSResult;
    /** 主標題 */
    heading: string;
    /** 簡述文字 */
    description: string;
    /** 主標題的標題層級（1–6）；一個頁面應只有一個 `<h1>` */
    headingLevel: HeaderHeadingLevel;
    /** 是否顯示 HOT 推薦徽標 */
    hot: boolean;
    /** HOT 徽標的文字 */
    hotLabel: string;
    /** 是否顯示我的最愛收藏鈕 */
    favoritable: boolean;
    /** 是否已收藏（需搭配 `favoritable`） */
    favorite: boolean;
    /** 收藏鈕的無障礙名稱，也是懸停或聚焦時顯示的提示文字 */
    favoriteLabel: string;
    constructor();
    /** 把收藏鈕的 aui-change 轉發為語意明確的 aui-favorite-change，並同步 favorite 屬性 */
    private handleFavoriteChange;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-header': AuiHeader;
    }
}
//# sourceMappingURL=header.d.ts.map