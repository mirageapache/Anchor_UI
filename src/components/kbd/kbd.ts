import { LitElement, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { kbdStyles } from './kbd.styles.js';
import type { KbdSize } from './kbd.types.js';

/** 有效的尺寸；其他值（例如 HTML 屬性寫錯）視為 md */
const KBD_SIZES = new Set<KbdSize>(['sm', 'md']);

/**
 * Anchor UI — Kbd 元件 (`<aui-kbd>`)
 *
 * 內嵌於介面中標註快捷鍵的鍵帽（如 `⌘K`、`Ctrl`、`Enter`），等寬字體搭配微立體邊框。
 * 純展示用，內部以原生 `<kbd>` 呈現，保留「鍵盤輸入」的語意。
 *
 * 組合鍵可以每個按鍵各用一個 `<aui-kbd>`，以文字的「+」連接（`<aui-kbd>Ctrl</aui-kbd> + <aui-kbd>C</aui-kbd>`），
 * 空間有限時（如按鈕內）也可以合併為一個鍵帽（`⌘K`）。
 *
 * 螢幕閱讀器不一定會讀出符號（如 `⌘`、`⇧`、`↵`）：內容含符號時請以 `label` 提供按鍵名稱
 * （`<aui-kbd label="Command K">⌘K</aui-kbd>`）。畫面仍顯示符號；對輔助科技而言，
 * 元件成為一個以 `label` 命名的圖像（`role="img"`），符號不再被讀出。
 * 請使用 `label` 而不是直接在 `<aui-kbd>` 上寫 `aria-label`：沒有角色的元素不允許使用 `aria-label`。
 *
 * @element aui-kbd
 *
 * @slot - 按鍵名稱或符號
 *
 * @csspart base - 內部的原生 `<kbd>`
 */
export class AuiKbd extends LitElement {
  static override styles = kbdStyles;

  /** 尺寸規格：`sm` 用於按鈕、選單等緊湊的位置 */
  @property({ type: String, reflect: true })
  size: KbdSize = 'md';

  /** 供輔助科技讀出的按鍵名稱：設定後輔助科技改讀此名稱，畫面仍顯示 slot 內容（用於含符號的按鍵，如 `⌘` → `Command`） */
  @property({ type: String })
  label = '';

  /** 不支援 ElementInternals 的環境（如 happy-dom）為 null，改以 host 的屬性提供語意 */
  private internals: ElementInternals | null;

  constructor() {
    super();
    // attachInternals 只能在建構時呼叫
    this.internals = typeof this.attachInternals === 'function' ? this.attachInternals() : null;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('label')) this.applyLabel();
  }

  /**
   * 設定 label 時，讓元件成為以 label 命名的圖像：role="img" 的子內容（slot 內的符號）不會被讀出。
   *
   * 不採用「以 aria-hidden 隱藏 slot、另外放一段視覺隱藏的文字」的做法：
   * aria-hidden 加在 Shadow DOM 內包住 <slot> 的元素上時，slot 內的 light DOM 內容仍會被算進外層控制項的名稱
   * （實測 <button>Search <aui-kbd label="Command K">⌘K</aui-kbd></button> 會被讀成「Search ⌘K Command K」）。
   *
   * 優先透過 ElementInternals 設定預設語意，不在使用端的標籤上增加屬性。
   */
  private applyLabel(): void {
    // 只含空白的 label 視為未設定；框架可能綁定 null / undefined
    const label = (this.label ?? '').trim();
    if (this.internals) {
      this.internals.role = label ? 'img' : null;
      this.internals.ariaLabel = label || null;
      return;
    }
    if (label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
  }

  override render() {
    const size = KBD_SIZES.has(this.size) ? this.size : 'md';
    // 範本刻意不留空白：元件內嵌在文字中使用，縮排產生的空白會變成鍵帽內外多餘的間距
    return html`<kbd class=${classMap({ kbd: true, [`kbd--${size}`]: true })} part="base"
      ><slot></slot
    ></kbd>`;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-kbd')) {
  customElements.define('aui-kbd', AuiKbd);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-kbd': AuiKbd;
  }
}
