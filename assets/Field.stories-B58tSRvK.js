import{s as e,t}from"./lit-MXP2jLr5.js";import{t as n}from"./segmented-B0m5SQ25.js";import{t as r}from"./button-DhL0lY_i.js";import{t as i}from"./input-Br5UZOpr.js";import{t as a}from"./output-Dso8GA4N.js";import{t as o}from"./field-C1a6gQlg.js";import{t as s}from"./rolldown-runtime-Dh6celcD.js";var c,l,u,d,f,p;function m(){return(m=s((()=>{t(),o(),i(),a(),n(),r(),c={title:`Components/Field`,component:`aui-field`,parameters:{docs:{description:{component:"\n**Anchor UI — Field 表單欄位容器 (`<aui-field>`)**\n\n上方標題列（左側標題、右側快捷複製／清除按鈕，沿用 `<aui-icon-button>`），下方為 `<aui-input>` 與次要描述。\n標題與描述會傳入輸入框，在輸入框自身的 Shadow DOM 內完成無障礙關聯，螢幕閱讀器會將其讀為輸入框的名稱與描述；\n點擊標題即聚焦輸入框。清除鈕會分派 `input` / `change`，與框架的雙向綁定保持同步。\n        "}}},argTypes:{label:{control:`text`,description:`欄位標題（輸入框的無障礙名稱）`},description:{control:`text`,description:`次要描述（輸入框的無障礙描述）`},copyable:{control:`boolean`,description:`顯示複製鈕`,table:{defaultValue:{summary:`false`}}},clearable:{control:`boolean`,description:`顯示清除鈕`,table:{defaultValue:{summary:`false`}}},value:{control:`text`,description:`輸入框預設值`},multiline:{control:`boolean`,description:`輸入框是否為多行`}},args:{label:`Input`,description:`貼上任意文字進行編碼`,copyable:!0,clearable:!0,value:`Hello, Anchor UI!`,multiline:!1}},l={render:t=>e`
    <div style="max-width: 480px;">
      <aui-field
        label=${t.label}
        description=${t.description}
        ?copyable=${t.copyable}
        ?clearable=${t.clearable}
      >
        <aui-input value=${t.value} ?multiline=${t.multiline}></aui-input>
      </aui-field>
    </div>
  `},u={render:()=>e`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 480px;">
      <aui-field label="只有標題">
        <aui-input placeholder="Type here"></aui-input>
      </aui-field>
      <aui-field label="Access token" description="可於帳號設定頁面取得" copyable clearable>
        <aui-input value="tok_9f8e7d6c5b4a"></aui-input>
      </aui-field>
      <aui-field label="Request body" description="僅接受 JSON" copyable>
        <aui-input multiline rows="4" value=${`{
  "ok": true
}`}></aui-input>
      </aui-field>
      <aui-field label="唯讀結果" copyable clearable>
        <aui-input value="readonly 時清除鈕自動停用" readonly></aui-input>
      </aui-field>
    </div>
  `},d={name:`Custom actions`,render:()=>e`
      <div style="max-width: 480px;">
        <aui-field label="UUID" copyable>
          <aui-button slot="actions" size="sm" variant="ghost" @click=${e=>{let t=e.target.closest(`aui-field`);t.querySelector(`aui-output`).value=crypto.randomUUID()}}>產生</aui-button>
          <aui-output placeholder="按下「產生」建立 UUID"></aui-output>
        </aui-field>
      </div>
    `},f={name:`Input → Output`,render:()=>{let t=e=>btoa(String.fromCharCode(...new TextEncoder().encode(e))),n=e=>{let t=Uint8Array.from(atob(e.trim()),e=>e.charCodeAt(0));return new TextDecoder(`utf-8`,{fatal:!0}).decode(t)},r=e=>{let r=e.target.closest(`.demo`),i=r.querySelector(`aui-input`),a=r.querySelector(`aui-segmented`).value,o=r.querySelector(`aui-output`);if(!i.value){o.value=``;return}try{o.value=a===`encode`?t(i.value):n(i.value),o.status=`success`}catch{o.value=`無效的 Base64 輸入`,o.status=`error`}};return e`
      <div
        class="demo"
        style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;"
        @input=${r}
        @change=${r}
      >
        <aui-field label="Mode">
          <aui-segmented
            .options=${[{value:`encode`,label:`編碼`},{value:`decode`,label:`解碼`}]}
            value="encode"
          ></aui-segmented>
        </aui-field>
        <aui-field label="Input" clearable>
          <aui-input multiline placeholder="輸入文字…"></aui-input>
        </aui-field>
        <aui-field label="Output" description="Base64 轉換結果" copyable>
          <aui-output placeholder="結果會顯示在這裡"></aui-output>
        </aui-field>
      </div>
    `}},p=[`Default`,`Layouts`,`CustomActions`,`InputToOutput`]})))()}m();export{d as CustomActions,l as Default,f as InputToOutput,u as Layouts,p as __namedExportsOrder,c as default};