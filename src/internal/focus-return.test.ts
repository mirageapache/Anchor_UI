import { expect, fixture, html } from '@open-wc/testing';
import { getDeepActiveElement, rememberFocus } from './focus-return.js';
import '../components/button/index.js';
import type { AuiButton } from '../components/button/button.js';

/** 測試用：shadow root 內再包一個 <aui-button> 的元件，模擬多層 Shadow DOM */
class FocusReturnHost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<aui-button>Nested</aui-button>';
  }
}
if (!customElements.get('focus-return-host')) {
  customElements.define('focus-return-host', FocusReturnHost);
}

describe('internal/focus-return', () => {
  it('finds the element that actually has focus inside Shadow DOM', async () => {
    const button = await fixture<AuiButton>(html`<aui-button>Trigger</aui-button>`);
    button.focus();

    // document.activeElement 只會回傳最外層的 host
    expect(document.activeElement).to.equal(button);
    expect(getDeepActiveElement()).to.equal(button.shadowRoot!.querySelector('button'));
  });

  it('walks through multiple nested shadow roots', async () => {
    const host = await fixture<FocusReturnHost>(html`<focus-return-host></focus-return-host>`);
    const nested = host.shadowRoot!.querySelector<AuiButton>('aui-button')!;
    await nested.updateComplete;
    nested.focus();

    expect(getDeepActiveElement()).to.equal(nested.shadowRoot!.querySelector('button'));
  });

  it('restores focus to the original trigger inside Shadow DOM', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <aui-button id="trigger">Open</aui-button>
        <input id="elsewhere" />
      </div>
    `);
    const trigger = wrapper.querySelector<AuiButton>('#trigger')!;
    trigger.focus();

    const restore = rememberFocus();
    wrapper.querySelector<HTMLInputElement>('#elsewhere')!.focus(); // 例如焦點移入對話框
    restore();

    expect(document.activeElement).to.equal(trigger);
    expect(trigger.shadowRoot!.activeElement).to.equal(trigger.shadowRoot!.querySelector('button'));
  });

  it('does nothing when the trigger has been removed', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div><button id="trigger">Delete row</button><input id="elsewhere" /></div>
    `);
    const trigger = wrapper.querySelector<HTMLButtonElement>('#trigger')!;
    const elsewhere = wrapper.querySelector<HTMLInputElement>('#elsewhere')!;
    trigger.focus();

    const restore = rememberFocus();
    elsewhere.focus();
    trigger.remove(); // 例如確認刪除後，觸發按鈕所在的列被移除

    expect(() => restore()).to.not.throw();
    expect(document.activeElement).to.equal(elsewhere);
  });

  it('does nothing when nothing was focused', () => {
    (document.activeElement as HTMLElement | null)?.blur();
    const restore = rememberFocus();
    expect(() => restore()).to.not.throw();
  });
});
