import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/toast/index.js';
import '../components/button/index.js';
import '../components/modal/index.js';
import { ToastService } from '../components/toast/toast-service.js';
import { AlertService } from '../components/alert/alert-service.js';
import type { AuiModal } from '../components/modal/modal.js';
import type { ToastVariant } from '../components/toast/toast.types.js';

interface ToastStoryArgs {
  variant: ToastVariant;
  title: string;
  message: string;
  duration: number;
}

const meta: Meta<ToastStoryArgs> = {
  title: 'Components/Toast',
  component: 'aui-toast',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Toast 通知 (\`<aui-toast>\`, \`ToastService\`)**

右下角堆疊的全域通知（Popover API 進入 Top Layer），支援 Success、Error、Warning、Info、Loading 5 種狀態。
\`ToastService\` 為全頁單例（\`globalThis[Symbol.for('anchor-ui.toast@1')]\`）：佇列與同時顯示上限、各狀態預設停留時間、
以 \`handle.update()\` 或相同 \`id\` 更新既有通知（如 Loading 轉 Success）。
以 live region 播報（Error 為 \`role="alert"\`，其餘為 \`role="status"\`）；滑鼠停在通知上或焦點位於通知內時暫停自動關閉。
Modal / Alert 開啟期間通知會移入最上層 modal，仍可見、可操作且可被播報。
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['success', 'error', 'warning', 'info', 'loading'],
    },
    title: { control: 'text' },
    message: { control: 'text' },
    duration: {
      control: { type: 'number', min: 0, step: 500 },
      description: '自動關閉時間（毫秒）；0 為不自動關閉；空白則依狀態使用預設值',
    },
  },
  args: {
    variant: 'success',
    title: '',
    message: '複製成功',
    duration: 3000,
  },
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <aui-button
      @click=${() =>
        ToastService.show({
          variant: args.variant,
          title: args.title || undefined,
          message: args.message,
          duration: args.duration,
        })}
      >顯示通知</aui-button
    >
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <aui-button variant="success" @click=${() => ToastService.success('複製成功')}
        >success</aui-button
      >
      <aui-button
        variant="danger"
        @click=${() => ToastService.error('連線逾時，請稍後再試', { title: '上傳失敗' })}
        >error</aui-button
      >
      <aui-button variant="accent" @click=${() => ToastService.warning('儲存空間即將用盡')}
        >warning</aui-button
      >
      <aui-button variant="ghost" @click=${() => ToastService.info('有新版本可以更新')}
        >info</aui-button
      >
      <aui-button
        variant="ghost"
        @click=${() => ToastService.loading('處理中…', { duration: 3000 })}
        >loading</aui-button
      >
    </div>
  `,
};

export const LoadingToSuccess: Story = {
  name: 'Loading → Success',
  render: () => html`
    <aui-button
      @click=${() => {
        const upload = ToastService.loading('上傳中…');
        setTimeout(() => upload.update({ variant: 'success', message: '上傳完成' }), 1500);
      }}
      >模擬上傳</aui-button
    >
  `,
};

export const Queue: Story = {
  name: 'Queue & max visible',
  render: () => html`
    <aui-button
      @click=${() => {
        for (let i = 1; i <= 6; i++) ToastService.info(`第 ${i} 則通知`, { duration: 2000 });
      }}
      >連續觸發 6 則（同時最多 3 則）</aui-button
    >
  `,
};

export const SameId: Story = {
  name: 'Same id (no stacking)',
  render: () => html`
    <aui-button @click=${() => ToastService.success('已複製到剪貼簿', { id: 'copy' })}
      >重複點擊只會更新同一則</aui-button
    >
  `,
};

export const AboveModal: Story = {
  name: 'Above Modal / Alert',
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
      <aui-modal heading="編輯">
        <p style="margin-top: 0;">
          Modal 開啟期間，通知會移入 Modal 的子樹，仍可見、可操作且可被螢幕閱讀器播報。
        </p>
        <div style="display: flex; gap: 8px;">
          <aui-button @click=${() => ToastService.success('已儲存草稿')}>顯示通知</aui-button>
          <aui-button
            variant="ghost"
            @click=${async () => {
              ToastService.info('Alert 開啟時通知仍在最上層', { duration: 6000 });
              await AlertService.confirm({ title: '確定要離開嗎？' });
            }}
            >通知 + Alert</aui-button
          >
        </div>
      </aui-modal>
    </div>
  `,
};

export const Static: Story = {
  name: 'Static <aui-toast>',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 380px;">
      <aui-toast variant="success" heading="已儲存" message="直接放在頁面上的靜態卡片"></aui-toast>
      <aui-toast variant="error" message="點擊關閉鈕只會分派 aui-close" no-close-button></aui-toast>
    </div>
  `,
};
