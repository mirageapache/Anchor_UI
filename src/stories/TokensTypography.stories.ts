import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Design Tokens/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Anchor UI 文字尺度字典 (對齊 Tailwind CSS Type Scale) 與 Inter / JetBrains Mono 字體規範。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const typeScales = [
  { token: '--text-5xl', rem: '3rem', px: '48px', use: '重點指標數據、超大展示字' },
  { token: '--text-4xl', rem: '2.25rem', px: '36px', use: '展示標題、Hero Text' },
  { token: '--text-3xl', rem: '1.875rem', px: '30px', use: '頁面主標題 (H1)' },
  { token: '--text-2xl', rem: '1.5rem', px: '24px', use: '彈窗標題、小頁首 (H2)' },
  { token: '--text-xl', rem: '1.25rem', px: '20px', use: '區塊與分組標題 (H3)' },
  { token: '--text-lg', rem: '1.125rem', px: '18px', use: '強調段落、副標題' },
  { token: '--text-base', rem: '1rem', px: '16px', use: '標準內文、指令面板、卡片標題' },
  { token: '--text-sm', rem: '0.875rem', px: '14px', use: '主要內文、按鈕、輸入框、代碼區' },
  { token: '--text-xs', rem: '0.75rem', px: '12px', use: '輔助說明、次要標註、Tooltip' },
  {
    token: '--text-2xs',
    rem: '0.6875rem',
    px: '11px',
    use: '分類標籤 (.tag)、大寫微標籤 (.section-label)',
  },
];

export const TypographyScale: Story = {
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
          Typography Scale & Hierarchy
        </h1>
        <p
          style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: var(--space-xs);"
        >
          標準介面採 Inter 字體；代碼、輸入輸出框與語意標籤採 JetBrains Mono 等寬字體。
        </p>
      </header>

      <!-- 字型家族範例 -->
      <section
        style="margin-bottom: var(--space-xl); display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);"
      >
        <div
          style="padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface-plus);"
        >
          <div
            style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-xs);"
          >
            UI Font Family
          </div>
          <div
            style="font-family: var(--font-ui); font-size: var(--text-xl); font-weight: var(--weight-semibold); margin-bottom: var(--space-xs);"
          >
            Inter — Modern & Clean
          </div>
          <div
            style="font-family: var(--font-ui); font-size: var(--text-sm); color: var(--color-text-secondary);"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz 0123456789
          </div>
        </div>
        <div
          style="padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface-plus);"
        >
          <div
            style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-xs);"
          >
            Monospace Font Family
          </div>
          <div
            style="font-family: var(--font-mono); font-size: var(--text-xl); font-weight: var(--weight-semibold); margin-bottom: var(--space-xs);"
          >
            JetBrains Mono — Precision
          </div>
          <div
            style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text-secondary);"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz 0123456789
          </div>
        </div>
      </section>

      <!-- 字級階層清單 -->
      <section>
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Font Size Tokens
        </h2>
        <div
          style="border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface-plus);"
        >
          ${typeScales.map(
            (scale, index) => html`
              <div
                style="display: flex; align-items: baseline; justify-content: space-between; padding: var(--space-md); border-bottom: ${index < typeScales.length - 1 ? '1px solid var(--color-border)' : 'none'}; gap: var(--space-lg);"
              >
                <div style="min-width: 220px;">
                  <span
                    style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-semibold); color: var(--color-brand-text);"
                  >
                    ${scale.token}
                  </span>
                  <span
                    style="font-size: var(--text-2xs); color: var(--color-text-muted); margin-left: var(--space-xs);"
                  >
                    (${scale.rem} / ${scale.px})
                  </span>
                  <div
                    style="font-size: var(--text-xs); color: var(--color-text-secondary); margin-top: 2px;"
                  >
                    ${scale.use}
                  </div>
                </div>
                <div
                  style="font-size: var(${scale.token}); font-weight: var(--weight-semibold); line-height: var(--leading-tight); flex: 1; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                >
                  Anchor UI Precision
                </div>
              </div>
            `,
          )}
        </div>
      </section>
    </div>
  `,
};
