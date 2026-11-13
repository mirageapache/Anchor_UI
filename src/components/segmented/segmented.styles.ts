import { css } from 'lit';

export const segmentedStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 膠囊軌道 ─── */
  .segmented {
    display: inline-flex;
    gap: 2px;
    box-sizing: border-box;
    max-width: 100%;
    margin: 0;
    padding: 3px;
    background: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .segmented--disabled {
    opacity: 0.5;
  }

  /* ─── 選項 ─── */
  .option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: 32px;
    margin: 0;
    padding: 0 var(--space-ms, 12px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    white-space: nowrap;
    background: transparent;
    border: 0;
    border-radius: var(--radius-md, 8px);
    outline: none;
    cursor: pointer;
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease);
  }

  .option:hover:not(:disabled):not([aria-checked='true']) {
    color: var(--color-text-primary, #0f172a);
  }

  /* 選中態：品牌色實心高亮 */
  .option[aria-checked='true'] {
    font-weight: var(--weight-semibold, 600);
    color: var(--color-on-solid, #ffffff);
    background: var(--color-brand-600, #0f4c81);
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
  }

  .option:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .option:disabled {
    cursor: not-allowed;
  }

  /* 個別停用的選項（整組停用時由軌道統一降低透明度，避免重複疊加） */
  .segmented:not(.segmented--disabled) .option:disabled:not([aria-checked='true']) {
    opacity: 0.5;
  }

  /*
   * 選中時字重變粗會撐寬選項，切換時軌道會跳動；
   * 以隱藏的粗體文字預留寬度（visibility: hidden 不列入無障礙名稱）
   */
  .option__label {
    display: inline-grid;
  }

  .option__label::after {
    content: attr(data-text);
    height: 0;
    overflow: hidden;
    font-weight: var(--weight-semibold, 600);
    visibility: hidden;
  }

  /* ─── 螢幕閱讀器專用文字 ─── */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .segmented,
    .option {
      transition: none;
    }
  }
`;
