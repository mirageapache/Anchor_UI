import { css } from 'lit';

/** Modal 自己的版面：面板置中、縮放彈出、三種寬度；共用的結構與外觀見 internal/modal-dialog.styles.ts */
export const modalStyles = css`
  /* ─── dialog：面板置中 ─── */
  .modal {
    padding: var(--space-md, 16px);
  }

  .modal[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ─── 遮罩：模糊背景 ─── */
  .modal::backdrop {
    backdrop-filter: blur(4px);
    transition: opacity 180ms ease-out;
  }

  /* ─── 面板：縮放彈出 ─── */
  .modal__panel {
    width: 100%;
    max-height: 100%;
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-xl, 16px);
    box-shadow: var(--shadow-modal, 0 25px 50px -12px rgb(0 0 0 / 35%));
    opacity: 1;
    transition:
      opacity 180ms ease-out,
      transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal--leaving .modal__panel {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }

  @starting-style {
    .modal[open] .modal__panel {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
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

  /* ─── 頁首、內容、頁尾 ─── */
  .modal__header {
    padding: var(--space-md, 16px) var(--space-lg, 24px);
  }

  .modal__title {
    font-size: var(--text-lg, 1.125rem);
  }

  .modal__body {
    padding: var(--space-lg, 24px);
  }

  .modal__footer {
    justify-content: flex-end;
  }

  @media (prefers-reduced-motion: reduce) {
    .modal::backdrop,
    .modal__panel {
      transition: none;
    }

    .modal__panel {
      transform: none;
    }
  }
`;
