import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{i as o,r as s,t as c,u as l,v as u}from"./decorate-B5jhCMz7.js";import{r as d,t as f}from"./if-defined-BTZAmkBp.js";import{n as p,t as m}from"./safe-href-Y2YYGJ9Z.js";import{n as h,r as g,t as _}from"./heading-CK0tPUd9.js";import{n as v,r as y,t as b}from"./slot-BP5G2qTd.js";var x;function S(){return(S=e((()=>{a(),x=t`
  /*
   * host 作為 container query 的容器：響應式斷點依 Footer 自身寬度判斷。
   * inline-size containment 讓 host 的內容寬度視為 0，因此明確撐滿容器寬度；
   * margin-top: auto 讓它在 flex 直向排列的頁面容器中被推到底部
   */
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin-top: auto;
    container: aui-footer / inline-size;
  }

  [hidden] {
    display: none !important;
  }

  /*
   * 文字使用 text-secondary：設計稿的 text-muted 在 surface 底上對比約 4.4:1，未達 WCAG AA
   */
  .footer {
    box-sizing: border-box;
    padding-block: var(--space-md, 16px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    background: var(--color-surface, #f1f5f9);
    border-top: 1px solid var(--color-border, #e2e8f0);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .footer--columns {
    padding-block: var(--space-xl, 40px) var(--space-md, 16px);
  }

  .footer__inner {
    max-width: var(--layout-max-width, 1600px);
    margin-inline: auto;
    padding-inline: var(--layout-gutter, 24px);
  }

  /* ─── 多欄導覽 ─── */
  .footer__columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-lg, 24px);
    margin-bottom: var(--space-lg, 24px);
  }

  .footer__column-heading {
    margin: 0 0 var(--space-sm, 8px);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
  }

  .footer__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs, 4px);
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--text-sm, 0.875rem);
  }

  /* ─── 版權列 ─── */
  .footer__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px) var(--space-md, 16px);
  }

  .footer--columns .footer__bottom {
    padding-top: var(--space-md, 16px);
    border-top: 1px solid var(--color-border, #e2e8f0);
  }

  .footer__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
    margin-right: auto;
  }

  .footer__copyright {
    margin: 0;
  }

  .footer__version {
    padding: 1px 6px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #475569);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
  }

  .footer__links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-md, 16px);
  }

  .footer__social {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
  }

  /* ─── 連結：多欄內為元件渲染的 <a>，次要選單與社群連結為 slot 的直接子元素 ─── */
  .footer__list a,
  ::slotted(a) {
    color: var(--color-text-secondary, #475569);
    text-decoration: none;
    border-radius: var(--radius-sm, 6px);
    transition: color var(--transition-base, 150ms ease);
  }

  .footer__list a:hover,
  ::slotted(a:hover) {
    color: var(--color-brand-text, #0f4c81);
    text-decoration: underline;
  }

  .footer__list a:focus-visible,
  ::slotted(a:focus-visible) {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .footer__social ::slotted(a) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    min-height: 32px;
  }

  /* ─── 螢幕閱讀器專用文字（外部連結提示） ─── */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ─── 窄版：版權列直向堆疊 ─── */
  @container aui-footer (width < 640px) {
    .footer__inner {
      padding-inline: var(--space-md, 16px);
    }

    .footer__bottom {
      flex-direction: column;
      align-items: flex-start;
    }

    .footer__meta {
      margin-right: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .footer,
    .footer__list a,
    ::slotted(a) {
      transition: none;
    }
  }
`})))()}var C,w;function T(){return(T=e((()=>{a(),l(),s(),f(),_(),m(),y(),S(),C=e=>typeof e==`object`&&!!e,w=class extends r{static{this.styles=x}constructor(){super(),this.columns=[],this.copyrightHolder=``,this.version=``,this.headingLevel=2,this.columnsLabel=`網站導覽`,this.linksLabel=`頁尾連結`,this.externalLabel=`（另開新視窗）`,new b(this)}copyrightText(){if(!this.copyrightHolder)return``;let e=new Date().getFullYear(),t=this.copyrightSince;return`© ${t!==void 0&&Number.isInteger(t)&&t>0&&t<e?`${t}–${e}`:e} ${this.copyrightHolder}`}renderLink(e){let t=d(p(e.href));return e.external?i`<a href=${t} target="_blank" rel="noopener noreferrer"
          >${e.label}<span class="sr-only">${this.externalLabel}</span></a
        >`:i`<a href=${t}>${e.label}</a>`}get columnList(){return Array.isArray(this.columns)?this.columns.filter(C).map(e=>({...e,links:Array.isArray(e.links)?e.links.filter(C):[]})):[]}renderColumns(e){if(!e.length)return n;let t=h(this.headingLevel,2);return i`
      <nav class="footer__columns" part="columns" aria-label=${this.columnsLabel}>
        ${e.map((e,r)=>i`
            <div class="footer__column" part="column">
              ${e.heading?g(t,{className:`footer__column-heading`,part:`column-heading`,id:`column-${r}`},e.heading):n}
              <ul
                class="footer__list"
                aria-labelledby=${d(e.heading?`column-${r}`:void 0)}
              >
                ${e.links.map(e=>i`<li>${this.renderLink(e)}</li>`)}
              </ul>
            </div>
          `)}
      </nav>
    `}render(){let e=this.columnList,t=e.length>0,r=v(this,`copyright`),a=this.copyrightText(),s=v(this,`links`),c=v(this,`social`),l=(this.version??``).trim();return i`
      <footer class=${o({footer:!0,"footer--columns":t})} part="base">
        <div class="footer__inner">
          ${this.renderColumns(e)}
          <div class="footer__bottom" part="bottom">
            <div class="footer__meta">
              <!-- 使用 <div>：copyright slot 可放入段落，用 <p> 會形成巢狀段落 -->
              <div
                class="footer__copyright"
                part="copyright"
                ?hidden=${!r&&!a}
              >
                <slot name="copyright">${a}</slot>
              </div>
              ${l?i`<span class="footer__version" part="version"
                      >${/^v\d/i.test(l)?l:`v${l}`}</span
                    >`:n}
            </div>
            <nav
              class="footer__links"
              part="links"
              aria-label=${this.linksLabel}
              ?hidden=${!s}
            >
              <slot name="links"></slot>
            </nav>
            <div class="footer__social" part="social" ?hidden=${!c}>
              <slot name="social"></slot>
            </div>
          </div>
        </div>
      </footer>
    `}},c([u({attribute:!1})],w.prototype,`columns`,void 0),c([u({type:String,attribute:`copyright-holder`})],w.prototype,`copyrightHolder`,void 0),c([u({type:Number,attribute:`copyright-since`})],w.prototype,`copyrightSince`,void 0),c([u({type:String})],w.prototype,`version`,void 0),c([u({type:Number,attribute:`heading-level`})],w.prototype,`headingLevel`,void 0),c([u({type:String,attribute:`columns-label`})],w.prototype,`columnsLabel`,void 0),c([u({type:String,attribute:`links-label`})],w.prototype,`linksLabel`,void 0),c([u({type:String,attribute:`external-label`})],w.prototype,`externalLabel`,void 0),customElements.get(`aui-footer`)||customElements.define(`aui-footer`,w)})))()}function E(){return(E=e((()=>{T()})))()}var D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{a(),E(),D=[{heading:`產品`,links:[{label:`元件`,href:`#`},{label:`設計 Token`,href:`#`},{label:`更新紀錄`,href:`#`}]},{heading:`資源`,links:[{label:`快速開始`,href:`#`},{label:`Storybook`,href:`#`},{label:`GitHub`,href:`https://github.com/mirageapache/Anchor_UI`,external:!0}]},{heading:`支援`,links:[{label:`問題回報`,href:`https://github.com/mirageapache/Anchor_UI/issues`,external:!0},{label:`升級指南`,href:`#`}]}],O=i`
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path
      d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"
    ></path>
  </svg>
`,k={title:`Components/Footer`,component:`aui-footer`,parameters:{layout:`fullscreen`,docs:{description:{component:"\n**Anchor UI — Footer 通用頁尾 (`<aui-footer>`)**\n\n版權宣告、專案版本、次要選單（`links` slot）與社群連結（`social` slot）。\n沒有 `columns` 時為簡潔單列（Minimal）；以 property 設定 `columns`（`[{ heading, links: [{ label, href, external? }] }]`）時上方加上多欄導覽（Columns）。\n設定 `copyright-holder` 即顯示「© 今年 名稱」，`copyright-since` 早於今年時顯示為範圍；要自訂整段文字時使用 `copyright` slot。\n響應式斷點以 Footer 自身寬度判斷：小於 640px 時版權列改為直向堆疊。\n        "}}},argTypes:{copyrightHolder:{control:`text`,description:`版權所有者`},copyrightSince:{control:`number`,description:`版權起始年份`},version:{control:`text`,description:`專案版本`},withColumns:{control:`boolean`,description:`是否設定 columns（多欄版型）`}},args:{copyrightHolder:`Anchor UI`,copyrightSince:2024,version:`1.0.0`,withColumns:!0}},A=e=>i`
  <aui-footer
    copyright-holder=${e.copyrightHolder}
    copyright-since=${e.copyrightSince}
    version=${e.version}
    .columns=${e.withColumns?D:[]}
  >
    <a slot="links" href="#">隱私權政策</a>
    <a slot="links" href="#">使用條款</a>
    <a slot="social" href="https://github.com/mirageapache/Anchor_UI" aria-label="GitHub">
      ${O}
    </a>
  </aui-footer>
`,j={render:e=>A(e)},M={args:{withColumns:!1},render:e=>A(e)},N={name:`Page bottom (flex layout)`,args:{withColumns:!1},render:e=>i`
    <div style="display: flex; flex-direction: column; min-height: 100vh;">
      <main style="padding: 24px;">
        <p style="margin: 0;">內容較少時，Footer 以 margin-top: auto 被推到頁面底部。</p>
      </main>
      ${A(e)}
    </div>
  `},P=[`Columns`,`Minimal`,`StickyPageBottom`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => footer(args)
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    withColumns: false
  },
  render: args => footer(args)
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Page bottom (flex layout)',
  args: {
    withColumns: false
  },
  render: args => html\`
    <div style="display: flex; flex-direction: column; min-height: 100vh;">
      <main style="padding: 24px;">
        <p style="margin: 0;">內容較少時，Footer 以 margin-top: auto 被推到頁面底部。</p>
      </main>
      \${footer(args)}
    </div>
  \`
}`,...N.parameters?.docs?.source}}}})))()}F();export{j as Columns,M as Minimal,N as StickyPageBottom,P as __namedExportsOrder,k as default};