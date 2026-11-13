import { html, oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { describeVisual } from '../../test-utils/visual.js';
import type { AuiModal } from './modal.js';
import './index.js';
import '../button/index.js';

/**
 * Modal 位於 Top Layer、覆蓋整個視窗，因此截圖範圍為固定撐滿視窗的外框，
 * 並固定視窗大小，讓面板置中的位置穩定。
 */
const viewportFrame = 'position: fixed; inset: 0; display: block; padding: 24px;';

/** 背景頁面內容：呈現遮罩的模糊與變暗效果 */
const pageContent = html`
  <h1 style="margin: 0 0 8px; font-size: 24px;">Background page</h1>
  <p style="margin: 0 0 16px;">This content sits behind the modal backdrop.</p>
  <aui-button>Page action</aui-button>
`;

async function openModal(frame: HTMLElement): Promise<void> {
  await setViewport({ width: 800, height: 600 });
  const modal = frame.querySelector<AuiModal>('aui-modal')!;
  const shown = oneEvent(modal, 'aui-after-show');
  modal.open = true;
  await shown;
  // 截圖時不顯示焦點（面板以程式聚焦）
  (document.activeElement as HTMLElement | null)?.blur();
}

describeVisual('AuiModal visual regression', [
  {
    name: 'modal-dialog',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-modal heading="Delete project">
          <p style="margin: 0;">
            This permanently deletes <strong>anchor-ui</strong> and all of its data. This action
            cannot be undone.
          </p>
          <aui-button slot="footer" variant="ghost">Cancel</aui-button>
          <aui-button slot="footer" variant="danger">Delete</aui-button>
        </aui-modal>
      </div>
    `,
    setup: openModal,
  },
  {
    name: 'modal-compact',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-modal size="sm" no-close-button>
          <p style="margin: 0; text-align: center;">Body-only modal without header or footer.</p>
        </aui-modal>
      </div>
    `,
    setup: openModal,
  },
]);
