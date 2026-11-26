import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import './index.js';
import type { AuiCodeView } from './code-view.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';

const JSON_CODE = JSON.stringify(
  { name: 'anchor', deps: { lit: '^3', floating: ['dom'] } },
  null,
  2,
);
// {                   1
//   "name": "anchor", 2
//   "deps": {         3
//     "lit": "^3",    4
//     "floating": [   5
//       "dom"         6
//     ]               7
//   }                 8
// }                   9

const base = (el: AuiCodeView) => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;
const numbers = (el: AuiCodeView) =>
  [...el.shadowRoot!.querySelectorAll('[part="line-number"]')].map((n) => Number(n.textContent));
const foldButton = (el: AuiCodeView, line: number) =>
  el.shadowRoot!.querySelector<HTMLButtonElement>(`[part="fold-button"][data-line="${line - 1}"]`)!;

async function render(code: string, style = ''): Promise<AuiCodeView> {
  const el = await fixture<AuiCodeView>(
    html`<aui-code-view .code=${code} style=${style}></aui-code-view>`,
  );
  await el.updateComplete;
  return el;
}

/** 產生超過一萬行的 JSON */
function bigJson(): string {
  const items = Array.from({ length: 1700 }, (_, i) => ({
    id: i,
    name: `item-${i}`,
    tags: ['a', 'b'],
  }));
  return JSON.stringify(items, null, 2);
}

