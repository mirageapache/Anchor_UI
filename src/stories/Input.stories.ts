import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/input/index.js';
import '../components/button/index.js';
import type { InputType } from '../components/input/input.types.js';

interface InputStoryArgs {
  value: string;
  placeholder: string;
  label: string;
  description: string;
  type: InputType;
  multiline: boolean;
  rows: number;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  invalid: boolean;
}

const meta: Meta<InputStoryArgs> = {
  title: 'Components/Input',
  component: 'aui-input',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Input 等寬輸入框 (\`<aui-input>\`)**

以 JetBrains Mono 呈現的單行／多行文字輸入框，具備 Focus 雙層光環（品牌色邊框 + 3px 淡色光暈）與錯誤狀態。
為 form-associated custom element：可參與原生 \`<form>\` 提交、\`required\` 驗證、\`form.reset()\` 與 \`<fieldset disabled>\`，
並於 host 分派 \`input\` / \`change\` 事件（觸發時 \`value\` 已更新），可直接搭配 Vue \`v-model\` 與 Angular \`ngModel\`。

\`label\` / \`description\` 僅供螢幕閱讀器使用；需要畫面上的標題時請搭配 \`<aui-field>\`。
        `,
      },
    },
  },
  argTypes: {
    value: { control: 'text', description: '預設值（HTML 的 value 屬性）' },
    placeholder: { control: 'text', description: '佔位提示文字' },
    label: { control: 'text', description: '無障礙名稱（不顯示）' },
    description: { control: 'text', description: '無障礙描述（不顯示）' },
    type: {
      control: 'select',
      options: ['text', 'email', 'url', 'search', 'tel', 'password'],
      description: '單行輸入的原生類型',
      table: { defaultValue: { summary: 'text' } },
    },
    multiline: {
      control: 'boolean',
      description: '是否為多行輸入（textarea）',
      table: { defaultValue: { summary: 'false' } },
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: '多行輸入的預設可見行數',
      table: { defaultValue: { summary: '3' } },
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    readOnly: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    invalid: {
      control: 'boolean',
      description: '以錯誤狀態呈現（紅色邊框與 aria-invalid）',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    value: '',
    placeholder: '輸入或貼上文字…',
    label: '輸入內容',
    description: '',
    type: 'text',
    multiline: false,
    rows: 3,
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
  },
};

export default meta;
type Story = StoryObj<InputStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width: 420px;">
      <aui-input
        value=${args.value}
        placeholder=${args.placeholder}
        label=${args.label}
        description=${args.description}
        .type=${args.type}
        ?multiline=${args.multiline}
        rows=${args.rows}
        ?disabled=${args.disabled}
        ?readonly=${args.readOnly}
        ?required=${args.required}
        ?invalid=${args.invalid}
      ></aui-input>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;">
      <aui-input label="空值" placeholder="Placeholder 佔位提示"></aui-input>
      <aui-input label="已填寫" value="sk-live-4f9a2c7e"></aui-input>
      <aui-input label="錯誤" value="not-an-email" invalid></aui-input>
      <aui-input label="唯讀" value="唯讀內容可選取與複製" readonly></aui-input>
      <aui-input label="停用" value="停用中" disabled></aui-input>
    </div>
  `,
};

export const Multiline: Story = {
  render: () => html`
    <div style="max-width: 420px;">
      <aui-input
        label="JSON"
        multiline
        rows="6"
        value=${'{\n  "name": "anchor-ui",\n  "version": "0.1.0-alpha"\n}'}
      ></aui-input>
    </div>
  `,
};

export const FormParticipation: Story = {
  name: 'Form participation',
  render: () => {
    const showData = (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const output = form.querySelector('output')!;
      output.textContent = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);
    };
    return html`
      <form
        style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;"
        @submit=${showData}
      >
        <aui-input
          name="email"
          type="email"
          label="Email"
          placeholder="必填：name@example.com"
          required
        ></aui-input>
        <aui-input name="note" label="備註" value="預設值，reset 後還原" multiline></aui-input>
        <div style="display: flex; gap: 8px;">
          <aui-button type="submit">提交</aui-button>
          <aui-button type="reset" variant="ghost">重設</aui-button>
        </div>
        <output style="font-family: var(--font-mono); font-size: 12px; white-space: pre;"></output>
      </form>
    `;
  },
};
