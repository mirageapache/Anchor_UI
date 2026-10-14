import { html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { describeVisual } from '../../test-utils/visual.js';
import type { AuiSegmented } from './segmented.js';
import type { SegmentedOption } from './segmented.types.js';
import './index.js';

const MODES: SegmentedOption[] = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
  { value: 'auto', label: 'Auto detect' },
];

const WITH_DISABLED: SegmentedOption[] = [
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML', disabled: true },
];

const column = 'flex-direction: column; align-items: flex-start;';

describeVisual('AuiSegmented visual regression', [
  {
    name: 'segmented-states',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-segmented label="Mode" .options=${MODES} value="encode"></aui-segmented>
        <aui-segmented label="Mode" .options=${MODES}></aui-segmented>
        <aui-segmented label="Format" .options=${WITH_DISABLED} value="yaml"></aui-segmented>
        <aui-segmented label="Mode" .options=${MODES} value="decode" disabled></aui-segmented>
      </div>
    `,
  },
  {
    name: 'segmented-focus',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-segmented label="Mode" .options=${MODES} value="decode"></aui-segmented>
      </div>
    `,
    // :focus-visible 只在鍵盤操作時出現；以方向鍵移動焦點來呈現焦點環
    setup: async (frame) => {
      const el = frame.querySelector<AuiSegmented>('aui-segmented')!;
      el.focus();
      await sendKeys({ press: 'ArrowRight' });
      await el.updateComplete;
    },
  },
]);
