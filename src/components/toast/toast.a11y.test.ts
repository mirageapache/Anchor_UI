import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, sendKeys } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import { ToastService } from './toast-service.js';
import type { AuiToast } from './toast.js';
import '../modal/index.js';
import type { AuiModal } from '../modal/modal.js';

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
// Viewport 會在 Modal 開啟期間移入其子樹，document.querySelector 找不到，因此保留最後一次的參照
let lastViewport: HTMLElement | null = null;
const viewportEl = () =>
  (lastViewport =
    document.querySelector<HTMLElement>('[data-aui-toast-viewport]') ?? lastViewport)!;
const toasts = () => [...viewportEl().querySelectorAll<AuiToast>('aui-toast')];
const part = (toast: AuiToast, name: string) =>
  toast.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`)!;

/** 穿透 Shadow DOM 取得實際持有焦點的元素 */
function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

async function openModal(content: ReturnType<typeof html>): Promise<AuiModal> {
  const modal = await fixture<AuiModal>(content);
  const shown = oneEvent(modal, 'aui-after-show');
  modal.open = true;
  await shown;
  return modal;
}

async function closeModal(modal: AuiModal): Promise<void> {
  if (!modal.open) return;
  const hidden = oneEvent(modal, 'aui-after-hide');
  await modal.hide();
  await hidden;
}

/** 等待通知渲染並填入 live region */
async function settled(): Promise<void> {
  await nextFrame();
  await nextFrame();
  await nextFrame();
  await Promise.all(toasts().map((toast) => toast.updateComplete));
}

function showAllVariants(): void {
  ToastService.configure({ maxVisible: 5 });
  ToastService.success('Saved', { title: 'Done', duration: 0 });
  ToastService.error('Upload failed', { duration: 0 });
  ToastService.warning('Disk almost full', { duration: 0 });
  ToastService.info('New version available', { duration: 0 });
  ToastService.loading('Uploading…', { duration: 0 });
}

describe('AuiToast Accessibility (<aui-toast>, ToastService)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
    if (!document.getElementById('aui-tokens')) {
      const link = document.createElement('link');
      link.id = 'aui-tokens';
      link.rel = 'stylesheet';
      link.href = '/dist/tokens.css';
      document.head.appendChild(link);

      // 與其他元件 a11y 測試一致：頁面底色跟隨主題，深色模式對比度檢測才會以深色底計算
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

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  afterEach(async () => {
    await ToastService.closeAll();
    ToastService.resetConfig();
    document.documentElement.removeAttribute('data-theme');
  });

  for (const theme of ['light', 'dark'] as const) {
    it(`passes axe audit with every variant (${theme})`, async () => {
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      showAllVariants();
      await settled();
      await expect(viewportEl()).to.be.accessible();
    });
  }

  it('exposes the viewport as a named region landmark', async () => {
    ToastService.info('Hello', { duration: 0 });
    await settled();
    const node = await getAxNode(viewportEl());
    expect(node.role).to.equal('region');
    expect(node.name).to.equal('通知');
  });

  it('announces errors through an alert region and others through status regions', async () => {
    showAllVariants();
    await settled();
    const roles = [];
    for (const toast of toasts()) {
      roles.push((await getAxNode(part(toast, 'content'))).role);
    }
    expect(roles).to.deep.equal(['status', 'alert', 'status', 'status', 'status']);
  });

  it('names the close button', async () => {
    ToastService.info('Hello', { duration: 0 });
    await settled();
    const node = await getAxNode(part(toasts()[0], 'close-button'));
    expect(node.role).to.equal('button');
    expect(node.name).to.equal('關閉通知');
  });

  describe('keyboard', () => {
    it('is reachable with Tab from the page', async () => {
      const button = await fixture<HTMLButtonElement>(html`<button>Page</button>`);
      ToastService.info('Hello', { duration: 0 });
      await settled();
      const close = part(toasts()[0], 'close-button');

      // Viewport 是 manual popover，依 DOM 位置排入循序焦點順序（固定在 <body> 下）；
      // 它可能在本測試的 fixture 之前或之後，依實際相對位置決定往前或往後一格
      const viewportFollows =
        button.compareDocumentPosition(viewportEl()) & Node.DOCUMENT_POSITION_FOLLOWING;
      button.focus();
      await sendKeys({ press: viewportFollows ? 'Tab' : 'Shift+Tab' });
      expect(deepActiveElement() === close, 'Tab reaches the toast close button').to.be.true;

      await sendKeys({ press: 'Enter' });
      await nextFrame();
      expect(toasts()).to.have.length(0);
    });

    it('is reachable with Tab inside an open modal, keeping focus within the modal', async () => {
      const modal = await openModal(html`
        <aui-modal heading="Editor">
          Body
          <button slot="footer">Save</button>
        </aui-modal>
      `);
      try {
        ToastService.info('Over the modal', { duration: 0 });
        await settled();
        const close = part(toasts()[0], 'close-button');
        const save = modal.querySelector('button')!;

        // overlay slot 位於面板之後：Tab 從面板最後一個控制項移到通知，Shift+Tab 回到面板
        save.focus();
        await sendKeys({ press: 'Tab' });
        expect(deepActiveElement() === close, 'Tab reaches the toast inside the modal').to.be.true;
        await sendKeys({ press: 'Shift+Tab' });
        expect(deepActiveElement() === save, 'Shift+Tab returns to the modal').to.be.true;
      } finally {
        await closeModal(modal);
      }
    });
  });

  describe('inside an open modal', () => {
    // Modal 開啟時頁面其餘部分為 inert，被 inert 的 live region 不會被播報；
    // 直接檢查 Chromium 的無障礙樹，確認通知仍是可讀取的 live region
    it('keeps the live regions exposed to assistive technology', async () => {
      const modal = await openModal(html`<aui-modal heading="Editor">Body</aui-modal>`);
      try {
        ToastService.info('Saved', { duration: 0 });
        ToastService.error('Upload failed', { duration: 0 });
        await settled();

        const region = await getAxNode(viewportEl());
        expect(region.ignored, 'viewport region is not inert').to.be.false;
        expect(region.role).to.equal('region');

        // getAxNode 以單一全域變數傳遞目標元素，須依序呼叫
        const [infoToast, errorToast] = toasts();
        const info = await getAxNode(part(infoToast, 'content'));
        const error = await getAxNode(part(errorToast, 'content'));
        expect(info.ignored, 'status region is not inert').to.be.false;
        expect(info.role).to.equal('status');
        expect(info.live).to.equal('polite');
        expect(error.ignored, 'alert region is not inert').to.be.false;
        expect(error.role).to.equal('alert');
        expect(error.live).to.equal('assertive');
      } finally {
        await closeModal(modal);
      }
    });

    it('passes axe audit while over the modal', async () => {
      const modal = await openModal(html`<aui-modal heading="Editor">Body</aui-modal>`);
      try {
        ToastService.success('Saved', { duration: 0 });
        await settled();
        await expect(modal).to.be.accessible();
      } finally {
        await closeModal(modal);
      }
    });
  });
});
