import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Design Tokens/Motion & Layout',
  parameters: {
    docs: {
      description: {
        component:
          'Anchor UI 動態與版面 Tokens 展示。涵蓋三階段過渡時長（Fast / Base / Theme）與版面尺度（Max Width、Gutter、Nav Height）。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface TransitionItem {
  name: string;
  variable: string;
  value: string;
  description: string;
}

interface LayoutItem {
  name: string;
  variable: string;
  value: string;
  description: string;
}

const transitions: TransitionItem[] = [
  {
    name: 'Fast',
    variable: '--transition-fast',
    value: '100ms ease',
    description: '按鈕 active 縮放、圖示 hover 即時反饋',
  },
  {
    name: 'Base',
    variable: '--transition-base',
    value: '150ms ease',
    description: '邊框顏色切換、懸浮微抬升（card hover）',
  },
  {
    name: 'Theme',
    variable: '--transition-theme',
    value: '200ms ease',
    description: '深淺模式切換背景與文字過渡',
  },
];

const layoutTokens: LayoutItem[] = [
  {
    name: 'Max Width',
    variable: '--layout-max-width',
    value: '1600px',
    description: '全站頁面最大容器寬度',
  },
  {
    name: 'Gutter',
    variable: '--layout-gutter',
    value: '24px',
    description: '頁面水平邊距（桌面端）',
  },
  {
    name: 'Nav Height',
    variable: '--nav-height',
    value: '64px',
    description: '頂部導覽列固定高度',
  },
];

export const MotionTokens: Story = {
  render: () => html`
    <div
      style="font-family: var(--font-ui); color: var(--color-text-primary); max-width: 800px; padding: var(--space-lg);"
    >
      <header
        style="margin-bottom: var(--space-xl); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-md);"
      >
        <span class="section-label">Anchor UI Design Tokens</span>
        <h1
          style="font-size: var(--text-3xl); margin-top: var(--space-xs); font-weight: var(--weight-bold);"
        >
          Motion & Layout
        </h1>
        <p
          style="color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: var(--space-xs);"
        >
          將滑鼠移入色塊可即時感受各過渡時長的差異。
        </p>
      </header>

      <!-- Transition Tokens -->
      <section style="margin-bottom: var(--space-xl);">
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Transition Durations (過渡時長)
        </h2>
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          ${transitions.map(
            (t) => html`
              <div
                style="display: grid; grid-template-columns: 180px 1fr auto; align-items: center; gap: var(--space-md); padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface-plus);"
              >
                <!-- Live demo box -->
                <div
                  style="height: 52px; border-radius: var(--radius-md); background: var(--color-brand-dim); border: 1px solid var(--color-brand-border); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: var(--text-xs); color: var(--color-brand-text); transition: background var(${t.variable}), transform var(${t.variable});"
                  onmouseenter="this.style.background='var(--color-brand-600)'; this.style.color='#fff'; this.style.transform='scale(1.03)'"
                  onmouseleave="this.style.background='var(--color-brand-dim)'; this.style.color='var(--color-brand-text)'; this.style.transform='scale(1)'"
                >
                  Hover me
                </div>
                <!-- Info -->
                <div>
                  <div style="font-weight: var(--weight-semibold); font-size: var(--text-sm);">
                    ${t.name}
                  </div>
                  <div
                    style="color: var(--color-text-muted); font-size: var(--text-xs); margin-top: 2px;"
                  >
                    ${t.description}
                  </div>
                </div>
                <!-- Variable -->
                <div style="text-align: right;">
                  <code
                    style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-info-text); background: var(--color-info-dim); border: 1px solid var(--color-info-border); padding: 2px 8px; border-radius: var(--radius-sm); display: block; margin-bottom: 4px;"
                    >${t.variable}</code
                  >
                  <span
                    style="font-family: var(--font-mono); font-size: var(--text-2xs); color: var(--color-text-muted);"
                    >${t.value}</span
                  >
                </div>
              </div>
            `,
          )}
        </div>
      </section>

      <!-- Layout Tokens -->
      <section>
        <h2
          style="font-size: var(--text-xl); margin-bottom: var(--space-md); font-weight: var(--weight-semibold);"
        >
          Layout Scale (版面尺度)
        </h2>
        <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
          ${layoutTokens.map(
            (l) => html`
              <div
                style="display: grid; grid-template-columns: 1fr auto; align-items: center; padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-plus);"
              >
                <div>
                  <div style="font-weight: var(--weight-medium); font-size: var(--text-sm);">
                    ${l.name}
                  </div>
                  <div
                    style="color: var(--color-text-muted); font-size: var(--text-xs); margin-top: 2px;"
                  >
                    ${l.description}
                  </div>
                </div>
                <div style="text-align: right;">
                  <code
                    style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-success-text); background: var(--color-success-dim); border: 1px solid var(--color-success-border); padding: 2px 8px; border-radius: var(--radius-sm); display: block; margin-bottom: 4px;"
                    >${l.variable}</code
                  >
                  <span
                    style="font-family: var(--font-mono); font-size: var(--text-2xs); color: var(--color-text-muted);"
                    >${l.value}</span
                  >
                </div>
              </div>
            `,
          )}
        </div>
      </section>

      <!-- prefers-reduced-motion note -->
      <aside
        style="margin-top: var(--space-xl); padding: var(--space-md); border-radius: var(--radius-md); background: var(--color-warning-dim); border: 1px solid var(--color-warning-border);"
      >
        <div
          style="font-weight: var(--weight-semibold); font-size: var(--text-sm); color: var(--color-warning-text); margin-bottom: var(--space-xs);"
        >
          ♿ prefers-reduced-motion
        </div>
        <p style="font-size: var(--text-xs); color: var(--color-text-secondary); margin: 0;">
          當使用者系統偏好設定為「減少動態」時，全站所有
          <code style="font-family: var(--font-mono);">transition-duration</code> 與
          <code style="font-family: var(--font-mono);">animation-duration</code> 自動降為
          <strong>0.01ms</strong>，確保無障礙體驗。此行為已在
          <code style="font-family: var(--font-mono);">_utilities.scss</code> 全域實作。
        </p>
      </aside>
    </div>
  `,
};
