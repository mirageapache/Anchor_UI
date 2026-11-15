import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiAccordion } from './accordion.js';

const summary = (el: AuiAccordion) => el.shadowRoot!.querySelector('summary')!;

const sample = () => html`
  <div style="display: grid; gap: 12px; width: 480px">
    <aui-accordion heading="使用說明" open>
      <p>貼上 JSON 後按下格式化。</p>
      <ul>
        <li>支援最大 5 MB 的文件</li>
        <li>所有運算皆在瀏覽器內完成</li>
      </ul>
    </aui-accordion>
    <aui-accordion heading="限制規範"><p>不支援 JSON5。</p></aui-accordion>
    <aui-accordion heading="資料會上傳嗎？" variant="faq" name="faq" open>
      <p>不會，所有運算皆在本機完成。</p>
    </aui-accordion>
    <aui-accordion heading="支援哪些瀏覽器？" variant="faq" name="faq">
      <p>最新兩個版本的 Chrome、Edge、Firefox 與 Safari。</p>
    </aui-accordion>
  </div>
`;

describe('AuiAccordion Accessibility (<aui-accordion>)', () => {
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
    it('passes axe audit for doc and faq layouts, open and closed, in light theme', async () => {
      const el = await fixture(sample());
      await expect(el).to.be.accessible();
    });

    it('passes axe audit in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const el = await fixture(sample());
        await expect(el).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('semantics', () => {
    it('exposes the summary as a disclosure control named by the heading', async () => {
      const el = await fixture<AuiAccordion>(
        html`<aui-accordion heading="使用說明"><p>Body</p></aui-accordion>`,
      );
      const node = await getAxNode(summary(el));
      expect(node.role).to.equal('DisclosureTriangle');
      expect(node.name).to.equal('使用說明');
      expect(node.ignored).to.be.false;
    });

    it('names the control from a slotted heading and ignores the decorative arrow', async () => {
      const el = await fixture<AuiAccordion>(html`
        <aui-accordion><span slot="heading">Slotted heading</span></aui-accordion>
      `);
      const node = await getAxNode(summary(el));
      expect(node.name).to.equal('Slotted heading');
      expect(
        el.shadowRoot!.querySelector('.accordion__icon')!.getAttribute('aria-hidden'),
      ).to.equal('true');
    });

    it('hides collapsed content from assistive technology and exposes it when open', async () => {
      const el = await fixture<AuiAccordion>(html`
        <aui-accordion heading="A"><p id="content">Hidden until opened</p></aui-accordion>
      `);
      const content = el.querySelector('#content')!;
      expect((await getAxNode(content)).ignored, 'collapsed').to.be.true;

      el.open = true;
      await el.updateComplete;
      expect((await getAxNode(content)).ignored, 'expanded').to.be.false;
    });
  });

  describe('keyboard', () => {
    it('is reachable with Tab, shows a focus ring and does not trap focus', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-accordion heading="A"
            ><p><a id="inner" href="#x">Link inside</a></p></aui-accordion
          >
          <button id="after">After</button>
        </div>
      `);
      const el = wrapper.querySelector('aui-accordion')!;
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === el, 'accordion focused').to.be.true;
      expect(getComputedStyle(summary(el)).outlineStyle).to.equal('solid');

      // 收合時內容中的連結不可聚焦
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#after'), 'skips hidden link').to.be
        .true;
    });

    it('reaches content inside an open accordion with Tab', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-accordion heading="A"
            ><p><a id="inner" href="#x">Link inside</a></p></aui-accordion
          >
        </div>
      `);
      const el = wrapper.querySelector('aui-accordion')!;
      el.focus();
      setTimeout(() => sendKeys({ press: 'Enter' }));
      await oneEvent(el, 'aui-toggle');

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#inner'), 'inner link focused').to.be
        .true;
    });
  });
});
