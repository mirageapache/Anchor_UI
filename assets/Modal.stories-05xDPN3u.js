import{s as e,t}from"./lit-MXP2jLr5.js";import{t as n}from"./modal-D7i1Cp2u.js";import{t as r}from"./button-DhL0lY_i.js";import{t as i}from"./input-Br5UZOpr.js";import{t as a}from"./field-C1a6gQlg.js";import{t as o}from"./rolldown-runtime-Dh6celcD.js";var s,c,l,u,d,f,p,m,h;function g(){return(g=o((()=>{t(),n(),r(),a(),i(),s=e=>{let t=e.currentTarget.closest(`.story`);t.querySelector(`aui-modal`).open=!0},c=e=>{e.currentTarget.closest(`aui-modal`).hide()},l={title:`Components/Modal`,component:`aui-modal`,parameters:{docs:{description:{component:"\n**Anchor UI — Modal 通用彈窗外框容器 (`<aui-modal>`)**\n\n以原生 `<dialog>.showModal()` 進入 Top Layer，背景自動 inert，並以 `::backdrop` 呈現模糊遮罩。\n提供 sm / md / lg 三種寬度與 Header / Body / Footer 插槽（沒有內容的頁首與頁尾不顯示）。\nESC 與點擊遮罩可關閉（皆可停用）；`aui-hide` 可取消並帶有關閉原因（`escape`、`backdrop`、`close-button`、`api`）。\n開啟時鎖定背景捲動，關閉後焦點返還至觸發元素；內容中帶 `autofocus` 的元素會取得初始焦點。\n        "}}},argTypes:{heading:{control:`text`,description:`標題（同時作為無障礙名稱）`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`],description:`面板最大寬度（420 / 600 / 840px）`,table:{defaultValue:{summary:`md`}}},closeOnEscape:{control:`boolean`,table:{defaultValue:{summary:`true`}}},closeOnBackdrop:{control:`boolean`,table:{defaultValue:{summary:`true`}}},noCloseButton:{control:`boolean`,table:{defaultValue:{summary:`false`}}}},args:{heading:`編輯設定`,size:`md`,closeOnEscape:!0,closeOnBackdrop:!0,noCloseButton:!1}},u={render:t=>e`
    <div class="story">
      <aui-button @click=${s}>開啟 Modal</aui-button>
      <aui-modal
        heading=${t.heading}
        .size=${t.size}
        .closeOnEscape=${t.closeOnEscape}
        .closeOnBackdrop=${t.closeOnBackdrop}
        ?no-close-button=${t.noCloseButton}
      >
        <aui-field label="Name">
          <aui-input value="Anchor UI" autofocus></aui-input>
        </aui-field>
        <aui-button slot="footer" variant="ghost" @click=${c}>取消</aui-button>
        <aui-button slot="footer" @click=${c}>儲存</aui-button>
      </aui-modal>
    </div>
  `},d={render:()=>e`
    <div style="display: flex; gap: 12px;">
      ${[`sm`,`md`,`lg`].map(t=>e`
          <div class="story">
            <aui-button variant="ghost" @click=${s}>${t}</aui-button>
            <aui-modal heading=${`Size: ${t}`} size=${t}>
              <p style="margin: 0;">面板最大寬度依 size 而定。</p>
            </aui-modal>
          </div>
        `)}
    </div>
  `},f={name:`Scrollable body`,render:()=>e`
    <div class="story">
      <aui-button @click=${s}>開啟長內容</aui-button>
      <aui-modal heading="服務條款" size="lg">
        ${Array.from({length:30},(t,n)=>e`<p>第 ${n+1} 條：內容超出視窗高度時，只有內容區會捲動，頁首與頁尾保持固定。</p>`)}
        <aui-button slot="footer" @click=${c}>我同意</aui-button>
      </aui-modal>
    </div>
  `},p={render:()=>e`
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
  `},m={name:`Close reasons (aui-hide)`,render:()=>e`
      <div class="story">
        <aui-button @click=${s}>開啟</aui-button>
        <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
        <aui-modal heading="試試不同的關閉方式" @aui-hide=${e=>{if(e.target!==e.currentTarget)return;let t=e.detail.reason,n=e.currentTarget.closest(`.story`).querySelector(`output`);n.textContent=`最近一次關閉原因：${t}`}}>
          <p style="margin: 0;">按 ESC、點擊遮罩、點擊右上角或下方按鈕關閉。</p>
          <aui-button slot="footer" @click=${c}>以 hide() 關閉</aui-button>
        </aui-modal>
      </div>
    `},h=[`Default`,`Sizes`,`ScrollableBody`,`Nested`,`CloseReasons`]})))()}g();export{m as CloseReasons,u as Default,p as Nested,f as ScrollableBody,d as Sizes,h as __namedExportsOrder,l as default};