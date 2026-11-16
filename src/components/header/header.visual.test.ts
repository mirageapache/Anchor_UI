import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

const column = 'flex-direction: column; align-items: stretch; gap: 28px;';

describeVisual('AuiHeader visual regression', [
  {
    name: 'header-full',
    render: () => html`
      <div class="visual-frame" style="${column} width: 560px;">
        <aui-header
          heading="JSON Formatter"
          description="Format, validate and minify JSON documents. Everything runs in your browser."
          hot
          favoritable
          favorite
        >
          <aui-tag slot="tags" variant="brand">json</aui-tag>
          <aui-tag slot="tags">format</aui-tag>
        </aui-header>
        <aui-header heading="UUID Generator" description="Generate v4 / v7 UUIDs." favoritable>
          <aui-tag slot="tags" variant="purple">uuid</aui-tag>
        </aui-header>
        <aui-header heading="Heading only"></aui-header>
      </div>
    `,
  },
  {
    name: 'header-narrow',
    render: () => html`
      <div class="visual-frame" style="${column} width: 280px;">
        <aui-header
          heading="Averyverylongunbrokentoolnamethatmustwrap"
          description="Long titles wrap inside the container and keep the favorite button visible."
          hot
          hot-label="熱門"
          favoritable
        >
          <aui-tag slot="tags" variant="info">text</aui-tag>
        </aui-header>
        <aui-header heading="With actions" favoritable favorite>
          <button slot="actions">Share</button>
          <button slot="actions">Export</button>
        </aui-header>
      </div>
    `,
  },
]);
