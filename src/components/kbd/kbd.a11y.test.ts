import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiKbd } from './kbd.js';

const sample = () => html`
  <p style="font-size: 14px">
    按下 <aui-kbd>Ctrl</aui-kbd> + <aui-kbd>C</aui-kbd> 複製，或以
    <aui-kbd label="Command">⌘</aui-kbd> <aui-kbd>K</aui-kbd> 開啟指令面板。
    <aui-kbd size="sm">Esc</aui-kbd> 關閉。
  </p>
`;

describe('AuiKbd Accessibility (<aui-kbd>)', () => {
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
      await expect(await fixture(sample())).to.be.accessible();
    });

    it('passes axe audit in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        await expect(await fixture(sample())).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });

    it('passes axe audit on a raised surface (--color-base) in both themes', async () => {
      for (const theme of ['light', 'dark'] as const) {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        try {
          const el = await fixture(html`
            <div style="padding: 8px; background-color: var(--color-base)">${sample()}</div>
          `);
          await expect(el).to.be.accessible();
        } finally {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
  });

  describe('semantics', () => {
    it('contributes the key text to the accessible name of a containing control', async () => {
      const button = await fixture<HTMLButtonElement>(
        html`<button>Search <aui-kbd>K</aui-kbd></button>`,
      );
      expect((await getAxNode(button)).name.replace(/\s+/g, ' ')).to.equal('Search K');
    });

    it('reads the label instead of the symbol when label is set', async () => {
      // 以瀏覽器計算的名稱驗證：外層控制項讀到的是 label，而不是符號
      const button = await fixture<HTMLButtonElement>(
        html`<button>Search <aui-kbd label="Command K">⌘K</aui-kbd></button>`,
      );
      const name = (await getAxNode(button)).name.replace(/\s+/g, ' ');
      expect(name).to.equal('Search Command K');
      expect(name).to.not.contain('⌘');
    });

    it('exposes a labelled keycap as an image named by the label', async () => {
      const el = await fixture<AuiKbd>(html`<aui-kbd label="Command">⌘</aui-kbd>`);
      let node = await getAxNode(el);
      expect(node.role).to.equal('image');
      expect(node.name).to.equal('Command');

      // 移除 label 後恢復為一般文字
      el.label = '';
      await el.updateComplete;
      node = await getAxNode(el);
      expect(node.role).to.not.equal('image');
      const button = await fixture<HTMLButtonElement>(
        html`<button>Press <aui-kbd label="">K</aui-kbd></button>`,
      );
      expect((await getAxNode(button)).name.replace(/\s+/g, ' ')).to.equal('Press K');
    });

    it('treats a whitespace-only label as not set', async () => {
      const button = await fixture<HTMLButtonElement>(
        html`<button>Press <aui-kbd label="  ">K</aui-kbd></button>`,
      );
      expect((await getAxNode(button)).name.replace(/\s+/g, ' ')).to.equal('Press K');
    });

    it('is not focusable and adds no tab stop', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-kbd>K</aui-kbd>
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
