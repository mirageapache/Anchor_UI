import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,s as n,t as r}from"./lit-DvaG8Cmk.js";import{a as i,o as a}from"./play-utils-DUto8Om5.js";import{t as o}from"./button-CnMX2etb.js";import{t as s}from"./icon-button-CYg_hecX.js";import{i as c,n as l,r as u,t as d}from"./popover-DzFLnxeL.js";import{t as f}from"./navbar-Dklzivsw.js";var p;function m(){return(m=e((()=>{r(),p=t`
  .popover__panel {
    padding: var(--space-xs, 4px);
  }

  /* ─── 選單項目：面板的直接子元素（button、a 等），統一外觀 ─── */
  ::slotted(:not(hr)) {
    display: flex;
    align-items: center;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: var(--space-xs, 4px) var(--space-sm, 8px);
    font: inherit;
    line-height: var(--leading-normal, 1.5);
    color: inherit;
    text-align: start;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm, 6px);
  }

  ::slotted(:not(hr):hover),
  ::slotted(:not(hr):focus) {
    background-color: var(--color-surface, #f1f5f9);
  }

  ::slotted(:not(hr):focus-visible) {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: -2px;
  }

  ::slotted([aria-disabled='true']) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /*
   * 強制色彩（Windows 高對比）：背景色被統一成系統色，滑鼠移入而取得焦點的項目
   * （不符合 :focus-visible）沒有任何標示，改以外框呈現
   */
  @media (forced-colors: active) {
    ::slotted(:not(hr):hover),
    ::slotted(:not(hr):focus) {
      outline: 2px solid Highlight;
      outline-offset: -2px;
    }
  }

  /* 分隔線 */
  ::slotted(hr) {
    margin: var(--space-xs, 4px) 0;
    border: none;
    border-top: 1px solid var(--color-border, #e2e8f0);
  }
`})))()}var h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{l(),u(),m(),h=new Set([`ArrowDown`,`ArrowUp`,`Home`,`End`]),g=new Set([`menuitem`,`menuitemcheckbox`,`menuitemradio`]),_=`a[href], button, input, select, textarea, [contenteditable=""], [contenteditable="true"]`,v=[`role`,`tabindex`,`type`,`aria-disabled`],y=e=>v.map(t=>e.getAttribute(t)),b=e=>e.localName===`hr`||e.getAttribute(`role`)===`separator`,x=e=>e.hasAttribute(`disabled`)||e.getAttribute(`aria-disabled`)===`true`,S=e=>e.localName===`button`||e.localName===`a`&&e.hasAttribute(`href`),C=e=>e instanceof Element&&e.matches(`input, select, textarea, [contenteditable=""], [contenteditable="true"]`),w=class extends d{static{this.styles=[c,p]}constructor(){super(),this.popupRole=`menu`,this.focusLastOnOpen=!1,this.swallowSpaceKeyUp=!1,this.managedItems=new Map,this.syncItems=()=>{let e=this.panelChildren();for(let[t,n]of this.managedItems)e.includes(t)||this.restoreItem(t,n);for(let t of e){let e=this.managedItems.get(t);e?this.adoptUserChanges(t,e):(e={original:y(t),written:y(t)},this.managedItems.set(t,e));let[n,,r,i]=e.original;if(b(t))t.setAttribute(`role`,`separator`);else{t.setAttribute(`role`,n&&g.has(n)?n:`menuitem`),t.tabIndex=-1,t.localName===`button`&&r===null&&t.setAttribute(`type`,`button`);let e=t.hasAttribute(`disabled`)?`true`:i;e===null?t.removeAttribute(`aria-disabled`):t.setAttribute(`aria-disabled`,e)}e.written=y(t)}},this.handleMenuKeyDown=e=>{if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey)return;let t=e.composedPath();if(this.triggerElement&&t.includes(this.triggerElement)){if(e.key!==`ArrowDown`&&e.key!==`ArrowUp`||this.triggerElement.matches(`[disabled], [aria-disabled="true"], [loading]`))return;if(e.preventDefault(),this.open){let t=this.navigableItems;this.focusItem(e.key===`ArrowUp`?t.at(-1):t[0])}else this.focusLastOnOpen=e.key===`ArrowUp`,this.show(),this.updateComplete.then(()=>this.focusLastOnOpen=!1);return}if(!this.open||C(t[0]))return;if(e.key===`Tab`){this.close(`focus-out`);return}let n=this.navigableItems,r=this.activeItem,i=r?n.indexOf(r):-1;if(h.has(e.key)){e.preventDefault();let t=n.length-1,r={ArrowDown:i<t?i+1:0,ArrowUp:i>0?i-1:t,Home:0,End:t}[e.key];this.focusItem(n[r])}else if(r){if(e.key===`Enter`&&!S(t[0]))e.preventDefault(),r.click();else if(e.key===` `)e.preventDefault(),this.swallowSpaceKeyUp=!0,r.click();else if(e.key.length===1&&e.key.trim()){let t=e.key.toLocaleLowerCase(),r=[...n.slice(i+1),...n.slice(0,i+1)].find(e=>this.itemLabel(e).startsWith(t));r&&(e.preventDefault(),this.focusItem(r))}}},this.handleMenuKeyUp=e=>{e.key===` `&&this.swallowSpaceKeyUp&&(this.swallowSpaceKeyUp=!1,e.preventDefault())},this.handlePointerMove=e=>{if(!this.open)return;let t=e.composedPath(),n=this.navigableItems.find(e=>t.includes(e));n&&!n.matches(`:focus-within`)&&this.focusItem(n)},this.handleItemClick=e=>{if(!this.open)return;let t=e.composedPath(),n=this.items.find(e=>t.includes(e));if(!n)return;let r=t[0];if(r instanceof Element&&r!==n&&n.contains(r)){let e=r.closest(_);if(e&&e!==n)return}if(x(n)){e.preventDefault();return}let i=n.getAttribute(`value`)??(n.textContent??``).trim();this.dispatchEvent(new CustomEvent(`aui-select`,{detail:{item:n,value:i},bubbles:!0,composed:!0,cancelable:!0}))&&this.close(`select`)},this.addEventListener(`keydown`,this.handleMenuKeyDown),this.addEventListener(`keyup`,this.handleMenuKeyUp),this.addEventListener(`click`,this.handleItemClick),this.addEventListener(`pointermove`,this.handlePointerMove)}connectedCallback(){super.connectedCallback(),typeof MutationObserver<`u`&&(this.disabledObserver??=new MutationObserver(this.syncItems),this.disabledObserver.observe(this,{subtree:!0,attributes:!0,attributeFilter:[`disabled`]}))}disconnectedCallback(){super.disconnectedCallback(),this.disabledObserver?.disconnect()}firstUpdated(){super.firstUpdated(),this.shadowRoot.addEventListener(`slotchange`,this.syncItems),this.syncItems()}get items(){return this.panelChildren().filter(e=>!b(e))}get navigableItems(){return this.items.filter(e=>!e.hasAttribute(`disabled`))}panelChildren(){return(this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]}adoptUserChanges(e,t){v.forEach((n,r)=>{let i=e.getAttribute(n);i!==t.written[r]&&(t.original[r]=i)})}restoreItem(e,t){this.managedItems.delete(e),this.adoptUserChanges(e,t),v.forEach((n,r)=>{let i=t.original[r];i===null?e.removeAttribute(n):e.setAttribute(n,i)})}async focusPanel(){this.syncItems();let e=this.navigableItems,t=this.focusLastOnOpen?e.at(-1):e[0];if(this.focusLastOnOpen=!1,!t){this.panel?.focus({preventScroll:!0});return}let n=t.updateComplete;n&&(await n,!this.open)||t.focus({preventScroll:!0})}get activeItem(){return this.items.find(e=>e.matches(`:focus-within`))??null}focusItem(e){e?.focus({preventScroll:!0})}itemLabel(e){return(e.getAttribute(`aria-label`)??e.textContent??``).trim().toLocaleLowerCase()}},customElements.get(`aui-menu`)||customElements.define(`aui-menu`,w)})))()}function E(){return(E=e((()=>{T()})))()}var D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{r(),E(),o(),s(),f(),i(),{expect:D,userEvent:O,waitFor:k}=__STORYBOOK_MODULE_TEST__,A={title:`Components/Menu`,component:`aui-menu`,parameters:{docs:{description:{component:'\n**Anchor UI — Dropdown Menu 下拉選單 (`<aui-menu>`)**\n\n基於 `<aui-popover>` 的操作選單，依 WAI-ARIA Menu Button 模式實作，例如導覽列的使用者選單、表格列的「更多」操作。\n\n- 面板的直接子元素為選單項目（建議 `<button>` 或連結 `<a href>`），`<hr>` 為分隔線。\n- 觸發元素：Enter、Space 或 ↓ 開啟並聚焦第一個項目，↑ 開啟並聚焦最後一個項目。\n- 選單中：↑ ↓ 移動（頭尾循環）、Home / End、輸入字元跳到名稱以該字開頭的項目（輸入法組字不支援）；Enter、Space 或點擊選取，ESC 與 Tab 關閉。滑鼠移到項目上時焦點跟著移動。\n- 選取時分派 `aui-select`（`detail.value` 為項目的 `value` 屬性，沒有時為文字），可取消（取消時不關閉）。\n- `aria-disabled="true"` 的項目可聚焦但不可選取；原生 `disabled` 的項目在鍵盤巡覽時略過。\n'}}}},j=e=>{let{value:t}=e.detail,n=e.currentTarget.closest(`[data-demo]`).querySelector(`output`);n.textContent=`aui-select：${t}`},M={render:()=>n`
    <div data-demo style="min-height: 320px;">
      <aui-navbar brand="Anchor UI" brand-href="#" no-search>
        <a href="#tools">工具</a>
        <a href="#docs">文件</a>
        <aui-menu slot="actions" label="使用者選單" placement="bottom-end" @aui-select=${j}>
          <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
          <a href="#profile">個人資料</a>
          <button value="settings">設定</button>
          <button value="billing" aria-disabled="true">帳單（未開通）</button>
          <hr />
          <button value="logout">登出</button>
        </aui-menu>
      </aui-navbar>
      <output
        style="display: block; padding: 12px 24px; font-family: var(--font-mono); font-size: 12px;"
      ></output>
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=a(e,`aui-menu`),r=a(n,`[slot="trigger"]`);await t(`在觸發元素上按 ↓：開啟並聚焦第一個項目`,async()=>{r.focus(),await O.keyboard(`{ArrowDown}`),await k(()=>D(n.open).toBe(!0)),await k(()=>D(document.activeElement).toBe(a(n,`a[href="#profile"]`)))}),await t(`↓ 移到「設定」，Enter 選取：分派 aui-select 並關閉，焦點回到觸發元素`,async()=>{await O.keyboard(`{ArrowDown}`),await D(document.activeElement).toBe(a(n,`[value="settings"]`)),await O.keyboard(`{Enter}`),await k(()=>D(n.open).toBe(!1)),await D(a(e,`output`).textContent).toBe(`aui-select：settings`),await k(()=>D(document.activeElement).toBe(r))})}},N=n`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
`,P={render:()=>n`
    <div data-demo style="padding: 24px 24px 200px; max-width: 520px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${[`report-2026-10.csv`,`report-2026-11.csv`].map(e=>n`
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 8px;">${e}</td>
                <td style="padding: 8px; text-align: end;">
                  <aui-menu placement="bottom-end" @aui-select=${j}>
                    <aui-icon-button slot="trigger" label=${`${e} 的更多操作`} variant="ghost">
                      ${N}
                    </aui-icon-button>
                    <button value=${`download:${e}`}>下載</button>
                    <button value=${`rename:${e}`}>重新命名</button>
                    <hr />
                    <button value=${`delete:${e}`}>刪除</button>
                  </aui-menu>
                </td>
              </tr>
            `)}
        </tbody>
      </table>
      <output
        style="display: block; padding-top: 12px; font-family: var(--font-mono); font-size: 12px;"
      ></output>
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=a(e,`aui-menu`);await t(`點擊開啟，以 ↑ 移到最後一個項目「刪除」後按 ESC 關閉`,async()=>{await O.click(a(n,`[slot="trigger"]`)),await k(()=>D(n.open).toBe(!0)),await O.keyboard(`{ArrowUp}`),await k(()=>D(document.activeElement?.textContent).toBe(`刪除`)),await O.keyboard(`{Escape}`),await k(()=>D(n.open).toBe(!1))})}},F=[`NavbarUserMenu`,`TableRowActions`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div data-demo style="min-height: 320px;">
      <aui-navbar brand="Anchor UI" brand-href="#" no-search>
        <a href="#tools">工具</a>
        <a href="#docs">文件</a>
        <aui-menu slot="actions" label="使用者選單" placement="bottom-end" @aui-select=\${logSelect}>
          <aui-button slot="trigger" variant="ghost" size="sm">王小明</aui-button>
          <a href="#profile">個人資料</a>
          <button value="settings">設定</button>
          <button value="billing" aria-disabled="true">帳單（未開通）</button>
          <hr />
          <button value="logout">登出</button>
        </aui-menu>
      </aui-navbar>
      <output
        style="display: block; padding: 12px 24px; font-family: var(--font-mono); font-size: 12px;"
      ></output>
    </div>
  \`,
  play: async ({
    canvasElement,
    step
  }) => {
    const menu = query<AuiMenu>(canvasElement, 'aui-menu');
    const trigger = query(menu, '[slot="trigger"]');
    await step('在觸發元素上按 ↓：開啟並聚焦第一個項目', async () => {
      trigger.focus();
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(menu.open).toBe(true));
      await waitFor(() => expect(document.activeElement).toBe(query(menu, 'a[href="#profile"]')));
    });
    await step('↓ 移到「設定」，Enter 選取：分派 aui-select 並關閉，焦點回到觸發元素', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(document.activeElement).toBe(query(menu, '[value="settings"]'));
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(menu.open).toBe(false));
      await expect(query(canvasElement, 'output').textContent).toBe('aui-select：settings');
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    });
  }
}`,...M.parameters?.docs?.source},description:{story:`導覽列的使用者選單`,...M.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div data-demo style="padding: 24px 24px 200px; max-width: 520px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          \${['report-2026-10.csv', 'report-2026-11.csv'].map(file => html\`
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 8px;">\${file}</td>
                <td style="padding: 8px; text-align: end;">
                  <aui-menu placement="bottom-end" @aui-select=\${logSelect}>
                    <aui-icon-button slot="trigger" label=\${\`\${file} 的更多操作\`} variant="ghost">
                      \${moreIcon}
                    </aui-icon-button>
                    <button value=\${\`download:\${file}\`}>下載</button>
                    <button value=\${\`rename:\${file}\`}>重新命名</button>
                    <hr />
                    <button value=\${\`delete:\${file}\`}>刪除</button>
                  </aui-menu>
                </td>
              </tr>
            \`)}
        </tbody>
      </table>
      <output
        style="display: block; padding-top: 12px; font-family: var(--font-mono); font-size: 12px;"
      ></output>
    </div>
  \`,
  play: async ({
    canvasElement,
    step
  }) => {
    const menu = query<AuiMenu>(canvasElement, 'aui-menu');
    await step('點擊開啟，以 ↑ 移到最後一個項目「刪除」後按 ESC 關閉', async () => {
      await userEvent.click(query(menu, '[slot="trigger"]'));
      await waitFor(() => expect(menu.open).toBe(true));
      await userEvent.keyboard('{ArrowUp}');
      await waitFor(() => expect(document.activeElement?.textContent).toBe('刪除'));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(menu.open).toBe(false));
    });
  }
}`,...P.parameters?.docs?.source},description:{story:`表格列的「更多」操作：圖示按鈕觸發，選單靠右對齊`,...P.parameters?.docs?.description}}}})))()}I();export{M as NavbarUserMenu,P as TableRowActions,F as __namedExportsOrder,A as default};