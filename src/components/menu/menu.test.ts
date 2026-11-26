import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import './index.js';
import '../button/index.js';
import type { AuiMenu } from './menu.js';
import type { MenuSelectDetail } from './menu.types.js';
import type { PopoverHideDetail } from '../popover/popover.types.js';
import { isPopoverOpen } from '../../internal/top-layer.js';

const panelOf = (el: AuiMenu) => el.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;

async function setup() {
  const wrapper = await fixture<HTMLElement>(html`
    <div style="padding: 24px;">
      <aui-menu label="檔案">
        <button slot="trigger" id="trigger">File</button>
        <button value="new">New</button>
        <button value="open">Open</button>
        <hr />
        <button value="duplicate">Duplicate</button>
        <button value="delete" aria-disabled="true">Delete</button>
        <button value="archive" disabled>Archive</button>
        <a href="#docs" id="docs">Docs</a>
      </aui-menu>
      <button id="after">After</button>
    </div>
  `);
  const el = wrapper.querySelector<AuiMenu>('aui-menu')!;
  await el.updateComplete;
  const trigger = wrapper.querySelector<HTMLButtonElement>('#trigger')!;
  const item = (value: string) => el.querySelector<HTMLElement>(`[value="${value}"]`)!;
  return { wrapper, el, trigger, item };
}

async function openWith(el: AuiMenu, action: () => unknown): Promise<void> {
  const shown = oneEvent(el, 'aui-after-show');
  await action();
  await shown;
}

async function clickOn(element: Element): Promise<void> {
  const rect = element.getBoundingClientRect();
  await sendMouse({
    type: 'click',
    position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
  });
}

