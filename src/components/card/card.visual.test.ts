import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import '../tag/index.js';
import './index.js';

// 視覺測試環境只載入 tokens.css，這裡直接寫入與 .card-grid 相同的格線規則
const grid = (width: number) =>
  `display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr)); gap: 16px; align-items: stretch; width: ${width}px;`;

const longDescription =
  'Format, validate and minify JSON documents with syntax highlighting, tree view and error location hints for large payloads.';

describeVisual('AuiCard visual regression', [
  {
    name: 'card-grid',
    render: () => html`
      <div class="visual-frame" style=${grid(620)}>
        <aui-card heading="JSON Formatter" description=${longDescription} href="/json">
          <aui-tag slot="tags" variant="brand">json</aui-tag>
          <aui-tag slot="tags">format</aui-tag>
        </aui-card>
        <aui-card heading="UUID Generator" description="Generate v4 / v7 UUIDs" href="/uuid" hot>
          <aui-tag slot="tags" variant="purple">uuid</aui-tag>
        </aui-card>
        <aui-card heading="Base64" description="Encode and decode Base64 text" href="/base64">
          <aui-tag slot="tags" variant="success">encode</aui-tag>
        </aui-card>
        <aui-card heading="Heading only" href="/only"></aui-card>
      </div>
    `,
  },
  {
    name: 'card-narrow-static',
    render: () => html`
      <div class="visual-frame" style=${grid(240)}>
        <aui-card
          heading="averyverylongunbrokentoolnamethatmustwrap"
          description=${longDescription}
          hot
          hot-label="熱門"
        ></aui-card>
        <aui-card heading="No clamp" lines="0" description=${longDescription}></aui-card>
      </div>
    `,
  },
  {
    // KPI 卡片：左側圖示、右側數值（heading slot）與說明
    name: 'card-icon',
    render: () => html`
      <div class="visual-frame" style=${grid(620)}>
        <aui-card description="本月營收" href="/revenue">
          <svg
            slot="icon"
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 17l6-6 4 4 8-8" />
          </svg>
          <span slot="heading" style="font-size: 1.5rem;">NT$ 1.2M</span>
        </aui-card>
        <aui-card heading="Users" description="Active users this week" hot>
          <svg
            slot="icon"
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
          <aui-tag slot="tags" variant="success">+12%</aui-tag>
        </aui-card>
      </div>
    `,
  },
]);
