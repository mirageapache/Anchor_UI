import { html, oneEvent } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { describeVisual } from '../../test-utils/visual.js';
import type { AuiDrawer } from './drawer.js';
import './index.js';
import '../button/index.js';

/**
 * Drawer 位於 Top Layer、貼齊視窗側邊，因此截圖範圍為固定撐滿視窗的外框，
 * 並固定視窗大小，讓面板的位置穩定。
 */
const viewportFrame = 'position: fixed; inset: 0; display: block; padding: 24px;';

/** 背景頁面內容：呈現遮罩的模糊與變暗效果 */
const pageContent = html`
  <h1 style="margin: 0 0 8px; font-size: 24px;">Background page</h1>
  <p style="margin: 0 0 16px;">This content sits behind the drawer backdrop.</p>
  <aui-button>Page action</aui-button>
`;

const navLinks = html`
  <nav style="display: grid; gap: 12px;">
    <a href="#overview">Overview</a>
    <a href="#components">Components</a>
    <a href="#tokens">Design tokens</a>
  </nav>
`;

async function openDrawer(frame: HTMLElement): Promise<void> {
  await setViewport({ width: 800, height: 600 });
  const drawer = frame.querySelector<AuiDrawer>('aui-drawer')!;
  const shown = oneEvent(drawer, 'aui-after-show');
  drawer.open = true;
  await shown;
  // 截圖時不顯示焦點（面板以程式聚焦）
  (document.activeElement as HTMLElement | null)?.blur();
}

describeVisual('AuiDrawer visual regression', [
  {
    name: 'drawer-left',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-drawer heading="Anchor UI">${navLinks}</aui-drawer>
      </div>
    `,
    setup: openDrawer,
  },
  {
    name: 'drawer-right-footer',
    render: () => html`
      <div class="visual-frame" style=${viewportFrame}>
        ${pageContent}
        <aui-drawer heading="Filters" placement="right">
          <p style="margin: 0;">Narrow the results by status and owner.</p>
          <aui-button slot="footer" variant="ghost">Reset</aui-button>
          <aui-button slot="footer">Apply</aui-button>
        </aui-drawer>
      </div>
    `,
    setup: openDrawer,
  },
]);
