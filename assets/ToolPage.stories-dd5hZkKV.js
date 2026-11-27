import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{t as r}from"./accordion-BcaxlI0S.js";import{a as i,i as a,l as o,n as s,o as c,s as l,t as u}from"./play-utils-DUto8Om5.js";import{t as d}from"./button-CQ6kAZlu.js";import{t as f}from"./input-ikeS86pY.js";import{t as p}from"./tag-Bto1ggSY.js";import{t as m}from"./header-B6PlkzdM.js";import{t as h}from"./card-BXG6GYEi.js";import{t as g}from"./field-BdLK10Mz.js";import{t as _}from"./segmented-CucCfQn5.js";import{t as v}from"./dropzone-ChohihSD.js";import{t as y}from"./output-DKfCHWX0.js";import{t as b}from"./kbd-D_ILoRAM.js";import{n as x,r as S,t as C}from"./toast-CBqvq918.js";function w(e){let t=c(e,`aui-input`),n=c(e,`aui-segmented`).value,r=c(e,`aui-output`);if(!t.value.trim())r.value=``;else try{let e=JSON.parse(t.value);r.status=`success`,r.value=JSON.stringify(e,null,n===`min`?void 0:Number(n))}catch(e){r.status=`error`,r.value=e instanceof Error?e.message:String(e)}}function T(e,t){let n=new DataTransfer;for(let e of t)n.items.add(e);return new DragEvent(e,{dataTransfer:n,bubbles:!0,cancelable:!0,composed:!0})}var E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{n(),r(),d(),h(),v(),g(),m(),f(),b(),y(),_(),p(),C(),S(),i(),{expect:E,userEvent:D,waitFor:O}=__STORYBOOK_MODULE_TEST__,k={title:`Scenarios/Tool Page`,tags:[`!autodocs`],parameters:{layout:`fullscreen`,docs:{description:{component:`以 Anchor UI 元件拼裝的工具原型頁面（JSON Formatter）：頁首（Header）、檔案拖放（Dropzone）、輸入與輸出（Field / Input / Output）、縮排選擇（Segmented）、操作說明與 FAQ（Accordion）、快捷鍵提示（Kbd）與相關工具（Card）。`}}}},A=[{value:`2`,label:`2 空格`},{value:`4`,label:`4 空格`},{value:`min`,label:`壓縮`}],j=e=>e.currentTarget.closest(`[data-page]`),M=()=>t`
  <div
    data-page
    class="container"
    style="display: grid; gap: 24px; padding-block: 32px; max-width: 880px;"
  >
    <aui-header
      heading="JSON Formatter"
      description="格式化、驗證並壓縮 JSON 文件，所有運算皆在瀏覽器內完成，資料不會離開你的裝置。"
      hot
      favoritable
      @aui-favorite-change=${e=>x.success(e.detail.favorite?`已加入我的最愛`:`已從我的最愛移除`)}
    >
      <aui-tag slot="tags" variant="brand">json</aui-tag>
      <aui-tag slot="tags">format</aui-tag>
    </aui-header>

    <aui-dropzone
      accept=".json"
      heading="拖放 JSON 檔案到此處，或點擊選擇檔案"
      @aui-file-drop=${async e=>{let t=j(e),[n]=e.detail.files;c(t,`aui-input`).value=await n.text(),w(t),x.info(`已載入 ${n.name}`)}}
    ></aui-dropzone>

    <aui-field label="Input" description="貼上 JSON，或由上方載入檔案" clearable>
      <aui-input
        multiline
        rows="6"
        placeholder='{"name":"anchor-ui"}'
        @input=${e=>w(j(e))}
      ></aui-input>
    </aui-field>

    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px;">
      <aui-segmented
        label="縮排"
        .options=${A}
        value="2"
        @change=${e=>w(j(e))}
      ></aui-segmented>
      <aui-button data-testid="format" @click=${e=>w(j(e))}
        >格式化</aui-button
      >
      <span style="font-size: 12px; color: var(--color-text-secondary);">
        輸入時自動格式化；<aui-kbd size="sm">Tab</aui-kbd> 移至下一個欄位
      </span>
    </div>

    <aui-field label="Output" copyable>
      <aui-output placeholder="結果會顯示在這裡"></aui-output>
    </aui-field>

    <section style="display: grid; gap: 12px;">
      <aui-accordion heading="使用說明" open>
        <p>貼上 JSON 或拖入 <code>.json</code> 檔案，結果會立即顯示在下方。</p>
        <ul>
          <li>選擇縮排寬度，或以「壓縮」移除所有空白</li>
          <li>格式錯誤時會顯示解析器回報的錯誤訊息</li>
        </ul>
      </aui-accordion>
      <aui-accordion heading="資料會上傳到伺服器嗎？" variant="faq" name="faq">
        <p>不會，所有運算皆在本機完成。</p>
      </aui-accordion>
      <aui-accordion heading="支援 JSON5 或註解嗎？" variant="faq" name="faq">
        <p>不支援，僅接受標準 JSON。</p>
      </aui-accordion>
    </section>

    <section>
      <h2 class="section-label" style="margin: 0 0 12px;">相關工具</h2>
      <ul class="card-grid">
        <li>
          <aui-card
            heading="JWT Decoder"
            description="檢視 JSON Web Token 的 header、payload 與簽章。"
            href="#jwt"
            hot
          >
            <aui-tag slot="tags" variant="info">jwt</aui-tag>
          </aui-card>
        </li>
        <li>
          <aui-card heading="Base64" description="編碼與解碼 Base64 文字與檔案。" href="#base64">
            <aui-tag slot="tags" variant="success">encode</aui-tag>
          </aui-card>
        </li>
        <li>
          <aui-card heading="UUID Generator" description="產生 v4 / v7 UUID。" href="#uuid">
            <aui-tag slot="tags" variant="purple">uuid</aui-tag>
          </aui-card>
        </li>
      </ul>
    </section>
  </div>
`,N={render:M},P={render:M,play:async({canvasElement:e,step:t})=>{let n=c(e,`aui-input`),r=c(e,`aui-output`),i=c(e,`aui-dropzone`),d=c(e,`aui-segmented`),f=c(e,`aui-header`),p=a(i,`.dropzone`);await t(`拖入 JSON 檔案：內容載入輸入框並格式化`,async()=>{let e=new File([`{"name":"anchor-ui","phase":3}`],`package.json`,{type:`application/json`});p.dispatchEvent(T(`drop`,[e])),await O(()=>E(n.value).toBe(`{"name":"anchor-ui","phase":3}`)),await O(()=>E(r.value).toBe(`{
  "name": "anchor-ui",
  "phase": 3
}`)),await E(r.status).toBe(`success`)}),await t(`切換為壓縮：結果移除所有空白`,async()=>{await u(d,2),await O(()=>E(r.value).toBe(`{"name":"anchor-ui","phase":3}`))}),await t(`拖入不支援的檔案：顯示錯誤，內容不變`,async()=>{p.dispatchEvent(T(`drop`,[new File([`x`],`notes.txt`,{type:`text/plain`})])),await O(()=>E(a(i,`.dropzone__error`).textContent).toContain(`notes.txt`)),await E(n.value).toBe(`{"name":"anchor-ui","phase":3}`)}),await t(`輸入不合法的 JSON：輸出框以錯誤狀態顯示訊息`,async()=>{n.value=`{"name": }`,await s(c(e,`[data-testid="format"]`)),await O(()=>E(r.status).toBe(`error`)),await E(r.value).not.toBe(``)}),await t(`加入我的最愛：Header 轉發事件並顯示通知`,async()=>{let e=a(f,`aui-favorite-btn`);await e.updateComplete,await D.click(a(e,`button`)),await E(f.favorite).toBe(!0),await O(()=>E(o(l()).some(e=>e.message===`已加入我的最愛`)).toBe(!0))}),await t(`FAQ 互斥：展開第二題時第一題收合，使用說明不受影響`,async()=>{let[t,n,r]=[...e.querySelectorAll(`aui-accordion`)];await D.click(a(n,`summary`)),await O(()=>E(n.open).toBe(!0)),await D.click(a(r,`summary`)),await O(()=>E(r.open).toBe(!0)),await O(()=>E(n.open).toBe(!1)),await E(t.open).toBe(!0)}),await t(`相關工具以卡片格線呈現，無橫向溢位`,async()=>{let t=c(e,`.card-grid`);await E(t.querySelectorAll(`aui-card`).length).toBe(3),await E(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth)}),await x.closeAll()}},F=[`Page`,`Workflow`],N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: toolPage
}`,...N.parameters?.docs?.source},description:{story:`完整頁面：可直接操作（拖入 .json 檔案、輸入、切換縮排、收藏）`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: toolPage,
  play: async ({
    canvasElement,
    step
  }) => {
    const input = query<AuiInput>(canvasElement, 'aui-input');
    const output = query<AuiOutput>(canvasElement, 'aui-output');
    const dropzone = query<AuiDropzone>(canvasElement, 'aui-dropzone');
    const segmented = query<AuiSegmented>(canvasElement, 'aui-segmented');
    const header = query<AuiHeader>(canvasElement, 'aui-header');
    const zone = inShadow(dropzone, '.dropzone');
    await step('拖入 JSON 檔案：內容載入輸入框並格式化', async () => {
      const file = new File(['{"name":"anchor-ui","phase":3}'], 'package.json', {
        type: 'application/json'
      });
      zone.dispatchEvent(fileDrag('drop', [file]));
      await waitFor(() => expect(input.value).toBe('{"name":"anchor-ui","phase":3}'));
      await waitFor(() => expect(output.value).toBe('{\\n  "name": "anchor-ui",\\n  "phase": 3\\n}'));
      await expect(output.status).toBe('success');
    });
    await step('切換為壓縮：結果移除所有空白', async () => {
      await chooseOption(segmented, 2);
      await waitFor(() => expect(output.value).toBe('{"name":"anchor-ui","phase":3}'));
    });
    await step('拖入不支援的檔案：顯示錯誤，內容不變', async () => {
      zone.dispatchEvent(fileDrag('drop', [new File(['x'], 'notes.txt', {
        type: 'text/plain'
      })]));
      await waitFor(() => expect(inShadow(dropzone, '.dropzone__error').textContent).toContain('notes.txt'));
      await expect(input.value).toBe('{"name":"anchor-ui","phase":3}');
    });
    await step('輸入不合法的 JSON：輸出框以錯誤狀態顯示訊息', async () => {
      input.value = '{"name": }';
      await clickButton(query(canvasElement, '[data-testid="format"]'));
      await waitFor(() => expect(output.status).toBe('error'));
      await expect(output.value).not.toBe('');
    });
    await step('加入我的最愛：Header 轉發事件並顯示通知', async () => {
      const favorite = inShadow<AuiFavoriteBtn>(header, 'aui-favorite-btn');
      await favorite.updateComplete;
      await userEvent.click(inShadow(favorite, 'button'));
      await expect(header.favorite).toBe(true);
      await waitFor(() => expect(visibleToasts(toastViewport()).some(toast => toast.message === '已加入我的最愛')).toBe(true));
    });
    await step('FAQ 互斥：展開第二題時第一題收合，使用說明不受影響', async () => {
      const [guide, first, second] = [...canvasElement.querySelectorAll<AuiAccordion>('aui-accordion')];
      await userEvent.click(inShadow(first, 'summary'));
      await waitFor(() => expect(first.open).toBe(true));
      await userEvent.click(inShadow(second, 'summary'));
      await waitFor(() => expect(second.open).toBe(true));
      await waitFor(() => expect(first.open).toBe(false));
      await expect(guide.open).toBe(true);
    });
    await step('相關工具以卡片格線呈現，無橫向溢位', async () => {
      const grid = query(canvasElement, '.card-grid');
      await expect(grid.querySelectorAll('aui-card').length).toBe(3);
      await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
    });
    await ToastService.closeAll();
  }
}`,...P.parameters?.docs?.source},description:{story:`操作流程：拖入檔案 → 自動格式化 → 切換縮排 → 輸入錯誤內容 → 收藏 → 展開 FAQ`,...P.parameters?.docs?.description}}}})))()}I();export{N as Page,P as Workflow,F as __namedExportsOrder,k as default};