import { css } from 'lit';

export const modalStyles = css`
  :host {
    display: contents;
  }

  /*
   * ─── dialog：撐滿整個視窗的透明層，面板置中 ───
   * 點擊面板以外的區域即為點擊遮罩（事件目標皆為 dialog 本身）
   */
  .modal {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: var(--space-md, 16px);
    color: inherit;
    background: transparent;
    border: 0;
    overflow: hidden;
  }

  .modal[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ─── 遮罩：模糊背景，淡入淡出 ─── */
  .modal::backdrop {
    background: var(--color-backdrop, rgb(15 23 42 / 65%));
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 180ms ease-out;
  }

  .modal--visible::backdrop {
    opacity: 1;
  }

  /* ─── 面板：縮放彈出 ─── */
  .modal__panel {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    max-height: 100%;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-xl, 16px);
    box-shadow: var(--shadow-modal, 0 25px 50px -12px rgb(0 0 0 / 35%));
    overflow: hidden;
    outline: none;
    opacity: 0;
    transform: scale(0.95) translateY(8px);
    transition:
      opacity 180ms ease-out,
      transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal--visible .modal__panel {
    opacity: 1;
    transform: none;
  }

  .modal__panel--sm {
    max-width: 420px;
  }

  .modal__panel--md {
    max-width: 600px;
  }

  .modal__panel--lg {
    max-width: 840px;
  }

  /* ─── 頁首 ─── */
  .modal__header {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--space-sm, 8px);
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    border-bottom: 1px solid var(--color-border, #e2e8f0);
  }

  .modal__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: var(--text-lg, 1.125rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: break-word;
  }

  .modal__close {
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

  .modal__close:hover {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  .modal__close:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .modal__close svg {
    width: 18px;
    height: 18px;
  }

  /* ─── 內容 ─── */
  .modal__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--space-lg, 24px);
    overflow-y: auto;
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
  }

  /* ─── 頁尾 ─── */
  .modal__footer {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
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

  /* 沒有內容的頁首與頁尾不顯示（須寫在 .modal__header / .modal__footer 之後才能覆蓋 display） */
  .modal__header--empty,
  .modal__footer--empty {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .modal::backdrop,
    .modal__panel,
    .modal__close {
      transition: none;
    }

    .modal__panel {
      transform: none;
    }
  }
`;
