import { css } from 'lit';

export const alertStyles = css`
  :host {
    display: contents;
  }

  /* ─── 以 Modal 為外框：較窄、置中、無頁首頁尾 ─── */
  aui-modal::part(panel) {
    max-width: 440px;
  }

  aui-modal::part(body) {
    padding: var(--space-xl, 40px) var(--space-lg, 24px);
    text-align: center;
  }

  /* ─── 狀態圖示（SweetAlert2 風格：圓環與符號依序描繪） ─── */
  .alert__icon {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto var(--space-md, 16px);
    animation: alert-icon-bounce 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .alert__icon--success {
    color: var(--color-success, #10b981);
  }

  .alert__icon--error {
    color: var(--color-danger, #ef4444);
  }

  .alert__icon--warning {
    color: var(--color-warning, #f59e0b);
  }

  .alert__icon--info {
    color: var(--color-info, #0284c7);
  }

  .alert__icon svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* pathLength="1" 讓描繪動畫不必依賴實際路徑長度 */
  .alert__ring,
  .alert__glyph {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .alert__ring {
    animation: alert-draw 400ms ease-out both;
  }

  .alert__glyph {
    animation: alert-draw 300ms ease-out 250ms both;
  }

  /* ─── 文字 ─── */
  .alert__title {
    margin: 0 0 var(--space-xs, 4px);
    font-size: var(--text-xl, 1.25rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: break-word;
  }

  .alert__message {
    margin: 0 0 var(--space-lg, 24px);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  .alert__message--empty {
    display: none;
  }

  .alert__input {
    margin-bottom: var(--space-lg, 24px);
    text-align: start;
  }

  .alert__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm, 8px);
  }

  @keyframes alert-icon-bounce {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    70% {
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes alert-draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  /* ─── 無障礙動態降級：直接顯示完成狀態 ─── */
  @media (prefers-reduced-motion: reduce) {
    .alert__icon,
    .alert__ring,
    .alert__glyph {
      animation: none;
    }
  }
`;
