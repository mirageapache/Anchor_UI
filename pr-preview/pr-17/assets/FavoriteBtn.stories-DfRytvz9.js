import{s as e,t}from"./lit-MXP2jLr5.js";import{a as n,i as r,o as i}from"./play-utils-Cj5Kn2Rl.js";import{t as a}from"./favorite-btn-t_5TzQ9_.js";import{t as o}from"./rolldown-runtime-Dh6celcD.js";var s,c,l,u,d,f,p;function m(){return(m=o((()=>{t(),a(),n(),{expect:s,userEvent:c}=__STORYBOOK_MODULE_TEST__,l={title:`Components/FavoriteBtn`,component:`aui-favorite-btn`,parameters:{docs:{description:{component:"\n**Anchor UI — Favorite Toggle Button 收藏星號按鈕 (`<aui-favorite-btn>`)**\n\n星號形狀的開關按鈕，用於把常用工具或項目加入我的最愛。\n未收藏時為灰階線條，已收藏時以實心琥珀色高亮；使用者切換時有微縮放彈跳動態（遵循減少動畫設定）。\n\n- 語意為切換按鈕（`aria-pressed`）：`label` 描述按鈕控制的對象，不隨狀態改變。\n- 使用者切換後觸發 `aui-change`（`detail.favorite`）；由程式設定 `favorite` 不會觸發。\n- 需要由外部決定是否生效時（例如 API 失敗），在事件中把 `favorite` 設回原值即可。\n"}}},argTypes:{favorite:{control:`boolean`,description:`是否已收藏`,table:{defaultValue:{summary:`false`}}},disabled:{control:`boolean`,description:`是否停用`,table:{defaultValue:{summary:`false`}}},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`],description:`尺寸規格（圖示 16 / 20 / 24px）`,table:{defaultValue:{summary:`md`}}},label:{control:`text`,description:`無障礙名稱與懸停提示；描述按鈕控制的對象，不隨狀態改變`,table:{defaultValue:{summary:`我的最愛`}}}},args:{favorite:!1,disabled:!1,size:`md`,label:`我的最愛`}},u={render:t=>e`
    <aui-favorite-btn
      ?favorite=${t.favorite}
      ?disabled=${t.disabled}
      .size=${t.size}
      label=${t.label}
      @aui-change=${e=>console.log(`aui-change`,e.detail)}
    ></aui-favorite-btn>
  `},d={render:()=>e`
    <div
      style="display: grid; grid-template-columns: repeat(3, max-content); gap: 16px 24px; align-items: center;"
    >
      <aui-favorite-btn size="sm"></aui-favorite-btn>
      <aui-favorite-btn></aui-favorite-btn>
      <aui-favorite-btn size="lg"></aui-favorite-btn>
      <aui-favorite-btn size="sm" favorite></aui-favorite-btn>
      <aui-favorite-btn favorite></aui-favorite-btn>
      <aui-favorite-btn size="lg" favorite></aui-favorite-btn>
      <aui-favorite-btn disabled></aui-favorite-btn>
      <aui-favorite-btn disabled favorite></aui-favorite-btn>
    </div>
  `},f={render:()=>e`
    <div style="display: flex; align-items: center; gap: 12px;">
      <aui-favorite-btn
        label="收藏 JSON Formatter"
        @aui-change=${e=>{let t=e.currentTarget.nextElementSibling;t.textContent=e.detail.favorite?`已加入我的最愛`:`尚未收藏`}}
      ></aui-favorite-btn>
      <span data-testid="status" style="font-size: 14px; color: var(--color-text-secondary);"
        >尚未收藏</span
      >
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=i(e,`aui-favorite-btn`),a=i(e,`[data-testid="status"]`),o=r(n,`button`);await t(`點擊後加入收藏`,async()=>{await c.click(o),await s(n.favorite).toBe(!0),await n.updateComplete,await s(o.getAttribute(`aria-pressed`)).toBe(`true`),await s(a.textContent).toBe(`已加入我的最愛`)}),await t(`以鍵盤再次切換`,async()=>{o.focus(),await c.keyboard(`{Enter}`),await s(n.favorite).toBe(!1),await s(a.textContent).toBe(`尚未收藏`)})}},p=[`Default`,`States`,`Toggle`]})))()}m();export{u as Default,d as States,f as Toggle,p as __namedExportsOrder,l as default};