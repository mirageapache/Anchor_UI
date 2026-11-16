import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';
import type { AuiDropzone } from './dropzone.js';

const column = 'flex-direction: column; align-items: stretch; width: 420px;';

const zone = (el: AuiDropzone) => el.shadowRoot!.querySelector<HTMLButtonElement>('.dropzone')!;

function fileDrag(type: string, file: File): DragEvent {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true });
}

describeVisual('AuiDropzone visual regression', [
  {
    name: 'dropzone-states',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-dropzone></aui-dropzone>
        <aui-dropzone accept=".json,image/*" multiple></aui-dropzone>
        <aui-dropzone disabled accept=".csv"></aui-dropzone>
      </div>
    `,
  },
  {
    name: 'dropzone-dragging-error',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-dropzone id="dragging" accept=".json">
          拖放 JSON 檔案到此處
          <span slot="hint">最大 5 MB</span>
        </aui-dropzone>
        <aui-dropzone id="error" accept=".json"></aui-dropzone>
      </div>
    `,
    setup: async (frame) => {
      const dragging = frame.querySelector<AuiDropzone>('#dragging')!;
      const failed = frame.querySelector<AuiDropzone>('#error')!;
      zone(dragging).dispatchEvent(
        fileDrag('dragenter', new File(['{}'], 'data.json', { type: 'application/json' })),
      );
      zone(failed).dispatchEvent(
        fileDrag('drop', new File(['x'], 'notes.txt', { type: 'text/plain' })),
      );
      await dragging.updateComplete;
      await failed.updateComplete;
    },
  },
]);
