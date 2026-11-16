import{s as e,t}from"./lit-MXP2jLr5.js";import{t as n}from"./button-DhL0lY_i.js";import{t as r}from"./input-Br5UZOpr.js";import{t as i}from"./rolldown-runtime-Dh6celcD.js";var a,o,s,c,l,u;function d(){return(d=i((()=>{t(),r(),n(),a={title:`Components/Input`,component:`aui-input`,parameters:{docs:{description:{component:"\n**Anchor UI — Input 等寬輸入框 (`<aui-input>`)**\n\n以 JetBrains Mono 呈現的單行／多行文字輸入框，具備 Focus 雙層光環（品牌色邊框 + 3px 淡色光暈）與錯誤狀態。\n為 form-associated custom element：可參與原生 `<form>` 提交、`required` 驗證、`form.reset()` 與 `<fieldset disabled>`，\n並於 host 分派 `input` / `change` 事件（觸發時 `value` 已更新），可直接搭配 Vue `v-model` 與 Angular `ngModel`。\n\n`label` / `description` 僅供螢幕閱讀器使用；需要畫面上的標題時請搭配 `<aui-field>`。\n        "}}},argTypes:{value:{control:`text`,description:`預設值（HTML 的 value 屬性）`},placeholder:{control:`text`,description:`佔位提示文字`},label:{control:`text`,description:`無障礙名稱（不顯示）`},description:{control:`text`,description:`無障礙描述（不顯示）`},type:{control:`select`,options:[`text`,`email`,`url`,`search`,`tel`,`password`],description:`單行輸入的原生類型`,table:{defaultValue:{summary:`text`}}},multiline:{control:`boolean`,description:`是否為多行輸入（textarea）`,table:{defaultValue:{summary:`false`}}},rows:{control:{type:`number`,min:1,max:20},description:`多行輸入的預設可見行數`,table:{defaultValue:{summary:`3`}}},disabled:{control:`boolean`,table:{defaultValue:{summary:`false`}}},readOnly:{control:`boolean`,table:{defaultValue:{summary:`false`}}},required:{control:`boolean`,table:{defaultValue:{summary:`false`}}},invalid:{control:`boolean`,description:`以錯誤狀態呈現（紅色邊框與 aria-invalid）`,table:{defaultValue:{summary:`false`}}}},args:{value:``,placeholder:`輸入或貼上文字…`,label:`輸入內容`,description:``,type:`text`,multiline:!1,rows:3,disabled:!1,readOnly:!1,required:!1,invalid:!1}},o={render:t=>e`
    <div style="max-width: 420px;">
      <aui-input
        value=${t.value}
        placeholder=${t.placeholder}
        label=${t.label}
        description=${t.description}
        .type=${t.type}
        ?multiline=${t.multiline}
        rows=${t.rows}
        ?disabled=${t.disabled}
        ?readonly=${t.readOnly}
        ?required=${t.required}
        ?invalid=${t.invalid}
      ></aui-input>
    </div>
  `},s={render:()=>e`
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;">
      <aui-input label="空值" placeholder="Placeholder 佔位提示"></aui-input>
      <aui-input label="已填寫" value="sk-live-4f9a2c7e"></aui-input>
      <aui-input label="錯誤" value="not-an-email" invalid></aui-input>
      <aui-input label="唯讀" value="唯讀內容可選取與複製" readonly></aui-input>
      <aui-input label="停用" value="停用中" disabled></aui-input>
    </div>
  `},c={render:()=>e`
    <div style="max-width: 420px;">
      <aui-input
        label="JSON"
        multiline
        rows="6"
        value=${`{
  "name": "anchor-ui",
  "version": "0.1.0-alpha"
}`}
      ></aui-input>
    </div>
  `},l={name:`Form participation`,render:()=>e`
      <form
        style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;"
        @submit=${e=>{e.preventDefault();let t=e.target,n=t.querySelector(`output`);n.textContent=JSON.stringify(Object.fromEntries(new FormData(t)),null,2)}}
      >
        <aui-input
          name="email"
          type="email"
          label="Email"
          placeholder="必填：name@example.com"
          required
        ></aui-input>
        <aui-input name="note" label="備註" value="預設值，reset 後還原" multiline></aui-input>
        <div style="display: flex; gap: 8px;">
          <aui-button type="submit">提交</aui-button>
          <aui-button type="reset" variant="ghost">重設</aui-button>
        </div>
        <output style="font-family: var(--font-mono); font-size: 12px; white-space: pre;"></output>
      </form>
    `},u=[`Default`,`States`,`Multiline`,`FormParticipation`]})))()}d();export{o as Default,l as FormParticipation,c as Multiline,s as States,u as __namedExportsOrder,a as default};