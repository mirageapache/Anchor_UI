import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import './index.js';
import type { AuiAccordion } from './accordion.js';
import type { AccordionToggleDetail } from './accordion.types.js';

const details = (el: AuiAccordion) => el.shadowRoot!.querySelector('details')!;
const summary = (el: AuiAccordion) => el.shadowRoot!.querySelector('summary')!;
const body = (el: AuiAccordion) => el.shadowRoot!.querySelector<HTMLElement>('.accordion__body')!;

/** 等待原生 toggle 事件（非同步）與後續的重新渲染 */
async function settle(el: AuiAccordion): Promise<void> {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await el.updateComplete;
}

describe('AuiAccordion (<aui-accordion>)', () => {
  describe('rendering', () => {
    it('renders a collapsed native details / summary by default', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="How to use"><p>Body</p></aui-accordion>`,
      );
      expect(el.open).to.be.false;
      expect(el.name).to.equal('');
      expect(el.variant).to.equal('doc');
      expect(el.hasAttribute('open')).to.be.false;

      expect(details(el).open).to.be.false;
      expect(details(el).classList.contains('accordion--doc')).to.be.true;
      expect(summary(el).textContent?.trim()).to.equal('How to use');
      // 收合時內容不顯示，也不撐高外框（原生以 content-visibility: hidden 隱藏，不能用內容本身的高度判斷）
      expect(body(el).checkVisibility()).to.be.false;
      const collapsedHeight = details(el).getBoundingClientRect().height;

      el.open = true;
      await settle(el);
      expect(details(el).getBoundingClientRect().height).to.be.greaterThan(collapsedHeight);
    });

    it('renders expanded when the open attribute is present', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A" open><p>Body</p></aui-accordion>`,
      );
      expect(el.open).to.be.true;
      expect(details(el).open).to.be.true;
      expect(body(el).checkVisibility()).to.be.true;
    });

    it('supports a slotted heading', async () => {
      const el = await fixture<AuiAccordion>(html`
        <aui-accordion heading="attr"
          ><span slot="heading">Slotted <b>heading</b></span></aui-accordion
        >
      `);
      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="heading"]')!;
      expect(slot.assignedElements()[0].textContent).to.equal('Slotted heading');
    });

    it('applies the faq layout and falls back to doc for unknown variants', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="Q" variant="faq"></aui-accordion>`,
      );
      expect(details(el).classList.contains('accordion--faq')).to.be.true;
      const faqPadding = getComputedStyle(details(el)).paddingLeft;

      el.variant = 'unknown' as AuiAccordion['variant'];
      await el.updateComplete;
      expect(details(el).classList.contains('accordion--doc')).to.be.true;
      expect(getComputedStyle(details(el)).paddingLeft).to.not.equal(faqPadding);
    });

    it('renders the plain layout without border, background or divider', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="Menu" variant="plain" open><p>Item</p></aui-accordion>`,
      );
      const base = details(el);
      expect(base.classList.contains('accordion--plain')).to.be.true;
      const style = getComputedStyle(base);
      expect(style.borderTopStyle).to.equal('none');
      expect(style.borderLeftStyle).to.equal('none');
      expect(style.backgroundColor).to.equal('rgba(0, 0, 0, 0)');
      expect(style.paddingLeft).to.equal('0px');
      // 展開時不畫內容上方的虛線分隔線
      const body = el.shadowRoot!.querySelector<HTMLElement>('[part="body"]')!;
      expect(getComputedStyle(body).borderTopStyle).to.equal('none');
      expect(getComputedStyle(body).paddingTop).to.equal('0px');
      // 內距在標題列上：點擊範圍至少 24px 高（WCAG 2.5.8），焦點框畫在內側不會被外層容器裁切
      const summary = el.shadowRoot!.querySelector<HTMLElement>('summary')!;
      expect(summary.getBoundingClientRect().height).to.be.at.least(24);
      summary.focus();
      expect(summary.matches(':focus-visible')).to.be.true;
      expect(getComputedStyle(summary).outlineOffset).to.equal('-2px');
    });
  });

  describe('toggling', () => {
    it('opens on summary click, reflects the open attribute and fires aui-toggle', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A"><p>Body</p></aui-accordion>`,
      );
      setTimeout(() => summary(el).click());
      const event = (await oneEvent(el, 'aui-toggle')) as CustomEvent<AccordionToggleDetail>;
      expect(event.detail.open).to.be.true;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      expect(el.open).to.be.true;
      expect(el.hasAttribute('open')).to.be.true;
      expect(details(el).open).to.be.true;
    });

    it('closes on a second click', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A" open><p>Body</p></aui-accordion>`,
      );
      setTimeout(() => summary(el).click());
      const event = (await oneEvent(el, 'aui-toggle')) as CustomEvent<AccordionToggleDetail>;
      expect(event.detail.open).to.be.false;
      expect(el.open).to.be.false;
      expect(el.hasAttribute('open')).to.be.false;
    });

    it('follows the open property and fires aui-toggle once per change', async () => {
      const el = await fixture<AuiAccordion>(html`<aui-accordion heading="A"></aui-accordion>`);
      const events: boolean[] = [];
      el.addEventListener('aui-toggle', (event) =>
        events.push((event as CustomEvent<AccordionToggleDetail>).detail.open),
      );

      el.open = true;
      await settle(el);
      expect(details(el).open).to.be.true;

      el.open = false;
      await settle(el);
      expect(details(el).open).to.be.false;
      expect(events).to.deep.equal([true, false]);
    });

    it('does not fire aui-toggle on first render, even when initially open', async () => {
      const wrapper = document.createElement('div');
      let count = 0;
      wrapper.addEventListener('aui-toggle', () => count++);
      document.body.appendChild(wrapper);
      try {
        wrapper.innerHTML = '<aui-accordion heading="A" open></aui-accordion>';
        await settle(wrapper.querySelector('aui-accordion')!);
        expect(count).to.equal(0);
      } finally {
        wrapper.remove();
      }
    });

    it('exposes show(), hide() and toggle()', async () => {
      const el = await fixture<AuiAccordion>(html`<aui-accordion heading="A"></aui-accordion>`);
      el.show();
      await settle(el);
      expect(details(el).open).to.be.true;

      el.toggle();
      await settle(el);
      expect(details(el).open).to.be.false;
    });

    it('does not fire aui-toggle when the state is changed and reverted in the same update', async () => {
      const el = await fixture<AuiAccordion>(html`<aui-accordion heading="A"></aui-accordion>`);
      let count = 0;
      el.addEventListener('aui-toggle', () => count++);

      el.toggle();
      el.hide();
      await settle(el);
      expect(el.open).to.be.false;
      expect(details(el).open).to.be.false;
      expect(count, 'closed → open → closed').to.equal(0);

      el.open = true;
      await settle(el);
      el.open = false;
      el.open = true;
      await settle(el);
      expect(count, 'one real change').to.equal(1);
    });

    it('lets a programmatic call win over a pending native toggle event', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A" open><p>Body</p></aui-accordion>`,
      );
      // 使用者點擊後 <details> 已收合，但原生 toggle 事件尚未送達時呼叫 show()
      summary(el).click();
      expect(details(el).open).to.be.false;
      el.show();
      await settle(el);
      expect(el.open).to.be.true;
      expect(details(el).open).to.be.true;
    });

    it('toggle() follows what the user sees while a native toggle event is pending', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A" open><p>Body</p></aui-accordion>`,
      );
      summary(el).click(); // 畫面上已收合
      el.toggle(); // 應該展開，而不是依過期的 open 屬性再收合一次
      await settle(el);
      expect(el.open).to.be.true;
      expect(details(el).open).to.be.true;
    });

    it('does not move focus to the summary when body content is clicked', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A" open><p id="text">Selectable text</p></aui-accordion>`,
      );
      const text = el.querySelector<HTMLElement>('#text')!;
      const rect = text.getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [Math.round(rect.x + 5), Math.round(rect.y + rect.height / 2)],
      });
      await resetMouse();
      expect(el.shadowRoot!.activeElement, 'summary not focused').to.be.null;
      expect(el.open, 'still open').to.be.true;
    });

    it('stays in sync when the native details is opened directly', async () => {
      const el = await fixture<AuiAccordion>(html`<aui-accordion heading="A"></aui-accordion>`);
      setTimeout(() => (details(el).open = true));
      await oneEvent(el, 'aui-toggle');
      expect(el.open).to.be.true;
      expect(el.hasAttribute('open')).to.be.true;
    });

    it('toggles with Enter and Space from the keyboard', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A"><p>Body</p></aui-accordion>`,
      );
      el.focus();
      expect(el.shadowRoot!.activeElement === summary(el), 'summary focused').to.be.true;

      setTimeout(() => sendKeys({ press: 'Enter' }));
      await oneEvent(el, 'aui-toggle');
      expect(el.open).to.be.true;

      setTimeout(() => sendKeys({ press: 'Space' }));
      await oneEvent(el, 'aui-toggle');
      expect(el.open).to.be.false;
    });
  });

  describe('exclusive group (name)', () => {
    const group = () => html`
      <div>
        <aui-accordion heading="One" name="faq" open></aui-accordion>
        <aui-accordion heading="Two" name="faq"></aui-accordion>
        <aui-accordion heading="Three" name="faq"></aui-accordion>
        <aui-accordion heading="Other group" name="other" open></aui-accordion>
        <aui-accordion heading="Independent" open></aui-accordion>
      </div>
    `;
    const items = (wrapper: Element) => [...wrapper.querySelectorAll('aui-accordion')];

    it('closes other accordions with the same name when one opens', async () => {
      const wrapper = await fixture(group());
      const [one, two, three, other, independent] = items(wrapper);

      setTimeout(() => summary(two).click());
      await oneEvent(one, 'aui-toggle');
      await settle(two);

      expect(one.open).to.be.false;
      expect(two.open).to.be.true;
      expect(three.open).to.be.false;
      // 不同群組與未命名的手風琴不受影響
      expect(other.open).to.be.true;
      expect(independent.open).to.be.true;
      expect(details(one).open).to.be.false;
    });

    it('applies when opened programmatically', async () => {
      const wrapper = await fixture(group());
      const [one, , three] = items(wrapper);
      three.open = true;
      await settle(three);
      await settle(one);
      expect(one.open).to.be.false;
      expect(three.open).to.be.true;
    });

    it('allows every accordion in a group to be closed', async () => {
      const wrapper = await fixture(group());
      const [one, two, three] = items(wrapper);
      one.open = false;
      await settle(one);
      expect([one.open, two.open, three.open]).to.deep.equal([false, false, false]);
    });

    it('keeps accordions without a name independent', async () => {
      const wrapper = await fixture(html`
        <div>
          <aui-accordion heading="A" open></aui-accordion>
          <aui-accordion heading="B"></aui-accordion>
        </div>
      `);
      const [a, b] = items(wrapper);
      b.open = true;
      await settle(b);
      expect(a.open).to.be.true;
      expect(b.open).to.be.true;
    });

    it('joins a group when the name is set on an open accordion', async () => {
      const wrapper = await fixture(html`
        <div>
          <aui-accordion heading="A" name="g" open></aui-accordion>
          <aui-accordion heading="B" open></aui-accordion>
        </div>
      `);
      const [a, b] = items(wrapper);
      b.name = 'g';
      await settle(b);
      await settle(a);
      expect(a.open).to.be.false;
      expect(b.open).to.be.true;
    });

    it('keeps the first one open when several items in a group start open', async () => {
      const wrapper = await fixture(html`
        <div>
          <aui-accordion heading="One" name="g" open></aui-accordion>
          <aui-accordion heading="Two" name="g" open></aui-accordion>
          <aui-accordion heading="Three" name="g" open></aui-accordion>
        </div>
      `);
      const all = items(wrapper);
      let events = 0;
      wrapper.addEventListener('aui-toggle', () => events++);
      for (const item of all) await settle(item);

      expect(all.map((item) => item.open)).to.deep.equal([true, false, false]);
      expect(all.map((item) => details(item).open)).to.deep.equal([true, false, false]);
      expect(events, 'initial resolution is silent').to.equal(0);
    });

    it('keeps the existing one open when an open item is appended later', async () => {
      const wrapper = await fixture(html`
        <div><aui-accordion heading="One" name="g" open></aui-accordion></div>
      `);
      const [one] = items(wrapper);
      const late = document.createElement('aui-accordion');
      late.heading = 'Late';
      late.name = 'g';
      late.open = true;
      wrapper.appendChild(late);
      await settle(late);

      expect(one.open).to.be.true;
      expect(late.open).to.be.false;
    });

    it('re-checks the group when an open item is moved into it', async () => {
      const wrapper = await fixture(html`
        <div>
          <div id="a"><aui-accordion heading="One" name="g" open></aui-accordion></div>
          <div id="b"></div>
        </div>
      `);
      const [one] = items(wrapper);
      const shadow = wrapper.querySelector('#b')!.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<aui-accordion heading="Two" name="g" open></aui-accordion>';
      const two = shadow.querySelector('aui-accordion')!;
      await settle(two);
      expect([one.open, two.open], 'different roots').to.deep.equal([true, true]);

      // 把展開中的項目移進已有展開項目的群組：保留原本在群組內的那一個
      wrapper.querySelector('#a')!.appendChild(two);
      await settle(two);
      expect(one.open).to.be.true;
      expect(two.open).to.be.false;
      expect(details(two).open).to.be.false;
    });

    it('keeps the earlier one in document order when an open item is moved in front', async () => {
      const wrapper = await fixture(html`
        <div>
          <div id="a"><aui-accordion heading="One" name="g" open></aui-accordion></div>
          <div id="b"></div>
        </div>
      `);
      const [one] = items(wrapper);
      const shadow = wrapper.querySelector('#b')!.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<aui-accordion heading="Two" name="g" open></aui-accordion>';
      const two = shadow.querySelector('aui-accordion')!;
      await settle(two);

      wrapper.querySelector('#a')!.prepend(two);
      await settle(two);
      await settle(one);
      expect(two.open).to.be.true;
      expect(one.open).to.be.false;
    });

    it('does not collapse an ancestor or descendant that shares the name', async () => {
      const wrapper = await fixture(html`
        <div>
          <aui-accordion id="outer" heading="Outer" name="g" open>
            <aui-accordion id="inner" heading="Inner" name="g"></aui-accordion>
          </aui-accordion>
        </div>
      `);
      const outer = wrapper.querySelector<AuiAccordion>('#outer')!;
      const inner = wrapper.querySelector<AuiAccordion>('#inner')!;
      inner.open = true;
      await settle(inner);
      await settle(outer);
      expect(outer.open, 'outer stays open').to.be.true;
      expect(inner.open).to.be.true;
    });

    it('bubbles aui-toggle from a nested accordion with the inner one as target', async () => {
      const wrapper = await fixture(html`
        <div>
          <aui-accordion id="outer" heading="Outer" open>
            <aui-accordion id="inner" heading="Inner"></aui-accordion>
          </aui-accordion>
        </div>
      `);
      const outer = wrapper.querySelector<AuiAccordion>('#outer')!;
      const inner = wrapper.querySelector<AuiAccordion>('#inner')!;
      const targets: EventTarget[] = [];
      outer.addEventListener('aui-toggle', (event) => targets.push(event.target!));

      inner.open = true;
      await settle(inner);
      expect(targets).to.have.lengthOf(1);
      expect(targets[0] === inner, 'target is the inner accordion').to.be.true;
      expect(outer.open).to.be.true;
    });

    it('closes siblings on user clicks and allows the whole group to be closed by clicking', async () => {
      const wrapper = await fixture(group());
      const [one, two] = items(wrapper);
      summary(two).click();
      await settle(two);
      await settle(one);
      expect([one.open, two.open]).to.deep.equal([false, true]);

      summary(two).click();
      await settle(two);
      expect([one.open, two.open]).to.deep.equal([false, false]);
    });

    it('is scoped to the same root: a group inside a shadow root does not affect the document', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-accordion heading="Outside" name="g" open></aui-accordion>
          <div id="host"></div>
        </div>
      `);
      const shadow = wrapper.querySelector('#host')!.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <aui-accordion heading="Inside 1" name="g" open></aui-accordion>
        <aui-accordion heading="Inside 2" name="g"></aui-accordion>
      `;
      const outside = wrapper.querySelector('aui-accordion')!;
      const [inside1, inside2] = [...shadow.querySelectorAll('aui-accordion')];
      await settle(inside2);

      inside2.open = true;
      await settle(inside2);
      await settle(inside1);
      expect(inside1.open).to.be.false;
      expect(outside.open).to.be.true;
    });
  });

  describe('motion', () => {
    afterEach(() => emulateMedia({ reducedMotion: 'no-preference' }));

    const durations = (el: AuiAccordion) => ({
      border: getComputedStyle(details(el)).transitionDuration,
      icon: getComputedStyle(el.shadowRoot!.querySelector('.accordion__icon')!).transitionDuration,
    });

    it('animates the border highlight and the arrow rotation', async () => {
      const el = await fixture<AuiAccordion>(html`<aui-accordion heading="A"></aui-accordion>`);
      expect(getComputedStyle(details(el)).transitionProperty).to.equal('border-color');
      expect(durations(el)).to.deep.equal({ border: '0.15s', icon: '0.15s' });
    });

    it('removes the transitions when the user prefers reduced motion', async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
      const el = await fixture<AuiAccordion>(html`<aui-accordion heading="A"></aui-accordion>`);
      expect(durations(el)).to.deep.equal({ border: '0s', icon: '0s' });
    });
  });

  describe('visual feedback', () => {
    before(() => emulateMedia({ reducedMotion: 'reduce' }));
    after(() => emulateMedia({ reducedMotion: 'no-preference' }));

    it('highlights the border and rotates the arrow when open', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="A"><p>Body</p></aui-accordion>`,
      );
      const icon = el.shadowRoot!.querySelector<SVGElement>('.accordion__icon')!;
      const closedBorder = getComputedStyle(details(el)).borderTopColor;
      expect(getComputedStyle(icon).transform).to.equal('none');

      el.open = true;
      await settle(el);
      expect(getComputedStyle(details(el)).borderTopColor).to.not.equal(closedBorder);
      // rotate(90deg) → matrix(0, 1, -1, 0, 0, 0)
      const matrix = new DOMMatrix(getComputedStyle(icon).transform);
      expect(matrix.a).to.be.closeTo(0, 0.001);
      expect(matrix.b).to.be.closeTo(1, 0.001);
    });

    it('applies default spacing and indentation to slotted paragraphs and lists', async () => {
      const el = await fixture<AuiAccordion>(html`
        <aui-accordion heading="A" open>
          <p id="p">Paragraph</p>
          <ul id="list">
            <li>Item</li>
          </ul>
          <p id="last">Last</p>
        </aui-accordion>
      `);
      const style = (id: string) => getComputedStyle(el.querySelector(`#${id}`)!);
      expect(style('p').marginBottom).to.equal('8px');
      expect(style('list').paddingInlineStart).to.equal('24px');
      expect(style('last').marginBottom).to.equal('0px');
    });

    it('does not apply the content spacing to a slotted heading', async () => {
      const el = await fixture<AuiAccordion>(html`
        <aui-accordion open>
          <p slot="heading" id="heading" style="margin: 0 0 3px">Heading paragraph</p>
          <p>Body</p>
        </aui-accordion>
      `);
      expect(getComputedStyle(el.querySelector('#heading')!).marginBottom).to.equal('3px');
    });

    it('wraps long unbroken text without overflowing', async () => {
      const long = 'averyveryverylongunbrokenstringthatcannotwrapnormally'.repeat(4);
      const el = await fixture<AuiAccordion>(html`
        <aui-accordion style="width: 240px" heading=${long} open><p>${long}</p></aui-accordion>
      `);
      expect(details(el).scrollWidth).to.be.at.most(details(el).clientWidth);
      expect(el.getBoundingClientRect().width).to.equal(240);
    });
  });
});
