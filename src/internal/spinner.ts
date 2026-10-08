import { css, html } from 'lit';

/**
 * 載入中 Spinner 圖示（Button 與 IconButton 共用）。
 * 使用端需同時在元件 styles 中加入 spinnerStyles。
 */
export const spinnerIcon = html`
  <svg
    class="aui-spinner"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
  </svg>
`;

export const spinnerStyles = css`
  .aui-spinner {
    animation: aui-spin 0.8s linear infinite;
  }

  @keyframes aui-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* 減少動畫：Spinner 保留但放慢，讓忙碌狀態仍可被感知 */
  @media (prefers-reduced-motion: reduce) {
    .aui-spinner {
      animation-duration: 2s;
    }
  }
`;
