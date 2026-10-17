import { html } from '@open-wc/testing';
import { describeVisual, type VisualCase } from '../../test-utils/visual.js';
import type { AuiInput } from './input.js';
import './index.js';

const column = 'flex-direction: column; align-items: stretch; width: 360px;';

/** 聚焦輸入框；delegatesFocus 聚焦時會全選文字，收合選取範圍以免截到選取底色 */
function focusInput(frame: HTMLElement): void {
  const input = frame.querySelector<AuiInput>('aui-input')!;
  input.focus();
  const control = input.shadowRoot!.querySelector<HTMLInputElement>('.control')!;
  control.setSelectionRange(0, 0);
}

const focusCase = (invalid: boolean): VisualCase => ({
  name: `input-focus${invalid ? '-invalid' : ''}`,
  render: () => html`
    <div class="visual-frame" style=${column}>
      <!-- 文字游標會閃爍，截圖前設為透明 -->
      <style>
        aui-input::part(control) {
          caret-color: transparent;
        }
      </style>
      <aui-input label="Focused" value="Focus ring" ?invalid=${invalid}></aui-input>
    </div>
  `,
  setup: focusInput,
});

describeVisual('AuiInput visual regression', [
  {
    name: 'input-states',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-input label="Empty" placeholder="Placeholder text"></aui-input>
        <aui-input label="Filled" value="sk-live-4f9a2c7e"></aui-input>
        <aui-input label="Invalid" value="not-an-email" invalid></aui-input>
        <aui-input label="Readonly" value="Read only value" readonly></aui-input>
        <aui-input label="Disabled" value="Disabled value" disabled></aui-input>
      </div>
    `,
  },
  {
    name: 'input-multiline',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-input
          label="Payload"
          multiline
          rows="4"
          value=${'{\n  "id": 42,\n  "url": "https://example.com/a/very/long/path/that/should/wrap/inside/the/textarea"\n}'}
        ></aui-input>
      </div>
    `,
  },
  focusCase(false),
  focusCase(true),
]);
