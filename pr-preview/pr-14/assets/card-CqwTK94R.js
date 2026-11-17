import{c as e,h as t,i as n,n as r,o as i,s as a,t as o}from"./lit-MXP2jLr5.js";import{c as s,i as c,l,m as u,o as d,r as f,s as p,t as m,u as h}from"./decorate-BSUctFxX.js";import{r as g,t as _}from"./if-defined-BrPPiKvf.js";import{n as v,r as y,t as b}from"./heading-YvnLNOwD.js";import{n as x,r as S,t as C}from"./slot-byr6JIFV.js";import{t as w}from"./rolldown-runtime-Dh6celcD.js";var T,E,D;function O(){return(O=w((()=>{e(),s(),T=`important`,E=` !`+T,D=d(class extends p{constructor(e){if(super(e),e.type!==l.ATTRIBUTE||e.name!==`style`||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,n)=>{let r=e[n];return r==null?t:t+`${n=n.includes(`-`)?n:n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,`-$&`).toLowerCase()}:${r};`},``)}update(e,[t]){let{style:n}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let e of this.ft)t[e]??(this.ft.delete(e),e.includes(`-`)?n.removeProperty(e):n[e]=null);for(let e in t){let r=t[e];if(r!=null){this.ft.add(e);let t=typeof r==`string`&&r.endsWith(E);e.includes(`-`)||t?n.setProperty(e,t?r.slice(0,-11):r,t?T:``):n[e]=r}}return i}})})))()}function k(){return(k=w((()=>{O()})))()}var A;function j(){return(j=w((()=>{o(),A=t`
  :host {
    display: block;
    /* 作為 grid / flex 項目時允許縮小，避免超長字串撐破欄寬 */
    min-width: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  /* ─── 卡片本體 ─── */
  .card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
    padding: var(--space-ms, 12px) 18px;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: inherit;
    text-decoration: none;
    background-color: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    transition:
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      transform var(--transition-base, 150ms ease);
  }

  /* ─── HOT 推薦外框 ─── */
  .card--hot {
    border-color: color-mix(
      in srgb,
      var(--color-accent, #f59e0b) 45%,
      var(--color-border, #e2e8f0)
    );
  }

  /* ─── 連結卡片的互動回饋 ─── */
  .card--link {
    cursor: pointer;
  }

  .card--link:hover {
    border-color: var(--color-brand-600, #0f4c81);
    box-shadow: 0 6px 20px -4px color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent);
    transform: translateY(-2px);
  }

  /* HOT 卡片懸停時保留琥珀色外框（加深為實色），不被品牌色蓋過 */
  .card--hot.card--link:hover {
    border-color: var(--color-accent, #f59e0b);
  }

  .card--link:active {
    transform: translateY(0);
  }

  .card--link:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 標題列 ─── */
  .card__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm, 8px);
    min-width: 0;
  }

  .card__name {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: anywhere;
    transition: color var(--transition-fast, 100ms ease);
  }

  /* 使用 brand-text（深色主題為亮色）確保懸停時仍符合對比 */
  .card--link:hover .card__name {
    color: var(--color-brand-text, #0f4c81);
  }

  .card__hot {
    flex: 0 0 auto;
    padding: 1px 6px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-2xs, 0.6875rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-normal, 1.5);
    letter-spacing: 0.04em;
    color: var(--color-warning-text, #92400e);
    background-color: var(--color-warning-dim, rgba(245, 158, 11, 0.14));
    border: 1px solid var(--color-warning-border, rgba(245, 158, 11, 0.3));
    border-radius: var(--radius-sm, 6px);
  }

  /* ─── 簡介描述 ─── */
  .card__desc {
    margin: var(--space-xs, 4px) 0 var(--space-ms, 12px);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: anywhere;
  }

  .card__desc--clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--_aui-card-lines, 2);
    line-clamp: var(--_aui-card-lines, 2);
    overflow: hidden;
  }

  /* ─── 標籤群：貼齊卡片底部，同一列卡片的標籤位置一致 ─── */
  .card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs, 4px);
    margin-top: auto;
  }

  /* 沒有簡介時，標籤群與名稱之間仍保留間距 */
  .card__desc[hidden] + .card__tags {
    padding-top: var(--space-ms, 12px);
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .card,
    .card__name {
      transition: none !important;
    }

    .card--link:hover {
      transform: none !important;
    }
  }
`})))()}var M;function N(){return(N=w((()=>{o(),h(),f(),_(),k(),b(),S(),j(),M=class extends r{static{this.styles=A}static{this.shadowRootOptions={...r.shadowRootOptions,delegatesFocus:!0}}constructor(){super(),this.heading=``,this.description=``,this.hot=!1,this.hotLabel=`HOT`,this.headingLevel=3,this.lines=2,new C(this)}render(){let e=this.href!=null,t=Number.isFinite(this.lines)&&this.lines>0?Math.floor(this.lines):0,r=!!this.heading||x(this,`heading`),i=x(this),o=i||!!this.description,s=x(this,`tags`),l=a`
      <div class="card__header" part="header">
        ${y(v(this.headingLevel,3),{className:`card__name`,part:`heading`,id:`heading`},a`<slot name="heading">${this.heading}</slot>`)}
        ${this.hot?a`<span class="card__hot" part="hot-badge" id="hot">${this.hotLabel}</span>`:n}
      </div>
      <div
        class=${c({card__desc:!0,"card__desc--clamp":t>0})}
        part="description"
        id="description"
        style=${D({"--_aui-card-lines":t>0?String(t):void 0})}
        ?hidden=${!o}
      >
        <!--
          不使用 slot 的 fallback 內容：只要 host 內有任何節點（包含換行空白、其他具名 slot 的元素之間的空白），
          預設 slot 就視為已指派，fallback 不會顯示。
        -->
        <slot></slot>${i?n:this.description}
      </div>
      <div class="card__tags" part="tags" id="tags" ?hidden=${!s}>
        <slot name="tags"></slot>
      </div>
    `,u=c({card:!0,"card--hot":this.hot,"card--link":e});if(!e)return a`<div class=${u} part="base">${l}</div>`;let d=this.rel??(this.target===`_blank`?`noopener noreferrer`:void 0),f=r?this.hot?`heading hot`:`heading`:void 0,p=[o?`description`:``,s?`tags`:``].filter(Boolean).join(` `)||void 0;return a`
      <a
        class=${u}
        part="base"
        href=${this.href??``}
        target=${g(this.target)}
        rel=${g(d)}
        aria-labelledby=${g(f)}
        aria-describedby=${g(p)}
      >
        ${l}
      </a>
    `}},m([u({type:String})],M.prototype,`heading`,void 0),m([u({type:String})],M.prototype,`description`,void 0),m([u({type:String})],M.prototype,`href`,void 0),m([u({type:String})],M.prototype,`target`,void 0),m([u({type:String})],M.prototype,`rel`,void 0),m([u({type:Boolean,reflect:!0})],M.prototype,`hot`,void 0),m([u({type:String,attribute:`hot-label`})],M.prototype,`hotLabel`,void 0),m([u({type:Number,attribute:`heading-level`})],M.prototype,`headingLevel`,void 0),m([u({type:Number})],M.prototype,`lines`,void 0),customElements.get(`aui-card`)||customElements.define(`aui-card`,M)})))()}function P(){return(P=w((()=>{N()})))()}export{P as t};