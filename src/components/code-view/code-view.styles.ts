import { css } from 'lit';
import { TAB_SIZE } from './fold-ranges.js';

export const codeViewStyles = css`
  /*
   * min-width: 0：作為 flex / grid 項目時，最小寬度預設為內容寬度，最長的一行會把元件撐出容器、
   * 水平捲動失效；歸零後由內部的捲動容器處理過寬的內容
   */
  :host {
    display: block;
    min-width: 0;
  }

  /* ─── 捲動容器 ─── */
  .code-view {
    box-sizing: border-box;
    margin: 0;
    padding: var(--space-sm, 8px) 0;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    tab-size: ${TAB_SIZE}; /* 與摺疊、寬度估算使用同一個值 */
    background: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    overflow: auto;
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .code-view:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /*
   * 內容寬度：行號列 + 最長一行（以 ch 估算，略為高估）。各分段的繪製範圍（paint containment）
   * 以此寬度為界，不設定時畫面外的分段寬度為 0，超出的長行會被裁切、水平捲動範圍也會跳動。
   * 64px = 行號列的左右內距 16px + 間距 4px + 摺疊鈕 14px，加上摺疊後「⋯」與誤差的餘裕；
   * 14px 為程式碼文字的右內距
   */
  .code-view__content {
    min-width: calc(
      var(--aui-code-view-digits) * 1ch + 0.5ch + 64px + var(--aui-code-view-columns) * 1ch + 14px
    );
  }

  /* ─── 分段：瀏覽器略過畫面外分段的排版與繪製，估計高度為行數 × 行高 ─── */
  .code-view__chunk {
    content-visibility: auto;
    contain-intrinsic-block-size: auto calc(var(--aui-code-view-lines) * 1lh);
  }

  /* ─── 每一行 ─── */
  .code-view__line {
    display: flex;
    align-items: flex-start;
  }

  /* 行號列：水平捲動時黏在左側 */
  .code-view__gutter {
    position: sticky;
    left: 0;
    z-index: 1;
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: var(--space-xs, 4px);
    padding: 0 10px 0 6px;
    background: var(--color-surface, #f1f5f9);
    user-select: none;
    transition: background-color var(--transition-theme, 200ms ease);
  }

  /* 行號使用 text-secondary：設計稿的 text-muted 在 surface 底上未達 WCAG AA（淺色 4.3:1、深色 3.1:1） */
  .code-view__number {
    display: inline-block;
    min-width: max(2.5ch, calc(var(--aui-code-view-digits) * 1ch));
    color: var(--color-text-secondary, #475569);
    text-align: right;
  }

  .code-view__fold,
  .code-view__fold-spacer {
    flex: none;
    width: 14px;
    height: 14px;
  }

  .code-view__fold {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: var(--color-text-secondary, #475569);
    background: none;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .code-view__fold:hover {
    color: var(--color-text-primary, #0f172a);
  }

  .code-view__fold:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 0;
  }

  .code-view__fold svg {
    width: 12px;
    height: 12px;
    transform: rotate(90deg); /* 展開時朝下 */
    transition: transform var(--transition-base, 150ms ease);
  }

  .code-view__fold[aria-expanded='false'] svg {
    transform: none; /* 摺疊時朝右 */
  }

  .code-view__code {
    padding-right: 14px;
    white-space: pre;
  }

  /* 摺疊後的「⋯」：提示仍有隱藏內容 */
  .code-view__placeholder {
    flex: none;
    margin-left: -10px;
    padding: 0 6px;
    color: var(--color-text-secondary, #475569);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
    line-height: 1.2;
    user-select: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .code-view,
    .code-view__gutter,
    .code-view__fold svg {
      transition: none;
    }
  }
`;
