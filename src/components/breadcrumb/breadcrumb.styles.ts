import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* 以行內文字排列：空間不足時像句子一樣換行，過長的名稱在字內斷行 */
  .breadcrumb__list {
    display: block;
    margin: 0;
    padding: 0;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    list-style: none;
  }

  /* 中文名稱不在字與字之間斷行（優先在分隔符號前後換行）；過長的英文字串仍可斷行 */
  .breadcrumb__item {
    display: inline;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  /* 可被選取：複製整條路徑時保留層級之間的「 / 」 */
  .breadcrumb__separator {
    color: var(--color-text-muted, #64748b);
  }

  .breadcrumb__link {
    color: inherit;
    text-decoration: none;
    border-radius: var(--radius-sm, 6px);
    transition: color var(--transition-fast, 100ms ease);
  }

  .breadcrumb__link:hover {
    color: var(--color-brand-text, #0f4c81);
    text-decoration: underline;
  }

  .breadcrumb__link:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* 目前頁面（是連結時懸停也維持原本的顏色） */
  [aria-current='page'],
  .breadcrumb__link[aria-current='page']:hover {
    font-weight: var(--weight-medium, 500);
    color: var(--color-text-primary, #0f172a);
  }

  @media (prefers-reduced-motion: reduce) {
    .breadcrumb__link {
      transition: none;
    }
  }
`;
