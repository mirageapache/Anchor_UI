import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-Bfdqhiqf.js";import{i as o,m as s,r as c,t as l,u}from"./decorate-mVVnLxoL.js";import{r as d,t as f}from"./if-defined-vfYzS9xW.js";import{n as p,r as m,t as h}from"./status-icons-RQKfkCi2.js";var g;function _(){return(_=e((()=>{a(),g=t`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 結果框：預設（成功）為翠綠底與 4px 左側語意邊條 ─── */
  .output {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 3.5rem;
    padding: 12px 16px;
    background: var(--color-output-bg, #f0fdf4);
    border: 1px solid var(--color-success-border, color-mix(in srgb, #10b981 28%, transparent));
    border-left: 4px solid var(--color-success, #10b981);
    border-radius: var(--radius-md, 8px);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .output--warning {
    background: var(--color-warning-bg, #fffbeb);
    border-color: var(--color-warning-border, color-mix(in srgb, #f59e0b 30%, transparent));
    border-left-color: var(--color-warning, #f59e0b);
  }

  .output--error {
    background: var(--color-error-bg, #fef2f2);
    border-color: var(--color-danger-border, color-mix(in srgb, #ef4444 25%, transparent));
    border-left-color: var(--color-danger, #ef4444);
  }

  /* 圖示與文字：圖示對齊第一行文字，多行時不會垂直置中到整段中間 */
  .output__body {
    display: flex;
    flex: 1;
    align-items: flex-start;
    gap: var(--space-sm, 8px);
    min-width: 0;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-success-text, #047857);
    transition: color var(--transition-theme, 200ms ease);
  }

  .output--warning .output__body {
    color: var(--color-warning-text, #92400e);
  }

  .output--error .output__body {
    color: var(--color-danger-text, #b91c1c);
  }

  .output--empty .output__body {
    color: var(--color-output-placeholder, #64748b);
  }

  /* 狀態圖示：讓成功／錯誤不只依賴顏色傳達（WCAG 1.4.1） */
  .output__icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    height: calc(var(--leading-normal, 1.5) * 1em);
  }

  .output__icon svg {
    width: 16px;
    height: 16px;
  }

  /*
   * 長文字防護：保留換行與空白；優先於空白處換行，放不下的長字串（Hash、Base64、URL）
   * 才於任意位置斷開，不產生橫向溢位。不使用 word-break: break-all，以免一般文字被從字中拆開。
   */
  .output__text {
    flex: 1;
    min-width: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  /* ─── 螢幕閱讀器專用文字 ─── */
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

  @media (prefers-reduced-motion: reduce) {
    .output,
    .output__body {
      transition: none;
    }
  }
`})))()}var v,y;function b(){return(b=e((()=>{a(),u(),c(),f(),_(),m(),v=new Set([`success`,`warning`,`error`]),y=class extends r{constructor(...e){super(...e),this.value=``,this.status=`success`,this.placeholder=``,this.label=``,this.description=``}static{this.styles=g}render(){let e=this.value!==``,t=v.has(this.status)?this.status:`success`;return i`
      <div
        part="base"
        class=${o({output:!0,[`output--${t}`]:e&&t!==`success`,"output--empty":!e})}
        role="status"
        aria-label=${d(this.label||void 0)}
        aria-describedby=${d(this.description?`description`:void 0)}
      >
        <div class="output__body">
          ${e?i`
                  <span part="icon" class="output__icon" aria-hidden="true">
                    ${h[t]}
                  </span>
                  <span class="sr-only">${p[t]}：</span>
                `:n}
          <span part="text" class="output__text">${e?this.value:this.placeholder}</span>
        </div>
      </div>
      ${this.description?i`<span id="description" class="sr-only">${this.description}</span>`:n}
    `}},l([s({type:String})],y.prototype,`value`,void 0),l([s({type:String,reflect:!0})],y.prototype,`status`,void 0),l([s({type:String})],y.prototype,`placeholder`,void 0),l([s({type:String})],y.prototype,`label`,void 0),l([s({type:String})],y.prototype,`description`,void 0),customElements.get(`aui-output`)||customElements.define(`aui-output`,y)})))()}function x(){return(x=e((()=>{b()})))()}export{x as t};