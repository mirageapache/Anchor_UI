import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendMouse, setViewport } from '@web/test-runner-commands';
import { ToastService } from './toast-service.js';
import type { AuiToast } from './toast.js';
import '../modal/index.js';
import '../alert/index.js';
import { AlertService } from '../alert/alert-service.js';
import type { AuiModal } from '../modal/modal.js';
import type { AuiAlert } from '../alert/alert.js';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const viewportEl = () => document.querySelector<HTMLElement>('[data-aui-toast-viewport]');
const toasts = () => [...(viewportEl()?.querySelectorAll<AuiToast>('aui-toast') ?? [])];
const isOpen = (element: HTMLElement) => element.matches(':popover-open');

/** 等待通知插入並完成渲染 */
async function rendered(): Promise<void> {
  await nextFrame();
  await Promise.all(toasts().map((toast) => toast.updateComplete));
  await nextFrame();
}

/** 通知卡片中心座標 */
function centerOf(toast: AuiToast): [number, number] {
  const rect = toast.getBoundingClientRect();
  return [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)];
}

/** 點擊座標上的元素是否屬於該通知（穿透 Shadow DOM） */
function hitsToast(toast: AuiToast): boolean {
  const [x, y] = centerOf(toast);
  let hit = document.elementFromPoint(x, y);
  while (hit?.shadowRoot?.elementFromPoint(x, y) && hit.shadowRoot.elementFromPoint(x, y) !== hit) {
    hit = hit.shadowRoot.elementFromPoint(x, y);
  }
  return hit === toast || toast.contains(hit) || toast.shadowRoot!.contains(hit);
}

