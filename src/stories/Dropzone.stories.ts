import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/dropzone/index.js';
import '../components/output/index.js';
import type { AuiDropzone } from '../components/dropzone/dropzone.js';
import type { FileDropDetail, FileRejectDetail } from '../components/dropzone/dropzone.types.js';
import type { AuiOutput } from '../components/output/output.js';
import { inShadow, query } from './play-utils.js';

interface DropzoneStoryArgs {
  accept: string;
  multiple: boolean;
  disabled: boolean;
  heading: string;
  hint: string;
}

const meta: Meta<DropzoneStoryArgs> = {
  title: 'Components/Dropzone',
  component: 'aui-dropzone',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Dropzone 拖放檔案上傳區 (\`<aui-dropzone>\`)**

虛線框外觀的拖放式檔案上傳區：可拖入檔案，或點擊（Enter / Space）開啟原生檔案選取器。
拖曳檔案懸浮於上方時，整塊染上 Accent 琥珀色並加亮邊框。

- \`accept\` 的規則同原生 \`<input type="file">\`（副檔名、MIME 類型、\`image/*\`），並自動顯示格式提示。
- 拖放不受原生選取器過濾，元件會自行檢查：符合的檔案由 \`aui-file-drop\` 送出（\`detail.files\` 為 \`File\` 陣列），
  不符合的由 \`aui-file-reject\` 送出並顯示錯誤訊息。
- 未設定 \`multiple\` 時只接受第一個符合的檔案。
- 本元件只負責取得檔案，不參與表單送出，也不保留已選擇的檔案。
`,
      },
    },
  },
  argTypes: {
    accept: {
      control: 'text',
      description: '允許的檔案格式（同原生 input accept），如 `.json,image/*`',
    },
    multiple: {
      control: 'boolean',
      description: '是否允許一次選擇多個檔案',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: '是否停用',
      table: { defaultValue: { summary: 'false' } },
    },
    heading: { control: 'text', description: '主要提示文字（或使用預設 slot）' },
    hint: { control: 'text', description: '輔助提示；未設定且有 accept 時自動產生格式提示' },
  },
  args: {
    accept: '.json,image/*',
    multiple: true,
    disabled: false,
    heading: '拖放檔案到此處，或點擊選擇檔案',
    hint: '',
  },
};

export default meta;
type Story = StoryObj<DropzoneStoryArgs>;

const formatSize = (bytes: number) =>
  bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

/** 將取得或被拒絕的檔案顯示在下方的 <aui-output> */
function report(event: Event): void {
  const output = (event.currentTarget as HTMLElement).parentElement!.querySelector<AuiOutput>(
    'aui-output',
  )!;
  if (event.type === 'aui-file-drop') {
    const { files, source } = (event as CustomEvent<FileDropDetail>).detail;
    output.status = 'success';
    output.value = files
      .map((file) => `${file.name} (${file.type || 'unknown'}, ${formatSize(file.size)})`)
      .join('\n')
      .concat(`\nsource: ${source}`);
  } else {
    const { rejections } = (event as CustomEvent<FileRejectDetail>).detail;
    output.status = 'error';
    output.value = rejections.map(({ file, reason }) => `${file.name} — ${reason}`).join('\n');
  }
}

export const Default: Story = {
  render: (args) => html`
    <div style="display: grid; gap: 12px; max-width: 480px;">
      <aui-dropzone
        accept=${args.accept}
        ?multiple=${args.multiple}
        ?disabled=${args.disabled}
        heading=${args.heading}
        hint=${args.hint}
        @aui-file-drop=${report}
        @aui-file-reject=${report}
      ></aui-dropzone>
      <aui-output label="取得的檔案" placeholder="尚未選擇檔案"></aui-output>
    </div>
  `,
};

/** 建立帶有檔案的拖曳事件（play function 以合成事件模擬從檔案總管拖入） */
function fileDrag(type: string, files: File[]): DragEvent {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  return new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true });
}

/** 拖放 JSON 與圖片：截獲 File 物件並觸發 aui-file-drop（Phase 3 驗收條件） */
export const DropFiles: Story = {
  render: () => html`
    <div style="display: grid; gap: 12px; max-width: 480px;">
      <aui-dropzone
        accept=".json,image/*"
        multiple
        @aui-file-drop=${report}
        @aui-file-reject=${report}
      ></aui-dropzone>
      <aui-output label="取得的檔案" placeholder="尚未選擇檔案"></aui-output>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const dropzone = query<AuiDropzone>(canvasElement, 'aui-dropzone');
    const output = query<AuiOutput>(canvasElement, 'aui-output');
    const zone = inShadow(dropzone, '.dropzone');
    const json = new File(['{"ok":true}'], 'data.json', { type: 'application/json' });
    const png = new File([new Uint8Array([137, 80, 78, 71])], 'photo.png', { type: 'image/png' });
    const text = new File(['hello'], 'notes.txt', { type: 'text/plain' });

    await step('拖曳檔案懸浮時顯示琥珀色回饋', async () => {
      zone.dispatchEvent(fileDrag('dragenter', [json]));
      await waitFor(() => expect(zone.classList.contains('is-dragging')).toBe(true));
    });

    await step('放下 JSON 與圖片：取得 File 物件', async () => {
      let detail: FileDropDetail | undefined;
      dropzone.addEventListener(
        'aui-file-drop',
        (event) => (detail = (event as CustomEvent<FileDropDetail>).detail),
        { once: true },
      );
      zone.dispatchEvent(fileDrag('drop', [json, png]));

      await expect(detail?.files.map((file) => file.name)).toEqual(['data.json', 'photo.png']);
      await expect(detail?.files.every((file) => file instanceof File)).toBe(true);
      await expect(await detail!.files[0].text()).toBe('{"ok":true}');
      await waitFor(() => expect(zone.classList.contains('is-dragging')).toBe(false));
      await waitFor(() => expect(output.value).toContain('data.json'));
    });

    await step('放下不支援的格式：顯示錯誤訊息，不送出 aui-file-drop', async () => {
      let dropped = false;
      const onDrop = () => (dropped = true);
      dropzone.addEventListener('aui-file-drop', onDrop);
      zone.dispatchEvent(fileDrag('drop', [text]));
      dropzone.removeEventListener('aui-file-drop', onDrop);

      await expect(dropped).toBe(false);
      await waitFor(() =>
        expect(inShadow(dropzone, '.dropzone__error').textContent).toContain('notes.txt'),
      );
      await waitFor(() => expect(output.status).toBe('error'));
    });
  },
};

export const States: Story = {
  render: () => html`
    <div style="display: grid; gap: 16px; max-width: 480px;">
      <aui-dropzone></aui-dropzone>
      <aui-dropzone accept=".csv" hint="CSV，單一檔案上限 5 MB"></aui-dropzone>
      <aui-dropzone accept=".json" disabled></aui-dropzone>
    </div>
  `,
};

export const CustomContent: Story = {
  render: () => html`
    <div style="max-width: 480px;">
      <aui-dropzone accept="image/*" multiple>
        將圖片拖放到這裡
        <span slot="hint">PNG、JPG 或 WebP，可一次選擇多張</span>
      </aui-dropzone>
    </div>
  `,
};
