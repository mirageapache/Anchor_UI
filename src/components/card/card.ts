import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { normalizeHeadingLevel, renderHeading } from '../../internal/heading.js';
import { hasLightContent, LightContentController } from '../../internal/slot.js';
import { cardStyles } from './card.styles.js';
import { safeHref } from '../../internal/safe-href.js';
import type { CardHeadingLevel, CardTarget } from './card.types.js';

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
 * @element aui-card
 *
 * @slot - 簡介描述（未提供時使用 `description` 屬性）
 * @slot heading - 卡片名稱（未提供時使用 `heading` 屬性）
 * @slot tags - 卡片底部的標籤群（如 `<aui-tag>`）
 *
 * @csspart base - 卡片外層容器（有 `href` 時為 `<a>`，否則為 `<div>`）
 * @csspart header - 名稱與 HOT 徽標所在的標題列
 * @csspart heading - 卡片名稱（`<h1>` ~ `<h6>`）
 * @csspart hot-badge - HOT 徽標
 * @csspart description - 簡介描述容器
 * @csspart tags - 標籤群容器
 */
export class AuiCard extends LitElement {
  static override styles = cardStyles;

  /** 讓 host.focus() 落在內部的連結上 */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** 卡片名稱 */
  @property({ type: String })
  heading = '';

  /** 簡介描述 */
  @property({ type: String })
  description = '';

  /**
   * 連結網址；設定後（包含空字串，同原生 `<a href="">`）整張卡片成為連結。
   * 只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定（如 `javascript:`）視為未設定
   */
  @property({ type: String })
  href?: string;

  /** 連結開啟目標（同原生 `<a target>`），僅在設定 `href` 時有效 */
  @property({ type: String })
  target?: CardTarget;

  /** 連結的 rel；`target="_blank"` 且未設定時預設為 `noopener noreferrer` */
  @property({ type: String })
  rel?: string;

  /** 是否為 HOT 推薦項目（琥珀色外框與徽標） */
  @property({ type: Boolean, reflect: true })
  hot = false;

  /** HOT 徽標的文字 */
  @property({ type: String, attribute: 'hot-label' })
  hotLabel = 'HOT';

  /** 卡片名稱的標題層級（1–6） */
  @property({ type: Number, attribute: 'heading-level' })
  headingLevel: CardHeadingLevel = 3;

  /** 簡介描述最多顯示的行數，超過以省略號裁切；0 表示不裁切 */
  @property({ type: Number })
  lines = 2;

  constructor() {
    super();
    // light DOM 變動（含文字節點內容更新）時重新渲染，讓各區塊的顯示狀態保持最新
    new LightContentController(this);
  }

  override render() {
    const href = safeHref(this.href);
    const isLink = href !== undefined;
    const lines = Number.isFinite(this.lines) && this.lines > 0 ? Math.floor(this.lines) : 0;
    const hasHeading = !!this.heading || hasLightContent(this, 'heading');
    const hasSlottedDescription = hasLightContent(this);
    const hasDescription = hasSlottedDescription || !!this.description;
    const hasTags = hasLightContent(this, 'tags');

    const content = html`
      <div class="card__header" part="header">
        ${renderHeading(
          normalizeHeadingLevel(this.headingLevel, 3),
          { className: 'card__name', part: 'heading', id: 'heading' },
          html`<slot name="heading">${this.heading}</slot>`,
        )}
        ${
          this.hot
            ? html`<span class="card__hot" part="hot-badge" id="hot">${this.hotLabel}</span>`
            : nothing
        }
      </div>
      <div
        class=${classMap({ card__desc: true, 'card__desc--clamp': lines > 0 })}
        part="description"
        id="description"
        style=${styleMap({ '--_aui-card-lines': lines > 0 ? String(lines) : undefined })}
        ?hidden=${!hasDescription}
      >
        <slot></slot>${hasSlottedDescription ? nothing : this.description}
      </div>
      <div class="card__tags" part="tags" id="tags" ?hidden=${!hasTags}>
        <slot name="tags"></slot>
      </div>
    `;

    // 簡介不使用 slot 的 fallback 內容（見上方範本）：只要 host 內有任何節點（包含換行空白、其他具名 slot 的
    // 元素之間的空白），預設 slot 就視為已指派，fallback 不會顯示。
    // （說明寫在這裡而不是範本內的 HTML 註解，避免註解進入發布產物。）
    const classes = classMap({ card: true, 'card--hot': this.hot, 'card--link': isLink });

    if (!isLink) {
      return html`<div class=${classes} part="base">${content}</div>`;
    }

    const rel = this.rel ?? (this.target === '_blank' ? 'noopener noreferrer' : undefined);
    // 連結的無障礙名稱只取卡片名稱（與 HOT 徽標），簡介與標籤作為描述，避免整段內容都被念成連結名稱。
    // 沒有名稱時不設定 aria-labelledby，退回以內容計算名稱。
    const labelledBy = hasHeading ? (this.hot ? 'heading hot' : 'heading') : undefined;
    const describedBy =
      [hasDescription ? 'description' : '', hasTags ? 'tags' : ''].filter(Boolean).join(' ') ||
      undefined;

    return html`
      <a
        class=${classes}
        part="base"
        href=${href}
        target=${ifDefined(this.target)}
        rel=${ifDefined(rel)}
        aria-labelledby=${ifDefined(labelledBy)}
        aria-describedby=${ifDefined(describedBy)}
      >
        ${content}
      </a>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-card')) {
  customElements.define('aui-card', AuiCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-card': AuiCard;
  }
}
