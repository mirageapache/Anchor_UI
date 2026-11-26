import { css, unsafeCSS, type CSSResult } from 'lit';

/**
 * `ModalDialogElement` 子類別共用的樣式（`<aui-modal>`、`<aui-drawer>`）：
 * 撐滿視窗的透明 dialog、遮罩的淡入淡出、面板的基本外觀，以及頁首（標題、關閉鈕）、內容、頁尾的結構。
 *
 * 各元件只需補上自己的版面差異（面板的位置、尺寸與進退場動畫、各區塊的內距）。
 * 須排在元件自己的樣式之前：`static styles = [dialogBaseStyles('modal'), modalStyles]`，
 * 元件的樣式才能覆寫這裡的預設值。遮罩與面板的 `transition` 由元件定義，
 * 對應的 `prefers-reduced-motion` 也寫在元件的樣式中（須在 transition 之後才能覆蓋）。
 *
 * @param prefix class 前綴，與 `renderDialog()` 的 `prefix` 相同（只可傳入程式中的常數）
 */
export function dialogBaseStyles(prefix: string): CSSResult {
  const p = unsafeCSS(prefix);
  return css`
    :host {
      display: contents;
    }

    /*
     * ─── dialog：撐滿整個視窗的透明層 ───
     * 點擊面板以外的區域即為點擊遮罩（事件目標皆為 dialog 本身）
     */
    .${p} {
      box-sizing: border-box;
      position: fixed;
      inset: 0;
      width: 100%;
      max-width: none;
      height: 100%;
      max-height: none;
      margin: 0;
      color: inherit;
      background: transparent;
      border: 0;
      overflow: hidden;
    }

    /*
     * 進場以 @starting-style 定義起始狀態：showModal() 讓 dialog 從 display: none 開始渲染時，
     * 瀏覽器自動從起始樣式轉場到一般樣式，不需要 JS 延後一幀切換 class。
     * 退場則由元件加上 --leaving，轉場結束後才 close()。
     */

    /* ─── 遮罩：淡入淡出 ─── */
    .${p}::backdrop {
      background: var(--color-backdrop, rgb(15 23 42 / 65%));
      opacity: 1;
    }

    .${p}--leaving::backdrop {
      opacity: 0;
    }

    @starting-style {
      .${p}[open]::backdrop {
        opacity: 0;
      }
    }

    /* ─── 面板 ─── */
    .${p}__panel {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      font-family: var(
        --font-ui,
        'Inter',
        system-ui,
        -apple-system,
        'Segoe UI',
        Roboto,
        sans-serif
      );
      color: var(--color-text-primary, #0f172a);
      background: var(--color-base, #ffffff);
      overflow: hidden;
      outline: none;
      transform: none;
    }

    /* ─── 頁首 ─── */
    .${p}__header {
      display: flex;
      flex: none;
      align-items: center;
      gap: var(--space-sm, 8px);
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }

    .${p}__title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-weight: var(--weight-semibold, 600);
      line-height: var(--leading-snug, 1.375);
      color: var(--color-text-primary, #0f172a);
      overflow-wrap: break-word;
    }

    .${p}__close {
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

    .${p}__close:hover {
      color: var(--color-text-primary, #0f172a);
      background: var(--color-surface, #f1f5f9);
    }

    .${p}__close:focus-visible {
      outline: 2px solid var(--color-brand-500, #1b6ca8);
      outline-offset: 2px;
    }

    .${p}__close svg {
      width: 18px;
      height: 18px;
    }

    /* ─── 內容 ─── */
    .${p}__body {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      font-size: var(--text-sm, 0.875rem);
      line-height: var(--leading-normal, 1.5);
      color: var(--color-text-secondary, #475569);
      overflow-wrap: break-word;
    }

    /* ─── 頁尾 ─── */
    .${p}__footer {
      display: flex;
      flex: none;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-sm, 8px);
      padding: var(--space-md, 16px) var(--space-lg, 24px);
      background: var(--color-surface, #f1f5f9);
      border-top: 1px solid var(--color-border, #e2e8f0);
    }

    /* 沒有內容的頁首與頁尾不顯示（須寫在頁首 / 頁尾的規則之後才能覆蓋 display） */
    .${p}__header--empty, .${p}__footer--empty {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .${p}__close {
        transition: none;
      }
    }
  `;
}
