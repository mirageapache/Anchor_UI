import { html, oneEvent } from '@open-wc/testing';
import { describeVisual, type VisualCase } from '../../test-utils/visual.js';
import type { AuiTooltip } from './tooltip.js';
import './index.js';

/** 開啟氣泡並完成定位後再截圖 */
async function openTooltip(frame: HTMLElement): Promise<void> {
  const tooltip = frame.querySelector<AuiTooltip>('aui-tooltip')!;
  setTimeout(() => tooltip.show());
  await oneEvent(tooltip, 'aui-after-show');
  await tooltip.reposition();
}

const openCase = (arrow: boolean): VisualCase => ({
  name: `tooltip-open${arrow ? '-arrow' : ''}`,
  // 氣泡位於 Top Layer，但截圖是「頁面在此元素範圍內的畫面」，因此預留足夠空間讓氣泡落在框內
  render: () => html`
    <div
      class="visual-frame"
      style="width: 320px; height: 120px; justify-content: center; align-items: flex-end;"
    >
      <aui-tooltip content="Copy snippet to clipboard" placement="top" ?arrow=${arrow}>
        <button>Hover target</button>
      </aui-tooltip>
    </div>
  `,
  setup: openTooltip,
});

describeVisual('AuiTooltip visual regression', [openCase(false), openCase(true)]);
