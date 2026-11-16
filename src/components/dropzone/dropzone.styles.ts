import { css } from 'lit';

export const dropzoneStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  /* ─── 虛線框（按鈕，同時是拖放目標） ─── */
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs, 4px);
    box-sizing: border-box;
    width: 100%;
    padding: var(--space-xl, 40px) var(--space-md, 16px);
    margin: 0;
    font: inherit;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    text-align: center;
    color: var(--color-text-secondary, #475569);
    background-color: var(--color-base, #ffffff);
    /* 規格為 --color-border，但淺色主題下在白底上幾乎看不見虛線；改用較清晰的 ghost-border */
    border: 1px dashed var(--color-ghost-border, #cbd5e1);
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      border-color var(--transition-base, 150ms ease),
      background-color var(--transition-base, 150ms ease);
  }

  /* 拖曳中不套用懸停的品牌色邊框，讓琥珀色的回饋優先 */
  .dropzone:hover:not(:disabled, .is-dragging) {
    border-color: var(--color-brand-500, #1b6ca8);
  }

  .dropzone:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 拖曳檔案懸浮：整塊染上 Accent 琥珀色，邊框加亮 ─── */
  .dropzone.is-dragging {
    border-color: var(--color-accent, #f59e0b);
    background-color: var(--color-accent-dim, rgba(245, 158, 11, 0.14));
  }

  /* 拖曳時子元素不接收指標事件，避免游標經過圖示與文字時反覆觸發 dragenter / dragleave */
  .dropzone.is-dragging > * {
    pointer-events: none;
  }

  /*
   * 拖曳時的底色是半透明的琥珀色，實際對比取決於元件背後的顏色；
   * 提示文字改用主要文字色，確保放在較亮的深色容器（如卡片、彈窗）內仍符合對比。
   */
  .dropzone.is-dragging .dropzone__hint,
  .dropzone.is-dragging .dropzone__icon {
    color: var(--color-text-primary, #0f172a);
  }

  /*
   * 停用：按鈕不接收指標事件，讓拖放事件落在外層容器上
   * （停用的表單控制項在部分瀏覽器不會收到事件），游標樣式也改由容器提供。
   */
  .dropzone:disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  .dropzone-area.is-disabled {
    cursor: not-allowed;
  }

  /* ─── 內容 ─── */
  .dropzone__icon {
    display: inline-flex;
    color: var(--color-text-secondary, #475569);
  }

  .dropzone__icon svg {
    display: block;
    width: 28px;
    height: 28px;
  }

  .dropzone__heading {
    max-width: 100%;
    font-weight: var(--weight-medium, 500);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: anywhere;
  }

  .dropzone__hint {
    max-width: 100%;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: anywhere;
  }

  /* ─── 錯誤訊息 ─── */
  .dropzone__error {
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-danger-text, #b91c1c);
    overflow-wrap: anywhere;
  }

  /* 沒有訊息時容器高度為 0，只有出現訊息才加上與虛線框的間距 */
  .dropzone__error.has-message {
    margin-top: var(--space-xs, 4px);
  }

  /* 原生檔案輸入框：僅作為開啟選取器的媒介，不顯示也不可聚焦 */
  .dropzone__input {
    display: none;
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .dropzone {
      transition: none !important;
    }
  }
`;
