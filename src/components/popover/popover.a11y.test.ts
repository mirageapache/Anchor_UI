import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import './index.js';
import '../button/index.js';
import '../icon-button/index.js';
import type { AuiPopover } from './popover.js';
import { getAxNode } from '../../test-utils/ax.js';

const panelOf = (el: AuiPopover) => el.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;
const innerButton = (host: Element) => host.shadowRoot!.querySelector('button')!;

/** 導覽列的通知清單：圖示按鈕觸發，面板內為連結清單 */
const notifications = () => html`
  <div style="padding: 24px;">
    <aui-popover label="通知">
      <aui-icon-button slot="trigger" preset="more" label="通知"></aui-icon-button>
      <ul style="margin: 0; padding: 0; list-style: none;">
        <li><a href="#build">建置完成：v1.1.0</a></li>
        <li><a href="#review">有 2 個待審查的 PR</a></li>
      </ul>
    </aui-popover>
  </div>
`;

async function open(el: AuiPopover): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.show();
  await shown;
}

describe('AuiPopover Accessibility (<aui-popover>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
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

  after(() => emulateMedia({ reducedMotion: 'no-preference' }));

  describe('axe-core automated WCAG audit', () => {
    it('passes axe audit when closed and open, in light theme', async () => {
      const wrapper = await fixture<HTMLElement>(notifications());
      await expect(wrapper).to.be.accessible();
      await open(wrapper.querySelector('aui-popover')!);
      await expect(wrapper).to.be.accessible();
    });

    it('passes axe audit when open in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const wrapper = await fixture<HTMLElement>(notifications());
        await open(wrapper.querySelector('aui-popover')!);
        await expect(wrapper).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('trigger semantics (disclosure of a dialog)', () => {
    it('exposes expanded and haspopup on the focusable inner button of a library trigger', async () => {
      const wrapper = await fixture<HTMLElement>(notifications());
      const el = wrapper.querySelector<AuiPopover>('aui-popover')!;
      const trigger = el.querySelector('aui-icon-button')!;
      await trigger.updateComplete;

      let node = await getAxNode(innerButton(trigger));
      expect(node.role).to.equal('button');
      expect(node.name).to.equal('通知');
      expect(node.properties.hasPopup).to.equal('dialog');
      expect(node.properties.expanded).to.equal(false);
      // aria-controls 指向 Popover（瀏覽器實際解析到的節點數）
      expect(node.properties.controls).to.equal(1);

      await open(el);
      await trigger.updateComplete;
      node = await getAxNode(innerButton(trigger));
      expect(node.properties.expanded).to.equal(true);
    });

    it('exposes the same states on a native button trigger', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover><button slot="trigger">Account</button><a href="#me">Profile</a></aui-popover>
      `);
      await open(el);
      const node = await getAxNode(el.querySelector('button')!);
      expect(node.properties.hasPopup).to.equal('dialog');
      expect(node.properties.expanded).to.equal(true);
      expect(node.properties.controls).to.equal(1);
    });

    it('does not put ARIA states on the role-less host of a library trigger', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover
          ><aui-button slot="trigger">Account</aui-button>
          <p>Body</p></aui-popover
        >
      `);
      const host = el.querySelector('aui-button')!;
      expect(host.hasAttribute('aria-expanded')).to.be.false;
      expect(host.hasAttribute('aria-haspopup')).to.be.false;
    });
  });

  describe('panel semantics', () => {
    it('is a non-modal dialog named by the label', async () => {
      const wrapper = await fixture<HTMLElement>(notifications());
      const el = wrapper.querySelector<AuiPopover>('aui-popover')!;
      await open(el);
      const node = await getAxNode(panelOf(el));
      expect(node.role).to.equal('dialog');
      expect(node.name).to.equal('通知');
      expect(node.properties.modal ?? false).to.equal(false);
    });

    it('is named by the trigger when no label is set', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover
          ><aui-button slot="trigger">Account</aui-button>
          <p>Body</p></aui-popover
        >
      `);
      await open(el);
      const node = await getAxNode(panelOf(el));
      expect(node.role).to.equal('dialog');
      expect(node.name).to.equal('Account');
    });

    it('takes a clean name from an icon button trigger without a label', async () => {
      const el = await fixture<AuiPopover>(html`
        <aui-popover>
          <aui-icon-button slot="trigger" preset="more" label="更多操作"></aui-icon-button>
          <button>Edit</button>
        </aui-popover>
      `);
      await open(el);
      const node = await getAxNode(panelOf(el));
      expect(node.name).to.equal('更多操作');
    });

    it('hides the closed panel from assistive technology', async () => {
      const wrapper = await fixture<HTMLElement>(notifications());
      const node = await getAxNode(panelOf(wrapper.querySelector('aui-popover')!));
      expect(node.ignored).to.be.true;
    });
  });
});
