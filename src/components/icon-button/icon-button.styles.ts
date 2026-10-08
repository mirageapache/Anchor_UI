import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin: 0;
    flex-shrink: 0;

    /* ─── 預設懸停色彩變數 (可透過 color 屬性或 CSS 變數覆寫) ─── */
    --aui-icon-btn-color-dim: var(
      --color-brand-dim,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-brand-border,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 22%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-brand-text, #0f4c81);
  }

  :host([size='sm']) {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
    max-width: 28px;
    max-height: 28px;
  }

  :host([size='md']) {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }

  :host([size='lg']) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* 內建 aui-tooltip 包裝器自動填滿宿主容器且維持等比例 */
  aui-tooltip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
  }

  aui-tooltip::part(trigger) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
  }

  /* ─── 核心圖示按鈕 (.icon-btn) ─── */
  .icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    margin: 0;
    padding: 0 !important;
    line-height: 1;
    font-size: 0;
    font-family: inherit;
    border: 1px solid transparent;
    border-radius: var(--radius-sm, 6px);
    background: transparent;
    color: var(--color-text-secondary, #475569);
    cursor: pointer;
    user-select: none;
    outline: none;
    flex-shrink: 0;
    overflow: hidden;
    transition:
      background-color var(--transition-base, 150ms ease),
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  /* 尺寸精準等比控制 (Strict 1:1 Size Overrides) */
  .icon-btn--sm {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
    max-width: 28px;
    max-height: 28px;
  }

  .icon-btn--md {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }

  .icon-btn--lg {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }

  /* ─── 形狀變體 (Shape Variations) ─── */
  .icon-btn--rounded {
    border-radius: var(--radius-sm, 6px);
  }

  .icon-btn--circle {
    border-radius: 50% !important;
  }

  .icon-btn--square {
    border-radius: 0 !important;
  }

  /* ─── 點擊反饋 (Active State - 保持穩定等比例無縮放變形) ─── */
  .icon-btn:active:not(:disabled):not(.is-disabled):not(.is-loading) {
    transform: none;
  }

  /* ─── 樣式變體 (Variants) 與清晰 Hover 回饋 ─── */

  /* 1. Ghost (預設：透明底、懸停高可視度半透明背景與線框) */
  .icon-btn--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--color-text-secondary, #475569);
  }

  .icon-btn--ghost:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(
      --aui-icon-btn-hover-bg,
      var(
        --aui-icon-btn-color-dim,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
      )
    );
    border-color: var(
      --aui-icon-btn-hover-border,
      var(
        --aui-icon-btn-color-border,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 22%, transparent)
      )
    );
    color: var(
      --aui-icon-btn-hover-color,
      var(--aui-icon-btn-color-text, var(--color-brand-text, #0f4c81))
    );
  }

  /* 2. Subtle (淺次級底色、懸停深色襯底) */
  .icon-btn--subtle {
    background: var(--color-surface, #f1f5f9);
    border-color: var(--color-border, #e2e8f0);
    color: var(--color-text-secondary, #475569);
  }

  .icon-btn--subtle:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(
      --aui-icon-btn-hover-bg,
      var(
        --aui-icon-btn-color-dim,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 14%, transparent)
      )
    );
    border-color: var(
      --aui-icon-btn-hover-border,
      var(
        --aui-icon-btn-color-border,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 28%, transparent)
      )
    );
    color: var(
      --aui-icon-btn-hover-color,
      var(--aui-icon-btn-color-text, var(--color-brand-text, #0f4c81))
    );
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  /* 3. Outline (清晰線框與微白底) */
  .icon-btn--outline {
    background: var(--color-base, #ffffff);
    border-color: var(--color-ghost-border, #cbd5e1);
    color: var(--color-text-secondary, #475569);
  }

  .icon-btn--outline:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    border-color: var(
      --aui-icon-btn-hover-border,
      var(--aui-icon-btn-color-border, var(--color-brand-500, #38bdf8))
    );
    background: var(
      --aui-icon-btn-hover-bg,
      var(
        --aui-icon-btn-color-dim,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 10%, transparent)
      )
    );
    color: var(
      --aui-icon-btn-hover-color,
      var(--aui-icon-btn-color-text, var(--color-brand-text, #0f4c81))
    );
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  /* 4. Primary (海軍藍實心底、懸停加亮與發光) */
  .icon-btn--primary {
    background: var(--color-brand-600, #0f4c81);
    color: var(--color-on-solid, #ffffff);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--color-brand-600, #0f4c81) 20%, transparent);
  }

  .icon-btn--primary:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(--color-brand-700, #0a3356);
    filter: brightness(1.1);
    box-shadow: 0 2px 6px color-mix(in srgb, var(--color-brand-600, #0f4c81) 35%, transparent);
  }

  /* 5. Danger (破壞性操作) */
  .icon-btn--danger {
    background: transparent;
    border-color: transparent;
    color: var(--color-danger, #ef4444);
  }

  .icon-btn--danger:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(--aui-icon-btn-hover-bg, var(--color-danger-dim, rgba(239, 68, 68, 0.14)));
    border-color: var(
      --aui-icon-btn-hover-border,
      var(--color-danger-border, rgba(239, 68, 68, 0.3))
    );
    color: var(--aui-icon-btn-hover-color, var(--color-danger-hover, #dc2626));
  }

  /* ─── 色彩語意控制 (Color Attribute & Semantic Theme Hooks) ─── */
  /* 支援 color="brand" | "accent" | "success" | "warning" | "danger" | "info" | "purple" | "neutral" */
  :host([color='brand']),
  .icon-btn--color-brand {
    --aui-icon-btn-color-dim: var(
      --color-brand-dim,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-brand-border,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 22%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-brand-text, #0f4c81);
  }

  :host([color='accent']),
  .icon-btn--color-accent {
    --aui-icon-btn-color-dim: var(--color-accent-dim, rgba(245, 158, 11, 0.16));
    --aui-icon-btn-color-border: var(--color-accent-border, rgba(245, 158, 11, 0.35));
    --aui-icon-btn-color-text: var(--color-accent-text, #b45309);
  }

  :host([color='warning']),
  .icon-btn--color-warning {
    --aui-icon-btn-color-dim: var(--color-warning-dim, rgba(245, 158, 11, 0.16));
    --aui-icon-btn-color-border: var(--color-warning-border, rgba(245, 158, 11, 0.35));
    --aui-icon-btn-color-text: var(--color-warning-text, #b45309);
  }

  :host([color='success']),
  .icon-btn--color-success {
    --aui-icon-btn-color-dim: var(--color-success-dim, rgba(16, 185, 129, 0.16));
    --aui-icon-btn-color-border: var(--color-success-border, rgba(16, 185, 129, 0.35));
    --aui-icon-btn-color-text: var(--color-success-text, #047857);
  }

  :host([color='danger']),
  .icon-btn--color-danger {
    --aui-icon-btn-color-dim: var(--color-danger-dim, rgba(239, 68, 68, 0.16));
    --aui-icon-btn-color-border: var(--color-danger-border, rgba(239, 68, 68, 0.35));
    --aui-icon-btn-color-text: var(--color-danger-text, #dc2626);
  }

  :host([color='info']),
  .icon-btn--color-info {
    --aui-icon-btn-color-dim: var(--color-info-dim, rgba(14, 165, 233, 0.16));
    --aui-icon-btn-color-border: var(--color-info-border, rgba(14, 165, 233, 0.35));
    --aui-icon-btn-color-text: var(--color-info-text, #0369a1);
  }

  :host([color='purple']),
  .icon-btn--color-purple {
    --aui-icon-btn-color-dim: var(--color-purple-dim, rgba(139, 92, 246, 0.16));
    --aui-icon-btn-color-border: var(--color-purple-border, rgba(139, 92, 246, 0.35));
    --aui-icon-btn-color-text: var(--color-purple-text, #6d28d9);
  }

  :host([color='neutral']),
  .icon-btn--color-neutral {
    --aui-icon-btn-color-dim: var(
      --color-neutral-dim,
      color-mix(in srgb, var(--color-text-secondary, #475569) 14%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-neutral-border,
      color-mix(in srgb, var(--color-text-secondary, #475569) 24%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-neutral-text, #334155);
  }

  /* ─── 成功回饋狀態 (Active & Success Feedback - 翡翠綠 Success 主題) ─── */
  .icon-btn.is-active,
  .icon-btn.is-success {
    background: var(--color-success-dim, rgba(16, 185, 129, 0.16)) !important;
    color: var(--color-success-text, #047857) !important;
    border-color: var(--color-success-border, rgba(16, 185, 129, 0.35)) !important;
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--color-success-border, rgba(16, 185, 129, 0.35)) 40%, transparent) !important;
    animation: pulse-ring 600ms cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* 錯誤反饋狀態 */
  .icon-btn.is-error {
    background: var(--color-danger-dim, rgba(239, 68, 68, 0.14)) !important;
    color: var(--color-danger, #ef4444) !important;
    border-color: var(--color-danger-border, rgba(239, 68, 68, 0.3)) !important;
  }

  /* ─── Focus 雙層無障礙焦點環 ─── */
  .icon-btn:focus-visible {
    outline: 2px solid var(--color-brand-500, #38bdf8);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-500, #38bdf8) 25%, transparent);
  }

  .icon-btn:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }

  /* ─── 停用狀態 ─── */
  .icon-btn:disabled,
  .icon-btn.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
    transform: none;
  }

  /* ─── 圖示容器與尺寸 (Icon Sizing) ─── */
  .icon-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    max-width: 18px;
    max-height: 18px;
    aspect-ratio: 1 / 1;
    margin: 0;
    padding: 0;
    pointer-events: none;
    flex-shrink: 0;
  }

  .icon-btn--sm .icon-wrapper {
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    max-width: 14px;
    max-height: 14px;
  }

  .icon-btn--md .icon-wrapper {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    max-width: 18px;
    max-height: 18px;
  }

  .icon-btn--lg .icon-wrapper {
    width: 22px;
    height: 22px;
    min-width: 22px;
    min-height: 22px;
    max-width: 22px;
    max-height: 22px;
  }

  .icon-wrapper svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: block;
    flex-shrink: 0;
  }

  .icon-wrapper ::slotted(*) {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: block;
    box-sizing: border-box;
  }

  /* ─── 狀態分層動畫 (State Layers & Smooth Cross-fade) ─── */
  .icon-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    transition: opacity var(--transition-base, 150ms ease);
  }

  /* 靜態閒置圖示 (Idle) */
  .icon-layer--idle {
    opacity: 1;
  }

  .icon-layer--idle.is-hidden {
    opacity: 0;
    pointer-events: none;
  }

  /* 成功微動態圖示 (Success Checkmark) */
  .icon-layer--success {
    opacity: 0;
    pointer-events: none;
  }

  .icon-layer--success.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* 載入中 Spinner 圖示 */
  .icon-layer--loading {
    opacity: 0;
    pointer-events: none;
  }

  .icon-layer--loading.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  .spinner-svg {
    animation: spin 750ms linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 var(--color-success-border, rgba(16, 185, 129, 0.5));
    }
    60% {
      box-shadow: 0 0 0 6px transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  /* ─── 螢幕閱讀器專用即時播報 (Screen Reader Only) ─── */
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
    .icon-btn,
    .icon-layer {
      transition: none !important;
    }

    .icon-btn.is-active,
    .icon-btn.is-success {
      animation: none !important;
    }

    /* 載入中 Spinner 保留但放慢，讓忙碌狀態仍可被感知（與 Button 一致） */
    .spinner-svg {
      animation-duration: 2s;
    }
  }
`;
