import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './icon-button.js';
import type { AuiIconButton } from './icon-button.js';
import type {
  CopyDetail,
  DownloadDetail,
  DownloadErrorDetail,
  StatusChangeDetail,
} from './icon-button.types.js';

/**
 * 攔截 <a>.click()，記錄元件建立的下載連結而不真的觸發導覽或下載
 */
function stubAnchorClick(): HTMLAnchorElement[] & { restore: () => void } {
  const clicked = [] as unknown as HTMLAnchorElement[] & { restore: () => void };
  const original = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
    clicked.push(this);
  };
  clicked.restore = () => {
    HTMLAnchorElement.prototype.click = original;
  };
  return clicked;
}

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
      // 成功的高亮由 status 推導，不改寫使用端的 active 屬性
      expect(el.active).to.be.false;

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

    const anchors = stubAnchorClick();
    try {
      setTimeout(() => el.download());
      const ev = (await oneEvent(el, 'aui-download')) as CustomEvent<DownloadDetail>;
      expect(ev).to.exist;
      expect(ev.detail.url).to.equal('https://example.com/test.png');
      expect(ev.detail.filename).to.equal('test.png');
      await el.updateComplete;
      expect(anchors).to.have.length(1);
      expect(el.status).to.equal('success');
    } finally {
      anchors.restore();
    }
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

  it('dispatches aui-download on host click but does not claim success without a URL', async () => {
    const el = await fixture<AuiIconButton>(html`
      <aui-icon-button preset="download"></aui-icon-button>
    `);
    const anchors = stubAnchorClick();
    try {
      setTimeout(() => el.click());
      const ev = await oneEvent(el, 'aui-download');
      expect(ev).to.exist;
      await el.updateComplete;
      // 沒有 download-url 時由使用端處理下載，元件不可自行回報「已下載！」
      expect(anchors).to.have.length(0);
      expect(el.status).to.equal('idle');
    } finally {
      anchors.restore();
    }
  });

  describe('feedback state transitions', () => {
    it('resetFeedback() reports the transition back to idle like the timer does', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button preset="copy" .feedbackDuration=${60000}></aui-icon-button>
      `);
      el.triggerFeedback('success');
      await el.updateComplete;

      setTimeout(() => el.resetFeedback());
      const ev = (await oneEvent(el, 'aui-status-change')) as CustomEvent<StatusChangeDetail>;
      expect(ev.detail).to.deep.equal({ status: 'idle', previousStatus: 'success' });
      expect(el.status).to.equal('idle');
      expect(el.active).to.be.false;
    });

    it('does not report a status change when resetting while already idle', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="copy"></aui-icon-button>`,
      );
      let changes = 0;
      el.addEventListener('aui-status-change', () => changes++);
      el.resetFeedback();
      expect(changes).to.equal(0);
    });

    it('returns to idle automatically after feedback-duration', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button preset="copy" .feedbackDuration=${20}></aui-icon-button>
      `);
      el.triggerFeedback('success');
      const ev = (await oneEvent(el, 'aui-status-change')) as CustomEvent<StatusChangeDetail>;
      expect(ev.detail).to.deep.equal({ status: 'idle', previousStatus: 'success' });
    });
  });

  describe('busy state (loading prop or status="loading")', () => {
    for (const setup of ['loading', 'status'] as const) {
      it(`blocks actions and exposes the busy state when set via ${setup}`, async () => {
        const el = await fixture<AuiIconButton>(html`
          <aui-icon-button preset="copy" copy-value="x"></aui-icon-button>
        `);
        if (setup === 'loading') el.loading = true;
        else el.status = 'loading';
        await el.updateComplete;

        // 模擬剪貼簿成功，確保「沒有 aui-copy」是因為被攔截，而非剪貼簿失敗
        const originalWriteText = navigator.clipboard.writeText;
        let writes = 0;
        navigator.clipboard.writeText = async () => {
          writes++;
        };
        let events = 0;
        el.addEventListener('aui-copy', () => events++);
        el.addEventListener('aui-copy-error', () => events++);
        try {
          el.click();
          expect(await el.copy()).to.be.false;
          expect(await el.download()).to.be.false;
          expect(writes).to.equal(0);
          expect(events).to.equal(0);
        } finally {
          navigator.clipboard.writeText = originalWriteText;
        }

        const innerBtn = el.shadowRoot!.querySelector('button')!;
        expect(innerBtn.getAttribute('aria-busy')).to.equal('true');
        expect(innerBtn.getAttribute('aria-disabled')).to.equal('true');
      });
    }

    it('keeps keyboard focus on the button while busy', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button preset="refresh"></aui-icon-button>`,
      );
      const innerBtn = el.shadowRoot!.querySelector('button')!;
      el.focus();
      expect(el.shadowRoot!.activeElement).to.equal(innerBtn);

      el.loading = true;
      await el.updateComplete;
      expect(innerBtn.hasAttribute('disabled')).to.be.false;
      expect(el.shadowRoot!.activeElement).to.equal(innerBtn);
    });
  });

  describe('click action resolution', () => {
    it('follows the explicit preset over a leftover copy-value', async () => {
      // 例如由選單把 preset 從 copy 切到 download，copy-value 仍綁定著
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button
          preset="download"
          copy-value="npm install @anchor-ui/core"
          download-filename="anchor-ui.json"
        ></aui-icon-button>
      `);
      let copied = false;
      el.addEventListener('aui-copy', () => {
        copied = true;
      });

      setTimeout(() => el.click());
      const ev = (await oneEvent(el, 'aui-download')) as CustomEvent<DownloadDetail>;
      expect(ev.detail.filename).to.equal('anchor-ui.json');
      expect(copied).to.be.false;
    });

    it('lets an explicit action override the preset', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button preset="download" action="copy" copy-value="x"></aui-icon-button>
      `);
      const originalWriteText = navigator.clipboard.writeText;
      navigator.clipboard.writeText = async () => {};
      try {
        setTimeout(() => el.click());
        await oneEvent(el, 'aui-copy');
      } finally {
        navigator.clipboard.writeText = originalWriteText;
      }
    });

    it('still infers the action from copy-value / download-url without a preset', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button label="Get file" download-url="/files/a.txt"></aui-icon-button>
      `);
      el.addEventListener('aui-download', (event) => event.preventDefault());
      setTimeout(() => el.click());
      await oneEvent(el, 'aui-download');
    });
  });

  describe('honest feedback (no fake success)', () => {
    it('reports an error instead of success when there is nothing to copy', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button preset="copy"></aui-icon-button>
      `);
      let copyFired = false;
      el.addEventListener('aui-copy', () => {
        copyFired = true;
      });

      setTimeout(() => el.click());
      const ev = (await oneEvent(el, 'aui-copy-error')) as CustomEvent<{ error: Error }>;
      expect(ev.detail.error).to.be.instanceOf(Error);
      expect(copyFired).to.be.false;
      expect(el.status).to.equal('error');
      expect(await el.copy()).to.be.false;
    });

    it('lets the consumer take over a download by cancelling aui-download', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button download-url="/files/report.pdf"></aui-icon-button>
      `);
      el.addEventListener('aui-download', (event) => event.preventDefault());
      const anchors = stubAnchorClick();
      try {
        expect(await el.download()).to.be.false;
        expect(anchors).to.have.length(0);
        expect(el.status).to.equal('idle');
      } finally {
        anchors.restore();
      }
    });
  });

  describe('download without navigating away', () => {
    it('forces a download for same-origin and blob: URLs even without a filename', async () => {
      // 沒有 download 屬性的 <a> 會讓整頁導向檔案（同源）或 blob，SPA 狀態因此遺失
      const blobUrl = URL.createObjectURL(new Blob(['x']));
      const anchors = stubAnchorClick();
      try {
        for (const url of ['/files/report.pdf', blobUrl]) {
          const el = await fixture<AuiIconButton>(html`<aui-icon-button></aui-icon-button>`);
          el.downloadUrl = url;
          expect(await el.download()).to.be.true;
        }
        expect(anchors).to.have.length(2);
        for (const anchor of anchors) {
          expect(anchor.hasAttribute('download'), anchor.href).to.be.true;
          expect(anchor.target).to.equal('');
        }
      } finally {
        anchors.restore();
        URL.revokeObjectURL(blobUrl);
      }
    });

    it('uses download-filename when given, and a new tab for cross-origin URLs', async () => {
      const anchors = stubAnchorClick();
      try {
        const named = await fixture<AuiIconButton>(
          html`<aui-icon-button download-url="/a.txt" download-filename="b.txt"></aui-icon-button>`,
        );
        await named.download();
        const cross = await fixture<AuiIconButton>(
          html`<aui-icon-button download-url="https://example.com/a.txt"></aui-icon-button>`,
        );
        await cross.download();
        expect(anchors[0].download).to.equal('b.txt');
        expect(anchors[1].hasAttribute('download')).to.be.false;
        expect(anchors[1].target).to.equal('_blank');
        expect(anchors[1].rel).to.equal('noopener noreferrer');
      } finally {
        anchors.restore();
      }
    });
  });

  describe('feedback state', () => {
    it('keeps a consumer-set active across a feedback cycle', async () => {
      const el = await fixture<AuiIconButton>(
        html`<aui-icon-button active label="Pin"></aui-icon-button>`,
      );
      const inner = el.shadowRoot!.querySelector('button')!;
      el.triggerFeedback('success');
      await el.updateComplete;
      expect(inner.classList.contains('is-active')).to.be.true;
      el.resetFeedback();
      await el.updateComplete;
      expect(el.active, 'active is still set').to.be.true;
      expect(el.hasAttribute('active')).to.be.true;
      expect(inner.classList.contains('is-active')).to.be.true;
    });

    it('copies once when clicked again while the clipboard write is pending', async () => {
      const original = navigator.clipboard.writeText;
      let writes = 0;
      let finish!: () => void;
      navigator.clipboard.writeText = () => {
        writes++;
        return new Promise<void>((resolve) => (finish = resolve));
      };
      try {
        const el = await fixture<AuiIconButton>(
          html`<aui-icon-button copy-value="x" label="Copy"></aui-icon-button>`,
        );
        let copied = 0;
        el.addEventListener('aui-copy', () => copied++);
        const first = el.copy();
        expect(await el.copy(), 'second call is ignored').to.be.false;
        finish();
        expect(await first).to.be.true;
        expect(writes).to.equal(1);
        expect(copied).to.equal(1);
        // 完成後可以再次複製
        const again = el.copy();
        finish();
        expect(await again).to.be.true;
        expect(writes).to.equal(2);
      } finally {
        navigator.clipboard.writeText = original;
      }
    });

    it('ends the feedback when removed during it, so it is not stuck after being re-inserted', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div><aui-icon-button preset="copy" copy-value="x"></aui-icon-button></div>
      `);
      const el = wrapper.querySelector<AuiIconButton>('aui-icon-button')!;
      const tooltip = el.shadowRoot!.querySelector('aui-tooltip')!;
      el.triggerFeedback('success');
      await oneEvent(tooltip, 'aui-after-show');
      expect(el.status).to.equal('success');

      // 例如清單重排：回饋計時器在移出時被清除
      el.remove();
      wrapper.appendChild(el);
      await el.updateComplete;
      await tooltip.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.status).to.equal('idle');
      expect(tooltip.open, 'the feedback tooltip is closed').to.be.false;
    });

    it('starts no feedback when removed while the clipboard write is pending', async () => {
      const original = navigator.clipboard.writeText;
      let finish!: () => void;
      navigator.clipboard.writeText = () => new Promise<void>((resolve) => (finish = resolve));
      try {
        const el = await fixture<AuiIconButton>(
          html`<aui-icon-button copy-value="x" label="Copy"></aui-icon-button>`,
        );
        let statusChanges = 0;
        el.addEventListener('aui-status-change', () => statusChanges++);
        const pending = el.copy();
        el.remove();
        finish();
        await pending;
        expect(el.status).to.equal('idle');
        expect(statusChanges).to.equal(0);
      } finally {
        navigator.clipboard.writeText = original;
      }
    });
  });

  describe('download URL safety', () => {
    const unsafeUrls = [
      'javascript:alert(1)',
      ' JavaScript:alert(1)',
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
    ];

    for (const url of unsafeUrls) {
      it(`refuses to open ${JSON.stringify(url)}`, async () => {
        const el = await fixture<AuiIconButton>(html`<aui-icon-button></aui-icon-button>`);
        el.downloadUrl = url;
        let downloadFired = false;
        el.addEventListener('aui-download', () => {
          downloadFired = true;
        });
        const anchors = stubAnchorClick();
        try {
          setTimeout(() => el.download());
          const ev = (await oneEvent(el, 'aui-download-error')) as CustomEvent<DownloadErrorDetail>;
          expect(ev.detail.url).to.equal(url);
          expect(anchors).to.have.length(0);
          expect(downloadFired).to.be.false;
          expect(el.status).to.equal('error');
        } finally {
          anchors.restore();
        }
      });
    }

    it('downloads same-origin URLs in place with the download attribute', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button
          download-url="/files/report.pdf"
          download-filename="report.pdf"
        ></aui-icon-button>
      `);
      const anchors = stubAnchorClick();
      try {
        expect(await el.download()).to.be.true;
        expect(anchors).to.have.length(1);
        expect(anchors[0].download).to.equal('report.pdf');
        expect(anchors[0].target).to.equal('');
      } finally {
        anchors.restore();
      }
    });

    it('opens cross-origin URLs in a new tab instead of navigating the current page', async () => {
      const el = await fixture<AuiIconButton>(html`
        <aui-icon-button download-url="https://cdn.example.com/file.zip"></aui-icon-button>
      `);
      const anchors = stubAnchorClick();
      try {
        expect(await el.download()).to.be.true;
        expect(anchors).to.have.length(1);
        expect(anchors[0].target).to.equal('_blank');
        expect(anchors[0].rel).to.contain('noopener');
        expect(anchors[0].rel).to.contain('noreferrer');
      } finally {
        anchors.restore();
      }
    });

    it('allows blob: and data: URLs', async () => {
      const blobUrl = URL.createObjectURL(new Blob(['hello'], { type: 'text/plain' }));
      const urls = [blobUrl, 'data:text/plain;base64,aGVsbG8='];
      const anchors = stubAnchorClick();
      try {
        for (const url of urls) {
          const el = await fixture<AuiIconButton>(html`<aui-icon-button></aui-icon-button>`);
          el.downloadUrl = url;
          el.downloadFilename = 'hello.txt';
          expect(await el.download(), url).to.be.true;
        }
        expect(anchors.map((a) => a.target)).to.deep.equal(['', '']);
      } finally {
        anchors.restore();
        URL.revokeObjectURL(blobUrl);
      }
    });
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
