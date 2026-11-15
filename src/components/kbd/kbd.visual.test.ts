import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

describeVisual('AuiKbd visual regression', [
  {
    name: 'kbd-keys',
    render: () => html`
      <div class="visual-frame" style="flex-direction: column; align-items: flex-start;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <aui-kbd>K</aui-kbd>
          <aui-kbd>Ctrl</aui-kbd>
          <aui-kbd>Enter</aui-kbd>
          <aui-kbd label="Command">⌘</aui-kbd>
          <aui-kbd label="Command K">⌘K</aui-kbd>
          <aui-kbd size="sm">Esc</aui-kbd>
          <aui-kbd size="sm">K</aui-kbd>
        </div>
        <p style="margin: 0; width: 220px; font-size: 14px; line-height: 1.5;">
          Press <aui-kbd>Ctrl</aui-kbd> + <aui-kbd>C</aui-kbd> to copy the result, or
          <aui-kbd>Esc</aui-kbd> to close the dialog and return
        </p>
        <div style="padding: 8px 12px; background-color: var(--color-base); border-radius: 8px;">
          <aui-kbd>Shift</aui-kbd> + <aui-kbd>Tab</aui-kbd>
        </div>
      </div>
    `,
  },
]);
