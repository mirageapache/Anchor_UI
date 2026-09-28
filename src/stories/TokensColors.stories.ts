import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'Anchor UI 色彩字典展示。支援執行期切換深淺雙主題 (Light / Dark)，自動適配 WCAG AA/AAA 高對比要求。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface SwatchItem {
  name: string;
  variable: string;
  textVar?: string;
  dimVar?: string;
  borderVar?: string;
}

const brandSwatches: SwatchItem[] = [
  { name: 'Brand 50', variable: '--color-brand-50' },
  { name: 'Brand 100', variable: '--color-brand-100' },
  { name: 'Brand 500', variable: '--color-brand-500' },
  { name: 'Brand 600 (Core)', variable: '--color-brand-600' },
  { name: 'Brand 700', variable: '--color-brand-700' },
  { name: 'Brand 800', variable: '--color-brand-800' },
];

const semanticSwatches: SwatchItem[] = [
  {
    name: 'Success (Emerald)',
    variable: '--color-success',
    textVar: '--color-success-text',
    dimVar: '--color-success-dim',
    borderVar: '--color-success-border',
  },
  {
    name: 'Warning (Amber / Accent)',
    variable: '--color-warning',
    textVar: '--color-warning-text',
    dimVar: '--color-warning-dim',
    borderVar: '--color-warning-border',
  },
  {
    name: 'Danger (Red)',
    variable: '--color-danger',
    textVar: '--color-danger-text',
    dimVar: '--color-danger-dim',
    borderVar: '--color-danger-border',
  },
  {
    name: 'Info (Sky Blue)',
    variable: '--color-info',
    textVar: '--color-info-text',
    dimVar: '--color-info-dim',
    borderVar: '--color-info-border',
  },
  {
    name: 'Purple (Violet)',
    variable: '--color-purple',
    textVar: '--color-purple-text',
    dimVar: '--color-purple-dim',
    borderVar: '--color-purple-border',
  },
  {
    name: 'Neutral (Slate)',
    variable: '--color-neutral',
    textVar: '--color-neutral-text',
    dimVar: '--color-neutral-dim',
    borderVar: '--color-neutral-border',
  },
];

const surfaceSwatches: SwatchItem[] = [
  { name: 'Base', variable: '--color-base' },
  { name: 'Background (Page)', variable: '--color-bg' },
  { name: 'Surface (Sidebar/Track)', variable: '--color-surface' },
  { name: 'Surface Plus (Card)', variable: '--color-surface-plus' },
  { name: 'Border', variable: '--color-border' },
  { name: 'Ghost Border', variable: '--color-ghost-border' },
];

export const Palette: Story = {
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
          Theme & Semantic Colors
        </h1>
        <p
          style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: var(--space-xs);"
        >
          切換頂部工具列 Theme (Light / Dark) 可即時預覽雙主題即時切換反饋。
        </p>
      </header>

      <!-- 品牌色系 -->
      <section style="margin-bottom: var(--space-xl);">
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Brand Primary (海軍藍核心)
        </h2>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-md);"
        >
          ${brandSwatches.map(
            (s) => html`
              <div
                style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: var(--color-surface);"
              >
                <div style="height: 64px; background: var(${s.variable});"></div>
                <div style="padding: var(--space-sm); font-size: var(--text-xs);">
                  <div style="font-weight: var(--weight-medium);">${s.name}</div>
                  <div
                    style="font-family: var(--font-mono); color: var(--color-text-muted); font-size: var(--text-2xs); margin-top: 2px;"
                  >
                    ${s.variable}
                  </div>
                </div>
              </div>
            `,
          )}
        </div>
      </section>

      <!-- 表面與背景層級 -->
      <section style="margin-bottom: var(--space-xl);">
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Surface & Background (表面層級)
        </h2>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-md);"
        >
          ${surfaceSwatches.map(
            (s) => html`
              <div
                style="border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; background: var(--color-surface);"
              >
                <div
                  style="height: 64px; background: var(${s.variable}); border-bottom: 1px solid var(--color-border);"
                ></div>
                <div style="padding: var(--space-sm); font-size: var(--text-xs);">
                  <div style="font-weight: var(--weight-medium);">${s.name}</div>
                  <div
                    style="font-family: var(--font-mono); color: var(--color-text-muted); font-size: var(--text-2xs); margin-top: 2px;"
                  >
                    ${s.variable}
                  </div>
                </div>
              </div>
            `,
          )}
        </div>
      </section>

      <!-- 6 大語意色與衍生 Dim / Border / Text -->
      <section style="margin-bottom: var(--space-xl);">
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Semantic Status & Actions (6 大語意狀態色)
        </h2>
        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md);"
        >
          ${semanticSwatches.map(
            (s) => html`
              <div
                style="border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-md); background: var(--color-surface-plus);"
              >
                <div
                  style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm);"
                >
                  <span style="font-weight: var(--weight-semibold); font-size: var(--text-sm);"
                    >${s.name}</span
                  >
                  <span
                    style="font-family: var(--font-mono); font-size: var(--text-2xs); color: var(--color-text-muted);"
                    >${s.variable}</span
                  >
                </div>
                <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-sm);">
                  <div
                    style="flex: 1; height: 36px; border-radius: var(--radius-sm); background: var(${s.variable});"
                    title="Main"
                  ></div>
                  ${
                    s.dimVar
                      ? html`
                          <div
                            style="flex: 1; height: 36px; border-radius: var(--radius-sm); background: var(${s.dimVar}); border: 1px solid var(${s.borderVar}); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: var(--text-2xs); color: var(${s.textVar});"
                            title="Dim + Border + Text"
                          >
                            Dim/Tag
                          </div>
                        `
                      : ''
                  }
                </div>
              </div>
            `,
          )}
        </div>
      </section>
    </div>
  `,
};
