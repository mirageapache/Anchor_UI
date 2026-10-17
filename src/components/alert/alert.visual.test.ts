import { html, oneEvent } from '@open-wc/testing';
import { emulateMedia, setViewport } from '@web/test-runner-commands';
import { describeVisual } from '../../test-utils/visual.js';
import type { AuiAlert } from './alert.js';
import './index.js';
import '../button/index.js';

/** 與 Modal 相同：Alert 位於 Top Layer、覆蓋整個視窗，截圖範圍為撐滿視窗的外框 */
const viewportFrame = 'position: fixed; inset: 0; display: block; padding: 24px;';

const pageContent = html`
  <h1 style="margin: 0 0 8px; font-size: 24px;">Background page</h1>
  <p style="margin: 0;">This content sits behind the alert backdrop.</p>
`;

async function openAlert(frame: HTMLElement): Promise<void> {
  await setViewport({ width: 800, height: 600 });
  // 截圖工具會把進行中的動畫歸零（圖示描繪動畫會變成看不見），改以減少動畫直接呈現完成狀態
  await emulateMedia({ reducedMotion: 'reduce' });
  const alert = frame.querySelector<AuiAlert>('aui-alert')!;
  const shown = oneEvent(alert, 'aui-after-show');
  alert.open = true;
  await shown;
  // 截圖時不顯示焦點環
  let active = document.activeElement as HTMLElement | null;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement as HTMLElement;
  active?.blur();
}

describeVisual('AuiAlert visual regression', [
  {
    name: 'alert-success',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-alert
          icon="success"
          heading="Saved"
          message="All changes have been saved."
        ></aui-alert>
      </div>
    `,
    setup: openAlert,
  },
  {
    name: 'alert-confirm-destructive',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-alert
          mode="confirm"
          icon="warning"
          heading="Delete project?"
          message="This permanently deletes the project and cannot be undone."
          confirm-text="Delete"
          cancel-text="Cancel"
          destructive
        ></aui-alert>
      </div>
    `,
    setup: openAlert,
  },
  {
    name: 'alert-prompt',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-alert
          mode="prompt"
          icon="info"
          heading="Rename file"
          message="Enter a new name for this file."
          input-value="report-final.pdf"
        ></aui-alert>
      </div>
    `,
    setup: openAlert,
  },
  {
    name: 'alert-error',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-alert
          icon="error"
          heading="Upload failed"
          message="The file exceeds 10 MB."
        ></aui-alert>
      </div>
    `,
    setup: openAlert,
  },
]);
