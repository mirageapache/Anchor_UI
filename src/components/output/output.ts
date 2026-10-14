import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { outputStyles } from './output.styles.js';
import type { OutputStatus } from './output.types.js';

/** 各狀態的圖示與螢幕閱讀器前綴文字：狀態不只依賴顏色傳達 */
const STATUS: Record<OutputStatus, { text: string; icon: TemplateResult }> = {
  success: {
    text: '成功',
    icon: html`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="16 9 10.5 15 8 12.5"></polyline>
      </svg>
    `,
  },
  warning: {
    text: '警告',
    icon: html`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        ></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `,
  },
  error: {
    text: '錯誤',
    icon: html`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `,
  },
};

/**
 * Anchor UI — Output 元件 (`<aui-output>`)
 *
 * 展示運算或轉換結果的等寬文字框，左側帶 4px 語意邊條（翠綠成功／琥珀警告／珊瑚紅錯誤）。
 * 長文字保留換行並可於任意位置斷行，不產生橫向溢位。
 * 狀態除顏色外，另以圖示與螢幕閱讀器前綴文字（「成功：」／「警告：」／「錯誤：」）傳達；
 * 結果框為 `role="status"` 的 live region，結果更新時以禮貌模式播報，不打斷使用者輸入。
 * 沒有內容時顯示 `placeholder`，不套用狀態。
 *
 * 可置於 `<aui-field>` 內，由 field 帶入標題與描述並提供複製鈕。
 *
 * @element aui-output
 *
 * @csspart base - 結果框容器（live region）
 * @csspart icon - 狀態圖示
 * @csspart text - 結果文字（或 placeholder）
 */
export class AuiOutput extends LitElement {
  static override styles = outputStyles;

  /**
   * 結果文字（保留換行與空白）
   */
  @property({ type: String })
  value = '';

  /**
   * 結果狀態
   */
  @property({ type: String, reflect: true })
  status: OutputStatus = 'success';

  /**
   * 沒有結果時顯示的提示文字
   */
  @property({ type: String })
  placeholder = '';

  /**
   * 無障礙名稱（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的標題自動帶入
   */
  @property({ type: String })
  label = '';

  /**
   * 無障礙描述（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的描述自動帶入
   */
  @property({ type: String })
  description = '';

  override render() {
    const hasValue = this.value !== '';
    const status = STATUS[this.status] ? this.status : 'success';

    return html`
      <div
        part="base"
        class=${classMap({
          output: true,
          [`output--${status}`]: hasValue && status !== 'success',
          'output--empty': !hasValue,
        })}
        role="status"
        aria-label=${ifDefined(this.label || undefined)}
        aria-describedby=${ifDefined(this.description ? 'description' : undefined)}
      >
        <div class="output__body">
          ${
            hasValue
              ? html`
                  <span part="icon" class="output__icon" aria-hidden="true">
                    ${STATUS[status].icon}
                  </span>
                  <span class="sr-only">${STATUS[status].text}：</span>
                `
              : nothing
          }
          <span part="text" class="output__text">${hasValue ? this.value : this.placeholder}</span>
        </div>
      </div>
      ${
        this.description
          ? html`<span id="description" class="sr-only">${this.description}</span>`
          : nothing
      }
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-output')) {
  customElements.define('aui-output', AuiOutput);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-output': AuiOutput;
  }
}
