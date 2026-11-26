import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{t as r}from"./button-CnMX2etb.js";import{t as i}from"./input-TSZ7luvs.js";import{t as a}from"./modal-DMBLNh1X.js";import{t as o}from"./field-BdLK10Mz.js";var s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{n(),a(),r(),o(),i(),s=e=>{let t=e.currentTarget.closest(`.story`);t.querySelector(`aui-modal`).open=!0},c=e=>{e.currentTarget.closest(`aui-modal`).hide()},l={title:`Components/Modal`,component:`aui-modal`,parameters:{docs:{description:{component:"\n**Anchor UI — Modal 通用彈窗外框容器 (`<aui-modal>`)**\n\n以原生 `<dialog>.showModal()` 進入 Top Layer，背景自動 inert，並以 `::backdrop` 呈現模糊遮罩。\n提供 sm / md / lg 三種寬度與 Header / Body / Footer 插槽（沒有內容的頁首與頁尾不顯示）。\nESC 與點擊遮罩可關閉（皆可停用）；`aui-hide` 可取消並帶有關閉原因（`escape`、`backdrop`、`close-button`、`api`）。\n開啟時鎖定背景捲動，關閉後焦點返還至觸發元素；內容中帶 `autofocus` 的元素會取得初始焦點。\n        "}}},argTypes:{heading:{control:`text`,description:`標題（同時作為無障礙名稱）`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`],description:`面板最大寬度（420 / 600 / 840px）`,table:{defaultValue:{summary:`md`}}},closeOnEscape:{control:`boolean`,table:{defaultValue:{summary:`true`}}},closeOnBackdrop:{control:`boolean`,table:{defaultValue:{summary:`true`}}},noCloseButton:{control:`boolean`,table:{defaultValue:{summary:`false`}}}},args:{heading:`編輯設定`,size:`md`,closeOnEscape:!0,closeOnBackdrop:!0,noCloseButton:!1}},u={render:e=>t`
    <div class="story">
      <aui-button @click=${s}>開啟 Modal</aui-button>
      <aui-modal
        heading=${e.heading}
        .size=${e.size}
        .closeOnEscape=${e.closeOnEscape}
        .closeOnBackdrop=${e.closeOnBackdrop}
        ?no-close-button=${e.noCloseButton}
      >
        <aui-field label="Name">
          <aui-input value="Anchor UI" autofocus></aui-input>
        </aui-field>
        <aui-button slot="footer" variant="ghost" @click=${c}>取消</aui-button>
        <aui-button slot="footer" @click=${c}>儲存</aui-button>
      </aui-modal>
    </div>
  `},d={render:()=>t`
    <div style="display: flex; gap: 12px;">
      ${[`sm`,`md`,`lg`].map(e=>t`
          <div class="story">
            <aui-button variant="ghost" @click=${s}>${e}</aui-button>
            <aui-modal heading=${`Size: ${e}`} size=${e}>
              <p style="margin: 0;">面板最大寬度依 size 而定。</p>
            </aui-modal>
          </div>
        `)}
    </div>
  `},f={name:`Scrollable body`,render:()=>t`
    <div class="story">
      <aui-button @click=${s}>開啟長內容</aui-button>
      <aui-modal heading="服務條款" size="lg">
        ${Array.from({length:30},(e,n)=>t`<p>第 ${n+1} 條：內容超出視窗高度時，只有內容區會捲動，頁首與頁尾保持固定。</p>`)}
        <aui-button slot="footer" @click=${c}>我同意</aui-button>
      </aui-modal>
    </div>
  `},p={render:()=>t`
    <div class="story">
      <aui-button @click=${s}>開啟外層</aui-button>
      <aui-modal heading="外層 Modal">
        <div class="story">
          <p style="margin-top: 0;">巢狀開啟時，ESC 只會關閉最上層；捲動鎖定會正確計數。</p>
          <aui-button @click=${s}>開啟內層</aui-button>
          <aui-modal heading="內層 Modal" size="sm">
            <p style="margin: 0;">關閉後焦點會回到「開啟內層」按鈕。</p>
          </aui-modal>
        </div>
      </aui-modal>
    </div>
  `},m={name:`Close reasons (aui-hide)`,render:()=>t`
      <div class="story">
        <aui-button @click=${s}>開啟</aui-button>
        <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
        <aui-modal heading="試試不同的關閉方式" @aui-hide=${e=>{if(e.target!==e.currentTarget)return;let t=e.detail.reason,n=e.currentTarget.closest(`.story`).querySelector(`output`);n.textContent=`最近一次關閉原因：${t}`}}>
          <p style="margin: 0;">按 ESC、點擊遮罩、點擊右上角或下方按鈕關閉。</p>
          <aui-button slot="footer" @click=${c}>以 hide() 關閉</aui-button>
        </aui-modal>
      </div>
    `},h=[`Default`,`Sizes`,`ScrollableBody`,`Nested`,`CloseReasons`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <div class="story">
      <aui-button @click=\${openNearestModal}>開啟 Modal</aui-button>
      <aui-modal
        heading=\${args.heading}
        .size=\${args.size}
        .closeOnEscape=\${args.closeOnEscape}
        .closeOnBackdrop=\${args.closeOnBackdrop}
        ?no-close-button=\${args.noCloseButton}
      >
        <aui-field label="Name">
          <aui-input value="Anchor UI" autofocus></aui-input>
        </aui-field>
        <aui-button slot="footer" variant="ghost" @click=\${closeNearestModal}>取消</aui-button>
        <aui-button slot="footer" @click=\${closeNearestModal}>儲存</aui-button>
      </aui-modal>
    </div>
  \`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; gap: 12px;">
      \${(['sm', 'md', 'lg'] as const).map(size => html\`
          <div class="story">
            <aui-button variant="ghost" @click=\${openNearestModal}>\${size}</aui-button>
            <aui-modal heading=\${\`Size: \${size}\`} size=\${size}>
              <p style="margin: 0;">面板最大寬度依 size 而定。</p>
            </aui-modal>
          </div>
        \`)}
    </div>
  \`
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Scrollable body',
  render: () => html\`
    <div class="story">
      <aui-button @click=\${openNearestModal}>開啟長內容</aui-button>
      <aui-modal heading="服務條款" size="lg">
        \${Array.from({
    length: 30
  }, (_, i) => html\`<p>第 \${i + 1} 條：內容超出視窗高度時，只有內容區會捲動，頁首與頁尾保持固定。</p>\`)}
        <aui-button slot="footer" @click=\${closeNearestModal}>我同意</aui-button>
      </aui-modal>
    </div>
  \`
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="story">
      <aui-button @click=\${openNearestModal}>開啟外層</aui-button>
      <aui-modal heading="外層 Modal">
        <div class="story">
          <p style="margin-top: 0;">巢狀開啟時，ESC 只會關閉最上層；捲動鎖定會正確計數。</p>
          <aui-button @click=\${openNearestModal}>開啟內層</aui-button>
          <aui-modal heading="內層 Modal" size="sm">
            <p style="margin: 0;">關閉後焦點會回到「開啟內層」按鈕。</p>
          </aui-modal>
        </div>
      </aui-modal>
    </div>
  \`
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Close reasons (aui-hide)',
  render: () => {
    const log = (event: Event) => {
      // aui-hide 會冒泡：忽略內容中 Tooltip 或巢狀 Modal 的同名事件
      if (event.target !== event.currentTarget) return;
      const reason = (event as CustomEvent<ModalHideDetail>).detail.reason;
      const output = (event.currentTarget as HTMLElement).closest('.story')!.querySelector('output')!;
      output.textContent = \`最近一次關閉原因：\${reason}\`;
    };
    return html\`
      <div class="story">
        <aui-button @click=\${openNearestModal}>開啟</aui-button>
        <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
        <aui-modal heading="試試不同的關閉方式" @aui-hide=\${log}>
          <p style="margin: 0;">按 ESC、點擊遮罩、點擊右上角或下方按鈕關閉。</p>
          <aui-button slot="footer" @click=\${closeNearestModal}>以 hide() 關閉</aui-button>
        </aui-modal>
      </div>
    \`;
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as CloseReasons,u as Default,p as Nested,f as ScrollableBody,d as Sizes,h as __namedExportsOrder,l as default};