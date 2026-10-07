import { css } from 'lit';

export const tooltipStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([block]) {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 觸發目標包裝容器 ─── */
  .tooltip__trigger {
    display: inline-flex;
    vertical-align: middle;
    outline: none;
  }

  :host([block]) .tooltip__trigger {
    display: block;
    width: 100%;
  }

  /* ─── Shadcn 風格冷黑浮層氣泡 (Popup) ─── */
  .tooltip__popup {
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 5px 10px;
    z-index: 10000;
    width: max-content;
    max-width: 260px;
    box-sizing: border-box;
    font-family: var(
      --font-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif
    );
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
    line-height: 1.35;
    letter-spacing: 0.01em;
    color: var(--color-tooltip-text, #f8fafc);
    background-color: var(--color-tooltip-bg, #0f172a);
    border: 1px solid var(--color-tooltip-border, rgba(255, 255, 255, 0.14));
    border-radius: var(--radius-sm, 6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
    pointer-events: none;
    opacity: 0;
    transform: scale(0.95);
    transform-origin: var(--tooltip-transform-origin, center);
    transition:
      opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    word-break: break-word;
    white-space: normal;
    user-select: none;
  }

  /*
   * 深色模式：不在此使用 :host-context()（Firefox / Safari 不支援），
   * 改由 [data-theme='dark'] 覆寫 --color-tooltip-* token，經 CSS 繼承穿透 Shadow DOM。
   */

  /* 顯示狀態：淡入並縮放至 1.0，允許滑鼠懸停於氣泡上 (WCAG 1.4.13) */
  .tooltip__popup--visible {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  /* ─── 原生 Popover API 重設（Top Layer 支援） ─── */
  .tooltip__popup[popover] {
    inset: unset;
    overflow: visible;
    border: 1px solid var(--color-tooltip-border, rgba(255, 255, 255, 0.14));
    background-color: var(--color-tooltip-bg, #0f172a);
    color: var(--color-tooltip-text, #f8fafc);
  }

  /* ─── 箭頭指標 (Arrow Indicator) ─── */
  .tooltip__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: inherit;
    border: inherit;
    transform: rotate(45deg);
    pointer-events: none;
    z-index: -1;
  }

  /* 根據目前放置方位調整箭頭朝向與邊界 */
  .tooltip__popup[data-placement^='top'] > .tooltip__arrow {
    bottom: -4px;
    border-top: none;
    border-left: none;
  }

  .tooltip__popup[data-placement^='bottom'] > .tooltip__arrow {
    top: -4px;
    border-bottom: none;
    border-right: none;
  }

  .tooltip__popup[data-placement^='left'] > .tooltip__arrow {
    right: -4px;
    border-bottom: none;
    border-left: none;
  }

  .tooltip__popup[data-placement^='right'] > .tooltip__arrow {
    left: -4px;
    border-top: none;
    border-right: none;
  }

  /* ─── 無障礙降級：減少動畫 ─── */
  @media (prefers-reduced-motion: reduce) {
    .tooltip__popup {
      transition: none !important;
      transform: none !important;
    }
  }
`;
