import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/navbar/index.js';
import '../components/drawer/index.js';
import '../components/button/index.js';
import type { AuiNavbar } from '../components/navbar/navbar.js';
import type { AuiDrawer } from '../components/drawer/drawer.js';
import type { NavbarPosition, NavbarSearchDetail } from '../components/navbar/navbar.types.js';
import { deepActiveElement, inShadow, query } from './play-utils.js';

interface NavbarStoryArgs {
  brand: string;
  position: NavbarPosition;
  noSearch: boolean;
  noSearchShortcut: boolean;
  noThemeToggle: boolean;
  searchLabel: string;
}

const NAV_LINKS = ['總覽', '元件', '設計 Token', '更新紀錄'];

const navLinks = () =>
  NAV_LINKS.map(
    (label, i) =>
      html`<a
        href="#"
        aria-current=${i === 1 ? 'page' : 'false'}
        @click=${(e: Event) => e.preventDefault()}
        >${label}</a
      >`,
  );

/** 範例頁面內容：示範吸附與捲動陰影 */
const pageBody = html`
  <main style="padding: 24px; max-width: 720px;">
    ${Array.from(
      { length: 12 },
      (_, i) => html`<p>第 ${i + 1} 段：往下捲動時 Navbar 吸附於頂端，並在頁面捲動後顯示陰影。</p>`,
    )}
  </main>
`;

const meta: Meta<NavbarStoryArgs> = {
  title: 'Components/Navbar',
  component: 'aui-navbar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Anchor UI — Navbar 頂部導覽列 (\`<aui-navbar>\`)**

64px 站台頂部導覽列：品牌 Logo（含 Accent 圓點）、導覽選單（預設 slot）、快捷搜尋鈕（內嵌 \`⌘K\` / \`Ctrl K\` 鍵帽）與深淺主題切換開關。
預設吸附於頂端（\`position="sticky"\`），頁面捲動後顯示陰影。響應式斷點以 Navbar 自身寬度判斷：寬度小於 768px 時隱藏導覽選單、改顯示漢堡選單鈕。

- **漢堡選單**：設定 \`menu-drawer\` 為 \`<aui-drawer>\` 的 id 即可開啟抽屜並同步 \`aria-expanded\`；也可監聽可取消的 \`aui-menu-click\` 自行處理。
- **搜尋**：點擊或按下快捷鍵時分派 \`aui-search\`，搜尋介面由使用端實作；\`no-search-shortcut\` 可停用快捷鍵。
- **主題**：點擊開關時分派可取消的 \`aui-theme-change\`，未取消即以 \`setTheme()\` 切換。
        `,
      },
    },
  },
  argTypes: {
    brand: { control: 'text', description: '品牌名稱' },
    position: {
      control: 'inline-radio',
      options: ['sticky', 'fixed', 'static'],
      table: { defaultValue: { summary: 'sticky' } },
    },
    noSearch: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    noSearchShortcut: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    noThemeToggle: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    searchLabel: { control: 'text', table: { defaultValue: { summary: '搜尋' } } },
  },
  args: {
    brand: 'Anchor UI',
    position: 'sticky',
    noSearch: false,
    noSearchShortcut: false,
    noThemeToggle: false,
    searchLabel: '搜尋',
  },
};

export default meta;
type Story = StoryObj<NavbarStoryArgs>;

export const Default: Story = {
  render: (args) => {
    const logSearch = (event: Event) => {
      const { source } = (event as CustomEvent<NavbarSearchDetail>).detail;
      const output = (event.currentTarget as HTMLElement).parentElement!.querySelector('output')!;
      output.textContent = `aui-search（${source === 'shortcut' ? '快捷鍵' : '點擊'}）`;
    };
    return html`
      <div>
        <aui-navbar
          brand=${args.brand}
          brand-href="#"
          .position=${args.position}
          ?no-search=${args.noSearch}
          ?no-search-shortcut=${args.noSearchShortcut}
          ?no-theme-toggle=${args.noThemeToggle}
          search-label=${args.searchLabel}
          @aui-search=${logSearch}
        >
          ${navLinks()}
        </aui-navbar>
        <output
          style="display: block; padding: 12px 24px 0; font-family: var(--font-mono); font-size: 12px;"
        ></output>
        ${pageBody}
      </div>
    `;
  },
};

export const WithDrawer: Story = {
  name: 'With drawer (menu-drawer)',
  render: () => html`
    <div style="max-width: 480px; border: 1px dashed var(--color-border);">
      <aui-navbar brand="Anchor UI" brand-href="#" menu-drawer="story-site-menu">
        ${navLinks()}
      </aui-navbar>
      <aui-drawer id="story-site-menu" heading="Anchor UI">
        <nav aria-label="主要導覽" style="display: flex; flex-direction: column; gap: 4px;">
          ${NAV_LINKS.map(
            (label) =>
              html`<a
                href="#"
                style="padding: 8px 12px; color: var(--color-text-primary); text-decoration: none;"
                @click=${(event: Event) => {
                  event.preventDefault();
                  void (event.currentTarget as HTMLElement)
                    .closest<AuiDrawer>('aui-drawer')!
                    .hide();
                }}
                >${label}</a
              >`,
          )}
        </nav>
      </aui-drawer>
      <p style="padding: 0 16px; font-size: 13px;">
        容器寬度小於 768px，導覽選單收進漢堡選單；點擊後開啟 id 為 menu-drawer 的抽屜。
      </p>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const navbar = query<AuiNavbar>(canvasElement, 'aui-navbar');
    const drawer = query<AuiDrawer>(canvasElement, 'aui-drawer');
    const menuButton = inShadow(navbar, '[part="menu-button"]');

    await step('窄版顯示漢堡選單鈕，導覽選單隱藏', async () => {
      await expect(getComputedStyle(menuButton).display).not.toBe('none');
      await expect(getComputedStyle(inShadow(navbar, '[part="nav"]')).display).toBe('none');
      await expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });

    await step('點擊漢堡鈕開啟抽屜，aria-expanded 為 true', async () => {
      await userEvent.click(menuButton);
      await waitFor(() => expect(inShadow<HTMLDialogElement>(drawer, 'dialog').open).toBe(true));
      await waitFor(() => expect(menuButton.getAttribute('aria-expanded')).toBe('true'));
    });

    await step('點選抽屜中的連結後關閉，焦點回到漢堡鈕', async () => {
      await userEvent.click(query(drawer, 'a'));
      await waitFor(() => expect(inShadow<HTMLDialogElement>(drawer, 'dialog').open).toBe(false));
      await waitFor(() => expect(menuButton.getAttribute('aria-expanded')).toBe('false'));
      await waitFor(() => expect(deepActiveElement()).toBe(menuButton));
    });
  },
};

export const CustomLogoAndActions: Story = {
  name: 'Custom logo & actions',
  render: () => html`
    <aui-navbar brand="ToolBox" brand-href="#" no-search-shortcut>
      <svg
        slot="logo"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        ></path>
      </svg>
      ${navLinks()}
      <aui-button slot="actions" size="sm" variant="ghost">登入</aui-button>
    </aui-navbar>
  `,
};
