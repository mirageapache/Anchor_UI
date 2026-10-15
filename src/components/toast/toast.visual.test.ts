import { html, oneEvent } from '@open-wc/testing';
import { emulateMedia, setViewport } from '@web/test-runner-commands';
import { describeVisual } from '../../test-utils/visual.js';
import { ToastService } from './toast-service.js';
import type { AuiToast } from './toast.js';
import type { AuiModal } from '../modal/modal.js';
import '../modal/index.js';

/** Toast 位於 Top Layer 的右下角：截圖範圍為撐滿視窗的外框，並固定視窗大小 */
const viewportFrame = 'position: fixed; inset: 0; display: block; padding: 24px;';

const pageContent = html`
  <h1 style="margin: 0 0 8px; font-size: 24px;">Background page</h1>
  <p style="margin: 0;">Toasts stack in the bottom-right corner.</p>
`;

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** 顯示五種狀態並等待 live region 填入內容 */
async function showToasts(): Promise<void> {
  await setViewport({ width: 800, height: 600 });
  // 截圖工具會把進行中的動畫歸零（進場動畫會變成透明），改以減少動畫直接呈現完成狀態
  await emulateMedia({ reducedMotion: 'reduce' });
  await ToastService.closeAll();
  ToastService.configure({ maxVisible: 5 });
  ToastService.success('Changes saved', { title: 'Saved', duration: 0 });
  ToastService.error('The file exceeds 10 MB.', { title: 'Upload failed', duration: 0 });
  ToastService.warning('Storage is almost full', { duration: 0 });
  ToastService.info('A new version is available', { duration: 0 });
  ToastService.loading('Uploading report.pdf…', { duration: 0 });
  for (let i = 0; i < 3; i++) await nextFrame();
  const viewport = document.querySelector('[data-aui-toast-viewport]');
  const toasts = viewport ? [...viewport.querySelectorAll<AuiToast>('aui-toast')] : [];
  await Promise.all(toasts.map((toast) => toast.updateComplete));
}

describeVisual('AuiToast visual regression', [
  {
    name: 'toast-variants',
    render: () => html`<div class="visual-frame" style=${viewportFrame}>${pageContent}</div>`,
    setup: showToasts,
  },
  {
    name: 'toast-over-modal',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-modal heading="Editor" size="sm">Toasts stay above an open modal.</aui-modal>
      </div>
    `,
    setup: async (frame) => {
      await ToastService.closeAll();
      await emulateMedia({ reducedMotion: 'reduce' });
      await setViewport({ width: 800, height: 600 });
      const modal = frame.querySelector<AuiModal>('aui-modal')!;
      const shown = oneEvent(modal, 'aui-after-show');
      modal.open = true;
      await shown;
      (document.activeElement as HTMLElement | null)?.blur();
      ToastService.configure({ maxVisible: 2 });
      ToastService.success('Changes saved', { duration: 0 });
      ToastService.error('Connection lost', { duration: 0 });
      for (let i = 0; i < 3; i++) await nextFrame();
    },
  },
]);
