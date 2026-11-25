import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { html } from 'lit';
import '../components/menu/index.js';
import '../components/button/index.js';
import '../components/icon-button/index.js';
import '../components/navbar/index.js';
import type { AuiMenu } from '../components/menu/menu.js';
import type { MenuSelectDetail } from '../components/menu/menu.types.js';
import { query } from './play-utils.js';

const meta: Meta = {
  title: 'Components/Menu',
  component: 'aui-menu',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Dropdown Menu 下拉選單 (\`<aui-menu>\`)**

基於 \`<aui-popover>\` 的操作選單，依 WAI-ARIA Menu Button 模式實作，例如導覽列的使用者選單、表格列的「更多」操作。

- 面板的直接子元素為選單項目（建議 \`<button>\` 或連結 \`<a href>\`），\`<hr>\` 為分隔線。
- 觸發元素：Enter、Space 或 ↓ 開啟並聚焦第一個項目，↑ 開啟並聚焦最後一個項目。
- 選單中：↑ ↓ 移動（頭尾循環）、Home / End、輸入字元跳到名稱以該字開頭的項目（輸入法組字不支援）；Enter、Space 或點擊選取，ESC 與 Tab 關閉。滑鼠移到項目上時焦點跟著移動。
- 選取時分派 \`aui-select\`（\`detail.value\` 為項目的 \`value\` 屬性，沒有時為文字），可取消（取消時不關閉）。
- \`aria-disabled="true"\` 的項目可聚焦但不可選取；原生 \`disabled\` 的項目在鍵盤巡覽時略過。
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const logSelect = (event: Event) => {
  const { value } = (event as CustomEvent<MenuSelectDetail>).detail;
  const output = (event.currentTarget as HTMLElement)
    .closest('[data-demo]')!
    .querySelector('output')!;
  output.textContent = `aui-select：${value}`;
};

/** 導覽列的使用者選單 */
export const NavbarUserMenu: Story = {
  render: () => html`
    <div data-demo style="min-height: 320px;">
      <aui-navbar brand="Anchor UI" brand-href="#" no-search>
        <a href="#tools">工具</a>
        <a href="#docs">文件</a>
        <aui-menu slot="actions" label="使用者選單" placement="bottom-end" @aui-select=${logSelect}>
          <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
          <a href="#profile">個人資料</a>
          <button value="settings">設定</button>
          <button value="billing" aria-disabled="true">帳單（未開通）</button>
          <hr />
          <button value="logout">登出</button>
        </aui-menu>
      </aui-navbar>
      <output
        style="display: block; padding: 12px 24px; font-family: var(--font-mono); font-size: 12px;"
      ></output>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const menu = query<AuiMenu>(canvasElement, 'aui-menu');
    const trigger = query(menu, '[slot="trigger"]');

    await step('在觸發元素上按 ↓：開啟並聚焦第一個項目', async () => {
      trigger.focus();
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(menu.open).toBe(true));
      await waitFor(() => expect(document.activeElement).toBe(query(menu, 'a[href="#profile"]')));
    });

    await step('↓ 移到「設定」，Enter 選取：分派 aui-select 並關閉，焦點回到觸發元素', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(document.activeElement).toBe(query(menu, '[value="settings"]'));
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(menu.open).toBe(false));
      await expect(query(canvasElement, 'output').textContent).toBe('aui-select：settings');
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
  },
};

const moreIcon = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
`;

/** 表格列的「更多」操作：圖示按鈕觸發，選單靠右對齊 */
export const TableRowActions: Story = {
  render: () => html`
    <div data-demo style="padding: 24px 24px 200px; max-width: 520px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${['report-2026-10.csv', 'report-2026-11.csv'].map(
            (file) => html`
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 8px;">${file}</td>
                <td style="padding: 8px; text-align: end;">
                  <aui-menu placement="bottom-end" @aui-select=${logSelect}>
                    <aui-icon-button slot="trigger" label=${`${file} 的更多操作`} variant="ghost">
                      ${moreIcon}
                    </aui-icon-button>
                    <button value=${`download:${file}`}>下載</button>
                    <button value=${`rename:${file}`}>重新命名</button>
                    <hr />
                    <button value=${`delete:${file}`}>刪除</button>
                  </aui-menu>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
      <output
        style="display: block; padding-top: 12px; font-family: var(--font-mono); font-size: 12px;"
      ></output>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const menu = query<AuiMenu>(canvasElement, 'aui-menu');

    await step('點擊開啟，以 ↑ 移到最後一個項目「刪除」後按 ESC 關閉', async () => {
      await userEvent.click(query(menu, '[slot="trigger"]'));
      await waitFor(() => expect(menu.open).toBe(true));
      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(document.activeElement?.textContent).toBe('刪除'));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(menu.open).toBe(false));
    });
  },
};
