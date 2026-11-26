import { html, oneEvent } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import '../button/index.js';
import './index.js';
import type { AuiMenu } from './menu.js';

describeVisual('AuiMenu visual regression', [
  {
    // 導覽列的使用者選單：第二個項目聚焦（鍵盤操作中），含停用項目與分隔線
    name: 'menu-user',
    setup: async (frame) => {
      const menu = frame.querySelector<AuiMenu>('aui-menu')!;
      const shown = oneEvent(menu, 'aui-after-show');
      menu.show();
      await shown;
      // focusVisible 尚未列入 TypeScript 的 FocusOptions：強制顯示焦點框，模擬鍵盤操作中的外觀
      menu
        .querySelector<HTMLElement>('[value="settings"]')!
        .focus({ focusVisible: true } as FocusOptions);
    },
    render: () => html`
      <div
        class="visual-frame"
        style="width: 360px; height: 230px; align-items: flex-start; justify-content: flex-end;"
      >
        <aui-menu label="使用者選單" placement="bottom-end">
          <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
          <a href="#profile">個人資料</a>
          <button value="settings">設定</button>
          <button value="billing" aria-disabled="true">帳單（未開通）</button>
          <hr />
          <button value="logout">登出</button>
        </aui-menu>
      </div>
    `,
  },
]);
