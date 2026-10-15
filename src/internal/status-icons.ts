import { html, svg, type SVGTemplateResult, type TemplateResult } from 'lit';

/**
 * 語意狀態圖示（Output、Toast 共用）：24×24、描邊、顏色繼承 currentColor。
 * 圖示僅為視覺輔助，使用端須加上 aria-hidden，並以 STATUS_TEXT 提供文字讓狀態不只依賴圖示與顏色。
 */
export type StatusIconName = 'success' | 'warning' | 'error' | 'info';

/** 內部圖形須以 svg 標籤建立：以 html 建立的 <circle> 等屬於 HTML 命名空間，瀏覽器不會繪製 */
const icon = (content: SVGTemplateResult) => html`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${content}
  </svg>
`;

export const STATUS_ICONS: Record<StatusIconName, TemplateResult> = {
  success: icon(svg`
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="16 9 10.5 15 8 12.5"></polyline>
  `),
  warning: icon(svg`
    <path
      d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    ></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  `),
  error: icon(svg`
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  `),
  info: icon(svg`
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  `),
};

/** 狀態的文字（螢幕閱讀器前綴等） */
export const STATUS_TEXT: Record<StatusIconName, string> = {
  success: '成功',
  warning: '警告',
  error: '錯誤',
  info: '資訊',
};
