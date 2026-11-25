import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect } from 'storybook/test';
import { html, nothing } from 'lit';
import '../components/card/index.js';
import '../components/tag/index.js';
import type { CardHeadingLevel } from '../components/card/card.types.js';
import { inShadow, query } from './play-utils.js';

interface CardStoryArgs {
  heading: string;
  description: string;
  href: string;
  hot: boolean;
  hotLabel: string;
  headingLevel: CardHeadingLevel;
  lines: number;
}

const meta: Meta<CardStoryArgs> = {
  title: 'Components/Card',
  component: 'aui-card',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Card 工具卡片 (\`<aui-card>\`)**

用於首頁或分類導覽的工具卡片，展示名稱、簡介（預設裁切為兩行）與標籤群。
設定 \`href\` 時整張卡片是一個連結，具備 Hover 微浮凸與外框高亮；\`hot\` 以琥珀色外框與文字徽標標示推薦項目。

多張卡片請放進 \`.card-grid\` 容器（由 \`@anchor-ui/core/styles.css\` 提供），會依**容器寬度**自動調整欄數，不需 Media Query。

放入 \`icon\` slot 時改為左右排版（左側圖示、右側內容），適合 KPI 卡片；純裝飾的圖示請加上 \`aria-hidden="true"\`。
`,
      },
    },
  },
  argTypes: {
    heading: { control: 'text', description: '卡片名稱（或使用 heading slot）' },
    description: { control: 'text', description: '簡介描述（或使用預設 slot）' },
    href: { control: 'text', description: '連結網址；設定後整張卡片成為連結' },
    hot: {
      control: 'boolean',
      description: 'HOT 推薦項目（琥珀色外框與徽標）',
      table: { defaultValue: { summary: 'false' } },
    },
    hotLabel: {
      control: 'text',
      description: 'HOT 徽標文字',
      table: { defaultValue: { summary: 'HOT' } },
    },
    headingLevel: {
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5, 6],
      description: '卡片名稱的標題層級',
      table: { defaultValue: { summary: '3' } },
    },
    lines: {
      control: { type: 'number', min: 0, max: 6 },
      description: '簡介最多顯示的行數，0 表示不裁切',
      table: { defaultValue: { summary: '2' } },
    },
  },
  args: {
    heading: 'JSON Formatter',
    description:
      'Format, validate and minify JSON documents with syntax highlighting, tree view and error location hints.',
    href: '#json',
    hot: false,
    hotLabel: 'HOT',
    headingLevel: 3,
    lines: 2,
  },
};

export default meta;
type Story = StoryObj<CardStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width: 320px;">
      <aui-card
        heading=${args.heading}
        description=${args.description}
        href=${args.href || nothing}
        ?hot=${args.hot}
        hot-label=${args.hotLabel}
        .headingLevel=${args.headingLevel}
        .lines=${args.lines}
      >
        <aui-tag slot="tags" variant="brand">json</aui-tag>
        <aui-tag slot="tags">format</aui-tag>
      </aui-card>
    </div>
  `,
};

const TOOLS = [
  {
    name: 'JSON Formatter',
    desc: 'Format, validate and minify JSON documents with syntax highlighting and error location hints.',
    tags: [
      ['brand', 'json'],
      ['neutral', 'format'],
    ],
    hot: true,
  },
  {
    name: 'UUID Generator',
    desc: 'Generate v4 / v7 UUIDs in bulk.',
    tags: [['purple', 'uuid']],
    hot: false,
  },
  {
    name: 'Base64',
    desc: 'Encode and decode Base64 text and files.',
    tags: [['success', 'encode']],
    hot: false,
  },
  {
    name: 'JWT Decoder',
    desc: 'Inspect the header, payload and signature of a JSON Web Token without sending it anywhere.',
    tags: [
      ['info', 'jwt'],
      ['neutral', 'security'],
    ],
    hot: true,
  },
  {
    name: 'Regex Tester',
    desc: 'Test regular expressions with live match highlighting.',
    tags: [['warning', 'regex']],
    hot: false,
  },
  {
    name: 'Hash Calculator',
    desc: 'MD5, SHA-1, SHA-256 and SHA-512 digests computed locally with WebAssembly.',
    tags: [
      ['purple', 'wasm'],
      ['neutral', 'hash'],
    ],
    hot: false,
  },
] as const;

const toolGrid = () => html`
  <ul class="card-grid">
    ${TOOLS.map(
      (tool) => html`
        <li>
          <aui-card heading=${tool.name} description=${tool.desc} href="#tool" ?hot=${tool.hot}>
            ${tool.tags.map(
              ([variant, label]) =>
                html`<aui-tag slot="tags" .variant=${variant}>${label}</aui-tag>`,
            )}
          </aui-card>
        </li>
      `,
    )}
  </ul>
