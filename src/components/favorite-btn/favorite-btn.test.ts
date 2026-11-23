import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendMouse } from '@web/test-runner-commands';
import './index.js';
import type { AuiFavoriteBtn } from './favorite-btn.js';
import type { FavoriteChangeDetail } from './favorite-btn.types.js';
import type { AuiTooltip } from '../tooltip/tooltip.js';

const button = (el: AuiFavoriteBtn) => el.shadowRoot!.querySelector('button')!;
const icon = (el: AuiFavoriteBtn) => el.shadowRoot!.querySelector<SVGElement>('.fav-btn__icon')!;
const tooltip = (el: AuiFavoriteBtn) => el.shadowRoot!.querySelector<AuiTooltip>('aui-tooltip')!;

describe('AuiFavoriteBtn (<aui-favorite-btn>)', () => {
  describe('rendering', () => {
    it('renders an unpressed star button by default', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      expect(el.favorite).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.size).to.equal('md');
      expect(el.label).to.equal('我的最愛');

      expect(button(el).type).to.equal('button');
      expect(button(el).classList.contains('is-favorite')).to.be.false;
      expect(button(el).classList.contains('fav-btn--md')).to.be.true;
      expect(getComputedStyle(icon(el)).fill).to.equal('none');
      expect(icon(el).getBoundingClientRect().width).to.equal(20);
    });

    it('fills the star with the accent colour when favorite', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-favorite-btn></aui-favorite-btn>
          <aui-favorite-btn favorite></aui-favorite-btn>
        </div>
      `);
      const [off, on] = [...wrapper.querySelectorAll('aui-favorite-btn')];
      for (const el of [off, on]) {
        button(el).style.transition = 'none';
        icon(el).style.transition = 'none';
      }
      expect(on.hasAttribute('favorite')).to.be.true;
      expect(button(on).classList.contains('is-favorite')).to.be.true;
      expect(getComputedStyle(icon(on)).fill).to.equal('rgb(245, 158, 11)');
      // 線條顏色也不同（未收藏為灰階）
      expect(getComputedStyle(button(on)).color).to.not.equal(getComputedStyle(button(off)).color);
    });

    it('keeps the host box equal to the button regardless of the surrounding font size', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="font-size: 40px; line-height: 1.5">
          Title <aui-favorite-btn></aui-favorite-btn>
        </div>
      `);
      const el = wrapper.querySelector('aui-favorite-btn')!;
      const host = el.getBoundingClientRect();
      const inner = button(el).getBoundingClientRect();
      expect(host.width).to.equal(inner.width);
      expect(host.height).to.equal(inner.height);
      expect(host.top).to.equal(inner.top);
    });

    it('supports three sizes and falls back to md for unknown values', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn size="sm"></aui-favorite-btn>`,
      );
      expect(icon(el).getBoundingClientRect().width).to.equal(16);
      // 含內距的點擊範圍不小於 24px（WCAG 2.5.8）
      expect(button(el).getBoundingClientRect().width).to.be.at.least(24);
      expect(button(el).getBoundingClientRect().height).to.be.at.least(24);

      el.size = 'lg';
      await el.updateComplete;
      expect(icon(el).getBoundingClientRect().width).to.equal(24);

      el.size = 'huge' as AuiFavoriteBtn['size'];
      await el.updateComplete;
      expect(button(el).classList.contains('fav-btn--md')).to.be.true;
      expect(icon(el).getBoundingClientRect().width).to.equal(20);
    });
  });

  describe('toggling', () => {
    it('toggles on click, reflects the attribute and fires aui-change', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      setTimeout(() => button(el).click());
      const event = (await oneEvent(el, 'aui-change')) as CustomEvent<FavoriteChangeDetail>;
      expect(event.detail.favorite).to.be.true;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      // 事件觸發時屬性已更新
      expect(el.favorite).to.be.true;

      await el.updateComplete;
      expect(el.hasAttribute('favorite')).to.be.true;
      expect(button(el).classList.contains('is-favorite')).to.be.true;
    });

    it('toggles back off on the next click', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn favorite></aui-favorite-btn>`,
      );
      const states: boolean[] = [];
      el.addEventListener('aui-change', (event) =>
        states.push((event as CustomEvent<FavoriteChangeDetail>).detail.favorite),
      );
      button(el).click();
      button(el).click();
      await el.updateComplete;
      expect(states).to.deep.equal([false, true]);
      expect(el.favorite).to.be.true;
    });

    it('does not fire aui-change when favorite is set programmatically', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      let count = 0;
      el.addEventListener('aui-change', () => count++);
      el.favorite = true;
      await el.updateComplete;
      expect(count).to.equal(0);
      expect(button(el).getAttribute('aria-pressed')).to.equal('true');
    });

    it('lets a listener revert the change (e.g. when a request fails)', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      el.addEventListener('aui-change', () => {
        el.favorite = false;
      });
      button(el).click();
      await el.updateComplete;
      expect(el.favorite).to.be.false;
      expect(el.hasAttribute('favorite')).to.be.false;
      expect(button(el).classList.contains('is-favorite')).to.be.false;
      // 畫面沒有變化，不播放彈跳動態
      expect(icon(el).getAnimations()).to.have.lengthOf(0);
    });

    it('ignores clicks as soon as disabled is set, before the next render', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      let count = 0;
      el.addEventListener('aui-change', () => count++);
      el.disabled = true;
      // 尚未重新渲染，原生 button 還沒帶上 disabled
      expect(button(el).disabled).to.be.false;
      button(el).click();
      expect(count).to.equal(0);
      expect(el.favorite).to.be.false;
    });

    it('does nothing when disabled', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn disabled></aui-favorite-btn>`,
      );
      let count = 0;
      el.addEventListener('aui-change', () => count++);
      button(el).click();
      const rect = button(el).getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      await resetMouse();
      expect(count).to.equal(0);
      expect(el.favorite).to.be.false;
      expect(button(el).disabled).to.be.true;
    });
  });

  describe('motion', () => {
    afterEach(async () => {
      await resetMouse();
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    it('plays a bounce animation on the star when toggled by the user', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      expect(icon(el).getAnimations()).to.have.lengthOf(0);

      button(el).click();
      const animations = icon(el).getAnimations();
      expect(animations).to.have.lengthOf(1);
      const keyframes = (animations[0].effect as KeyframeEffect).getKeyframes();
      const scales = keyframes.map((frame) => frame.transform);
      expect(scales[0]).to.equal('scale(1)');
      expect(scales).to.include('scale(1.3)');
      expect(scales[scales.length - 1]).to.equal('scale(1)');
    });

    it('restarts the animation on rapid clicks instead of stacking', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      button(el).click();
      button(el).click();
      button(el).click();
      expect(icon(el).getAnimations()).to.have.lengthOf(1);
    });

    it('only cancels its own animation, not ones added through ::part(icon)', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      const custom = icon(el).animate([{ opacity: 1 }, { opacity: 0.5 }], {
        duration: 10_000,
        iterations: Infinity,
      });
      button(el).click();
      button(el).click();
      expect(custom.playState).to.equal('running');
      expect(icon(el).getAnimations()).to.have.lengthOf(2);
      custom.cancel();
    });

    it('does not animate when favorite is set programmatically', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      el.favorite = true;
      await el.updateComplete;
      expect(icon(el).getAnimations()).to.have.lengthOf(0);
    });

    it('scales up slightly on hover', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      button(el).style.transition = 'none';
      const rect = button(el).getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      expect(button(el).matches(':hover'), 'pointer is over the button').to.be.true;
      expect(new DOMMatrix(getComputedStyle(button(el)).transform).a).to.be.closeTo(1.1, 0.001);
    });

    it('skips the bounce and the hover scale when the user prefers reduced motion', async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      button(el).click();
      expect(icon(el).getAnimations()).to.have.lengthOf(0);
      // 狀態仍然正常切換
      expect(el.favorite).to.be.true;

      const rect = button(el).getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      expect(button(el).matches(':hover'), 'pointer is over the button').to.be.true;
      expect(getComputedStyle(button(el)).transform).to.equal('none');
    });
  });

  describe('tooltip', () => {
    afterEach(() => resetMouse());

    it('shows the library tooltip with the label on hover, without a native title', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn label="收藏 JSON Formatter"></aui-favorite-btn>`,
      );
      const tip = tooltip(el);
      expect(tip, 'built-in tooltip').to.exist;
      expect(tip.content).to.equal('收藏 JSON Formatter');
      expect(tip.placement).to.equal('top');
      // 原生提示的來源都不存在
      expect(el.shadowRoot!.querySelector('title')).to.be.null;
      expect(button(el).hasAttribute('title')).to.be.false;

      const rect = button(el).getBoundingClientRect();
      const shown = oneEvent(tip, 'aui-after-show');
      await sendMouse({
        type: 'move',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      await shown;
      expect(tip.open).to.be.true;
    });

    it('shows the tooltip when the button receives keyboard focus', async () => {
      const el = await fixture<AuiFavoriteBtn>(html`<aui-favorite-btn></aui-favorite-btn>`);
      const tip = tooltip(el);
      const shown = oneEvent(tip, 'aui-after-show');
      button(el).focus();
      await shown;
      expect(tip.open).to.be.true;
    });

    it('uses tooltip and tooltip-placement when set', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn
          tooltip="加入常用工具"
          tooltip-placement="bottom"
        ></aui-favorite-btn>`,
      );
      expect(tooltip(el).content).to.equal('加入常用工具');
      expect(tooltip(el).placement).to.equal('bottom');
      // 名稱仍是 label
      expect(button(el).getAttribute('aria-label')).to.equal('我的最愛');
    });

    it('renders no tooltip with no-tooltip', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn no-tooltip></aui-favorite-btn>`,
      );
      expect(el.shadowRoot!.querySelector('aui-tooltip')).to.be.null;
      expect(button(el).getAttribute('aria-label')).to.equal('我的最愛');
    });

    it('disables the tooltip together with the button', async () => {
      const el = await fixture<AuiFavoriteBtn>(
        html`<aui-favorite-btn disabled></aui-favorite-btn>`,
      );
      expect(tooltip(el).disabled).to.be.true;
    });
  });
});
