import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { codeViewStyles } from './code-view.styles.js';
import { computeFoldRanges, maxColumns, splitLines } from './fold-ranges.js';

/**
 * 每個分段涵蓋的原始行數：分段以 content-visibility: auto 讓瀏覽器略過畫面外的排版與繪製。
 * 以原始行號分段（第 0–199 行為第 0 段…），摺疊只會改變受影響分段的內容，其餘分段的 DOM 不變
 */
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
 *   複製選取的內容時以原始文字為準：選取範圍跨過已摺疊的區塊時，摺疊中的行也會一併複製。
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

  /**
   * 摺疊鈕中位於 Tab 順序上的那一個（起始行，0 起算；roving tabindex）。
   * 不是 reactive state：以方向鍵移動時直接改兩個按鈕的 tabindex，不必重新渲染所有行（萬行內容時按住方向鍵會卡頓）
   */
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
    this.refocusFold = !!this.shadowRoot?.activeElement?.matches('.code-view__fold');
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

  /** 摺疊鈕的點擊：委派在捲動容器上（萬行內容可能有數千個摺疊鈕，不逐一綁定監聽） */
  private handleClick = (event: Event) => {
    const button = (event.target as Element).closest?.<HTMLElement>('.code-view__fold');
    if (button) this.toggleFold(Number(button.dataset.line));
  };

  /** 摺疊鈕之間的鍵盤移動（roving tabindex） */
  private handleKeydown = (event: KeyboardEvent) => {
    const button = (event.target as Element).closest?.<HTMLButtonElement>('.code-view__fold');
    if (!button) return;
    // 由資料找出目標行，再查詢那一個按鈕（不列舉所有摺疊鈕）
    const folds = this.visibleLines().filter((i) => this.foldRanges.has(i));
    const index = folds.indexOf(Number(button.dataset.line));
    const targetIndex: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: folds.length - 1,
    };
    const line = folds[targetIndex[event.key] ?? -1];
    if (line === undefined) return;
    event.preventDefault();
    const target = this.renderRoot.querySelector<HTMLButtonElement>(
      `.code-view__fold[data-line="${line}"]`,
    );
    if (!target) return;
    // 直接搬移 tabindex：下一次渲染以同一個 activeFold 計算，結果與這裡寫入的相同
    this.renderRoot
      .querySelector<HTMLButtonElement>('.code-view__fold[tabindex="0"]')
      ?.setAttribute('tabindex', '-1');
    target.setAttribute('tabindex', '0');
    this.activeFold = line;
    target.focus();
  };

  /**
   * 複製：以原始文字寫入剪貼簿。畫面上的選取範圍不含已摺疊的行（不在 DOM 中），
   * 空白行在序列化選取範圍時也可能被瀏覽器合併；選取範圍超出本元件時交給瀏覽器處理
   */
  private handleCopy = (event: ClipboardEvent) => {
    const range = this.selectedRange();
    if (!range || !event.clipboardData) return;
    const codes = [...this.renderRoot.querySelectorAll<HTMLElement>('.code-view__code')].filter(
      (code) => range.intersectsNode(code),
    );
    if (codes.length === 0) return;
    const lineOf = (code: HTMLElement) =>
      Number(code.parentElement!.querySelector<HTMLElement>('.code-view__number')!.textContent) - 1;
    const firstCode = codes[0];
    const lastCode = codes.at(-1)!;
    const first = lineOf(firstCode);
    let last = lineOf(lastCode);
    const startColumn = firstCode.contains(range.startContainer)
      ? this.columnOf(firstCode, range.startContainer, range.startOffset)
      : 0;
    const endsInCode = lastCode.contains(range.endContainer);
    const endColumn = endsInCode
      ? this.columnOf(lastCode, range.endContainer, range.endOffset)
      : this.lines[last].length;
    const selected = this.lines.slice(first, last + 1);
    selected[selected.length - 1] = selected[selected.length - 1].slice(0, endColumn);
    selected[0] = selected[0].slice(startColumn);
    // 選到已摺疊區塊起始行的結尾之後：連同摺疊中的行一起複製
    if (this.collapsed.has(last) && !endsInCode) {
      const end = this.foldRanges.get(last)!;
      selected.push(...this.lines.slice(last + 1, end + 1));
      last = end;
    }
    event.clipboardData.setData('text/plain', selected.join('\n'));
    event.preventDefault();
  };

  /** 選取範圍的端點在該行文字中的欄位：該行開頭到端點之間的文字長度（Lit 的註解標記不計入） */
  private columnOf(code: HTMLElement, container: Node, offset: number): number {
    const before = document.createRange();
    before.selectNodeContents(code);
    before.setEnd(container, offset);
    return before.toString().length;
  }

  /** 位於本元件 Shadow DOM 內的選取範圍；沒有、或端點在元件之外時為 null */
  private selectedRange(): Range | null {
    const root = this.shadowRoot;
    if (!root) return null;
    type ComposedSelection = Selection & {
      getComposedRanges?: (options: { shadowRoots: ShadowRoot[] }) => StaticRange[];
    };
    type SelectableRoot = ShadowRoot & { getSelection?: () => Selection | null };
    try {
      const selection = document.getSelection() as ComposedSelection | null;
      let bounds: AbstractRange | undefined = selection?.getComposedRanges?.({
        shadowRoots: [root],
      })[0];
      if (!bounds) {
        // 舊版 Chromium：Shadow Root 自己的 getSelection()
        const legacy = (root as SelectableRoot).getSelection?.();
        bounds = legacy?.rangeCount ? legacy.getRangeAt(0) : undefined;
      }
      if (!bounds || bounds.collapsed) return null;
      if (!root.contains(bounds.startContainer) || !root.contains(bounds.endContainer)) return null;
      const range = document.createRange();
      range.setStart(bounds.startContainer, bounds.startOffset);
      range.setEnd(bounds.endContainer, bounds.endOffset);
      return range;
    } catch {
      return null;
    }
  }

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
    // 依原始行號分段；整段都被摺疊時不產生分段
    const chunks: Array<{ index: number; lines: number[] }> = [];
    for (const i of visible) {
      const index = Math.floor(i / CHUNK_SIZE);
      if (chunks.at(-1)?.index !== index) chunks.push({ index, lines: [] });
      chunks.at(-1)!.lines.push(i);
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
        @click=${this.handleClick}
        @copy=${this.handleCopy}
      >
        <div class="code-view__content" style=${content}>
          ${
            // 以分段編號為 key：某一段因摺疊而消失或出現時，其餘分段的 DOM 維持不動
            repeat(
              chunks,
              (chunk) => chunk.index,
              (chunk) => html`
                <div
                  class="code-view__chunk"
                  style=${styleMap({ '--aui-code-view-lines': String(chunk.lines.length) })}
                >
                  ${chunk.lines.map((i) => this.renderLine(i, activeFold))}
                </div>
              `,
            )
          }
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
