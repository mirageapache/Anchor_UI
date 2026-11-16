import { LitElement } from 'lit';
import { ToastVariant } from './toast.types.js';
/**
 * Anchor UI — Toast 元件 (`<aui-toast>`)
 *
 * 通知卡片：狀態圖示、標題、訊息與關閉鈕，支援 Success、Error、Warning、Info、Loading 5 種狀態。
 * 一般請使用 `ToastService`（可設定位置的堆疊、佇列、自動關閉與懸停暫停）；直接放在頁面上時為靜態卡片，
 * 點擊關閉鈕只會分派 `aui-close`，由使用端自行移除。
 *
 * - **播報**：文字區為 live region（Error 為 `role="alert"`，其餘為 `role="status"`），前綴狀態文字（如「錯誤：」）。
 *   插入頁面時先渲染空的 live region、下一幀才填入內容，讓螢幕閱讀器以「內容變更」播報；
 *   之後更新訊息（例如 loading 轉 success）也會再次播報。
 * - **動態**：進場滑入、退場淡出（遵循減少動畫設定）；被移動時（例如隨 Modal 移入其子樹）不重播進場動畫。
 *
 * @element aui-toast
 *
 * @slot - 訊息之後的額外內容
 *
 * @csspart base - 卡片
 * @csspart icon - 狀態圖示
 * @csspart content - 文字區（live region）
 * @csspart title - 標題
 * @csspart message - 訊息
 * @csspart close-button - 關閉鈕
 *
 * @fires aui-close - 點擊關閉鈕時觸發（ToastService 建立的通知會隨之關閉）
 */
export declare class AuiToast extends LitElement {
    static styles: import('lit').CSSResult[];
    /**
     * 狀態
     */
    variant: ToastVariant;
    /**
     * 標題
     */
    heading: string;
    /**
     * 訊息
     */
    message: string;
    /**
     * 是否隱藏關閉鈕
     */
    noCloseButton: boolean;
    /**
     * @internal 退場動畫中（由 ToastService 設定）
     */
    leaving: boolean;
    /** live region 是否已填入內容（插入頁面後下一幀才填入） */
    private announced;
    /** 進場動畫是否已播放完畢 */
    private entered;
    private announceScheduled;
    connectedCallback(): void;
    private get resolvedVariant();
    private handleAnimationEnd;
    private handleClose;
    private renderContent;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-toast': AuiToast;
    }
}
//# sourceMappingURL=toast.d.ts.map