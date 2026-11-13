import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/output/index.js';
import type { OutputStatus } from '../components/output/output.types.js';

interface OutputStoryArgs {
  value: string;
  status: OutputStatus;
  placeholder: string;
  label: string;
}

const meta: Meta<OutputStoryArgs> = {
  title: 'Components/Output',
  component: 'aui-output',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Output 結果輸出框 (\`<aui-output>\`)**

展示運算或轉換結果的等寬文字框，左側 4px 語意邊條（翠綠成功／琥珀警告／珊瑚紅錯誤）。
長文字保留換行並可於任意位置斷行，不產生橫向溢位。狀態除顏色外，另以圖示與螢幕閱讀器前綴文字（「成功：」／「警告：」／「錯誤：」）傳達；
結果框為 \`role="status"\` 的 live region，結果更新時以禮貌模式播報。可置於 \`<aui-field>\` 內取得標題與複製鈕。
        `,
      },
    },
  },
  argTypes: {
    value: { control: 'text', description: '結果文字（保留換行與空白）' },
    status: {
      control: 'inline-radio',
      options: ['success', 'warning', 'error'],
      description: '結果狀態',
      table: { defaultValue: { summary: 'success' } },
    },
    placeholder: { control: 'text', description: '沒有結果時的提示文字' },
    label: { control: 'text', description: '無障礙名稱（不顯示）' },
  },
  args: {
    value: 'SGVsbG8sIEFuY2hvciBVSSE=',
    status: 'success',
    placeholder: '結果會顯示在這裡',
    label: '轉換結果',
  },
};

export default meta;
type Story = StoryObj<OutputStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width: 480px;">
      <aui-output
        .value=${args.value}
        .status=${args.status}
        placeholder=${args.placeholder}
        label=${args.label}
      ></aui-output>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
      <aui-output value="SGVsbG8sIEFuY2hvciBVSSE="></aui-output>
      <aui-output status="warning" value="輸入含有非 ASCII 字元，已以 UTF-8 編碼"></aui-output>
      <aui-output status="error" value="無效的 Base64 輸入"></aui-output>
      <aui-output placeholder="結果會顯示在這裡"></aui-output>
    </div>
  `,
};

export const LongText: Story = {
  name: 'Long text',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
      <aui-output
        value="https://example.com/a/very/long/url/without/any/spaces/that/must/wrap/safely?token=9f8e7d6c5b4a3f2e1d0c"
      ></aui-output>
      <aui-output
        status="error"
        .value=${'SyntaxError: Unexpected token } in JSON\n  at line 3, column 14'}
      ></aui-output>
    </div>
  `,
};
