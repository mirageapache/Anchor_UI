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
]);
