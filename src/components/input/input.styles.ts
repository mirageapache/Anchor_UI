import { css } from 'lit';

export const inputStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 輸入框本體（單行 input 與多行 textarea 共用） ─── */
  .control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 12px 14px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    outline: none;
    overflow-wrap: break-word;
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      color var(--transition-theme, 200ms ease);
  }

  textarea.control {
    min-height: calc(1.5em + 26px); /* 至少一行文字 + 上下內距與邊框 */
    resize: vertical;
  }

  .control::placeholder {
    color: var(--color-text-muted, #64748b);
    opacity: 1;
  }

  /* ─── Focus 雙層光環：品牌色邊框 + 3px 淡色光暈 ─── */
  .control:focus {
    border-color: var(--color-brand-600, #0f4c81);
    box-shadow: 0 0 0 3px var(--color-brand-dim, color-mix(in srgb, #0f4c81 12%, transparent));
  }

  /* ─── 錯誤狀態：明確設定 invalid，或使用者操作後未通過驗證 ─── */
  .control--invalid,
  .control:user-invalid {
    border-color: var(--color-danger, #ef4444);
  }

  .control--invalid:focus,
  .control:user-invalid:focus {
    border-color: var(--color-danger, #ef4444);
    box-shadow: 0 0 0 3px var(--color-danger-dim, color-mix(in srgb, #ef4444 10%, transparent));
  }

  /* ─── 唯讀與停用 ─── */
  .control:read-only:not(:disabled) {
    background: var(--color-surface, #f1f5f9);
  }

  .control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    resize: none;
  }

  /* ─── 螢幕閱讀器專用文字（標題與描述的無障礙關聯） ─── */
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

  /* ─── 無障礙動態降級：減少動畫 ─── */
  @media (prefers-reduced-motion: reduce) {
    .control {
      transition: none;
    }
  }
`;
