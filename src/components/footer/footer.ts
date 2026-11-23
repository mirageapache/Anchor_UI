import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { normalizeHeadingLevel, renderHeading } from '../../internal/heading.js';
import { safeHref } from '../../internal/safe-href.js';
import { hasLightContent, LightContentController } from '../../internal/slot.js';
import { footerStyles } from './footer.styles.js';
import type { FooterColumn, FooterHeadingLevel, FooterLink } from './footer.types.js';

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
export class AuiFooter extends LitElement {
  static override styles = footerStyles;

  /**
   * 多欄導覽：每欄為標題與連結清單（只能以 property 設定）。
   * 以參照比較變化：修改內容時請指派新的陣列，直接 push 不會重新渲染
   */
  @property({ attribute: false })
  columns: FooterColumn[] = [];

  /** 版權所有者；設定後顯示「© 年份 名稱」 */
  @property({ type: String, attribute: 'copyright-holder' })
  copyrightHolder = '';

  /** 版權起始年份；早於今年時顯示為範圍 */
  @property({ type: Number, attribute: 'copyright-since' })
  copyrightSince?: number;

  /** 專案版本（如 `1.0.0`，顯示為 `v1.0.0`） */
  @property({ type: String })
  version = '';

  /** 欄位標題的層級（1–6），依頁面的標題結構調整 */
  @property({ type: Number, attribute: 'heading-level' })
  headingLevel: FooterHeadingLevel = 2;

  /** 多欄導覽的無障礙名稱 */
  @property({ type: String, attribute: 'columns-label' })
  columnsLabel = '網站導覽';

  /** 次要選單的無障礙名稱 */
  @property({ type: String, attribute: 'links-label' })
  linksLabel = '頁尾連結';

  /** 外部連結提供給輔助科技的提示 */
  @property({ type: String, attribute: 'external-label' })
  externalLabel = '（另開新視窗）';

  constructor() {
    super();
    // light DOM 變動時重新渲染，讓各區塊的顯示狀態保持最新
    new LightContentController(this);
  }

  /** 「© 年份 名稱」：年份為瀏覽器的當下年份；起始年份早於今年時顯示為範圍 */
  private copyrightText(): string {
    if (!this.copyrightHolder) return '';
    const year = new Date().getFullYear();
    const since = this.copyrightSince;
    const years =
      since !== undefined && Number.isInteger(since) && since > 0 && since < year
        ? `${since}–${year}`
        : year;
    return `© ${years} ${this.copyrightHolder}`;
  }

  private renderLink(link: FooterLink) {
    // 資料可能來自使用端無法完全信任的來源：不安全的協定不輸出 href
    const href = ifDefined(safeHref(link.href));
    return link.external
      ? html`<a href=${href} target="_blank" rel="noopener noreferrer"
          >${link.label}<span class="sr-only">${this.externalLabel}</span></a
        >`
      : html`<a href=${href}>${link.label}</a>`;
  }

  /** 框架可能綁定 null 等非陣列值，一律視為沒有欄位 */
  private get columnList(): FooterColumn[] {
    return Array.isArray(this.columns) ? this.columns : [];
  }

  private renderColumns(columns: FooterColumn[]) {
    if (!columns.length) return nothing;
    const level = normalizeHeadingLevel(this.headingLevel, 2);
    return html`
      <nav class="footer__columns" part="columns" aria-label=${this.columnsLabel}>
        ${columns.map(
          (column, i) => html`
            <div class="footer__column" part="column">
              ${
                // 沒有標題時不渲染空的標題元素（空標題會被輔助科技列入標題清單）
                column.heading
                  ? renderHeading(
                      level,
                      {
                        className: 'footer__column-heading',
                        part: 'column-heading',
                        id: `column-${i}`,
                      },
                      column.heading,
                    )
                  : nothing
              }
              <ul
                class="footer__list"
                aria-labelledby=${ifDefined(column.heading ? `column-${i}` : undefined)}
              >
                ${
                  // 資料來自使用端（可能缺少 links），不信任型別
                  (column.links ?? []).map((link) => html`<li>${this.renderLink(link)}</li>`)
                }
              </ul>
            </div>
          `,
        )}
      </nav>
    `;
  }

  override render() {
    const columns = this.columnList;
    const hasColumns = columns.length > 0;
    const hasCustomCopyright = hasLightContent(this, 'copyright');
    const copyright = this.copyrightText();
    const hasLinks = hasLightContent(this, 'links');
    const hasSocial = hasLightContent(this, 'social');
    const version = (this.version ?? '').trim();

    return html`
      <footer class=${classMap({ footer: true, 'footer--columns': hasColumns })} part="base">
        <div class="footer__inner">
          ${this.renderColumns(columns)}
          <div class="footer__bottom" part="bottom">
            <div class="footer__meta">
              <!-- 使用 <div>：copyright slot 可放入段落，用 <p> 會形成巢狀段落 -->
              <div
                class="footer__copyright"
                part="copyright"
                ?hidden=${!hasCustomCopyright && !copyright}
              >
                <slot name="copyright">${copyright}</slot>
              </div>
              ${
                version
                  ? html`<span class="footer__version" part="version"
                      >${/^v\d/i.test(version) ? version : `v${version}`}</span
                    >`
                  : nothing
              }
            </div>
            <nav
              class="footer__links"
              part="links"
              aria-label=${this.linksLabel}
              ?hidden=${!hasLinks}
            >
              <slot name="links"></slot>
            </nav>
            <div class="footer__social" part="social" ?hidden=${!hasSocial}>
              <slot name="social"></slot>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-footer')) {
  customElements.define('aui-footer', AuiFooter);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-footer': AuiFooter;
  }
}
