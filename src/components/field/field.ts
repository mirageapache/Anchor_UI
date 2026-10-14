import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fieldStyles } from './field.styles.js';
import type { AuiIconButton } from '../icon-button/icon-button.js';
import type { AuiInput } from '../input/input.js';
import '../icon-button/index.js';
import '../input/index.js';

/**
 * Anchor UI — Field 元件 (`<aui-field>`)
 *
 * 表單欄位容器：上方標題列（左側標題、右側快捷複製／清除按鈕），下方為輸入框與次要描述。
 * 標題與描述會傳入直接子層的 `<aui-input>`，由 input 在自身 Shadow DOM 內完成無障礙關聯
 * （IDREF 無法跨 Shadow DOM 邊界）；畫面上的標題與描述因此對輔助科技隱藏，避免重複朗讀。
 * 點擊標題會聚焦輸入框。
 *
 * @element aui-field
 *
 * @slot - 欄位輸入框，須為直接子層的 `<aui-input>`
 * @slot actions - 標題列右側的自訂操作鈕（排在內建複製／清除鈕之前）
 *
 * @csspart head - 標題列容器
 * @csspart label - 標題文字
 * @csspart actions - 操作鈕容器
 * @csspart copy-button - 內建複製鈕（`<aui-icon-button>`）
 * @csspart clear-button - 內建清除鈕（`<aui-icon-button>`）
 * @csspart description - 次要描述文字
 *
 * @fires aui-copy - 複製鈕成功複製輸入框內容時觸發（來自內建 `<aui-icon-button>`）
 * @fires aui-copy-error - 複製失敗或輸入框為空時觸發（來自內建 `<aui-icon-button>`）
 */
export class AuiField extends LitElement {
  static override styles = fieldStyles;

  /**
   * 欄位標題（同時作為輸入框的無障礙名稱）
   */
  @property({ type: String })
  label = '';

  /**
   * 次要描述（同時作為輸入框的無障礙描述）
   */
  @property({ type: String })
  description = '';

  /**
   * 是否顯示複製鈕（複製輸入框目前的值）
   */
  @property({ type: Boolean, reflect: true })
  copyable = false;

  /**
   * 是否顯示清除鈕（清空輸入框並分派 input / change；輸入框停用或唯讀時停用）
   */
  @property({ type: Boolean, reflect: true })
  clearable = false;

  /** 目前關聯的輸入框 */
  @state()
  private control: AuiInput | null = null;

  /** 輸入框是否停用或唯讀（決定清除鈕是否可用） */
  @state()
  private controlLocked = false;

  @state()
  private hasSlottedActions = false;

  /** 觀察輸入框的 disabled / readonly 屬性，同步清除鈕狀態 */
  private readonly controlObserver = new MutationObserver(() => this.syncControlLocked());

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.control) {
      this.observeControl(this.control);
      // 斷開期間的屬性變化不會被觀察到，重新連接時補同步一次
      this.syncControlLocked();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.controlObserver.disconnect();
  }

  private observeControl(control: AuiInput): void {
    this.controlObserver.observe(control, {
      attributes: true,
      attributeFilter: ['disabled', 'readonly'],
    });
  }

  private syncControlLocked(): void {
    const control = this.control;
    this.controlLocked = Boolean(control && (control.disabled || control.readOnly));
  }

  /** 從預設 slot 的元素中找出輸入框並建立關聯 */
  private linkControl(candidates: Element[]): void {
    const next = candidates.find((el): el is AuiInput => el.localName === 'aui-input') ?? null;
    if (next === this.control) return;

    // 輸入框移出欄位時，撤回由欄位帶入的標題與描述
    const previous = this.control;
    if (previous) {
      if (previous.label === this.label) previous.label = '';
      if (previous.description === this.description) previous.description = '';
    }

    this.controlObserver.disconnect();
    this.control = next;
    if (next) this.observeControl(next);
    this.syncControlLocked();
  }

  private handleDefaultSlotChange = (event: Event) => {
    this.linkControl((event.target as HTMLSlotElement).assignedElements({ flatten: true }));
  };

  private handleActionsSlotChange = (event: Event) => {
    this.hasSlottedActions = (event.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  override willUpdate(): void {
    // 首次渲染前直接由子元素建立關聯：不依賴首次 slotchange（部分環境如 happy-dom 不會分派），
    // 也避免渲染後才改變狀態而多一次更新
    if (!this.hasUpdated) {
      const children = [...this.children];
      this.hasSlottedActions = children.some((el) => el.slot === 'actions');
      this.linkControl(children.filter((el) => !el.slot));
    }
  }

  private handleLabelClick = () => {
    this.control?.focus();
  };

  /** 於點擊當下讀取輸入框的值，避免以程式設定 value 後複製到舊內容 */
  private handleCopy = (event: Event) => {
    const button = event.currentTarget as AuiIconButton;
    button.copyValue = this.control?.value ?? '';
    void button.copy();
  };

  private handleClear = () => {
    const control = this.control;
    if (!control) return;
    control.clear();
    control.focus();
  };

  override updated(changed: PropertyValues): void {
    const control = this.control;
    if (control && (changed.has('control') || changed.has('label') || changed.has('description'))) {
      control.label = this.label;
      control.description = this.description;
    }
  }

  override render() {
    // 只有在標題與描述確實已傳入輸入框時，才對輔助科技隱藏畫面上的文字
    const hiddenFromAt = this.control ? 'true' : undefined;
    const hasHead =
      Boolean(this.label) || this.copyable || this.clearable || this.hasSlottedActions;
    const target = this.label ? ` ${this.label}` : '';

    return html`
      <div part="head" class=${classMap({ field__head: true, 'field__head--empty': !hasHead })}>
        ${
          this.label
            ? html`
                <span
                  part="label"
                  class="field__label"
                  aria-hidden=${ifDefined(hiddenFromAt)}
                  @click=${this.handleLabelClick}
                  >${this.label}</span
                >
              `
            : nothing
        }
        <div part="actions" class="field__actions">
          <slot name="actions" @slotchange=${this.handleActionsSlotChange}></slot>
          ${
            this.copyable
              ? html`
                  <aui-icon-button
                    part="copy-button"
                    preset="copy"
                    action="custom"
                    label=${`複製${target}`}
                    success-tooltip="已複製！"
                    @click=${this.handleCopy}
                  ></aui-icon-button>
                `
              : nothing
          }
          ${
            this.clearable
              ? html`
                  <aui-icon-button
                    part="clear-button"
                    preset="close"
                    tooltip="清除"
                    label=${`清除${target}`}
                    ?disabled=${this.controlLocked}
                    @click=${this.handleClear}
                  ></aui-icon-button>
                `
              : nothing
          }
        </div>
      </div>
      <slot @slotchange=${this.handleDefaultSlotChange}></slot>
      ${
        this.description
          ? html`
              <div
                part="description"
                class="field__description"
                aria-hidden=${ifDefined(hiddenFromAt)}
              >
                ${this.description}
              </div>
            `
          : nothing
      }
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-field')) {
  customElements.define('aui-field', AuiField);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-field': AuiField;
  }
}
