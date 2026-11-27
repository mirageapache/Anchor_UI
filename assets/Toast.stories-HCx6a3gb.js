import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{a as r,l as i,n as a,o,s}from"./play-utils-DUto8Om5.js";import{n as c,t as l}from"./alert-service-D8lfcGNJ.js";import{t as u}from"./button-CQ6kAZlu.js";import{t as d}from"./modal-DMBLNh1X.js";import{n as f,r as p,t as m}from"./toast-CBqvq918.js";var h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{n(),m(),u(),d(),p(),c(),r(),{expect:h,waitFor:g}=__STORYBOOK_MODULE_TEST__,_={title:`Components/Toast`,component:`aui-toast`,parameters:{docs:{description:{component:'\n**Anchor UI — Toast 通知 (`<aui-toast>`, `ToastService`)**\n\n堆疊的全域通知（Popover API 進入 Top Layer），支援 Success、Error、Warning、Info、Loading 5 種狀態。\n位置以 `ToastService.configure({ placement })` 設定：`top-left`、`top-center`、`top-right`、`bottom-left`、`bottom-center`、`bottom-right`（預設）；新通知出現在靠近螢幕邊緣的一側。手機（寬度 480px 以下，或橫放時高度 480px 以下）一律顯示在中間上方。\n`ToastService` 為全頁單例（`globalThis[Symbol.for(\'anchor-ui.toast@1\')]`）：佇列與同時顯示上限、各狀態預設停留時間、\n以 `handle.update()` 或相同 `id` 更新既有通知（如 Loading 轉 Success）。\n以 live region 播報（Error 為 `role="alert"`，其餘為 `role="status"`）；滑鼠停在通知上或焦點位於通知內時暫停自動關閉。\nModal / Alert 開啟期間通知會移入最上層 modal，仍可見、可操作且可被播報。\n        '}}},argTypes:{variant:{control:`inline-radio`,options:[`success`,`error`,`warning`,`info`,`loading`]},title:{control:`text`},message:{control:`text`},duration:{control:{type:`number`,min:0,step:500},description:`自動關閉時間（毫秒）；0 為不自動關閉；空白則依狀態使用預設值`}},args:{variant:`success`,title:``,message:`複製成功`,duration:3e3}},v={render:e=>t`
    <aui-button
      @click=${()=>f.show({variant:e.variant,title:e.title||void 0,message:e.message,duration:e.duration})}
      >顯示通知</aui-button
    >
  `},y={render:()=>t`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <aui-button variant="success" @click=${()=>f.success(`複製成功`)}
        >success</aui-button
      >
      <aui-button
        variant="danger"
        @click=${()=>f.error(`連線逾時，請稍後再試`,{title:`上傳失敗`})}
        >error</aui-button
      >
      <aui-button variant="accent" @click=${()=>f.warning(`儲存空間即將用盡`)}
        >warning</aui-button
      >
      <aui-button variant="ghost" @click=${()=>f.info(`有新版本可以更新`)}
        >info</aui-button
      >
      <aui-button
        variant="ghost"
        @click=${()=>f.loading(`處理中…`,{duration:3e3})}
        >loading</aui-button
      >
    </div>
  `},b=[`top-left`,`top-center`,`top-right`,`bottom-left`,`bottom-center`,`bottom-right`],x={render:()=>t`
    <div
      style="display: grid; grid-template-columns: repeat(3, max-content); gap: 8px; justify-content: center; padding-block: 120px;"
    >
      ${b.map(e=>t`
          <aui-button
            variant="ghost"
            data-placement=${e}
            @click=${()=>{f.configure({placement:e}),f.info(`位置：${e}`)}}
            >${e}</aui-button
          >
        `)}
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=t=>o(e,`[data-placement="${t}"]`);try{await t(`切換到左上：Viewport 貼齊左上角`,async()=>{await a(n(`top-left`)),await g(()=>h(i(s()).length).toBe(1));let e=s().getBoundingClientRect();await h(Math.round(e.left)).toBe(24),await h(Math.round(e.top)).toBe(24)}),await t(`切換到中間下方：顯示中的通知一起移動並水平置中`,async()=>{await a(n(`bottom-center`)),await g(()=>h(i(s()).length).toBe(2));let e=s().getBoundingClientRect();await h(Math.round(window.innerHeight-e.bottom)).toBe(24),await h(Math.abs(e.left+e.width/2-window.innerWidth/2)).toBeLessThan(1)})}finally{await f.closeAll(),f.resetConfig()}}},S={name:`Loading → Success`,render:()=>t`
    <aui-button
      @click=${()=>{let e=f.loading(`上傳中…`);setTimeout(()=>e.update({variant:`success`,message:`上傳完成`}),1500)}}
      >模擬上傳</aui-button
    >
  `},C={name:`Queue & max visible`,render:()=>t`
    <aui-button
      @click=${()=>{for(let e=1;e<=6;e++)f.info(`第 ${e} 則通知`,{duration:2e3})}}
      >連續觸發 6 則（同時最多 3 則）</aui-button
    >
  `},w={name:`Same id (no stacking)`,render:()=>t`
    <aui-button @click=${()=>f.success(`已複製到剪貼簿`,{id:`copy`})}
      >重複點擊只會更新同一則</aui-button
    >
  `},T={name:`Above Modal / Alert`,render:()=>t`
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
          <aui-button @click=${()=>f.success(`已儲存草稿`)}>顯示通知</aui-button>
          <aui-button
            variant="ghost"
            @click=${async()=>{f.info(`Alert 開啟時通知仍在最上層`,{duration:6e3}),await l.confirm({title:`確定要離開嗎？`})}}
            >通知 + Alert</aui-button
          >
        </div>
      </aui-modal>
    </div>
  `},E={name:`Static <aui-toast>`,render:()=>t`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 380px;">
      <aui-toast variant="success" heading="已儲存" message="直接放在頁面上的靜態卡片"></aui-toast>
      <aui-toast variant="error" message="點擊關閉鈕只會分派 aui-close" no-close-button></aui-toast>
    </div>
  `},D=[`Default`,`Variants`,`Placement`,`LoadingToSuccess`,`Queue`,`SameId`,`AboveModal`,`Static`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <aui-button
      @click=\${() => ToastService.show({
    variant: args.variant,
    title: args.title || undefined,
    message: args.message,
    duration: args.duration
  })}
      >顯示通知</aui-button
    >
  \`
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <aui-button variant="success" @click=\${() => ToastService.success('複製成功')}
        >success</aui-button
      >
      <aui-button
        variant="danger"
        @click=\${() => ToastService.error('連線逾時，請稍後再試', {
    title: '上傳失敗'
  })}
        >error</aui-button
      >
      <aui-button variant="accent" @click=\${() => ToastService.warning('儲存空間即將用盡')}
        >warning</aui-button
      >
      <aui-button variant="ghost" @click=\${() => ToastService.info('有新版本可以更新')}
        >info</aui-button
      >
      <aui-button
        variant="ghost"
        @click=\${() => ToastService.loading('處理中…', {
    duration: 3000
  })}
        >loading</aui-button
      >
    </div>
  \`
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div
      style="display: grid; grid-template-columns: repeat(3, max-content); gap: 8px; justify-content: center; padding-block: 120px;"
    >
      \${PLACEMENTS.map(placement => html\`
          <aui-button
            variant="ghost"
            data-placement=\${placement}
            @click=\${() => {
    ToastService.configure({
      placement
    });
    ToastService.info(\`位置：\${placement}\`);
  }}
            >\${placement}</aui-button
          >
        \`)}
    </div>
  \`,
  play: async ({
    canvasElement,
    step
  }) => {
    const button = (placement: ToastPlacement) => query(canvasElement, \`[data-placement="\${placement}"]\`);
    try {
      await step('切換到左上：Viewport 貼齊左上角', async () => {
        await clickButton(button('top-left'));
        await waitFor(() => expect(visibleToasts(toastViewport()).length).toBe(1));
        const rect = toastViewport()!.getBoundingClientRect();
        await expect(Math.round(rect.left)).toBe(24);
        await expect(Math.round(rect.top)).toBe(24);
      });
      await step('切換到中間下方：顯示中的通知一起移動並水平置中', async () => {
        await clickButton(button('bottom-center'));
        await waitFor(() => expect(visibleToasts(toastViewport()).length).toBe(2));
        const rect = toastViewport()!.getBoundingClientRect();
        await expect(Math.round(window.innerHeight - rect.bottom)).toBe(24);
        await expect(Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2)).toBeLessThan(1);
      });
    } finally {
      await ToastService.closeAll();
      ToastService.resetConfig();
    }
  }
}`,...x.parameters?.docs?.source},description:{story:`六種位置：點擊按鈕切換位置並顯示一則通知。新通知出現在靠近螢幕邊緣的一側，
進場與退場的方向也跟著位置改變。把視窗寬度縮到 480px 以下（或橫向時高度縮到 480px 以下）時，一律顯示在中間上方。`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Loading → Success',
  render: () => html\`
    <aui-button
      @click=\${() => {
    const upload = ToastService.loading('上傳中…');
    setTimeout(() => upload.update({
      variant: 'success',
      message: '上傳完成'
    }), 1500);
  }}
      >模擬上傳</aui-button
    >
  \`
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Queue & max visible',
  render: () => html\`
    <aui-button
      @click=\${() => {
    for (let i = 1; i <= 6; i++) ToastService.info(\`第 \${i} 則通知\`, {
      duration: 2000
    });
  }}
      >連續觸發 6 則（同時最多 3 則）</aui-button
    >
  \`
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Same id (no stacking)',
  render: () => html\`
    <aui-button @click=\${() => ToastService.success('已複製到剪貼簿', {
    id: 'copy'
  })}
      >重複點擊只會更新同一則</aui-button
    >
  \`
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'Above Modal / Alert',
  render: () => html\`
    <div class="story">
      <aui-button
        @click=\${(event: Event) => {
    (event.currentTarget as HTMLElement).closest('.story')!.querySelector<AuiModal>('aui-modal')!.open = true;
  }}
        >開啟 Modal</aui-button
      >
      <aui-modal heading="編輯">
        <p style="margin-top: 0;">
          Modal 開啟期間，通知會移入 Modal 的子樹，仍可見、可操作且可被螢幕閱讀器播報。
        </p>
        <div style="display: flex; gap: 8px;">
          <aui-button @click=\${() => ToastService.success('已儲存草稿')}>顯示通知</aui-button>
          <aui-button
            variant="ghost"
            @click=\${async () => {
    ToastService.info('Alert 開啟時通知仍在最上層', {
      duration: 6000
    });
    await AlertService.confirm({
      title: '確定要離開嗎？'
    });
  }}
            >通知 + Alert</aui-button
          >
        </div>
      </aui-modal>
    </div>
  \`
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'Static <aui-toast>',
  render: () => html\`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 380px;">
      <aui-toast variant="success" heading="已儲存" message="直接放在頁面上的靜態卡片"></aui-toast>
      <aui-toast variant="error" message="點擊關閉鈕只會分派 aui-close" no-close-button></aui-toast>
    </div>
  \`
}`,...E.parameters?.docs?.source}}}})))()}O();export{T as AboveModal,v as Default,S as LoadingToSuccess,x as Placement,C as Queue,w as SameId,E as Static,y as Variants,D as __namedExportsOrder,_ as default};