import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/tooltip/index.js';
import '../components/button/index.js';
import '../components/tag/index.js';
import type { TooltipPlacement } from '../components/tooltip/tooltip.types.js';

interface TooltipStoryArgs {
  content: string;
  placement: TooltipPlacement;
  disabled: boolean;
  arrow: boolean;
  distance: number;
  skidding: number;
  delay: number;
  hideDelay: number;
  trigger: string;
}

const meta: Meta<TooltipStoryArgs> = {
  title: 'Components/Tooltip',
  component: 'aui-tooltip',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Tooltip 懸浮氣泡提示 (\`<aui-tooltip>\`)**

全域浮動氣泡提示元件，提供 Shadcn/ui 風格冷黑外觀、微縮放進出場動畫（0.95 -> 1.0）、
支援原生 Popover API 進入 Top Layer（徹底解決父層 \`overflow: hidden\` 裁切問題）與 \`@floating-ui/dom\` 邊界碰撞檢測。

符合 **WCAG 2.1 AA (1.4.13 Content on Hover or Focus)** 無障礙規範：
- **Dismissible（可關閉）**：支援按 \`Escape\` 鍵即刻關閉浮層。
- **Hoverable（可懸停）**：滑鼠移入氣泡本體時不自動消失，便於閱覽長文與多行資訊。
- **Persistent（持續性）**：直到游標移出或主動取消前維持展開。
        `,
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: '提示文字內容',
      table: { defaultValue: { summary: '' } },
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: '12 種浮動定位方位',
      table: { defaultValue: { summary: 'top' } },
    },
    disabled: {
      control: 'boolean',
      description: '是否停用提示',
      table: { defaultValue: { summary: 'false' } },
    },
    arrow: {
      control: 'boolean',
      description: '是否顯示指向目標之小箭頭',
      table: { defaultValue: { summary: 'false' } },
    },
    distance: {
      control: 'number',
      description: '與目標之主軸距離 (px)',
      table: { defaultValue: { summary: '8' } },
    },
    skidding: {
      control: 'number',
      description: '與目標之副軸偏移 (px)',
      table: { defaultValue: { summary: '0' } },
    },
    delay: {
      control: 'number',
      description: '滑鼠懸停顯示延遲時間 (ms)',
      table: { defaultValue: { summary: '150' } },
    },
    hideDelay: {
      control: 'number',
      description: '滑鼠移出隱藏延遲時間 (ms)',
      table: { defaultValue: { summary: '100' } },
    },
    trigger: {
      control: 'text',
      description: '觸發方式（支援 hover、focus、click、manual 組合）',
      table: { defaultValue: { summary: 'hover focus' } },
    },
  },
  args: {
    content: '這是一段提示文字訊息',
    placement: 'top',
    disabled: false,
    arrow: false,
    distance: 8,
    skidding: 0,
    delay: 150,
    hideDelay: 100,
    trigger: 'hover focus',
  },
};

export default meta;
type Story = StoryObj<TooltipStoryArgs>;

/**
 * 基礎用法 (Default)
 */
export const Default: Story = {
  render: (args) => html`
    <div style="padding: 60px 80px; display: flex; align-items: center; justify-content: center;">
      <aui-tooltip
        .content=${args.content}
        .placement=${args.placement}
        ?disabled=${args.disabled}
        ?arrow=${args.arrow}
        .distance=${args.distance}
        .skidding=${args.skidding}
        .delay=${args.delay}
        .hideDelay=${args.hideDelay}
        .trigger=${args.trigger}
      >
        <aui-button variant="primary">請將滑鼠移至此處</aui-button>
      </aui-tooltip>
    </div>
  `,
};

/**
 * 具備箭頭指標 (With Arrow)
 */
export const WithArrow: Story = {
  render: () => html`
    <div style="padding: 60px 80px; display: flex; gap: 24px; justify-content: center;">
      <aui-tooltip content="上方提示帶箭頭" placement="top" arrow>
        <aui-button variant="primary">Top with Arrow</aui-button>
      </aui-tooltip>

      <aui-tooltip content="下方提示帶箭頭" placement="bottom" arrow>
        <aui-button variant="secondary">Bottom with Arrow</aui-button>
      </aui-tooltip>

      <aui-tooltip content="左側提示帶箭頭" placement="left" arrow>
        <aui-button variant="ghost">Left with Arrow</aui-button>
      </aui-tooltip>

      <aui-tooltip content="右側提示帶箭頭" placement="right" arrow>
        <aui-button variant="danger">Right with Arrow</aui-button>
      </aui-tooltip>
    </div>
  `,
};

/**
 * 12 種浮動方位展示 (All Placements)
 */
