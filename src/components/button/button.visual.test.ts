import { fixture, html } from '@open-wc/testing';
import { prepareVisualEnvironment, setVisualTheme, snapshot } from '../../test-utils/visual.js';
import './index.js';

describe('AuiButton visual regression', () => {
  before(prepareVisualEnvironment);
  afterEach(() => setVisualTheme('light'));

  for (const theme of ['light', 'dark'] as const) {
    it(`variants (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
        <div class="visual-frame">
          <aui-button variant="primary">Primary</aui-button>
          <aui-button variant="accent">Accent</aui-button>
          <aui-button variant="ghost">Ghost</aui-button>
          <aui-button variant="danger">Danger</aui-button>
          <aui-button variant="success">Success</aui-button>
        </div>
      `);
      await snapshot(frame, `button-variants-${theme}`);
    });

    it(`sizes and states (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
        <div class="visual-frame">
          <aui-button size="sm">Small</aui-button>
          <aui-button size="md">Medium</aui-button>
          <aui-button size="lg">Large</aui-button>
          <aui-button disabled>Disabled</aui-button>
          <aui-button loading>Loading</aui-button>
        </div>
      `);
      await snapshot(frame, `button-sizes-states-${theme}`);
    });
  }
});
