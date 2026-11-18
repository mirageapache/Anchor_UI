import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';
import '../button/index.js';

/** 搜尋鈕的鍵帽依平台顯示（Docker 中的 Linux 為 Ctrl K），基準圖只在 Docker 中產生 */
const links = html`
  <a href="#docs" aria-current="page">Docs</a>
  <a href="#components">Components</a>
  <a href="#tokens">Tokens</a>
`;

describeVisual('AuiNavbar visual regression', [
  {
    name: 'navbar-wide',
    render: () => html`
      <div class="visual-frame" style="width: 960px">
        <aui-navbar brand="Anchor UI" brand-href="#">${links}</aui-navbar>
      </div>
    `,
  },
  {
    name: 'navbar-narrow-actions',
    render: () => html`
      <div class="visual-frame" style="width: 400px">
        <aui-navbar brand="Anchor UI" brand-href="#">
          ${links}
          <aui-button slot="actions" size="sm">登入</aui-button>
        </aui-navbar>
      </div>
    `,
  },
]);