describe('AuiMenu (<aui-menu>)', () => {
  before(() => emulateMedia({ reducedMotion: 'reduce' }));
  after(() => emulateMedia({ reducedMotion: 'no-preference' }));
  afterEach(() => resetMouse());

  describe('roles', () => {
    it('marks the panel, items and separators', async () => {
      const { el, item, trigger } = await setup();
      expect(panelOf(el).getAttribute('role')).to.equal('menu');
      expect(trigger.getAttribute('aria-haspopup')).to.equal('menu');
      expect(item('new').getAttribute('role')).to.equal('menuitem');
      expect(item('new').tabIndex).to.equal(-1);
      expect(el.querySelector('hr')!.getAttribute('role')).to.equal('separator');
      expect(item('delete').getAttribute('aria-disabled')).to.equal('true');
      // 原生 disabled 也標示 aria-disabled
      expect(item('archive').getAttribute('aria-disabled')).to.equal('true');
      expect(el.items.map((element) => element.textContent)).to.deep.equal([
        'New',
        'Open',
        'Duplicate',
        'Delete',
        'Archive',
        'Docs',
      ]);
    });

    it('marks items added later', async () => {
      const { el } = await setup();
      const added = document.createElement('button');
      added.textContent = 'Added';
      el.append(added);
      await new Promise((resolve) => setTimeout(resolve));
      expect(added.getAttribute('role')).to.equal('menuitem');
    });
  });

  describe('opening from the trigger', () => {
    it('focuses the first item when opened by click', async () => {
      const { el, trigger, item } = await setup();
      await openWith(el, () => clickOn(trigger));
      expect(document.activeElement).to.equal(item('new'));
    });

    for (const key of ['Enter', 'Space', 'ArrowDown']) {
      it(`opens with ${key} and focuses the first item`, async () => {
        const { el, trigger, item } = await setup();
        trigger.focus();
        await openWith(el, () => sendKeys({ press: key }));
        expect(document.activeElement).to.equal(item('new'));
      });
    }

    it('opens with ArrowUp and focuses the last item', async () => {
      const { el, trigger } = await setup();
      trigger.focus();
      await openWith(el, () => sendKeys({ press: 'ArrowUp' }));
      expect(document.activeElement?.id).to.equal('docs');
    });
  });

  describe('navigation inside the menu', () => {
    it('moves with the arrow keys and wraps around', async () => {
      const { el, trigger, item } = await setup();
      await openWith(el, () => clickOn(trigger));
      await sendKeys({ press: 'ArrowDown' });
      expect(document.activeElement).to.equal(item('open'));
      // 分隔線不是項目；aria-disabled 的項目仍可聚焦（APG），原生 disabled 的項目略過
      await sendKeys({ press: 'ArrowDown' });
      expect(document.activeElement).to.equal(item('duplicate'));
      await sendKeys({ press: 'ArrowDown' });
      expect(document.activeElement).to.equal(item('delete'));
      await sendKeys({ press: 'ArrowDown' });
      expect(document.activeElement?.id).to.equal('docs');
      await sendKeys({ press: 'ArrowDown' });
      expect(document.activeElement).to.equal(item('new'));
      await sendKeys({ press: 'ArrowUp' });
      expect(document.activeElement?.id).to.equal('docs');
    });

    it('jumps with Home and End', async () => {
      const { el, trigger, item } = await setup();
      await openWith(el, () => clickOn(trigger));
      await sendKeys({ press: 'End' });
      expect(document.activeElement?.id).to.equal('docs');
      await sendKeys({ press: 'Home' });
      expect(document.activeElement).to.equal(item('new'));
    });

    it('moves to the next item starting with a typed character', async () => {
      const { el, trigger, item } = await setup();
      await openWith(el, () => clickOn(trigger));
      await sendKeys({ press: 'd' });
      expect(document.activeElement).to.equal(item('duplicate'));
      await sendKeys({ press: 'd' });
      expect(document.activeElement).to.equal(item('delete'));
      await sendKeys({ press: 'd' });
      expect(document.activeElement?.id).to.equal('docs');
      await sendKeys({ press: 'D' });
      expect(document.activeElement).to.equal(item('duplicate'));
      // 沒有符合的字元時不移動
      await sendKeys({ press: 'z' });
      expect(document.activeElement).to.equal(item('duplicate'));
    });
  });

  describe('selection', () => {
    for (const key of ['Enter', 'Space']) {
      it(`selects with ${key}, closes and returns focus to the trigger`, async () => {
        const { el, trigger, item } = await setup();
        await openWith(el, () => clickOn(trigger));
        await sendKeys({ press: 'ArrowDown' });
        const selected = oneEvent(el, 'aui-select');
        const afterHide = oneEvent(el, 'aui-after-hide');
        await sendKeys({ press: key });
        const { detail } = (await selected) as CustomEvent<MenuSelectDetail>;
        expect(detail.value).to.equal('open');
        expect(detail.item).to.equal(item('open'));
        expect(((await afterHide) as CustomEvent<PopoverHideDetail>).detail.reason).to.equal(
          'select',
        );
        expect(document.activeElement).to.equal(trigger);
      });
    }

    it('selects with a click and reports the text when there is no value', async () => {
      const { el, trigger } = await setup();
      await openWith(el, () => clickOn(trigger));
      const selected = oneEvent(el, 'aui-select');
      await clickOn(el.querySelector('#docs')!);
      expect(((await selected) as CustomEvent<MenuSelectDetail>).detail.value).to.equal('Docs');
      expect(location.hash).to.equal('#docs');
      history.replaceState(null, '', location.pathname + location.search);
      await el.updateComplete;
      expect(el.open).to.be.false;
    });

    it('keeps the menu open when aui-select is cancelled', async () => {
      const { el, trigger, item } = await setup();
      await openWith(el, () => clickOn(trigger));
      let selections = 0;
      el.addEventListener('aui-select', (event) => {
        selections++;
        event.preventDefault();
      });
      await clickOn(item('new'));
      await el.updateComplete;
      expect(selections).to.equal(1);
      expect(el.open).to.be.true;
    });

    it('does not select an aria-disabled item', async () => {
      const { el, trigger, item } = await setup();
      await openWith(el, () => clickOn(trigger));
      const selected: string[] = [];
      el.addEventListener('aui-select', (event) => {
        selected.push((event as CustomEvent<MenuSelectDetail>).detail.value);
        event.preventDefault();
      });
      item('delete').focus();
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Space' });
      await clickOn(item('delete'));
      // 對照：一般項目以同樣的操作會選取（每種操作只分派一次）
      item('duplicate').focus();
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Space' });
      await el.updateComplete;
      expect(selected).to.deep.equal(['duplicate', 'duplicate']);
      expect(el.open).to.be.true;
    });

    it('does not submit an enclosing form', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <aui-menu>
            <button slot="trigger" type="button">Actions</button>
            <button value="a">A</button>
            <button value="b" type="submit">Explicit submit</button>
          </aui-menu>
        </form>
      `);
      const el = form.querySelector<AuiMenu>('aui-menu')!;
      let submitted = 0;
      form.addEventListener('submit', (event) => {
        submitted++;
        event.preventDefault();
      });
      await openWith(el, () => el.show());
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;
      expect(submitted).to.equal(0);
      expect(el.querySelector('[value="a"]')!.getAttribute('type')).to.equal('button');
      // 使用者明確指定的 type 保留
      expect(el.querySelector('[value="b"]')!.getAttribute('type')).to.equal('submit');
    });
  });

  describe('item attributes', () => {
    it('follows the disabled attribute in both directions', async () => {
      const { el, item } = await setup();
      const archive = item('archive');
      expect(archive.getAttribute('aria-disabled')).to.equal('true');
      archive.removeAttribute('disabled');
      await new Promise((resolve) => setTimeout(resolve));
      expect(archive.hasAttribute('aria-disabled')).to.be.false;
      expect(el.items.includes(archive)).to.be.true;
      archive.setAttribute('disabled', '');
      await new Promise((resolve) => setTimeout(resolve));
      expect(archive.getAttribute('aria-disabled')).to.equal('true');
    });

    it('keeps an aria-disabled value that is changed after the item was added', async () => {
      const { el, trigger, item } = await setup();
      const duplicate = item('duplicate');
      const remove = item('delete');
      // 例如框架的繫結：加入選單後才停用 / 啟用
      duplicate.setAttribute('aria-disabled', 'true');
      remove.setAttribute('aria-disabled', 'false');

      let selected = 0;
      el.addEventListener('aui-select', () => selected++);
      // 開啟時會重新同步項目
      await openWith(el, () => trigger.click());
      expect(duplicate.getAttribute('aria-disabled')).to.equal('true');
      expect(remove.getAttribute('aria-disabled')).to.equal('false');
      duplicate.click();
      expect(selected, 'the item disabled later is not selectable').to.equal(0);
      expect(el.open).to.be.true;
      remove.click();
      expect(selected, 'the item enabled later is selectable').to.equal(1);
    });

    it('keeps a later aria-disabled change across a disabled toggle and when the item leaves', async () => {
      const { wrapper, item } = await setup();
      const open = item('open');
      open.setAttribute('aria-disabled', 'true');
      open.setAttribute('disabled', '');
      await new Promise((resolve) => setTimeout(resolve));
      open.removeAttribute('disabled');
      await new Promise((resolve) => setTimeout(resolve));
      expect(open.getAttribute('aria-disabled')).to.equal('true');

      wrapper.append(open);
      await new Promise((resolve) => setTimeout(resolve));
      expect(open.getAttribute('aria-disabled')).to.equal('true');
      expect(open.hasAttribute('role')).to.be.false;
    });

    it('keeps a menuitemcheckbox role set by the user', async () => {
      const el = await fixture<AuiMenu>(html`
        <aui-menu>
          <button slot="trigger">View</button>
          <button role="menuitemcheckbox" aria-checked="true">Show grid</button>
        </aui-menu>
      `);
      await el.updateComplete;
      expect(el.items[0].getAttribute('role')).to.equal('menuitemcheckbox');
    });

    it('restores the original attributes of an item moved out of the menu', async () => {
      const { el, wrapper, item } = await setup();
      const moved = item('new');
      wrapper.append(moved);
      await new Promise((resolve) => setTimeout(resolve));
      expect(moved.hasAttribute('role')).to.be.false;
      expect(moved.hasAttribute('tabindex')).to.be.false;
      expect(moved.hasAttribute('type')).to.be.false;
      expect(el.items.includes(moved)).to.be.false;
    });
  });

  describe('closing', () => {
    it('closes with ESC and returns focus to the trigger', async () => {
      const { el, trigger } = await setup();
      await openWith(el, () => clickOn(trigger));
      const afterHide = oneEvent(el, 'aui-after-hide');
      await sendKeys({ press: 'Escape' });
      await afterHide;
      expect(isPopoverOpen(panelOf(el))).to.be.false;
      expect(document.activeElement).to.equal(trigger);
    });

    it('closes when Shift+Tab moves focus back to the trigger', async () => {
      const { el, trigger } = await setup();
      await openWith(el, () => clickOn(trigger));
      const afterHide = oneEvent(el, 'aui-after-hide');
      await sendKeys({ press: 'Shift+Tab' });
      await afterHide;
      expect(el.open).to.be.false;
      expect(document.activeElement).to.equal(trigger);
    });

    it('does not reuse ArrowUp from an open that was cancelled', async () => {
      const { el, trigger, item } = await setup();
      trigger.focus();
      el.addEventListener('aui-show', (event) => event.preventDefault(), { once: true });
      await sendKeys({ press: 'ArrowUp' });
      await el.updateComplete;
      expect(el.open).to.be.false;
      await openWith(el, () => clickOn(trigger));
      expect(document.activeElement).to.equal(item('new'));
    });

    it('closes when Tab moves focus out of the menu', async () => {
      const { el, trigger, wrapper } = await setup();
      await openWith(el, () => clickOn(trigger));
      el.querySelector<HTMLElement>('#docs')!.focus();
      const afterHide = oneEvent(el, 'aui-after-hide');
      await sendKeys({ press: 'Tab' });
      expect(((await afterHide) as CustomEvent<PopoverHideDetail>).detail.reason).to.equal(
        'focus-out',
      );
      expect(document.activeElement).to.equal(wrapper.querySelector('#after'));
    });
  });

  it('moves focus to the item under the pointer', async () => {
    const { el, trigger, item } = await setup();
    await openWith(el, () => clickOn(trigger));
    const rect = item('duplicate').getBoundingClientRect();
    await sendMouse({ type: 'move', position: [Math.round(rect.x + 4), Math.round(rect.y + 4)] });
    expect(document.activeElement).to.equal(item('duplicate'));
  });

  it('navigates items of a menu inside another shadow root', async () => {
    const host = await fixture<HTMLElement>(html`<div></div>`);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <aui-menu>
        <button slot="trigger">More</button>
        <button>One</button>
        <button>Two</button>
      </aui-menu>`;
    const el = root.querySelector<AuiMenu>('aui-menu')!;
    await el.updateComplete;
    await openWith(el, () => el.show());
    await sendKeys({ press: 'ArrowDown' });
    expect(root.activeElement?.textContent).to.equal('Two');
  });

  it('works with an <aui-button> trigger', async () => {
    const el = await fixture<AuiMenu>(html`
      <aui-menu>
        <aui-button slot="trigger">Account</aui-button>
        <button>Profile</button>
      </aui-menu>
    `);
    const host = el.querySelector('aui-button')!;
    await host.updateComplete;
    expect(host.shadowRoot!.querySelector('button')!.getAttribute('aria-haspopup')).to.equal(
      'menu',
    );
    host.focus();
    await openWith(el, () => sendKeys({ press: 'ArrowDown' }));
    expect(document.activeElement?.textContent).to.equal('Profile');
  });
});
