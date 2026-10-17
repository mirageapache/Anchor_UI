import { css } from 'lit';

/** 通知卡片 <aui-toast> */
export const toastStyles = css`
  :host {
    display: block;
    pointer-events: auto;
  }

  :host([hidden]) {
    display: none !important;
  }

  .toast {
    display: flex;
    align-items: flex-start;
    gap: var(--space-ms, 12px);
    box-sizing: border-box;
    width: 100%;
    padding: 12px 14px;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    text-align: start;
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    box-shadow: var(--shadow-toast, 0 10px 25px -5px rgb(0 0 0 / 15%));
    animation: toast-slide-in 220ms cubic-bezier(0.16, 1, 0.3, 1);
    transition:
      opacity 150ms ease-in,
      transform 150ms ease-in;
  }

  /* 已完成進場：之後被移動（例如隨 Modal 移入其子樹）時不再重播進場動畫 */
  .toast--entered {
    animation: none;
  }

  /* 退場：淡出並往右滑出 */
  :host([leaving]) .toast {
    opacity: 0;
    transform: translateX(16px) scale(0.97);
  }

  /* ─── 狀態圖示 ─── */
  .toast__icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    height: calc(var(--leading-normal, 1.5) * 1em);
  }

  .toast__icon svg {
    width: 18px;
    height: 18px;
  }

  .toast--success .toast__icon {
    color: var(--color-success-text, #047857);
  }

  .toast--error .toast__icon {
    color: var(--color-danger, #ef4444);
  }

  .toast--warning .toast__icon {
    color: var(--color-warning, #f59e0b);
  }

  .toast--info .toast__icon {
    color: var(--color-info, #0284c7);
  }

  .toast--loading .toast__icon {
    color: var(--color-brand-600, #0f4c81);
  }

  /* ─── 內容（live region） ─── */
  .toast__content {
    flex: 1;
    min-width: 0;
    overflow-wrap: break-word;
  }

  .toast__title {
    font-weight: var(--weight-semibold, 600);
    color: var(--color-text-primary, #0f172a);
  }

  .toast__title + .toast__message {
    color: var(--color-text-secondary, #475569);
  }

  /* ─── 關閉鈕 ─── */
  .toast__close {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: -1px -4px 0 0;
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

  .toast__close:hover {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  .toast__close:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .toast__close svg {
    width: 16px;
    height: 16px;
  }

  /* ─── 螢幕閱讀器專用文字 ─── */
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

  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toast {
      animation: none;
      transition: none;
    }
  }
`;

/**
 * 右下角堆疊的 Viewport（由 ToastService 建立的 popover div，透過其 Shadow DOM 套用）。
 * 自訂樣式會覆蓋瀏覽器對 [popover] 的預設樣式（置中、邊框、背景），因此須自行隱藏關閉狀態。
 */
export const toastViewportStyles = css`
  :host {
    position: fixed;
    inset: auto var(--space-lg, 24px) var(--space-lg, 24px) auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    width: min(380px, calc(100vw - 32px));
    max-height: calc(100dvh - 2 * var(--space-lg, 24px));
    margin: 0;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    overflow: visible;
    /* 卡片之間的空隙不攔截點擊 */
    pointer-events: none;
  }

  :host(:not(:popover-open)) {
    display: none;
  }

  @media (max-width: 480px) {
    :host {
      inset: auto var(--space-md, 16px) var(--space-md, 16px);
      width: auto;
    }
  }
`;
