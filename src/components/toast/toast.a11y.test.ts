import { expect } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import { getAxNode } from '../../test-utils/ax.js';
import { ToastService } from './toast-service.js';
import type { AuiToast } from './toast.js';

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const viewportEl = () => document.querySelector<HTMLElement>('[data-aui-toast-viewport]')!;
const toasts = () => [...viewportEl().querySelectorAll<AuiToast>('aui-toast')];
const part = (toast: AuiToast, name: string) =>
  toast.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`)!;

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
});
