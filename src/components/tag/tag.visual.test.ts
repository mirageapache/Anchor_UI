import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

const variants = ['neutral', 'brand', 'success', 'warning', 'danger', 'info', 'purple'] as const;

describeVisual('AuiTag visual regression', [
  {
    name: 'tag-variants',
    render: () => html`
      <div class="visual-frame">
        ${variants.map((variant) => html`<aui-tag .variant=${variant}>${variant}</aui-tag>`)}
      </div>
    `,
  },
  {
    name: 'tag-sizes-options',
    render: () => html`
      <div class="visual-frame">
        <aui-tag size="sm">small</aui-tag>
        <aui-tag size="md">medium</aui-tag>
        <aui-tag size="lg">large</aui-tag>
        <aui-tag pill variant="brand">pill</aui-tag>
        <aui-tag preserve-case variant="info">PreserveCase</aui-tag>
        <aui-tag removable variant="success">removable</aui-tag>
        <aui-tag interactive removable variant="purple">interactive</aui-tag>
      </div>
    `,
  },
]);
