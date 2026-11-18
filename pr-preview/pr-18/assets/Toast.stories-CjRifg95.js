import{s as e,t}from"./lit-MXP2jLr5.js";import{a as n,l as r,n as i,o as a,s as o}from"./play-utils-Cj5Kn2Rl.js";import{n as s,t as c}from"./alert-service-BsvvLxgn.js";import{t as l}from"./modal-D7i1Cp2u.js";import{t as u}from"./button-DhL0lY_i.js";import{n as d,r as f,t as p}from"./toast-CaHps-he.js";import{t as m}from"./rolldown-runtime-Dh6celcD.js";var h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=m((()=>{t(),p(),u(),l(),f(),s(),n(),{expect:h,waitFor:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/Toast`,component:`aui-toast`,parameters:{docs:{description:{component:'\n**Anchor UI — Toast 通知 (`<aui-toast>`, `ToastService`)**\n\n堆疊的全域通知（Popover API 進入 Top Layer），支援 Success、Error、Warning、Info、Loading 5 種狀態。\n位置以 `ToastService.configure({ placement })` 設定：`top-left`、`top-center`、`top-right`、`bottom-left`、`bottom-center`、`bottom-right`（預設）；新通知出現在靠近螢幕邊緣的一側。手機（寬度 480px 以下，或橫放時高度 480px 以下）一律顯示在中間上方。\n`ToastService` 為全頁單例（`globalThis[Symbol.for(\'anchor-ui.toast@1\')]`）：佇列與同時顯示上限、各狀態預設停留時間、\n以 `handle.update()` 或相同 `id` 更新既有通知（如 Loading 轉 Success）。\n以 live region 播報（Error 為 `role="alert"`，其餘為 `role="status"`）；滑鼠停在通知上或焦點位於通知內時暫停自動關閉。\nModal / Alert 開啟期間通知會移入最上層 modal，仍可見、可操作且可被播報。\n        '}}},argTypes:{variant:{control:`inline-radio`,options:[`success`,`error`,`warning`,`info`,`loading`]},title:{control:`text`},message:{control:`text`},duration:{control:{type:`number`,min:0,step:500},description:`自動關閉時間（毫秒）；0 為不自動關閉；空白則依狀態使用預設值`}},args:{variant:`success`,title:``,message:`複製成功`,duration:3e3}},v={render:t=>e`
    <aui-button
      @click=${()=>d.show({variant:t.variant,title:t.title||void 0,message:t.message,duration:t.duration})}
      >顯示通知</aui-button
    >
  `},y={render:()=>e`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <aui-button variant="success" @click=${()=>d.success(`複製成功`)}
        >success</aui-button
      >
      <aui-button
        variant="danger"
        @click=${()=>d.error(`連線逾時，請稍後再試`,{title:`上傳失敗`})}
        >error</aui-button
      >
      <aui-button variant="accent" @click=${()=>d.warning(`儲存空間即將用盡`)}
        >warning</aui-button
      >
      <aui-button variant="ghost" @click=${()=>d.info(`有新版本可以更新`)}
        >info</aui-button
      >
      <aui-button
        variant="ghost"
        @click=${()=>d.loading(`處理中…`,{duration:3e3})}
        >loading</aui-button
      >
    </div>
  `},b=[`top-left`,`top-center`,`top-right`,`bottom-left`,`bottom-center`,`bottom-right`],x={render:()=>e`
    <div
      style="display: grid; grid-template-columns: repeat(3, max-content); gap: 8px; justify-content: center; padding-block: 120px;"
    >
      ${b.map(t=>e`
          <aui-button
            variant="ghost"
            data-placement=${t}
            @click=${()=>{d.configure({placement:t}),d.info(`位置：${t}`)}}
            >${t}</aui-button
          >
        `)}
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=t=>a(e,`[data-placement="${t}"]`);try{await t(`切換到左上：Viewport 貼齊左上角`,async()=>{await i(n(`top-left`)),await g(()=>h(r(o()).length).toBe(1));let e=o().getBoundingClientRect();await h(Math.round(e.left)).toBe(24),await h(Math.round(e.top)).toBe(24)}),await t(`切換到中間下方：顯示中的通知一起移動並水平置中`,async()=>{await i(n(`bottom-center`)),await g(()=>h(r(o()).length).toBe(2));let e=o().getBoundingClientRect();await h(Math.round(window.innerHeight-e.bottom)).toBe(24),await h(Math.abs(e.left+e.width/2-window.innerWidth/2)).toBeLessThan(1)})}finally{await d.closeAll(),d.resetConfig()}}},S={name:`Loading → Success`,render:()=>e`
    <aui-button
      @click=${()=>{let e=d.loading(`上傳中…`);setTimeout(()=>e.update({variant:`success`,message:`上傳完成`}),1500)}}
      >模擬上傳</aui-button
    >
  `},C={name:`Queue & max visible`,render:()=>e`
    <aui-button
      @click=${()=>{for(let e=1;e<=6;e++)d.info(`第 ${e} 則通知`,{duration:2e3})}}
      >連續觸發 6 則（同時最多 3 則）</aui-button
    >
  `},w={name:`Same id (no stacking)`,render:()=>e`
    <aui-button @click=${()=>d.success(`已複製到剪貼簿`,{id:`copy`})}
      >重複點擊只會更新同一則</aui-button
    >
  `},T={name:`Above Modal / Alert`,render:()=>e`
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
          <aui-button @click=${()=>d.success(`已儲存草稿`)}>顯示通知</aui-button>
          <aui-button
            variant="ghost"
            @click=${async()=>{d.info(`Alert 開啟時通知仍在最上層`,{duration:6e3}),await c.confirm({title:`確定要離開嗎？`})}}
            >通知 + Alert</aui-button
          >
        </div>
      </aui-modal>
    </div>
  `},E={name:`Static <aui-toast>`,render:()=>e`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 380px;">
      <aui-toast variant="success" heading="已儲存" message="直接放在頁面上的靜態卡片"></aui-toast>
      <aui-toast variant="error" message="點擊關閉鈕只會分派 aui-close" no-close-button></aui-toast>
    </div>
  `},D=[`Default`,`Variants`,`Placement`,`LoadingToSuccess`,`Queue`,`SameId`,`AboveModal`,`Static`]})))()}O();export{T as AboveModal,v as Default,S as LoadingToSuccess,x as Placement,C as Queue,w as SameId,E as Static,y as Variants,D as __namedExportsOrder,_ as default};