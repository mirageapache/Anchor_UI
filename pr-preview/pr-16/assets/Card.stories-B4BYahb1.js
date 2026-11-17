import{i as e,s as t,t as n}from"./lit-MXP2jLr5.js";import{a as r,i,o as a}from"./play-utils-Cj5Kn2Rl.js";import{t as o}from"./card-CqwTK94R.js";import{t as s}from"./tag-DIJX3Qfm.js";import{t as c}from"./rolldown-runtime-Dh6celcD.js";var l,u,d,f,p,m,h,g,_;function v(){return(v=c((()=>{n(),o(),s(),r(),{expect:l}=__STORYBOOK_MODULE_TEST__,u={title:`Components/Card`,component:`aui-card`,parameters:{docs:{description:{component:"\n**Anchor UI — Card 工具卡片 (`<aui-card>`)**\n\n用於首頁或分類導覽的工具卡片，展示名稱、簡介（預設裁切為兩行）與標籤群。\n設定 `href` 時整張卡片是一個連結，具備 Hover 微浮凸與外框高亮；`hot` 以琥珀色外框與文字徽標標示推薦項目。\n\n多張卡片請放進 `.card-grid` 容器（由 `@anchor-ui/core/styles.css` 提供），會依**容器寬度**自動調整欄數，不需 Media Query。\n"}}},argTypes:{heading:{control:`text`,description:`卡片名稱（或使用 heading slot）`},description:{control:`text`,description:`簡介描述（或使用預設 slot）`},href:{control:`text`,description:`連結網址；設定後整張卡片成為連結`},hot:{control:`boolean`,description:`HOT 推薦項目（琥珀色外框與徽標）`,table:{defaultValue:{summary:`false`}}},hotLabel:{control:`text`,description:`HOT 徽標文字`,table:{defaultValue:{summary:`HOT`}}},headingLevel:{control:`inline-radio`,options:[1,2,3,4,5,6],description:`卡片名稱的標題層級`,table:{defaultValue:{summary:`3`}}},lines:{control:{type:`number`,min:0,max:6},description:`簡介最多顯示的行數，0 表示不裁切`,table:{defaultValue:{summary:`2`}}}},args:{heading:`JSON Formatter`,description:`Format, validate and minify JSON documents with syntax highlighting, tree view and error location hints.`,href:`#json`,hot:!1,hotLabel:`HOT`,headingLevel:3,lines:2}},d={render:n=>t`
    <div style="max-width: 320px;">
      <aui-card
        heading=${n.heading}
        description=${n.description}
        href=${n.href||e}
        ?hot=${n.hot}
        hot-label=${n.hotLabel}
        .headingLevel=${n.headingLevel}
        .lines=${n.lines}
      >
        <aui-tag slot="tags" variant="brand">json</aui-tag>
        <aui-tag slot="tags">format</aui-tag>
      </aui-card>
    </div>
  `},f=[{name:`JSON Formatter`,desc:`Format, validate and minify JSON documents with syntax highlighting and error location hints.`,tags:[[`brand`,`json`],[`neutral`,`format`]],hot:!0},{name:`UUID Generator`,desc:`Generate v4 / v7 UUIDs in bulk.`,tags:[[`purple`,`uuid`]],hot:!1},{name:`Base64`,desc:`Encode and decode Base64 text and files.`,tags:[[`success`,`encode`]],hot:!1},{name:`JWT Decoder`,desc:`Inspect the header, payload and signature of a JSON Web Token without sending it anywhere.`,tags:[[`info`,`jwt`],[`neutral`,`security`]],hot:!0},{name:`Regex Tester`,desc:`Test regular expressions with live match highlighting.`,tags:[[`warning`,`regex`]],hot:!1},{name:`Hash Calculator`,desc:`MD5, SHA-1, SHA-256 and SHA-512 digests computed locally with WebAssembly.`,tags:[[`purple`,`wasm`],[`neutral`,`hash`]],hot:!1}],p=()=>t`
  <ul class="card-grid">
    ${f.map(e=>t`
        <li>
          <aui-card heading=${e.name} description=${e.desc} href="#tool" ?hot=${e.hot}>
            ${e.tags.map(([e,n])=>t`<aui-tag slot="tags" .variant=${e}>${n}</aui-tag>`)}
          </aui-card>
        </li>
      `)}
  </ul>
`,m={render:()=>t`
    <div
      data-testid="resizable"
      style="resize: horizontal; overflow: auto; width: 900px; max-width: 100%; min-width: 180px; padding: 16px; border: 1px dashed var(--color-border);"
    >
      ${p()}
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=a(e,`[data-testid="resizable"]`),r=a(n,`.card-grid`),o=()=>getComputedStyle(r).gridTemplateColumns.split(` `).length;await t(`寬容器排成多欄`,async()=>{n.style.width=`900px`,await l(o()).toBeGreaterThanOrEqual(2)}),await t(`縮窄後自動減少欄數，且無橫向溢位`,async()=>{n.style.width=`360px`,await l(o()).toBe(1),await l(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth)}),await t(`簡介裁切為兩行`,async()=>{let e=i(a(r,`aui-card`),`[part="description"]`),t=parseFloat(getComputedStyle(e).lineHeight);await l(Math.round(e.clientHeight/t)).toBe(2)}),n.style.width=`900px`}},h={render:()=>t`
    <div class="card-grid" style="max-width: 640px;">
      <aui-card heading="Link card" description="設定 href：整張卡片可點擊" href="#link"></aui-card>
      <aui-card
        heading="HOT link card"
        description="hot：琥珀色外框與徽標"
        href="#hot"
        hot
      ></aui-card>
      <aui-card heading="Static card" description="未設定 href：靜態容器，無懸停回饋"></aui-card>
      <aui-card
        heading="自訂徽標文字"
        description="hot-label 可改為在地化文字"
        hot
        hot-label="熱門"
      ></aui-card>
    </div>
  `},g={render:()=>t`
    <div style="max-width: 320px;">
      <aui-card href="#slots" lines="3">
        <span slot="heading">以 <code>heading</code> slot 自訂名稱</span>
        預設 slot 放入簡介內容，可包含 <strong>行內標記</strong>。超過 <code>lines</code>
        設定的行數時以省略號裁切，避免同一列的卡片高度差異過大。
        <aui-tag slot="tags" variant="info">slot</aui-tag>
        <aui-tag slot="tags" variant="success">tags</aui-tag>
      </aui-card>
    </div>
  `},_=[`Default`,`ResponsiveGrid`,`HotAndStatic`,`Slots`]})))()}v();export{d as Default,h as HotAndStatic,m as ResponsiveGrid,g as Slots,_ as __namedExportsOrder,u as default};