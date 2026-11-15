import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/accordion/index.js';
import '../components/button/index.js';
import '../components/card/index.js';
import '../components/dropzone/index.js';
import '../components/field/index.js';
import '../components/header/index.js';
import '../components/input/index.js';
import '../components/kbd/index.js';
import '../components/output/index.js';
import '../components/segmented/index.js';
import '../components/tag/index.js';
import '../components/toast/index.js';
import { ToastService } from '../components/toast/toast-service.js';
import type { AuiAccordion } from '../components/accordion/accordion.js';
import type { AuiDropzone } from '../components/dropzone/dropzone.js';
import type { FileDropDetail } from '../components/dropzone/dropzone.types.js';
import type { AuiFavoriteBtn } from '../components/favorite-btn/favorite-btn.js';
import type { AuiHeader } from '../components/header/header.js';
import type { HeaderFavoriteChangeDetail } from '../components/header/header.types.js';
import type { AuiInput } from '../components/input/input.js';
import type { AuiOutput } from '../components/output/output.js';
import type { AuiSegmented } from '../components/segmented/segmented.js';
import type { SegmentedOption } from '../components/segmented/segmented.types.js';
import {
  chooseOption,
  clickButton,
  inShadow,
  query,
  toastViewport,
  visibleToasts,
} from './play-utils.js';

/**
 * Phase 3 交付成果：以元件庫拼裝出完整的「工具原型頁面」。
 * 組合 Header、Dropzone、Field + Input、Segmented、Output、Accordion、Kbd 與 Card，
 * 並以 play function 驗證跨元件的操作流程。
 */
const meta: Meta = {
  title: 'Scenarios/Tool Page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '以 Anchor UI 元件拼裝的工具原型頁面（JSON Formatter）：頁首（Header）、檔案拖放（Dropzone）、輸入與輸出（Field / Input / Output）、縮排選擇（Segmented）、操作說明與 FAQ（Accordion）、快捷鍵提示（Kbd）與相關工具（Card）。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const INDENTS: SegmentedOption[] = [
  { value: '2', label: '2 空格' },
  { value: '4', label: '4 空格' },
  { value: 'min', label: '壓縮' },
];

/** 依目前的輸入與縮排設定產生結果（格式錯誤時以錯誤狀態呈現） */
function format(root: ParentNode): void {
  const input = query<AuiInput>(root, 'aui-input');
  const indent = query<AuiSegmented>(root, 'aui-segmented').value;
  const output = query<AuiOutput>(root, 'aui-output');

  if (!input.value.trim()) {
    output.value = '';
    return;
  }
  try {
    const parsed: unknown = JSON.parse(input.value);
    output.status = 'success';
    output.value = JSON.stringify(parsed, null, indent === 'min' ? undefined : Number(indent));
  } catch (error) {
    output.status = 'error';
    output.value = error instanceof Error ? error.message : String(error);
  }
}

const page = (event: Event) => (event.currentTarget as Element).closest('[data-page]')!;

const toolPage = () => html`
  <div
    data-page
    class="container"
    style="display: grid; gap: 24px; padding-block: 32px; max-width: 880px;"
  >
    <aui-header
      heading="JSON Formatter"
      description="格式化、驗證並壓縮 JSON 文件，所有運算皆在瀏覽器內完成，資料不會離開你的裝置。"
      hot
      favoritable
      @aui-favorite-change=${(event: CustomEvent<HeaderFavoriteChangeDetail>) =>
        ToastService.success(event.detail.favorite ? '已加入我的最愛' : '已從我的最愛移除')}
    >
      <aui-tag slot="tags" variant="brand">json</aui-tag>
      <aui-tag slot="tags">format</aui-tag>
    </aui-header>

    <aui-dropzone
      accept=".json"
      heading="拖放 JSON 檔案到此處，或點擊選擇檔案"
      @aui-file-drop=${async (event: CustomEvent<FileDropDetail>) => {
        const root = page(event);
        const [file] = event.detail.files;
        query<AuiInput>(root, 'aui-input').value = await file.text();
        format(root);
        ToastService.info(`已載入 ${file.name}`);
      }}
    ></aui-dropzone>

    <aui-field label="Input" description="貼上 JSON，或由上方載入檔案" clearable>
      <aui-input
        multiline
        rows="6"
        placeholder='{"name":"anchor-ui"}'
        @input=${(event: Event) => format(page(event))}
      ></aui-input>
    </aui-field>

    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px;">
      <aui-segmented
        label="縮排"
        .options=${INDENTS}
        value="2"
        @change=${(event: Event) => format(page(event))}
      ></aui-segmented>
      <aui-button data-testid="format" @click=${(event: Event) => format(page(event))}
        >格式化</aui-button
      >
      <span style="font-size: 12px; color: var(--color-text-secondary);">
        輸入時自動格式化；<aui-kbd size="sm">Tab</aui-kbd> 移至下一個欄位
      </span>
    </div>

    <aui-field label="Output" copyable>
      <aui-output placeholder="結果會顯示在這裡"></aui-output>
    </aui-field>

    <section style="display: grid; gap: 12px;">
      <aui-accordion heading="使用說明" open>
        <p>貼上 JSON 或拖入 <code>.json</code> 檔案，結果會立即顯示在下方。</p>
        <ul>
          <li>選擇縮排寬度，或以「壓縮」移除所有空白</li>
          <li>格式錯誤時會顯示解析器回報的錯誤訊息</li>
        </ul>
      </aui-accordion>
      <aui-accordion heading="資料會上傳到伺服器嗎？" variant="faq" name="faq">
        <p>不會，所有運算皆在本機完成。</p>
      </aui-accordion>
      <aui-accordion heading="支援 JSON5 或註解嗎？" variant="faq" name="faq">
        <p>不支援，僅接受標準 JSON。</p>
      </aui-accordion>
    </section>

    <section>
      <h2 class="section-label" style="margin: 0 0 12px;">相關工具</h2>
      <ul class="card-grid">
        <li>
          <aui-card
            heading="JWT Decoder"
            description="檢視 JSON Web Token 的 header、payload 與簽章。"
            href="#jwt"
            hot
          >
            <aui-tag slot="tags" variant="info">jwt</aui-tag>
          </aui-card>
        </li>
        <li>
          <aui-card heading="Base64" description="編碼與解碼 Base64 文字與檔案。" href="#base64">
            <aui-tag slot="tags" variant="success">encode</aui-tag>
          </aui-card>
        </li>
        <li>
          <aui-card heading="UUID Generator" description="產生 v4 / v7 UUID。" href="#uuid">
            <aui-tag slot="tags" variant="purple">uuid</aui-tag>
          </aui-card>
        </li>
      </ul>
    </section>
  </div>
`;

/** 建立帶有檔案的拖曳事件（以合成事件模擬從檔案總管拖入） */
function fileDrag(type: string, files: File[]): DragEvent {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  return new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true });
}

