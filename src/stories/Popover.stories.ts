import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/popover/index.js';
import '../components/button/index.js';
import '../components/icon-button/index.js';
import '../components/navbar/index.js';
import '../components/tag/index.js';
import type { AuiPopover } from '../components/popover/popover.js';
import type { PopoverPlacement } from '../components/popover/popover.types.js';
import { deepActiveElement, query } from './play-utils.js';

interface PopoverStoryArgs {
  placement: PopoverPlacement;
  label: string;
  distance: number;
}

const meta: Meta<PopoverStoryArgs> = {
  title: 'Components/Popover',
  component: 'aui-popover',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Popover 彈出面板 (\`<aui-popover>\`)**

點擊觸發、承載可互動內容（清單、連結、按鈕）的非強制回應浮層，例如導覽列的通知清單、使用者資訊面板。
只有說明文字時請改用 Tooltip（\`role="tooltip"\` 不適合放互動內容）。

- 觸發元素放在 \`trigger\` slot（\`<aui-button>\`、\`<aui-icon-button>\` 或原生 \`<button>\`），會帶有 \`aria-expanded\`、\`aria-haspopup="dialog"\` 與 \`aria-controls\`。
- 面板為非強制回應的 \`role="dialog"\`，名稱取自 \`label\`，未設定時取自觸發元素；面板以 Popover API 進入 Top Layer，位置自動避開視窗邊緣。
- 開啟後焦點移入面板（第一個可聚焦的元素，有 \`autofocus\` 者優先）；ESC 或再次點擊觸發元素關閉並把焦點還給觸發元素，點擊外部或以 Tab 離開也會關閉。
- \`aui-hide\` / \`aui-after-hide\` 的 \`detail.reason\` 為關閉原因（\`trigger\`、\`escape\`、\`outside\`、\`focus-out\`、\`api\`）。
`,
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: '面板相對於觸發元素的方位',
      table: { defaultValue: { summary: 'bottom-start' } },
    },
    label: { control: 'text', description: '面板的無障礙名稱（未設定時取自觸發元素）' },
    distance: { control: 'number', description: '與觸發元素的距離（px）' },
  },
  args: {
    placement: 'bottom-start',
    label: '',
    distance: 8,
  },
};

export default meta;
type Story = StoryObj<PopoverStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="padding: 24px 24px 200px;">
      <aui-popover placement=${args.placement} label=${args.label} distance=${args.distance}>
        <aui-button slot="trigger" variant="ghost">開啟面板</aui-button>
        <div style="display: grid; gap: 8px; max-width: 240px;">
          <strong>面板標題</strong>
          <span>面板可以放連結、按鈕等互動內容。</span>
          <aui-button size="sm">確定</aui-button>
        </div>
      </aui-popover>
    </div>
  `,
};

const bellIcon = html`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
`;

/** 導覽列的通知清單：圖示按鈕觸發，面板內為通知連結與「全部標為已讀」 */
export const NavbarNotifications: Story = {
  render: () => html`
    <div style="min-height: 320px;">
      <aui-navbar brand="Anchor UI" brand-href="#" no-search>
        <a href="#tools">工具</a>
        <a href="#docs">文件</a>
        <aui-popover slot="actions" label="通知" placement="bottom-end">
          <aui-icon-button slot="trigger" label="通知" variant="ghost">${bellIcon}</aui-icon-button>
          <div style="display: grid; gap: 4px; width: 280px;">
            <strong style="padding: 4px 8px;">通知</strong>
            <a href="#build" style="padding: 4px 8px;">建置完成：v1.1.0</a>
            <a href="#review" style="padding: 4px 8px;">有 2 個待審查的 PR</a>
            <aui-button size="sm" variant="ghost">全部標為已讀</aui-button>
          </div>
        </aui-popover>
      </aui-navbar>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const popover = query<AuiPopover>(canvasElement, 'aui-popover');
    const trigger = query(popover, '[slot="trigger"]');

    await step('點擊通知鈕：面板開啟，焦點移到第一則通知', async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(popover.open).toBe(true));
      await waitFor(() => expect(deepActiveElement()).toBe(query(popover, 'a[href="#build"]')));
    });

    await step('ESC：面板關閉，焦點回到通知鈕', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(popover.open).toBe(false));
      // 焦點在圖示按鈕內部的 <button>：document.activeElement 為其 host
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
  },
};

/** 使用者資訊面板：一般按鈕觸發，面板顯示帳號資訊與操作 */
export const UserPanel: Story = {
  render: () => html`
    <div style="padding: 24px 24px 220px; display: flex; justify-content: flex-end;">
      <aui-popover placement="bottom-end">
        <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
        <div style="display: grid; gap: 8px; width: 240px;">
          <div style="display: grid; gap: 2px;">
            <strong>王小明</strong>
            <span style="color: var(--color-text-secondary);">ming@example.com</span>
          </div>
          <aui-tag variant="brand">管理員</aui-tag>
          <aui-button size="sm" variant="ghost">登出</aui-button>
        </div>
      </aui-popover>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const popover = query<AuiPopover>(canvasElement, 'aui-popover');

    await step('點擊外部關閉', async () => {
      await userEvent.click(query(popover, '[slot="trigger"]'));
      await waitFor(() => expect(popover.open).toBe(true));
      await userEvent.click(canvasElement);
      await waitFor(() => expect(popover.open).toBe(false));
    });
  },
};
