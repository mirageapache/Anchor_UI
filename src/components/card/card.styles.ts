import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
    /* 作為 grid / flex 項目時允許縮小，避免超長字串撐破欄寬 */
    min-width: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  /* ─── 卡片本體 ─── */
  .card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
    padding: var(--space-ms, 12px) 18px;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: inherit;
    text-decoration: none;
    background-color: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    transition:
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      transform var(--transition-base, 150ms ease);
  }

  /* ─── HOT 推薦外框 ─── */
  .card--hot {
    border-color: color-mix(
      in srgb,
      var(--color-accent, #f59e0b) 45%,
      var(--color-border, #e2e8f0)
    );
  }

  /* ─── 連結卡片的互動回饋 ─── */
  .card--link {
    cursor: pointer;
  }

  .card--link:hover {
    border-color: var(--color-brand-600, #0f4c81);
    box-shadow: 0 6px 20px -4px color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent);
    transform: translateY(-2px);
  }

  /* HOT 卡片懸停時保留琥珀色外框（加深為實色），不被品牌色蓋過 */
  .card--hot.card--link:hover {
    border-color: var(--color-accent, #f59e0b);
  }

  .card--link:active {
    transform: translateY(0);
  }

  .card--link:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 標題列 ─── */
  .card__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm, 8px);
    min-width: 0;
  }

  .card__name {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: anywhere;
    transition: color var(--transition-fast, 100ms ease);
  }

  /* 使用 brand-text（深色主題為亮色）確保懸停時仍符合對比 */
  .card--link:hover .card__name {
    color: var(--color-brand-text, #0f4c81);
  }

  .card__hot {
    flex: 0 0 auto;
    padding: 1px 6px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-2xs, 0.6875rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-normal, 1.5);
    letter-spacing: 0.04em;
    color: var(--color-warning-text, #92400e);
    background-color: var(--color-warning-dim, rgba(245, 158, 11, 0.14));
    border: 1px solid var(--color-warning-border, rgba(245, 158, 11, 0.3));
    border-radius: var(--radius-sm, 6px);
  }

  /* ─── 簡介描述 ─── */
  .card__desc {
    margin: var(--space-xs, 4px) 0 var(--space-ms, 12px);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: anywhere;
  }

  .card__desc--clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--_aui-card-lines, 2);
    line-clamp: var(--_aui-card-lines, 2);
    overflow: hidden;
  }

  /* ─── 標籤群：貼齊卡片底部，同一列卡片的標籤位置一致 ─── */
  .card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs, 4px);
    margin-top: auto;
  }

  /* 沒有簡介時，標籤群與名稱之間仍保留間距 */
  .card__desc[hidden] + .card__tags {
    padding-top: var(--space-ms, 12px);
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .card,
    .card__name {
      transition: none !important;
    }

    .card--link:hover {
      transform: none !important;
    }
  }
`;