/** 完整頁面：可直接操作（拖入 .json 檔案、輸入、切換縮排、收藏） */
export const Page: Story = {
  render: toolPage,
};

/** 操作流程：拖入檔案 → 自動格式化 → 切換縮排 → 輸入錯誤內容 → 收藏 → 展開 FAQ */
export const Workflow: Story = {
  render: toolPage,
  play: async ({ canvasElement, step }) => {
    const input = query<AuiInput>(canvasElement, 'aui-input');
    const output = query<AuiOutput>(canvasElement, 'aui-output');
    const dropzone = query<AuiDropzone>(canvasElement, 'aui-dropzone');
    const segmented = query<AuiSegmented>(canvasElement, 'aui-segmented');
    const header = query<AuiHeader>(canvasElement, 'aui-header');
    const zone = inShadow(dropzone, '.dropzone');

    await step('拖入 JSON 檔案：內容載入輸入框並格式化', async () => {
      const file = new File(['{"name":"anchor-ui","phase":3}'], 'package.json', {
        type: 'application/json',
      });
      zone.dispatchEvent(fileDrag('drop', [file]));
      await waitFor(() => expect(input.value).toBe('{"name":"anchor-ui","phase":3}'));
      await waitFor(() => expect(output.value).toBe('{\n  "name": "anchor-ui",\n  "phase": 3\n}'));
      await expect(output.status).toBe('success');
    });

    await step('切換為壓縮：結果移除所有空白', async () => {
      await chooseOption(segmented, 2);
      await waitFor(() => expect(output.value).toBe('{"name":"anchor-ui","phase":3}'));
    });

    await step('拖入不支援的檔案：顯示錯誤，內容不變', async () => {
      zone.dispatchEvent(fileDrag('drop', [new File(['x'], 'notes.txt', { type: 'text/plain' })]));
      await waitFor(() =>
        expect(inShadow(dropzone, '.dropzone__error').textContent).toContain('notes.txt'),
      );
      await expect(input.value).toBe('{"name":"anchor-ui","phase":3}');
    });

    await step('輸入不合法的 JSON：輸出框以錯誤狀態顯示訊息', async () => {
      input.value = '{"name": }';
      await clickButton(query(canvasElement, '[data-testid="format"]'));
      await waitFor(() => expect(output.status).toBe('error'));
      await expect(output.value).not.toBe('');
    });

    await step('加入我的最愛：Header 轉發事件並顯示通知', async () => {
      const favorite = inShadow<AuiFavoriteBtn>(header, 'aui-favorite-btn');
      await favorite.updateComplete;
      await userEvent.click(inShadow(favorite, 'button'));
      await expect(header.favorite).toBe(true);
      await waitFor(() =>
        expect(
          visibleToasts(toastViewport()).some((toast) => toast.message === '已加入我的最愛'),
        ).toBe(true),
      );
    });

    await step('FAQ 互斥：展開第二題時第一題收合，使用說明不受影響', async () => {
      const [guide, first, second] = [
        ...canvasElement.querySelectorAll<AuiAccordion>('aui-accordion'),
      ];
      await userEvent.click(inShadow(first, 'summary'));
      await waitFor(() => expect(first.open).toBe(true));
      await userEvent.click(inShadow(second, 'summary'));
      await waitFor(() => expect(second.open).toBe(true));
      await waitFor(() => expect(first.open).toBe(false));
      await expect(guide.open).toBe(true);
    });

    await step('相關工具以卡片格線呈現，無橫向溢位', async () => {
      const grid = query(canvasElement, '.card-grid');
      await expect(grid.querySelectorAll('aui-card').length).toBe(3);
      await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
    });

    await ToastService.closeAll();
  },
};
