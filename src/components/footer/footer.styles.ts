import { css } from 'lit';

export const footerStyles = css`
  /*
   * host 作為 container query 的容器：響應式斷點依 Footer 自身寬度判斷。
   * inline-size containment 讓 host 的內容寬度視為 0，因此明確撐滿容器寬度；
   * margin-top: auto 讓它在 flex 直向排列的頁面容器中被推到底部
   */
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin-top: auto;
    container: aui-footer / inline-size;
  }

  [hidden] {
    display: none !important;
  }

  /*
   * 文字使用 text-secondary：設計稿的 text-muted 在 surface 底上對比約 4.4:1，未達 WCAG AA
   */
  .footer {
    box-sizing: border-box;
    padding-block: var(--space-md, 16px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    background: var(--color-surface, #f1f5f9);
    border-top: 1px solid var(--color-border, #e2e8f0);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .footer--columns {
    padding-block: var(--space-xl, 40px) var(--space-md, 16px);
  }

  .footer__inner {
    max-width: var(--layout-max-width, 1600px);
    margin-inline: auto;
    padding-inline: var(--layout-gutter, 24px);
  }

  /* ─── 多欄導覽 ─── */
  .footer__columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-lg, 24px);
    margin-bottom: var(--space-lg, 24px);
  }

  .footer__column-heading {
    margin: 0 0 var(--space-sm, 8px);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
  }

  .footer__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs, 4px);
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--text-sm, 0.875rem);
  }

  /* ─── 版權列 ─── */
  .footer__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px) var(--space-md, 16px);
  }

  .footer--columns .footer__bottom {
    padding-top: var(--space-md, 16px);
    border-top: 1px solid var(--color-border, #e2e8f0);
  }

  .footer__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
    margin-right: auto;
  }

  .footer__copyright {
    margin: 0;
  }

  .footer__version {
    padding: 1px 6px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #475569);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
  }

  .footer__links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-md, 16px);
  }

  .footer__social {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
  }

  /* ─── 連結：多欄內為元件渲染的 <a>，次要選單與社群連結為 slot 的直接子元素 ─── */
  .footer__list a,
  ::slotted(a) {
    color: var(--color-text-secondary, #475569);
    text-decoration: none;
    border-radius: var(--radius-sm, 6px);
    transition: color var(--transition-base, 150ms ease);
  }

  .footer__list a:hover,
  ::slotted(a:hover) {
    color: var(--color-brand-text, #0f4c81);
    text-decoration: underline;
  }

  .footer__list a:focus-visible,
  ::slotted(a:focus-visible) {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .footer__social ::slotted(a) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    min-height: 32px;
  }

  /* ─── 螢幕閱讀器專用文字（外部連結提示） ─── */
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

  /* ─── 窄版：版權列直向堆疊 ─── */
  @container aui-footer (width < 640px) {
    .footer__inner {
      padding-inline: var(--space-md, 16px);
    }

    .footer__bottom {
      flex-direction: column;
      align-items: flex-start;
    }

    .footer__meta {
      margin-right: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .footer,
    .footer__list a,
    ::slotted(a) {
      transition: none;
    }
  }
`;
