import { css } from 'lit';

// plain 排版（CSS 註解會隨產物發布，說明寫在這裡）：嵌入側欄等已有外框的容器作為可收合選單，
// 不畫外框、背景與分隔線。內距放在標題列上，點擊範圍至少 24px 高（WCAG 2.5.8）；
// 外側沒有內距，焦點框改畫在內側（outline-offset: -2px），避免被側欄等捲動容器裁切；
// 內容的左右內距與標題列相同，與標題文字對齊。
export const accordionStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 外層容器（原生 details） ─── */
  .accordion {
    box-sizing: border-box;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-primary, #0f172a);
    background-color: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    transition: border-color var(--transition-base, 150ms ease);
  }

  /* 展開時外框高亮 */
  .accordion[open] {
    border-color: var(--color-brand-border, rgba(15, 76, 129, 0.25));
  }

  /* ─── 預設排版 ─── */
  .accordion--doc {
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    border-radius: var(--radius-lg, 12px);
  }

  .accordion--faq {
    padding: var(--space-ms, 12px) var(--space-md, 16px);
    border-radius: var(--radius-md, 8px);
  }

  /* plain：無外框（側欄選單） */
  .accordion--plain {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
  }

  .accordion--plain .accordion__summary {
    padding: var(--space-xs, 4px);
  }

  .accordion--plain .accordion__summary:focus-visible {
    outline-offset: -2px;
  }

  /* ─── 標題列（原生 summary） ─── */
  .accordion__summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm, 8px);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    list-style: none; /* 移除原生的展開標記，改用自訂箭頭 */
    cursor: pointer;
    user-select: none;
    border-radius: var(--radius-sm, 6px);
    transition: color var(--transition-fast, 100ms ease);
  }

  .accordion__summary::-webkit-details-marker {
    display: none;
  }

  .accordion--faq .accordion__summary,
  .accordion--plain .accordion__summary {
    font-weight: var(--weight-semibold, 600);
  }

  /* 使用 brand-text（深色主題為亮色）確保懸停時仍符合對比 */
  .accordion__summary:hover {
    color: var(--color-brand-text, #0f4c81);
  }

  .accordion__summary:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .accordion__heading {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  /* ─── 展開指示箭頭：收合時朝右，展開時旋轉朝下 ─── */
  .accordion__icon {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    color: var(--color-text-secondary, #475569);
    transition: transform var(--transition-base, 150ms ease);
  }

  .accordion__summary:hover .accordion__icon {
    color: inherit;
  }

  .accordion[open] .accordion__icon {
    transform: rotate(90deg);
  }

  /* ─── 內容 ─── */
  .accordion__body {
    margin-top: var(--space-md, 16px);
    padding-top: var(--space-sm, 8px);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    border-top: 1px dashed var(--color-border, #e2e8f0);
    overflow-wrap: anywhere;
  }

  .accordion--faq .accordion__body {
    margin-top: var(--space-ms, 12px);
  }

  .accordion--plain .accordion__body {
    margin-top: 0;
    padding: 0 var(--space-xs, 4px) var(--space-xs, 4px);
    border-top: none;
  }

  /* 內容（預設 slot）中的段落與清單：預設間距與縮排層次；不套用到 heading slot */
  slot:not([name])::slotted(p),
  slot:not([name])::slotted(ul),
  slot:not([name])::slotted(ol) {
    margin: 0 0 var(--space-sm, 8px);
  }

  slot:not([name])::slotted(ul),
  slot:not([name])::slotted(ol) {
    padding-inline-start: var(--space-lg, 24px);
  }

  slot:not([name])::slotted(:last-child) {
    margin-bottom: 0;
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .accordion,
    .accordion__summary,
    .accordion__icon {
      transition: none !important;
    }
  }
`;