`;

/** 內在響應式格線：欄數依容器寬度決定。拖曳右下角調整容器寬度觀察欄數變化。 */
export const ResponsiveGrid: Story = {
  render: () => html`
    <div
      data-testid="resizable"
      style="resize: horizontal; overflow: auto; width: 900px; max-width: 100%; min-width: 180px; padding: 16px; border: 1px dashed var(--color-border);"
    >
      ${toolGrid()}
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const container = query(canvasElement, '[data-testid="resizable"]');
    const grid = query(container, '.card-grid');
    const columns = () => getComputedStyle(grid).gridTemplateColumns.split(' ').length;

    await step('寬容器排成多欄', async () => {
      container.style.width = '900px';
      await expect(columns()).toBeGreaterThanOrEqual(2);
    });

    await step('縮窄後自動減少欄數，且無橫向溢位', async () => {
      container.style.width = '360px';
      await expect(columns()).toBe(1);
      await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
    });

    await step('簡介裁切為兩行', async () => {
      const description = inShadow(query(grid, 'aui-card'), '[part="description"]');
      const lineHeight = parseFloat(getComputedStyle(description).lineHeight);
      await expect(Math.round(description.clientHeight / lineHeight)).toBe(2);
    });

    container.style.width = '900px';
  },
};

export const HotAndStatic: Story = {
  render: () => html`
    <div class="card-grid" style="max-width: 640px;">
      <aui-card heading="Link card" description="設定 href：整張卡片可點擊" href="#link"></aui-card>
      <aui-card
        heading="HOT link card"
        description="hot：琥珀色外框與徽標"
        href="#hot"
        hot
      ></aui-card>
      <aui-card heading="Static card" description="未設定 href：靜態容器，無懸停回饋"></aui-card>
      <aui-card
        heading="自訂徽標文字"
        description="hot-label 可改為在地化文字"
        hot
        hot-label="熱門"
      ></aui-card>
    </div>
  `,
};

const trendIcon = html`
  <svg
    slot="icon"
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path d="M3 17l6-6 4 4 8-8" />
  </svg>
`;

/**
 * KPI 卡片：icon slot 放圖示，heading slot 放數值，簡介放指標名稱。
 * 作為連結時，連結名稱只取 heading：請讓 heading 也包含指標名稱（如最後一張卡片），單獨的數字無法說明連結目的
 */
export const KpiCards: Story = {
  render: () => html`
    <div class="card-grid" style="max-width: 720px;">
      <aui-card description="本月營收">
        ${trendIcon}
        <span slot="heading" style="font-size: 1.5rem;">NT$ 1.2M</span>
      </aui-card>
      <aui-card description="本週活躍使用者">
        ${trendIcon}
        <span slot="heading" style="font-size: 1.5rem;">8,420</span>
        <aui-tag slot="tags" variant="success">+12%</aui-tag>
      </aui-card>
      <aui-card description="平均回應時間">
        ${trendIcon}
        <span slot="heading" style="font-size: 1.5rem;">320 ms</span>
        <aui-tag slot="tags" variant="danger">+8%</aui-tag>
      </aui-card>
      <aui-card heading="錯誤率報表" description="查看各服務的錯誤率趨勢" href="#errors">
        ${trendIcon}
      </aui-card>
    </div>
  `,
};

export const Slots: Story = {
  render: () => html`
    <div style="max-width: 320px;">
      <aui-card href="#slots" lines="3">
        <span slot="heading">以 <code>heading</code> slot 自訂名稱</span>
        預設 slot 放入簡介內容，可包含 <strong>行內標記</strong>。超過 <code>lines</code>
        設定的行數時以省略號裁切，避免同一列的卡片高度差異過大。
        <aui-tag slot="tags" variant="info">slot</aui-tag>
        <aui-tag slot="tags" variant="success">tags</aui-tag>
      </aui-card>
    </div>
  `,
};
