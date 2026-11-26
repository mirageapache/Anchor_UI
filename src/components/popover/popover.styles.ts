import { css } from 'lit';

export const popoverStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  .popover__trigger {
    display: inline-flex;
    vertical-align: middle;
  }

  /* ─── 面板：原生 Popover API 進入 Top Layer，位置由 @floating-ui/dom 計算 ─── */
  .popover__panel {
    position: fixed;
    inset: unset;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: max-content;
    min-width: 10rem;
    max-width: min(22.5rem, calc(100vw - 16px));
    max-height: calc(100vh - 16px);
    margin: 0;
    padding: var(--space-sm, 8px);
    overflow: auto;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    background-color: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    box-shadow: var(--shadow-popover, 0 4px 12px rgb(0 0 0 / 28%));
    opacity: 0;
    transform: scale(0.95);
    transform-origin: var(--_aui-popover-origin, top left);
    /* 時長來自 motion token；popover.ts 讀取計算後的時長決定何時關閉 popover */
    transition:
      opacity var(--transition-base, 150ms ease),
      transform var(--transition-base, 150ms ease);
  }

  .popover__panel--visible {
    opacity: 1;
    transform: scale(1);
  }

  /* 內容沒有可聚焦元素時焦點落在面板本身：面板不在 Tab 順序中也不可操作，不畫焦點框（同 Modal 面板） */
  .popover__panel:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .popover__panel {
      transition: none !important;
      transform: none !important;
    }
  }
`;
