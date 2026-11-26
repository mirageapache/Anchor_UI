import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{a as r,i,o as a,r as o}from"./play-utils-DUto8Om5.js";import{t as s}from"./button-CnMX2etb.js";import{t as c}from"./drawer-KBAG_TCN.js";import{t as l}from"./navbar-Dklzivsw.js";var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),l(),c(),s(),r(),{expect:u,userEvent:d,waitFor:f}=__STORYBOOK_MODULE_TEST__,p=[`總覽`,`元件`,`設計 Token`,`更新紀錄`],m=()=>p.map((e,n)=>t`<a
        href="#"
        aria-current=${n===1?`page`:`false`}
        @click=${e=>e.preventDefault()}
        >${e}</a
      >`),h=t`
  <main style="padding: 24px; max-width: 720px;">
    ${Array.from({length:12},(e,n)=>t`<p>第 ${n+1} 段：往下捲動時 Navbar 吸附於頂端，並在頁面捲動後顯示陰影。</p>`)}
  </main>
`,g={title:`Components/Navbar`,component:`aui-navbar`,parameters:{layout:`fullscreen`,docs:{description:{component:'\n**Anchor UI — Navbar 頂部導覽列 (`<aui-navbar>`)**\n\n64px 站台頂部導覽列：品牌 Logo（含 Accent 圓點）、導覽選單（預設 slot）、快捷搜尋鈕（內嵌 `⌘K` / `Ctrl K` 鍵帽）與深淺主題切換開關。\n預設吸附於頂端（`position="sticky"`），頁面捲動後顯示陰影。響應式斷點以 Navbar 自身寬度判斷：寬度小於 768px 時隱藏導覽選單、改顯示漢堡選單鈕。\n\n- **漢堡選單**：設定 `menu-drawer` 為 `<aui-drawer>` 的 id 即可開啟抽屜並同步 `aria-expanded`；也可監聽可取消的 `aui-menu-click` 自行處理。\n- **搜尋**：點擊或按下快捷鍵時分派 `aui-search`，搜尋介面由使用端實作；`no-search-shortcut` 可停用快捷鍵。\n- **主題**：點擊開關時分派可取消的 `aui-theme-change`，未取消即以 `setTheme()` 切換。\n        '}}},argTypes:{brand:{control:`text`,description:`品牌名稱`},position:{control:`inline-radio`,options:[`sticky`,`fixed`,`static`],table:{defaultValue:{summary:`sticky`}}},noSearch:{control:`boolean`,table:{defaultValue:{summary:`false`}}},noSearchShortcut:{control:`boolean`,table:{defaultValue:{summary:`false`}}},noThemeToggle:{control:`boolean`,table:{defaultValue:{summary:`false`}}},searchLabel:{control:`text`,table:{defaultValue:{summary:`搜尋`}}}},args:{brand:`Anchor UI`,position:`sticky`,noSearch:!1,noSearchShortcut:!1,noThemeToggle:!1,searchLabel:`搜尋`}},_={render:e=>t`
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
          ${m()}
        </aui-navbar>
        <output
          style="display: block; padding: 12px 24px 0; font-family: var(--font-mono); font-size: 12px;"
        ></output>
        ${h}
      </div>
    `},v={name:`With drawer (menu-drawer)`,render:()=>t`
    <div style="max-width: 480px; border: 1px dashed var(--color-border);">
      <aui-navbar brand="Anchor UI" brand-href="#" menu-drawer="story-site-menu">
        ${m()}
      </aui-navbar>
      <aui-drawer id="story-site-menu" heading="Anchor UI">
        <nav aria-label="主要導覽" style="display: flex; flex-direction: column; gap: 4px;">
          ${p.map(e=>t`<a
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
  `,play:async({canvasElement:e,step:t})=>{let n=a(e,`aui-navbar`),r=a(e,`aui-drawer`),s=i(n,`[part="menu-button"]`);await t(`窄版顯示漢堡選單鈕，導覽選單隱藏`,async()=>{await u(getComputedStyle(s).display).not.toBe(`none`),await u(getComputedStyle(i(n,`[part="nav"]`)).display).toBe(`none`),await u(s.getAttribute(`aria-expanded`)).toBe(`false`)}),await t(`點擊漢堡鈕開啟抽屜，aria-expanded 為 true`,async()=>{await d.click(s),await f(()=>u(i(r,`dialog`).open).toBe(!0)),await f(()=>u(s.getAttribute(`aria-expanded`)).toBe(`true`))}),await t(`點選抽屜中的連結後關閉，焦點回到漢堡鈕`,async()=>{await d.click(a(r,`a`)),await f(()=>u(i(r,`dialog`).open).toBe(!1)),await f(()=>u(s.getAttribute(`aria-expanded`)).toBe(`false`)),await f(()=>u(o()).toBe(s))})}},y={name:`Custom logo & actions`,render:()=>t`
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
      ${m()}
      <aui-button slot="actions" size="sm" variant="ghost">登入</aui-button>
    </aui-navbar>
  `},b=[`Default`,`WithDrawer`,`CustomLogoAndActions`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}}})))()}x();export{y as CustomLogoAndActions,_ as Default,v as WithDrawer,b as __namedExportsOrder,g as default};