import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/segmented/index.js';
import '../components/field/index.js';
import '../components/button/index.js';
import type { SegmentedOption } from '../components/segmented/segmented.types.js';

interface SegmentedStoryArgs {
  options: SegmentedOption[];
  value: string;
  label: string;
  disabled: boolean;
  required: boolean;
}

const MODES: SegmentedOption[] = [
  { value: 'encode', label: '編碼' },
  { value: 'decode', label: '解碼' },
];

const meta: Meta<SegmentedStoryArgs> = {
  title: 'Components/Segmented Control',
  component: 'aui-segmented',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Segmented Control 分段控制器 (\`<aui-segmented>\`)**

膠囊軌道單選切換器，選中項以品牌色實心高亮並平滑過渡，常用於編碼／解碼、格式或檢視模式切換。
採 WAI-ARIA radiogroup 模式：Tab 只停留在選中項，方向鍵、Home、End 巡覽並自動選取，停用的選項會被略過。
為 form-associated custom element，於 host 分派 \`input\` / \`change\`（觸發時 \`value\` 已更新），可直接搭配 Vue \`v-model\` 與 Angular \`ngModel\`。
        `,
      },
    },
  },
  argTypes: {
    options: { control: 'object', description: '選項清單：{ value, label, disabled? }[]' },
    value: { control: 'text', description: '預設選取的值（HTML 的 value 屬性）' },
    label: { control: 'text', description: '無障礙名稱（不顯示）' },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
  },
  args: {
    options: [...MODES, { value: 'auto', label: '自動偵測' }],
    value: 'encode',
    label: '轉換模式',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<SegmentedStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <aui-segmented
      .options=${args.options}
      value=${args.value}
      label=${args.label}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></aui-segmented>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
      <aui-segmented label="已選取" .options=${MODES} value="encode"></aui-segmented>
      <aui-segmented label="未選取" .options=${MODES}></aui-segmented>
      <aui-segmented
        label="含停用選項"
        .options=${[
          { value: 'json', label: 'JSON' },
          { value: 'yaml', label: 'YAML' },
          { value: 'xml', label: 'XML', disabled: true },
        ]}
        value="json"
      ></aui-segmented>
      <aui-segmented label="整組停用" .options=${MODES} value="decode" disabled></aui-segmented>
    </div>
  `,
};

export const InField: Story = {
  name: 'Inside <aui-field>',
  render: () => html`
    <div style="max-width: 480px;">
      <aui-field label="Mode" description="點擊標題會聚焦選中項">
        <aui-segmented .options=${MODES} value="encode"></aui-segmented>
      </aui-field>
    </div>
  `,
};

export const FormParticipation: Story = {
  name: 'Form participation',
  render: () => {
    const showData = (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      form.querySelector('output')!.textContent = JSON.stringify(
        Object.fromEntries(new FormData(form)),
      );
    };
    return html`
      <form
        style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;"
        @submit=${showData}
      >
        <aui-segmented
          name="mode"
          label="轉換模式（必填）"
          .options=${MODES}
          required
        ></aui-segmented>
        <aui-segmented
          name="format"
          label="輸出格式"
          .options=${[
            { value: 'text', label: 'Text' },
            { value: 'hex', label: 'Hex' },
          ]}
          value="text"
        ></aui-segmented>
        <div style="display: flex; gap: 8px;">
          <aui-button type="submit">提交</aui-button>
          <aui-button type="reset" variant="ghost">重設</aui-button>
        </div>
        <output style="font-family: var(--font-mono); font-size: 12px;"></output>
      </form>
    `;
  },
};
