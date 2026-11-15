import { css } from 'lit';

export const headerStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 8px);
    min-width: 0;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
  }

  /* ─── 分類標籤與 HOT 徽標 ─── */
  .header__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xs, 4px);
  }

  /* ─── 標題列：主標題、收藏鈕與右側操作；空間不足時操作換到下一行，不擠壓標題 ─── */
  .header__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--space-sm, 8px);
    min-width: 0;
  }

  /* 標題與收藏鈕為一組，永遠在同一行；標題至少保留 12rem 才與操作並排 */
  .header__title-group {
    display: flex;
    flex: 1 1 12rem;
    align-items: flex-start;
    gap: var(--space-sm, 8px);
    min-width: 0;
  }

  .header__title {
    min-width: 0;
    margin: 0;
    font-size: var(--text-3xl, 1.875rem);
    font-weight: var(--weight-black, 900);
    line-height: var(--leading-tight, 1.25);
    letter-spacing: -0.02em;
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: anywhere;
  }

  /* 收藏鈕對齊標題的第一行（標題換行時不會落在整段的中間）：(第一行行高 − 按鈕高度 32px) / 2 */
  .header__fav {
    flex: 0 0 auto;
    margin-top: calc((var(--text-3xl, 1.875rem) * var(--leading-tight, 1.25) - 32px) / 2);
  }

  /* 右側操作靠右對齊，高度與標題第一行一致以垂直置中 */
  .header__actions {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
    min-height: calc(var(--text-3xl, 1.875rem) * var(--leading-tight, 1.25));
    margin-inline-start: auto;
  }

  /* ─── 簡述文字 ─── */
  .header__desc {
    margin: 0;
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: anywhere;
  }
`;
