import{h as e,n as t,s as n,t as r}from"./lit-MXP2jLr5.js";import{i,m as a,r as o,t as s,u as c}from"./decorate-BSUctFxX.js";import{t as l}from"./query-jFZ5EnhK.js";import{t as u}from"./rolldown-runtime-Dh6celcD.js";var d;function f(){return(f=u((()=>{r(),d=e`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 外層容器（原生 details） ─── */
  .accordion {
    box-sizing: border-box;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-primary, #0f172a);
    background-color: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    transition: border-color var(--transition-base, 150ms ease);
  }

  /* 展開時外框高亮 */
  .accordion[open] {
    border-color: var(--color-brand-border, rgba(15, 76, 129, 0.25));
  }

  /* ─── 預設排版 ─── */
  .accordion--doc {
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    border-radius: var(--radius-lg, 12px);
  }

  .accordion--faq {
    padding: var(--space-ms, 12px) var(--space-md, 16px);
    border-radius: var(--radius-md, 8px);
  }

  /* ─── 標題列（原生 summary） ─── */
  .accordion__summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm, 8px);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    list-style: none; /* 移除原生的展開標記，改用自訂箭頭 */
    cursor: pointer;
    user-select: none;
    border-radius: var(--radius-sm, 6px);
    transition: color var(--transition-fast, 100ms ease);
  }

  .accordion__summary::-webkit-details-marker {
    display: none;
  }

  .accordion--faq .accordion__summary {
    font-weight: var(--weight-semibold, 600);
  }

  /* 使用 brand-text（深色主題為亮色）確保懸停時仍符合對比 */
  .accordion__summary:hover {
    color: var(--color-brand-text, #0f4c81);
  }

  .accordion__summary:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .accordion__heading {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  /* ─── 展開指示箭頭：收合時朝右，展開時旋轉朝下 ─── */
  .accordion__icon {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    color: var(--color-text-secondary, #475569);
    transition: transform var(--transition-base, 150ms ease);
  }

  .accordion__summary:hover .accordion__icon {
    color: inherit;
  }

  .accordion[open] .accordion__icon {
    transform: rotate(90deg);
  }

  /* ─── 內容 ─── */
  .accordion__body {
    margin-top: var(--space-md, 16px);
    padding-top: var(--space-sm, 8px);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    border-top: 1px dashed var(--color-border, #e2e8f0);
    overflow-wrap: anywhere;
  }

  .accordion--faq .accordion__body {
    margin-top: var(--space-ms, 12px);
  }

  /* 內容（預設 slot）中的段落與清單：預設間距與縮排層次；不套用到 heading slot */
  slot:not([name])::slotted(p),
  slot:not([name])::slotted(ul),
  slot:not([name])::slotted(ol) {
    margin: 0 0 var(--space-sm, 8px);
  }

  slot:not([name])::slotted(ul),
  slot:not([name])::slotted(ol) {
    padding-inline-start: var(--space-lg, 24px);
  }

  slot:not([name])::slotted(:last-child) {
    margin-bottom: 0;
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .accordion,
    .accordion__summary,
    .accordion__icon {
      transition: none !important;
    }
  }
`})))()}var p,m;function h(){return(h=u((()=>{r(),c(),o(),f(),p=new Set([`doc`,`faq`]),m=class extends t{constructor(...e){super(...e),this.heading=``,this.open=!1,this.name=``,this.variant=`doc`,this.handleNativeToggle=()=>{this.details&&this.details.open!==this.open&&(this.open=this.details.open)}}static{this.styles=d}show(){this.setOpen(!0)}hide(){this.setOpen(!1)}toggle(){this.setOpen(!(this.details?.open??this.open))}focus(e){let t=this.shadowRoot?.querySelector(`summary`);t?t.focus(e):super.focus(e)}setOpen(e){this.open=e,this.details&&(this.details.open=e)}connectedCallback(){if(super.connectedCallback(),!this.open||!this.name)return;let e=this.groupMembers().filter(e=>e.open);if(e.some(e=>!!(this.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)))this.open=!1;else for(let t of e)t.open=!1}updated(e){if((e.has(`open`)||e.has(`name`))&&this.open&&this.name)for(let e of this.groupMembers())e.open&&=!1;this.notifiedOpen===void 0?this.notifiedOpen=this.open:this.notifiedOpen!==this.open&&(this.notifiedOpen=this.open,this.dispatchEvent(new CustomEvent(`aui-toggle`,{detail:{open:this.open},bubbles:!0,composed:!0})))}groupMembers(){return[...this.getRootNode().querySelectorAll(`aui-accordion`)].filter(e=>e!==this&&e.name===this.name&&!e.contains(this)&&!this.contains(e))}render(){let e=p.has(this.variant)?this.variant:`doc`;return n`
      <details
        class=${i({accordion:!0,[`accordion--${e}`]:!0})}
        part="base"
        .open=${this.open}
        @toggle=${this.handleNativeToggle}
      >
        <summary class="accordion__summary" part="summary">
          <span class="accordion__heading" part="heading">
            <slot name="heading">${this.heading}</slot>
          </span>
          <svg
            class="accordion__icon"
            part="icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 3.5 4.5 4.5L6 12.5" />
          </svg>
        </summary>
        <div class="accordion__body" part="body">
          <slot></slot>
        </div>
      </details>
    `}},s([a({type:String})],m.prototype,`heading`,void 0),s([a({type:Boolean,reflect:!0})],m.prototype,`open`,void 0),s([a({type:String,reflect:!0})],m.prototype,`name`,void 0),s([a({type:String,reflect:!0})],m.prototype,`variant`,void 0),s([l(`details`)],m.prototype,`details`,void 0),customElements.get(`aui-accordion`)||customElements.define(`aui-accordion`,m)})))()}function g(){return(g=u((()=>{h()})))()}export{g as t};