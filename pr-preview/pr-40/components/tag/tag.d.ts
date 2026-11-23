import { LitElement } from 'lit';
import { TagSize, TagVariant } from './tag.types.js';
/**
 * Anchor UI — Tag / Badge 元件 (`<aui-tag>`)
 *
 * 採用 JetBrains Mono 等寬字體呈現的專業標籤，用於技術分類、版本標號、格式與狀態標記。
 * 支援 7 種語意色彩變體（另有 6 個相容別名）、3 種尺寸規格、膠囊圓角 (pill)、可點擊互動 (interactive)、
 * 可移除操作 (removable)。文字照原樣顯示，不轉換大小寫。
 *
 * @element aui-tag
 *
 * @slot - 標籤主體文字內容
 * @slot prefix - 標籤前綴圖示或狀態小圓點
 * @slot suffix - 標籤後綴圖示
 *
 * @csspart base - 標籤本體外層容器
 * @csspart action - 前綴、主體與後綴的包裝容器（interactive 時為 role="button" 的可聚焦元素）
 * @csspart prefix - 前綴內容包裝容器
 * @csspart content - 主體文字包裝容器
 * @csspart suffix - 後綴內容包裝容器
 * @csspart remove-button - 移除按鈕（當 removable 為 true 時）
 *
 * @fires aui-remove - 當點擊移除按鈕時觸發，支援 bubbles 與 composed
 */
export declare class AuiTag extends LitElement {
    static styles: import('lit').CSSResult;
    /**
     * 語意色彩變體：7 種核心語意色，另有相容別名
     * deep-blue→brand、green→success、amber / accent→warning、red→danger、blue→info
     */
    variant: TagVariant;
    /**
     * 尺寸規格階層
     */
    size: TagSize;
    /**
     * 是否呈現全圓角膠囊造型
     */
    pill: boolean;
    /**
     * 已無作用：文字預設即保留原始大小寫。保留這個屬性只為相容舊的寫法，下一個主要版本移除。
     * @deprecated 文字一律照原樣顯示，不需要再設定
     */
    preserveCase: boolean;
    /**
     * 是否顯示移除按鈕
     */
    removable: boolean;
    /**
     * 是否啟用點擊互動（例如篩選標籤）
     */
    interactive: boolean;
    /**
     * 移除按鈕的無障礙語意標籤
     */
    removeLabel: string;
    /**
     * 互動語意（role="button" / tabindex）放在 shadow 內的 action 元素而非 host，
     * 使移除鈕成為其兄弟節點而非子節點：避免 nested-interactive，
     * 也讓移除鈕的 Enter / Space 不會被標籤本體的鍵盤處理攔截。
     */
    static shadowRootOptions: ShadowRootInit;
    private handleActionKeyDown;
    private handleRemoveClick;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-tag': AuiTag;
    }
}
//# sourceMappingURL=tag.d.ts.map