import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/button/index.js';
import type { ButtonSize, ButtonType, ButtonVariant } from '../components/button/button.types.js';

interface ButtonStoryArgs {
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  type: ButtonType;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
}

const meta: Meta<ButtonStoryArgs> = {
  title: 'Components/Button',
  component: 'aui-button',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Button 通用按鈕 (\`<aui-button>\`)**

系統中最核心的互動原子元件，支援 4 種語意層級變體、3 種尺寸階層、符合 40px 最低觸控規範，
具備點擊微縮放動態（scale 0.98）、雙層無障礙焦點環，並內建 Loading 旋轉指示器與表單提交連動能力。
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'accent', 'danger', 'ghost'],
      description: '按鈕語意層級變體',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '按鈕尺寸（sm: 32px, md: 40px, lg: 48px）',
      table: { defaultValue: { summary: 'md' } },
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset'],
      description: '原生表單按鈕行為型態',
      table: { defaultValue: { summary: 'button' } },
    },
    disabled: {
      control: 'boolean',
      description: '是否處於停用狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: '是否處於載入狀態（顯示 Spinner 並阻止點擊）',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: '是否撐滿容器 100% 寬度',
      table: { defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'text',
      description: '按鈕顯示文字內容（Slot 預設內容）',
    },
  },
  args: {
    label: '主要操作按鈕',
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <aui-button
      .variant=${args.variant}
      .size=${args.size}
      .type=${args.type}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
    >
      ${args.label}
    </aui-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
      <aui-button variant="primary">Primary (海軍藍)</aui-button>
      <aui-button variant="success">Success (翡翠綠)</aui-button>
      <aui-button variant="accent">Accent (琥珀金)</aui-button>
      <aui-button variant="danger">Danger (危險操作)</aui-button>
      <aui-button variant="ghost">Ghost (線框次要)</aui-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
      <aui-button size="sm">Small (32px)</aui-button>
      <aui-button size="md">Medium (40px - 預設)</aui-button>
      <aui-button size="lg">Large (48px)</aui-button>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          NORMAL 正常態
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <aui-button variant="primary">Primary</aui-button>
          <aui-button variant="success">Success</aui-button>
          <aui-button variant="accent">Accent</aui-button>
          <aui-button variant="ghost">Ghost</aui-button>
          <aui-button variant="danger">Danger</aui-button>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          LOADING 載入態（防止重複點擊與旋轉回饋）
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <aui-button variant="primary" loading>處理中...</aui-button>
          <aui-button variant="success" loading>儲存中...</aui-button>
          <aui-button variant="accent" loading>轉檔中...</aui-button>
          <aui-button variant="danger" loading>刪除中...</aui-button>
          <aui-button variant="ghost" loading>載入中...</aui-button>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          DISABLED 停用態（透明度 50% 且中斷互動）
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <aui-button variant="primary" disabled>不可操作</aui-button>
          <aui-button variant="success" disabled>已成功</aui-button>
          <aui-button variant="accent" disabled>功能未解鎖</aui-button>
          <aui-button variant="danger" disabled>無法刪除</aui-button>
          <aui-button variant="ghost" disabled>次要停用</aui-button>
        </div>
      </div>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
      <aui-button variant="primary">
        <svg
          slot="prefix"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        下載報告 (Prefix)
      </aui-button>

      <aui-button variant="accent">
        產生金鑰
        <svg
          slot="suffix"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </aui-button>

      <aui-button variant="ghost">
        <svg
          slot="prefix"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        複製內容
      </aui-button>

      <aui-button variant="danger">
        <svg
          slot="prefix"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
        </svg>
        永久移除
      </aui-button>

      <aui-button variant="success">
        <svg
          slot="prefix"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        儲存變更 (Success)
      </aui-button>
    </div>
  `,
};

export const FullWidth: Story = {
  render: () => html`
    <div
      style="max-width: 380px; padding: 24px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); display: flex; flex-direction: column; gap: 12px;"
    >
      <div style="font-weight: 600; color: var(--color-text-primary); font-size: var(--text-base);">
        容器寬度適應 (Full Width)
      </div>
      <p style="font-size: var(--text-xs); color: var(--color-text-secondary); margin: 0;">
        開啟 <code>full-width</code> 屬性時，按鈕將以
        <code>display: block; width: 100%;</code> 填滿父容器。
      </p>
      <aui-button variant="primary" full-width>確認送出訂單</aui-button>
      <aui-button variant="ghost" full-width>返回上一頁</aui-button>
    </div>
  `,
};
