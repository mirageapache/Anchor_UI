import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/alert/index.js';
import '../components/button/index.js';
import '../components/modal/index.js';
import { AlertService } from '../components/alert/alert-service.js';
import type { AuiAlert } from '../components/alert/alert.js';
import type { AuiModal } from '../components/modal/modal.js';
import type { AlertIcon, AlertMode } from '../components/alert/alert.types.js';

interface AlertStoryArgs {
  mode: AlertMode;
  icon: AlertIcon | '';
  heading: string;
  message: string;
  confirmText: string;
  cancelText: string;
  destructive: boolean;
  timer: number;
}

/** 在觸發元素所在的 story 中顯示最近一次的結果 */
const report = (from: Element, text: string) => {
  const output = from.closest('.story')!.querySelector('output');
  if (output) output.textContent = text;
};

const meta: Meta<AlertStoryArgs> = {
  title: 'Components/Alert',
  component: 'aui-alert',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Alert 提示與確認對話框 (\`<aui-alert>\`, \`AlertService\`)**

SweetAlert2 風格的提示、確認與輸入對話框，以 \`<aui-modal>\` 為外框（焦點、捲動鎖定、ESC 與遮罩關閉皆沿用 Modal），可於 Modal 內再開啟。
命令式呼叫：\`AlertService.alert()\` / \`confirm()\` / \`prompt()\` 回傳 Promise。
Enter 確認、ESC 取消；破壞性確認（\`destructive\`）的初始焦點落在取消鈕，避免誤按 Enter 執行操作。圖示動畫遵循減少動畫設定。
        `,
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['alert', 'confirm', 'prompt'] },
    icon: { control: 'select', options: ['', 'success', 'error', 'warning', 'info'] },
    heading: { control: 'text' },
    message: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    destructive: { control: 'boolean' },
    timer: {
      control: { type: 'number', min: 0, step: 500 },
      description: '自動關閉的等待時間（毫秒）；0 為不自動關閉。滑鼠停在對話框上時暫停',
      table: { defaultValue: { summary: '0' } },
    },
  },
  args: {
    mode: 'confirm',
    icon: 'warning',
    heading: '確定要刪除嗎？',
    message: '刪除後無法復原。',
    confirmText: '刪除',
    cancelText: '取消',
    destructive: true,
    timer: 0,
  },
};

export default meta;
type Story = StoryObj<AlertStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div class="story">
      <aui-button
        @click=${(event: Event) => {
          (event.currentTarget as HTMLElement)
            .closest('.story')!
            .querySelector<AuiAlert>('aui-alert')!.open = true;
        }}
        >開啟 Alert</aui-button
      >
      <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
      <aui-alert
        .mode=${args.mode}
        .icon=${args.icon || undefined}
        heading=${args.heading}
        message=${args.message}
        confirm-text=${args.confirmText}
        cancel-text=${args.cancelText}
        ?destructive=${args.destructive}
        .timer=${args.timer}
        @aui-confirm=${(event: CustomEvent<{ value: string }>) =>
          report(event.currentTarget as Element, `aui-confirm（value: "${event.detail.value}"）`)}
        @aui-cancel=${(event: CustomEvent<{ reason: string }>) =>
          report(event.currentTarget as Element, `aui-cancel（reason: ${event.detail.reason}）`)}
      ></aui-alert>
    </div>
  `,
};

export const Service: Story = {
  name: 'AlertService',
  render: () => html`
    <div class="story" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <aui-button
        variant="success"
        @click=${async (event: Event) => {
          const target = event.currentTarget as HTMLElement;
          await AlertService.alert({
            icon: 'success',
            title: '已儲存',
            message: '所有變更都已儲存。',
          });
          report(target, 'alert() 已關閉');
        }}
        >alert()</aui-button
      >
      <aui-button
        variant="danger"
        @click=${async (event: Event) => {
          const target = event.currentTarget as HTMLElement;
          const ok = await AlertService.confirm({
            icon: 'warning',
            title: '確定要刪除嗎？',
            message: '刪除後無法復原。',
            confirmText: '刪除',
            destructive: true,
          });
          report(target, `confirm() → ${ok}`);
        }}
        >confirm()</aui-button
      >
      <aui-button
        @click=${async (event: Event) => {
          const target = event.currentTarget as HTMLElement;
          const name = await AlertService.prompt({
            icon: 'info',
            title: '重新命名',
            defaultValue: 'report-final.pdf',
          });
          report(target, `prompt() → ${JSON.stringify(name)}`);
        }}
        >prompt()</aui-button
      >
      <aui-button
        variant="ghost"
        @click=${async (event: Event) => {
          const target = event.currentTarget as HTMLElement;
          await AlertService.alert({
            icon: 'success',
            title: '已複製',
            message: '3 秒後自動關閉（滑鼠移到對話框上會暫停）',
            timer: 3000,
          });
          report(target, 'alert({ timer: 3000 }) 已關閉');
        }}
        >timer: 3000</aui-button
      >
      <output style="font-family: var(--font-mono); font-size: 12px;"></output>
    </div>
  `,
};

export const Icons: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      ${(['success', 'error', 'warning', 'info'] as const).map(
        (icon) => html`
          <aui-button
            variant="ghost"
            @click=${() => AlertService.alert({ icon, title: icon, message: `${icon} 圖示` })}
            >${icon}</aui-button
          >
        `,
      )}
    </div>
  `,
};

export const InsideModal: Story = {
  name: 'Inside a modal',
  render: () => html`
    <div class="story">
      <aui-button
        @click=${(event: Event) => {
          (event.currentTarget as HTMLElement)
            .closest('.story')!
            .querySelector<AuiModal>('aui-modal')!.open = true;
        }}
        >開啟 Modal</aui-button
      >
      <aui-modal heading="編輯項目">
        <p style="margin-top: 0;">
          在 Modal 內呼叫 AlertService.confirm()：Alert 會疊在最上層，ESC 只關閉 Alert。
        </p>
        <aui-button
          variant="danger"
          @click=${async () => {
            await AlertService.confirm({
              icon: 'warning',
              title: '刪除此項目？',
              destructive: true,
              confirmText: '刪除',
            });
          }}
          >刪除</aui-button
        >
      </aui-modal>
    </div>
  `,
};