describe('ToastService', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
    await setViewport({ width: 1024, height: 768 });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  afterEach(async () => {
    await resetMouse();
    await ToastService.closeAll();
    ToastService.resetConfig();
  });

  describe('viewport', () => {
    it('shows toasts in a single bottom-right popover viewport', async () => {
      ToastService.success('Copied');
      ToastService.info('Second');
      await rendered();

      const viewport = viewportEl()!;
      expect(document.querySelectorAll('[data-aui-toast-viewport]')).to.have.length(1);
      expect(viewport.parentElement === document.body).to.be.true;
      expect(viewport.getAttribute('popover')).to.equal('manual');
      expect(isOpen(viewport)).to.be.true;
      expect(viewport.getAttribute('role')).to.equal('region');
      expect(viewport.getAttribute('aria-label')).to.equal('通知');

      const rect = viewport.getBoundingClientRect();
      expect(window.innerWidth - rect.right).to.be.closeTo(24, 1);
      expect(window.innerHeight - rect.bottom).to.be.closeTo(24, 1);
      expect(rect.width).to.be.closeTo(380, 1);
    });

    it('stacks toasts vertically without overlapping, newest at the bottom', async () => {
      ToastService.configure({ maxVisible: 5 });
      for (const message of ['One', 'Two', 'Three', 'Four']) ToastService.info(message);
      await rendered();

      const items = toasts();
      expect(items.map((toast) => toast.message)).to.deep.equal(['One', 'Two', 'Three', 'Four']);
      const rects = items.map((toast) => toast.getBoundingClientRect());
      for (let i = 1; i < rects.length; i++) {
        expect(rects[i].top, `toast ${i} starts below toast ${i - 1}`).to.be.at.least(
          rects[i - 1].bottom,
        );
        expect(rects[i].left).to.equal(rects[0].left);
      }
    });

    it('hides the viewport once the last toast is gone', async () => {
      const handle = ToastService.info('Only one');
      await rendered();
      handle.close();
      await handle.closed;
      expect(toasts()).to.have.length(0);
      expect(isOpen(viewportEl()!)).to.be.false;
    });

    it('puts the viewport back when the page removed it', async () => {
      ToastService.info('First');
      await rendered();
      const viewport = viewportEl()!;
      await ToastService.closeAll();
      viewport.remove();

      ToastService.info('After removal');
      await rendered();
      expect(viewport.isConnected).to.be.true;
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['After removal']);
    });

    it('is a singleton shared through globalThis', async () => {
      const key = Symbol.for('anchor-ui.toast@1');
      expect((globalThis as Record<symbol, unknown>)[key]).to.exist;
      ToastService.info('a');
      ToastService.info('b');
      await rendered();
      expect(document.querySelectorAll('[data-aui-toast-viewport]')).to.have.length(1);
    });
  });

  describe('lifetime', () => {
    it('closes automatically after the duration and resolves closed', async () => {
      const handle = ToastService.success('Auto', { duration: 150 });
      await rendered();
      expect(toasts()).to.have.length(1);
      await wait(60);
      expect(toasts(), 'still visible before the duration').to.have.length(1);
      await handle.closed;
      expect(toasts()).to.have.length(0);
    });

    it('uses per-variant default durations, and loading stays until updated', async () => {
      ToastService.configure({ durations: { success: 100, error: 100 } });
      const success = ToastService.success('Done');
      const loading = ToastService.loading('Working');
      await success.closed;
      await wait(150);
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['Working']);
      loading.close();
    });

    it('updates a toast in place, e.g. loading to success, and restarts the timer', async () => {
      ToastService.configure({ durations: { success: 120 } });
      const handle = ToastService.loading('Uploading…');
      await rendered();
      const [element] = toasts();
      expect(element.variant).to.equal('loading');

      handle.update({ variant: 'success', message: 'Uploaded' });
      await element.updateComplete;
      expect(toasts()).to.deep.equal([element]);
      expect(element.variant).to.equal('success');
      expect(element.message).to.equal('Uploaded');
      await handle.closed;
    });

    it('updates the existing toast when shown again with the same id', async () => {
      const first = ToastService.success('Copied', { id: 'copy' });
      const second = ToastService.success('Copied again', { id: 'copy' });
      await rendered();
      expect(second).to.equal(first);
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['Copied again']);

      ToastService.update('copy', { message: 'Updated by id' });
      expect(toasts()[0].message).to.equal('Updated by id');
      ToastService.close('copy');
      await first.closed;
    });

    it('closes from the close button', async () => {
      const handle = ToastService.info('Close me', { duration: 0 });
      await rendered();
      toasts()[0].shadowRoot!.querySelector<HTMLButtonElement>('[part~="close-button"]')!.click();
      await handle.closed;
      expect(toasts()).to.have.length(0);
    });

    it('plays the exit transition before removing the toast', async () => {
      await emulateMedia({ reducedMotion: 'no-preference' });
      try {
        const handle = ToastService.info('Leaving', { duration: 0 });
        await rendered();
        const [element] = toasts();
        handle.close();
        await element.updateComplete;
        expect(element.hasAttribute('leaving')).to.be.true;
        expect(element.isConnected, 'still in the viewport while fading out').to.be.true;
        await handle.closed;
        expect(element.isConnected).to.be.false;
      } finally {
        await emulateMedia({ reducedMotion: 'reduce' });
      }
    });
  });

  describe('queue', () => {
    it('limits the visible toasts and shows queued ones as others close', async () => {
      ToastService.configure({ maxVisible: 2 });
      const handles = ['A', 'B', 'C', 'D'].map((message) =>
        ToastService.info(message, { duration: 0 }),
      );
      await rendered();
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['A', 'B']);

      handles[0].close();
      await rendered();
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['B', 'C']);

      handles[3].close();
      await handles[3].closed;
      handles[1].close();
      await handles[1].closed;
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['C']);
    });

    it('starts the timer of a queued toast only when it becomes visible', async () => {
      ToastService.configure({ maxVisible: 1 });
      const first = ToastService.info('First', { duration: 0 });
      const queued = ToastService.info('Queued', { duration: 150 });
      await wait(250);
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['First']);

      first.close();
      await rendered();
      expect(toasts().map((toast) => toast.message)).to.deep.equal(['Queued']);
      await queued.closed;
    });

    it('closeAll() also clears queued toasts', async () => {
      ToastService.configure({ maxVisible: 1 });
      const handles = ['A', 'B', 'C'].map((message) => ToastService.info(message, { duration: 0 }));
      await ToastService.closeAll();
      await Promise.all(handles.map((handle) => handle.closed));
      expect(toasts()).to.have.length(0);
    });
  });

  describe('pausing (WCAG 2.2.1)', () => {
    it('pauses while the pointer is over a toast', async () => {
      const handle = ToastService.info('Hover me', { duration: 200 });
      await rendered();
      await sendMouse({ type: 'move', position: centerOf(toasts()[0]) });
      await wait(350);
      expect(toasts(), 'paused while hovered').to.have.length(1);

      await sendMouse({ type: 'move', position: [5, 5] });
      await handle.closed;
    });

    it('pauses while focus is inside a toast', async () => {
      const handle = ToastService.info('Focus me', { duration: 200 });
      await rendered();
      const close =
        toasts()[0].shadowRoot!.querySelector<HTMLButtonElement>('[part~="close-button"]')!;
      close.focus();
      await wait(350);
      expect(toasts(), 'paused while focused').to.have.length(1);

      close.blur();
      await handle.closed;
    });

    it('resumes the others when the hovered toast is closed and nothing is under the pointer', async () => {
      // Viewport 由右下角往上堆疊：關閉最上面那則後，指標下方不再有通知（關閉下方那則時，上方通知會移到指標下並保持暫停）
      const hovered = ToastService.info('Hovered (top)', { duration: 0 });
      const stays = ToastService.info('Stays (bottom)', { duration: 250 });
      await rendered();
      await sendMouse({ type: 'move', position: centerOf(toasts()[0]) });
      await wait(350);
      expect(toasts(), 'paused while hovering the top toast').to.have.length(2);

      // 移除時不會觸發 pointerout，且 :hover 要到下一次指標移動才更新
      hovered.close();
      await hovered.closed;
      await stays.closed;
      expect(toasts()).to.have.length(0);
    });

    it('stays paused when another toast moves under the pointer after a close', async () => {
      ToastService.info('Top', { duration: 250 });
      const bottom = ToastService.info('Bottom (hovered)', { duration: 0 });
      await rendered();
      await sendMouse({ type: 'move', position: centerOf(toasts()[1]) });
      bottom.close();
      await bottom.closed;
      await wait(400);
      expect(
        toasts().map((toast) => toast.message),
        'the top toast slid under the pointer',
      ).to.deep.equal(['Top']);
    });
  });

  describe('top layer', () => {
    it('raises the viewport above popovers opened after it when a new toast appears', async () => {
      ToastService.info('Old', { duration: 0 });
      await rendered();
      const cover = await fixture<HTMLDivElement>(html`
        <div popover="manual" style="inset: 0; margin: 0; width: 100vw; height: 100vh; border: 0;">
          Cover
        </div>
      `);
      cover.showPopover();
      try {
        expect(hitsToast(toasts()[0]), 'covered by the later popover').to.be.false;
        ToastService.info('New', { duration: 0 });
        await rendered();
        expect(hitsToast(toasts()[1]), 'raised above it').to.be.true;
      } finally {
        cover.hidePopover();
      }
    });

    it('stays visible and operable above an open modal, and returns when it closes', async () => {
      const modal = await fixture<AuiModal>(html`<aui-modal heading="Editor">Body</aui-modal>`);
      const shown = oneEvent(modal, 'aui-after-show');
      modal.open = true;
      await shown;

      const handle = ToastService.info('Over the modal', { duration: 0 });
      await rendered();
      const viewport = viewportEl()!;
      expect(viewport.parentElement === modal, 'moved into the modal').to.be.true;
      expect(viewport.assignedSlot?.name).to.equal('overlay');
      expect(isOpen(viewport)).to.be.true;
      expect(hitsToast(toasts()[0]), 'above the modal and its backdrop').to.be.true;

      const close =
        toasts()[0].shadowRoot!.querySelector<HTMLButtonElement>('[part~="close-button"]')!;
      close.focus();
      expect(toasts()[0].shadowRoot!.activeElement === close, 'not inert: can take focus').to.be
        .true;
      await sendMouse({ type: 'click', position: centerOf(close as unknown as AuiToast) });
      await handle.closed;
      expect(modal.open, 'clicking the toast does not close the modal').to.be.true;

      ToastService.info('Second', { duration: 0 });
      const hidden = oneEvent(modal, 'aui-after-hide');
      await modal.hide();
      await hidden;
      expect(viewport.parentElement === document.body, 'back to the page').to.be.true;
      expect(isOpen(viewport)).to.be.true;
    });

    it('stays above an alert opened after it', async () => {
      ToastService.warning('Still visible', { duration: 0 });
      await rendered();
      // 開啟後 Viewport 會移入 Alert 的 Shadow DOM，document.querySelector 找不到，先保留參照
      const viewport = viewportEl()!;
      const [toast] = toasts();
      const result = AlertService.confirm({ title: 'Continue?' });
      const alert = document.body.querySelector<AuiAlert>(':scope > aui-alert:last-of-type')!;
      await oneEvent(alert, 'aui-after-show');
      await rendered();

      expect(viewport.getRootNode() === alert.shadowRoot, 'inside the alert shadow tree').to.be
        .true;
      expect(isOpen(viewport)).to.be.true;
      expect(hitsToast(toast), 'above the alert').to.be.true;

      alert.cancel();
      expect(await result).to.be.false;
      expect(viewport.parentElement === document.body).to.be.true;
    });
  });
});
