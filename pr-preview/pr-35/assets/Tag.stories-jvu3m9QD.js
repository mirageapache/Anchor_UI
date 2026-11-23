import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{t as r}from"./tag-VGG5e3M6.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),r(),i={title:`Components/Tag`,component:`aui-tag`,parameters:{docs:{description:{component:`
**Anchor UI — Tag / Badge 標籤徽章 (\`<aui-tag>\`)**

採用 JetBrains Mono 等寬字體呈現的專業標籤，用於技術分類、版本標號、格式與狀態標記。
支援 7 種語意色彩變體、3 種尺寸階層、膠囊圓角 (pill)、可點擊互動 (interactive)、
可移除操作 (removable)，並預設貫徹「全小寫標籤規範」（全域文字轉為小寫，具備 preserve-case 跳脫選項）。
`}}},argTypes:{variant:{control:`select`,options:[`brand`,`success`,`warning`,`purple`,`danger`,`info`,`neutral`,`deep-blue`,`blue`],description:`7 種語意色彩多態變體（支援 deep-blue / blue / green / amber / red 別名）`,table:{defaultValue:{summary:`neutral`}}},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`],description:`尺寸規格（sm: 20px/11px字體, md: 24px/12px字體, lg: 28px/14px字體）`,table:{defaultValue:{summary:`sm`}}},pill:{control:`boolean`,description:`是否呈現膠囊全圓角造型`,table:{defaultValue:{summary:`false`}}},preserveCase:{control:`boolean`,description:`是否保留原始大小寫（預設依全小寫規範轉為 lowercase）`,table:{defaultValue:{summary:`false`}}},removable:{control:`boolean`,description:`是否顯示移除按鈕（觸發 aui-remove 事件）`,table:{defaultValue:{summary:`false`}}},interactive:{control:`boolean`,description:`是否啟用點擊互動（例如篩選分類標籤）`,table:{defaultValue:{summary:`false`}}},removeLabel:{control:`text`,description:`移除按鈕的無障礙 aria-label 提示文字`,table:{defaultValue:{summary:`移除標籤`}}},label:{control:`text`,description:`標籤文字內容（預設 Slot）`}},args:{label:`v1.4.0`,variant:`brand`,size:`sm`,pill:!1,preserveCase:!1,removable:!1,interactive:!1,removeLabel:`移除標籤`}},a={render:e=>t`
    <aui-tag
      .variant=${e.variant}
      .size=${e.size}
      ?pill=${e.pill}
      ?preserve-case=${e.preserveCase}
      ?removable=${e.removable}
      ?interactive=${e.interactive}
      remove-label=${e.removeLabel}
      @aui-remove=${e=>{console.log(`aui-remove emitted:`,e.detail)}}
    >
      ${e.label}
    </aui-tag>
  `},o={render:()=>t`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px; text-transform: uppercase;"
        >
          7 種核心語意色彩變體 (7 Semantic Status Colors)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <aui-tag variant="brand">brand / v0.1.0</aui-tag>
          <aui-tag variant="success">success / active</aui-tag>
          <aui-tag variant="warning">warning / deprecated</aui-tag>
          <aui-tag variant="danger">danger / fatal-err</aui-tag>
          <aui-tag variant="info">info / stable</aui-tag>
          <aui-tag variant="purple">purple / wasm-core</aui-tag>
          <aui-tag variant="neutral">neutral / draft</aui-tag>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px; text-transform: uppercase;"
        >
          色彩別名映射相容 (Aliases: deep-blue, blue, green, amber, red)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <aui-tag variant="deep-blue">deep-blue (brand)</aui-tag>
          <aui-tag variant="green">green (success)</aui-tag>
          <aui-tag variant="amber">amber (warning)</aui-tag>
          <aui-tag variant="red">red (danger)</aui-tag>
          <aui-tag variant="blue">blue (info)</aui-tag>
        </div>
      </div>
    </div>
  `},s={render:()=>t`
    <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
      <aui-tag size="sm" variant="brand">sm (20px / 11px font - 預設)</aui-tag>
      <aui-tag size="md" variant="brand">md (24px / 12px font)</aui-tag>
      <aui-tag size="lg" variant="brand">lg (28px / 14px font)</aui-tag>
    </div>
  `},c={render:()=>t`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          標準矩形圓角 (radius-sm: 6px)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand">tag:ts</aui-tag>
          <aui-tag variant="success">ready</aui-tag>
          <aui-tag variant="purple">wasm:v2</aui-tag>
          <aui-tag variant="neutral">doc</aui-tag>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          膠囊圓角 (pill: 9999px)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand" pill>tag:ts</aui-tag>
          <aui-tag variant="success" pill>ready</aui-tag>
          <aui-tag variant="purple" pill>wasm:v2</aui-tag>
          <aui-tag variant="neutral" pill>doc</aui-tag>
        </div>
      </div>
    </div>
  `},l={render:()=>t`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          預設：全小寫標籤規範（傳入大寫字串自動轉為小寫）
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand">JSON-SCHEMA</aui-tag>
          <aui-tag variant="success">HTTP 200 OK</aui-tag>
          <aui-tag variant="purple">WEBASSEMBLY</aui-tag>
          <aui-tag variant="danger">OAUTH2_ERROR</aui-tag>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          跳脫選項：preserve-case（保留原始大小寫）
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand" preserve-case>JSON-SCHEMA</aui-tag>
          <aui-tag variant="success" preserve-case>HTTP 200 OK</aui-tag>
          <aui-tag variant="purple" preserve-case>WEBASSEMBLY</aui-tag>
          <aui-tag variant="danger" preserve-case>OAUTH2_ERROR</aui-tag>
        </div>
      </div>
    </div>
  `},u={render:()=>t`
    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <!-- 狀態小圓點 (Status dot) -->
      <aui-tag variant="success">
        <span
          slot="prefix"
          style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor; display: inline-block;"
        ></span>
        live-stream
      </aui-tag>

      <aui-tag variant="warning">
        <span
          slot="prefix"
          style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor; display: inline-block;"
        ></span>
        connecting
      </aui-tag>

      <aui-tag variant="danger">
        <span
          slot="prefix"
          style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor; display: inline-block;"
        ></span>
        disconnected
      </aui-tag>

      <!-- 前綴向量圖示 (SVG Icon) -->
      <aui-tag variant="purple" size="md">
        <svg
          slot="prefix"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        wasm:accelerated
      </aui-tag>

      <!-- 後綴外連指示圖示 -->
      <aui-tag variant="brand" size="md">
        docs:api
        <svg
          slot="suffix"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </aui-tag>
    </div>
  `},d={render:()=>{let e=e=>{let t=e.target;t.style.transition=`opacity 0.2s ease, transform 0.2s ease`,t.style.opacity=`0`,t.style.transform=`scale(0.8)`,setTimeout(()=>t.remove(),200)};return t`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 12px; color: var(--color-text-muted);">
          點擊 × 按鈕會觸發 <code>aui-remove</code> 事件，並帶有平滑退出動畫：
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand" removable @aui-remove=${e}>filter:typescript</aui-tag>
          <aui-tag variant="success" removable @aui-remove=${e}>status:passed</aui-tag>
          <aui-tag variant="purple" removable @aui-remove=${e}>env:production</aui-tag>
          <aui-tag variant="warning" removable @aui-remove=${e}>level:medium</aui-tag>
          <aui-tag variant="danger" removable @aui-remove=${e}>scope:critical</aui-tag>
        </div>
      </div>
    `}},f={render:()=>{let e=e=>{let t=e.currentTarget.closest(`aui-tag`);if(t){let e=t.getAttribute(`variant`)===`brand`;t.setAttribute(`variant`,e?`neutral`:`brand`)}};return t`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 12px; color: var(--color-text-muted);">
          支援鍵盤導航 (Tab + Enter/Space) 與點擊切換，適合多選篩選器：
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag interactive variant="brand" @click=${e}>frontend</aui-tag>
          <aui-tag interactive variant="neutral" @click=${e}>backend</aui-tag>
          <aui-tag interactive variant="neutral" @click=${e}>database</aui-tag>
          <aui-tag interactive variant="neutral" @click=${e}>devops</aui-tag>
          <aui-tag interactive variant="neutral" @click=${e}>security</aui-tag>
        </div>
      </div>
    `}},p=[`Default`,`SemanticVariants`,`Sizes`,`PillShapes`,`LowercaseEnforcement`,`WithIconsAndDots`,`Removable`,`Interactive`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <aui-tag
      .variant=\${args.variant}
      .size=\${args.size}
      ?pill=\${args.pill}
      ?preserve-case=\${args.preserveCase}
      ?removable=\${args.removable}
      ?interactive=\${args.interactive}
      remove-label=\${args.removeLabel}
      @aui-remove=\${(e: CustomEvent) => {
    console.log('aui-remove emitted:', e.detail);
  }}
    >
      \${args.label}
    </aui-tag>
  \`
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px; text-transform: uppercase;"
        >
          7 種核心語意色彩變體 (7 Semantic Status Colors)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <aui-tag variant="brand">brand / v0.1.0</aui-tag>
          <aui-tag variant="success">success / active</aui-tag>
          <aui-tag variant="warning">warning / deprecated</aui-tag>
          <aui-tag variant="danger">danger / fatal-err</aui-tag>
          <aui-tag variant="info">info / stable</aui-tag>
          <aui-tag variant="purple">purple / wasm-core</aui-tag>
          <aui-tag variant="neutral">neutral / draft</aui-tag>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px; text-transform: uppercase;"
        >
          色彩別名映射相容 (Aliases: deep-blue, blue, green, amber, red)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <aui-tag variant="deep-blue">deep-blue (brand)</aui-tag>
          <aui-tag variant="green">green (success)</aui-tag>
          <aui-tag variant="amber">amber (warning)</aui-tag>
          <aui-tag variant="red">red (danger)</aui-tag>
          <aui-tag variant="blue">blue (info)</aui-tag>
        </div>
      </div>
    </div>
  \`
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
      <aui-tag size="sm" variant="brand">sm (20px / 11px font - 預設)</aui-tag>
      <aui-tag size="md" variant="brand">md (24px / 12px font)</aui-tag>
      <aui-tag size="lg" variant="brand">lg (28px / 14px font)</aui-tag>
    </div>
  \`
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          標準矩形圓角 (radius-sm: 6px)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand">tag:ts</aui-tag>
          <aui-tag variant="success">ready</aui-tag>
          <aui-tag variant="purple">wasm:v2</aui-tag>
          <aui-tag variant="neutral">doc</aui-tag>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          膠囊圓角 (pill: 9999px)
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand" pill>tag:ts</aui-tag>
          <aui-tag variant="success" pill>ready</aui-tag>
          <aui-tag variant="purple" pill>wasm:v2</aui-tag>
          <aui-tag variant="neutral" pill>doc</aui-tag>
        </div>
      </div>
    </div>
  \`
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          預設：全小寫標籤規範（傳入大寫字串自動轉為小寫）
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand">JSON-SCHEMA</aui-tag>
          <aui-tag variant="success">HTTP 200 OK</aui-tag>
          <aui-tag variant="purple">WEBASSEMBLY</aui-tag>
          <aui-tag variant="danger">OAUTH2_ERROR</aui-tag>
        </div>
      </div>

      <div>
        <div
          style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;"
        >
          跳脫選項：preserve-case（保留原始大小寫）
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand" preserve-case>JSON-SCHEMA</aui-tag>
          <aui-tag variant="success" preserve-case>HTTP 200 OK</aui-tag>
          <aui-tag variant="purple" preserve-case>WEBASSEMBLY</aui-tag>
          <aui-tag variant="danger" preserve-case>OAUTH2_ERROR</aui-tag>
        </div>
      </div>
    </div>
  \`
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <!-- 狀態小圓點 (Status dot) -->
      <aui-tag variant="success">
        <span
          slot="prefix"
          style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor; display: inline-block;"
        ></span>
        live-stream
      </aui-tag>

      <aui-tag variant="warning">
        <span
          slot="prefix"
          style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor; display: inline-block;"
        ></span>
        connecting
      </aui-tag>

      <aui-tag variant="danger">
        <span
          slot="prefix"
          style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor; display: inline-block;"
        ></span>
        disconnected
      </aui-tag>

      <!-- 前綴向量圖示 (SVG Icon) -->
      <aui-tag variant="purple" size="md">
        <svg
          slot="prefix"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        wasm:accelerated
      </aui-tag>

      <!-- 後綴外連指示圖示 -->
      <aui-tag variant="brand" size="md">
        docs:api
        <svg
          slot="suffix"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </aui-tag>
    </div>
  \`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const handleRemove = (e: CustomEvent) => {
      const target = e.target as HTMLElement;
      target.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      target.style.opacity = '0';
      target.style.transform = 'scale(0.8)';
      setTimeout(() => target.remove(), 200);
    };
    return html\`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 12px; color: var(--color-text-muted);">
          點擊 × 按鈕會觸發 <code>aui-remove</code> 事件，並帶有平滑退出動畫：
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag variant="brand" removable @aui-remove=\${handleRemove}>filter:typescript</aui-tag>
          <aui-tag variant="success" removable @aui-remove=\${handleRemove}>status:passed</aui-tag>
          <aui-tag variant="purple" removable @aui-remove=\${handleRemove}>env:production</aui-tag>
          <aui-tag variant="warning" removable @aui-remove=\${handleRemove}>level:medium</aui-tag>
          <aui-tag variant="danger" removable @aui-remove=\${handleRemove}>scope:critical</aui-tag>
        </div>
      </div>
    \`;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const handleClick = (e: MouseEvent) => {
      const tag = (e.currentTarget as HTMLElement).closest('aui-tag');
      if (tag) {
        const isSelected = tag.getAttribute('variant') === 'brand';
        tag.setAttribute('variant', isSelected ? 'neutral' : 'brand');
      }
    };
    return html\`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 12px; color: var(--color-text-muted);">
          支援鍵盤導航 (Tab + Enter/Space) 與點擊切換，適合多選篩選器：
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <aui-tag interactive variant="brand" @click=\${handleClick}>frontend</aui-tag>
          <aui-tag interactive variant="neutral" @click=\${handleClick}>backend</aui-tag>
          <aui-tag interactive variant="neutral" @click=\${handleClick}>database</aui-tag>
          <aui-tag interactive variant="neutral" @click=\${handleClick}>devops</aui-tag>
          <aui-tag interactive variant="neutral" @click=\${handleClick}>security</aui-tag>
        </div>
      </div>
    \`;
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{a as Default,f as Interactive,l as LowercaseEnforcement,c as PillShapes,d as Removable,o as SemanticVariants,s as Sizes,u as WithIconsAndDots,p as __namedExportsOrder,i as default};