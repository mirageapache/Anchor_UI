import { css } from 'lit';

export const drawerStyles = css`
  :host {
    display: contents;
  }

  /*
   * ─── dialog：撐滿整個視窗的透明層，面板貼齊左側或右側 ───
   * 點擊面板以外的區域即為點擊遮罩（事件目標皆為 dialog 本身）
   */
  .drawer {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    overflow: hidden;
  }

  /*
   * 進場以 @starting-style 定義起始狀態：showModal() 讓 dialog 從 display: none 開始渲染時，
   * 瀏覽器自動從起始樣式轉場到一般樣式。退場則由元件加上 .drawer--leaving，轉場結束後才 close()。
   */

  /* ─── 遮罩：淡入淡出 ─── */
  .drawer::backdrop {
    background: var(--color-backdrop, rgb(15 23 42 / 65%));
    backdrop-filter: blur(2px);
    opacity: 1;
    transition: opacity 200ms ease-out;
  }

  .drawer--leaving::backdrop {
    opacity: 0;
  }

  @starting-style {
    .drawer[open]::backdrop {
      opacity: 0;
    }
  }

  /* ─── 面板：全高，從所在側滑入 ─── */
  .drawer__panel {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: var(--aui-drawer-width, 280px);
    max-width: 85%;
    /* 瀏海與圓角螢幕的安全區域（左右側只需處理所在的一側） */
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    box-shadow: var(--shadow-drawer, 0 8px 30px rgb(0 0 0 / 25%));
    overflow: hidden;
    outline: none;
    transform: none;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer__panel--left {
    left: 0;
    padding-left: env(safe-area-inset-left, 0px);
    border-right: 1px solid var(--color-border, #e2e8f0);
    --aui-drawer-offscreen: -100%;
  }

  .drawer__panel--right {
    right: 0;
    padding-right: env(safe-area-inset-right, 0px);
    border-left: 1px solid var(--color-border, #e2e8f0);
    --aui-drawer-offscreen: 100%;
  }

  .drawer--leaving .drawer__panel {
    transform: translateX(var(--aui-drawer-offscreen));
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  @starting-style {
    .drawer[open] .drawer__panel {
      transform: translateX(var(--aui-drawer-offscreen));
    }
  }

  /* ─── 頁首：與導覽列同高 ─── */
  .drawer__header {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    min-height: var(--nav-height, 64px);
    padding: var(--space-sm, 8px) var(--space-lg, 24px);
    border-bottom: 1px solid var(--color-border, #e2e8f0);
  }

  .drawer__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: break-word;
  }

  .drawer__close {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: 0 calc(var(--space-xs, 4px) * -1) 0 auto;
    padding: 0;
    color: var(--color-text-secondary, #475569);
    background: transparent;
    border: 0;
    border-radius: var(--radius-sm, 6px);
    cursor: pointer;
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  .drawer__close:hover {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  .drawer__close:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .drawer__close svg {
    width: 18px;
    height: 18px;
  }

  /* ─── 內容 ─── */
  .drawer__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    overflow-y: auto;
    overscroll-behavior: contain;
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
  }

  /* ─── 頁尾 ─── */
  .drawer__footer {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    background: var(--color-surface, #f1f5f9);
    border-top: 1px solid var(--color-border, #e2e8f0);
  }

  /* ─── 螢幕閱讀器專用文字（description） ─── */
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

  /* 沒有內容的頁首與頁尾不顯示（須寫在 .drawer__header / .drawer__footer 之後才能覆蓋 display） */
  .drawer__header--empty,
  .drawer__footer--empty {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .drawer::backdrop,
    .drawer__panel,
    .drawer__close {
      transition: none;
    }
  }
`;
