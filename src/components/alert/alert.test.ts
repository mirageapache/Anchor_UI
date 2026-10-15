import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import './index.js';
import '../modal/index.js';
import { AlertService } from './alert-service.js';
import type { AuiAlert } from './alert.js';
import type { AlertCancelDetail, AlertConfirmDetail } from './alert.types.js';
import type { AuiModal } from '../modal/modal.js';
import { getDeepActiveElement } from '../../internal/focus-return.js';
import { getTopModalLayer } from '../../internal/top-layer.js';
import { isScrollLocked } from '../../internal/scroll-lock.js';

const modalOf = (el: AuiAlert) => el.shadowRoot!.querySelector<AuiModal>('aui-modal')!;
const part = (el: AuiAlert, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`);
/** <aui-button> 內部實際的 <button> */
const innerButton = (el: AuiAlert, name: string) =>
  part(el, name)!.shadowRoot!.querySelector('button')!;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function openAlert(el: AuiAlert): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  el.open = true;
  await shown;
}

/** 等待結果事件：回傳 aui-confirm 或 aui-cancel 與其 detail */
function nextResult(
  el: AuiAlert,
): Promise<{ type: 'aui-confirm'; value: string } | { type: 'aui-cancel'; reason: string }> {
  return new Promise((resolve) => {
    const onConfirm = (event: Event) => {
      cleanup();
      resolve({
        type: 'aui-confirm',
        value: (event as CustomEvent<AlertConfirmDetail>).detail.value,
      });
    };
    const onCancel = (event: Event) => {
      cleanup();
      resolve({
        type: 'aui-cancel',
        reason: (event as CustomEvent<AlertCancelDetail>).detail.reason,
      });
    };
    const cleanup = () => {
      el.removeEventListener('aui-confirm', onConfirm);
      el.removeEventListener('aui-cancel', onCancel);
    };
    el.addEventListener('aui-confirm', onConfirm);
    el.addEventListener('aui-cancel', onCancel);
  });
}

/** 取得使用者啟用：沒有啟用時，Chrome 會忽略 ESC 的 cancel 事件攔截（見 <aui-modal> 測試） */
async function activateUser(): Promise<void> {
  const button = document.createElement('button');
  button.style.cssText = 'position: fixed; top: 0; left: 0;';
  document.body.appendChild(button);
  try {
    await sendMouse({ type: 'click', position: [5, 5] });
  } finally {
    button.remove();
  }
}

/** 等待 AlertService 建立的 <aui-alert> 完全開啟 */
async function serviceAlert(): Promise<AuiAlert> {
  const alert = document.body.querySelector<AuiAlert>(':scope > aui-alert:last-of-type')!;
  await oneEvent(alert, 'aui-after-show');
  return alert;
}

describe('AuiAlert (<aui-alert>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('modes and buttons', () => {
    it('is closed by default and built on <aui-modal>', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Saved"></aui-alert>`);
      expect(el.open).to.be.false;
      expect(modalOf(el).open).to.be.false;
      expect(modalOf(el).getAttribute('dialog-role')).to.equal('alertdialog');
      expect(modalOf(el).noCloseButton).to.be.true;
    });

    it('alert mode has only a confirm button and reports aui-confirm', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert heading="Saved" message="Done."></aui-alert>`,
      );
      await openAlert(el);
      expect(part(el, 'cancel-button')).to.be.null;
      expect(part(el, 'confirm-button')!.textContent!.trim()).to.equal('確定');

      const result = nextResult(el);
      innerButton(el, 'confirm-button').click();
      expect(await result).to.deep.equal({ type: 'aui-confirm', value: '' });
      expect(el.open).to.be.false;
      expect(modalOf(el).open).to.be.false;
    });

    it('confirm mode reports aui-cancel from the cancel button and aui-confirm from confirm', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert
          mode="confirm"
          heading="Continue?"
          cancel-text="No"
          confirm-text="Yes"
        ></aui-alert>`,
      );
      await openAlert(el);
      expect(part(el, 'cancel-button')!.textContent!.trim()).to.equal('No');

      let result = nextResult(el);
      innerButton(el, 'cancel-button').click();
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'cancel-button' });

      await openAlert(el);
      result = nextResult(el);
      innerButton(el, 'confirm-button').click();
      expect(await result).to.deep.equal({ type: 'aui-confirm', value: '' });
    });

    it('prompt mode returns the typed value', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="prompt" heading="Rename" input-value="draft"></aui-alert>`,
      );
      await openAlert(el);
      const input = part(el, 'input')! as HTMLElement & { value: string };
      expect(input.value).to.equal('draft');

      const result = nextResult(el);
      await sendKeys({ press: 'End' });
      await sendKeys({ type: '-v2' });
      await sendKeys({ press: 'Enter' });
      expect(await result).to.deep.equal({ type: 'aui-confirm', value: 'draft-v2' });
    });

    it('resets the prompt input to input-value when reopened', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="prompt" heading="Rename" input-value="draft"></aui-alert>`,
      );
      await openAlert(el);
      await sendKeys({ type: 'xyz' });
      const result = nextResult(el);
      el.cancel();
      await result;

      await openAlert(el);
      expect((part(el, 'input') as HTMLElement & { value: string }).value).to.equal('draft');
      el.cancel();
    });

    it('uses the danger style for destructive confirmations', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert mode="confirm" destructive></aui-alert>`);
      expect(part(el, 'confirm-button')!.getAttribute('variant')).to.equal('danger');
    });
  });

  describe('keyboard and focus', () => {
    it('focuses the confirm button by default, and Enter activates it', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="confirm" heading="Proceed?"></aui-alert>`,
      );
      await openAlert(el);
      expect(getDeepActiveElement()).to.equal(innerButton(el, 'confirm-button'));

      const result = nextResult(el);
      await sendKeys({ press: 'Enter' });
      expect((await result).type).to.equal('aui-confirm');
    });

    it('focuses the cancel button for destructive confirmations, so Enter cancels', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="confirm" heading="Delete?" destructive></aui-alert>`,
      );
      await openAlert(el);
      expect(getDeepActiveElement()).to.equal(innerButton(el, 'cancel-button'));

      const result = nextResult(el);
      await sendKeys({ press: 'Enter' });
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'cancel-button' });
    });

    it('focuses the input in prompt mode', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="prompt" heading="Name"></aui-alert>`,
      );
      await openAlert(el);
      const input = part(el, 'input')!;
      expect(getDeepActiveElement()).to.equal(input.shadowRoot!.querySelector('.control'));
      el.cancel();
    });

    it('does not confirm on Enter while an IME composition is in progress', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="prompt" heading="Name"></aui-alert>`,
      );
      await openAlert(el);
      let confirmed = 0;
      el.addEventListener('aui-confirm', () => confirmed++);
      const control = part(el, 'input')!.shadowRoot!.querySelector('.control')!;
      control.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          isComposing: true,
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      expect(el.open).to.be.true;
      expect(confirmed).to.equal(0);
      el.cancel();
    });

    it('cancels on Escape with reason "escape"', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="confirm" heading="Escape"></aui-alert>`,
      );
      await activateUser();
      await openAlert(el);
      const result = nextResult(el);
      await sendKeys({ press: 'Escape' });
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'escape' });
      expect(el.open).to.be.false;
    });

    it('returns focus to the trigger after closing', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div><button id="trigger">Open</button><aui-alert heading="Focus"></aui-alert></div>
      `);
      const trigger = wrapper.querySelector<HTMLButtonElement>('#trigger')!;
      const el = wrapper.querySelector<AuiAlert>('aui-alert')!;
      trigger.focus();
      await openAlert(el);
      const result = nextResult(el);
      el.confirm();
      await result;
      expect(document.activeElement).to.equal(trigger);
    });
  });

  describe('closing paths', () => {
    it('cancels on a backdrop click with reason "backdrop", unless disabled', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="confirm" heading="Backdrop"></aui-alert>`,
      );
      await openAlert(el);
      let result = nextResult(el);
      await sendMouse({ type: 'click', position: [5, 5] });
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'backdrop' });

      el.closeOnBackdrop = false;
      await openAlert(el);
      await sendMouse({ type: 'click', position: [5, 5] });
      await el.updateComplete;
      expect(el.open).to.be.true;
      result = nextResult(el);
      el.cancel();
      await result;
    });

    it('cancels with reason "api" when hidden programmatically', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="API"></aui-alert>`);
      await openAlert(el);
      const result = nextResult(el);
      await el.hide();
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'api' });
    });

    it('stays closed when aui-show is cancelled', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Blocked"></aui-alert>`);
      el.addEventListener('aui-show', (event) => event.preventDefault());
      el.open = true;
      await el.updateComplete;
      await modalOf(el).updateComplete;
      await el.updateComplete;
      expect(el.open).to.be.false;
      expect(modalOf(el).open).to.be.false;
    });

    it('stays open and keeps waiting for a decision when aui-hide is cancelled', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="confirm" heading="Keep"></aui-alert>`,
      );
      await openAlert(el);
      const keepOpen = (event: Event) => event.preventDefault();
      el.addEventListener('aui-hide', keepOpen);
      let results = 0;
      el.addEventListener('aui-confirm', () => results++);
      el.addEventListener('aui-cancel', () => results++);

      el.confirm();
      await el.updateComplete;
      await modalOf(el).updateComplete;
      await el.updateComplete;
      expect(el.open).to.be.true;
      expect(modalOf(el).open).to.be.true;

      el.removeEventListener('aui-hide', keepOpen);
      const result = nextResult(el);
      el.cancel();
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'cancel-button' });
      expect(results).to.equal(1);
    });

    it('re-dispatches the modal lifecycle events from the alert host', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Events"></aui-alert>`);
      const events: string[] = [];
      for (const type of ['aui-show', 'aui-after-show', 'aui-hide', 'aui-after-hide']) {
        el.addEventListener(type, (event) => {
          expect(event.target).to.equal(el);
          events.push(type);
        });
      }
      await openAlert(el);
      const result = nextResult(el);
      el.confirm();
      await result;
      expect(events).to.deep.equal(['aui-show', 'aui-after-show', 'aui-hide', 'aui-after-hide']);
    });
  });

  describe('icons', () => {
    for (const icon of ['success', 'error', 'warning', 'info'] as const) {
      it(`renders the ${icon} icon`, async () => {
        const el = await fixture<AuiAlert>(
          html`<aui-alert .icon=${icon} heading="Icon"></aui-alert>`,
        );
        const iconEl = part(el, 'icon')!;
        expect(iconEl.classList.contains(`alert__icon--${icon}`)).to.be.true;
        expect(iconEl.getAttribute('aria-hidden')).to.equal('true');
        // 符號須為真正的 SVG 元素（以 html 標籤建立會變成不繪製的 HTML 元素）
        for (const selector of ['.alert__ring', '.alert__glyph']) {
          const shape = iconEl.querySelector(selector)!;
          // 以布林值斷言：失敗時 chai 不必格式化整個元素（格式化 Lit 元素可能讓瀏覽器卡住）
          expect(shape instanceof SVGGeometryElement, `${selector} is an SVG shape`).to.be.true;
          expect(
            (shape as SVGGeometryElement).getTotalLength(),
            `${selector} has a shape`,
          ).to.be.greaterThan(0);
        }
      });
    }

    it('renders no icon when none is set', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="No icon"></aui-alert>`);
      expect(part(el, 'icon')).to.be.null;
    });

    it('animates the icon unless reduced motion is requested', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert icon="success" heading="Motion"></aui-alert>`,
      );
      const iconEl = part(el, 'icon')!;
      expect(getComputedStyle(iconEl).animationName).to.equal('none');

      await emulateMedia({ reducedMotion: 'no-preference' });
      try {
        expect(getComputedStyle(iconEl).animationName).to.equal('alert-icon-bounce');
        const glyph = iconEl.querySelector('.alert__glyph')!;
        expect(getComputedStyle(glyph).animationName).to.equal('alert-draw');
      } finally {
        await emulateMedia({ reducedMotion: 'reduce' });
      }
    });
  });

  describe('auto close (timer)', () => {
    /** 面板中心座標（滑鼠停在面板上） */
    const panelCenter = (el: AuiAlert): [number, number] => {
      const panel = el
        .shadowRoot!.querySelector('aui-modal')!
        .shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;
      const rect = panel.getBoundingClientRect();
      return [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)];
    };

    it('closes after the timer with reason "timer"', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Auto" timer="250"></aui-alert>`);
      expect(el.timer).to.equal(250);
      await openAlert(el);
      const started = performance.now();
      const result = nextResult(el);

      await wait(120);
      expect(el.open, 'still open before the timer ends').to.be.true;
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'timer' });
      expect(performance.now() - started).to.be.at.least(200);
      expect(el.open).to.be.false;
    });

    it('does not close automatically without a timer', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Manual"></aui-alert>`);
      await openAlert(el);
      await wait(300);
      expect(el.open).to.be.true;
      el.cancel();
    });

    it('reports a single result when closed before the timer ends', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Early" timer="200"></aui-alert>`);
      const results: string[] = [];
      el.addEventListener('aui-confirm', () => results.push('confirm'));
      el.addEventListener('aui-cancel', () => results.push('cancel'));
      await openAlert(el);
      el.confirm();
      await wait(350);
      expect(results).to.deep.equal(['confirm']);
    });

    it('pauses while the pointer is over the panel and resumes over the backdrop', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Hover" timer="250"></aui-alert>`);
      await openAlert(el);
      await sendMouse({ type: 'move', position: panelCenter(el) });
      await wait(400);
      expect(el.open, 'paused while hovering the panel').to.be.true;

      const result = nextResult(el);
      await sendMouse({ type: 'move', position: [5, 5] });
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'timer' });
    });

    it('stops for good once the user uses the keyboard', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert mode="confirm" heading="Keyboard" timer="250"></aui-alert>`,
      );
      await openAlert(el);
      await sendKeys({ press: 'Tab' });
      await wait(400);
      expect(el.open).to.be.true;
      el.cancel();
    });

    it('stops for good once the user clicks inside the panel', async () => {
      const el = await fixture<AuiAlert>(
        html`<aui-alert heading="Click" message="Read me" timer="250"></aui-alert>`,
      );
      await openAlert(el);
      const rect = part(el, 'title')!.getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      // 移回遮罩也不會恢復計時
      await sendMouse({ type: 'move', position: [5, 5] });
      await wait(400);
      expect(el.open).to.be.true;
      el.cancel();
    });

    it('restarts the timer when reopened', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Again" timer="150"></aui-alert>`);
      await openAlert(el);
      expect((await nextResult(el)).type).to.equal('aui-cancel');

      await openAlert(el);
      expect(await nextResult(el)).to.deep.equal({ type: 'aui-cancel', reason: 'timer' });
    });

    it('restarts with the new value when timer changes while open', async () => {
      const el = await fixture<AuiAlert>(html`<aui-alert heading="Change"></aui-alert>`);
      await openAlert(el);
      const result = nextResult(el);
      el.timer = 150;
      expect(await result).to.deep.equal({ type: 'aui-cancel', reason: 'timer' });
    });

    it('is supported by AlertService (timer closes as a cancellation)', async () => {
      await AlertService.alert({ title: 'Toast-like', timer: 120 });
      expect(await AlertService.confirm({ title: 'Auto cancel', timer: 120 })).to.be.false;
      expect(await AlertService.prompt({ title: 'Auto null', timer: 120 })).to.be.null;
      expect(document.querySelector('aui-alert')).to.be.null;
    });
  });

  describe('AlertService', () => {
    afterEach(() => {
      for (const alert of document.querySelectorAll('aui-alert')) alert.remove();
    });

    it('alert() resolves after closing and removes the element', async () => {
      const promise = AlertService.alert({ title: 'Saved', message: 'All good', icon: 'success' });
      const alert = await serviceAlert();
      expect(alert.heading).to.equal('Saved');
      expect(alert.message).to.equal('All good');
      expect(alert.icon).to.equal('success');
      expect(alert.mode).to.equal('alert');

      alert.confirm();
      expect(await promise).to.be.undefined;
      expect(alert.isConnected).to.be.false;
    });

    it('accepts a plain string as the message', async () => {
      const promise = AlertService.alert('Just a message');
      const alert = await serviceAlert();
      expect(alert.message).to.equal('Just a message');
      alert.cancel();
      await promise;
    });

    it('confirm() resolves true on confirm and false on cancel', async () => {
      let promise = AlertService.confirm({
        title: 'Delete?',
        destructive: true,
        confirmText: 'Delete',
      });
      let alert = await serviceAlert();
      expect(alert.destructive).to.be.true;
      expect(alert.confirmText).to.equal('Delete');
      alert.confirm();
      expect(await promise).to.be.true;

      promise = AlertService.confirm('Proceed?');
      alert = await serviceAlert();
      alert.cancel();
      expect(await promise).to.be.false;
    });

    it('prompt() resolves the value on confirm and null on cancel', async () => {
      let promise = AlertService.prompt({
        title: 'Name',
        defaultValue: 'Anchor',
        placeholder: 'Your name',
      });
      let alert = await serviceAlert();
      expect(alert.inputPlaceholder).to.equal('Your name');
      alert.confirm();
      expect(await promise).to.equal('Anchor');

      promise = AlertService.prompt('Name?');
      alert = await serviceAlert();
      alert.cancel();
      expect(await promise).to.be.null;
    });

    it('resolves as cancelled when aui-show is prevented', async () => {
      const block = (event: Event) => event.preventDefault();
      document.addEventListener('aui-show', block);
      try {
        expect(await AlertService.confirm('Blocked')).to.be.false;
        expect(document.querySelector('aui-alert')).to.be.null;
      } finally {
        document.removeEventListener('aui-show', block);
      }
    });

    it('opens on top of an open modal: Escape closes only the alert and focus returns into the modal', async () => {
      const modal = await fixture<AuiModal>(html`
        <aui-modal heading="Editor"><button id="delete">Delete</button></aui-modal>
      `);
      await activateUser();
      const shown = oneEvent(modal, 'aui-after-show');
      modal.open = true;
      await shown;
      const deleteButton = modal.querySelector<HTMLButtonElement>('#delete')!;
      deleteButton.focus();

      const promise = AlertService.confirm({ title: 'Delete item?', destructive: true });
      const alert = await serviceAlert();
      expect(getTopModalLayer(), 'the alert is now the top modal').to.equal(modalOf(alert));
      expect(getDeepActiveElement()).to.equal(innerButton(alert, 'cancel-button'));

      await sendKeys({ press: 'Escape' });
      expect(await promise).to.be.false;
      expect(modal.open, 'the modal stays open').to.be.true;
      expect(isScrollLocked(), 'the modal still locks scrolling').to.be.true;
      expect(getTopModalLayer()).to.equal(modal);
      expect(document.activeElement).to.equal(deleteButton);

      const hidden = oneEvent(modal, 'aui-after-hide');
      await modal.hide();
      await hidden;
      expect(isScrollLocked()).to.be.false;
    });
  });
});
