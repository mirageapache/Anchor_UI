import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{c as t,h as n,i as r,n as i,o as a,s as o,t as s}from"./lit-DvaG8Cmk.js";import{a as ee,c,i as l,n as te,r as u,s as d}from"./iframe-DzIxYD8n.js";import{c as f,g as p,l as m,o as h,s as g,t as _,u as v,v as y}from"./decorate-B5jhCMz7.js";import{a as ne,i as re,o as ie}from"./play-utils-DUto8Om5.js";import{t as b}from"./button-DdPjZonN.js";import{r as x,t as S}from"./style-map-BZ8c4eCi.js";var C,w;function T(){return(T=e((()=>{t(),f(),l(),C=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},w=h(class extends g{constructor(e){if(super(e),e.type!==m.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=te(e),{values:o,keys:s}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=s,o;let l=this.ut??=[],f=[],p,m,h=0,g=i.length-1,_=0,v=o.length-1;for(;h<=g&&_<=v;)if(i[h]===null)h++;else if(i[g]===null)g--;else if(l[h]===s[_])f[_]=d(i[h],o[_]),h++,_++;else if(l[g]===s[v])f[v]=d(i[g],o[v]),g--,v--;else if(l[h]===s[v])f[v]=d(i[h],o[v]),c(e,f[v+1],i[h]),h++,v--;else if(l[g]===s[_])f[_]=d(i[g],o[_]),c(e,i[h],i[g]),g--,_++;else if(p===void 0&&(p=C(s,_,v),m=C(l,h,g)),p.has(l[h])){if(p.has(l[g])){let t=m.get(s[_]),n=t===void 0?null:i[t];if(n===null){let t=c(e,i[h]);d(t,o[_]),f[_]=t}else f[_]=d(n,o[_]),c(e,i[h],n),i[t]=null;_++}else u(i[g]),g--}else u(i[h]),h++;for(;_<=v;){let t=c(e,f[v+1]);d(t,o[_]),f[_++]=t}for(;h<=g;){let e=i[h++];e!==null&&u(e)}return this.ut=s,ee(e,f),a}})})))()}function E(){return(E=e((()=>{T()})))()}function ae(e){if(!e)return[];let t=e.split(/\r\n|\r|\n/);return t.length>1&&t[t.length-1]===``&&t.pop(),t}function oe(e){let t=0;for(let n of e)if(n===` `)t++;else if(n===`	`)t+=4-t%4;else return t;return-1}function D(e){let t=new Map,n=[],r=-1,i=e=>{for(;n.length&&n[n.length-1].indent>=e;){let{line:e}=n.pop();r>e&&t.set(e,r)}};return e.forEach((e,t)=>{let a=oe(e);a<0||(i(a),n.push({indent:a,line:t}),r=t)}),i(-1),new Map([...t].sort(([e],[t])=>e-t))}function O(e){return e>65535||A.some(([t,n])=>e>=t&&e<=n)?2:1}function k(e){let t=0;for(let n of e){let e=n.length;if(/[^\x20-\x7e]/.test(n)){e=0;for(let t of n)e+=t===`	`?4-e%4:O(t.codePointAt(0))}e>t&&(t=e)}return t}var A;function j(){return(j=e((()=>{A=[[4352,4447],[8960,9215],[9728,10175],[11008,11263],[11904,42191],[44032,55203],[63744,64255],[65072,65103],[65280,65376],[65504,65510]]})))()}var M;function N(){return(N=e((()=>{s(),j(),M=n`
  /*
   * min-width: 0：作為 flex / grid 項目時，最小寬度預設為內容寬度，最長的一行會把元件撐出容器、
   * 水平捲動失效；歸零後由內部的捲動容器處理過寬的內容
   */
  :host {
    display: block;
    min-width: 0;
  }

  /* ─── 捲動容器 ─── */
  .code-view {
    box-sizing: border-box;
    margin: 0;
    padding: var(--space-sm, 8px) 0;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    tab-size: ${4}; /* 與摺疊、寬度估算使用同一個值 */
    background: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    overflow: auto;
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .code-view:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /*
   * 內容寬度：行號列 + 最長一行（以 ch 估算，略為高估）。各分段的繪製範圍（paint containment）
   * 以此寬度為界，不設定時畫面外的分段寬度為 0，超出的長行會被裁切、水平捲動範圍也會跳動。
   * 64px = 行號列的左右內距 16px + 間距 4px + 摺疊鈕 14px，加上摺疊後「⋯」與誤差的餘裕；
   * 14px 為程式碼文字的右內距
   */
  .code-view__content {
    min-width: calc(
      var(--aui-code-view-digits) * 1ch + 0.5ch + 64px + var(--aui-code-view-columns) * 1ch + 14px
    );
  }

  /* ─── 分段：瀏覽器略過畫面外分段的排版與繪製，估計高度為行數 × 行高 ─── */
  .code-view__chunk {
    content-visibility: auto;
    contain-intrinsic-block-size: auto calc(var(--aui-code-view-lines) * 1lh);
  }

  /* ─── 每一行 ─── */
  .code-view__line {
    display: flex;
    align-items: flex-start;
  }

  /* 行號列：水平捲動時黏在左側 */
  .code-view__gutter {
    position: sticky;
    left: 0;
    z-index: 1;
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: var(--space-xs, 4px);
    padding: 0 10px 0 6px;
    background: var(--color-surface, #f1f5f9);
    user-select: none;
    transition: background-color var(--transition-theme, 200ms ease);
  }

  /* 行號使用 text-secondary：設計稿的 text-muted 在 surface 底上未達 WCAG AA（淺色 4.3:1、深色 3.1:1） */
  .code-view__number {
    display: inline-block;
    min-width: max(2.5ch, calc(var(--aui-code-view-digits) * 1ch));
    color: var(--color-text-secondary, #475569);
    text-align: right;
  }

  .code-view__fold,
  .code-view__fold-spacer {
    flex: none;
    width: 14px;
    height: 14px;
  }

  .code-view__fold {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: var(--color-text-secondary, #475569);
    background: none;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .code-view__fold:hover {
    color: var(--color-text-primary, #0f172a);
  }

  .code-view__fold:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 0;
  }

  .code-view__fold svg {
    width: 12px;
    height: 12px;
    transform: rotate(90deg); /* 展開時朝下 */
    transition: transform var(--transition-base, 150ms ease);
  }

  .code-view__fold[aria-expanded='false'] svg {
    transform: none; /* 摺疊時朝右 */
  }

  .code-view__code {
    padding-right: 14px;
    white-space: pre;
  }

  /* 摺疊後的「⋯」：提示仍有隱藏內容 */
  .code-view__placeholder {
    flex: none;
    margin-left: -10px;
    padding: 0 6px;
    color: var(--color-text-secondary, #475569);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
    line-height: 1.2;
    user-select: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .code-view,
    .code-view__gutter,
    .code-view__fold svg {
      transition: none;
    }
  }
`})))()}var P,F,I;function L(){return(L=e((()=>{s(),v(),E(),S(),N(),j(),P=200,F=o`
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M6 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`,I=class extends i{constructor(...e){super(...e),this.code=``,this.label=`程式碼`,this.collapsed=new Set,this.activeFold=-1,this.lines=[],this.foldRanges=new Map,this.columns=0,this.refocusFold=!1,this.handleClick=e=>{let t=e.target.closest?.(`.code-view__fold`);t&&this.toggleFold(Number(t.dataset.line))},this.handleKeydown=e=>{let t=e.target.closest?.(`.code-view__fold`);if(!t)return;let n=[...this.renderRoot.querySelectorAll(`.code-view__fold`)],r=n.indexOf(t),i=n[{ArrowDown:r+1,ArrowUp:r-1,Home:0,End:n.length-1}[e.key]??-1];i&&(e.preventDefault(),this.activeFold=Number(i.dataset.line),i.focus())}}static{this.styles=M}foldAll(){this.setCollapsed(new Set(this.foldRanges.keys()))}unfoldAll(){this.setCollapsed(new Set)}setCollapsed(e){this.refocusFold=!!this.shadowRoot?.activeElement?.matches(`.code-view__fold`),this.collapsed=e}updated(){this.refocusFold&&(this.refocusFold=!1,this.renderRoot.querySelector(`.code-view__fold[tabindex="0"]`)?.focus())}willUpdate(e){e.has(`code`)&&(this.lines=ae(String(this.code??``)),this.foldRanges=D(this.lines),this.columns=k(this.lines),this.collapsed=new Set,this.activeFold=this.foldRanges.keys().next().value??-1)}visibleLines(){let e=[];for(let t=0;t<this.lines.length;t++)e.push(t),this.collapsed.has(t)&&(t=this.foldRanges.get(t));return e}toggleFold(e){let t=new Set(this.collapsed);t.delete(e)||t.add(e),this.collapsed=t,this.activeFold=e}renderLine(e,t){let n=this.foldRanges.get(e),i=this.collapsed.has(e),a=n===void 0?o`<span class="code-view__fold-spacer"></span>`:o`<button
            class="code-view__fold"
            part="fold-button"
            type="button"
            data-line=${e}
            tabindex=${e===t?0:-1}
            aria-expanded=${String(!i)}
            aria-label=${`第 ${e+1}–${n+1} 行`}
          >
            ${F}
          </button>`;return o`<div class="code-view__line" part="line">
      <span class="code-view__gutter" part="gutter"
        ><span class="code-view__number" part="line-number" aria-hidden="true">${e+1}</span
        >${a}</span
      ><span class="code-view__code" part="code">${this.lines[e]}</span>${i?o`<span class="code-view__placeholder" part="fold-placeholder" aria-hidden="true"
              >⋯</span
            >`:r}
    </div>`}render(){let e=this.visibleLines(),t=e.includes(this.activeFold)&&this.foldRanges.has(this.activeFold)?this.activeFold:e.find(e=>this.foldRanges.has(e))??-1,n=[];for(let t of e){let e=Math.floor(t/P);n.at(-1)?.index!==e&&n.push({index:e,lines:[]}),n.at(-1).lines.push(t)}let r=Math.max(2,String(this.lines.length).length),i=x({"--aui-code-view-digits":String(r),"--aui-code-view-columns":String(this.columns)});return o`
      <div
        class="code-view"
        part="base"
        role="region"
        aria-label=${this.label}
        tabindex="0"
        @keydown=${this.handleKeydown}
        @click=${this.handleClick}
      >
        <div class="code-view__content" style=${i}>
          ${w(n,e=>e.index,e=>o`
                <div
                  class="code-view__chunk"
                  style=${x({"--aui-code-view-lines":String(e.lines.length)})}
                >
                  ${e.lines.map(e=>this.renderLine(e,t))}
                </div>
              `)}
        </div>
      </div>
    `}},_([y({type:String})],I.prototype,`code`,void 0),_([y({type:String})],I.prototype,`label`,void 0),_([p()],I.prototype,`collapsed`,void 0),_([p()],I.prototype,`activeFold`,void 0),customElements.get(`aui-code-view`)||customElements.define(`aui-code-view`,I)})))()}function R(){return(R=e((()=>{L()})))()}var z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{s(),R(),b(),ne(),{expect:z,userEvent:B,waitFor:V}=__STORYBOOK_MODULE_TEST__,H=JSON.stringify({name:`@anchor-ui/core`,version:`1.0.0`,exports:{".":{types:`./dist/index.d.ts`,import:`./dist/index.js`},"./button":{types:`./dist/components/button/index.d.ts`,import:`./dist/components/button/index.js`}},dependencies:{lit:`^3.3.0`,"@floating-ui/dom":`^1.7.0`},keywords:[`web-components`,`lit`,`design-system`]},null,2),U=`name: CI
on:
  pull_request:
    branches: [main, develop]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lint
  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test`,W=()=>JSON.stringify(Array.from({length:1700},(e,t)=>({id:t,name:`item-${t}`,tags:[`a`,`b`]})),null,2),G={title:`Components/Code View`,component:`aui-code-view`,parameters:{docs:{description:{component:"\n**Anchor UI — Code View IDE 風格程式碼檢視區 (`<aui-code-view>`)**\n\n等寬純文字的程式碼檢視區，用於展示轉換結果（JSON、程式碼、格式化文字）。\n左側行號列為 sticky，水平捲動時不位移；依縮排自動判斷可摺疊的區塊（與 VS Code 預設相同），`foldAll()` / `unfoldAll()` 可一次摺疊或展開。\n所有行都在 DOM 中（頁內搜尋與跨行選取皆可用），每 200 行一段並以 `content-visibility: auto` 略過畫面外的排版與繪製。\n預設隨內容增高；以 `::part(base)` 設定 `max-height` 即可在檢視區內捲動。\n        "}}},argTypes:{code:{control:`text`,description:`程式碼（純文字）`},label:{control:`text`,description:`無障礙名稱`,table:{defaultValue:{summary:`程式碼`}}},maxHeight:{control:`text`,description:"`::part(base)` 的 max-height（示範用）"}},args:{code:H,label:`程式碼`,maxHeight:``}},K={render:e=>o`
    <style>
      .story-code-view::part(base) {
        max-height: ${e.maxHeight||`none`};
      }
    </style>
    <aui-code-view class="story-code-view" .code=${e.code} label=${e.label}></aui-code-view>
  `},q={name:`Indentation folding (YAML)`,args:{code:U},render:e=>o`<aui-code-view .code=${e.code}></aui-code-view>`},J={name:`Horizontal scroll (sticky line numbers)`,render:()=>o`
    <div style="max-width: 360px;">
      <aui-code-view
        .code=${`const message = '${`水平捲動時，左側行號列保持不動。`.repeat(6)}';\nconsole.log(message);`}
      ></aui-code-view>
    </div>
  `},Y=e=>e.currentTarget.closest(`.story`).querySelector(`aui-code-view`),X={name:`10,000+ lines`,render:()=>o`
    <style>
      .story-big::part(base) {
        max-height: 420px;
      }
    </style>
    <div class="story">
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <aui-button size="sm" variant="ghost" @click=${e=>Y(e).foldAll()}
          >全部摺疊</aui-button
        >
        <aui-button size="sm" variant="ghost" @click=${e=>Y(e).unfoldAll()}
          >全部展開</aui-button
        >
      </div>
      <aui-code-view class="story-big" .code=${W()}></aui-code-view>
    </div>
  `},Z={name:`Fold interaction`,render:()=>o`<aui-code-view .code=${H}></aui-code-view>`,play:async({canvasElement:e,step:t})=>{let n=ie(e,`aui-code-view`),r=()=>n.shadowRoot.querySelectorAll(`[part="line"]`).length,i=H.split(`
`).length,a=()=>re(n,`[part="fold-button"][data-line="3"]`);await t(`點擊摺疊鈕收合 exports 區塊`,async()=>{await z(r()).toBe(i),await B.click(a()),await V(()=>z(a().getAttribute(`aria-expanded`)).toBe(`false`)),await z(r()).toBeLessThan(i),await z(n.shadowRoot.querySelector(`[part="fold-placeholder"]`)).toBeTruthy()}),await t(`鍵盤：Enter 展開`,async()=>{a().focus(),await B.keyboard(`{Enter}`),await V(()=>z(r()).toBe(i))})}},Q=[`Default`,`IndentationFolding`,`NarrowWithLongLines`,`TenThousandLines`,`FoldInteraction`],K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <style>
      .story-code-view::part(base) {
        max-height: \${args.maxHeight || 'none'};
      }
    </style>
    <aui-code-view class="story-code-view" .code=\${args.code} label=\${args.label}></aui-code-view>
  \`
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  name: 'Indentation folding (YAML)',
  args: {
    code: YAML
  },
  render: args => html\`<aui-code-view .code=\${args.code}></aui-code-view>\`
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  name: 'Horizontal scroll (sticky line numbers)',
  render: () => html\`
    <div style="max-width: 360px;">
      <aui-code-view
        .code=\${\`const message = '\${'水平捲動時，左側行號列保持不動。'.repeat(6)}';\\nconsole.log(message);\`}
      ></aui-code-view>
    </div>
  \`
}`,...J.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  name: '10,000+ lines',
  render: () => html\`
    <style>
      .story-big::part(base) {
        max-height: 420px;
      }
    </style>
    <div class="story">
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <aui-button size="sm" variant="ghost" @click=\${(e: Event) => nearestView(e).foldAll()}
          >全部摺疊</aui-button
        >
        <aui-button size="sm" variant="ghost" @click=\${(e: Event) => nearestView(e).unfoldAll()}
          >全部展開</aui-button
        >
      </div>
      <aui-code-view class="story-big" .code=\${bigJson()}></aui-code-view>
    </div>
  \`
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  name: 'Fold interaction',
  render: () => html\`<aui-code-view .code=\${SAMPLE}></aui-code-view>\`,
  play: async ({
    canvasElement,
    step
  }) => {
    const view = query<AuiCodeView>(canvasElement, 'aui-code-view');
    const lineCount = () => view.shadowRoot!.querySelectorAll('[part="line"]').length;
    const total = SAMPLE.split('\\n').length;
    const exportsButton = () => inShadow<HTMLButtonElement>(view, '[part="fold-button"][data-line="3"]');
    await step('點擊摺疊鈕收合 exports 區塊', async () => {
      await expect(lineCount()).toBe(total);
      await userEvent.click(exportsButton());
      await waitFor(() => expect(exportsButton().getAttribute('aria-expanded')).toBe('false'));
      await expect(lineCount()).toBeLessThan(total);
      await expect(view.shadowRoot!.querySelector('[part="fold-placeholder"]')).toBeTruthy();
    });
    await step('鍵盤：Enter 展開', async () => {
      exportsButton().focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(lineCount()).toBe(total));
    });
  }
}`,...Z.parameters?.docs?.source}}}})))()}$();export{K as Default,Z as FoldInteraction,q as IndentationFolding,J as NarrowWithLongLines,X as TenThousandLines,Q as __namedExportsOrder,G as default};