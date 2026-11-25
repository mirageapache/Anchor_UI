import { expect, fixture, html } from '@open-wc/testing';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import '../tag/index.js';
import './index.js';
import type { AuiCard } from './card.js';

const base = (el: AuiCard) => el.shadowRoot!.querySelector<HTMLElement>('.card')!;

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

const cards = () => html`
  <ul style="list-style: none; padding: 0; display: grid; gap: 16px; width: 320px">
    <li>
      <aui-card heading="JSON Formatter" description="Format and validate JSON" href="/json">
        <aui-tag slot="tags" variant="brand">json</aui-tag>
        <aui-tag slot="tags">format</aui-tag>
      </aui-card>
    </li>
    <li>
      <aui-card heading="UUID Generator" description="Generate v4 / v7 UUIDs" href="/uuid" hot>
        <aui-tag slot="tags" variant="purple">uuid</aui-tag>
      </aui-card>
    </li>
    <li><aui-card heading="Static card" description="No link" hot></aui-card></li>
    <li><aui-card heading="Heading only" href="/only"></aui-card></li>
    <li>
      <aui-card heading="NT$ 1.2M" description="本月營收" href="/revenue">
        <svg slot="icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
          <path d="M4 18h16" stroke="currentColor" />
        </svg>
      </aui-card>
    </li>
  </ul>
`;

describe('AuiCard Accessibility (<aui-card>)', () => {
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
    it('passes axe audit for link, static and HOT cards in light theme', async () => {
      const el = await fixture(cards());
      await expect(el).to.be.accessible();
    });

    it('passes axe audit in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const el = await fixture(cards());
        await expect(el).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('hover contrast', () => {
    afterEach(async () => {
      await resetMouse();
      document.documentElement.removeAttribute('data-theme');
    });

    for (const theme of ['light', 'dark'] as const) {
      it(`keeps the hovered heading readable (${theme})`, async () => {
        // axe 不檢查懸停狀態：連結卡片懸停時名稱改用 brand-text，兩種主題下都需達 4.5:1
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        const el = await fixture<AuiCard>(html`<aui-card heading="Tool" href="/t"></aui-card>`);
        const card = base(el);
        const heading = el.shadowRoot!.querySelector<HTMLElement>('.card__name')!;
        card.style.transition = 'none';
        heading.style.transition = 'none';
        const idle = getComputedStyle(heading).color;

        const rect = card.getBoundingClientRect();
        await sendMouse({
          type: 'move',
          position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
        });
        expect(card.matches(':hover'), 'pointer is over the card').to.be.true;
        const hovered = getComputedStyle(heading).color;
        expect(hovered, 'heading colour changes on hover').to.not.equal(idle);
        expect(contrast(hovered, getComputedStyle(card).backgroundColor)).to.be.at.least(4.5);
      });
    }
  });

  describe('accessible name and description', () => {
    it('names the link by its heading and describes it with the description and tags', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="JSON Formatter" description="Format JSON" href="/json">
          <aui-tag slot="tags">json</aui-tag>
        </aui-card>`,
      );
      const node = await getAxNode(base(el));
      expect(node.role).to.equal('link');
      expect(node.name).to.equal('JSON Formatter');
      expect(node.description).to.equal('Format JSON json');
    });

    it('keeps the name and description of an icon card free of the decorative icon', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="NT$ 1.2M" description="本月營收" href="/revenue">
          <svg slot="icon" aria-hidden="true" width="24" height="24"></svg>
        </aui-card>`,
      );
      const node = await getAxNode(base(el));
      expect(node.role).to.equal('link');
      expect(node.name).to.equal('NT$ 1.2M');
      expect(node.description).to.equal('本月營收');
    });

    it('falls back to the content for the name when a link card has no heading', async () => {
      const el = await fixture<AuiCard>(html`<aui-card href="/x">Only a description</aui-card>`);
      expect(base(el).hasAttribute('aria-labelledby')).to.be.false;
      const node = await getAxNode(base(el));
      expect(node.name).to.equal('Only a description');
    });

    it('includes the HOT badge in the link name so the state is not conveyed by colour alone', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="UUID" href="/uuid" hot></aui-card>`,
      );
      const node = await getAxNode(base(el));
      expect(node.name).to.equal('UUID HOT');
      expect(node.description).to.equal('');
    });

    it('resolves slotted heading and description through the shadow boundary', async () => {
      const el = await fixture<AuiCard>(html`
        <aui-card href="/slot">
          <span slot="heading">Slotted heading</span>
          Slotted description
        </aui-card>
      `);
      const node = await getAxNode(base(el));
      expect(node.name).to.equal('Slotted heading');
      expect(node.description).to.equal('Slotted description');
    });

    it('exposes the heading with the configured level', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="Tool" heading-level="2"></aui-card>`,
      );
      const node = await getAxNode(el.shadowRoot!.querySelector('[part="heading"]')!);
      expect(node.role).to.equal('heading');
      expect(node.name).to.equal('Tool');
    });
  });

  describe('keyboard', () => {
    it('reaches link cards with Tab and skips static cards', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-card id="static" heading="Static"></aui-card>
          <aui-card id="link" heading="Link" href="#card-target"></aui-card>
          <button id="after">After</button>
        </div>
      `);
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      const link = wrapper.querySelector<AuiCard>('#link')!;
      expect(document.activeElement === link, 'link card focused').to.be.true;
      expect(getComputedStyle(base(link)).outlineStyle).to.equal('solid');

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#after'), 'after focused').to.be
        .true;
    });

    it('activates the link with Enter', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="Link" href="#card-enter"></aui-card>`,
      );
      let clicks = 0;
      el.addEventListener('click', (event) => {
        clicks++;
        event.preventDefault(); // 不實際導覽
      });
      el.focus();
      await sendKeys({ press: 'Enter' });
      expect(clicks).to.equal(1);
    });
  });
});
