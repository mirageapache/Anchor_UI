import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiFavoriteBtn } from './favorite-btn.js';

const button = (el: AuiFavoriteBtn) => el.shadowRoot!.querySelector('button')!;
const icon = (el: AuiFavoriteBtn) => el.shadowRoot!.querySelector<SVGElement>('.fav-btn__icon')!;

const states = () => html`
  <div style="display: flex; gap: 12px">
    <aui-favorite-btn></aui-favorite-btn>
    <aui-favorite-btn favorite></aui-favorite-btn>
    <aui-favorite-btn size="sm" label="收藏 JSON Formatter"></aui-favorite-btn>
    <aui-favorite-btn size="lg" favorite></aui-favorite-btn>
    <aui-favorite-btn disabled></aui-favorite-btn>
    <aui-favorite-btn disabled favorite></aui-favorite-btn>
  </div>
`;

/** WCAG 對比值（輸入為瀏覽器計算後、不透明的 rgb() 色值） */
function contrast(foreground: string, background: string): number {
  const luminance = (color: string) => {
    const [r, g, b] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((channel) => {
      const c = Number(channel) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('AuiFavoriteBtn Accessibility (<aui-favorite-btn>)', () => {
  before(async () => {
    if (!document.getElementById('aui-tokens')) {
      const link = document.createElement('link');
      link.id = 'aui-tokens';
      link.rel = 'stylesheet';
      link.href = '/dist/tokens.css';
      document.head.appendChild(link);

      const style = document.createElement('style');
      style.id = 'aui-test-base';
      style.textContent = `
        body {
          background-color: var(--color-bg, #ffffff);
          color: var(--color-text-primary, #0f172a);
        }
      `;
      document.head.appendChild(style);

      await new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    }
  });

  describe('axe-core automated WCAG audit', () => {
    it('passes axe audit for every state in light theme', async () => {
      await expect(await fixture(states())).to.be.accessible();
    });

    it('passes axe audit for every state in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        await expect(await fixture(states())).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('non-text contrast (WCAG 1.4.11)', () => {
    // axe 不檢查圖示對比：星號的線條是辨識按鈕的唯一依據，兩種狀態、兩種主題都需達 3:1。
    // 除了頁面背景，也涵蓋卡片／彈窗使用的 --color-base。
    for (const theme of ['light', 'dark'] as const) {
      for (const surface of ['--color-bg', '--color-base']) {
        for (const favorite of [false, true]) {
          it(`keeps the star outline at 3:1 on ${surface} (${theme}, favorite=${favorite})`, async () => {
            if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            try {
              const wrapper = await fixture<HTMLDivElement>(html`
                <div style="padding: 8px; background-color: var(${surface})">
                  <aui-favorite-btn ?favorite=${favorite}></aui-favorite-btn>
                </div>
              `);
              const el = wrapper.querySelector('aui-favorite-btn')!;
              button(el).style.transition = 'none';
              const stroke = getComputedStyle(icon(el)).stroke;
              const background = getComputedStyle(wrapper).backgroundColor;
              expect(contrast(stroke, background)).to.be.at.least(3);
            } finally {
              document.documentElement.removeAttribute('data-theme');
            }
          });
        }
      }
    }
  });

  describe('semantics', () => {
    it('exposes a toggle button with a stable name and a pressed state', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      let node = await getAxNode(button(el));
      expect(node.role).to.equal('button');
      expect(node.name).to.equal('我的最愛');
      expect(button(el).getAttribute('aria-pressed')).to.equal('false');

      button(el).click();
      await el.updateComplete;
      node = await getAxNode(button(el));
      // 名稱不隨狀態改變，狀態由 aria-pressed 傳達
      expect(node.name).to.equal('我的最愛');
      expect(button(el).getAttribute('aria-pressed')).to.equal('true');
    });

    it('uses the label for the accessible name and the tooltip', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn label="收藏 JSON Formatter"></aui-favorite-btn>`,
      );
      const node = await getAxNode(button(el));
      expect(node.name).to.equal('收藏 JSON Formatter');
      // 懸停提示放在裝飾用 SVG 的 <title>，不可成為按鈕的描述（否則名稱會被念兩次）
      expect(node.description).to.equal('');
      expect(button(el).hasAttribute('title')).to.be.false;
      expect(icon(el).querySelector('title')!.textContent).to.equal('收藏 JSON Formatter');
      expect(icon(el).getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('fallback name', () => {
    it('falls back to the default name when label is empty', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn label=""></aui-favorite-btn>`,
      );
      expect((await getAxNode(button(el))).name).to.equal('我的最愛');
    });
  });

  describe('keyboard', () => {
    it('is reachable with Tab, shows a focus ring and toggles with Enter and Space', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-favorite-btn></aui-favorite-btn>
        </div>
      `);
      const el = wrapper.querySelector('aui-favorite-btn')!;
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === el, 'favorite button focused').to.be.true;
      expect(getComputedStyle(button(el)).outlineStyle).to.equal('solid');

      await sendKeys({ press: 'Enter' });
      expect(el.favorite).to.be.true;
      await sendKeys({ press: 'Space' });
      expect(el.favorite).to.be.false;
    });

    it('is skipped in the Tab order when disabled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-favorite-btn disabled></aui-favorite-btn>
          <button id="after">After</button>
        </div>
      `);
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#after'), 'after focused').to.be
        .true;
    });

    it('focuses the inner button through host.focus()', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      el.focus();
      expect(el.shadowRoot!.activeElement === button(el), 'button focused').to.be.true;
    });
  });
});
