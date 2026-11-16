import{s as e,t}from"./lit-MXP2jLr5.js";import{t as n}from"./button-DhL0lY_i.js";import{t as r}from"./kbd-VWNLnwcL.js";import{t as i}from"./rolldown-runtime-Dh6celcD.js";var a,o,s,c,l;function u(){return(u=i((()=>{t(),n(),r(),a={title:`Components/Kbd`,component:`aui-kbd`,parameters:{docs:{description:{component:'\n**Anchor UI — Kbd 鍵盤鍵帽 (`<aui-kbd>`)**\n\n內嵌於介面中標註快捷鍵的鍵帽（如 `⌘K`、`Ctrl`、`Enter`），等寬字體搭配微立體邊框。純展示用，內部以原生 `<kbd>` 呈現。\n\n- 組合鍵可以每個按鍵各用一個 `<aui-kbd>`，以文字的「+」連接；空間有限時也可以合併為一個鍵帽（`⌘K`）。\n- 螢幕閱讀器不一定會讀出符號（`⌘`、`⇧`、`↵`）：內容含符號時請以 `label` 提供按鍵名稱，畫面仍顯示符號。\n- `size="sm"` 用於按鈕、選單等緊湊的位置。\n'}}},argTypes:{key:{control:`text`,description:`按鍵名稱或符號（預設 slot）`},size:{control:`inline-radio`,options:[`sm`,`md`],description:`尺寸規格`,table:{defaultValue:{summary:`md`}}},label:{control:`text`,description:`供輔助科技讀出的按鍵名稱（用於只有符號的按鍵）`}},args:{key:`⌘`,size:`md`,label:`Command`}},o={render:t=>e`<aui-kbd .size=${t.size} label=${t.label}>${t.key}</aui-kbd>`},s={render:()=>e`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <aui-kbd>K</aui-kbd>
      <aui-kbd>Ctrl</aui-kbd>
      <aui-kbd>Shift</aui-kbd>
      <aui-kbd>Enter</aui-kbd>
      <aui-kbd>Esc</aui-kbd>
      <aui-kbd label="Command">⌘</aui-kbd>
      <aui-kbd label="Option">⌥</aui-kbd>
      <aui-kbd label="Up arrow">↑</aui-kbd>
      <aui-kbd size="sm">Tab</aui-kbd>
      <aui-kbd size="sm">K</aui-kbd>
    </div>
  `},c={render:()=>e`
    <div
      style="display: grid; gap: 16px; font-size: 14px; line-height: 1.5; color: var(--color-text-primary);"
    >
      <p style="margin: 0;">
        按下 <aui-kbd>Ctrl</aui-kbd> + <aui-kbd>C</aui-kbd> 複製結果，<aui-kbd>Esc</aui-kbd>
        關閉對話框。
      </p>
      <p style="margin: 0;">
        以 <aui-kbd label="Command">⌘</aui-kbd> + <aui-kbd>K</aui-kbd> 開啟指令面板。
      </p>
      <div>
        <aui-button variant="ghost">
          搜尋工具
          <aui-kbd slot="suffix" size="sm" label="Command K">⌘K</aui-kbd>
        </aui-button>
      </div>
    </div>
  `},l=[`Default`,`Keys`,`InContext`]})))()}u();export{o as Default,c as InContext,s as Keys,l as __namedExportsOrder,a as default};