describe('AuiCodeView (<aui-code-view>)', () => {
  describe('rendering', () => {
    it('renders each line with its number, keeping empty lines and indentation', async () => {
      const el = await render('a\n\n  b\n');
      expect(numbers(el)).to.deep.equal([1, 2, 3]);
      const code = [...el.shadowRoot!.querySelectorAll('[part="code"]')].map((c) => c.textContent);
      expect(code).to.deep.equal(['a', '', '  b']);
      // 空白行仍有一行的高度
      const lines = el.shadowRoot!.querySelectorAll<HTMLElement>('[part="line"]');
      expect(lines[1].getBoundingClientRect().height).to.equal(
        lines[0].getBoundingClientRect().height,
      );
    });

    it('reads the code attribute', async () => {
      const el = await fixture<AuiCodeView>(html`<aui-code-view code="x = 1"></aui-code-view>`);
      expect(numbers(el)).to.deep.equal([1]);
    });

    it('is a focusable, labelled region', async () => {
      const el = await render('a');
      expect(base(el).getAttribute('role')).to.equal('region');
      expect(base(el).getAttribute('aria-label')).to.equal('程式碼');
      expect(base(el).tabIndex).to.equal(0);
      el.label = 'Output';
      await el.updateComplete;
      expect(base(el).getAttribute('aria-label')).to.equal('Output');
    });

    it('copies only the code: line numbers and fold buttons are not selectable', async () => {
      const el = await render(JSON_CODE);
      const selection = getSelection()!;
      selection.selectAllChildren(el.shadowRoot!.querySelector('.code-view__content')!);
      const copied = selection.toString().replace(/\n+$/, '');
      selection.removeAllRanges();
      expect(copied.split('\n').map((line) => line.trimEnd())).to.deep.equal(JSON_CODE.split('\n'));
    });
  });

  describe('copying', () => {
    /** 對檢視區分派 copy 事件，回傳元件寫入剪貼簿的文字（未攔截時為 null） */
    function copy(el: AuiCodeView): string | null {
      const event = new ClipboardEvent('copy', {
        clipboardData: new DataTransfer(),
        bubbles: true,
        cancelable: true,
      });
      base(el).dispatchEvent(event);
      return event.defaultPrevented ? event.clipboardData!.getData('text/plain') : null;
    }
    const content = (el: AuiCodeView) => el.shadowRoot!.querySelector('.code-view__content')!;
    const codeText = (el: AuiCodeView, line: number) =>
      [...el.shadowRoot!.querySelectorAll('[part="code"]')[line - 1].childNodes].find(
        (node) => node.nodeType === Node.TEXT_NODE,
      )!;

    afterEach(() => getSelection()!.removeAllRanges());

    it('keeps blank lines', async () => {
      const code = 'a\n\n  b\n\n\nc';
      const el = await render(code);
      getSelection()!.selectAllChildren(content(el));
      expect(copy(el)).to.equal(code);
    });

    it('includes the lines of folded blocks inside the selection', async () => {
      const el = await render(JSON_CODE);
      foldButton(el, 3).click();
      await el.updateComplete;
      getSelection()!.selectAllChildren(content(el));
      expect(copy(el)).to.equal(JSON_CODE);
    });

    it('copies a partial selection from the original text', async () => {
      const el = await render('alpha\nbravo\ncharlie');
      getSelection()!.setBaseAndExtent(codeText(el, 1), 2, codeText(el, 3), 4);
      expect(copy(el)).to.equal('pha\nbravo\nchar');
    });

    it('leaves the copy to the browser when nothing inside is selected', async () => {
      const el = await render('alpha');
      expect(copy(el)).to.be.null;
    });
  });

  describe('sticky line numbers', () => {
    it('keeps the gutter in place while scrolling horizontally', async () => {
      const el = await render(`short\n${'x'.repeat(400)}`, 'width: 300px');
      const scroller = base(el);
      expect(scroller.scrollWidth).to.be.above(scroller.clientWidth);
      const gutter = el.shadowRoot!.querySelector<HTMLElement>('[part="gutter"]')!;
      const before = gutter.getBoundingClientRect().left;

      scroller.scrollLeft = 500;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(gutter.getBoundingClientRect().left).to.equal(before);
      const code = el.shadowRoot!.querySelectorAll<HTMLElement>('[part="code"]')[1];
      expect(code.getBoundingClientRect().left, 'the code scrolled').to.be.below(before);
    });

    it('scrolls inside its own box when placed in a flex or grid container', async () => {
      for (const display of ['flex', 'grid']) {
        const wrapper = await fixture<HTMLDivElement>(html`
          <div style="display: ${display}; width: 300px">
            <aui-code-view .code=${'z'.repeat(400)} style="flex: 1"></aui-code-view>
          </div>
        `);
        const el = wrapper.querySelector<AuiCodeView>('aui-code-view')!;
        await el.updateComplete;
        expect(el.getBoundingClientRect().width, display).to.equal(300);
        expect(base(el).scrollWidth, display).to.be.above(base(el).clientWidth);
      }
    });

    it('does not clip the end of the longest line', async () => {
      const el = await render(`${'中'.repeat(50)}\t${'y'.repeat(300)}`, 'width: 300px');
      const scroller = base(el);
      scroller.scrollLeft = scroller.scrollWidth;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const code = el.shadowRoot!.querySelector<HTMLElement>('[part="code"]')!;
      const content = el.shadowRoot!.querySelector<HTMLElement>('.code-view__content')!;
      // 內容寬度（分段的繪製範圍）涵蓋整行文字
      expect(content.getBoundingClientRect().right).to.be.at.least(
        code.getBoundingClientRect().right - 14,
      );
    });
  });

  describe('folding', () => {
    it('offers fold buttons on lines followed by deeper indentation', async () => {
      const el = await render(JSON_CODE);
      const lines = [...el.shadowRoot!.querySelectorAll<HTMLElement>('[part="fold-button"]')].map(
        (b) => Number(b.dataset.line) + 1,
      );
      expect(lines).to.deep.equal([1, 3, 5]);
      const button = foldButton(el, 3);
      expect(button.getAttribute('aria-expanded')).to.equal('true');
      expect(button.getAttribute('aria-label')).to.equal('第 3–7 行');
    });

    it('collapses and expands a block, showing a placeholder while collapsed', async () => {
      const el = await render(JSON_CODE);
      foldButton(el, 3).click();
      await el.updateComplete;
      expect(numbers(el)).to.deep.equal([1, 2, 3, 8, 9]);
      expect(foldButton(el, 3).getAttribute('aria-expanded')).to.equal('false');
      expect(el.shadowRoot!.querySelectorAll('[part="fold-placeholder"]')).to.have.length(1);

      foldButton(el, 3).click();
      await el.updateComplete;
      expect(numbers(el)).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(el.shadowRoot!.querySelector('[part="fold-placeholder"]')).to.be.null;
    });

    it('keeps inner fold state when an outer block is collapsed and expanded again', async () => {
      const el = await render(JSON_CODE);
      foldButton(el, 5).click();
      await el.updateComplete;
      foldButton(el, 1).click();
      await el.updateComplete;
      expect(numbers(el)).to.deep.equal([1, 9]);
      foldButton(el, 1).click();
      await el.updateComplete;
      // 第 5 行的區塊（第 5–6 行）仍維持摺疊
      expect(numbers(el)).to.deep.equal([1, 2, 3, 4, 5, 7, 8, 9]);
    });

    it('moves focus to a visible fold button when foldAll() hides the focused one', async () => {
      const el = await render(JSON_CODE);
      foldButton(el, 5).focus();
      el.foldAll();
      await el.updateComplete;
      expect(getDeepActiveElement() === foldButton(el, 1)).to.be.true;
    });

    it('accepts non-string code values from frameworks', async () => {
      const el = await render('a');
      el.code = null as never;
      await el.updateComplete;
      expect(numbers(el)).to.deep.equal([]);
      el.code = 42 as never;
      await el.updateComplete;
      expect(numbers(el)).to.deep.equal([1]);
    });

    it('folds and unfolds everything, and resets when the code changes', async () => {
      const el = await render(JSON_CODE);
      el.foldAll();
      await el.updateComplete;
      expect(numbers(el)).to.deep.equal([1, 9]);
      el.unfoldAll();
      await el.updateComplete;
      expect(numbers(el)).to.have.length(9);

      el.foldAll();
      await el.updateComplete;
      el.code = `${JSON_CODE}\n`;
      await el.updateComplete;
      expect(numbers(el)).to.have.length(9);
    });
  });

  describe('keyboard', () => {
    it('tabs to the scroll region, then to a single fold button; arrows move between fold buttons', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">before</button><aui-code-view .code=${JSON_CODE}></aui-code-view>
        </div>
      `);
      const el = wrapper.querySelector<AuiCodeView>('aui-code-view')!;
      await el.updateComplete;
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement() === base(el), 'scroll region').to.be.true;
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement() === foldButton(el, 1), 'first fold button').to.be.true;

      await sendKeys({ press: 'ArrowDown' });
      expect(getDeepActiveElement() === foldButton(el, 3)).to.be.true;
      await sendKeys({ press: 'End' });
      expect(getDeepActiveElement() === foldButton(el, 5)).to.be.true;
      await sendKeys({ press: 'Home' });
      expect(getDeepActiveElement() === foldButton(el, 1)).to.be.true;

      // 只有一個摺疊鈕在 Tab 順序上：再按 Tab 就離開元件
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;
      const tabbable = el.shadowRoot!.querySelectorAll('[part="fold-button"][tabindex="0"]');
      expect(tabbable).to.have.length(1);
      expect(tabbable[0] === foldButton(el, 3)).to.be.true;

      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      expect(foldButton(el, 3).getAttribute('aria-expanded')).to.equal('false');
      expect(getDeepActiveElement() === foldButton(el, 3), 'focus stays on the button').to.be.true;
    });

    it('keeps a fold button tabbable when the active one is hidden by an outer fold', async () => {
      const el = await render(JSON_CODE);
      foldButton(el, 5).click();
      await el.updateComplete;
      el.foldAll();
      await el.updateComplete;
      const tabbable = el.shadowRoot!.querySelectorAll('[part="fold-button"][tabindex="0"]');
      expect(tabbable).to.have.length(1);
      expect(tabbable[0] === foldButton(el, 1)).to.be.true;
    });
  });

  describe('ten thousand lines', () => {
    it('folding only touches the chunk it happens in', async () => {
      // 分段依原始行號劃分：在開頭摺疊時，後面分段的 DOM 節點與內容都不變
      const blocks = Array.from({ length: 150 }, (_, i) => `block ${i}\n  a\n  b\n  c`);
      const el = await fixture<AuiCodeView>(html`<aui-code-view></aui-code-view>`);
      el.code = blocks.join('\n');
      await el.updateComplete;
      const chunks = () => [...el.shadowRoot!.querySelectorAll<HTMLElement>('.code-view__chunk')];
      const before = chunks();
      expect(before.length).to.equal(3);
      const firstLines = before.map((chunk) => chunk.firstElementChild);
      const texts = before.map((chunk) => chunk.textContent);

      el.shadowRoot!.querySelector<HTMLButtonElement>('.code-view__fold')!.click();
      await el.updateComplete;
      const after = chunks();
      expect(after.length).to.equal(3);
      expect(after[0].textContent).to.not.equal(texts[0]);
      for (const i of [1, 2]) {
        expect(after[i] === before[i], `chunk ${i} element is reused`).to.be.true;
        expect(after[i].firstElementChild === firstLines[i], `chunk ${i} lines stay`).to.be.true;
        expect(after[i].textContent, `chunk ${i} content`).to.equal(texts[i]);
      }

      // 整段都被摺疊時該分段消失，其餘分段仍是原本的節點
      el.foldAll();
      el.unfoldAll();
      await el.updateComplete;
      expect(chunks().length).to.equal(3);
    });

    it('renders every line but skips the layout of off-screen chunks', async () => {
      const code = bigJson();
      const total = code.split('\n').length;
      expect(total).to.be.above(10000);

      const start = performance.now();
      const el = await render(code, 'height: 400px');
      base(el).style.maxHeight = '400px';
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const elapsed = performance.now() - start;
      console.log(`[code-view] ${total} lines rendered in ${Math.round(elapsed)} ms`);

      expect(el.shadowRoot!.querySelectorAll('[part="line"]')).to.have.length(total);
      const chunks = [...el.shadowRoot!.querySelectorAll<HTMLElement>('.code-view__chunk')];
      expect(chunks.length).to.equal(Math.ceil(total / 200));
      // 被略過的是分段的內容（分段本身仍有估計的大小），因此檢查分段內的行
      const skipped = chunks.filter(
        (chunk) => !chunk.firstElementChild!.checkVisibility({ contentVisibilityAuto: true }),
      );
      expect(skipped.length, 'off-screen chunks are skipped').to.be.above(chunks.length - 5);

      // 捲到底部：估計高度讓捲動範圍正確，最後一行的行號就在檢視區內
      const scroller = base(el);
      expect(scroller.scrollHeight).to.be.above(total * 15);
      scroller.scrollTop = scroller.scrollHeight;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      scroller.scrollTop = scroller.scrollHeight;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      // 捲動的幀時間：每幀捲動一段，從頂端捲到底部，記錄相鄰兩幀的間隔
      scroller.scrollTop = 0;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const frames: number[] = [];
      const steps = 120;
      let previous = performance.now();
      for (let step = 1; step <= steps; step++) {
        scroller.scrollTop = (scroller.scrollHeight * step) / steps;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const now = performance.now();
        frames.push(now - previous);
        previous = now;
      }
      frames.sort((a, b) => a - b);
      const average = frames.reduce((sum, ms) => sum + ms, 0) / frames.length;
      const p95 = frames[Math.floor(steps * 0.95)];
      console.log(
        `[code-view] scroll ${steps} frames: avg ${average.toFixed(1)} ms, p95 ${p95.toFixed(1)} ms, max ${frames[steps - 1].toFixed(1)} ms`,
      );
      scroller.scrollTop = scroller.scrollHeight;
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const numbersEls = el.shadowRoot!.querySelectorAll<HTMLElement>('[part="line-number"]');
      const last = numbersEls[numbersEls.length - 1];
      const box = scroller.getBoundingClientRect();
      const lastBox = last.getBoundingClientRect();
      expect(lastBox.bottom).to.be.at.most(box.bottom + 1);
      expect(lastBox.top).to.be.at.least(box.top);
    });

    it('folds a block in ten thousand lines quickly', async () => {
      const el = await render(bigJson(), 'height: 400px');
      const start = performance.now();
      foldButton(el, 2).click();
      await el.updateComplete;
      // 算到下一幀繪製完成（含樣式、排版與繪製）
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
      const elapsed = performance.now() - start;
      console.log(`[code-view] fold in 10k lines: ${Math.round(elapsed)} ms`);
      // 第 2–8 行為第一個物件
      expect(numbers(el).slice(0, 3)).to.deep.equal([1, 2, 9]);
    });
  });
});
