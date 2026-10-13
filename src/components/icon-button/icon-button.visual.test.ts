import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import type { AuiIconButton } from './icon-button.js';
import './index.js';

const variants = ['ghost', 'subtle', 'outline', 'primary', 'danger'] as const;
const presets = ['copy', 'download', 'check', 'close', 'refresh', 'external', 'more'] as const;

describeVisual('AuiIconButton visual regression', [
  {
    name: 'icon-button-variants',
    render: () => html`
      <div class="visual-frame">
        ${variants.map(
          (variant) =>
            html`<aui-icon-button preset="copy" .variant=${variant} no-tooltip></aui-icon-button>`,
        )}
      </div>
    `,
  },
  {
    name: 'icon-button-presets',
    render: () => html`
      <div class="visual-frame">
        ${presets.map(
          (preset) => html`<aui-icon-button .preset=${preset} no-tooltip></aui-icon-button>`,
        )}
        <aui-icon-button preset="copy" size="sm" no-tooltip></aui-icon-button>
        <aui-icon-button preset="copy" size="lg" no-tooltip></aui-icon-button>
        <aui-icon-button
          preset="copy"
          shape="circle"
          variant="outline"
          no-tooltip
        ></aui-icon-button>
        <aui-icon-button
          preset="copy"
          shape="square"
          variant="outline"
          no-tooltip
        ></aui-icon-button>
      </div>
    `,
  },
  {
    name: 'icon-button-states',
    render: () => html`
      <div class="visual-frame">
        <aui-icon-button preset="copy" no-tooltip></aui-icon-button>
        <aui-icon-button preset="copy" class="success" no-tooltip></aui-icon-button>
        <aui-icon-button preset="copy" class="error" no-tooltip></aui-icon-button>
        <aui-icon-button preset="copy" loading no-tooltip></aui-icon-button>
        <aui-icon-button preset="copy" disabled no-tooltip></aui-icon-button>
      </div>
    `,
    // 觸發成功／錯誤回饋，並延長回饋時間避免截圖前自動復原
    setup: async (frame) => {
      const success = frame.querySelector<AuiIconButton>('.success')!;
      const error = frame.querySelector<AuiIconButton>('.error')!;
      success.feedbackDuration = 60000;
      error.feedbackDuration = 60000;
      success.triggerFeedback('success');
      error.triggerFeedback('error');
      await Promise.all([success.updateComplete, error.updateComplete]);
    },
  },
]);
