import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

describeVisual('AuiButton visual regression', [
  {
    name: 'button-variants',
    render: () => html`
      <div class="visual-frame">
        <aui-button variant="primary">Primary</aui-button>
        <aui-button variant="accent">Accent</aui-button>
        <aui-button variant="ghost">Ghost</aui-button>
        <aui-button variant="danger">Danger</aui-button>
        <aui-button variant="success">Success</aui-button>
      </div>
    `,
  },
  {
    name: 'button-sizes-states',
    render: () => html`
      <div class="visual-frame">
        <aui-button size="sm">Small</aui-button>
        <aui-button size="md">Medium</aui-button>
        <aui-button size="lg">Large</aui-button>
        <aui-button disabled>Disabled</aui-button>
        <aui-button loading>Loading</aui-button>
      </div>
    `,
  },
]);
