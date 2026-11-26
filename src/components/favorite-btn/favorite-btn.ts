import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { favoriteBtnStyles } from './favorite-btn.styles.js';
import type { FavoriteBtnSize, FavoriteChangeDetail } from './favorite-btn.types.js';
import type { TooltipPlacement } from '../tooltip/tooltip.types.js';
import '../tooltip/index.js';

/** 切換時的微縮放彈跳 */
const BOUNCE_KEYFRAMES: Keyframe[] = [
  { transform: 'scale(1)' },
  { transform: 'scale(1.3)', offset: 0.4 },
  { transform: 'scale(0.92)', offset: 0.7 },
  { transform: 'scale(1)' },
];
const BOUNCE_DURATION_MS = 320;

const DEFAULT_LABEL = '我的最愛';

/** 有效的尺寸；其他值（例如 HTML 屬性寫錯）視為 md */
const FAVORITE_BTN_SIZES = new Set<FavoriteBtnSize>(['sm', 'md', 'lg']);

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
 * 懸停或聚焦時以內建的 `<aui-tooltip>` 顯示提示（預設為 `label`），與 `<aui-icon-button>` 一致；
 * 載入本元件時會一併註冊 `<aui-tooltip>`。
 *
 * @element aui-favorite-btn
 *
 * @csspart base - 內部的原生 `<button>`
 * @csspart icon - 星號圖示（SVG）
 * @csspart tooltip - 內建的 `<aui-tooltip>`（`no-tooltip` 時不存在）
 *
 * @fires {CustomEvent<FavoriteChangeDetail>} aui-change - 使用者切換收藏狀態後觸發（由程式設定 `favorite` 不會觸發），`detail.favorite` 為新狀態；支援 bubbles 與 composed
 */
export class AuiFavoriteBtn extends LitElement {
  static override styles = favoriteBtnStyles;

  /** 讓 host.focus() 落在內部的按鈕上 */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** 是否已收藏 */
  @property({ type: Boolean, reflect: true })
  favorite = false;

  /** 是否停用 */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** 尺寸規格 */
  @property({ type: String, reflect: true })
  size: FavoriteBtnSize = 'md';

  /** 無障礙名稱；描述按鈕控制的對象，不隨收藏狀態改變。空字串時使用預設名稱。未設定 `tooltip` 時也作為提示文字 */
  @property({ type: String })
  label = DEFAULT_LABEL;

  /** 提示文字；空字串時沿用 `label`。與名稱相同時不會再作為按鈕的描述，螢幕閱讀器不會念兩次 */
  @property({ type: String })
  tooltip = '';

  /** 提示的顯示方位 */
  @property({ type: String, attribute: 'tooltip-placement' })
  tooltipPlacement: TooltipPlacement = 'top';

  /** 不顯示提示 */
  @property({ type: Boolean, attribute: 'no-tooltip' })
  noTooltip = false;

  @query('.fav-btn')
  private button?: HTMLButtonElement;

  @query('.fav-btn__icon')
  private icon?: SVGElement;

  /** 目前播放中的彈跳動態（只取消自己建立的動畫，不影響使用端透過 ::part(icon) 加上的動畫） */
  private bounceAnimation?: Animation;

  constructor() {
    super();
    // 監聽 host 而不是內部按鈕：el.click() 與使用端對 host 分派的點擊也能切換（與 <aui-button> 一致）
    this.addEventListener('click', this.handleClick);
  }

  private handleClick = (event: MouseEvent): void => {
    if (this.disabled) return;
    // 只處理按鈕本身或直接對 host 的點擊：提示氣泡等其他內部元素的點擊不切換
    const origin = event.composedPath()[0];
    if (origin !== this && !(this.button && event.composedPath().includes(this.button))) return;
    const next = !this.favorite;
    this.favorite = next;
    this.dispatchEvent(
      new CustomEvent<FavoriteChangeDetail>('aui-change', {
        detail: { favorite: next },
        bubbles: true,
        composed: true,
      }),
    );
    // 事件之後才播放：監聽器把狀態設回原值（例如儲存失敗）時，畫面沒有變化，不應彈跳
    if (this.favorite === next) this.bounce();
  };

  /**
   * 播放彈跳動態。使用 Web Animations API 而不是切換 class：
   * 連續點擊時每次都能重新播放，也不需要在動畫結束（或被減少動畫設定略過）後清除狀態。
   */
  private bounce(): void {
    if (!this.icon?.animate) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.bounceAnimation?.cancel();
    this.bounceAnimation = this.icon.animate(BOUNCE_KEYFRAMES, {
      duration: BOUNCE_DURATION_MS,
      easing: 'ease',
    });
  }

  override render() {
    const size = FAVORITE_BTN_SIZES.has(this.size) ? this.size : 'md';
    // 沒有名稱的圖示按鈕無法被辨識，label 為空時退回預設名稱
    const label = this.label || DEFAULT_LABEL;
    const tooltip = this.tooltip || label;

    // 提示由 <aui-tooltip> 顯示，不使用按鈕的 title 屬性或 SVG 的 <title>：兩者都會出現瀏覽器原生提示，
    // 與元件庫其他按鈕不一致。提示與名稱相同時，Tooltip 不會把它寫成按鈕的描述。
    // （說明寫在這裡而不是範本內的 HTML 註解，避免註解進入發布產物。）

    const button = html`
      <button
        type="button"
        class=${classMap({
          'fav-btn': true,
          [`fav-btn--${size}`]: true,
          'is-favorite': this.favorite,
        })}
        part="base"
        aria-pressed=${this.favorite ? 'true' : 'false'}
        aria-label=${label}
        ?disabled=${this.disabled}
      >
        <svg
          class="fav-btn__icon"
          part="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M12 3.5l2.63 5.33 5.87.86-4.25 4.14 1 5.85L12 16.92l-5.25 2.76 1-5.85L3.5 9.69l5.87-.86L12 3.5z"
          />
        </svg>
      </button>
    `;

    if (this.noTooltip) return button;

    return html`
      <aui-tooltip
        part="tooltip"
        .content=${tooltip}
        .placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
      >
        ${button}
      </aui-tooltip>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-favorite-btn')) {
  customElements.define('aui-favorite-btn', AuiFavoriteBtn);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-favorite-btn': AuiFavoriteBtn;
  }
}
