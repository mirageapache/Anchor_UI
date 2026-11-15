import { css } from 'lit';

export const favoriteBtnStyles = css`
  :host {
    /* inline-flex：host 的大小等於按鈕本身，不受所在行的字級與行高影響（例如放在大標題旁） */
    display: inline-flex;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 按鈕本體 ─── */
  .fav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: var(--space-xs, 4px);
    margin: 0;
    font: inherit;
    /* 規格為 text-muted；改用 text-secondary，讓未收藏的線條在深色主題的容器（--color-base）上仍達 3:1 */
    color: var(--color-text-secondary, #475569);
    background: transparent;
    border: none;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      color var(--transition-fast, 100ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  /*
   * 已收藏：線條為加深的琥珀色（accent-hover，同規格的 #d97706），填色為 accent。
   * 懸停：規格的線條色 #f59e0b 在白底上對比只有 2.15:1（WCAG 1.4.11 需 3:1），同樣改用 accent-hover。
   */
  .fav-btn.is-favorite {
    color: var(--color-accent-hover, #d97706);
  }

  /* 只在支援懸停的裝置套用：觸控裝置點擊後 :hover 會殘留，取消收藏後仍顯示放大的琥珀色外框 */
  @media (hover: hover) {
    .fav-btn:hover:not(:disabled) {
      color: var(--color-accent-hover, #d97706);
      transform: scale(1.1);
    }
  }

  .fav-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .fav-btn:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .fav-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* ─── 星號圖示 ─── */
  .fav-btn__icon {
    display: block;
    width: 20px;
    height: 20px;
    transition: fill var(--transition-fast, 100ms ease);
  }

  .fav-btn--sm .fav-btn__icon {
    width: 16px;
    height: 16px;
  }

  .fav-btn--lg .fav-btn__icon {
    width: 24px;
    height: 24px;
  }

  /* 已收藏：實心琥珀色 */
  .fav-btn.is-favorite .fav-btn__icon {
    fill: var(--color-accent, #f59e0b);
  }

  /* 切換時的微縮放彈跳以 Web Animations API 播放（見 favorite-btn.ts） */

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .fav-btn,
    .fav-btn__icon {
      transition: none !important;
      transform: none !important;
    }
  }
`;
