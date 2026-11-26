import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect } from 'storybook/test';
import { html } from 'lit';
import '../components/breadcrumb/index.js';
import '../components/header/index.js';
import type { BreadcrumbItem } from '../components/breadcrumb/breadcrumb.types.js';
import { query } from './play-utils.js';

interface BreadcrumbStoryArgs {
  label: string;
  separator: string;
}

const trail: BreadcrumbItem[] = [
  { label: '首頁', href: '#home' },
  { label: '開發工具', href: '#tools' },
  { label: 'JSON 格式化' },
];

const meta: Meta<BreadcrumbStoryArgs> = {
  title: 'Components/Breadcrumb',
  component: 'aui-breadcrumb',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Breadcrumb 麵包屑導覽 (\`<aui-breadcrumb>\`)**

頁首的階層導覽：以 \`items\`（\`{ label, href }\` 陣列）傳入從首頁到目前頁面的各層，最後一層為目前頁面。

- \`<nav>\` landmark（名稱取自 \`label\`）內的有序清單；目前頁面帶 \`aria-current="page"\`，分隔符號不會被讀出。
- \`href\` 只接受 http(s)、\`mailto:\`、\`tel:\` 與相對路徑，其他協定與省略 \`href\` 的層級為純文字。
- 空間不足時在分隔符號前後換行；可放進 \`<aui-header>\` 的 \`breadcrumb\` slot。
`,
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: '導覽區的無障礙名稱' },
    separator: { control: 'text', description: '分隔符號（不會被讀出）' },
  },
  args: {
    label: '麵包屑',
    separator: '/',
  },
};

export default meta;
type Story = StoryObj<BreadcrumbStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <aui-breadcrumb
      .items=${trail}
      label=${args.label}
      separator=${args.separator}
    ></aui-breadcrumb>
  `,
  play: async ({ canvasElement }) => {
    const breadcrumb = query(canvasElement, 'aui-breadcrumb');
    const current = breadcrumb.shadowRoot!.querySelectorAll('[aria-current="page"]');
    await expect(current).toHaveLength(1);
    await expect(current[0].textContent).toBe('JSON 格式化');
  },
};

/** 放進工具頁標頭的 breadcrumb slot */
export const InHeader: Story = {
  render: () => html`
    <div style="max-width: 640px;">
      <aui-header
        heading="JSON 格式化"
        description="格式化、驗證與壓縮 JSON，所有運算都在瀏覽器內完成。"
      >
        <aui-breadcrumb slot="breadcrumb" .items=${trail}></aui-breadcrumb>
      </aui-header>
    </div>
  `,
};
