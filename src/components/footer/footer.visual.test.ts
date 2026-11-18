import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';
import type { FooterColumn } from './footer.types.js';

/** 版權年份取自當下日期：截圖固定使用 copyright slot，避免跨年時基準圖失效 */
const COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Components', href: '#components' },
      { label: 'Design tokens', href: '#tokens' },
      { label: 'Changelog', href: '#changelog' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Getting started', href: '#start' },
      { label: 'GitHub', href: '#github', external: true },
    ],
  },
  {
    heading: 'Company',
    links: [{ label: 'About', href: '#about' }],
  },
];

const bottomRow = html`
  <span slot="copyright">© 2024–2026 Anchor UI</span>
  <a slot="links" href="#privacy">Privacy</a>
  <a slot="links" href="#terms">Terms</a>
`;

describeVisual('AuiFooter visual regression', [
  {
    name: 'footer-minimal',
    render: () => html`
      <div class="visual-frame" style="width: 800px">
        <aui-footer version="1.0.0">${bottomRow}</aui-footer>
      </div>
    `,
  },
  {
    name: 'footer-columns',
    render: () => html`
      <div class="visual-frame" style="width: 800px">
        <aui-footer version="1.0.0" .columns=${COLUMNS}>${bottomRow}</aui-footer>
      </div>
    `,
  },
  {
    name: 'footer-narrow',
    render: () => html`
      <div class="visual-frame" style="width: 360px">
        <aui-footer version="1.0.0" .columns=${COLUMNS}>${bottomRow}</aui-footer>
      </div>
    `,
  },
]);
