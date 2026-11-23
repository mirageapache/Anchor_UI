import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,i as n,n as r,s as i,t as a,u as o}from"./lit-Bfdqhiqf.js";import{f as s,i as c,m as l,r as u,t as d,u as f}from"./decorate-mVVnLxoL.js";import{a as p,i as m,o as h,r as ee}from"./play-utils-DSBujCgb.js";import{t as g}from"./button-D3WHfR8E.js";import{r as _,t as v}from"./if-defined-vfYzS9xW.js";import{i as y,r as b}from"./top-layer-BSIlDQkG.js";import{n as x,r as te,t as S}from"./slot-Cf9Xcx_i.js";import{n as C,t as w}from"./safe-href-B-NWD6GY.js";import{t as T}from"./drawer-BN51nWAr.js";import{t as E}from"./kbd-TGJu8pn5.js";function ne(e,t={}){if(typeof document>`u`)return;let n=document.documentElement,r=t.transition??!0;r&&n.classList.add(`theme-transitioning`),e===`dark`?n.setAttribute(`data-theme`,`dark`):n.removeAttribute(`data-theme`),r&&(clearTimeout(O),O=setTimeout(()=>n.classList.remove(`theme-transitioning`),250))}function D(){return typeof document<`u`&&document.documentElement.getAttribute(`data-theme`)===`dark`?`dark`:`light`}var O;function k(){return(k=e((()=>{})))()}var A;function j(){return(j=e((()=>{a(),A=t`
  /*
   * host 即吸附的元素（sticky 以 host 在頁面中的位置計算），並作為 container query 的容器：
   * 響應式斷點依 Navbar 自身寬度判斷，嵌入側欄或窄欄位時也能正確切換。
   * inline-size containment 讓 host 的內容寬度視為 0：放在 flex / inline-block 等依內容決定寬度的容器中
   * 會縮成一團，因此明確撐滿容器寬度
   */
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
    container: aui-navbar / inline-size;
  }

  :host([position='fixed']) {
    position: fixed;
    right: 0;
    left: 0;
  }

  :host([position='static']) {
    position: static;
  }

  [hidden] {
    display: none !important;
  }

  .navbar {
    box-sizing: border-box;
    height: var(--nav-height, 64px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    border-bottom: 1px solid var(--color-border, #e2e8f0);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease),
      box-shadow var(--transition-base, 150ms ease);
  }

  /* 頁面捲動後（吸附中）顯示陰影，與內容區分層 */
  :host(:not([position='static'])) .navbar--scrolled {
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  .navbar__inner {
    display: flex;
    align-items: center;
    gap: var(--space-md, 16px);
    box-sizing: border-box;
    height: 100%;
    max-width: var(--layout-max-width, 1600px);
    margin-inline: auto;
    padding-inline: var(--layout-gutter, 24px);
  }

  /* ─── 圖示按鈕（漢堡選單、主題開關） ─── */
  .navbar__icon-button {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    color: var(--color-text-secondary, #475569);
    background: transparent;
    border: 0;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  .navbar__icon-button:hover {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  .navbar__icon-button svg,
  .navbar__search svg {
    flex: none;
    width: 18px;
    height: 18px;
  }

  /* 寬版不顯示漢堡選單鈕（窄版見下方 container query）；抽屜是唯一的選單時例外 */
  .navbar__menu:not(.navbar__menu--always) {
    display: none;
  }

  /* ─── 品牌 ─── */
  .navbar__brand {
    display: inline-flex;
    flex: 0 1 auto;
    min-width: 0;
    align-items: center;
    gap: 10px;
    color: inherit;
    text-decoration: none;
    border-radius: var(--radius-md, 8px);
  }

  .navbar__logo {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-bold, 700);
    color: var(--color-on-solid, #ffffff);
    background: var(--color-brand-600, #0f4c81);
    border-radius: var(--radius-md, 8px);
  }

  .navbar__logo ::slotted(img),
  .navbar__logo ::slotted(svg) {
    max-width: 24px;
    max-height: 24px;
  }

  /* Accent 亮點圓點 */
  .navbar__dot {
    position: absolute;
    right: -2px;
    bottom: -2px;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    background: var(--color-accent, #f59e0b);
    border: 2px solid var(--color-brand-600, #0f4c81);
    border-radius: 50%;
  }

  .navbar__title {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─── 導覽選單 ─── */
  .navbar__nav {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: var(--space-xs, 4px);
    min-width: 0;
  }

  .navbar__nav ::slotted(a) {
    padding: 6px 10px;
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--color-text-secondary, #475569);
    text-decoration: none;
    white-space: nowrap;
    border-radius: var(--radius-sm, 6px);
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  .navbar__nav ::slotted(a:hover),
  .navbar__nav ::slotted(a[aria-current='page']) {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  /* ─── 右側操作 ─── */
  .navbar__actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--space-sm, 8px);
    margin-left: auto;
  }

  .navbar__search {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    min-width: 200px;
    min-height: 36px;
    padding: 0 6px 0 12px;
    font: inherit;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #475569);
    background: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      border-color var(--transition-base, 150ms ease),
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease);
  }

  .navbar__search:hover {
    color: var(--color-text-primary, #0f172a);
    border-color: var(--color-brand-500, #1b6ca8);
  }

  .navbar__search-text {
    flex: 1;
    text-align: left;
  }

  .navbar__icon-button:focus-visible,
  .navbar__search:focus-visible,
  .navbar__brand:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 窄版：隱藏導覽選單、顯示漢堡鈕，搜尋鈕只留圖示 ─── */
  @container aui-navbar (width < 768px) {
    .navbar__inner {
      gap: var(--space-sm, 8px);
      padding-inline: var(--space-md, 16px);
    }

    .navbar__nav {
      display: none;
    }

    /* 窄版多為觸控裝置：圖示按鈕放大為 44×44px 觸控目標（漢堡鈕的規範下限） */
    .navbar__icon-button,
    .navbar__search {
      width: 44px;
      height: 44px;
    }

    /* 與寬版的隱藏規則相同的選擇器（特異性），才能覆蓋 */
    .navbar__menu:not(.navbar__menu--always) {
      display: inline-flex;
    }

    .navbar__menu {
      margin-left: -10px;
    }

    .navbar__search {
      justify-content: center;
      min-width: 0;
      padding: 0;
    }

    .navbar__search-text,
    .navbar__kbd {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .navbar,
    .navbar__icon-button,
    .navbar__search,
    .navbar__nav ::slotted(a) {
      transition: none;
    }
  }
`})))()}function M(){if(typeof navigator>`u`)return!1;let e=navigator;return/mac|iphone|ipad|ipod/i.test(e.userAgentData?.platform||e.platform||``)}function N(e,t){for(let n=t;n;){if(n===e)return!0;n=n.parentNode??(n instanceof ShadowRoot?n.host:null)}return!1}var P,F,I,L,R,z;function B(){return(B=e((()=>{a(),f(),u(),v(),k(),w(),te(),y(),E(),j(),P=e=>i`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${e}
  </svg>
`,F=o`<path d="M4 6h16M4 12h16M4 18h16"></path>`,I=o`<circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.35-4.35"></path>`,L=o`<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>`,R=o`<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`,z=class extends r{static{this.styles=A}constructor(){super(),this.brand=``,this.brandHref=``,this.position=`sticky`,this.menuDrawer=``,this.noMenuButton=!1,this.noSearch=!1,this.noSearchShortcut=!1,this.noThemeToggle=!1,this.searchLabel=`搜尋`,this.navLabel=`主要導覽`,this.menuLabel=`開啟選單`,this.themeLabel=`深色模式`,this.theme=`light`,this.scrolled=!1,this.menuExpanded=!1,this.apple=M(),this.openDrawer=null,this.syncTheme=()=>{this.theme=D()},this.handleScroll=()=>{this.scrolled=window.scrollY>0},this.handleDrawerShown=e=>{let t=this.resolveMenuDrawer();t&&e.composedPath()[0]===t&&this.trackOpenDrawer(t)},this.handleDrawerHidden=e=>{e.composedPath()[0]===this.openDrawer&&this.trackOpenDrawer(null)},this.handleMenuClick=()=>{let e=this.dispatchEvent(new CustomEvent(`aui-menu-click`,{bubbles:!0,composed:!0,cancelable:!0})),t=this.resolveMenuDrawer();e&&typeof t?.show==`function`&&t.show()},this.handleSearchClick=()=>{this.dispatchSearch(`click`)},this.handleShortcut=e=>{if(this.noSearch||this.noSearchShortcut||e.defaultPrevented||e.isComposing||!(this.apple?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey)||e.altKey||e.shiftKey)return;let t=e.key?.toLowerCase()??``;if(t!==`k`&&(/^[a-z]$/.test(t)||e.code!==`KeyK`))return;let n=b();(!n||N(n,this))&&(e.preventDefault(),this.dispatchSearch(`shortcut`))},this.handleThemeToggle=()=>{let e=this.theme===`dark`?`light`:`dark`;this.dispatchEvent(new CustomEvent(`aui-theme-change`,{detail:{theme:e},bubbles:!0,composed:!0,cancelable:!0}))&&ne(e)},new S(this)}connectedCallback(){if(super.connectedCallback(),this.syncTheme(),typeof MutationObserver<`u`&&(this.themeObserver??=new MutationObserver(this.syncTheme),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`]})),this.handleScroll(),window.addEventListener(`scroll`,this.handleScroll,{passive:!0}),document.addEventListener(`keydown`,this.handleShortcut),document.addEventListener(`aui-after-show`,this.handleDrawerShown),this.hasUpdated){let e=this.resolveMenuDrawer();this.trackOpenDrawer(e?.open?e:null)}}disconnectedCallback(){super.disconnectedCallback(),this.themeObserver?.disconnect(),window.removeEventListener(`scroll`,this.handleScroll),document.removeEventListener(`keydown`,this.handleShortcut),document.removeEventListener(`aui-after-show`,this.handleDrawerShown),this.trackOpenDrawer(null)}willUpdate(e){if(e.has(`menuDrawer`)){let e=this.resolveMenuDrawer();this.trackOpenDrawer(e?.open?e:null)}}resolveMenuDrawer(){return!this.menuDrawer||!this.isConnected?null:this.getRootNode().getElementById?.(this.menuDrawer)??null}trackOpenDrawer(e){this.openDrawer?.removeEventListener(`aui-after-hide`,this.handleDrawerHidden),this.openDrawer=e,e?.addEventListener(`aui-after-hide`,this.handleDrawerHidden),this.menuExpanded=!!e}dispatchSearch(e){this.dispatchEvent(new CustomEvent(`aui-search`,{detail:{source:e},bubbles:!0,composed:!0}))}renderBrand(){let e=x(this,`logo`);if(!this.brand&&!e)return n;let t=[...this.brand.trim()][0]?.toUpperCase()??``,r=i`
      <span class="navbar__logo" part="logo">
        <slot name="logo"><span aria-hidden="true">${t}</span></slot>
        <span class="navbar__dot"></span>
      </span>
      ${this.brand?i`<span class="navbar__title" part="brand-title">${this.brand}</span>`:n}
    `,a=this.brandHref?C(this.brandHref):void 0;return a?i`<a class="navbar__brand" part="brand" href=${a}>${r}</a>`:i`<span class="navbar__brand" part="brand">${r}</span>`}renderSearch(){if(this.noSearch)return n;let e=!this.noSearchShortcut;return i`
      <button
        class="navbar__search"
        part="search-button"
        type="button"
        aria-label=${this.searchLabel}
        aria-keyshortcuts=${_(e?this.apple?`Meta+K`:`Control+K`:void 0)}
        @click=${this.handleSearchClick}
      >
        ${P(I)}
        <span class="navbar__search-text">${this.searchLabel}</span>
        ${e?i`<aui-kbd class="navbar__kbd" size="sm">${this.apple?`⌘K`:`Ctrl K`}</aui-kbd>`:n}
      </button>
    `}render(){let e=x(this),t=!this.noMenuButton&&(e||!!this.menuDrawer),r=!e&&!!this.menuDrawer,a=this.theme===`dark`;return i`
      <header class=${c({navbar:!0,"navbar--scrolled":this.scrolled})} part="base">
        <div class="navbar__inner" part="inner">
          ${t?i`<button
                  class=${c({"navbar__icon-button":!0,navbar__menu:!0,"navbar__menu--always":r})}
                  part="menu-button"
                  type="button"
                  aria-label=${this.menuLabel}
                  aria-expanded=${_(this.menuDrawer?String(this.menuExpanded):void 0)}
                  @click=${this.handleMenuClick}
                >
                  ${P(F)}
                </button>`:n}
          ${this.renderBrand()}
          <nav class="navbar__nav" part="nav" aria-label=${this.navLabel} ?hidden=${!e}>
            <slot></slot>
          </nav>
          <div class="navbar__actions" part="actions">
            ${this.renderSearch()}
            <slot name="actions"></slot>
            ${this.noThemeToggle?n:i`<button
                    class="navbar__icon-button"
                    part="theme-toggle"
                    type="button"
                    role="switch"
                    aria-checked=${String(a)}
                    aria-label=${this.themeLabel}
                    @click=${this.handleThemeToggle}
                  >
                    ${P(a?R:L)}
                  </button>`}
          </div>
        </div>
      </header>
    `}},d([l({type:String})],z.prototype,`brand`,void 0),d([l({type:String,attribute:`brand-href`})],z.prototype,`brandHref`,void 0),d([l({type:String,reflect:!0})],z.prototype,`position`,void 0),d([l({type:String,attribute:`menu-drawer`})],z.prototype,`menuDrawer`,void 0),d([l({type:Boolean,attribute:`no-menu-button`})],z.prototype,`noMenuButton`,void 0),d([l({type:Boolean,attribute:`no-search`})],z.prototype,`noSearch`,void 0),d([l({type:Boolean,attribute:`no-search-shortcut`})],z.prototype,`noSearchShortcut`,void 0),d([l({type:Boolean,attribute:`no-theme-toggle`})],z.prototype,`noThemeToggle`,void 0),d([l({type:String,attribute:`search-label`})],z.prototype,`searchLabel`,void 0),d([l({type:String,attribute:`nav-label`})],z.prototype,`navLabel`,void 0),d([l({type:String,attribute:`menu-label`})],z.prototype,`menuLabel`,void 0),d([l({type:String,attribute:`theme-label`})],z.prototype,`themeLabel`,void 0),d([s()],z.prototype,`theme`,void 0),d([s()],z.prototype,`scrolled`,void 0),d([s()],z.prototype,`menuExpanded`,void 0),customElements.get(`aui-navbar`)||customElements.define(`aui-navbar`,z)})))()}function V(){return(V=e((()=>{B()})))()}var H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{a(),V(),T(),g(),p(),{expect:H,userEvent:U,waitFor:W}=__STORYBOOK_MODULE_TEST__,G=[`總覽`,`元件`,`設計 Token`,`更新紀錄`],K=()=>G.map((e,t)=>i`<a
        href="#"
        aria-current=${t===1?`page`:`false`}
        @click=${e=>e.preventDefault()}
        >${e}</a
      >`),q=i`
  <main style="padding: 24px; max-width: 720px;">
    ${Array.from({length:12},(e,t)=>i`<p>第 ${t+1} 段：往下捲動時 Navbar 吸附於頂端，並在頁面捲動後顯示陰影。</p>`)}
  </main>
`,J={title:`Components/Navbar`,component:`aui-navbar`,parameters:{layout:`fullscreen`,docs:{description:{component:'\n**Anchor UI — Navbar 頂部導覽列 (`<aui-navbar>`)**\n\n64px 站台頂部導覽列：品牌 Logo（含 Accent 圓點）、導覽選單（預設 slot）、快捷搜尋鈕（內嵌 `⌘K` / `Ctrl K` 鍵帽）與深淺主題切換開關。\n預設吸附於頂端（`position="sticky"`），頁面捲動後顯示陰影。響應式斷點以 Navbar 自身寬度判斷：寬度小於 768px 時隱藏導覽選單、改顯示漢堡選單鈕。\n\n- **漢堡選單**：設定 `menu-drawer` 為 `<aui-drawer>` 的 id 即可開啟抽屜並同步 `aria-expanded`；也可監聽可取消的 `aui-menu-click` 自行處理。\n- **搜尋**：點擊或按下快捷鍵時分派 `aui-search`，搜尋介面由使用端實作；`no-search-shortcut` 可停用快捷鍵。\n- **主題**：點擊開關時分派可取消的 `aui-theme-change`，未取消即以 `setTheme()` 切換。\n        '}}},argTypes:{brand:{control:`text`,description:`品牌名稱`},position:{control:`inline-radio`,options:[`sticky`,`fixed`,`static`],table:{defaultValue:{summary:`sticky`}}},noSearch:{control:`boolean`,table:{defaultValue:{summary:`false`}}},noSearchShortcut:{control:`boolean`,table:{defaultValue:{summary:`false`}}},noThemeToggle:{control:`boolean`,table:{defaultValue:{summary:`false`}}},searchLabel:{control:`text`,table:{defaultValue:{summary:`搜尋`}}}},args:{brand:`Anchor UI`,position:`sticky`,noSearch:!1,noSearchShortcut:!1,noThemeToggle:!1,searchLabel:`搜尋`}},Y={render:e=>i`
      <div>
        <aui-navbar
          brand=${e.brand}
          brand-href="#"
          .position=${e.position}
          ?no-search=${e.noSearch}
          ?no-search-shortcut=${e.noSearchShortcut}
          ?no-theme-toggle=${e.noThemeToggle}
          search-label=${e.searchLabel}
          @aui-search=${e=>{let{source:t}=e.detail,n=e.currentTarget.parentElement.querySelector(`output`);n.textContent=`aui-search（${t===`shortcut`?`快捷鍵`:`點擊`}）`}}
        >
          ${K()}
        </aui-navbar>
        <output
          style="display: block; padding: 12px 24px 0; font-family: var(--font-mono); font-size: 12px;"
        ></output>
        ${q}
      </div>
    `},X={name:`With drawer (menu-drawer)`,render:()=>i`
    <div style="max-width: 480px; border: 1px dashed var(--color-border);">
      <aui-navbar brand="Anchor UI" brand-href="#" menu-drawer="story-site-menu">
        ${K()}
      </aui-navbar>
      <aui-drawer id="story-site-menu" heading="Anchor UI">
        <nav aria-label="主要導覽" style="display: flex; flex-direction: column; gap: 4px;">
          ${G.map(e=>i`<a
                href="#"
                style="padding: 8px 12px; color: var(--color-text-primary); text-decoration: none;"
                @click=${e=>{e.preventDefault(),e.currentTarget.closest(`aui-drawer`).hide()}}
                >${e}</a
              >`)}
        </nav>
      </aui-drawer>
      <p style="padding: 0 16px; font-size: 13px;">
        容器寬度小於 768px，導覽選單收進漢堡選單；點擊後開啟 id 為 menu-drawer 的抽屜。
      </p>
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=h(e,`aui-navbar`),r=h(e,`aui-drawer`),i=m(n,`[part="menu-button"]`);await t(`窄版顯示漢堡選單鈕，導覽選單隱藏`,async()=>{await H(getComputedStyle(i).display).not.toBe(`none`),await H(getComputedStyle(m(n,`[part="nav"]`)).display).toBe(`none`),await H(i.getAttribute(`aria-expanded`)).toBe(`false`)}),await t(`點擊漢堡鈕開啟抽屜，aria-expanded 為 true`,async()=>{await U.click(i),await W(()=>H(m(r,`dialog`).open).toBe(!0)),await W(()=>H(i.getAttribute(`aria-expanded`)).toBe(`true`))}),await t(`點選抽屜中的連結後關閉，焦點回到漢堡鈕`,async()=>{await U.click(h(r,`a`)),await W(()=>H(m(r,`dialog`).open).toBe(!1)),await W(()=>H(i.getAttribute(`aria-expanded`)).toBe(`false`)),await W(()=>H(ee()).toBe(i))})}},Z={name:`Custom logo & actions`,render:()=>i`
    <aui-navbar brand="ToolBox" brand-href="#" no-search-shortcut>
      <svg
        slot="logo"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        ></path>
      </svg>
      ${K()}
      <aui-button slot="actions" size="sm" variant="ghost">登入</aui-button>
    </aui-navbar>
  `},Q=[`Default`,`WithDrawer`,`CustomLogoAndActions`],Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => {
    const logSearch = (event: Event) => {
      const {
        source
      } = (event as CustomEvent<NavbarSearchDetail>).detail;
      const output = (event.currentTarget as HTMLElement).parentElement!.querySelector('output')!;
      output.textContent = \`aui-search（\${source === 'shortcut' ? '快捷鍵' : '點擊'}）\`;
    };
    return html\`
      <div>
        <aui-navbar
          brand=\${args.brand}
          brand-href="#"
          .position=\${args.position}
          ?no-search=\${args.noSearch}
          ?no-search-shortcut=\${args.noSearchShortcut}
          ?no-theme-toggle=\${args.noThemeToggle}
          search-label=\${args.searchLabel}
          @aui-search=\${logSearch}
        >
          \${navLinks()}
        </aui-navbar>
        <output
          style="display: block; padding: 12px 24px 0; font-family: var(--font-mono); font-size: 12px;"
        ></output>
        \${pageBody}
      </div>
    \`;
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  name: 'With drawer (menu-drawer)',
  render: () => html\`
    <div style="max-width: 480px; border: 1px dashed var(--color-border);">
      <aui-navbar brand="Anchor UI" brand-href="#" menu-drawer="story-site-menu">
        \${navLinks()}
      </aui-navbar>
      <aui-drawer id="story-site-menu" heading="Anchor UI">
        <nav aria-label="主要導覽" style="display: flex; flex-direction: column; gap: 4px;">
          \${NAV_LINKS.map(label => html\`<a
                href="#"
                style="padding: 8px 12px; color: var(--color-text-primary); text-decoration: none;"
                @click=\${(event: Event) => {
    event.preventDefault();
    void (event.currentTarget as HTMLElement).closest<AuiDrawer>('aui-drawer')!.hide();
  }}
                >\${label}</a
              >\`)}
        </nav>
      </aui-drawer>
      <p style="padding: 0 16px; font-size: 13px;">
        容器寬度小於 768px，導覽選單收進漢堡選單；點擊後開啟 id 為 menu-drawer 的抽屜。
      </p>
    </div>
  \`,
  play: async ({
    canvasElement,
    step
  }) => {
    const navbar = query<AuiNavbar>(canvasElement, 'aui-navbar');
    const drawer = query<AuiDrawer>(canvasElement, 'aui-drawer');
    const menuButton = inShadow(navbar, '[part="menu-button"]');
    await step('窄版顯示漢堡選單鈕，導覽選單隱藏', async () => {
      await expect(getComputedStyle(menuButton).display).not.toBe('none');
      await expect(getComputedStyle(inShadow(navbar, '[part="nav"]')).display).toBe('none');
      await expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });
    await step('點擊漢堡鈕開啟抽屜，aria-expanded 為 true', async () => {
      await userEvent.click(menuButton);
      await waitFor(() => expect(inShadow<HTMLDialogElement>(drawer, 'dialog').open).toBe(true));
      await waitFor(() => expect(menuButton.getAttribute('aria-expanded')).toBe('true'));
    });
    await step('點選抽屜中的連結後關閉，焦點回到漢堡鈕', async () => {
      await userEvent.click(query(drawer, 'a'));
      await waitFor(() => expect(inShadow<HTMLDialogElement>(drawer, 'dialog').open).toBe(false));
      await waitFor(() => expect(menuButton.getAttribute('aria-expanded')).toBe('false'));
      await waitFor(() => expect(deepActiveElement()).toBe(menuButton));
    });
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  name: 'Custom logo & actions',
  render: () => html\`
    <aui-navbar brand="ToolBox" brand-href="#" no-search-shortcut>
      <svg
        slot="logo"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        ></path>
      </svg>
      \${navLinks()}
      <aui-button slot="actions" size="sm" variant="ghost">登入</aui-button>
    </aui-navbar>
  \`
}`,...Z.parameters?.docs?.source}}}})))()}$();export{Z as CustomLogoAndActions,Y as Default,X as WithDrawer,Q as __namedExportsOrder,J as default};