import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import type { AuiCodeView } from './code-view.js';
import './index.js';

const CODE = JSON.stringify(
  {
    name: '@anchor-ui/core',
    version: '1.0.0',
    dependencies: { lit: '^3.3.0', '@floating-ui/dom': '^1.7.0' },
    keywords: ['web-components', 'lit', 'design-system'],
    description: 'A framework-agnostic Web Component library built with Lit and design tokens.',
  },
  null,
  2,
);

describeVisual('AuiCodeView visual regression', [
  {
    name: 'code-view-expanded',
    render: () => html`
      <div class="visual-frame" style="width: 520px">
        <aui-code-view .code=${CODE} style="flex: 1"></aui-code-view>
      </div>
    `,
  },
  {
    name: 'code-view-folded-scrolled',
    render: () => html`
      <div class="visual-frame" style="width: 360px">
        <aui-code-view .code=${CODE} style="flex: 1"></aui-code-view>
      </div>
    `,
    setup: async (frame) => {
      const view = frame.querySelector<AuiCodeView>('aui-code-view')!;
      await view.updateComplete;
      // 摺疊 dependencies，並水平捲動：行號列維持在左側
      view
        .shadowRoot!.querySelector<HTMLButtonElement>('[part="fold-button"][data-line="3"]')!
        .click();
      await view.updateComplete;
      view.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!.scrollLeft = 120;
    },
  },
]);
