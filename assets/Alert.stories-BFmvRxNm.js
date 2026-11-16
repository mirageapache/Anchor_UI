import{s as e,t}from"./lit-MXP2jLr5.js";import{n,t as r}from"./alert-service-Lw4TfDAU.js";import{t as i}from"./modal-D7i1Cp2u.js";import{t as a}from"./button-DhL0lY_i.js";import{t as o}from"./alert-B233QQIC.js";import{t as s}from"./rolldown-runtime-Dh6celcD.js";var c,l,u,d,f,p,m;function h(){return(h=s((()=>{t(),o(),a(),i(),n(),c=(e,t)=>{let n=e.closest(`.story`).querySelector(`output`);n&&(n.textContent=t)},l={title:`Components/Alert`,component:`aui-alert`,parameters:{docs:{description:{component:"\n**Anchor UI — Alert 提示與確認對話框 (`<aui-alert>`, `AlertService`)**\n\nSweetAlert2 風格的提示、確認與輸入對話框，以 `<aui-modal>` 為外框（焦點、捲動鎖定、ESC 與遮罩關閉皆沿用 Modal），可於 Modal 內再開啟。\n命令式呼叫：`AlertService.alert()` / `confirm()` / `prompt()` 回傳 Promise。\nEnter 確認、ESC 取消；破壞性確認（`destructive`）的初始焦點落在取消鈕，避免誤按 Enter 執行操作。圖示動畫遵循減少動畫設定。\n        "}}},argTypes:{mode:{control:`inline-radio`,options:[`alert`,`confirm`,`prompt`]},icon:{control:`select`,options:[``,`success`,`error`,`warning`,`info`]},heading:{control:`text`},message:{control:`text`},confirmText:{control:`text`},cancelText:{control:`text`},destructive:{control:`boolean`},timer:{control:{type:`number`,min:0,step:500},description:`自動關閉的等待時間（毫秒）；0 為不自動關閉。滑鼠停在對話框上時暫停`,table:{defaultValue:{summary:`0`}}}},args:{mode:`confirm`,icon:`warning`,heading:`確定要刪除嗎？`,message:`刪除後無法復原。`,confirmText:`刪除`,cancelText:`取消`,destructive:!0,timer:0}},u={render:t=>e`
    <div class="story">
      <aui-button
        @click=${e=>{e.currentTarget.closest(`.story`).querySelector(`aui-alert`).open=!0}}
        >開啟 Alert</aui-button
      >
      <output style="margin-left: 12px; font-family: var(--font-mono); font-size: 12px;"></output>
      <aui-alert
        .mode=${t.mode}
        .icon=${t.icon||void 0}
        heading=${t.heading}
        message=${t.message}
        confirm-text=${t.confirmText}
        cancel-text=${t.cancelText}
        ?destructive=${t.destructive}
        .timer=${t.timer}
        @aui-confirm=${e=>c(e.currentTarget,`aui-confirm（value: "${e.detail.value}"）`)}
        @aui-cancel=${e=>c(e.currentTarget,`aui-cancel（reason: ${e.detail.reason}）`)}
      ></aui-alert>
    </div>
  `},d={name:`AlertService`,render:()=>e`
    <div class="story" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <aui-button
        variant="success"
        @click=${async e=>{let t=e.currentTarget;await r.alert({icon:`success`,title:`已儲存`,message:`所有變更都已儲存。`}),c(t,`alert() 已關閉`)}}
        >alert()</aui-button
      >
      <aui-button
        variant="danger"
        @click=${async e=>{let t=e.currentTarget,n=await r.confirm({icon:`warning`,title:`確定要刪除嗎？`,message:`刪除後無法復原。`,confirmText:`刪除`,destructive:!0});c(t,`confirm() → ${n}`)}}
        >confirm()</aui-button
      >
      <aui-button
        @click=${async e=>{let t=e.currentTarget,n=await r.prompt({icon:`info`,title:`重新命名`,defaultValue:`report-final.pdf`});c(t,`prompt() → ${JSON.stringify(n)}`)}}
        >prompt()</aui-button
      >
      <aui-button
        variant="ghost"
        @click=${async e=>{let t=e.currentTarget;await r.alert({icon:`success`,title:`已複製`,message:`3 秒後自動關閉（滑鼠移到對話框上會暫停）`,timer:3e3}),c(t,`alert({ timer: 3000 }) 已關閉`)}}
        >timer: 3000</aui-button
      >
      <output style="font-family: var(--font-mono); font-size: 12px;"></output>
    </div>
  `},f={render:()=>e`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      ${[`success`,`error`,`warning`,`info`].map(t=>e`
          <aui-button
            variant="ghost"
            @click=${()=>r.alert({icon:t,title:t,message:`${t} 圖示`})}
            >${t}</aui-button
          >
        `)}
    </div>
  `},p={name:`Inside a modal`,render:()=>e`
    <div class="story">
      <aui-button
        @click=${e=>{e.currentTarget.closest(`.story`).querySelector(`aui-modal`).open=!0}}
        >開啟 Modal</aui-button
      >
      <aui-modal heading="編輯項目">
        <p style="margin-top: 0;">
          在 Modal 內呼叫 AlertService.confirm()：Alert 會疊在最上層，ESC 只關閉 Alert。
        </p>
        <aui-button
          variant="danger"
          @click=${async()=>{await r.confirm({icon:`warning`,title:`刪除此項目？`,destructive:!0,confirmText:`刪除`})}}
          >刪除</aui-button
        >
      </aui-modal>
    </div>
  `},m=[`Default`,`Service`,`Icons`,`InsideModal`]})))()}h();export{u as Default,f as Icons,p as InsideModal,d as Service,m as __namedExportsOrder,l as default};