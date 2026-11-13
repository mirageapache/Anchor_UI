import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';
import '../input/index.js';
import '../output/index.js';

const column = 'flex-direction: column; align-items: stretch; width: 400px; gap: 16px;';

describeVisual('AuiField visual regression', [
  {
    name: 'field-layouts',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-field label="Input" description="Paste any text to encode">
          <aui-input placeholder="Type or paste here"></aui-input>
        </aui-field>
        <aui-field label="Access token" copyable clearable>
          <aui-input value="tok_9f8e7d6c5b4a"></aui-input>
        </aui-field>
        <aui-field label="Request body" description="JSON only" copyable>
          <aui-input multiline rows="3" value=${'{\n  "ok": true\n}'}></aui-input>
        </aui-field>
        <aui-field>
          <aui-input placeholder="Field without head"></aui-input>
        </aui-field>
      </div>
    `,
  },
  {
    name: 'field-output',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-field label="Output" description="Base64 encoded" copyable>
          <aui-output value="SGVsbG8sIEFuY2hvciBVSSE="></aui-output>
        </aui-field>
      </div>
    `,
  },
]);
