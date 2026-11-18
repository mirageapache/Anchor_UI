import { LitElement, html, nothing, svg, type PropertyValues, type SVGTemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getTheme, setTheme, type Theme } from '../../theme.js';
import { safeHref } from '../../internal/safe-href.js';
import { hasLightContent, LightContentController } from '../../internal/slot.js';
import { getTopModalLayer } from '../../internal/top-layer.js';
import '../kbd/index.js';
import { navbarStyles } from './navbar.styles.js';
import type {
  NavbarPosition,
  NavbarSearchDetail,
  NavbarThemeChangeDetail,
} from './navbar.types.js';

/** 以 `menu-drawer` 指定的抽屜（不直接依賴 <aui-drawer>，任何具備 open / show() 的元素皆可） */
interface MenuDrawer extends HTMLElement {
  open?: boolean;
  show?: () => unknown;
}

/** Apple 平台的修飾鍵為 ⌘（Meta），其他平台為 Ctrl */
function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return /mac|iphone|ipad|ipod/i.test(nav.userAgentData?.platform || nav.platform || '');
}

/** ancestor 是否包含 node（穿透 Shadow DOM：從 node 沿 parentNode 與 Shadow Root 的 host 往上找） */
function composedContains(ancestor: Node, node: Node): boolean {
  for (let current: Node | null = node; current;) {
    if (current === ancestor) return true;
    current = current.parentNode ?? (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/** 線條圖示（內部形狀須使用 svg 標籤，html 範本會建立不會渲染的 HTML 命名空間元素） */
const icon = (content: SVGTemplateResult) => html`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${content}
  </svg>
`;

const menuIcon = svg`<path d="M4 6h16M4 12h16M4 18h16"></path>`;
const searchIcon = svg`<circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.35-4.35"></path>`;
const sunIcon = svg`<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>`;
const moonIcon = svg`<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

/**
 * Anchor UI — Navbar 元件 (`<aui-navbar>`)
 *
 * 站台頂部導覽列（64px）：品牌 Logo（含 Accent 圓點）、導覽選單、快捷搜尋鈕（內嵌 `⌘K` 鍵帽）
 * 與深淺主題切換開關。預設吸附於頂端（`position`），視窗捲動後顯示陰影（只偵測視窗捲動：
 * 放在自訂的捲動容器中時不會出現陰影）。外層為 `<header>`（banner landmark），一個頁面只應放一個。
 * 不綁定頁面版型、撐滿容器寬度；響應式斷點以 Navbar 自身寬度（container query）判斷，而非視窗寬度。
 *
 * - **窄版（寬度 < 768px）**：導覽選單隱藏，改顯示漢堡選單鈕（44×44px 觸控目標）；搜尋鈕只顯示圖示。
 * - **漢堡選單**：有導覽選單內容時於窄版顯示；設定 `menu-drawer` 而沒有導覽選單內容時，寬版也會顯示
 *   （抽屜是唯一的選單）。點擊時分派可取消的 `aui-menu-click`；設定 `menu-drawer`（與 Navbar 位於同一份文件
 *   或同一個 Shadow Root 的元素 id，通常為 `<aui-drawer>`，任何具備 `show()` 的元素皆可）時，未取消即開啟該元素，
 *   並依其 `aui-after-show` / `aui-after-hide` 同步 `aria-expanded`。抽屜為模態，開啟期間 Navbar 為 inert，
 *   關閉由抽屜自身的關閉鈕、ESC 或遮罩處理。
 * - **搜尋**：點擊搜尋鈕或按下快捷鍵（Apple 平台 ⌘K、其他平台 Ctrl+K）時分派 `aui-search`；
 *   搜尋介面由使用端實作。有其他 modal 開啟時（Navbar 被 inert）快捷鍵不作用。
 * - **主題**：開關反映 `<html data-theme>`（其他地方切換時同步更新）；點擊時分派可取消的 `aui-theme-change`，
 *   未取消即以 `setTheme()` 切換。要自行處理（例如保存偏好）時可在監聽器中 preventDefault 後自行呼叫 `setTheme()`。
 *
 * 內部組合 `<aui-kbd>`（搜尋鈕的鍵帽），載入本元件時會一併註冊。
 *
 * @element aui-navbar
 *
 * @slot - 導覽選單（通常為多個 `<a>`），位於 `<nav>` 內；窄版時隱藏
 * @slot logo - 品牌標誌（如 `<img>` 或 `<svg>`），放在品牌方塊內；未提供時顯示 `brand` 的第一個字
 * @slot actions - 右側的其他操作，位於搜尋鈕與主題開關之間
 *
 * @csspart base - 外層 `<header>`
 * @csspart inner - 內容容器（最大寬度 `--layout-max-width`）
 * @csspart menu-button - 漢堡選單鈕
 * @csspart brand - 品牌區（設定 `brand-href` 時為連結）
 * @csspart logo - 品牌方塊
 * @csspart brand-title - 品牌名稱
 * @csspart nav - 導覽選單的 `<nav>`
 * @csspart actions - 右側操作區
 * @csspart search-button - 搜尋鈕
 * @csspart theme-toggle - 主題切換開關
 *
 * @fires aui-menu-click - 點擊漢堡選單鈕時觸發（可被 preventDefault 取消開啟 `menu-drawer`）
 * @fires aui-search - 點擊搜尋鈕或按下快捷鍵時觸發，`detail.source` 為 `click` 或 `shortcut`
 * @fires aui-theme-change - 點擊主題開關時觸發（可被 preventDefault 取消切換），`detail.theme` 為即將切換到的主題
 */
export class AuiNavbar extends LitElement {
  static override styles = navbarStyles;

  /** 品牌名稱 */
  @property({ type: String })
  brand = '';

  /**
   * 品牌區的連結網址（通常為首頁）；未設定時品牌區不是連結。
   * 只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定（如 `javascript:`）視為未設定
   */
  @property({ type: String, attribute: 'brand-href' })
  brandHref = '';

  /** 定位方式 */
  @property({ type: String, reflect: true })
  position: NavbarPosition = 'sticky';

  /** 漢堡選單要開啟的抽屜 id（與 Navbar 位於同一份文件或同一個 Shadow Root） */
  @property({ type: String, attribute: 'menu-drawer' })
  menuDrawer = '';

  /** 是否不顯示漢堡選單鈕 */
  @property({ type: Boolean, attribute: 'no-menu-button' })
  noMenuButton = false;

  /** 是否不顯示搜尋鈕（快捷鍵也一併停用） */
  @property({ type: Boolean, attribute: 'no-search' })
  noSearch = false;

  /** 是否停用搜尋快捷鍵（⌘K / Ctrl+K） */
  @property({ type: Boolean, attribute: 'no-search-shortcut' })
  noSearchShortcut = false;

  /** 是否不顯示主題切換開關 */
  @property({ type: Boolean, attribute: 'no-theme-toggle' })
  noThemeToggle = false;

  /** 搜尋鈕的文字（同時為其無障礙名稱） */
  @property({ type: String, attribute: 'search-label' })
  searchLabel = '搜尋';

  /** 導覽選單的無障礙名稱 */
  @property({ type: String, attribute: 'nav-label' })
  navLabel = '主要導覽';

  /** 漢堡選單鈕的無障礙名稱 */
  @property({ type: String, attribute: 'menu-label' })
  menuLabel = '開啟選單';

  /** 主題切換開關的無障礙名稱（開關開啟代表深色模式） */
  @property({ type: String, attribute: 'theme-label' })
  themeLabel = '深色模式';

  /** 目前頁面的主題（跟隨 `<html data-theme>`） */
  @state()
  private theme: Theme = 'light';

  /** 頁面是否已捲動（顯示陰影） */
  @state()
  private scrolled = false;

  /** `menu-drawer` 指定的抽屜是否開啟（同步漢堡鈕的 aria-expanded） */
  @state()
  private menuExpanded = false;

  private readonly apple = isApplePlatform();
  private themeObserver?: MutationObserver;

  /**
   * 目前開啟中的 `menu-drawer`：直接在它身上監聽關閉。抽屜開啟中被移出頁面時，
   * 補發的 aui-after-hide 分派在已脫離文件的元素上、傳不到 document，因此不能只靠 document 的監聽
   */
  private openDrawer: MenuDrawer | null = null;

  constructor() {
    super();
    // light DOM 變動時重新渲染，讓導覽選單與 Logo 的顯示狀態保持最新
    new LightContentController(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncTheme();
    if (typeof MutationObserver !== 'undefined') {
      this.themeObserver ??= new MutationObserver(this.syncTheme);
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('keydown', this.handleShortcut);
    document.addEventListener('aui-after-show', this.handleDrawerShown);
    // 重新插入頁面時（斷開時已停止追蹤），抽屜可能仍開著：重新同步 aria-expanded
    if (this.hasUpdated) {
      const drawer = this.resolveMenuDrawer();
      this.trackOpenDrawer(drawer?.open ? drawer : null);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.themeObserver?.disconnect();
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleShortcut);
    document.removeEventListener('aui-after-show', this.handleDrawerShown);
    this.trackOpenDrawer(null);
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('menuDrawer')) {
      const drawer = this.resolveMenuDrawer();
      this.trackOpenDrawer(drawer?.open ? drawer : null);
    }
  }

  /** 依 id 在 Navbar 所在的文件（或 Shadow Root）中尋找抽屜 */
  private resolveMenuDrawer(): MenuDrawer | null {
    if (!this.menuDrawer || !this.isConnected) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    return (root.getElementById?.(this.menuDrawer) as MenuDrawer | null) ?? null;
  }

  private syncTheme = () => {
    this.theme = getTheme();
  };

  private handleScroll = () => {
    this.scrolled = window.scrollY > 0;
  };

  /** 開始（或停止）追蹤開啟中的抽屜，並同步 aria-expanded */
  private trackOpenDrawer(drawer: MenuDrawer | null): void {
    this.openDrawer?.removeEventListener('aui-after-hide', this.handleDrawerHidden);
    this.openDrawer = drawer;
    drawer?.addEventListener('aui-after-hide', this.handleDrawerHidden);
    this.menuExpanded = Boolean(drawer);
  }

  /** 抽屜開啟完成（aui-after-show 為 composed，在 document 監聽即可收到；內容中其他浮層的同名事件不算） */
  private handleDrawerShown = (event: Event) => {
    const drawer = this.resolveMenuDrawer();
    if (drawer && event.composedPath()[0] === drawer) this.trackOpenDrawer(drawer);
  };

  /** 抽屜關閉完成（忽略抽屜內容中 Modal、Tooltip 等冒泡上來的同名事件） */
  private handleDrawerHidden = (event: Event) => {
    if (event.composedPath()[0] === this.openDrawer) this.trackOpenDrawer(null);
  };

  private handleMenuClick = () => {
    const proceed = this.dispatchEvent(
      new CustomEvent('aui-menu-click', { bubbles: true, composed: true, cancelable: true }),
    );
    const drawer = this.resolveMenuDrawer();
    if (proceed && typeof drawer?.show === 'function') void drawer.show();
  };

  private dispatchSearch(source: NavbarSearchDetail['source']): void {
    this.dispatchEvent(
      new CustomEvent<NavbarSearchDetail>('aui-search', {
        detail: { source },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleSearchClick = () => {
    this.dispatchSearch('click');
  };

  private handleShortcut = (event: KeyboardEvent) => {
    if (this.noSearch || this.noSearchShortcut || event.defaultPrevented || event.isComposing) {
      return;
    }
    const modifier = this.apple ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
    if (!modifier || event.altKey || event.shiftKey) return;
    // 以 key 判斷（Dvorak 等配置下 K 不在 KeyK 的位置）；非拉丁字母的鍵盤配置（注音、西里爾字母等）
    // 按下同一顆鍵時 key 不是英文字母，才退回以實體鍵位判斷
    const key = event.key?.toLowerCase() ?? '';
    if (key !== 'k' && (/^[a-z]$/.test(key) || event.code !== 'KeyK')) return;
    // 其他 modal 開啟時 Navbar 被 inert，不應回應快捷鍵（Navbar 位於該 modal 內時除外）
    const topModal = getTopModalLayer();
    if (topModal && !composedContains(topModal, this)) return;
    event.preventDefault();
    this.dispatchSearch('shortcut');
  };

  private handleThemeToggle = () => {
    const theme: Theme = this.theme === 'dark' ? 'light' : 'dark';
    const proceed = this.dispatchEvent(
      new CustomEvent<NavbarThemeChangeDetail>('aui-theme-change', {
        detail: { theme },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    if (proceed) setTheme(theme);
  };

  private renderBrand() {
    const hasLogo = hasLightContent(this, 'logo');
    if (!this.brand && !hasLogo) return nothing;
    const initial = [...this.brand.trim()][0]?.toUpperCase() ?? '';
    const content = html`
      <span class="navbar__logo" part="logo">
        <slot name="logo"><span aria-hidden="true">${initial}</span></slot>
        <span class="navbar__dot"></span>
      </span>
      ${this.brand ? html`<span class="navbar__title" part="brand-title">${this.brand}</span>` : nothing}
    `;
    const href = this.brandHref ? safeHref(this.brandHref) : undefined;
    return href
      ? html`<a class="navbar__brand" part="brand" href=${href}>${content}</a>`
      : html`<span class="navbar__brand" part="brand">${content}</span>`;
  }

  private renderSearch() {
    if (this.noSearch) return nothing;
    const shortcut = !this.noSearchShortcut;
    return html`
      <button
        class="navbar__search"
        part="search-button"
        type="button"
        aria-label=${this.searchLabel}
        aria-keyshortcuts=${ifDefined(shortcut ? (this.apple ? 'Meta+K' : 'Control+K') : undefined)}
        @click=${this.handleSearchClick}
      >
        ${icon(searchIcon)}
        <span class="navbar__search-text">${this.searchLabel}</span>
        ${
          shortcut
            ? html`<aui-kbd class="navbar__kbd" size="sm">${this.apple ? '⌘K' : 'Ctrl K'}</aui-kbd>`
            : nothing
        }
      </button>
    `;
  }

  override render() {
    const hasNav = hasLightContent(this);
    const showMenuButton = !this.noMenuButton && (hasNav || Boolean(this.menuDrawer));
    // 沒有導覽選單內容、只有 menu-drawer 時，抽屜是唯一的選單：寬版也顯示漢堡鈕
    const menuAlways = !hasNav && Boolean(this.menuDrawer);
    const dark = this.theme === 'dark';

    // 外層使用 <header>：Navbar 是全站頁首，對應 banner landmark
    return html`
      <header class=${classMap({ navbar: true, 'navbar--scrolled': this.scrolled })} part="base">
        <div class="navbar__inner" part="inner">
          ${
            showMenuButton
              ? html`<button
                  class=${classMap({
                    'navbar__icon-button': true,
                    navbar__menu: true,
                    'navbar__menu--always': menuAlways,
                  })}
                  part="menu-button"
                  type="button"
                  aria-label=${this.menuLabel}
                  aria-expanded=${ifDefined(this.menuDrawer ? String(this.menuExpanded) : undefined)}
                  @click=${this.handleMenuClick}
                >
                  ${icon(menuIcon)}
                </button>`
              : nothing
          }
          ${this.renderBrand()}
          <nav class="navbar__nav" part="nav" aria-label=${this.navLabel} ?hidden=${!hasNav}>
            <slot></slot>
          </nav>
          <div class="navbar__actions" part="actions">
            ${this.renderSearch()}
            <slot name="actions"></slot>
            ${
              this.noThemeToggle
                ? nothing
                : html`<button
                    class="navbar__icon-button"
                    part="theme-toggle"
                    type="button"
                    role="switch"
                    aria-checked=${String(dark)}
                    aria-label=${this.themeLabel}
                    @click=${this.handleThemeToggle}
                  >
                    ${icon(dark ? moonIcon : sunIcon)}
                  </button>`
            }
          </div>
        </div>
      </header>
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-navbar')) {
  customElements.define('aui-navbar', AuiNavbar);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-navbar': AuiNavbar;
  }
}
