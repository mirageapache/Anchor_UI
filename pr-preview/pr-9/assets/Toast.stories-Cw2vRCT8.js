import{s as e,t}from"./lit-MXP2jLr5.js";import{n,t as r}from"./alert-service-Lw4TfDAU.js";import{t as i}from"./modal-D7i1Cp2u.js";import{t as a}from"./button-DhL0lY_i.js";import{n as o,r as s,t as c}from"./toast-CCBiYeG1.js";import{t as l}from"./rolldown-runtime-Dh6celcD.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=l((()=>{t(),c(),a(),i(),s(),n(),u={title:`Components/Toast`,component:`aui-toast`,parameters:{docs:{description:{component:'\n**Anchor UI — Toast 通知 (`<aui-toast>`, `ToastService`)**\n\n右下角堆疊的全域通知（Popover API 進入 Top Layer），支援 Success、Error、Warning、Info、Loading 5 種狀態。\n`ToastService` 為全頁單例（`globalThis[Symbol.for(\'anchor-ui.toast@1\')]`）：佇列與同時顯示上限、各狀態預設停留時間、\n以 `handle.update()` 或相同 `id` 更新既有通知（如 Loading 轉 Success）。\n以 live region 播報（Error 為 `role="alert"`，其餘為 `role="status"`）；滑鼠停在通知上或焦點位於通知內時暫停自動關閉。\nModal / Alert 開啟期間通知會移入最上層 modal，仍可見、可操作且可被播報。\n        '}}},argTypes:{variant:{control:`inline-radio`,options:[`success`,`error`,`warning`,`info`,`loading`]},title:{control:`text`},message:{control:`text`},duration:{control:{type:`number`,min:0,step:500},description:`自動關閉時間（毫秒）；0 為不自動關閉；空白則依狀態使用預設值`}},args:{variant:`success`,title:``,message:`複製成功`,duration:3e3}},d={render:t=>e`
    <aui-button
      @click=${()=>o.show({variant:t.variant,title:t.title||void 0,message:t.message,duration:t.duration})}
      >顯示通知</aui-button
    >
  `},f={render:()=>e`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <aui-button variant="success" @click=${()=>o.success(`複製成功`)}
        >success</aui-button
      >
      <aui-button
        variant="danger"
        @click=${()=>o.error(`連線逾時，請稍後再試`,{title:`上傳失敗`})}
        >error</aui-button
      >
      <aui-button variant="accent" @click=${()=>o.warning(`儲存空間即將用盡`)}
        >warning</aui-button
      >
      <aui-button variant="ghost" @click=${()=>o.info(`有新版本可以更新`)}
        >info</aui-button
      >
      <aui-button
        variant="ghost"
        @click=${()=>o.loading(`處理中…`,{duration:3e3})}
        >loading</aui-button
      >
    </div>
  `},p={name:`Loading → Success`,render:()=>e`
    <aui-button
      @click=${()=>{let e=o.loading(`上傳中…`);setTimeout(()=>e.update({variant:`success`,message:`上傳完成`}),1500)}}
      >模擬上傳</aui-button
    >
  `},m={name:`Queue & max visible`,render:()=>e`
    <aui-button
      @click=${()=>{for(let e=1;e<=6;e++)o.info(`第 ${e} 則通知`,{duration:2e3})}}
      >連續觸發 6 則（同時最多 3 則）</aui-button
    >
  `},h={name:`Same id (no stacking)`,render:()=>e`
    <aui-button @click=${()=>o.success(`已複製到剪貼簿`,{id:`copy`})}
      >重複點擊只會更新同一則</aui-button
    >
  `},g={name:`Above Modal / Alert`,render:()=>e`
    <div class="story">
      <aui-button
        @click=${e=>{e.currentTarget.closest(`.story`).querySelector(`aui-modal`).open=!0}}
        >開啟 Modal</aui-button
      >
      <aui-modal heading="編輯">
        <p style="margin-top: 0;">
          Modal 開啟期間，通知會移入 Modal 的子樹，仍可見、可操作且可被螢幕閱讀器播報。
        </p>
        <div style="display: flex; gap: 8px;">
          <aui-button @click=${()=>o.success(`已儲存草稿`)}>顯示通知</aui-button>
          <aui-button
            variant="ghost"
            @click=${async()=>{o.info(`Alert 開啟時通知仍在最上層`,{duration:6e3}),await r.confirm({title:`確定要離開嗎？`})}}
            >通知 + Alert</aui-button
          >
        </div>
      </aui-modal>
    </div>
  `},_={name:`Static <aui-toast>`,render:()=>e`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 380px;">
      <aui-toast variant="success" heading="已儲存" message="直接放在頁面上的靜態卡片"></aui-toast>
      <aui-toast variant="error" message="點擊關閉鈕只會分派 aui-close" no-close-button></aui-toast>
    </div>
  `},v=[`Default`,`Variants`,`LoadingToSuccess`,`Queue`,`SameId`,`AboveModal`,`Static`]})))()}y();export{g as AboveModal,d as Default,p as LoadingToSuccess,m as Queue,h as SameId,_ as Static,f as Variants,v as __namedExportsOrder,u as default};