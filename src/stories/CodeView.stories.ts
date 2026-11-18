import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/code-view/index.js';
import '../components/button/index.js';
import type { AuiCodeView } from '../components/code-view/code-view.js';
import { inShadow, query } from './play-utils.js';

interface CodeViewStoryArgs {
  code: string;
  label: string;
  maxHeight: string;
}

const SAMPLE = JSON.stringify(
  {
    name: '@anchor-ui/core',
    version: '1.0.0',
    exports: {
      '.': { types: './dist/index.d.ts', import: './dist/index.js' },
      './button': {
        types: './dist/components/button/index.d.ts',
        import: './dist/components/button/index.js',
      },
    },
    dependencies: { lit: '^3.3.0', '@floating-ui/dom': '^1.7.0' },
    keywords: ['web-components', 'lit', 'design-system'],
  },
  null,
  2,
);

const YAML = `name: CI
on:
  pull_request:
    branches: [main, develop]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lint
  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test`;

/** 超過一萬行的 JSON（示範分段延遲渲染） */
const bigJson = () =>
  JSON.stringify(
    Array.from({ length: 1700 }, (_, i) => ({ id: i, name: `item-${i}`, tags: ['a', 'b'] })),
    null,
    2,
  );

const meta: Meta<CodeViewStoryArgs> = {
  title: 'Components/Code View',
  component: 'aui-code-view',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Code View IDE 風格程式碼檢視區 (\`<aui-code-view>\`)**

等寬純文字的程式碼檢視區，用於展示轉換結果（JSON、程式碼、格式化文字）。
左側行號列為 sticky，水平捲動時不位移；依縮排自動判斷可摺疊的區塊（與 VS Code 預設相同），\`foldAll()\` / \`unfoldAll()\` 可一次摺疊或展開。
所有行都在 DOM 中（頁內搜尋與跨行選取皆可用），每 200 行一段並以 \`content-visibility: auto\` 略過畫面外的排版與繪製。
預設隨內容增高；以 \`::part(base)\` 設定 \`max-height\` 即可在檢視區內捲動。
        `,
      },
    },
  },
  argTypes: {
    code: { control: 'text', description: '程式碼（純文字）' },
    label: {
      control: 'text',
      description: '無障礙名稱',
      table: { defaultValue: { summary: '程式碼' } },
    },
    maxHeight: { control: 'text', description: '`::part(base)` 的 max-height（示範用）' },
  },
  args: {
    code: SAMPLE,
    label: '程式碼',
    maxHeight: '',
  },
};

export default meta;
type Story = StoryObj<CodeViewStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <style>
      .story-code-view::part(base) {
        max-height: ${args.maxHeight || 'none'};
      }
    </style>
    <aui-code-view class="story-code-view" .code=${args.code} label=${args.label}></aui-code-view>
  `,
};

export const IndentationFolding: Story = {
  name: 'Indentation folding (YAML)',
  args: { code: YAML },
  render: (args) => html`<aui-code-view .code=${args.code}></aui-code-view>`,
};

export const NarrowWithLongLines: Story = {
  name: 'Horizontal scroll (sticky line numbers)',
  render: () => html`
    <div style="max-width: 360px;">
      <aui-code-view
        .code=${`const message = '${'水平捲動時，左側行號列保持不動。'.repeat(6)}';\nconsole.log(message);`}
      ></aui-code-view>
    </div>
  `,
};

/** 同一個 story 中的 Code View */
const nearestView = (event: Event) =>
  (event.currentTarget as HTMLElement)
    .closest('.story')!
    .querySelector<AuiCodeView>('aui-code-view')!;

export const TenThousandLines: Story = {
  name: '10,000+ lines',
  render: () => html`
    <style>
      .story-big::part(base) {
        max-height: 420px;
      }
    </style>
    <div class="story">
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <aui-button size="sm" variant="ghost" @click=${(e: Event) => nearestView(e).foldAll()}
          >全部摺疊</aui-button
        >
        <aui-button size="sm" variant="ghost" @click=${(e: Event) => nearestView(e).unfoldAll()}
          >全部展開</aui-button
        >
      </div>
      <aui-code-view class="story-big" .code=${bigJson()}></aui-code-view>
    </div>
  `,
};

export const FoldInteraction: Story = {
  name: 'Fold interaction',
  render: () => html`<aui-code-view .code=${SAMPLE}></aui-code-view>`,
  play: async ({ canvasElement, step }) => {
    const view = query<AuiCodeView>(canvasElement, 'aui-code-view');
    const lineCount = () => view.shadowRoot!.querySelectorAll('[part="line"]').length;
    const total = SAMPLE.split('\n').length;
    const exportsButton = () =>
      inShadow<HTMLButtonElement>(view, '[part="fold-button"][data-line="3"]');

    await step('點擊摺疊鈕收合 exports 區塊', async () => {
      await expect(lineCount()).toBe(total);
      await userEvent.click(exportsButton());
      await waitFor(() => expect(exportsButton().getAttribute('aria-expanded')).toBe('false'));
      await expect(lineCount()).toBeLessThan(total);
      await expect(view.shadowRoot!.querySelector('[part="fold-placeholder"]')).toBeTruthy();
    });

    await step('鍵盤：Enter 展開', async () => {
      exportsButton().focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(lineCount()).toBe(total));
    });
  },
};
