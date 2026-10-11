import { fixture, html } from '@open-wc/testing';
import { prepareVisualEnvironment, setVisualTheme, snapshot } from '../../test-utils/visual.js';
import type { AuiIconButton } from './icon-button.js';
import './index.js';

describe('AuiIconButton visual regression', () => {
  before(prepareVisualEnvironment);
  afterEach(() => setVisualTheme('light'));

  const variants = ['ghost', 'subtle', 'outline', 'primary', 'danger'] as const;
  const presets = ['copy', 'download', 'check', 'close', 'refresh', 'external', 'more'] as const;

  for (const theme of ['light', 'dark'] as const) {
    it(`variants (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
        <div class="visual-frame">
          ${variants.map(
            (variant) =>
              html`<aui-icon-button
                preset="copy"
                .variant=${variant}
                no-tooltip
              ></aui-icon-button>`,
          )}
        </div>
      `);
      await snapshot(frame, `icon-button-variants-${theme}`);
    });

    it(`presets, sizes and shapes (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
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
      `);
      await snapshot(frame, `icon-button-presets-${theme}`);
    });

    it(`states (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
        <div class="visual-frame">
          <aui-icon-button preset="copy" no-tooltip></aui-icon-button>
          <aui-icon-button preset="copy" class="success" no-tooltip></aui-icon-button>
          <aui-icon-button preset="copy" class="error" no-tooltip></aui-icon-button>
          <aui-icon-button preset="copy" loading no-tooltip></aui-icon-button>
          <aui-icon-button preset="copy" disabled no-tooltip></aui-icon-button>
        </div>
      `);
      const success = frame.querySelector<AuiIconButton>('.success')!;
      const error = frame.querySelector<AuiIconButton>('.error')!;
      success.feedbackDuration = 60000;
      error.feedbackDuration = 60000;
      success.triggerFeedback('success');
      error.triggerFeedback('error');
      await Promise.all([success.updateComplete, error.updateComplete]);
      await snapshot(frame, `icon-button-states-${theme}`);
    });
  }
});
