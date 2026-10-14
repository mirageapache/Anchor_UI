import { css } from 'lit';

export const fieldStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 標題列：左側標題、右側快捷操作鈕 ─── */
  .field__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm, 8px);
    min-height: 32px; /* 保持包含操作鈕時高度一致，避免晃動 */
    margin-bottom: var(--space-xs, 4px);
  }

  .field__head--empty {
    display: none;
  }

  .field__label {
    display: block;
    min-width: 0;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-normal, 1.5);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
    transition: color var(--transition-theme, 200ms ease);
  }

  .field__actions {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: var(--space-xs, 4px);
    margin-left: auto;
  }

  /* ─── 次要描述 ─── */
  .field__description {
    margin-top: var(--space-xs, 4px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
    transition: color var(--transition-theme, 200ms ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .field__label,
    .field__description {
      transition: none;
    }
  }
`;
