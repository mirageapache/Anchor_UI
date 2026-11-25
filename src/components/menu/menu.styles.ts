import { css } from 'lit';

export const menuStyles = css`
  .popover__panel {
    padding: var(--space-xs, 4px);
  }

  /* ─── 選單項目：面板的直接子元素（button、a 等），統一外觀 ─── */
  ::slotted(:not(hr)) {
    display: flex;
    align-items: center;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: var(--space-xs, 4px) var(--space-sm, 8px);
    font: inherit;
    line-height: var(--leading-normal, 1.5);
    color: inherit;
    text-align: start;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm, 6px);
  }

  ::slotted(:not(hr):hover),
  ::slotted(:not(hr):focus) {
    background-color: var(--color-surface, #f1f5f9);
  }

  ::slotted(:not(hr):focus-visible) {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: -2px;
  }

  ::slotted([aria-disabled='true']) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* 分隔線 */
  ::slotted(hr) {
    margin: var(--space-xs, 4px) 0;
    border: none;
    border-top: 1px solid var(--color-border, #e2e8f0);
  }
`;
