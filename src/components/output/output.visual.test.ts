import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

const column = 'flex-direction: column; align-items: stretch; width: 360px;';

describeVisual('AuiOutput visual regression', [
  {
    name: 'output-states',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-output value="SGVsbG8sIEFuY2hvciBVSSE="></aui-output>
        <aui-output status="warning" value="Non-ASCII characters encoded as UTF-8"></aui-output>
        <aui-output status="error" value="Invalid Base64 input"></aui-output>
        <aui-output placeholder="Result will appear here"></aui-output>
      </div>
    `,
  },
  {
    name: 'output-long-text',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-output
          value=${'https://example.com/a/very/long/url/without/any/spaces/that/must/wrap/safely?token=9f8e7d6c5b4a3f2e1d0c'}
        ></aui-output>
        <aui-output
          status="error"
          value=${'SyntaxError: Unexpected token } in JSON\n  at line 3, column 14'}
        ></aui-output>
      </div>
    `,
  },
]);
