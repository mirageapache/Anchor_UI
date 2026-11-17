import{s as e,t}from"./lit-MXP2jLr5.js";import{a as n,i as r,o as i}from"./play-utils-Cj5Kn2Rl.js";import{t as a}from"./dropzone-B9pNeUmW.js";import{t as o}from"./output-Dso8GA4N.js";import{t as s}from"./rolldown-runtime-Dh6celcD.js";function c(e){let t=e.currentTarget.parentElement.querySelector(`aui-output`);if(e.type===`aui-file-drop`){let{files:n,source:r}=e.detail;t.status=`success`,t.value=n.map(e=>`${e.name} (${e.type||`unknown`}, ${p(e.size)})`).join(`
`).concat(`\nsource: ${r}`)}else{let{rejections:n}=e.detail;t.status=`error`,t.value=n.map(({file:e,reason:t})=>`${e.name} — ${t}`).join(`
`)}}function l(e,t){let n=new DataTransfer;for(let e of t)n.items.add(e);return new DragEvent(e,{dataTransfer:n,bubbles:!0,cancelable:!0,composed:!0})}var u,d,f,p,m,h,g,_,v;function y(){return(y=s((()=>{t(),a(),o(),n(),{expect:u,waitFor:d}=__STORYBOOK_MODULE_TEST__,f={title:`Components/Dropzone`,component:`aui-dropzone`,parameters:{docs:{description:{component:'\n**Anchor UI — Dropzone 拖放檔案上傳區 (`<aui-dropzone>`)**\n\n虛線框外觀的拖放式檔案上傳區：可拖入檔案，或點擊（Enter / Space）開啟原生檔案選取器。\n拖曳檔案懸浮於上方時，整塊染上 Accent 琥珀色並加亮邊框。\n\n- `accept` 的規則同原生 `<input type="file">`（副檔名、MIME 類型、`image/*`），並自動顯示格式提示。\n- 拖放不受原生選取器過濾，元件會自行檢查：符合的檔案由 `aui-file-drop` 送出（`detail.files` 為 `File` 陣列），\n  不符合的由 `aui-file-reject` 送出並顯示錯誤訊息。\n- 未設定 `multiple` 時只接受第一個符合的檔案。\n- 本元件只負責取得檔案，不參與表單送出，也不保留已選擇的檔案。\n'}}},argTypes:{accept:{control:`text`,description:"允許的檔案格式（同原生 input accept），如 `.json,image/*`"},multiple:{control:`boolean`,description:`是否允許一次選擇多個檔案`,table:{defaultValue:{summary:`false`}}},disabled:{control:`boolean`,description:`是否停用`,table:{defaultValue:{summary:`false`}}},heading:{control:`text`,description:`主要提示文字（或使用預設 slot）`},hint:{control:`text`,description:`輔助提示；未設定且有 accept 時自動產生格式提示`}},args:{accept:`.json,image/*`,multiple:!0,disabled:!1,heading:`拖放檔案到此處，或點擊選擇檔案`,hint:``}},p=e=>e<1024?`${e} B`:`${(e/1024).toFixed(1)} KB`,m={render:t=>e`
    <div style="display: grid; gap: 12px; max-width: 480px;">
      <aui-dropzone
        accept=${t.accept}
        ?multiple=${t.multiple}
        ?disabled=${t.disabled}
        heading=${t.heading}
        hint=${t.hint}
        @aui-file-drop=${c}
        @aui-file-reject=${c}
      ></aui-dropzone>
      <aui-output label="取得的檔案" placeholder="尚未選擇檔案"></aui-output>
    </div>
  `},h={render:()=>e`
    <div style="display: grid; gap: 12px; max-width: 480px;">
      <aui-dropzone
        accept=".json,image/*"
        multiple
        @aui-file-drop=${c}
        @aui-file-reject=${c}
      ></aui-dropzone>
      <aui-output label="取得的檔案" placeholder="尚未選擇檔案"></aui-output>
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=i(e,`aui-dropzone`),a=i(e,`aui-output`),o=r(n,`.dropzone`),s=new File([`{"ok":true}`],`data.json`,{type:`application/json`}),c=new File([new Uint8Array([137,80,78,71])],`photo.png`,{type:`image/png`}),f=new File([`hello`],`notes.txt`,{type:`text/plain`});await t(`拖曳檔案懸浮時顯示琥珀色回饋`,async()=>{o.dispatchEvent(l(`dragenter`,[s])),await d(()=>u(o.classList.contains(`is-dragging`)).toBe(!0))}),await t(`放下 JSON 與圖片：取得 File 物件`,async()=>{let e;n.addEventListener(`aui-file-drop`,t=>e=t.detail,{once:!0}),o.dispatchEvent(l(`drop`,[s,c])),await u(e?.files.map(e=>e.name)).toEqual([`data.json`,`photo.png`]),await u(e?.files.every(e=>e instanceof File)).toBe(!0),await u(await e.files[0].text()).toBe(`{"ok":true}`),await d(()=>u(o.classList.contains(`is-dragging`)).toBe(!1)),await d(()=>u(a.value).toContain(`data.json`))}),await t(`放下不支援的格式：顯示錯誤訊息，不送出 aui-file-drop`,async()=>{let e=!1,t=()=>e=!0;n.addEventListener(`aui-file-drop`,t),o.dispatchEvent(l(`drop`,[f])),n.removeEventListener(`aui-file-drop`,t),await u(e).toBe(!1),await d(()=>u(r(n,`.dropzone__error`).textContent).toContain(`notes.txt`)),await d(()=>u(a.status).toBe(`error`))})}},g={render:()=>e`
    <div style="display: grid; gap: 16px; max-width: 480px;">
      <aui-dropzone></aui-dropzone>
      <aui-dropzone accept=".csv" hint="CSV，單一檔案上限 5 MB"></aui-dropzone>
      <aui-dropzone accept=".json" disabled></aui-dropzone>
    </div>
  `},_={render:()=>e`
    <div style="max-width: 480px;">
      <aui-dropzone accept="image/*" multiple>
        將圖片拖放到這裡
        <span slot="hint">PNG、JPG 或 WebP，可一次選擇多張</span>
      </aui-dropzone>
    </div>
  `},v=[`Default`,`DropFiles`,`States`,`CustomContent`]})))()}y();export{_ as CustomContent,m as Default,h as DropFiles,g as States,v as __namedExportsOrder,f as default};