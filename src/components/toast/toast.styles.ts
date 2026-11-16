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

  /* 退場：淡出並往螢幕邊緣滑出（方向由 Viewport 提供；單獨使用時往右） */
  :host([leaving]) .toast {
    opacity: 0;
    transform: translate(var(--_aui-toast-exit-x, 16px), var(--_aui-toast-exit-y, 0)) scale(0.97);
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
      transform: translateY(var(--_aui-toast-enter-y, 12px)) scale(0.95);
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
 * 堆疊通知的 Viewport（由 ToastService 建立的 popover div，透過其 Shadow DOM 套用）。
 * 自訂樣式會覆蓋瀏覽器對 [popover] 的預設樣式（置中、邊框、背景），因此須自行隱藏關閉狀態。
 *
 * 位置由 data-placement 決定（ToastService.configure({ placement })，預設 bottom-right；屬性缺少或無效時同預設）：
 *
 * - 對齊：位置名稱是實體方向（left / right），因此使用實體的 left / right 而不是 inset-inline，
 *   RTL 頁面上「右下」仍在右下。置中以 left: calc((100% - 寬度) / 2) 計算，不使用 margin: auto
 *   （頁面的全域 reset，如本套件 styles.css 的 * { margin: 0 }，套用在 Viewport 元素上時優先於 :host 的規則）
 *   也不使用 translate（視窗寬度為奇數時會落在半個像素上，文字變模糊）。
 * - 堆疊方向：DOM 順序固定為由舊到新（螢幕閱讀器依出現順序讀出）。下方位置用 column（最新的在最下面），
 *   上方位置用 column-reverse（最新的在最上面），新通知永遠出現在靠近螢幕邊緣的一側。
 *   上方位置時 Tab 會由下往上經過各通知的關閉鈕，這是保留 DOM 順序的取捨。
 * - 超出視窗高度：通知的總高度超過 max-height 時，讓「最舊的」往螢幕外溢出、最新的留在畫面上
 *   （兩種方向都用 justify-content: flex-end：column 的主軸終點在下方、column-reverse 的在上方，
 *   都是最新通知所在的那一側，溢出的部分因此落在最舊的那一端）。
 * - 動畫方向：以 CSS 變數傳給通知卡片（自訂屬性會繼承進 <aui-toast> 的 Shadow DOM）。
 *   進場從所在的邊緣滑入；退場時靠左往左、靠右往右，置中沒有左右方向，改往所在的邊緣（上或下）滑出。
 * - 小螢幕（寬度 480px 以下）：不論設定為何，一律顯示在中間上方並橫向撐滿
 *   （下方常被瀏覽器工具列、虛擬鍵盤或主要操作按鈕佔用），並避開瀏海等安全區域。
 *   媒體查詢內的選擇器列出 [data-placement]，讓優先度不低於依位置設定的規則。
 *
 * 說明集中寫在這裡而不是樣式內：css 範本中的註解會原樣進入發布產物。
 */
export const toastViewportStyles = css`
  :host {
    --_aui-toast-edge: var(--space-lg, 24px);
    --_aui-toast-width: min(380px, calc(100vw - 32px));

    position: fixed;
    display: flex;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    width: var(--_aui-toast-width);
    max-height: calc(100dvh - 2 * var(--_aui-toast-edge));
    margin: 0;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    overflow: visible;
    pointer-events: none;
  }

  :host(:not(:popover-open)) {
    display: none;
  }

  :host,
  :host([data-placement^='bottom']) {
    top: auto;
    bottom: var(--_aui-toast-edge);
    flex-direction: column;
    justify-content: flex-end;

    --_aui-toast-enter-y: 12px;
  }

  :host([data-placement^='top']) {
    top: var(--_aui-toast-edge);
    bottom: auto;
    flex-direction: column-reverse;
    justify-content: flex-end;

    --_aui-toast-enter-y: -12px;
  }

  :host,
  :host([data-placement$='right']) {
    right: var(--_aui-toast-edge);
    left: auto;

    --_aui-toast-exit-x: 16px;
    --_aui-toast-exit-y: 0px;
  }

  :host([data-placement$='left']) {
    right: auto;
    left: var(--_aui-toast-edge);

    --_aui-toast-exit-x: -16px;
    --_aui-toast-exit-y: 0px;
  }

  :host([data-placement$='center']) {
    right: auto;
    left: calc((100% - var(--_aui-toast-width)) / 2);

    --_aui-toast-exit-x: 0px;
  }

  :host([data-placement='top-center']) {
    --_aui-toast-exit-y: -12px;
  }

  :host([data-placement='bottom-center']) {
    --_aui-toast-exit-y: 12px;
  }

  @media (max-width: 480px) {
    :host,
    :host([data-placement]) {
      --_aui-toast-edge: var(--space-md, 16px);

      top: max(var(--_aui-toast-edge), env(safe-area-inset-top, 0px));
      right: var(--_aui-toast-edge);
      bottom: auto;
      left: var(--_aui-toast-edge);
      flex-direction: column-reverse;
      justify-content: flex-end;
      width: auto;

      --_aui-toast-enter-y: -12px;
      --_aui-toast-exit-x: 0px;
      --_aui-toast-exit-y: -12px;
    }
  }
`;
