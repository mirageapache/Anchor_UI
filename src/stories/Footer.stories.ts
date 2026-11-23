import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/footer/index.js';
import type { FooterColumn } from '../components/footer/footer.types.js';

interface FooterStoryArgs {
  copyrightHolder: string;
  copyrightSince: number;
  version: string;
  withColumns: boolean;
}

const COLUMNS: FooterColumn[] = [
  {
    heading: '產品',
    links: [
      { label: '元件', href: '#' },
      { label: '設計 Token', href: '#' },
      { label: '更新紀錄', href: '#' },
    ],
  },
  {
    heading: '資源',
    links: [
      { label: '快速開始', href: '#' },
      { label: 'Storybook', href: '#' },
      { label: 'GitHub', href: 'https://github.com/mirageapache/Anchor_UI', external: true },
    ],
  },
  {
    heading: '支援',
    links: [
      {
        label: '問題回報',
        href: 'https://github.com/mirageapache/Anchor_UI/issues',
        external: true,
      },
      { label: '升級指南', href: '#' },
    ],
  },
];

const githubIcon = html`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path
      d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"
    ></path>
  </svg>
`;

const meta: Meta<FooterStoryArgs> = {
  title: 'Components/Footer',
  component: 'aui-footer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Anchor UI — Footer 通用頁尾 (\`<aui-footer>\`)**

版權宣告、專案版本、次要選單（\`links\` slot）與社群連結（\`social\` slot）。
沒有 \`columns\` 時為簡潔單列（Minimal）；以 property 設定 \`columns\`（\`[{ heading, links: [{ label, href, external? }] }]\`）時上方加上多欄導覽（Columns）。
設定 \`copyright-holder\` 即顯示「© 今年 名稱」，\`copyright-since\` 早於今年時顯示為範圍；要自訂整段文字時使用 \`copyright\` slot。
響應式斷點以 Footer 自身寬度判斷：小於 640px 時版權列改為直向堆疊。
        `,
      },
    },
  },
  argTypes: {
    copyrightHolder: { control: 'text', description: '版權所有者' },
    copyrightSince: { control: 'number', description: '版權起始年份' },
    version: { control: 'text', description: '專案版本' },
    withColumns: { control: 'boolean', description: '是否設定 columns（多欄版型）' },
  },
  args: {
    copyrightHolder: 'Anchor UI',
    copyrightSince: 2024,
    version: '1.0.0',
    withColumns: true,
  },
};

export default meta;
type Story = StoryObj<FooterStoryArgs>;

const footer = (args: FooterStoryArgs) => html`
  <aui-footer
    copyright-holder=${args.copyrightHolder}
    copyright-since=${args.copyrightSince}
    version=${args.version}
    .columns=${args.withColumns ? COLUMNS : []}
  >
    <a slot="links" href="#">隱私權政策</a>
    <a slot="links" href="#">使用條款</a>
    <a slot="social" href="https://github.com/mirageapache/Anchor_UI" aria-label="GitHub">
      ${githubIcon}
    </a>
  </aui-footer>
`;

export const Columns: Story = {
  render: (args) => footer(args),
};

export const Minimal: Story = {
  args: { withColumns: false },
  render: (args) => footer(args),
};

export const StickyPageBottom: Story = {
  name: 'Page bottom (flex layout)',
  args: { withColumns: false },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; min-height: 100vh;">
      <main style="padding: 24px;">
        <p style="margin: 0;">內容較少時，Footer 以 margin-top: auto 被推到頁面底部。</p>
      </main>
      ${footer(args)}
    </div>
  `,
};
