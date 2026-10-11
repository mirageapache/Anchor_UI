import { fixture, html, oneEvent } from '@open-wc/testing';
import { prepareVisualEnvironment, setVisualTheme, snapshot } from '../../test-utils/visual.js';
import type { AuiTooltip } from './tooltip.js';
import './index.js';

describe('AuiTooltip visual regression', () => {
  before(prepareVisualEnvironment);
  afterEach(() => setVisualTheme('light'));

  for (const theme of ['light', 'dark'] as const) {
    for (const arrow of [false, true]) {
      it(`open${arrow ? ' with arrow' : ''} (${theme})`, async () => {
        setVisualTheme(theme);
        // 氣泡位於 Top Layer，但截圖是「頁面在此元素範圍內的畫面」，因此預留足夠空間讓氣泡落在框內
        const frame = await fixture(html`
          <div
            class="visual-frame"
            style="width: 320px; height: 120px; justify-content: center; align-items: flex-end;"
          >
            <aui-tooltip content="Copy snippet to clipboard" placement="top" ?arrow=${arrow}>
              <button>Hover target</button>
            </aui-tooltip>
          </div>
        `);
        const tooltip = frame.querySelector<AuiTooltip>('aui-tooltip')!;
        setTimeout(() => tooltip.show());
        await oneEvent(tooltip, 'aui-after-show');
        await tooltip.reposition();
        await snapshot(frame, `tooltip-open${arrow ? '-arrow' : ''}-${theme}`);
      });
    }
  }
});
