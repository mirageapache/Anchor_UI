import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

describeVisual('AuiFavoriteBtn visual regression', [
  {
    name: 'favorite-btn-states',
    render: () => html`
      <div class="visual-frame">
        <aui-favorite-btn size="sm"></aui-favorite-btn>
        <aui-favorite-btn></aui-favorite-btn>
        <aui-favorite-btn size="lg"></aui-favorite-btn>
        <aui-favorite-btn size="sm" favorite></aui-favorite-btn>
        <aui-favorite-btn favorite></aui-favorite-btn>
        <aui-favorite-btn size="lg" favorite></aui-favorite-btn>
        <aui-favorite-btn disabled></aui-favorite-btn>
        <aui-favorite-btn disabled favorite></aui-favorite-btn>
      </div>
    `,
  },
]);
