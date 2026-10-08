import { expect, fixture, html } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';
import './index.js';

/**
 * Phase 1 驗收條件：
 * 「元件內部樣式受 Shadow DOM 保護，同時能正常讀取外部全域 CSS Custom Properties（主題變數切換正常）」
 * 以四個元件逐一驗證：外部樣式不滲入、內部樣式不外洩、可由外部 token 覆寫、data-theme 切換生效。
 * 需先執行 pnpm build 產生 dist/tokens.css。
 */

interface Case {
  tag: string;
  template: TemplateResult;
  /** 取得 shadow root 內實際呈現樣式的元素 */
  inner: (host: Element) => HTMLElement;
  /** 受 token 控制的 CSS 屬性 */
  property: 'color' | 'backgroundColor';
  token: string;
}

const cases: Case[] = [
  {
    tag: 'aui-button',
    template: html`<aui-button variant="primary">Action</aui-button>`,
    inner: (host) => host.shadowRoot!.querySelector('button')!,
    property: 'backgroundColor',
    token: '--color-brand-600',
  },
  {
    tag: 'aui-tag',
    template: html`<aui-tag variant="brand">label</aui-tag>`,
    inner: (host) => host.shadowRoot!.querySelector<HTMLElement>('.tag')!,
    property: 'color',
    token: '--color-brand-text',
  },
  {
    tag: 'aui-tooltip',
    template: html`<aui-tooltip content="Tip" open><button>Target</button></aui-tooltip>`,
    inner: (host) => host.shadowRoot!.querySelector<HTMLElement>('.tooltip__popup')!,
    property: 'backgroundColor',
    token: '--color-tooltip-bg',
  },
  {
    tag: 'aui-icon-button',
    template: html`<aui-icon-button preset="copy" variant="ghost"></aui-icon-button>`,
    inner: (host) => host.shadowRoot!.querySelector('button')!,
    property: 'color',
    token: '--color-text-secondary',
  },
];

/** 以探針元素把 token 值正規化為瀏覽器計算後的色值 */
function resolveColor(value: string): string {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

function tokenColor(token: string): string {
  return resolveColor(getComputedStyle(document.documentElement).getPropertyValue(token).trim());
}

describe('Phase 1 acceptance: Shadow DOM encapsulation & theming', () => {
  before(async () => {
    if (!document.getElementById('aui-tokens')) {
      const link = document.createElement('link');
      link.id = 'aui-tokens';
      link.rel = 'stylesheet';
      link.href = '/dist/tokens.css';
      document.head.appendChild(link);
      await new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    }
    // 停用轉場，讓主題切換後立即讀到最終色值
    await emulateMedia({ reducedMotion: 'reduce' });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
    document.documentElement.removeAttribute('data-theme');
  });

  for (const c of cases) {
    describe(c.tag, () => {
      it('is not affected by page styles targeting its internal class names and elements', async () => {
        const hostile = document.createElement('style');
        hostile.textContent = `
          button, span, div, .btn, .btn--primary, .tag, .tag--brand, .tooltip__popup,
          .icon-btn, .icon-btn--ghost {
            color: rgb(255, 0, 0) !important;
            background-color: rgb(255, 0, 0) !important;
          }
        `;
        const el = await fixture(c.template);
        const before = getComputedStyle(c.inner(el))[c.property];
        document.head.appendChild(hostile);
        try {
          const after = getComputedStyle(c.inner(el))[c.property];
          expect(after).to.equal(before);
          expect(after).to.not.equal('rgb(255, 0, 0)');
        } finally {
          hostile.remove();
        }
      });

      it('reads a global token override through the shadow boundary', async () => {
        const wrapper = await fixture<HTMLDivElement>(html`<div>${c.template}</div>`);
        wrapper.style.setProperty(c.token, 'rgb(1, 2, 3)');
        const el = wrapper.firstElementChild!;
        expect(getComputedStyle(c.inner(el))[c.property]).to.equal('rgb(1, 2, 3)');
      });

      it('follows data-theme switching between light and dark tokens', async () => {
        const el = await fixture(c.template);
        const inner = c.inner(el);

        document.documentElement.removeAttribute('data-theme');
        const light = getComputedStyle(inner)[c.property];
        expect(light).to.equal(tokenColor(c.token));

        document.documentElement.setAttribute('data-theme', 'dark');
        try {
          const dark = getComputedStyle(inner)[c.property];
          expect(dark).to.equal(tokenColor(c.token));
          expect(dark, 'dark theme must change the rendered color').to.not.equal(light);
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
        expect(getComputedStyle(inner)[c.property]).to.equal(light);
      });
    });
  }

  it('does not leak component styles out to light-DOM elements with the same class names', async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <aui-button variant="primary">Component</aui-button>
        <aui-tag variant="brand">component</aui-tag>
        <button class="btn btn--primary">Plain button</button>
        <span class="tag tag--brand">plain tag</span>
      </div>
    `);
    const plainButton = wrapper.querySelector<HTMLElement>('button.btn')!;
    const plainTag = wrapper.querySelector<HTMLElement>('span.tag')!;
    expect(getComputedStyle(plainButton).backgroundColor).to.not.equal(
      tokenColor('--color-brand-600'),
    );
    expect(getComputedStyle(plainTag).fontFamily).to.not.contain('JetBrains Mono');
  });
});
