import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Design Tokens/Spacing & Radius',
  parameters: {
    docs: {
      description: {
        component: 'Anchor UI 間距尺度 (4px/8px 格線) 與圓角幾何字典。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const spacingItems = [
  { token: '--space-xs', val: '4px', use: '細微間隙、標籤內行距、圖示微調' },
  { token: '--space-sm', val: '8px', use: '相鄰按鈕間距、欄位與標題間隔' },
  { token: '--space-ms', val: '12px', use: '卡片垂直內距、控制項內左右間距' },
  { token: '--space-md', val: '16px', use: '標準卡片內距、表單欄位下外距' },
  { token: '--space-lg', val: '24px', use: '區塊間距、頁面邊界 gutter' },
  { token: '--space-xl', val: '40px', use: '主要段落區隔、頁面大模組間隔' },
  { token: '--space-xxl', val: '64px', use: '頁首與頁底留白、Empty State 內距' },
];

const radiusItems = [
  { token: '--radius-sm', val: '6px', use: '標籤 Tag、圖示小按鈕、Tooltip' },
  { token: '--radius-md', val: '8px', use: '標準按鈕 (.btn)、輸入框 (.input)、Toast' },
  { token: '--radius-lg', val: '12px', use: '工具卡片 (.card)、分段控制器外框' },
  { token: '--radius-xl', val: '16px', use: '彈窗對話框 (.alert)、指令面板' },
  { token: '--radius-pill', val: '9999px', use: '圓形圖標、頭像、全角按鈕' },
];

export const SpacingAndRadius: Story = {
  render: () => html`
    <div
      style="font-family: var(--font-ui); color: var(--color-text-primary); max-width: 1000px; padding: var(--space-lg);"
    >
      <header
        style="margin-bottom: var(--space-xl); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-md);"
      >
        <span class="section-label">Anchor UI Design Tokens</span>
        <h1
          style="font-size: var(--text-3xl); margin-top: var(--space-xs); font-weight: var(--weight-bold);"
        >
          Spacing Scale & Border Radius
        </h1>
      </header>

      <!-- Spacing Scale -->
      <section style="margin-bottom: var(--space-xl);">
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Spacing Tokens (4px / 8px Grid)
        </h2>
        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
          ${spacingItems.map(
            (item) => html`
              <div
                style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-plus);"
              >
                <div style="width: 200px;">
                  <span
                    style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--color-brand-text);"
                  >
                    ${item.token}
                  </span>
                  <span
                    style="font-size: var(--text-2xs); color: var(--color-text-muted); margin-left: 6px;"
                    >(${item.val})</span
                  >
                </div>
                <div style="flex: 1; padding: 0 var(--space-md);">
                  <div
                    style="height: 12px; width: var(${item.token}); background: var(--color-brand-500); border-radius: 2px;"
                  ></div>
                </div>
                <div
                  style="font-size: var(--text-xs); color: var(--color-text-secondary); width: 280px; text-align: right;"
                >
                  ${item.use}
                </div>
              </div>
            `,
          )}
        </div>
      </section>

      <!-- Border Radius -->
      <section>
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Border Radius Tokens
        </h2>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-md);"
        >
          ${radiusItems.map(
            (item) => html`
              <div
                style="border: 2px solid var(--color-brand-500); border-radius: var(${item.token}); padding: var(--space-md); background: var(--color-brand-dim); text-align: center;"
              >
                <div
                  style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--color-brand-text);"
                >
                  ${item.token}
                </div>
                <div
                  style="font-size: var(--text-2xs); color: var(--color-text-muted); margin-top: 2px;"
                >
                  ${item.val}
                </div>
                <div
                  style="font-size: var(--text-xs); color: var(--color-text-secondary); margin-top: var(--space-sm);"
                >
                  ${item.use}
                </div>
              </div>
            `,
          )}
        </div>
      </section>
    </div>
  `,
};
