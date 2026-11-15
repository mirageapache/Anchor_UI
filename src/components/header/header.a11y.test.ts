import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiFavoriteBtn } from '../favorite-btn/favorite-btn.js';
import type { AuiHeader } from './header.js';

const part = <T extends Element = HTMLElement>(el: AuiHeader, name: string) =>
  el.shadowRoot!.querySelector<T>(`[part="${name}"]`)!;
const favoriteButton = (el: AuiHeader) => part<AuiFavoriteBtn>(el, 'favorite-button');
const innerButton = (el: AuiHeader) => favoriteButton(el).shadowRoot!.querySelector('button')!;

const headers = () => html`
  <div style="display: grid; gap: 32px; width: 560px">
    <aui-header
      heading="JSON Formatter"
      description="格式化、驗證並壓縮 JSON 文件，所有運算皆在瀏覽器內完成。"
      hot
      favoritable
    >
      <aui-tag slot="tags" variant="brand">json</aui-tag>
      <aui-tag slot="tags">format</aui-tag>
    </aui-header>
    <aui-header heading="UUID Generator" heading-level="2" favoritable favorite>
      產生 v4 / v7 UUID。
      <button slot="actions">分享</button>
    </aui-header>
    <aui-header heading="Heading only" heading-level="2"></aui-header>
  </div>
`;

describe('AuiHeader Accessibility (<aui-header>)', () => {
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
    it('passes axe audit in light theme', async () => {
      await expect(await fixture(headers())).to.be.accessible();
    });

    it('passes axe audit in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        await expect(await fixture(headers())).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('semantics', () => {
    it('does not create a banner landmark', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A"></aui-header>`);
      const node = await getAxNode(part(el, 'base'));
      expect(node.role).to.not.equal('banner');
    });

    it('exposes the title as a heading named by the heading text only', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header heading="JSON Formatter" description="Format JSON" hot favoritable>
          <aui-tag slot="tags">json</aui-tag>
        </aui-header>
      `);
      const node = await getAxNode(part(el, 'heading'));
      expect(node.role).to.equal('heading');
      // 標籤、HOT 徽標與收藏鈕都在標題之外，不混入標題的名稱
      expect(node.name).to.equal('JSON Formatter');
    });

    it('resolves a slotted heading through the shadow boundary', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header
          ><span slot="heading">Slotted <em>heading</em></span></aui-header
        >
      `);
      const node = await getAxNode(part(el, 'heading'));
      expect(node.name).to.equal('Slotted heading');
    });

    it('renders the HOT badge as visible text and the favorite control as a named toggle button', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header heading="A" hot favoritable favorite favorite-label="收藏 A"></aui-header>
      `);
      await favoriteButton(el).updateComplete;
      // HOT 徽標是可被讀出的文字（不是只靠顏色或裝飾圖示傳達）
      const badge = part(el, 'hot-badge');
      expect(badge.textContent?.trim()).to.equal('HOT');
      expect(getComputedStyle(badge).visibility).to.equal('visible');
      const node = await getAxNode(innerButton(el));
      expect(node.role).to.equal('button');
      expect(node.name).to.equal('收藏 A');
      expect(innerButton(el).getAttribute('aria-pressed')).to.equal('true');
    });
  });

  describe('keyboard', () => {
    it('reaches the favorite button and then slotted actions with Tab, and toggles with Enter', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-header heading="A" favoritable>
            <button slot="actions" id="action">Share</button>
          </aui-header>
        </div>
      `);
      const el = wrapper.querySelector('aui-header')!;
      await favoriteButton(el).updateComplete;
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(el.shadowRoot!.activeElement === favoriteButton(el), 'favorite button focused').to.be
        .true;

      await sendKeys({ press: 'Enter' });
      expect(el.favorite).to.be.true;

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#action'), 'action focused').to.be
        .true;
    });

    it('has no tab stop of its own without a favorite button', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-header heading="A" description="Text"></aui-header>
          <button id="after">After</button>
        </div>
      `);
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#after'), 'after focused').to.be
        .true;
    });
  });
});
