import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/button/index.js';
import '../components/header/index.js';
import '../components/tag/index.js';
import type { AuiFavoriteBtn } from '../components/favorite-btn/favorite-btn.js';
import type { AuiHeader } from '../components/header/header.js';
import type {
  HeaderFavoriteChangeDetail,
  HeaderHeadingLevel,
} from '../components/header/header.types.js';
import { inShadow, query } from './play-utils.js';

interface HeaderStoryArgs {
  heading: string;
  description: string;
  headingLevel: HeaderHeadingLevel;
  hot: boolean;
  hotLabel: string;
  favoritable: boolean;
  favorite: boolean;
}

const meta: Meta<HeaderStoryArgs> = {
  title: 'Components/Header',
  component: 'aui-header',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Header 頁面工具標頭列 (\`<aui-header>\`)**

工具頁面頂部的複合展示列：分類標籤、HOT 推薦徽標、主標題（預設為 \`<h1>\`）、我的最愛收藏鈕與簡述文字，
提供統一的頁首層次與字級節奏。

- 內部組合 \`<aui-tag>\`（HOT 徽標）與 \`<aui-favorite-btn>\`（收藏鈕），載入本元件時會一併註冊。
- 純展示與事件轉發：使用者切換收藏鈕時觸發 \`aui-favorite-change\`（\`detail.favorite\`），是否保存由使用端決定；
  在事件中把 \`favorite\` 設回原值即可取消變更。
- 一個頁面應只有一個 \`<h1>\`；在其他位置使用時以 \`heading-level\` 調整層級。
`,
      },
    },
  },
  argTypes: {
    heading: { control: 'text', description: '主標題（或使用 heading slot）' },
    description: { control: 'text', description: '簡述文字（或使用預設 slot）' },
    headingLevel: {
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5, 6],
      description: '主標題的標題層級',
      table: { defaultValue: { summary: '1' } },
    },
    hot: {
      control: 'boolean',
      description: '是否顯示 HOT 推薦徽標',
      table: { defaultValue: { summary: 'false' } },
    },
    hotLabel: {
      control: 'text',
      description: 'HOT 徽標文字',
      table: { defaultValue: { summary: 'HOT' } },
    },
    favoritable: {
      control: 'boolean',
      description: '是否顯示我的最愛收藏鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    favorite: {
      control: 'boolean',
      description: '是否已收藏（需搭配 favoritable）',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    heading: 'JSON Formatter',
    description: '格式化、驗證並壓縮 JSON 文件，所有運算皆在瀏覽器內完成。',
    headingLevel: 1,
    hot: true,
    hotLabel: 'HOT',
    favoritable: true,
    favorite: false,
  },
};

export default meta;
type Story = StoryObj<HeaderStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <aui-header
      heading=${args.heading}
      description=${args.description}
      .headingLevel=${args.headingLevel}
      ?hot=${args.hot}
      hot-label=${args.hotLabel}
      ?favoritable=${args.favoritable}
      ?favorite=${args.favorite}
      @aui-favorite-change=${(event: CustomEvent<HeaderFavoriteChangeDetail>) =>
        console.log('aui-favorite-change', event.detail)}
    >
      <aui-tag slot="tags" variant="brand">json</aui-tag>
      <aui-tag slot="tags">format</aui-tag>
    </aui-header>
  `,
};

/** 切換收藏：Header 轉發為 aui-favorite-change，並同步 favorite 屬性 */
export const FavoriteForwarding: Story = {
  render: () => html`
    <div style="display: grid; gap: 12px;">
      <aui-header
        heading="UUID Generator"
        heading-level="2"
        description="產生 v4 / v7 UUID。"
        favoritable
        @aui-favorite-change=${(event: CustomEvent<HeaderFavoriteChangeDetail>) => {
          const status = (event.currentTarget as HTMLElement).nextElementSibling!;
          status.textContent = event.detail.favorite ? '已加入我的最愛' : '尚未收藏';
        }}
      >
        <aui-tag slot="tags" variant="purple">uuid</aui-tag>
      </aui-header>
      <span data-testid="status" style="font-size: 14px; color: var(--color-text-secondary);"
        >尚未收藏</span
      >
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const header = query<AuiHeader>(canvasElement, 'aui-header');
    const status = query(canvasElement, '[data-testid="status"]');
    const favorite = inShadow<AuiFavoriteBtn>(header, 'aui-favorite-btn');
    await favorite.updateComplete;

    await step('點擊收藏鈕：Header 的 favorite 與外部狀態同步更新', async () => {
      await userEvent.click(inShadow(favorite, 'button'));
      await expect(header.favorite).toBe(true);
      await expect(status.textContent).toBe('已加入我的最愛');
      await waitFor(() => expect(header.hasAttribute('favorite')).toBe(true));
    });

    await step('再次點擊取消收藏', async () => {
      await userEvent.click(inShadow(favorite, 'button'));
      await expect(header.favorite).toBe(false);
      await expect(status.textContent).toBe('尚未收藏');
    });
  },
};

export const WithActions: Story = {
  render: () => html`
    <aui-header
      heading="Base64"
      heading-level="2"
      description="編碼與解碼 Base64 文字與檔案。"
      favoritable
      favorite
    >
      <aui-tag slot="tags" variant="success">encode</aui-tag>
      <aui-button slot="actions" variant="ghost" size="sm">分享</aui-button>
    </aui-header>
  `,
};

export const Minimal: Story = {
  render: () => html`
    <div style="display: grid; gap: 32px;">
      <aui-header heading="只有標題" heading-level="2"></aui-header>
      <aui-header heading-level="2">
        <span slot="heading">以 <code>heading</code> slot 自訂標題</span>
        預設 slot 放入簡述，可包含 <strong>行內標記</strong>。
      </aui-header>
    </div>
  `,
};
