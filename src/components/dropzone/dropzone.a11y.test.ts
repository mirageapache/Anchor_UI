import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import './index.js';
import type { AuiDropzone } from './dropzone.js';

const zone = (el: AuiDropzone) => el.shadowRoot!.querySelector<HTMLButtonElement>('.dropzone')!;
const input = (el: AuiDropzone) => el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
const error = (el: AuiDropzone) => el.shadowRoot!.querySelector<HTMLElement>('.dropzone__error')!;

function fileDrag(type: string, files: File[]): DragEvent {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  return new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true });
}

const textFile = () => new File(['hello'], 'notes.txt', { type: 'text/plain' });
const jsonFile = () => new File(['{}'], 'data.json', { type: 'application/json' });

/** 各種狀態：預設、格式提示、自訂內容、停用、拖曳中、錯誤 */
async function states(): Promise<HTMLElement> {
  const wrapper = await fixture<HTMLElement>(html`
    <div style="display: grid; gap: 16px; width: 420px">
      <aui-dropzone></aui-dropzone>
      <aui-dropzone accept=".json,image/*" multiple></aui-dropzone>
      <aui-dropzone accept=".csv">
        拖放 CSV 檔案
        <span slot="hint">最大 5 MB</span>
      </aui-dropzone>
      <aui-dropzone disabled></aui-dropzone>
      <aui-dropzone id="dragging"></aui-dropzone>
      <aui-dropzone id="error" accept=".json"></aui-dropzone>
    </div>
  `);
  const dragging = wrapper.querySelector<AuiDropzone>('#dragging')!;
  zone(dragging).style.transition = 'none';
  zone(dragging).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
  const failed = wrapper.querySelector<AuiDropzone>('#error')!;
  zone(failed).dispatchEvent(fileDrag('drop', [textFile()]));
  await dragging.updateComplete;
  await failed.updateComplete;
  return wrapper;
}

describe('AuiDropzone Accessibility (<aui-dropzone>)', () => {
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
    it('passes axe audit for every state in light theme', async () => {
      await expect(await states()).to.be.accessible();
    });

    it('passes axe audit for every state in dark theme', async () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        await expect(await states()).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('contrast on a raised dark surface', () => {
    it('passes axe audit while dragging inside a --color-base container (card / modal)', async () => {
      // 拖曳時的底色是半透明的琥珀色，實際對比取決於元件背後的顏色
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        const wrapper = await fixture<HTMLElement>(html`
          <div style="padding: 16px; width: 420px; background-color: var(--color-base)">
            <aui-dropzone accept=".json"></aui-dropzone>
          </div>
        `);
        const el = wrapper.querySelector('aui-dropzone')!;
        zone(el).style.transition = 'none';
        zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
        await el.updateComplete;
        expect(zone(el).classList.contains('is-dragging')).to.be.true;
        await expect(wrapper).to.be.accessible();
      } finally {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });

  describe('semantics', () => {
    it('exposes a button named by the prompt and described by the format hint', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone accept=".json"></aui-dropzone>`);
      const node = await getAxNode(zone(el));
      expect(node.role).to.equal('button');
      expect(node.name).to.equal('拖放檔案到此處，或點擊選擇檔案');
      expect(node.description).to.equal('支援格式：.json');
    });

    it('uses slotted prompt and hint for the name and description', async () => {
      const el = await fixture<AuiDropzone>(html`
        <aui-dropzone>
          拖放 CSV 檔案
          <span slot="hint">最大 5 MB</span>
        </aui-dropzone>
      `);
      const node = await getAxNode(zone(el));
      expect(node.name).to.equal('拖放 CSV 檔案');
      expect(node.description).to.equal('最大 5 MB');
    });

    it('announces rejections through an assertive live region and adds them to the description', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone accept=".json"></aui-dropzone>`);
      // live region 在訊息出現前就已存在於無障礙樹中，之後的內容變更才會被播報
      const before = await getAxNode(error(el));
      expect(before.role).to.equal('alert');
      expect(before.ignored).to.be.false;

      zone(el).dispatchEvent(fileDrag('drop', [textFile()]));
      await el.updateComplete;
      const alert = await getAxNode(error(el));
      expect(alert.role).to.equal('alert');
      expect(alert.live).to.equal('assertive');
      expect((await getAxNode(zone(el))).description).to.equal(
        '支援格式：.json 不支援的檔案格式：notes.txt',
      );
    });

    it('hides the native file input and the decorative icon from assistive technology', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      expect((await getAxNode(input(el))).ignored).to.be.true;
      const icon = el.shadowRoot!.querySelector('.dropzone__icon')!;
      expect(icon.getAttribute('aria-hidden')).to.equal('true');
    });

    it('disables the native button and reflects the attribute on the host', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone disabled></aui-dropzone>`);
      expect(zone(el).disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('keyboard', () => {
    it('is reachable with Tab (one stop), shows a focus ring and opens the picker with Enter and Space', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-dropzone></aui-dropzone>
          <button id="after">After</button>
        </div>
      `);
      const el = wrapper.querySelector('aui-dropzone')!;
      let opened = 0;
      input(el).click = () => opened++; // 不實際開啟系統對話框
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === el, 'dropzone focused').to.be.true;
      expect(el.shadowRoot!.activeElement === zone(el), 'button focused').to.be.true;
      expect(getComputedStyle(zone(el)).outlineStyle).to.equal('solid');

      await sendKeys({ press: 'Enter' });
      expect(opened).to.equal(1);
      await sendKeys({ press: 'Space' });
      expect(opened).to.equal(2);

      // 原生 input 不佔 Tab 順序
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#after'), 'after focused').to.be
        .true;
    });

    it('skips a disabled dropzone in the Tab order', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <button id="before">Before</button>
          <aui-dropzone disabled></aui-dropzone>
          <button id="after">After</button>
        </div>
      `);
      wrapper.querySelector<HTMLButtonElement>('#before')!.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement === wrapper.querySelector('#after'), 'after focused').to.be
        .true;
    });

    it('focuses the button through host.focus()', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      el.focus();
      expect(el.shadowRoot!.activeElement === zone(el), 'button focused').to.be.true;
    });
  });
});
