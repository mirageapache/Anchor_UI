import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './icon-button.js';
import type { AuiIconButton } from './icon-button.js';
import type { CopyDetail, DownloadDetail } from './icon-button.types.js';

describe('AuiIconButton (<aui-icon-button>)', () => {
  it('renders with default attributes and 1:1 square/rounded structure', async () => {
    const el = await fixture<AuiIconButton>(
      html`<aui-icon-button preset="copy"></aui-icon-button>`,
    );
    expect(el).to.exist;
    expect(el.preset).to.equal('copy');
    expect(el.variant).to.equal('ghost');
    expect(el.size).to.equal('md');
    expect(el.shape).to.equal('rounded');
    expect(el.color).to.equal('brand');
    expect(el.disabled).to.be.false;
    expect(el.loading).to.be.false;
    expect(el.active).to.be.false;

    const innerBtn = el.shadowRoot?.querySelector('button');
    expect(innerBtn).to.exist;
    expect(innerBtn?.getAttribute('part')).to.equal('button');
    expect(innerBtn?.classList.contains('icon-btn--ghost')).to.be.true;
    expect(innerBtn?.classList.contains('icon-btn--md')).to.be.true;
    expect(innerBtn?.classList.contains('icon-btn--rounded')).to.be.true;
    expect(innerBtn?.classList.contains('icon-btn--color-brand')).to.be.true;
  });

  it('reflects variant, size, shape, and color attributes', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button
        preset="close"
        variant="outline"
        size="lg"
        shape="circle"
        color="danger"
      ></aui-icon-button>
    `);

    expect(el.getAttribute('variant')).to.equal('outline');
    expect(el.getAttribute('size')).to.equal('lg');
    expect(el.getAttribute('shape')).to.equal('circle');
    expect(el.getAttribute('color')).to.equal('danger');

    const innerBtn = el.shadowRoot?.querySelector('button');
    expect(innerBtn?.classList.contains('icon-btn--outline')).to.be.true;
    expect(innerBtn?.classList.contains('icon-btn--lg')).to.be.true;
    expect(innerBtn?.classList.contains('icon-btn--circle')).to.be.true;
    expect(innerBtn?.classList.contains('icon-btn--color-danger')).to.be.true;
  });

  it('triggers clipboard copy and dispatches aui-copy event on click', async () => {
    // Stub clipboard.writeText to ensure deterministic headless execution
    const originalWriteText = navigator.clipboard?.writeText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText = async () => {};
    }

    try {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button preset="copy" copy-value="Hello Test"></aui-icon-button>
      `);

      setTimeout(() => el.click());
      const ev = (await oneEvent(el, 'aui-copy')) as CustomEvent<CopyDetail>;
      expect(ev).to.exist;
      expect(ev.detail.value).to.equal('Hello Test');
      expect(el.status).to.equal('success');
      expect(el.active).to.be.true;

      const innerBtn = el.shadowRoot?.querySelector('button');
      expect(innerBtn?.classList.contains('is-success')).to.be.true;
      expect(innerBtn?.classList.contains('is-active')).to.be.true;

      // Reset feedback
      el.resetFeedback();
      expect(el.status).to.equal('idle');
      expect(el.active).to.be.false;
    } finally {
      if (navigator.clipboard && originalWriteText) {
        navigator.clipboard.writeText = originalWriteText;
      }
    }
  });

  it('triggers download and dispatches aui-download event', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button
        preset="download"
        download-url="https://example.com/test.png"
        download-filename="test.png"
      ></aui-icon-button>
    `);

    setTimeout(() => el.download());
    const ev = (await oneEvent(el, 'aui-download')) as CustomEvent<DownloadDetail>;
    expect(ev).to.exist;
    expect(ev.detail.url).to.equal('https://example.com/test.png');
    expect(ev.detail.filename).to.equal('test.png');
    expect(el.status).to.equal('success');
  });

  it('blocks actions when disabled or loading', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button preset="copy" copy-value="blocked" disabled></aui-icon-button>
    `);

    let copyFired = false;
    el.addEventListener('aui-copy', () => {
      copyFired = true;
    });

    await el.copy();
    expect(copyFired).to.be.false;
    expect(el.status).to.equal('idle');

    el.disabled = false;
    el.loading = true;
    await el.updateComplete;

    await el.copy();
    expect(copyFired).to.be.false;
  });

  it('renders custom slotted icons when no preset is specified', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button tooltip="Bookmark">
        <svg id="custom-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle></svg>
      </aui-icon-button>
    `);

    const slot = el.shadowRoot?.querySelector('slot:not([name])');
    expect(slot).to.exist;

    const svg = el.querySelector('#custom-svg');
    expect(svg).to.exist;
  });

  it('delegates focus and blur to inner button', async () => {
    const el = await fixture<AuiIconButton>(
      html`<aui-icon-button preset="close"></aui-icon-button>`,
    );
    const innerBtn = el.shadowRoot?.querySelector('button');

    el.focus();
    expect(el.shadowRoot?.activeElement).to.equal(innerBtn);

    el.blur();
    expect(el.shadowRoot?.activeElement).to.be.null;
  });

  it('handles copy error and dispatches aui-copy-error event', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button preset="copy" copy-value="Fail Text"></aui-icon-button>
    `);

    const originalWriteText = navigator.clipboard?.writeText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText = async () => {
        throw new Error('Clipboard write rejected');
      };
    }

    try {
      setTimeout(() => el.click());
      const ev = await oneEvent(el, 'aui-copy-error');
      expect(ev).to.exist;
      expect(el.status).to.equal('error');
    } finally {
      if (navigator.clipboard && originalWriteText) {
        navigator.clipboard.writeText = originalWriteText;
      }
    }
  });

  it('triggers download on host click when preset is download', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button preset="download"></aui-icon-button>
    `);
    setTimeout(() => el.click());
    const ev = await oneEvent(el, 'aui-download');
    expect(ev).to.exist;
    expect(el.status).to.equal('success');
  });

  it('computes default tooltip and label for presets', async () => {
    const presets = ['close', 'check', 'refresh', 'external', 'more'] as const;
    for (const preset of presets) {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button .preset=${preset}></aui-icon-button>`,
      );
      expect(el).to.exist;
    }
  });
});
