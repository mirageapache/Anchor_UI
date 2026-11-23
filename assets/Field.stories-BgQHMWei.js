import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{t as r}from"./button-DdPjZonN.js";import{t as i}from"./input-B_8gflfr.js";import{t as a}from"./field-B4RvtsDj.js";import{t as o}from"./segmented-CfETZawJ.js";import{t as s}from"./output-dHCsnsJO.js";var c,l,u,d,f,p;function m(){return(m=e((()=>{n(),a(),i(),s(),o(),r(),c={title:`Components/Field`,component:`aui-field`,parameters:{docs:{description:{component:"\n**Anchor UI — Field 表單欄位容器 (`<aui-field>`)**\n\n上方標題列（左側標題、右側快捷複製／清除按鈕，沿用 `<aui-icon-button>`），下方為 `<aui-input>` 與次要描述。\n標題與描述會傳入輸入框，在輸入框自身的 Shadow DOM 內完成無障礙關聯，螢幕閱讀器會將其讀為輸入框的名稱與描述；\n點擊標題即聚焦輸入框。清除鈕會分派 `input` / `change`，與框架的雙向綁定保持同步。\n        "}}},argTypes:{label:{control:`text`,description:`欄位標題（輸入框的無障礙名稱）`},description:{control:`text`,description:`次要描述（輸入框的無障礙描述）`},copyable:{control:`boolean`,description:`顯示複製鈕`,table:{defaultValue:{summary:`false`}}},clearable:{control:`boolean`,description:`顯示清除鈕`,table:{defaultValue:{summary:`false`}}},value:{control:`text`,description:`輸入框預設值`},multiline:{control:`boolean`,description:`輸入框是否為多行`}},args:{label:`Input`,description:`貼上任意文字進行編碼`,copyable:!0,clearable:!0,value:`Hello, Anchor UI!`,multiline:!1}},l={render:e=>t`
    <div style="max-width: 480px;">
      <aui-field
        label=${e.label}
        description=${e.description}
        ?copyable=${e.copyable}
        ?clearable=${e.clearable}
      >
        <aui-input value=${e.value} ?multiline=${e.multiline}></aui-input>
      </aui-field>
    </div>
  `},u={render:()=>t`
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
  `},d={name:`Custom actions`,render:()=>t`
      <div style="max-width: 480px;">
        <aui-field label="UUID" copyable>
          <aui-button slot="actions" size="sm" variant="ghost" @click=${e=>{let t=e.target.closest(`aui-field`);t.querySelector(`aui-output`).value=crypto.randomUUID()}}>產生</aui-button>
          <aui-output placeholder="按下「產生」建立 UUID"></aui-output>
        </aui-field>
      </div>
    `},f={name:`Input → Output`,render:()=>{let e=e=>btoa(String.fromCharCode(...new TextEncoder().encode(e))),n=e=>{let t=Uint8Array.from(atob(e.trim()),e=>e.charCodeAt(0));return new TextDecoder(`utf-8`,{fatal:!0}).decode(t)},r=t=>{let r=t.target.closest(`.demo`),i=r.querySelector(`aui-input`),a=r.querySelector(`aui-segmented`).value,o=r.querySelector(`aui-output`);if(!i.value)o.value=``;else try{o.value=a===`encode`?e(i.value):n(i.value),o.status=`success`}catch{o.value=`無效的 Base64 輸入`,o.status=`error`}};return t`
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
    `}},p=[`Default`,`Layouts`,`CustomActions`,`InputToOutput`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <div style="max-width: 480px;">
      <aui-field
        label=\${args.label}
        description=\${args.description}
        ?copyable=\${args.copyable}
        ?clearable=\${args.clearable}
      >
        <aui-input value=\${args.value} ?multiline=\${args.multiline}></aui-input>
      </aui-field>
    </div>
  \`
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 480px;">
      <aui-field label="只有標題">
        <aui-input placeholder="Type here"></aui-input>
      </aui-field>
      <aui-field label="Access token" description="可於帳號設定頁面取得" copyable clearable>
        <aui-input value="tok_9f8e7d6c5b4a"></aui-input>
      </aui-field>
      <aui-field label="Request body" description="僅接受 JSON" copyable>
        <aui-input multiline rows="4" value=\${'{\\n  "ok": true\\n}'}></aui-input>
      </aui-field>
      <aui-field label="唯讀結果" copyable clearable>
        <aui-input value="readonly 時清除鈕自動停用" readonly></aui-input>
      </aui-field>
    </div>
  \`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Custom actions',
  render: () => {
    const generate = (event: Event) => {
      const field = (event.target as HTMLElement).closest('aui-field')!;
      field.querySelector('aui-output')!.value = crypto.randomUUID();
    };
    return html\`
      <div style="max-width: 480px;">
        <aui-field label="UUID" copyable>
          <aui-button slot="actions" size="sm" variant="ghost" @click=\${generate}>產生</aui-button>
          <aui-output placeholder="按下「產生」建立 UUID"></aui-output>
        </aui-field>
      </div>
    \`;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Input → Output',
  render: () => {
    /** 以 UTF-8 進行 Base64 編碼 */
    const encode = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
    /** 解碼失敗時顯示錯誤狀態 */
    const decode = (text: string) => {
      const bytes = Uint8Array.from(atob(text.trim()), char => char.charCodeAt(0));
      return new TextDecoder('utf-8', {
        fatal: true
      }).decode(bytes);
    };
    const convert = (event: Event) => {
      const root = (event.target as HTMLElement).closest('.demo')!;
      const input = root.querySelector('aui-input')!;
      const mode = root.querySelector('aui-segmented')!.value;
      const output = root.querySelector('aui-output')!;
      if (!input.value) {
        output.value = '';
        return;
      }
      try {
        output.value = mode === 'encode' ? encode(input.value) : decode(input.value);
        output.status = 'success';
      } catch {
        output.value = '無效的 Base64 輸入';
        output.status = 'error';
      }
    };
    return html\`
      <div
        class="demo"
        style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;"
        @input=\${convert}
        @change=\${convert}
      >
        <aui-field label="Mode">
          <aui-segmented
            .options=\${[{
      value: 'encode',
      label: '編碼'
    }, {
      value: 'decode',
      label: '解碼'
    }]}
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
    \`;
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as CustomActions,l as Default,f as InputToOutput,u as Layouts,p as __namedExportsOrder,c as default};