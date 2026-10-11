import { fixture, html } from '@open-wc/testing';
import { prepareVisualEnvironment, setVisualTheme, snapshot } from '../../test-utils/visual.js';
import './index.js';

describe('AuiTag visual regression', () => {
  before(prepareVisualEnvironment);
  afterEach(() => setVisualTheme('light'));

  const variants = ['neutral', 'brand', 'success', 'warning', 'danger', 'info', 'purple'] as const;

  for (const theme of ['light', 'dark'] as const) {
    it(`variants (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
        <div class="visual-frame">
          ${variants.map((variant) => html`<aui-tag .variant=${variant}>${variant}</aui-tag>`)}
        </div>
      `);
      await snapshot(frame, `tag-variants-${theme}`);
    });

    it(`sizes and options (${theme})`, async () => {
      setVisualTheme(theme);
      const frame = await fixture(html`
        <div class="visual-frame">
          <aui-tag size="sm">small</aui-tag>
          <aui-tag size="md">medium</aui-tag>
          <aui-tag size="lg">large</aui-tag>
          <aui-tag pill variant="brand">pill</aui-tag>
          <aui-tag preserve-case variant="info">PreserveCase</aui-tag>
          <aui-tag removable variant="success">removable</aui-tag>
          <aui-tag interactive removable variant="purple">interactive</aui-tag>
        </div>
      `);
      await snapshot(frame, `tag-sizes-options-${theme}`);
    });
  }
});
