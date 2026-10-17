import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/field/index.js';
import '../components/input/index.js';
import '../components/output/index.js';
import '../components/segmented/index.js';
import '../components/button/index.js';

interface FieldStoryArgs {
  label: string;
  description: string;
  copyable: boolean;
  clearable: boolean;
  value: string;
  multiline: boolean;
}

const meta: Meta<FieldStoryArgs> = {
  title: 'Components/Field',
  component: 'aui-field',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Field 表單欄位容器 (\`<aui-field>\`)**

上方標題列（左側標題、右側快捷複製／清除按鈕，沿用 \`<aui-icon-button>\`），下方為 \`<aui-input>\` 與次要描述。
標題與描述會傳入輸入框，在輸入框自身的 Shadow DOM 內完成無障礙關聯，螢幕閱讀器會將其讀為輸入框的名稱與描述；
點擊標題即聚焦輸入框。清除鈕會分派 \`input\` / \`change\`，與框架的雙向綁定保持同步。
        `,
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: '欄位標題（輸入框的無障礙名稱）' },
    description: { control: 'text', description: '次要描述（輸入框的無障礙描述）' },
    copyable: {
      control: 'boolean',
      description: '顯示複製鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    clearable: {
      control: 'boolean',
      description: '顯示清除鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    value: { control: 'text', description: '輸入框預設值' },
    multiline: { control: 'boolean', description: '輸入框是否為多行' },
  },
  args: {
    label: 'Input',
    description: '貼上任意文字進行編碼',
    copyable: true,
    clearable: true,
    value: 'Hello, Anchor UI!',
    multiline: false,
  },
};

export default meta;
type Story = StoryObj<FieldStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width: 480px;">
      <aui-field
        label=${args.label}
        description=${args.description}
        ?copyable=${args.copyable}
        ?clearable=${args.clearable}
      >
        <aui-input value=${args.value} ?multiline=${args.multiline}></aui-input>
      </aui-field>
    </div>
  `,
};

export const Layouts: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 480px;">
      <aui-field label="只有標題">
        <aui-input placeholder="Type here"></aui-input>
      </aui-field>
      <aui-field label="Access token" description="可於帳號設定頁面取得" copyable clearable>
        <aui-input value="tok_9f8e7d6c5b4a"></aui-input>
      </aui-field>
      <aui-field label="Request body" description="僅接受 JSON" copyable>
        <aui-input multiline rows="4" value=${'{\n  "ok": true\n}'}></aui-input>
      </aui-field>
      <aui-field label="唯讀結果" copyable clearable>
        <aui-input value="readonly 時清除鈕自動停用" readonly></aui-input>
      </aui-field>
    </div>
  `,
};

export const CustomActions: Story = {
  name: 'Custom actions',
  render: () => {
    const generate = (event: Event) => {
      const field = (event.target as HTMLElement).closest('aui-field')!;
      field.querySelector('aui-output')!.value = crypto.randomUUID();
    };
    return html`
      <div style="max-width: 480px;">
        <aui-field label="UUID" copyable>
          <aui-button slot="actions" size="sm" variant="ghost" @click=${generate}>產生</aui-button>
          <aui-output placeholder="按下「產生」建立 UUID"></aui-output>
        </aui-field>
      </div>
    `;
  },
};

export const InputToOutput: Story = {
  name: 'Input → Output',
  render: () => {
    /** 以 UTF-8 進行 Base64 編碼 */
    const encode = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
    /** 解碼失敗時顯示錯誤狀態 */
    const decode = (text: string) => {
      const bytes = Uint8Array.from(atob(text.trim()), (char) => char.charCodeAt(0));
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    };
    const convert = (event: Event) => {
      const root = (event.target as HTMLElement).closest('.demo')!;
      const input = root.querySelector('aui-input')!;
      const mode = root.querySelector('aui-segmented')!.value;
      const output = root.querySelector('aui-output')!;
      if (!input.value) {
        output.value = '';
        return;
      }
      try {
        output.value = mode === 'encode' ? encode(input.value) : decode(input.value);
        output.status = 'success';
      } catch {
        output.value = '無效的 Base64 輸入';
        output.status = 'error';
      }
    };
    return html`
      <div
        class="demo"
        style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;"
        @input=${convert}
        @change=${convert}
      >
        <aui-field label="Mode">
          <aui-segmented
            .options=${[
              { value: 'encode', label: '編碼' },
              { value: 'decode', label: '解碼' },
            ]}
            value="encode"
          ></aui-segmented>
        </aui-field>
        <aui-field label="Input" clearable>
          <aui-input multiline placeholder="輸入文字…"></aui-input>
        </aui-field>
        <aui-field label="Output" description="Base64 轉換結果" copyable>
          <aui-output placeholder="結果會顯示在這裡"></aui-output>
        </aui-field>
      </div>
    `;
  },
};
