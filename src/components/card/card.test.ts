import { expect, fixture, html } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendMouse } from '@web/test-runner-commands';
import './index.js';
import type { AuiCard } from './card.js';

const base = (el: AuiCard) => el.shadowRoot!.querySelector<HTMLElement>('.card')!;
const part = (el: AuiCard, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;

/** 等待 light DOM 變動（MutationObserver）觸發的重新渲染 */
async function settle(el: AuiCard): Promise<void> {
  await el.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await el.updateComplete;
}

describe('AuiCard (<aui-card>)', () => {
  describe('rendering', () => {
    it('renders a static container with defaults when href is not set', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="JSON Formatter" description="Format JSON"></aui-card>`,
      );
      expect(el.hot).to.be.false;
      expect(el.headingLevel).to.equal(3);
      expect(el.lines).to.equal(2);

      expect(base(el).tagName).to.equal('DIV');
      expect(base(el).classList.contains('card--link')).to.be.false;
      expect(part(el, 'heading').tagName).to.equal('H3');
      expect(part(el, 'heading').textContent?.trim()).to.equal('JSON Formatter');
      expect(part(el, 'description').textContent?.trim()).to.equal('Format JSON');
      expect(part(el, 'hot-badge')).to.be.null;
    });

    it('renders the whole card as a link when href is set', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="UUID" href="/tools/uuid"></aui-card>`,
      );
      const link = base(el) as HTMLAnchorElement;
      expect(link.tagName).to.equal('A');
      expect(link.getAttribute('href')).to.equal('/tools/uuid');
      expect(link.hasAttribute('target')).to.be.false;
      expect(link.hasAttribute('rel')).to.be.false;
      expect(link.classList.contains('card--link')).to.be.true;
    });

    it('reflects light DOM changes made while detached once reinserted', async () => {
      const wrapper = await fixture<HTMLDivElement>(
        html`<div><aui-card heading="X"></aui-card></div>`,
      );
      const el = wrapper.querySelector<AuiCard>('aui-card')!;
      expect(part(el, 'tags')!.hidden).to.be.true;

      el.remove();
      const tag = document.createElement('span');
      tag.slot = 'tags';
      tag.textContent = 'new';
      el.append(tag);
      wrapper.append(el);
      await el.updateComplete;
      expect(part(el, 'tags')!.hidden, 'tags wrapper is shown').to.be.false;
    });

    it('renders a static container for an unsafe href protocol', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="X"></aui-card>`);
      for (const href of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x']) {
        el.href = href;
        await el.updateComplete;
        expect(base(el).tagName, href).to.equal('DIV');
        expect(base(el).hasAttribute('href'), href).to.be.false;
      }
      el.href = 'mailto:hi@example.com';
      await el.updateComplete;
      expect(base(el).getAttribute('href')).to.equal('mailto:hi@example.com');
    });

    it('treats an empty href as a link, like a native <a href="">', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="Here" href=""></aui-card>`);
      expect(base(el).tagName).to.equal('A');
      expect(base(el).getAttribute('href')).to.equal('');
    });

    it('switches between link and static container when href changes', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="UUID" href="/a"></aui-card>`);
      el.href = undefined;
      await el.updateComplete;
      expect(base(el).tagName).to.equal('DIV');

      el.href = '/b';
      await el.updateComplete;
      expect(base(el).getAttribute('href')).to.equal('/b');
    });

    it('defaults rel to "noopener noreferrer" for target="_blank" and honours an explicit rel', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="Docs" href="https://example.com" target="_blank"></aui-card>`,
      );
      expect(base(el).getAttribute('target')).to.equal('_blank');
      expect(base(el).getAttribute('rel')).to.equal('noopener noreferrer');

      el.rel = 'external';
      await el.updateComplete;
      expect(base(el).getAttribute('rel')).to.equal('external');
    });

    it('renders the requested heading level and falls back to h3 for invalid values', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="A" heading-level="2"></aui-card>`);
      expect(part(el, 'heading').tagName).to.equal('H2');

      for (const invalid of [0, 7, 2.5, Number.NaN]) {
        el.headingLevel = invalid as AuiCard['headingLevel'];
        await el.updateComplete;
        expect(part(el, 'heading').tagName, String(invalid)).to.equal('H3');
      }
    });

    it('focuses the inner link through host.focus()', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="A" href="/a"></aui-card>`);
      el.focus();
      expect(el.shadowRoot!.activeElement === base(el), 'inner link focused').to.be.true;
    });
  });

  describe('HOT variant', () => {
    it('shows a text badge and a distinct border colour', async () => {
      const el = await fixture<AuiCard>(html`
        <div>
          <aui-card heading="Plain"></aui-card>
          <aui-card heading="Hot" hot></aui-card>
        </div>
      `).then((wrapper) => wrapper.querySelectorAll('aui-card'));
      const [plain, hot] = [...el] as AuiCard[];

      expect(hot.hasAttribute('hot')).to.be.true;
      expect(part(hot, 'hot-badge').textContent?.trim()).to.equal('HOT');
      expect(getComputedStyle(base(hot)).borderTopColor).to.not.equal(
        getComputedStyle(base(plain)).borderTopColor,
      );
    });

    it('supports a custom badge label', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card heading="Hot" hot hot-label="熱門"></aui-card>`,
      );
      expect(part(el, 'hot-badge').textContent?.trim()).to.equal('熱門');
    });
  });

  describe('slots', () => {
    it('prefers slotted heading and description over the attributes', async () => {
      const el = await fixture<AuiCard>(html`
        <aui-card heading="attr heading" description="attr description">
          <span slot="heading">Slotted heading</span>
          Slotted description
        </aui-card>
      `);
      await settle(el);
      const headingSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="heading"]')!;
      expect(headingSlot.assignedElements()[0].textContent).to.equal('Slotted heading');
      const descSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;
      expect(
        descSlot
          .assignedNodes()
          .map((node) => node.textContent)
          .join('')
          .trim(),
      ).to.equal('Slotted description');
      // 屬性值不可與 slot 內容同時出現
      expect(part(el, 'description').textContent).to.not.contain('attr description');
    });

    it('shows the description attribute even when other content is slotted', async () => {
      // host 內的換行空白會被指派到預設 slot，不可因此讓 description 屬性消失
      const el = await fixture<AuiCard>(html`
        <aui-card heading="A" description="From attribute">
          <span slot="tags">json</span>
        </aui-card>
      `);
      await settle(el);
      const desc = part(el, 'description');
      expect(desc.hidden).to.be.false;
      expect(desc.textContent?.trim()).to.equal('From attribute');
      expect(desc.getBoundingClientRect().height).to.be.greaterThan(0);
    });

    it('hides the description and tags containers when they are empty', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="Only heading"> </aui-card>`);
      await settle(el);
      expect(part(el, 'description').hidden).to.be.true;
      expect(part(el, 'tags').hidden).to.be.true;
      expect(getComputedStyle(part(el, 'tags')).display).to.equal('none');
    });

    it('shows the tags container once tags are slotted and hides it again when removed', async () => {
      const el = await fixture<AuiCard>(html`
        <aui-card heading="With tags"><span slot="tags">json</span></aui-card>
      `);
      await settle(el);
      expect(part(el, 'tags').hidden).to.be.false;

      el.querySelector('[slot="tags"]')!.remove();
      await settle(el);
      expect(part(el, 'tags').hidden).to.be.true;
    });

    it('shows the description container for slotted description without the attribute', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="A">Slotted only</aui-card>`);
      // 首次渲染即正確，不依賴 slotchange（happy-dom 等環境不會分派第一次 slotchange）
      expect(part(el, 'description').hidden).to.be.false;
    });

    it('resolves slotted tags on first render without waiting for slotchange', async () => {
      const el = document.createElement('aui-card');
      el.innerHTML = '<span slot="tags">json</span>';
      document.body.appendChild(el);
      try {
        await el.updateComplete;
        expect(part(el, 'tags').hidden).to.be.false;
      } finally {
        el.remove();
      }
    });

    it('follows slotted text that is filled in or cleared later (framework text bindings)', async () => {
      // 框架更新文字綁定時只改寫既有文字節點的內容，不會觸發 slotchange
      const text = document.createTextNode('');
      const el = await fixture<AuiCard>(html`<aui-card heading="A"></aui-card>`);
      el.appendChild(text);
      await settle(el);
      expect(part(el, 'description').hidden, 'empty text').to.be.true;

      text.data = 'Loaded later';
      await settle(el);
      expect(part(el, 'description').hidden, 'after text arrives').to.be.false;

      text.data = '';
      await settle(el);
      expect(part(el, 'description').hidden, 'after text is cleared').to.be.true;
    });

    it('moves content between containers when its slot attribute changes', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="A"><span>text</span></aui-card>`);
      expect(part(el, 'description').hidden).to.be.false;
      expect(part(el, 'tags').hidden).to.be.true;

      el.querySelector('span')!.setAttribute('slot', 'tags');
      await settle(el);
      expect(part(el, 'description').hidden).to.be.true;
      expect(part(el, 'tags').hidden).to.be.false;
    });
  });

  describe('icon slot', () => {
    it('keeps the single-column structure without an icon', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="A" description="d"></aui-card>`);
      expect(part(el, 'icon')).to.be.null;
      expect(part(el, 'body')).to.be.null;
      expect(base(el).classList.contains('card--icon')).to.be.false;
      expect(getComputedStyle(base(el)).flexDirection).to.equal('column');
    });

    it('lays out the icon to the left of the heading, description and tags', async () => {
      const el = await fixture<AuiCard>(html`
        <aui-card description="本月營收">
          <svg slot="icon" aria-hidden="true" width="32" height="32"></svg>
          <span slot="heading">NT$ 1.2M</span>
        </aui-card>
      `);
      expect(getComputedStyle(base(el)).flexDirection).to.equal('row');
      const icon = part(el, 'icon');
      const body = part(el, 'body');
      expect(icon.querySelector('slot')!.assignedElements()[0].localName).to.equal('svg');
      expect(body.contains(part(el, 'header'))).to.be.true;
      expect(body.contains(part(el, 'description'))).to.be.true;
      expect(body.contains(part(el, 'tags'))).to.be.true;

      const iconBox = icon.getBoundingClientRect();
      const bodyBox = body.getBoundingClientRect();
      expect(iconBox.right).to.be.at.most(bodyBox.left);
      expect(iconBox.width).to.equal(32);
    });

    it('switches layout when an icon is added or removed later', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card><span slot="heading">Name</span>Description</aui-card>`,
      );
      const assigned = (slotName: string) => {
        const slot = el.shadowRoot!.querySelector<HTMLSlotElement>(
          slotName ? `slot[name="${slotName}"]` : 'slot:not([name])',
        )!;
        return slot
          .assignedNodes()
          .map((node) => node.textContent?.trim())
          .filter(Boolean);
      };
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('slot', 'icon');
      el.append(svg);
      await settle(el);
      expect(part(el, 'icon')).to.not.be.null;
      expect(getComputedStyle(base(el)).flexDirection).to.equal('row');
      // 版面切換會重建標題與簡介的 slot：放入的內容仍須指派到新的 slot
      expect(assigned('heading')).to.deep.equal(['Name']);
      expect(assigned('')).to.deep.equal(['Description']);

      svg.remove();
      await settle(el);
      expect(part(el, 'icon')).to.be.null;
      expect(getComputedStyle(base(el)).flexDirection).to.equal('column');
      expect(assigned('heading')).to.deep.equal(['Name']);
      expect(assigned('')).to.deep.equal(['Description']);
    });

    it('keeps the link named by the heading and described by the description', async () => {
      const el = await fixture<AuiCard>(html`
        <aui-card heading="Revenue" description="This month" href="/kpi">
          <svg slot="icon" aria-hidden="true" width="24" height="24"></svg>
        </aui-card>
      `);
      const link = part(el, 'base');
      expect(link.localName).to.equal('a');
      expect(link.getAttribute('aria-labelledby')).to.equal('heading');
      expect(link.getAttribute('aria-describedby')).to.equal('description');
      // 標題、簡介等 id 仍在同一個 shadow root 中，可被參照
      expect(el.shadowRoot!.getElementById('heading')!.textContent!.trim()).to.equal('Revenue');
    });
  });

  describe('description line clamp', () => {
    const longText = 'A very long description that keeps going. '.repeat(20);

    async function lineCount(el: AuiCard): Promise<number> {
      await settle(el);
      const desc = part(el, 'description');
      return Math.round(desc.clientHeight / parseFloat(getComputedStyle(desc).lineHeight));
    }

    it('clamps the description to two lines by default', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card style="width: 280px" heading="A" description=${longText}></aui-card>`,
      );
      expect(await lineCount(el)).to.equal(2);
    });

    it('clamps slotted descriptions as well', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card style="width: 280px" heading="A">${longText}</aui-card>`,
      );
      expect(await lineCount(el)).to.equal(2);
    });

    it('honours a custom number of lines and disables clamping with 0', async () => {
      const el = await fixture<AuiCard>(
        html`<aui-card
          style="width: 280px"
          heading="A"
          lines="3"
          description=${longText}
        ></aui-card>`,
      );
      expect(await lineCount(el)).to.equal(3);

      el.lines = 0;
      expect(await lineCount(el)).to.be.greaterThan(3);
    });
  });

  describe('hover feedback', () => {
    afterEach(async () => {
      await resetMouse();
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    async function hover(el: AuiCard): Promise<void> {
      const rect = base(el).getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
    }

    it('lifts link cards by 2px on hover', async () => {
      // 停用轉場以立即讀到最終值（transform 本身在減少動畫時會被取消，因此只關閉 transition）
      const el = await fixture<AuiCard>(html`<aui-card heading="A" href="/a"></aui-card>`);
      base(el).style.transition = 'none';
      await hover(el);
      expect(base(el).matches(':hover'), 'pointer is over the card').to.be.true;
      expect(new DOMMatrix(getComputedStyle(base(el)).transform).m42).to.equal(-2);
    });

    it('does not lift static cards', async () => {
      const el = await fixture<AuiCard>(html`<aui-card heading="A"></aui-card>`);
      await hover(el);
      expect(base(el).matches(':hover'), 'pointer is over the card').to.be.true;
      expect(getComputedStyle(base(el)).transform).to.equal('none');
    });

    it('does not move when the user prefers reduced motion', async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
      const el = await fixture<AuiCard>(html`<aui-card heading="A" href="/a"></aui-card>`);
      await hover(el);
      expect(base(el).matches(':hover'), 'pointer is over the card').to.be.true;
      expect(getComputedStyle(base(el)).transform).to.equal('none');
    });

    it('keeps an amber border on hovered HOT cards instead of the brand colour', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="display: grid; gap: 40px">
          <aui-card heading="Plain" href="/a"></aui-card>
          <aui-card heading="Hot" href="/b" hot></aui-card>
        </div>
      `);
      const [plain, hot] = [...wrapper.querySelectorAll('aui-card')] as AuiCard[];
      for (const el of [plain, hot]) base(el).style.transition = 'none';

      await hover(plain);
      const brandBorder = getComputedStyle(base(plain)).borderTopColor;
      await hover(hot);
      expect(base(hot).matches(':hover'), 'pointer is over the HOT card').to.be.true;
      const hotBorder = getComputedStyle(base(hot)).borderTopColor;
      expect(hotBorder).to.not.equal(brandBorder);
      expect(hotBorder).to.equal('rgb(245, 158, 11)');
    });
  });

  describe('.card-grid (styles.css)', () => {
    before(async () => {
      // .card-grid 由全域樣式提供，需先執行 pnpm build 產生 dist/styles.css
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/dist/styles.css';
      document.head.appendChild(link);
      await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = () => reject(new Error('無法載入 /dist/styles.css，請先執行 pnpm build'));
      });
    });

    const longWord = 'averyveryverylongunbrokenidentifierthatcannotwrapnormally'.repeat(3);

    async function grid(width: number): Promise<HTMLElement> {
      return fixture<HTMLElement>(html`
        <ul class="card-grid" style="width: ${width}px">
          ${[1, 2, 3, 4, 5, 6, 7, 8].map(
            (n) => html`
              <li>
                <aui-card
                  heading=${n === 1 ? longWord : `Tool ${n}`}
                  description=${n === 2 ? longWord : 'Description'}
                  href="/tool"
                ></aui-card>
              </li>
            `,
          )}
        </ul>
      `);
    }

    const columnCount = (el: HTMLElement) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length;

    // 欄寬下限 270px、間距 16px：n 欄需要 270n + 16(n - 1)
    const expectations: [width: number, columns: number][] = [
      [1200, 4],
      [900, 3],
      [600, 2],
      [400, 1],
      [200, 1],
    ];

    for (const [width, columns] of expectations) {
      it(`lays out ${columns} column(s) in a ${width}px container without overflowing`, async () => {
        const el = await grid(width);
        expect(columnCount(el)).to.equal(columns);

        // 每一欄等寬並填滿容器
        const first = el.firstElementChild!.getBoundingClientRect();
        expect(first.width).to.be.closeTo((width - 16 * (columns - 1)) / columns, 0.5);

        // 無橫向溢位：格線與每張卡片都不超出容器
        expect(el.scrollWidth).to.be.at.most(el.clientWidth);
        const right = el.getBoundingClientRect().right;
        for (const card of el.querySelectorAll('aui-card')) {
          expect(card.getBoundingClientRect().right).to.be.at.most(right + 0.5);
          const inner = base(card as AuiCard);
          expect(inner.scrollWidth, 'card content overflow').to.be.at.most(inner.clientWidth);
        }
      });
    }

    it('does not stretch cards stacked in a fixed-height container outside the grid', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="height: 400px; overflow: auto">
          <aui-card heading="One"></aui-card>
          <aui-card heading="Two"></aui-card>
        </div>
      `);
      for (const card of wrapper.querySelectorAll('aui-card')) {
        expect(card.getBoundingClientRect().height).to.be.below(100);
      }
    });

    it('stretches cards in the same row to equal height', async () => {
      const el = await grid(600);
      const [a, b] = [...el.querySelectorAll('aui-card')].map((card) =>
        base(card as AuiCard).getBoundingClientRect(),
      );
      expect(a.top).to.equal(b.top);
      expect(a.height).to.be.closeTo(b.height, 0.5);
    });

    it('reflows when the container is resized', async () => {
      const el = await grid(1200);
      expect(columnCount(el)).to.equal(4);
      el.style.width = '500px';
      expect(columnCount(el)).to.equal(1);
      expect(el.scrollWidth).to.be.at.most(el.clientWidth);
    });
  });
});
