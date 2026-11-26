import { css } from 'lit';

export const navbarStyles = css`
  /*
   * host 即吸附的元素（sticky 以 host 在頁面中的位置計算），並作為 container query 的容器：
   * 響應式斷點依 Navbar 自身寬度判斷，嵌入側欄或窄欄位時也能正確切換。
   * inline-size containment 讓 host 的內容寬度視為 0：放在 flex / inline-block 等依內容決定寬度的容器中
   * 會縮成一團，因此明確撐滿容器寬度
   */
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
    container: aui-navbar / inline-size;
  }

  :host([position='fixed']) {
    position: fixed;
    right: 0;
    left: 0;
  }

  :host([position='static']) {
    position: static;
  }

  [hidden] {
    display: none !important;
  }

  .navbar {
    box-sizing: border-box;
    height: var(--nav-height, 64px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    border-bottom: 1px solid var(--color-border, #e2e8f0);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease),
      box-shadow var(--transition-base, 150ms ease);
  }

  /* 頁面捲動後（吸附中）顯示陰影，與內容區分層 */
  :host(:not([position='static'])) .navbar--scrolled {
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  .navbar__inner {
    display: flex;
    align-items: center;
    gap: var(--space-md, 16px);
    box-sizing: border-box;
    height: 100%;
    max-width: var(--layout-max-width, 1600px);
    margin-inline: auto;
    padding-inline: var(--layout-gutter, 24px);
  }

  /* ─── 圖示按鈕（漢堡選單、主題開關） ─── */
  .navbar__icon-button {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    color: var(--color-text-secondary, #475569);
    background: transparent;
    border: 0;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  /*
   * 滑過 / 目前頁面的底色以文字色混出，而不是 --color-surface：深色主題中 --color-surface 與
   * 導覽列的底色（--color-base）相同，底色完全看不出來
   */
  .navbar__icon-button:hover {
    color: var(--color-text-primary, #0f172a);
    background: color-mix(in srgb, currentColor 8%, transparent);
  }

  .navbar__icon-button svg,
  .navbar__search svg {
    flex: none;
    width: 18px;
    height: 18px;
  }

  /* 寬版不顯示漢堡選單鈕（窄版見下方 container query）；抽屜是唯一的選單時例外 */
  .navbar__menu:not(.navbar__menu--always) {
    display: none;
  }

  /* ─── 品牌 ─── */
  .navbar__brand {
    display: inline-flex;
    flex: 0 1 auto;
    min-width: 0;
    align-items: center;
    gap: 10px;
    color: inherit;
    text-decoration: none;
    border-radius: var(--radius-md, 8px);
  }

  .navbar__logo {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-bold, 700);
    color: var(--color-on-solid, #ffffff);
    background: var(--color-brand-600, #0f4c81);
    border-radius: var(--radius-md, 8px);
  }

  .navbar__logo ::slotted(img),
  .navbar__logo ::slotted(svg) {
    max-width: 24px;
    max-height: 24px;
  }

  /* Accent 亮點圓點 */
  .navbar__dot {
    position: absolute;
    right: -2px;
    bottom: -2px;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    background: var(--color-accent, #f59e0b);
    border: 2px solid var(--color-brand-600, #0f4c81);
    border-radius: 50%;
  }

  .navbar__title {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─── 導覽選單 ─── */
  .navbar__nav {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: var(--space-xs, 4px);
    min-width: 0;
  }

  .navbar__nav ::slotted(a) {
    padding: 6px 10px;
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--color-text-secondary, #475569);
    text-decoration: none;
    white-space: nowrap;
    border-radius: var(--radius-sm, 6px);
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  .navbar__nav ::slotted(a:hover),
  .navbar__nav ::slotted(a[aria-current='page']) {
    color: var(--color-text-primary, #0f172a);
    background: color-mix(in srgb, currentColor 8%, transparent);
  }

  /* ─── 右側操作 ─── */
  .navbar__actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--space-sm, 8px);
    margin-left: auto;
  }

  .navbar__search {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    min-width: 200px;
    min-height: 36px;
    padding: 0 6px 0 12px;
    font: inherit;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #475569);
    background: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      border-color var(--transition-base, 150ms ease),
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  .navbar__search:hover {
    color: var(--color-text-primary, #0f172a);
    border-color: var(--color-brand-500, #1b6ca8);
  }

  .navbar__search-text {
    flex: 1;
    text-align: left;
  }

  .navbar__icon-button:focus-visible,
  .navbar__search:focus-visible,
  .navbar__brand:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 窄版：隱藏導覽選單、顯示漢堡鈕，搜尋鈕只留圖示 ─── */
  @container aui-navbar (width < 768px) {
    .navbar__inner {
      gap: var(--space-sm, 8px);
      padding-inline: var(--space-md, 16px);
    }

    .navbar__nav {
      display: none;
    }

    /* 窄版多為觸控裝置：圖示按鈕放大為 44×44px 觸控目標（漢堡鈕的規範下限） */
    .navbar__icon-button,
    .navbar__search {
      width: 44px;
      height: 44px;
    }

    /* 與寬版的隱藏規則相同的選擇器（特異性），才能覆蓋 */
    .navbar__menu:not(.navbar__menu--always) {
      display: inline-flex;
    }

    .navbar__menu {
      margin-left: -10px;
    }

    .navbar__search {
      justify-content: center;
      min-width: 0;
      padding: 0;
    }

    .navbar__search-text,
    .navbar__kbd {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .navbar,
    .navbar__icon-button,
    .navbar__search,
    .navbar__nav ::slotted(a) {
      transition: none;
    }
  }
`;
