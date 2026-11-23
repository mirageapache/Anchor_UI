import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{a as r,i,n as a,o,r as s}from"./play-utils-DUto8Om5.js";import{t as c}from"./button-DdPjZonN.js";import{t as l}from"./input-DSHA-BVQ.js";import{r as u,t as d}from"./style-map-BZ8c4eCi.js";import{t as f}from"./drawer-CRbM-iKw.js";import{t as p}from"./field-B4RvtsDj.js";import{t as m}from"./segmented-CfETZawJ.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{n(),d(),f(),c(),p(),l(),m(),r(),{expect:h,userEvent:g,waitFor:_}=__STORYBOOK_MODULE_TEST__,v=e=>{let t=e.currentTarget.closest(`.story`);t.querySelector(`aui-drawer`).open=!0},y=e=>{e.currentTarget.closest(`aui-drawer`).hide()},b=`display: flex; flex-direction: column; gap: 4px;`,x=`display: block; padding: 8px 12px; border-radius: 6px; color: var(--color-text-primary); text-decoration: none;`,S={title:`Components/Drawer`,component:`aui-drawer`,parameters:{docs:{description:{component:"\n**Anchor UI — Drawer 可收合側邊抽屜 (`<aui-drawer>`)**\n\n從視窗左側或右側（`placement`）滑入的全高面板，常用於行動版導覽選單、篩選面板或設定欄；不綁定頁面版型，放在頁面任何位置皆可。\n與 Modal 共用開關行為：以原生 `<dialog>.showModal()` 進入 Top Layer、背景 inert 並顯示遮罩，ESC 與點擊遮罩可關閉（皆可停用），\n`aui-hide` 可取消並帶有關閉原因；開啟時鎖定背景捲動，關閉後焦點返還至觸發元素。\n寬度以 CSS 變數 `--aui-drawer-width` 調整（預設 280px，不超過視窗寬度的 85%）。\n        "}}},argTypes:{heading:{control:`text`,description:`標題（同時作為無障礙名稱）`},placement:{control:`inline-radio`,options:[`left`,`right`],description:`滑出方向`,table:{defaultValue:{summary:`left`}}},width:{control:`text`,description:"`--aui-drawer-width`（CSS 變數）",table:{defaultValue:{summary:`280px`}}},closeOnEscape:{control:`boolean`,table:{defaultValue:{summary:`true`}}},closeOnBackdrop:{control:`boolean`,table:{defaultValue:{summary:`true`}}},noCloseButton:{control:`boolean`,table:{defaultValue:{summary:`false`}}}},args:{heading:`Anchor UI`,placement:`left`,width:`280px`,closeOnEscape:!0,closeOnBackdrop:!0,noCloseButton:!1}},C={render:e=>t`
    <div class="story">
      <aui-button @click=${v}>開啟 Drawer</aui-button>
      <aui-drawer
        heading=${e.heading}
        .placement=${e.placement}
        .closeOnEscape=${e.closeOnEscape}
        .closeOnBackdrop=${e.closeOnBackdrop}
        ?no-close-button=${e.noCloseButton}
        style=${u({"--aui-drawer-width":e.width})}
      >
        <nav aria-label="主要導覽" style=${b}>
          ${[`總覽`,`元件`,`設計 Token`,`更新紀錄`].map(e=>t`<a href="#" style=${x} @click=${y}>${e}</a>`)}
        </nav>
      </aui-drawer>
    </div>
  `},w={render:()=>t`
    <div style="display: flex; gap: 12px;">
      ${[`left`,`right`].map(e=>t`
          <div class="story">
            <aui-button variant="ghost" @click=${v}>${e}</aui-button>
            <aui-drawer heading=${`Placement: ${e}`} placement=${e}>
              <p style="margin: 0;">面板從視窗的 ${e} 側滑入。</p>
            </aui-drawer>
          </div>
        `)}
    </div>
  `},T={name:`Filter panel (footer)`,render:()=>t`
    <div class="story">
      <aui-button @click=${v}>篩選</aui-button>
      <aui-drawer heading="篩選條件" placement="right" style="--aui-drawer-width: 360px">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <aui-field label="關鍵字">
            <aui-input placeholder="名稱或描述" autofocus></aui-input>
          </aui-field>
          <aui-field label="狀態">
            <aui-segmented
              .options=${[{value:`all`,label:`全部`},{value:`open`,label:`進行中`},{value:`done`,label:`已完成`}]}
              value="all"
            ></aui-segmented>
          </aui-field>
        </div>
        <aui-button slot="footer" variant="ghost" @click=${y}>重設</aui-button>
        <aui-button slot="footer" @click=${y}>套用</aui-button>
      </aui-drawer>
    </div>
  `},E={name:`Scrollable body`,render:()=>t`
    <div class="story">
      <aui-button @click=${v}>開啟長選單</aui-button>
      <aui-drawer heading="所有元件">
        <nav aria-label="元件列表" style=${b}>
          ${Array.from({length:40},(e,n)=>t`<a href="#" style=${x}>元件 ${n+1}</a>`)}
        </nav>
        <span slot="footer" style="font-size: 12px; color: var(--color-text-secondary);">
          只有內容區會捲動，頁首與頁尾保持固定。
        </span>
      </aui-drawer>
    </div>
  `},D={name:`Close reasons (aui-hide)`,render:()=>t`
      <div class="story">
        <aui-button id="open" @click=${v}>開啟</aui-button>
        <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
        <aui-drawer heading="試試不同的關閉方式" @aui-hide=${e=>{if(e.target!==e.currentTarget)return;let t=e.detail.reason,n=e.currentTarget.closest(`.story`).querySelector(`output`);n.textContent=`最近一次關閉原因：${t}`}}>
          <p style="margin: 0;">按 ESC、點擊遮罩、點擊右上角或下方按鈕關閉。</p>
          <aui-button slot="footer" @click=${y}>以 hide() 關閉</aui-button>
        </aui-drawer>
      </div>
    `,play:async({canvasElement:e,step:t})=>{let n=o(e,`aui-drawer`),r=o(e,`output`),c=async()=>{await a(o(e,`#open`)),await _(()=>h(i(n,`dialog`).open).toBe(!0)),await _(()=>h(s()).toBe(i(n,`[part="panel"]`)))},l=async t=>{await _(()=>h(i(n,`dialog`).open).toBe(!1)),await h(r.textContent).toBe(`最近一次關閉原因：${t}`),await _(()=>h(s()).toBe(i(o(e,`#open`),`button`)))};await t(`點擊遮罩關閉，焦點返還至開啟按鈕`,async()=>{await c(),await g.click(i(n,`dialog`)),await l(`backdrop`)}),await t(`頁首關閉鈕`,async()=>{await c(),await g.click(i(n,`[part="close-button"]`)),await l(`close-button`)}),await t(`以 hide() 關閉`,async()=>{await c(),await a(o(n,`aui-button`)),await l(`api`)})}},O=[`Default`,`Placements`,`FilterPanel`,`ScrollableBody`,`CloseReasons`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <div class="story">
      <aui-button @click=\${openNearestDrawer}>開啟 Drawer</aui-button>
      <aui-drawer
        heading=\${args.heading}
        .placement=\${args.placement}
        .closeOnEscape=\${args.closeOnEscape}
        .closeOnBackdrop=\${args.closeOnBackdrop}
        ?no-close-button=\${args.noCloseButton}
        style=\${styleMap({
    '--aui-drawer-width': args.width
  })}
      >
        <nav aria-label="主要導覽" style=\${navStyle}>
          \${['總覽', '元件', '設計 Token', '更新紀錄'].map(label => html\`<a href="#" style=\${linkStyle} @click=\${closeNearestDrawer}>\${label}</a>\`)}
        </nav>
      </aui-drawer>
    </div>
  \`
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; gap: 12px;">
      \${(['left', 'right'] as const).map(placement => html\`
          <div class="story">
            <aui-button variant="ghost" @click=\${openNearestDrawer}>\${placement}</aui-button>
            <aui-drawer heading=\${\`Placement: \${placement}\`} placement=\${placement}>
              <p style="margin: 0;">面板從視窗的 \${placement} 側滑入。</p>
            </aui-drawer>
          </div>
        \`)}
    </div>
  \`
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'Filter panel (footer)',
  render: () => html\`
    <div class="story">
      <aui-button @click=\${openNearestDrawer}>篩選</aui-button>
      <aui-drawer heading="篩選條件" placement="right" style="--aui-drawer-width: 360px">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <aui-field label="關鍵字">
            <aui-input placeholder="名稱或描述" autofocus></aui-input>
          </aui-field>
          <aui-field label="狀態">
            <aui-segmented
              .options=\${[{
    value: 'all',
    label: '全部'
  }, {
    value: 'open',
    label: '進行中'
  }, {
    value: 'done',
    label: '已完成'
  }]}
              value="all"
            ></aui-segmented>
          </aui-field>
        </div>
        <aui-button slot="footer" variant="ghost" @click=\${closeNearestDrawer}>重設</aui-button>
        <aui-button slot="footer" @click=\${closeNearestDrawer}>套用</aui-button>
      </aui-drawer>
    </div>
  \`
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Scrollable body',
  render: () => html\`
    <div class="story">
      <aui-button @click=\${openNearestDrawer}>開啟長選單</aui-button>
      <aui-drawer heading="所有元件">
        <nav aria-label="元件列表" style=\${navStyle}>
          \${Array.from({
    length: 40
  }, (_, i) => html\`<a href="#" style=\${linkStyle}>元件 \${i + 1}</a>\`)}
        </nav>
        <span slot="footer" style="font-size: 12px; color: var(--color-text-secondary);">
          只有內容區會捲動，頁首與頁尾保持固定。
        </span>
      </aui-drawer>
    </div>
  \`
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'Close reasons (aui-hide)',
  render: () => {
    const log = (event: Event) => {
      // aui-hide 會冒泡：忽略內容中 Tooltip 或 Modal 的同名事件
      if (event.target !== event.currentTarget) return;
      const reason = (event as CustomEvent<DrawerHideDetail>).detail.reason;
      const output = (event.currentTarget as HTMLElement).closest('.story')!.querySelector('output')!;
      output.textContent = \`最近一次關閉原因：\${reason}\`;
    };
    return html\`
      <div class="story">
        <aui-button id="open" @click=\${openNearestDrawer}>開啟</aui-button>
        <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
        <aui-drawer heading="試試不同的關閉方式" @aui-hide=\${log}>
          <p style="margin: 0;">按 ESC、點擊遮罩、點擊右上角或下方按鈕關閉。</p>
          <aui-button slot="footer" @click=\${closeNearestDrawer}>以 hide() 關閉</aui-button>
        </aui-drawer>
      </div>
    \`;
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const drawer = query<AuiDrawer>(canvasElement, 'aui-drawer');
    const output = query(canvasElement, 'output');
    const open = async () => {
      await clickButton(query(canvasElement, '#open'));
      await waitFor(() => expect(inShadow<HTMLDialogElement>(drawer, 'dialog').open).toBe(true));
      await waitFor(() => expect(deepActiveElement()).toBe(inShadow(drawer, '[part="panel"]')));
    };
    const closed = async (reason: string) => {
      await waitFor(() => expect(inShadow<HTMLDialogElement>(drawer, 'dialog').open).toBe(false));
      await expect(output.textContent).toBe(\`最近一次關閉原因：\${reason}\`);
      await waitFor(() => expect(deepActiveElement()).toBe(inShadow(query(canvasElement, '#open'), 'button')));
    };
    await step('點擊遮罩關閉，焦點返還至開啟按鈕', async () => {
      await open();
      // 點擊面板以外的區域，事件目標即為 dialog 本身
      await userEvent.click(inShadow(drawer, 'dialog'));
      await closed('backdrop');
    });
    await step('頁首關閉鈕', async () => {
      await open();
      await userEvent.click(inShadow(drawer, '[part="close-button"]'));
      await closed('close-button');
    });
    await step('以 hide() 關閉', async () => {
      await open();
      await clickButton(query(drawer, 'aui-button'));
      await closed('api');
    });
  }
}`,...D.parameters?.docs?.source}}}})))()}k();export{D as CloseReasons,C as Default,T as FilterPanel,w as Placements,E as ScrollableBody,O as __namedExportsOrder,S as default};