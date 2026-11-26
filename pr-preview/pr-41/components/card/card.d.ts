import { LitElement } from 'lit';
import { CardHeadingLevel, CardTarget } from './card.types.js';
/**
 * Anchor UI — Card 元件 (`<aui-card>`)
 *
 * 用於首頁或分類導覽的工具卡片：展示名稱、簡介（預設裁切為兩行）與標籤群。
 * 設定 `href` 時整張卡片是一個連結，具備 Hover 微浮凸與外框高亮；未設定時為靜態容器。
 * `hot` 以琥珀色外框與文字徽標標示推薦項目（不只依賴顏色傳達）。
 *
 * 多張卡片請放進帶有 `.card-grid` class 的容器（由 `@anchor-ui/core/styles.css` 提供），
 * 會依容器寬度自動調整欄數。
 *
 * 整張卡片為連結時，請勿在其中放入按鈕、連結等互動元素（互動元素不可巢狀），並請提供卡片名稱作為連結的名稱。
 *
 * 放入 `icon` slot 時改為左右排版：左側為圖示，右側為名稱、簡介與標籤（例如 KPI 卡片的圖示加數值）。
 * 圖示的大小與外觀由放入的元素決定；純裝飾的圖示請加上 `aria-hidden="true"`。
 *
 * @element aui-card
 *
 * @slot - 簡介描述（未提供時使用 `description` 屬性）
 * @slot heading - 卡片名稱（未提供時使用 `heading` 屬性）
 * @slot tags - 卡片底部的標籤群（如 `<aui-tag>`）
 * @slot icon - 左側的圖示（放入時改為左右排版）
 *
 * @csspart base - 卡片外層容器（有 `href` 時為 `<a>`，否則為 `<div>`）
 * @csspart icon - 圖示容器（只在放入 `icon` slot 時出現）
 * @csspart body - 圖示右側的內容容器（只在放入 `icon` slot 時出現）
 * @csspart header - 名稱與 HOT 徽標所在的標題列
 * @csspart heading - 卡片名稱（`<h1>` ~ `<h6>`）
 * @csspart hot-badge - HOT 徽標
 * @csspart description - 簡介描述容器
 * @csspart tags - 標籤群容器
 */
export declare class AuiCard extends LitElement {
    static styles: import('lit').CSSResult;
    /** 讓 host.focus() 落在內部的連結上 */
    static shadowRootOptions: ShadowRootInit;
    /** 卡片名稱 */
    heading: string;
    /** 簡介描述 */
    description: string;
    /**
     * 連結網址；設定後（包含空字串，同原生 `<a href="">`）整張卡片成為連結。
     * 只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定（如 `javascript:`）視為未設定
     */
    href?: string;
    /** 連結開啟目標（同原生 `<a target>`），僅在設定 `href` 時有效 */
    target?: CardTarget;
    /** 連結的 rel；`target="_blank"` 且未設定時預設為 `noopener noreferrer` */
    rel?: string;
    /** 是否為 HOT 推薦項目（琥珀色外框與徽標） */
    hot: boolean;
    /** HOT 徽標的文字 */
    hotLabel: string;
    /** 卡片名稱的標題層級（1–6） */
    headingLevel: CardHeadingLevel;
    /** 簡介描述最多顯示的行數，超過以省略號裁切；0 表示不裁切 */
    lines: number;
    constructor();
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-card': AuiCard;
    }
}
//# sourceMappingURL=card.d.ts.map