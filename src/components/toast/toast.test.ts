import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import './toast.js';
import type { AuiToast } from './toast.js';

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const part = (el: AuiToast, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`);

/** 等待 live region 填入內容（插入後兩幀） */
async function announced(el: AuiToast): Promise<void> {
  await nextFrame();
  await nextFrame();
  await el.updateComplete;
}

describe('AuiToast (<aui-toast>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  it('renders the variant icon, title and message', async () => {
    const el = await fixture<AuiToast>(
      html`<aui-toast variant="success" heading="Copied" message="Saved to clipboard"></aui-toast>`,
    );
    await announced(el);
    expect(part(el, 'base')!.classList.contains('toast--success')).to.be.true;
    expect(part(el, 'icon')!.getAttribute('aria-hidden')).to.equal('true');
    expect(part(el, 'icon')!.querySelector('svg')).to.exist;
    expect(part(el, 'title')!.textContent).to.equal('Copied');
    expect(part(el, 'message')!.textContent).to.equal('Saved to clipboard');
  });

  it('uses a spinner for loading and falls back to info for unknown variants', async () => {
    const loading = await fixture<AuiToast>(html`<aui-toast variant="loading"></aui-toast>`);
    expect(part(loading, 'icon')!.querySelector('.aui-spinner')).to.exist;

    const unknown = await fixture<AuiToast>(html`<aui-toast variant=${'nope'}></aui-toast>`);
    expect(part(unknown, 'base')!.classList.contains('toast--info')).to.be.true;
  });

  describe('live region', () => {
    it('is a status region for non-error variants and an alert region for errors', async () => {
      for (const variant of ['success', 'warning', 'info', 'loading'] as const) {
        const el = await fixture<AuiToast>(html`<aui-toast .variant=${variant}></aui-toast>`);
        expect(part(el, 'content')!.getAttribute('role'), variant).to.equal('status');
      }
      const error = await fixture<AuiToast>(html`<aui-toast variant="error"></aui-toast>`);
      expect(part(error, 'content')!.getAttribute('role')).to.equal('alert');
      expect(part(error, 'content')!.getAttribute('aria-atomic')).to.equal('true');
    });

    it('starts empty and fills in on a later frame, so the content is announced as a change', async () => {
      const el = await fixture<AuiToast>(
        html`<aui-toast variant="error" message="Upload failed"></aui-toast>`,
      );
      expect(part(el, 'content')!.textContent!.trim(), 'empty on first render').to.equal('');

      await announced(el);
      expect(part(el, 'content')!.textContent!.replace(/\s+/g, '')).to.equal('錯誤：Uploadfailed');
    });

    it('prefixes the state text for screen readers', async () => {
      const el = await fixture<AuiToast>(
        html`<aui-toast variant="loading" message="Uploading"></aui-toast>`,
      );
      await announced(el);
      expect(part(el, 'content')!.querySelector('.sr-only')!.textContent).to.equal('載入中：');
    });

    it('keeps the region when the message changes, and recreates it when the role changes', async () => {
      const el = await fixture<AuiToast>(
        html`<aui-toast variant="loading" message="Uploading"></aui-toast>`,
      );
      await announced(el);
      const region = part(el, 'content');

      el.variant = 'success';
      el.message = 'Uploaded';
      await el.updateComplete;
      expect(part(el, 'content') === region, 'same status region').to.be.true;
      expect(region!.textContent).to.contain('Uploaded');

      el.variant = 'error';
      await el.updateComplete;
      expect(part(el, 'content') === region, 'a new alert region').to.be.false;
      expect(part(el, 'content')!.getAttribute('role')).to.equal('alert');
      expect(part(el, 'content')!.textContent).to.contain('Uploaded');
    });

    it('does not reset the announced content when moved in the DOM', async () => {
      const wrapper = await fixture<HTMLDivElement>(
        html`<div>
          <aui-toast message="Moved"></aui-toast>
          <section></section>
        </div>`,
      );
      const el = wrapper.querySelector<AuiToast>('aui-toast')!;
      await announced(el);
      wrapper.querySelector('section')!.appendChild(el);
      await el.updateComplete;
      expect(part(el, 'message')!.textContent).to.equal('Moved');
    });
  });

  it('dispatches aui-close from the close button, which can be hidden', async () => {
    const el = await fixture<AuiToast>(html`<aui-toast message="Close me"></aui-toast>`);
    const button = part(el, 'close-button')!;
    expect(button.getAttribute('aria-label')).to.equal('關閉通知');
    const closed = oneEvent(el, 'aui-close');
    button.click();
    const event = await closed;
    expect(event.composed).to.be.true;

    el.noCloseButton = true;
    await el.updateComplete;
    expect(part(el, 'close-button')).to.be.null;
  });

  it('plays the enter animation once, not again when moved', async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
    try {
      const wrapper = await fixture<HTMLDivElement>(
        html`<div>
          <aui-toast message="Animated"></aui-toast>
          <section></section>
        </div>`,
      );
      const el = wrapper.querySelector<AuiToast>('aui-toast')!;
      const base = part(el, 'base')!;
      expect(getComputedStyle(base).animationName).to.equal('toast-slide-in');
      await oneEvent(base, 'animationend');
      await el.updateComplete;
      expect(base.classList.contains('toast--entered')).to.be.true;

      wrapper.querySelector('section')!.appendChild(el);
      expect(getComputedStyle(part(el, 'base')!).animationName).to.equal('none');
    } finally {
      await emulateMedia({ reducedMotion: 'reduce' });
    }
  });
});
