import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fieldStyles } from './field.styles.js';
import type { AuiIconButton } from '../icon-button/icon-button.js';
import type { AuiInput } from '../input/input.js';
import type { AuiOutput } from '../output/output.js';
import type { AuiSegmented } from '../segmented/segmented.js';
import '../icon-button/index.js';

/** 可置於欄位內、接收標題與描述的控制項 */
type FieldControl = AuiInput | AuiOutput | AuiSegmented;

const CONTROL_TAGS = new Set(['aui-input', 'aui-output', 'aui-segmented']);

const isInput = (control: FieldControl | null): control is AuiInput =>
  control?.localName === 'aui-input';

/**
 * Anchor UI — Field 元件 (`<aui-field>`)
 *
 * 表單欄位容器：上方標題列（左側標題、右側快捷複製／清除按鈕），下方為控制項與次要描述。
 * 控制項為直接子層的 `<aui-input>`、`<aui-output>` 或 `<aui-segmented>`：標題與描述會傳入控制項，
 * 由其在自身 Shadow DOM 內完成無障礙關聯（IDREF 無法跨 Shadow DOM 邊界）；
 * 畫面上的標題與描述因此對輔助科技隱藏，避免重複朗讀。點擊標題會聚焦控制項。
 *
 * 欄位只註冊自己渲染的 `<aui-icon-button>`；控制項請另行載入（`@anchor-ui/core/input`、`@anchor-ui/core/output`、`@anchor-ui/core/segmented`）。
 *
 * @element aui-field
 *
 * @slot - 欄位控制項，須為直接子層的 `<aui-input>`、`<aui-output>` 或 `<aui-segmented>`
 * @slot actions - 標題列右側的自訂操作鈕（排在內建複製／清除鈕之前）
 *
 * @csspart head - 標題列容器
 * @csspart label - 標題文字
 * @csspart actions - 操作鈕容器
 * @csspart copy-button - 內建複製鈕（`<aui-icon-button>`）
 * @csspart clear-button - 內建清除鈕（`<aui-icon-button>`）
 * @csspart description - 次要描述文字
 *
 * @fires aui-copy - 複製鈕成功複製控制項內容時觸發（來自內建 `<aui-icon-button>`）
 * @fires aui-copy-error - 複製失敗或控制項為空時觸發（來自內建 `<aui-icon-button>`）
 */
export class AuiField extends LitElement {
  static override styles = fieldStyles;

  /**
   * 欄位標題（同時作為控制項的無障礙名稱）
   */
  @property({ type: String })
  label = '';

  /**
   * 次要描述（同時作為控制項的無障礙描述）
   */
  @property({ type: String })
  description = '';

  /**
   * 是否顯示複製鈕（複製控制項目前的值）
   */
  @property({ type: Boolean, reflect: true })
  copyable = false;

  /**
   * 是否顯示清除鈕（清空輸入框並分派 input / change）；
   * 輸入框停用、唯讀，或控制項不是 `<aui-input>` 時停用
   */
  @property({ type: Boolean, reflect: true })
  clearable = false;

  /** 目前關聯的控制項 */
  @state()
  private control: FieldControl | null = null;

  /** 清除鈕是否停用 */
  @state()
  private clearDisabled = true;

  @state()
  private hasSlottedActions = false;

  /** 觀察輸入框的 disabled / readonly 屬性，同步清除鈕狀態 */
  private readonly controlObserver = new MutationObserver(() => this.syncClearDisabled());

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.control) {
      this.observeControl(this.control);
      // 斷開期間的屬性變化不會被觀察到，重新連接時補同步一次
      this.syncClearDisabled();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.controlObserver.disconnect();
  }

  private observeControl(control: FieldControl): void {
    this.controlObserver.observe(control, {
      attributes: true,
      attributeFilter: ['disabled', 'readonly'],
    });
  }

  private syncClearDisabled(): void {
    const control = this.control;
    this.clearDisabled = !isInput(control) || control.disabled || control.readOnly;
  }

  /** 從預設 slot 的元素中找出控制項並建立關聯 */
  private linkControl(candidates: Element[]): void {
    const next =
      candidates.find((el): el is FieldControl => CONTROL_TAGS.has(el.localName)) ?? null;
    if (next === this.control) return;

    // 控制項移出欄位時，撤回由欄位帶入的標題與描述
    const previous = this.control;
    if (previous) {
      if (previous.label === this.label) previous.label = '';
      if (previous.description === this.description) previous.description = '';
    }

    this.controlObserver.disconnect();
    this.control = next;
    if (next) this.observeControl(next);
    this.syncClearDisabled();
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

  /** 於點擊當下讀取控制項的值，避免以程式設定 value 後複製到舊內容 */
  private handleCopy = (event: Event) => {
    const button = event.currentTarget as AuiIconButton;
    button.copyValue = this.control?.value ?? '';
    void button.copy();
  };

  private handleClear = () => {
    const control = this.control;
    if (!isInput(control)) return;
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
    // 只有在標題與描述確實已傳入控制項時，才對輔助科技隱藏畫面上的文字
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
                    ?disabled=${this.clearDisabled}
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
