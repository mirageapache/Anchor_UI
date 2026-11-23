import { LitElement } from 'lit';
import { FavoriteBtnSize } from './favorite-btn.types.js';
/**
 * Anchor UI — Favorite Toggle Button 元件 (`<aui-favorite-btn>`)
 *
 * 星號形狀的開關按鈕，用於把常用工具或項目加入我的最愛。
 * 未收藏時為灰階線條，已收藏時以實心琥珀色高亮；使用者切換時有微縮放彈跳動態（遵循減少動畫設定）。
 *
 * 語意為切換按鈕（`aria-pressed`）：無障礙名稱 `label` 描述的是「這個按鈕控制什麼」，
 * 不隨狀態改變（例如固定為「我的最愛」，而不是在「加入／移除」之間切換），狀態由 `aria-pressed` 傳達。
 *
 * 元件會自行切換 `favorite` 並觸發 `aui-change`；需要由外部決定是否生效時（例如等待 API 回應），
 * 可在事件中把 `favorite` 設回原值。
 *
 * @element aui-favorite-btn
 *
 * @csspart base - 內部的原生 `<button>`
 * @csspart icon - 星號圖示（SVG）
 *
 * @fires aui-change - 使用者切換收藏狀態後觸發（由程式設定 `favorite` 不會觸發），`detail.favorite` 為新狀態；支援 bubbles 與 composed
 */
export declare class AuiFavoriteBtn extends LitElement {
    static styles: import('lit').CSSResult;
    /** 讓 host.focus() 落在內部的按鈕上 */
    static shadowRootOptions: ShadowRootInit;
    /** 是否已收藏 */
    favorite: boolean;
    /** 是否停用 */
    disabled: boolean;
    /** 尺寸規格 */
    size: FavoriteBtnSize;
    /** 無障礙名稱（同時作為滑鼠懸停提示）；描述按鈕控制的對象，不隨收藏狀態改變。空字串時使用預設名稱 */
    label: string;
    private icon?;
    /** 目前播放中的彈跳動態（只取消自己建立的動畫，不影響使用端透過 ::part(icon) 加上的動畫） */
    private bounceAnimation?;
    private handleClick;
    /**
     * 播放彈跳動態。使用 Web Animations API 而不是切換 class：
     * 連續點擊時每次都能重新播放，也不需要在動畫結束（或被減少動畫設定略過）後清除狀態。
     */
    private bounce;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-favorite-btn': AuiFavoriteBtn;
    }
}
//# sourceMappingURL=favorite-btn.d.ts.map