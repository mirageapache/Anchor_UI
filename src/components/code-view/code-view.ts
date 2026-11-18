import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { codeViewStyles } from './code-view.styles.js';
import { computeFoldRanges, maxColumns, splitLines } from './fold-ranges.js';

/** 每個分段的行數：分段以 content-visibility: auto 讓瀏覽器略過畫面外的排版與繪製 */
const CHUNK_SIZE = 200;

/** 摺疊鈕的箭頭（展開時朝下、摺疊時朝右，由 CSS 旋轉） */
const chevron = html`
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M6 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

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
export class AuiCodeView extends LitElement {
  static override styles = codeViewStyles;

  /** 要顯示的程式碼（純文字） */
  @property({ type: String })
  code = '';

  /** 檢視區的無障礙名稱 */
  @property({ type: String })
  label = '程式碼';

  /** 已摺疊區塊的起始行（0 起算） */
  @state()
  private collapsed = new Set<number>();

  /** 摺疊鈕中位於 Tab 順序上的那一個（起始行，0 起算；roving tabindex） */
  @state()
  private activeFold = -1;

  private lines: string[] = [];
  private foldRanges = new Map<number, number>();
  private columns = 0;

  /** 以程式摺疊或展開時，焦點所在的摺疊鈕可能被收起：渲染後把焦點移到 Tab 順序上的摺疊鈕 */
  private refocusFold = false;

  /** 摺疊所有區塊 */
  foldAll(): void {
    this.setCollapsed(new Set(this.foldRanges.keys()));
  }

  /** 展開所有區塊 */
  unfoldAll(): void {
    this.setCollapsed(new Set());
  }

  private setCollapsed(collapsed: Set<number>): void {
    const focused = this.renderRoot.querySelector?.(':focus');
    this.refocusFold = !!focused?.matches('.code-view__fold');
    this.collapsed = collapsed;
  }

  override updated(): void {
    if (!this.refocusFold) return;
    this.refocusFold = false;
    this.renderRoot.querySelector<HTMLButtonElement>('.code-view__fold[tabindex="0"]')?.focus();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('code')) {
      // 框架可能綁定 null 或非字串的值
      this.lines = splitLines(String(this.code ?? ''));
      this.foldRanges = computeFoldRanges(this.lines);
      this.columns = maxColumns(this.lines);
      this.collapsed = new Set();
      this.activeFold = this.foldRanges.keys().next().value ?? -1;
    }
  }

  /** 目前顯示的行（略過已摺疊區塊的內部行），依序排列 */
  private visibleLines(): number[] {
    const visible: number[] = [];
    for (let i = 0; i < this.lines.length; i++) {
      visible.push(i);
      if (this.collapsed.has(i)) i = this.foldRanges.get(i)!;
    }
    return visible;
  }

  private toggleFold(start: number): void {
    const next = new Set(this.collapsed);
    if (!next.delete(start)) next.add(start);
    this.collapsed = next;
    this.activeFold = start;
  }

  private handleFoldClick = (event: Event) => {
    const start = Number((event.currentTarget as HTMLElement).dataset.line);
    this.toggleFold(start);
  };

  /** 摺疊鈕之間的鍵盤移動（roving tabindex） */
  private handleKeydown = (event: KeyboardEvent) => {
    const button = (event.target as Element).closest?.<HTMLButtonElement>('.code-view__fold');
    if (!button) return;
    const buttons = [...this.renderRoot.querySelectorAll<HTMLButtonElement>('.code-view__fold')];
    const index = buttons.indexOf(button);
    const targetIndex: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: buttons.length - 1,
    };
    const target = buttons[targetIndex[event.key] ?? -1];
    if (!target) return;
    event.preventDefault();
    this.activeFold = Number(target.dataset.line);
    target.focus();
  };

  private renderLine(i: number, activeFold: number) {
    const end = this.foldRanges.get(i);
    const isCollapsed = this.collapsed.has(i);
    const fold =
      end === undefined
        ? html`<span class="code-view__fold-spacer"></span>`
        : html`<button
            class="code-view__fold"
            part="fold-button"
            type="button"
            data-line=${i}
            tabindex=${i === activeFold ? 0 : -1}
            aria-expanded=${String(!isCollapsed)}
            aria-label=${`第 ${i + 1}–${end + 1} 行`}
            @click=${this.handleFoldClick}
          >
            ${chevron}
          </button>`;
    return html`<div class="code-view__line" part="line">
      <span class="code-view__gutter" part="gutter"
        ><span class="code-view__number" part="line-number" aria-hidden="true">${i + 1}</span
        >${fold}</span
      ><span class="code-view__code" part="code">${this.lines[i]}</span>${
        isCollapsed
          ? html`<span class="code-view__placeholder" part="fold-placeholder" aria-hidden="true"
              >⋯</span
            >`
          : nothing
      }
    </div>`;
  }

  override render() {
    const visible = this.visibleLines();
    // Tab 順序上的摺疊鈕被收進已摺疊的區塊時，改用第一個顯示中的摺疊鈕，確保仍能以 Tab 進入
    const activeFold =
      visible.includes(this.activeFold) && this.foldRanges.has(this.activeFold)
        ? this.activeFold
        : (visible.find((i) => this.foldRanges.has(i)) ?? -1);
    const chunks: number[][] = [];
    for (let i = 0; i < visible.length; i += CHUNK_SIZE) {
      chunks.push(visible.slice(i, i + CHUNK_SIZE));
    }
    // 行號欄寬依總行數的位數；內容寬度以最長一行估算（分段的繪製範圍會裁切超出的部分）
    const digits = Math.max(2, String(this.lines.length).length);
    const content = styleMap({
      '--aui-code-view-digits': String(digits),
      '--aui-code-view-columns': String(this.columns),
    });

    return html`
      <div
        class="code-view"
        part="base"
        role="region"
        aria-label=${this.label}
        tabindex="0"
        @keydown=${this.handleKeydown}
      >
        <div class="code-view__content" style=${content}>
          ${chunks.map(
            (chunk) => html`
              <div
                class="code-view__chunk"
                style=${styleMap({ '--aui-code-view-lines': String(chunk.length) })}
              >
                ${chunk.map((i) => this.renderLine(i, activeFold))}
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-code-view')) {
  customElements.define('aui-code-view', AuiCodeView);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-code-view': AuiCodeView;
  }
}
