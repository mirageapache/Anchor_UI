import { html, oneEvent } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import '../button/index.js';
import '../icon-button/index.js';
import '../tag/index.js';
import './index.js';
import type { AuiPopover } from './popover.js';

/** 開啟框內所有的 Popover 並等待進場完成 */
async function openAll(frame: HTMLElement): Promise<void> {
  for (const popover of frame.querySelectorAll<AuiPopover>('aui-popover')) {
    const shown = oneEvent(popover, 'aui-after-show');
    popover.show();
    await shown;
  }
}

describeVisual('AuiPopover visual regression', [
  {
    // 導覽列的通知清單：面板在觸發元素下方，靠右對齊
    name: 'popover-notifications',
    setup: openAll,
    render: () => html`
      <div
        class="visual-frame"
        style="width: 420px; height: 220px; align-items: flex-start; justify-content: flex-end;"
      >
        <aui-popover label="通知" placement="bottom-end">
          <aui-icon-button slot="trigger" preset="more" label="通知"></aui-icon-button>
          <div style="display: grid; gap: 8px; width: 260px;">
            <strong>通知</strong>
            <span>建置完成：v1.1.0</span>
            <span style="color: var(--color-text-secondary);">有 2 個待審查的 PR</span>
            <aui-button size="sm" variant="ghost">全部標為已讀</aui-button>
          </div>
        </aui-popover>
      </div>
    `,
  },
  {
    // 使用者資訊面板：一般按鈕觸發，面板在下方靠左
    name: 'popover-user-panel',
    setup: openAll,
    render: () => html`
      <div class="visual-frame" style="width: 420px; height: 200px; align-items: flex-start;">
        <aui-popover>
          <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
          <div style="display: grid; gap: 4px;">
            <strong>王小明</strong>
            <span style="color: var(--color-text-secondary);">ming@example.com</span>
            <aui-tag variant="brand">管理員</aui-tag>
          </div>
        </aui-popover>
      </div>
    `,
  },
]);
