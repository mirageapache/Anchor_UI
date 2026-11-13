import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/modal/index.js';
import '../components/button/index.js';
import '../components/field/index.js';
import '../components/input/index.js';
import type { AuiModal } from '../components/modal/modal.js';
import type { ModalHideDetail, ModalSize } from '../components/modal/modal.types.js';

interface ModalStoryArgs {
  heading: string;
  size: ModalSize;
  closeOnEscape: boolean;
  closeOnBackdrop: boolean;
  noCloseButton: boolean;
}

/** 找到同一個 story 中的 modal 並開啟 */
const openNearestModal = (event: Event) => {
  const root = (event.currentTarget as HTMLElement).closest('.story')!;
  root.querySelector<AuiModal>('aui-modal')!.open = true;
};

const closeNearestModal = (event: Event) => {
  void (event.currentTarget as HTMLElement).closest<AuiModal>('aui-modal')!.hide();
};

const meta: Meta<ModalStoryArgs> = {
  title: 'Components/Modal',
  component: 'aui-modal',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Modal 通用彈窗外框容器 (\`<aui-modal>\`)**

以原生 \`<dialog>.showModal()\` 進入 Top Layer，背景自動 inert，並以 \`::backdrop\` 呈現模糊遮罩。
提供 sm / md / lg 三種寬度與 Header / Body / Footer 插槽（沒有內容的頁首與頁尾不顯示）。
ESC 與點擊遮罩可關閉（皆可停用）；\`aui-hide\` 可取消並帶有關閉原因（\`escape\`、\`backdrop\`、\`close-button\`、\`api\`）。
開啟時鎖定背景捲動，關閉後焦點返還至觸發元素；內容中帶 \`autofocus\` 的元素會取得初始焦點。
        `,
      },
    },
  },
  argTypes: {
    heading: { control: 'text', description: '標題（同時作為無障礙名稱）' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '面板最大寬度（420 / 600 / 840px）',
      table: { defaultValue: { summary: 'md' } },
    },
    closeOnEscape: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    closeOnBackdrop: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    noCloseButton: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
  },
  args: {
    heading: '編輯設定',
    size: 'md',
    closeOnEscape: true,
    closeOnBackdrop: true,
    noCloseButton: false,
  },
};

export default meta;
type Story = StoryObj<ModalStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div class="story">
      <aui-button @click=${openNearestModal}>開啟 Modal</aui-button>
      <aui-modal
        heading=${args.heading}
        .size=${args.size}
        .closeOnEscape=${args.closeOnEscape}
        .closeOnBackdrop=${args.closeOnBackdrop}
        ?no-close-button=${args.noCloseButton}
      >
        <aui-field label="Name">
          <aui-input value="Anchor UI" autofocus></aui-input>
        </aui-field>
        <aui-button slot="footer" variant="ghost" @click=${closeNearestModal}>取消</aui-button>
        <aui-button slot="footer" @click=${closeNearestModal}>儲存</aui-button>
      </aui-modal>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px;">
      ${(['sm', 'md', 'lg'] as const).map(
        (size) => html`
          <div class="story">
            <aui-button variant="ghost" @click=${openNearestModal}>${size}</aui-button>
            <aui-modal heading=${`Size: ${size}`} size=${size}>
              <p style="margin: 0;">面板最大寬度依 size 而定。</p>
            </aui-modal>
          </div>
        `,
      )}
    </div>
  `,
};

export const ScrollableBody: Story = {
  name: 'Scrollable body',
  render: () => html`
    <div class="story">
      <aui-button @click=${openNearestModal}>開啟長內容</aui-button>
      <aui-modal heading="服務條款" size="lg">
        ${Array.from(
          { length: 30 },
          (_, i) =>
            html`<p>第 ${i + 1} 條：內容超出視窗高度時，只有內容區會捲動，頁首與頁尾保持固定。</p>`,
        )}
        <aui-button slot="footer" @click=${closeNearestModal}>我同意</aui-button>
      </aui-modal>
    </div>
  `,
};

export const Nested: Story = {
  render: () => html`
    <div class="story">
      <aui-button @click=${openNearestModal}>開啟外層</aui-button>
      <aui-modal heading="外層 Modal">
        <div class="story">
          <p style="margin-top: 0;">巢狀開啟時，ESC 只會關閉最上層；捲動鎖定會正確計數。</p>
          <aui-button @click=${openNearestModal}>開啟內層</aui-button>
          <aui-modal heading="內層 Modal" size="sm">
            <p style="margin: 0;">關閉後焦點會回到「開啟內層」按鈕。</p>
          </aui-modal>
        </div>
      </aui-modal>
    </div>
  `,
};

export const CloseReasons: Story = {
  name: 'Close reasons (aui-hide)',
  render: () => {
    const log = (event: Event) => {
      const reason = (event as CustomEvent<ModalHideDetail>).detail.reason;
      const output = (event.currentTarget as HTMLElement)
        .closest('.story')!
        .querySelector('output')!;
      output.textContent = `最近一次關閉原因：${reason}`;
    };
    return html`
      <div class="story">
        <aui-button @click=${openNearestModal}>開啟</aui-button>
        <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
        <aui-modal heading="試試不同的關閉方式" @aui-hide=${log}>
          <p style="margin: 0;">按 ESC、點擊遮罩、點擊右上角或下方按鈕關閉。</p>
          <aui-button slot="footer" @click=${closeNearestModal}>以 hide() 關閉</aui-button>
        </aui-modal>
      </div>
    `;
  },
};
