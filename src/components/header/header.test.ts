import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './index.js';
import type { AuiFavoriteBtn } from '../favorite-btn/favorite-btn.js';
import type { AuiTag } from '../tag/tag.js';
import type { AuiHeader } from './header.js';
import type { HeaderFavoriteChangeDetail } from './header.types.js';

const part = <T extends Element = HTMLElement>(el: AuiHeader, name: string) =>
  el.shadowRoot!.querySelector<T>(`[part="${name}"]`)!;
const favoriteButton = (el: AuiHeader) => part<AuiFavoriteBtn>(el, 'favorite-button');
const innerButton = (el: AuiHeader) => favoriteButton(el).shadowRoot!.querySelector('button')!;

/** 等待 light DOM 變動（MutationObserver）觸發的重新渲染 */
async function settle(el: AuiHeader): Promise<void> {
  await el.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await el.updateComplete;
}

describe('AuiHeader (<aui-header>)', () => {
  describe('rendering', () => {
    it('renders the heading as an h1 with the page-title typography', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header heading="JSON Formatter" description="Format JSON"></aui-header>`,
      );
      expect(el.headingLevel).to.equal(1);
      expect(el.hot).to.be.false;
      expect(el.favoritable).to.be.false;
      expect(el.favorite).to.be.false;

      // 不使用 <header>，避免成為頁面的 banner landmark
      expect(part(el, 'base').tagName).to.equal('DIV');
      const heading = part(el, 'heading');
      expect(heading.tagName).to.equal('H1');
      expect(heading.textContent?.trim()).to.equal('JSON Formatter');
      const style = getComputedStyle(heading);
      expect(style.fontSize).to.equal('30px');
      expect(style.fontWeight).to.equal('900');
      expect(parseFloat(style.letterSpacing)).to.be.closeTo(-0.6, 0.01); // -0.02em

      expect(part(el, 'description').textContent?.trim()).to.equal('Format JSON');
      expect(part(el, 'tags').hidden, 'no tags row').to.be.true;
      expect(favoriteButton(el), 'no favorite button').to.be.null;
      expect(part(el, 'hot-badge'), 'no HOT badge').to.be.null;
    });

    it('renders the requested heading level and falls back to h1 for invalid values', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header heading="A" heading-level="2"></aui-header>`,
      );
      expect(part(el, 'heading').tagName).to.equal('H2');

      el.headingLevel = 9 as AuiHeader['headingLevel'];
      await el.updateComplete;
      expect(part(el, 'heading').tagName).to.equal('H1');
    });

    it('registers the components it renders itself', () => {
      expect(customElements.get('aui-favorite-btn'), 'favorite button').to.exist;
      expect(customElements.get('aui-tag'), 'tag').to.exist;
    });

    it('wraps long unbroken titles without overflowing', async () => {
      const long = 'averyveryverylongunbrokentoolnamethatcannotwrapnormally'.repeat(3);
      const el = await fixture<AuiHeader>(
        html`<aui-header style="width: 280px" heading=${long} favoritable hot></aui-header>`,
      );
      const base = part(el, 'base');
      expect(base.scrollWidth).to.be.at.most(base.clientWidth);
      // 收藏鈕不被長標題擠出容器
      expect(favoriteButton(el).getBoundingClientRect().right).to.be.at.most(
        el.getBoundingClientRect().right + 0.5,
      );
    });
  });

  describe('HOT badge', () => {
    it('renders an uppercase warning tag and shows the tags row', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" hot></aui-header>`);
      const badge = part<AuiTag>(el, 'hot-badge');
      expect(badge.localName).to.equal('aui-tag');
      expect(badge.variant).to.equal('warning');
      expect(badge.preserveCase, 'not lower-cased').to.be.true;
      expect(badge.textContent?.trim()).to.equal('HOT');
      expect(part(el, 'tags').hidden).to.be.false;
      expect(el.hasAttribute('hot')).to.be.true;
    });

    it('supports a custom label and can be removed', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header heading="A" hot hot-label="熱門"></aui-header>`,
      );
      expect(part(el, 'hot-badge').textContent?.trim()).to.equal('熱門');

      el.hot = false;
      await el.updateComplete;
      expect(part(el, 'hot-badge')).to.be.null;
      expect(part(el, 'tags').hidden).to.be.true;
    });
  });

  describe('slots', () => {
    it('shows slotted category tags before the HOT badge', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header heading="A" hot>
          <aui-tag slot="tags" variant="brand">json</aui-tag>
          <aui-tag slot="tags">format</aui-tag>
        </aui-header>
      `);
      expect(part(el, 'tags').hidden).to.be.false;
      const tags = [...el.querySelectorAll('aui-tag')];
      const badge = part(el, 'hot-badge');
      expect(tags[1].getBoundingClientRect().right).to.be.at.most(
        badge.getBoundingClientRect().left,
      );
    });

    it('shows the description attribute even when other content is slotted', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header heading="A" description="From attribute">
          <aui-tag slot="tags">json</aui-tag>
        </aui-header>
      `);
      const description = part(el, 'description');
      expect(description.hidden).to.be.false;
      expect(description.textContent?.trim()).to.equal('From attribute');
    });

    it('prefers slotted heading and description over the attributes', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header heading="attr heading" description="attr description">
          <span slot="heading">Slotted <em>heading</em></span>
          Slotted description
        </aui-header>
      `);
      const headingSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="heading"]')!;
      expect(headingSlot.assignedElements()[0].textContent).to.equal('Slotted heading');
      const description = part(el, 'description');
      expect(description.textContent).to.not.contain('attr description');
      expect(description.hidden).to.be.false;
      const slotted = description
        .querySelector('slot')!
        .assignedNodes()
        .map((node) => node.textContent)
        .join('')
        .trim();
      expect(slotted).to.equal('Slotted description');
    });

    it('does not render an empty heading element', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header description="Only text"></aui-header>`);
      expect(part(el, 'heading')).to.be.null;

      el.heading = 'Now titled';
      await el.updateComplete;
      expect(part(el, 'heading').tagName).to.equal('H1');
    });

    it('accepts block content in the description without nesting paragraphs', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header heading="A">
          <p>First paragraph</p>
          <ul>
            <li>Item</li>
          </ul>
        </aui-header>
      `);
      expect(part(el, 'description').tagName).to.equal('DIV');
    });

    it('hides the actions container when empty so it does not take up a gap', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header style="width: 400px" heading="A"></aui-header>`,
      );
      expect(part(el, 'actions').hidden).to.be.true;
      // 標題組佔滿整列，沒有被空的操作容器與間距擠掉
      const group = el.shadowRoot!.querySelector('.header__title-group')!;
      expect(group.getBoundingClientRect().width).to.equal(400);
    });

    it('moves actions to their own line in a narrow container instead of crushing the title', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header style="width: 300px" heading="JSON Formatter" favoritable>
          <button slot="actions" style="width: 90px">Share</button>
          <button slot="actions" style="width: 90px">Export</button>
        </aui-header>
      `);
      const heading = part(el, 'heading').getBoundingClientRect();
      const lineHeight = parseFloat(getComputedStyle(part(el, 'heading')).lineHeight);
      // 標題維持單行，沒有被擠成一行一兩個字
      expect(heading.height).to.be.closeTo(lineHeight, 1);
      const actions = part(el, 'actions').getBoundingClientRect();
      expect(actions.top).to.be.at.least(heading.bottom - 1);
      // 沒有橫向溢位
      const base = part(el, 'base');
      expect(base.scrollWidth).to.be.at.most(base.clientWidth);
      expect(actions.right).to.be.at.most(el.getBoundingClientRect().right + 0.5);
    });

    it('hides the description when there is none and follows later changes', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A"> </aui-header>`);
      expect(part(el, 'description').hidden).to.be.true;

      el.append('Loaded later');
      await settle(el);
      expect(part(el, 'description').hidden).to.be.false;
    });

    it('places slotted actions at the end of the title row', async () => {
      const el = await fixture<AuiHeader>(html`
        <aui-header style="width: 600px" heading="A" favoritable>
          <button slot="actions">Share</button>
        </aui-header>
      `);
      const action = el.querySelector('button')!;
      expect(action.getBoundingClientRect().right).to.be.closeTo(
        el.getBoundingClientRect().right,
        0.5,
      );
      expect(action.getBoundingClientRect().left).to.be.greaterThan(
        favoriteButton(el).getBoundingClientRect().right,
      );
    });
  });

  describe('favorite button', () => {
    it('renders a favorite button next to the title when favoritable', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header heading="A" favoritable favorite-label="收藏 A"></aui-header>`,
      );
      const fav = favoriteButton(el);
      expect(fav.localName).to.equal('aui-favorite-btn');
      await fav.updateComplete;
      expect(fav.favorite).to.be.false;
      expect(fav.label).to.equal('收藏 A');
      // 緊接在標題之後（間距 8px），並對齊標題的第一行
      const heading = part(el, 'heading').getBoundingClientRect();
      const rect = fav.getBoundingClientRect();
      expect(rect.left - heading.right).to.be.closeTo(8, 0.5);
      expect(rect.top + rect.height / 2).to.be.closeTo(heading.top + heading.height / 2, 1);
    });

    it('keeps the favorite button on the first line of a wrapped title', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header
          style="width: 280px"
          heading="A fairly long title that wraps onto several lines"
          favoritable
        ></aui-header>`,
      );
      const heading = part(el, 'heading').getBoundingClientRect();
      const lineHeight = parseFloat(getComputedStyle(part(el, 'heading')).lineHeight);
      expect(heading.height).to.be.greaterThan(lineHeight * 1.5);
      const fav = favoriteButton(el).getBoundingClientRect();
      expect(fav.top + fav.height / 2).to.be.closeTo(heading.top + lineHeight / 2, 1);
    });

    it('passes the favorite state down to the button', async () => {
      const el = await fixture<AuiHeader>(
        html`<aui-header heading="A" favoritable favorite></aui-header>`,
      );
      expect(favoriteButton(el).favorite).to.be.true;

      el.favorite = false;
      await el.updateComplete;
      expect(favoriteButton(el).favorite).to.be.false;
    });

    it('forwards user toggles as aui-favorite-change and updates the favorite attribute', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" favoritable></aui-header>`);
      await favoriteButton(el).updateComplete;

      setTimeout(() => innerButton(el).click());
      const event = (await oneEvent(
        el,
        'aui-favorite-change',
      )) as CustomEvent<HeaderFavoriteChangeDetail>;
      expect(event.detail.favorite).to.be.true;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      expect(event.target === el, 'dispatched by the header').to.be.true;
      // 事件觸發時屬性已更新
      expect(el.favorite).to.be.true;

      await el.updateComplete;
      expect(el.hasAttribute('favorite')).to.be.true;
    });

    it('does not leak the inner aui-change event', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" favoritable></aui-header>`);
      await favoriteButton(el).updateComplete;
      let changes = 0;
      let favoriteChanges = 0;
      el.addEventListener('aui-change', () => changes++);
      el.addEventListener('aui-favorite-change', () => favoriteChanges++);

      innerButton(el).click();
      innerButton(el).click();
      expect(changes).to.equal(0);
      expect(favoriteChanges).to.equal(2);
      expect(el.favorite).to.be.false;
    });

    it('lets a listener revert the change and keeps the button in sync', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" favoritable></aui-header>`);
      await favoriteButton(el).updateComplete;
      el.addEventListener('aui-favorite-change', () => {
        el.favorite = false; // 例如儲存失敗
      });

      innerButton(el).click();
      await el.updateComplete;
      await favoriteButton(el).updateComplete;
      expect(el.favorite).to.be.false;
      // 按鈕自行切換過狀態，Header 必須把它改回來
      expect(favoriteButton(el).favorite).to.be.false;
      expect(innerButton(el).getAttribute('aria-pressed')).to.equal('false');
      // 變更被還原，畫面沒有變化，不播放彈跳動態
      const icon = favoriteButton(el).shadowRoot!.querySelector('.fav-btn__icon')!;
      expect(icon.getAnimations()).to.have.lengthOf(0);
    });

    it('plays the bounce when the change is kept', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" favoritable></aui-header>`);
      await favoriteButton(el).updateComplete;
      innerButton(el).click();
      const icon = favoriteButton(el).shadowRoot!.querySelector('.fav-btn__icon')!;
      expect(icon.getAnimations()).to.have.lengthOf(1);
    });

    it('keeps the button in sync when a listener reverts asynchronously', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" favoritable></aui-header>`);
      await favoriteButton(el).updateComplete;
      innerButton(el).click();
      await el.updateComplete;
      expect(favoriteButton(el).favorite).to.be.true;

      await Promise.resolve();
      el.favorite = false; // 例如 API 稍後回報失敗
      await el.updateComplete;
      expect(favoriteButton(el).favorite).to.be.false;
    });

    it('does not fire aui-favorite-change when favorite is set programmatically', async () => {
      const el = await fixture<AuiHeader>(html`<aui-header heading="A" favoritable></aui-header>`);
      let count = 0;
      el.addEventListener('aui-favorite-change', () => count++);
      el.favorite = true;
      await el.updateComplete;
      expect(count).to.equal(0);
      expect(favoriteButton(el).favorite).to.be.true;
    });
  });
});
