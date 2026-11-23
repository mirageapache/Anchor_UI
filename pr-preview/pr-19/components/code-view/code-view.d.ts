import { LitElement, PropertyValues } from 'lit';
/**
 * Anchor UI — Code View 元件 (`<aui-code-view>`)
 *
 * IDE 風格的等寬程式碼檢視區，用於展示轉換結果（JSON、程式碼、格式化文字）。純文字、不做語法高亮。
 *
 * - **行號**：左側行號列為 sticky，水平捲動時不位移；行號與摺疊鈕不會被選取或複製。
 * - **摺疊**：依縮排自動判斷可摺疊的區塊（下一個非空白行縮排更深的行即可摺疊，與 VS Code 預設相同）。
 *   摺疊鈕為一組：Tab 只會停在其中一個，以 ↑ / ↓ 在摺疊鈕之間移動、Home / End 到第一個 / 最後一個，
 *   Enter 或空白鍵切換。`code` 變更時摺疊狀態會重設。
 * - **大量內容**：所有展開中的行都在 DOM 中（瀏覽器的頁內搜尋與跨行選取皆可用；摺疊中的行不在 DOM 中，
 *   頁內搜尋找不到），每 200 行為一段並以 `content-visibility: auto` 略過畫面外分段的排版與繪製，
 *   萬行內容也能順暢捲動。
 * - **無障礙**：捲動容器為可聚焦的 `region`（以 `label` 命名）；同一頁有多個檢視區時請給不同的 `label`。
 * - **高度**：預設隨內容增高；限制高度時設定 `::part(base)` 的 `max-height`，內容會在檢視區內捲動。
 *
 * @element aui-code-view
 *
 * @csspart base - 捲動容器（可聚焦以鍵盤捲動，`role="region"`）
 * @csspart line - 每一行
 * @csspart gutter - 行號列（行號與摺疊鈕）
 * @csspart line-number - 行號
 * @csspart fold-button - 摺疊鈕
 * @csspart code - 該行的程式碼文字
 * @csspart fold-placeholder - 摺疊後顯示在起始行尾端的「⋯」
 */
export declare class AuiCodeView extends LitElement {
    static styles: import('lit').CSSResult;
    /** 要顯示的程式碼（純文字） */
    code: string;
    /** 檢視區的無障礙名稱 */
    label: string;
    /** 已摺疊區塊的起始行（0 起算） */
    private collapsed;
    /** 摺疊鈕中位於 Tab 順序上的那一個（起始行，0 起算；roving tabindex） */
    private activeFold;
    private lines;
    private foldRanges;
    private columns;
    /** 以程式摺疊或展開時，焦點所在的摺疊鈕可能被收起：渲染後把焦點移到 Tab 順序上的摺疊鈕 */
    private refocusFold;
    /** 摺疊所有區塊 */
    foldAll(): void;
    /** 展開所有區塊 */
    unfoldAll(): void;
    private setCollapsed;
    updated(): void;
    willUpdate(changed: PropertyValues<this>): void;
    /** 目前顯示的行（略過已摺疊區塊的內部行），依序排列 */
    private visibleLines;
    private toggleFold;
    /** 摺疊鈕的點擊：委派在捲動容器上（萬行內容可能有數千個摺疊鈕，不逐一綁定監聽） */
    private handleClick;
    /** 摺疊鈕之間的鍵盤移動（roving tabindex） */
    private handleKeydown;
    private renderLine;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-code-view': AuiCodeView;
    }
}
//# sourceMappingURL=code-view.d.ts.map