export const AllPlacements: Story = {
  render: () => html`
    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, 140px);
        gap: 16px;
        justify-content: center;
        align-items: center;
        padding: 80px 40px;
      "
    >
      <div></div>
      <aui-tooltip content="placement: top" placement="top" arrow>
        <aui-button variant="secondary" full-width size="sm">Top</aui-button>
      </aui-tooltip>
      <div></div>

      <aui-tooltip content="placement: top-start" placement="top-start" arrow>
        <aui-button variant="secondary" full-width size="sm">Top Start</aui-button>
      </aui-tooltip>
      <div></div>
      <aui-tooltip content="placement: top-end" placement="top-end" arrow>
        <aui-button variant="secondary" full-width size="sm">Top End</aui-button>
      </aui-tooltip>

      <aui-tooltip content="placement: left" placement="left" arrow>
        <aui-button variant="secondary" full-width size="sm">Left</aui-button>
      </aui-tooltip>
      <div></div>
      <aui-tooltip content="placement: right" placement="right" arrow>
        <aui-button variant="secondary" full-width size="sm">Right</aui-button>
      </aui-tooltip>

      <aui-tooltip content="placement: left-start" placement="left-start" arrow>
        <aui-button variant="secondary" full-width size="sm">Left Start</aui-button>
      </aui-tooltip>
      <div></div>
      <aui-tooltip content="placement: right-start" placement="right-start" arrow>
        <aui-button variant="secondary" full-width size="sm">Right Start</aui-button>
      </aui-tooltip>

      <aui-tooltip content="placement: left-end" placement="left-end" arrow>
        <aui-button variant="secondary" full-width size="sm">Left End</aui-button>
      </aui-tooltip>
      <div></div>
      <aui-tooltip content="placement: right-end" placement="right-end" arrow>
        <aui-button variant="secondary" full-width size="sm">Right End</aui-button>
      </aui-tooltip>

      <aui-tooltip content="placement: bottom-start" placement="bottom-start" arrow>
        <aui-button variant="secondary" full-width size="sm">Bottom Start</aui-button>
      </aui-tooltip>
      <div></div>
      <aui-tooltip content="placement: bottom-end" placement="bottom-end" arrow>
        <aui-button variant="secondary" full-width size="sm">Bottom End</aui-button>
      </aui-tooltip>

      <div></div>
      <aui-tooltip content="placement: bottom" placement="bottom" arrow>
        <aui-button variant="secondary" full-width size="sm">Bottom</aui-button>
      </aui-tooltip>
      <div></div>
    </div>
  `,
};

/**
 * 豐富內容插槽 (Rich Content Slot)
 */
export const RichContent: Story = {
  render: () => html`
    <div style="padding: 70px 80px; display: flex; gap: 32px; justify-content: center;">
      <aui-tooltip placement="bottom" arrow>
        <div slot="content" style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-weight: 600; color: #38bdf8;">WASM 引擎</span>
            <span
              style="font-size: 10px; background: rgba(56, 189, 248, 0.2); padding: 1px 4px; border-radius: 4px;"
            >
              v2.4
            </span>
          </div>
          <div style="color: #94a3b8; font-size: 11px;">
            底層透過 WebAssembly 提供近原生的高速資料運算。
          </div>
        </div>
        <aui-button variant="primary">豐富格式氣泡</aui-button>
      </aui-tooltip>

      <aui-tooltip placement="top" arrow>
        <div slot="content" style="display: flex; align-items: center; gap: 8px;">
          <span
            style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"
          ></span>
          <span>服務運作狀態正常 (99.98%)</span>
        </div>
        <aui-tag variant="success" interactive>服務監控</aui-tag>
      </aui-tooltip>
    </div>
  `,
};

/**
 * 多種互動觸發行為 (Triggers)
 */
export const InteractiveTriggers: Story = {
  render: () => html`
    <div style="padding: 60px 80px; display: flex; gap: 24px; justify-content: center;">
      <aui-tooltip content="懸停或 Focus 觸發 (預設)" trigger="hover focus">
        <aui-button variant="secondary">Hover & Focus</aui-button>
      </aui-tooltip>

      <aui-tooltip content="點擊展開/關閉 (Click)" trigger="click">
        <aui-button variant="primary">Click to Toggle</aui-button>
      </aui-tooltip>

      <aui-tooltip content="僅限鍵盤 Focus 觸發" trigger="focus">
        <aui-button variant="ghost">Focus Only (Tab)</aui-button>
      </aui-tooltip>
    </div>
  `,
};

/**
 * 支援溢出裁切穿透 (Overflow Clip Immunity)
 * 透過原生 Popover Top Layer 特性，即使父容器設為 overflow: hidden，氣泡依然完整呈現不被裁切。
 */
export const OverflowClipImmunity: Story = {
  render: () => html`
    <div style="padding: 40px; display: flex; justify-content: center;">
      <div
        style="
          width: 320px;
          height: 140px;
          padding: 24px;
          border: 1px dashed var(--color-border, #cbd5e1);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: var(--color-surface, #f8fafc);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        "
      >
        <span style="font-size: 11px; color: var(--color-text-secondary, #64748b);">
          此容器設定了 <code>overflow: hidden</code>
        </span>
        <aui-tooltip content="此氣泡成功穿透父容器的 overflow: hidden 邊界！" placement="top" arrow>
          <aui-button variant="primary">懸停測試邊界</aui-button>
        </aui-tooltip>
      </div>
    </div>
  `,
};

/**
 * 深色與淺色模式對照 (Dark Mode Preview)
 */
export const DarkModeComparison: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- 淺色模式環境 -->
      <div
        style="
          padding: 40px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-around;
        "
      >
        <span style="font-size: 12px; font-weight: 600; color: #0f172a;">Light Mode</span>
        <aui-tooltip content="淺色底下的冷黑高對比氣泡 (#0f172a)" placement="top" arrow>
          <aui-button variant="primary">淺色模式按鈕</aui-button>
        </aui-tooltip>
      </div>

      <!-- 深色模式環境 -->
      <div
        data-theme="dark"
        style="
          padding: 40px;
          background: #0f172a;
          border-radius: 12px;
          border: 1px solid #334155;
          display: flex;
          align-items: center;
          justify-content: space-around;
        "
      >
        <span style="font-size: 12px; font-weight: 600; color: #f8fafc;">Dark Mode</span>
        <aui-tooltip content="深色底下的 Slate-800 氣泡 (#1e293b)" placement="top" arrow>
          <aui-button variant="primary">深色模式按鈕</aui-button>
        </aui-tooltip>
      </div>
    </div>
  `,
};
