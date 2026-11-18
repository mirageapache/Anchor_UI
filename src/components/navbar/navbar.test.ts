import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { emulateMedia, sendKeys } from '@web/test-runner-commands';
import './index.js';
import '../drawer/index.js';
import '../modal/index.js';
import type { AuiNavbar } from './navbar.js';
import type { NavbarSearchDetail, NavbarThemeChangeDetail } from './navbar.types.js';
import type { AuiDrawer } from '../drawer/drawer.js';
import type { AuiModal } from '../modal/modal.js';
import { getTheme, setTheme } from '../../theme.js';

const part = (el: AuiNavbar, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`);
const visible = (element: Element | null) =>
  !!element && getComputedStyle(element).display !== 'none';

/** 測試環境的搜尋快捷鍵（與元件相同的平台判斷） */
const apple = /mac|iphone|ipad|ipod/i.test(navigator.platform);
const shortcut = apple ? 'Meta+k' : 'Control+k';

/** 在指定寬度的容器中建立 Navbar（響應式斷點依 Navbar 自身寬度） */
async function navbarAt(width: number, content = html`<a href="#a">Docs</a>`) {
  const wrapper = await fixture<HTMLDivElement>(html`
    <div style="width: ${width}px">
      <aui-navbar brand="Anchor UI">${content}</aui-navbar>
    </div>
  `);
  const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
  await el.updateComplete;
  return el;
}

/** 捲動頁面並等待 scroll 事件（非同步分派）與重新渲染 */
async function scrollPage(el: AuiNavbar, y: number): Promise<void> {
  const scrolled = oneEvent(window, 'scroll');
  window.scrollTo(0, y);
  await scrolled;
  await el.updateComplete;
}

describe('AuiNavbar (<aui-navbar>)', () => {
  before(async () => {
    await emulateMedia({ reducedMotion: 'reduce' });
  });

  after(async () => {
    await emulateMedia({ reducedMotion: 'no-preference' });
  });

  afterEach(() => {
    setTheme('light', { transition: false });
    window.scrollTo(0, 0);
  });

  describe('brand', () => {
    it('shows the brand name with its initial in the logo and an accent dot', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="anchor ui"></aui-navbar>`);
      expect(part(el, 'brand-title')!.textContent).to.equal('anchor ui');
      expect(part(el, 'logo')!.textContent!.trim()).to.equal('A');
      expect(part(el, 'logo')!.querySelector('.navbar__dot')).to.exist;
      expect(part(el, 'brand')!.localName).to.equal('span');
    });

    it('ignores a brand-href with an unsafe protocol', async () => {
      const el = await fixture<AuiNavbar>(
        html`<aui-navbar brand="Anchor UI" brand-href="javascript:alert(1)"></aui-navbar>`,
      );
      const brand = el.shadowRoot!.querySelector('[part="brand"]')!;
      expect(brand.tagName).to.equal('SPAN');
      expect(brand.hasAttribute('href')).to.be.false;
    });

    it('becomes a link with brand-href', async () => {
      const el = await fixture<AuiNavbar>(
        html`<aui-navbar brand="Anchor UI" brand-href="/"></aui-navbar>`,
      );
      const brand = part(el, 'brand')!;
      expect(brand.localName).to.equal('a');
      expect(brand.getAttribute('href')).to.equal('/');
    });

    it('places a slotted logo inside the logo box instead of the initial', async () => {
      const el = await fixture<AuiNavbar>(html`
        <aui-navbar><svg slot="logo" width="20" height="20" aria-label="Logo"></svg></aui-navbar>
      `);
      const slot = part(el, 'logo')!.querySelector<HTMLSlotElement>('slot[name="logo"]')!;
      expect(slot.assignedElements()).to.have.length(1);
      expect(part(el, 'brand-title')).to.be.null;
    });

    it('renders no brand without a name or logo', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar></aui-navbar>`);
      expect(part(el, 'brand')).to.be.null;
    });
  });

  describe('layout', () => {
    it('is 64px high, wraps the menu in a labelled <nav>, and hides an empty nav', async () => {
      const el = await navbarAt(1024);
      expect(part(el, 'base')!.getBoundingClientRect().height).to.equal(64);
      const nav = part(el, 'nav')!;
      expect(nav.localName).to.equal('nav');
      expect(nav.getAttribute('aria-label')).to.equal('主要導覽');
      expect(visible(nav)).to.be.true;

      const empty = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      expect(visible(part(empty, 'nav'))).to.be.false;
    });

    it('shows the menu and full search button when wide', async () => {
      const el = await navbarAt(1024);
      expect(visible(part(el, 'menu-button')), 'no menu button').to.be.false;
      expect(visible(el.shadowRoot!.querySelector('.navbar__search-text'))).to.be.true;
      expect(visible(el.shadowRoot!.querySelector('aui-kbd'))).to.be.true;
    });

    it('fills the width of a flex row or inline-block container', async () => {
      for (const display of ['flex', 'inline-flex', 'inline-block']) {
        const wrapper = await fixture<HTMLDivElement>(html`
          <div style="display: ${display}; width: 1000px">
            <aui-navbar brand="Anchor UI"><a href="#a">Docs</a></aui-navbar>
          </div>
        `);
        const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
        await el.updateComplete;
        expect(el.getBoundingClientRect().width, display).to.equal(1000);
        expect(visible(part(el, 'nav')), `${display}: wide layout`).to.be.true;
      }
    });

    it('swaps the menu for a menu button and an icon-only search when narrower than 768px', async () => {
      const el = await navbarAt(500);
      expect(visible(part(el, 'nav'))).to.be.false;
      expect(visible(part(el, 'menu-button'))).to.be.true;
      expect(visible(el.shadowRoot!.querySelector('.navbar__search-text'))).to.be.false;
      expect(visible(el.shadowRoot!.querySelector('aui-kbd'))).to.be.false;
      // 窄版多為觸控裝置：圖示按鈕為 44×44px 觸控目標
      for (const name of ['menu-button', 'search-button', 'theme-toggle']) {
        const rect = part(el, name)!.getBoundingClientRect();
        expect([rect.width, rect.height], name).to.deep.equal([44, 44]);
      }
    });

    it('shows the menu button on wide screens when the drawer is the only menu', async () => {
      const drawerOnly = await fixture<AuiNavbar>(
        html`<aui-navbar brand="X" menu-drawer="menu" style="width: 1024px"></aui-navbar>`,
      );
      expect(visible(part(drawerOnly, 'menu-button'))).to.be.true;

      const withNav = await navbarAt(1024);
      withNav.menuDrawer = 'menu';
      await withNav.updateComplete;
      expect(visible(part(withNav, 'menu-button')), 'the nav is visible instead').to.be.false;
    });

    it('renders the menu button only for nav content or menu-drawer, unless no-menu-button', async () => {
      const bare = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      expect(part(bare, 'menu-button')).to.be.null;

      bare.menuDrawer = 'menu';
      await bare.updateComplete;
      expect(part(bare, 'menu-button')).to.exist;

      const off = await fixture<AuiNavbar>(
        html`<aui-navbar brand="X" no-menu-button><a href="#a">A</a></aui-navbar>`,
      );
      expect(part(off, 'menu-button')).to.be.null;
    });

    it('sticks to the top by default, and supports fixed and static positions', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <div style="height: 100px"></div>
          <aui-navbar brand="Sticky"></aui-navbar>
          <div style="height: 3000px"></div>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      expect(el.getAttribute('position')).to.equal('sticky');
      expect(getComputedStyle(el).position).to.equal('sticky');

      await scrollPage(el, 1000);
      expect(el.getBoundingClientRect().top).to.equal(0);
      expect(part(el, 'base')!.classList.contains('navbar--scrolled')).to.be.true;
      expect(getComputedStyle(part(el, 'base')!).boxShadow).to.not.equal('none');

      await scrollPage(el, 0);
      expect(part(el, 'base')!.classList.contains('navbar--scrolled')).to.be.false;

      el.position = 'fixed';
      await el.updateComplete;
      expect(getComputedStyle(el).position).to.equal('fixed');
      el.position = 'static';
      await el.updateComplete;
      expect(getComputedStyle(el).position).to.equal('static');
    });
  });

  describe('menu button', () => {
    it('emits aui-menu-click', async () => {
      const el = await navbarAt(500);
      const clicked = oneEvent(el, 'aui-menu-click');
      part(el, 'menu-button')!.click();
      const event = await clicked;
      expect(event.cancelable).to.be.true;
      expect(part(el, 'menu-button')!.hasAttribute('aria-expanded')).to.be.false;
    });

    it('opens the drawer named by menu-drawer and syncs aria-expanded', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="width: 500px">
          <aui-navbar brand="Anchor UI" menu-drawer="site-menu"><a href="#a">A</a></aui-navbar>
          <aui-drawer id="site-menu" heading="Menu"><a href="#a">A</a></aui-drawer>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      const drawer = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      const button = () => part(el, 'menu-button')!;
      expect(button().getAttribute('aria-expanded')).to.equal('false');

      const shown = oneEvent(drawer, 'aui-after-show');
      button().click();
      await shown;
      await el.updateComplete;
      expect(drawer.open).to.be.true;
      expect(button().getAttribute('aria-expanded')).to.equal('true');

      const hidden = oneEvent(drawer, 'aui-after-hide');
      await drawer.hide();
      await hidden;
      await el.updateComplete;
      expect(button().getAttribute('aria-expanded')).to.equal('false');
    });

    it('re-syncs aria-expanded when the navbar is reinserted while the drawer is open', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-navbar brand="Anchor UI" menu-drawer="site-menu"></aui-navbar>
          <aui-drawer id="site-menu" heading="Menu"></aui-drawer>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      const drawer = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      await drawer.show();
      await el.updateComplete;
      expect(part(el, 'menu-button')!.getAttribute('aria-expanded')).to.equal('true');

      // 框架重排節點等情況：移出後重新插入
      el.remove();
      wrapper.prepend(el);
      await el.updateComplete;
      expect(part(el, 'menu-button')!.getAttribute('aria-expanded')).to.equal('true');

      await drawer.hide();
      await el.updateComplete;
      expect(part(el, 'menu-button')!.getAttribute('aria-expanded')).to.equal('false');
    });

    it('keeps aria-expanded while dialogs inside the drawer close, and resets it when the drawer is removed', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-navbar brand="Anchor UI" menu-drawer="site-menu"></aui-navbar>
          <aui-drawer id="site-menu" heading="Menu">
            <aui-modal heading="Inner"></aui-modal>
          </aui-drawer>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      const drawer = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      const inner = drawer.querySelector<AuiModal>('aui-modal')!;
      const expanded = async () => {
        await el.updateComplete;
        return part(el, 'menu-button')!.getAttribute('aria-expanded');
      };

      const shown = oneEvent(drawer, 'aui-after-show');
      part(el, 'menu-button')!.click();
      await shown;
      expect(await expanded()).to.equal('true');

      const innerShown = oneEvent(inner, 'aui-after-show');
      inner.open = true;
      await innerShown;
      await inner.hide();
      expect(await expanded(), 'an inner modal closing is not the drawer closing').to.equal('true');

      drawer.remove();
      expect(await expanded()).to.equal('false');
    });

    it('picks up a drawer that is already open when menu-drawer is set', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-navbar brand="Anchor UI"></aui-navbar>
          <aui-drawer id="site-menu" heading="Menu"></aui-drawer>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      const drawer = wrapper.querySelector<AuiDrawer>('aui-drawer')!;
      const shown = oneEvent(drawer, 'aui-after-show');
      drawer.open = true;
      await shown;
      el.menuDrawer = 'site-menu';
      await el.updateComplete;
      expect(part(el, 'menu-button')!.getAttribute('aria-expanded')).to.equal('true');

      const hidden = oneEvent(drawer, 'aui-after-hide');
      await drawer.hide();
      await hidden;
      await el.updateComplete;
      expect(part(el, 'menu-button')!.getAttribute('aria-expanded')).to.equal('false');
    });

    it('does not open the drawer when aui-menu-click is cancelled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="width: 500px">
          <aui-navbar brand="Anchor UI" menu-drawer="site-menu"></aui-navbar>
          <aui-drawer id="site-menu" heading="Menu"></aui-drawer>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      el.addEventListener('aui-menu-click', (event) => event.preventDefault());
      part(el, 'menu-button')!.click();
      await wrapper.querySelector<AuiDrawer>('aui-drawer')!.updateComplete;
      expect(wrapper.querySelector<AuiDrawer>('aui-drawer')!.open).to.be.false;
    });

    it('ignores the state of other drawers', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-navbar brand="Anchor UI" menu-drawer="site-menu"></aui-navbar>
          <aui-drawer id="site-menu" heading="Menu"></aui-drawer>
          <aui-drawer id="other" heading="Other"></aui-drawer>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      const other = wrapper.querySelector<AuiDrawer>('#other')!;
      const shown = oneEvent(other, 'aui-after-show');
      other.open = true;
      await shown;
      await el.updateComplete;
      expect(part(el, 'menu-button')!.getAttribute('aria-expanded')).to.equal('false');
      await other.hide();
    });
  });

  describe('search', () => {
    it('emits aui-search on click, named by its label and announcing the shortcut', async () => {
      const el = await fixture<AuiNavbar>(
        html`<aui-navbar brand="X" search-label="Search docs"></aui-navbar>`,
      );
      const button = part(el, 'search-button')!;
      expect(button.getAttribute('aria-label')).to.equal('Search docs');
      expect(button.getAttribute('aria-keyshortcuts')).to.equal(apple ? 'Meta+K' : 'Control+K');
      expect(el.shadowRoot!.querySelector('aui-kbd')!.textContent).to.equal(
        apple ? '⌘K' : 'Ctrl K',
      );

      const searched = oneEvent(el, 'aui-search');
      button.click();
      expect(((await searched) as CustomEvent<NavbarSearchDetail>).detail.source).to.equal('click');
    });

    it('matches the shortcut by key, falling back to the physical key on non-Latin layouts', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="Anchor UI"></aui-navbar>`);
      let searches = 0;
      el.addEventListener('aui-search', () => searches++);
      const press = (key: string, code: string) =>
        document.dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            code,
            metaKey: apple,
            ctrlKey: !apple,
            bubbles: true,
            cancelable: true,
          }),
        );
      // 注音等非拉丁配置：同一顆鍵的 key 不是英文字母
      press('ㄜ', 'KeyK');
      expect(searches, 'non-Latin layout, physical K').to.equal(1);
      // Dvorak：K 在 KeyV 的位置
      press('k', 'KeyV');
      expect(searches, 'Latin layout, key is k').to.equal(2);
      // Dvorak：KeyK 的位置是 t，不可觸發（否則 Ctrl+T 會變成搜尋）
      press('t', 'KeyK');
      expect(searches, 'Latin layout, another letter on KeyK').to.equal(2);
    });

    it('emits aui-search on the keyboard shortcut and prevents the browser default', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      let defaultPrevented = false;
      const listener = (event: KeyboardEvent) => (defaultPrevented = event.defaultPrevented);
      window.addEventListener('keydown', listener);
      try {
        const searched = oneEvent(el, 'aui-search');
        await sendKeys({ press: shortcut });
        const event = (await searched) as CustomEvent<NavbarSearchDetail>;
        expect(event.detail.source).to.equal('shortcut');
        expect(defaultPrevented).to.be.true;
      } finally {
        window.removeEventListener('keydown', listener);
      }
    });

    it('ignores other key combinations', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      let count = 0;
      el.addEventListener('aui-search', () => count++);
      await sendKeys({ press: 'k' });
      await sendKeys({ press: apple ? 'Meta+Shift+k' : 'Control+Shift+k' });
      await sendKeys({ press: apple ? 'Control+k' : 'Alt+k' });
      expect(count).to.equal(0);
    });

    it('can disable the shortcut, or the whole search button', async () => {
      const el = await fixture<AuiNavbar>(
        html`<aui-navbar brand="X" no-search-shortcut></aui-navbar>`,
      );
      let count = 0;
      el.addEventListener('aui-search', () => count++);
      await sendKeys({ press: shortcut });
      expect(count).to.equal(0);
      expect(part(el, 'search-button')!.hasAttribute('aria-keyshortcuts')).to.be.false;
      expect(el.shadowRoot!.querySelector('aui-kbd')).to.be.null;

      el.noSearchShortcut = false;
      el.noSearch = true;
      await el.updateComplete;
      expect(part(el, 'search-button')).to.be.null;
      await sendKeys({ press: shortcut });
      expect(count).to.equal(0);
    });

    it('ignores the shortcut while a modal outside the navbar is open', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <aui-navbar brand="X"></aui-navbar>
          <aui-modal heading="Busy"></aui-modal>
        </div>
      `);
      const el = wrapper.querySelector<AuiNavbar>('aui-navbar')!;
      const modal = wrapper.querySelector<AuiModal>('aui-modal')!;
      let count = 0;
      el.addEventListener('aui-search', () => count++);
      const shown = oneEvent(modal, 'aui-after-show');
      modal.open = true;
      await shown;
      await sendKeys({ press: shortcut });
      expect(count).to.equal(0);
      await modal.hide();
    });

    it('responds to the shortcut inside the open modal, also through a shadow root', async () => {
      const modal = await fixture<AuiModal>(html`<aui-modal heading="Host"></aui-modal>`);
      const host = document.createElement('div');
      host.attachShadow({ mode: 'open' }).innerHTML = '<aui-navbar brand="X"></aui-navbar>';
      modal.appendChild(host);
      const el = host.shadowRoot!.querySelector<AuiNavbar>('aui-navbar')!;
      await el.updateComplete;

      const shown = oneEvent(modal, 'aui-after-show');
      modal.open = true;
      await shown;
      const searched = oneEvent(el, 'aui-search');
      await sendKeys({ press: shortcut });
      expect(((await searched) as CustomEvent<NavbarSearchDetail>).detail.source).to.equal(
        'shortcut',
      );
      await modal.hide();
    });

    it('stops listening for the shortcut after being removed', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      let count = 0;
      el.addEventListener('aui-search', () => count++);
      el.remove();
      await sendKeys({ press: shortcut });
      expect(count).to.equal(0);
    });
  });

  describe('theme toggle', () => {
    it('is a switch reflecting the page theme', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      const toggle = part(el, 'theme-toggle')!;
      expect(toggle.getAttribute('role')).to.equal('switch');
      expect(toggle.getAttribute('aria-label')).to.equal('深色模式');
      expect(toggle.getAttribute('aria-checked')).to.equal('false');

      // 其他地方切換主題時同步更新
      setTheme('dark', { transition: false });
      await new Promise((resolve) => setTimeout(resolve));
      await el.updateComplete;
      expect(part(el, 'theme-toggle')!.getAttribute('aria-checked')).to.equal('true');
    });

    it('switches the theme after a cancelable aui-theme-change', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      const changed = oneEvent(el, 'aui-theme-change');
      part(el, 'theme-toggle')!.click();
      const event = (await changed) as CustomEvent<NavbarThemeChangeDetail>;
      expect(event.cancelable).to.be.true;
      expect(event.detail.theme).to.equal('dark');
      expect(getTheme()).to.equal('dark');
      await new Promise((resolve) => setTimeout(resolve));
      await el.updateComplete;
      expect(part(el, 'theme-toggle')!.getAttribute('aria-checked')).to.equal('true');

      part(el, 'theme-toggle')!.click();
      expect(getTheme()).to.equal('light');
    });

    it('leaves the theme alone when aui-theme-change is cancelled', async () => {
      const el = await fixture<AuiNavbar>(html`<aui-navbar brand="X"></aui-navbar>`);
      el.addEventListener('aui-theme-change', (event) => event.preventDefault());
      part(el, 'theme-toggle')!.click();
      expect(getTheme()).to.equal('light');
    });

    it('can be hidden', async () => {
      const el = await fixture<AuiNavbar>(
        html`<aui-navbar brand="X" no-theme-toggle></aui-navbar>`,
      );
      expect(part(el, 'theme-toggle')).to.be.null;
    });
  });
});
