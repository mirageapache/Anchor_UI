import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/icon-button/index.js';
import type {
  IconButtonColor,
  IconButtonPreset,
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
} from '../components/icon-button/icon-button.types.js';
import type { TooltipPlacement } from '../components/tooltip/tooltip.types.js';

interface IconButtonStoryArgs {
  preset?: IconButtonPreset;
  color?: IconButtonColor;
  variant: IconButtonVariant;
  size: IconButtonSize;
  shape: IconButtonShape;
  tooltip: string;
  successTooltip: string;
  tooltipPlacement: TooltipPlacement;
  noTooltip: boolean;
  copyValue: string;
  downloadUrl: string;
  downloadFilename: string;
  label: string;
  disabled: boolean;
  loading: boolean;
  active: boolean;
  feedbackDuration: number;
}

const meta: Meta<IconButtonStoryArgs> = {
  title: 'Components/IconButton',
  component: 'aui-icon-button',
  parameters: {
    docs: {
      description: {
        component: `
**Anchor UI — Icon Button 微型圖示操作鈕 (\`<aui-icon-button>\`)**

專為複製 (Copy)、下載 (Download)、關閉、重新整理等高頻操作量身打造之標準 32×32px 微型操作鈕。
具備 Active 成功回饋狀態（背景與圖示變換為 Success 翠綠色）、平滑淡入淡出切換、
深度整合 \`<aui-tooltip>\` 浮層與螢幕閱讀器 \`aria-live\` 即時播報。

### 核心特性 (Key Features)
- **32×32px 標準觸控盒**：微型化設計，節約版面空間同時具備 6px 圓角與清晰點擊動態。
- **內建 Copy / Download 狀態切換**：點擊複製或下載後，打勾確認符號平滑淡入，整體切換為 Success 翠綠色高反差反饋。
- **整合 Tooltip 浮層**：無縫綁定 \`<aui-tooltip>\`，常態顯示操作提示（如「複製」），成功後即時切換文字（如「已複製！」）。
- **無障礙標籤與即時通報 (a11y)**：自帶 \`aria-label\` 自動推導與隱藏式 \`role="status" aria-live="polite"\` 播報區塊，視障讀屏者第一時間接收操作反饋。
        `,
      },
    },
  },
  argTypes: {
    preset: {
      control: 'select',
      options: ['copy', 'download', 'close', 'check', 'refresh', 'external', 'more'],
      description: '內建預設圖示名稱',
      table: { defaultValue: { summary: 'copy' } },
    },
    variant: {
      control: 'select',
      options: ['ghost', 'subtle', 'outline', 'primary', 'danger'],
      description: '外觀風格變體',
      table: { defaultValue: { summary: 'ghost' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '尺寸大小（sm: 28px, md: 32px - 規範標準, lg: 40px）',
      table: { defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'inline-radio',
      options: ['rounded', 'circle', 'square'],
      description: '按鈕外觀幾何形狀（rounded: 6px, circle: 全圓, square: 直角）',
      table: { defaultValue: { summary: 'rounded' } },
    },
    tooltip: {
      control: 'text',
      description: '常態 Tooltip 浮動氣泡文字（未設定時自動採預設值）',
    },
    successTooltip: {
      control: 'text',
      description: '成功回饋時之 Tooltip 文字（預設為「已複製！」或「已下載！」）',
    },
    tooltipPlacement: {
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
      description: '氣泡提示顯示方位',
      table: { defaultValue: { summary: 'top' } },
    },
    noTooltip: {
      control: 'boolean',
      description: '是否強制關閉 Tooltip 氣泡',
      table: { defaultValue: { summary: 'false' } },
    },
    copyValue: {
      control: 'text',
      description: '複製到剪貼簿的目標字串內容',
      table: { defaultValue: { summary: '' } },
    },
    label: {
      control: 'text',
      description: '無障礙 aria-label 標籤（優先於 tooltip 自動推導）',
    },
    disabled: {
      control: 'boolean',
      description: '是否處於停用狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: '是否處於載入旋轉狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    active: {
      control: 'boolean',
      description: '是否維持 Active 啟動狀態（Success 翠綠色高反差）',
      table: { defaultValue: { summary: 'false' } },
    },
    feedbackDuration: {
      control: 'number',
      description: '成功/錯誤狀態持續時間 (毫秒)',
      table: { defaultValue: { summary: '2000' } },
    },
    color: {
      control: 'select',
      options: ['brand', 'accent', 'success', 'warning', 'danger', 'info', 'purple', 'neutral'],
      description: '語意色彩與懸停色彩主題（預設 brand 符合品牌主色）',
      table: { defaultValue: { summary: 'brand' } },
    },
  },
  args: {
    preset: 'copy',
    color: 'brand',
    variant: 'ghost',
    size: 'md',
    shape: 'rounded',
    tooltip: '',
    successTooltip: '',
    tooltipPlacement: 'top',
    noTooltip: false,
    copyValue: 'pnpm add @anchor-ui/core',
    downloadUrl: '',
    downloadFilename: '',
    label: '',
    disabled: false,
    loading: false,
    active: false,
    feedbackDuration: 2000,
  },
};

export default meta;
type Story = StoryObj<IconButtonStoryArgs>;

export const Default: Story = {
  render: (args) => html`
    <div style="padding: 40px; display: flex; align-items: center; justify-content: center;">
      <aui-icon-button
        .preset=${args.preset}
        .color=${args.color}
        .variant=${args.variant}
        .size=${args.size}
        .shape=${args.shape}
        .tooltip=${args.tooltip}
        .successTooltip=${args.successTooltip}
        .tooltipPlacement=${args.tooltipPlacement}
        ?no-tooltip=${args.noTooltip}
        .copyValue=${args.copyValue}
        .downloadUrl=${args.downloadUrl}
        .downloadFilename=${args.downloadFilename}
        .label=${args.label}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        ?active=${args.active}
        .feedbackDuration=${args.feedbackDuration}
      ></aui-icon-button>
    </div>
  `,
};

/**
 * 核心示範：程式碼區塊右上方「一鍵複製」互動
 */
export const CopyFeedbackDemo: Story = {
  render: () => {
    const codeSnippet = `import { AuiIconButton } from '@anchor-ui/core';\n\n// 建立複製按鈕\nconst btn = document.createElement('aui-icon-button');\nbtn.preset = 'copy';\nbtn.copyValue = 'Hello Anchor UI!';`;

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 580px;">
        <div style="font-size: 13px; font-weight: 600; color: var(--color-text-secondary);">
          IDE 風格程式碼預覽卡片（點擊右上角 32×32px 按鈕複製）
        </div>

        <div
          style="
            position: relative;
            background: var(--color-base, #ffffff);
            border: 1px solid var(--color-border, #e2e8f0);
            border-radius: var(--radius-md, 8px);
            padding: 16px 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          "
        >
          <!-- 頂部標題列與複製操作鈕 -->
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 12px;
              margin-bottom: 12px;
              border-bottom: 1px solid var(--color-border, #e2e8f0);
            "
          >
            <span
              style="
                font-family: var(--font-mono, monospace);
                font-size: 12px;
                color: var(--color-text-muted, #64748b);
              "
            >
              example.ts
            </span>

            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 11px; color: var(--color-text-muted);">點擊複製代碼</span>
              <aui-icon-button
                preset="copy"
                copy-value=${codeSnippet}
                tooltip="複製程式碼"
                success-tooltip="已複製至剪貼簿！"
                variant="ghost"
              ></aui-icon-button>
            </div>
          </div>

          <!-- 程式碼內容 -->
          <pre
            style="
              margin: 0;
              font-family: var(--font-mono, monospace);
              font-size: 13px;
              line-height: 1.6;
              color: var(--color-text-primary, #0f172a);
              overflow-x: auto;
            "
          ><code>${codeSnippet}</code></pre>
        </div>
      </div>
    `;
  },
};

/**
 * 核心示範：檔案下載互動動態
 */
export const DownloadFeedbackDemo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
      <div style="font-size: 13px; font-weight: 600; color: var(--color-text-secondary);">
        報表與匯出檔案卡片
      </div>

      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: var(--color-base, #ffffff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: var(--radius-md, 8px);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        "
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <div
            style="
              width: 36px;
              height: 36px;
              border-radius: var(--radius-sm, 6px);
              background: var(--color-brand-dim, rgba(15, 76, 129, 0.1));
              color: var(--color-brand-600, #0f4c81);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div>
            <div style="font-size: 13px; font-weight: 600; color: var(--color-text-primary);">
              anchor-ui-specification.pdf
            </div>
            <div style="font-size: 11px; color: var(--color-text-muted);">
              2.4 MB · 2026-09-30 產出
            </div>
          </div>
        </div>

        <aui-icon-button
          preset="download"
          download-url="data:text/plain;charset=utf-8,Anchor%20UI%20Test%20File"
          download-filename="anchor-ui-test.txt"
          tooltip="下載 specification.pdf"
          success-tooltip="已觸發檔案下載！"
          variant="subtle"
        ></aui-icon-button>
      </div>
    </div>
  `,
};

/**
 * 內建 7 款標準圖示集 (Presets)
 */
export const Presets: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="copy" copy-value="測試複製內容"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >copy</span
          >
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="download"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >download</span
          >
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="close"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >close</span
          >
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="refresh"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >refresh</span
          >
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="check"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >check</span
          >
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="external"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >external</span
          >
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <aui-icon-button preset="more"></aui-icon-button>
          <span style="font-size: 11px; color: var(--color-text-muted); font-family: monospace;"
            >more</span
          >
        </div>
      </div>
    </div>
  `,
};

/**
 * 5 種視覺風格變體 (Variants)
 */
export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          variant="ghost"
          tooltip="Ghost 變體 (預設)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Ghost</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          variant="subtle"
          tooltip="Subtle 淺底變體"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Subtle</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          variant="outline"
          tooltip="Outline 線框變體"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Outline</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          variant="primary"
          tooltip="Primary 品牌海軍藍"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Primary</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="close"
          variant="danger"
          tooltip="Danger 危險操作"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Danger</span>
      </div>
    </div>
  `,
};

/**
 * 3 種尺寸規格 (Sizes: sm 28px, md 32px, lg 40px)
 */
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          size="sm"
          tooltip="Small (28×28px)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">sm (28px)</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          size="md"
          tooltip="Medium (32×32px 規範標準)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 600;"
          >md (32px - 規範)</span
        >
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          size="lg"
          tooltip="Large (40×40px)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">lg (40px)</span>
      </div>
    </div>
  `,
};

/**
 * 3 種外觀形狀 (Shapes: rounded, circle, square)
 */
export const Shapes: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          shape="rounded"
          variant="outline"
          tooltip="Rounded (6px 圓角)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">rounded (預設)</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          shape="circle"
          variant="outline"
          tooltip="Circle (全圓形)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">circle</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          shape="square"
          variant="outline"
          tooltip="Square (直角)"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">square</span>
      </div>
    </div>
  `,
};

/**
 * 載入中與停用狀態 (Loading & Disabled)
 */
export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          loading
          tooltip="載入處理中"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Loading (旋轉 Spinner)</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          disabled
          tooltip="停用不可點擊"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Disabled</span>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          active
          tooltip="Active 翠綠高亮"
        ></aui-icon-button>
        <span style="font-size: 11px; color: var(--color-text-muted);">Active (Success 翠綠)</span>
      </div>
    </div>
  `,
};

/**
 * 自訂 Slot 圖示 (Custom Slotted Icons)
 */
export const CustomIconSlot: Story = {
  render: () => html`
    <div style="display: flex; gap: 20px; align-items: center;">
      <aui-icon-button tooltip="書籤收藏" variant="subtle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </aui-icon-button>

      <aui-icon-button tooltip="播放音樂" variant="primary" shape="circle">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </aui-icon-button>

      <aui-icon-button tooltip="搜尋檔案" variant="outline">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </aui-icon-button>
    </div>
  `,
};

/**
 * 氣泡提示方位展示 (Tooltip Placements)
 */
export const TooltipPlacements: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(4, 120px); gap: 24px; padding: 40px; justify-content: center;"
    >
      <div style="text-align: center;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          tooltip-placement="top"
          tooltip="Top 方位"
        ></aui-icon-button>
        <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 6px;">top</div>
      </div>

      <div style="text-align: center;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          tooltip-placement="bottom"
          tooltip="Bottom 方位"
        ></aui-icon-button>
        <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 6px;">bottom</div>
      </div>

      <div style="text-align: center;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          tooltip-placement="left"
          tooltip="Left 方位"
        ></aui-icon-button>
        <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 6px;">left</div>
      </div>

      <div style="text-align: center;">
        <aui-icon-button
          preset="copy"
          copy-value="Anchor UI"
          tooltip-placement="right"
          tooltip="Right 方位"
        ></aui-icon-button>
        <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 6px;">right</div>
      </div>
    </div>
  `,
};

/**
 * 懸停色彩主題展示 (Hover Colors & Custom Properties)
 * 展示支援透過 color 參數控制不同的懸停色彩（brand, accent, success, warning, danger, info, purple, neutral），
 * 以及透過 CSS 自訂屬性 (--aui-icon-btn-hover-bg, --aui-icon-btn-hover-border, --aui-icon-btn-hover-color) 自由客製。
 */
export const HoverColors: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 32px;">
      <div>
        <h4
          style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: var(--color-text-primary);"
        >
          1. 透過 color 屬性切換語意色彩 (color="brand | accent | success | danger | ...")
        </h4>
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="brand"
              tooltip="Brand (預設品牌海軍藍)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              brand (預設)
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="accent"
              tooltip="Accent (琥珀金)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              accent
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="success"
              tooltip="Success (翠綠)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              success
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="warning"
              tooltip="Warning (警示橙)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              warning
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="danger"
              tooltip="Danger (赤紅)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              danger
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="info"
              tooltip="Info (天藍)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              info
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="purple"
              tooltip="Purple (紫羅蘭)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              purple
            </div>
          </div>
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              color="neutral"
              tooltip="Neutral (中性灰)"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              neutral
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4
          style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: var(--color-text-primary);"
        >
          2. 透過 CSS 自訂屬性任意控制懸停樣式 (--aui-icon-btn-hover-*)
        </h4>
        <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
          <div style="text-align: center;">
            <aui-icon-button
              preset="copy"
              copy-value="Anchor UI"
              tooltip="客製青翠色 (Emerald)"
              style="--aui-icon-btn-hover-bg: #ecfdf5; --aui-icon-btn-hover-border: #6ee7b7; --aui-icon-btn-hover-color: #059669;"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              自訂 Emerald
            </div>
          </div>

          <div style="text-align: center;">
            <aui-icon-button
              preset="download"
              tooltip="客製洋紅色 (Rose)"
              style="--aui-icon-btn-hover-bg: #fff1f2; --aui-icon-btn-hover-border: #fda4af; --aui-icon-btn-hover-color: #e11d48;"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              自訂 Rose
            </div>
          </div>

          <div style="text-align: center;">
            <aui-icon-button
              preset="refresh"
              tooltip="客製深靛藍 (Indigo)"
              style="--aui-icon-btn-hover-bg: #e0e7ff; --aui-icon-btn-hover-border: #a5b4fc; --aui-icon-btn-hover-color: #4338ca;"
            ></aui-icon-button>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              自訂 Indigo
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
