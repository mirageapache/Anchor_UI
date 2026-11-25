import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeHref } from '../../internal/safe-href.js';
import { breadcrumbStyles } from './breadcrumb.styles.js';
import type { BreadcrumbItem } from './breadcrumb.types.js';

/** 執行期驗證：框架或 API 回傳的資料可能不是預期的形狀；沒有文字的層級會成為沒有名稱的連結，略過 */
const isItem = (value: unknown): value is BreadcrumbItem =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as BreadcrumbItem).label === 'string' &&
  (value as BreadcrumbItem).label.trim() !== '';

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
export class AuiBreadcrumb extends LitElement {
  static override styles = breadcrumbStyles;

  /** 各層的文字與連結，依序從網站首頁到目前頁面（最後一層） */
  @property({ attribute: false })
  items: BreadcrumbItem[] = [];

  /** 導覽區的無障礙名稱 */
  @property({ type: String })
  label = '麵包屑';

  /** 層級之間的分隔符號（不會被輔助科技讀出） */
  @property({ type: String })
  separator = '/';

  /** 一層的內容：有安全連結時為連結，否則為文字；最後一層帶 aria-current="page" */
  private renderLevel(item: BreadcrumbItem, current: boolean) {
    // 非字串的 href（如數字）視為沒有連結，不轉成字串輸出
    const href = typeof item.href === 'string' ? safeHref(item.href) : undefined;
    const ariaCurrent = current ? 'page' : nothing;
    if (href === undefined) {
      const part = current ? 'text current' : 'text';
      return html`<span part=${part} aria-current=${ariaCurrent}>${item.label}</span>`;
    }
    const part = current ? 'link current' : 'link';
    return html`<a class="breadcrumb__link" part=${part} href=${href} aria-current=${ariaCurrent}
      >${item.label}</a
    >`;
  }

  override render() {
    const items = Array.isArray(this.items) ? this.items.filter(isItem) : [];
    if (!items.length) return nothing;
    const last = items.length - 1;
    // 分隔符號前後的空格是換行點：空間不足時在層級之間換行，而不是拆開名稱
    // prettier-ignore
    const separator = html`<span class="breadcrumb__separator" part="separator" aria-hidden="true"> ${this.separator} </span>`;

    const levels = items.map((item, index) => {
      const prefix = index > 0 ? separator : nothing;
      const level = this.renderLevel(item, index === last);
      // 清單為行內排列：<li> 內與 <li> 之間不可有空白文字，否則會多出空格（不讓 Prettier 重新換行）
      // prettier-ignore
      return html`<li class="breadcrumb__item" part="item">${prefix}${level}</li>`;
    });
    // prettier-ignore
    return html`<nav part="base" aria-label=${this.label}><ol class="breadcrumb__list" part="list">${levels}</ol></nav>`;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-breadcrumb')) {
  customElements.define('aui-breadcrumb', AuiBreadcrumb);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-breadcrumb': AuiBreadcrumb;
  }
}
