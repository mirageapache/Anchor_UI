import { LitElement, html, type PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { accordionStyles } from './accordion.styles.js';
import type { AccordionToggleDetail, AccordionVariant } from './accordion.types.js';

/** 有效的排版；其他值（例如 HTML 屬性寫錯）視為 doc */
const ACCORDION_VARIANTS = new Set<AccordionVariant>(['doc', 'faq']);

/**
 * Anchor UI — Accordion 元件 (`<aui-accordion>`)
 *
 * 以原生 `<details>` / `<summary>` 封裝的內容收折區塊，用於操作說明、限制規範或常見問題。
 * 展開時外框平滑高亮、標題箭頭旋轉；鍵盤操作（Enter / Space）沿用原生行為。
 *
 * 設定相同 `name` 的手風琴互斥：展開其中一個時，同一個根節點（document 或 shadow root）內
 * 其他同名的手風琴會自動收合；未設定 `name` 時各自獨立開闔。
 * 一開始就有多個同名項目展開、或把展開中的項目插入已有展開項目的群組時，保留文件順序中最前面的那一個。
 * 巢狀的手風琴（彼此為祖先／後代）不互相收合。
 * （原生 `<details name>` 的分組不跨 Shadow DOM，因此由元件自行處理。）
 *
 * 內容中的段落與清單（`<p>`、`<ul>`、`<ol>`）會套用預設的間距與縮排。
 *
 * `aui-toggle` 會冒泡並穿出 Shadow DOM，巢狀手風琴的事件也會傳到外層；
 * 只處理自身的事件時請比對 `event.target === event.currentTarget`。
 *
 * @element aui-accordion
 *
 * @slot - 收折的內容
 * @slot heading - 標題（未提供時使用 `heading` 屬性）
 *
 * @csspart base - 原生 `<details>` 外層容器
 * @csspart summary - 可點擊的標題列（原生 `<summary>`）
 * @csspart heading - 標題文字
 * @csspart icon - 展開指示箭頭
 * @csspart body - 內容容器
 *
 * @fires aui-toggle - 展開狀態改變後觸發（使用者操作或程式設定皆會觸發），`detail.open` 為新狀態；支援 bubbles 與 composed
 */
export class AuiAccordion extends LitElement {
  static override styles = accordionStyles;

  /** 標題文字 */
  @property({ type: String })
  heading = '';

  /** 是否展開 */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** 互斥群組名稱：同一個根節點內同名的手風琴一次只展開一個 */
  @property({ type: String, reflect: true })
  name = '';

  /** 預設排版：`doc`（使用指南）或 `faq`（常見問題） */
  @property({ type: String, reflect: true })
  variant: AccordionVariant = 'doc';

  @query('details')
  private details?: HTMLDetailsElement;

  /** 最近一次以 aui-toggle 通知的狀態，用來避免在狀態沒有實際改變時送出事件 */
  private notifiedOpen?: boolean;

  /** 展開 */
  show(): void {
    this.setOpen(true);
  }

  /** 收合 */
  hide(): void {
    this.setOpen(false);
  }

  /** 切換展開狀態 */
  toggle(): void {
    // 使用者剛點擊標題列時，<details> 已切換但原生 toggle 事件尚未送達，以 <details> 的狀態為準
    this.setOpen(!(this.details?.open ?? this.open));
  }

  /**
   * 將焦點移到標題列。
   * 不使用 delegatesFocus：它會讓點擊內文（例如選取文字）時把焦點移到標題列，內容較長時頁面會捲回頂端。
   */
  override focus(options?: FocusOptions): void {
    const summary = this.shadowRoot?.querySelector('summary');
    if (summary) summary.focus(options);
    else super.focus(options);
  }

  /** 同時更新 open 屬性與 <details>，避免尚未送達的原生 toggle 事件把狀態改回去 */
  private setOpen(open: boolean): void {
    this.open = open;
    if (this.details) this.details.open = open;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.open || !this.name) return;
    // 插入時重新檢查互斥：群組內文件順序較前的項目已展開時，收合被插入的這一個；
    // 否則由這一個保留展開，收合其他項目。以文件順序判斷，結果不受元件升級或插入的時機影響。
    const openMembers = this.groupMembers().filter((other) => other.open);
    const precedes = (other: AuiAccordion) =>
      !!(this.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_PRECEDING);
    if (openMembers.some(precedes)) {
      this.open = false;
    } else {
      for (const other of openMembers) other.open = false;
    }
  }

  /**
   * 原生 toggle：使用者點擊標題列或鍵盤操作時，把 <details> 的狀態同步回 open 屬性。
   * 由程式設定 open 時也會觸發（非同步），此時兩者已一致，不需處理。
   */
  private handleNativeToggle = (): void => {
    if (this.details && this.details.open !== this.open) {
      this.open = this.details.open;
    }
  };

  protected override updated(changed: PropertyValues<this>): void {
    if ((changed.has('open') || changed.has('name')) && this.open && this.name) {
      for (const other of this.groupMembers()) {
        if (other.open) other.open = false;
      }
    }

    if (this.notifiedOpen === undefined) {
      // 首次渲染不視為狀態改變
      this.notifiedOpen = this.open;
    } else if (this.notifiedOpen !== this.open) {
      // 與上次通知的狀態比較：同一輪更新內改了又改回原值時不送出事件
      this.notifiedOpen = this.open;
      this.dispatchEvent(
        new CustomEvent<AccordionToggleDetail>('aui-toggle', {
          detail: { open: this.open },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * 同一個根節點內其他同名的手風琴。
   * 排除祖先與後代：巢狀的手風琴若互相收合，展開內層會把自己所在的外層關掉。
   */
  private groupMembers(): AuiAccordion[] {
    const root = this.getRootNode() as ParentNode;
    return [...root.querySelectorAll<AuiAccordion>('aui-accordion')].filter(
      (other) =>
        other !== this &&
        other.name === this.name &&
        !other.contains(this) &&
        !this.contains(other),
    );
  }

  override render() {
    const variant = ACCORDION_VARIANTS.has(this.variant) ? this.variant : 'doc';

    return html`
      <details
        class=${classMap({ accordion: true, [`accordion--${variant}`]: true })}
        part="base"
        .open=${this.open}
        @toggle=${this.handleNativeToggle}
      >
        <summary class="accordion__summary" part="summary">
          <span class="accordion__heading" part="heading">
            <slot name="heading">${this.heading}</slot>
          </span>
          <svg
            class="accordion__icon"
            part="icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 3.5 4.5 4.5L6 12.5" />
          </svg>
        </summary>
        <div class="accordion__body" part="body">
          <slot></slot>
        </div>
      </details>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-accordion')) {
  customElements.define('aui-accordion', AuiAccordion);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-accordion': AuiAccordion;
  }
}
