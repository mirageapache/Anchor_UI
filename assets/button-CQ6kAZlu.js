import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{g as o,i as s,r as c,t as l,u,v as d}from"./decorate-B5jhCMz7.js";import{r as f,t as p}from"./if-defined-BTZAmkBp.js";import{a as m,i as h,l as g,n as _,o as v,r as y,t as b}from"./spinner-D5wD4gSs.js";var x;function S(){return(S=e((()=>{a(),x=t`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([full-width]) {
    display: block;
    width: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 內部按鈕容器 ─── */
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0 var(--space-lg, 24px);
    font-family: var(--font-ui, system-ui, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-normal, 1.5);
    text-align: center;
    text-decoration: none;
    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    user-select: none;
    outline: none;
    gap: var(--space-sm, 8px);
    transition:
      filter var(--transition-fast, 100ms ease),
      background-color var(--transition-base, 150ms ease),
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  /* ─── 尺寸變體 ─── */
  .btn--sm {
    min-height: 32px;
    padding: 0 var(--space-ms, 12px);
    font-size: var(--text-xs, 0.75rem);
    border-radius: var(--radius-sm, 6px);
    gap: var(--space-xs, 4px);
  }

  .btn--md {
    min-height: 40px; /* 符合 40px 最低觸控規範 */
    padding: 0 var(--space-lg, 24px);
    font-size: var(--text-sm, 0.875rem);
    border-radius: var(--radius-md, 8px);
    gap: var(--space-sm, 8px);
  }

  .btn--lg {
    min-height: 48px;
    padding: 0 var(--space-xl, 40px);
    font-size: var(--text-base, 1rem);
    border-radius: var(--radius-lg, 12px);
    gap: var(--space-sm, 8px);
  }

  /* ─── Active 動態點擊縮放 ─── */
  .btn:active:not(:disabled):not(.btn--loading) {
    transform: scale(0.98);
  }

  /* ─── Focus 雙層無障礙焦點環 ─── */
  .btn:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-500, #1b6ca8) 25%, transparent);
  }

  .btn:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }

  /* ─── 停用狀態 ─── */
  .btn:disabled,
  .btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
    transform: none;
  }

  /* ─── 載入中狀態 ─── */
  .btn--loading {
    cursor: wait;
    pointer-events: none;
  }

  /* ─── 1. Primary: 品牌海軍藍實心 (主要 CTA) ─── */
  .btn--primary {
    background-color: var(--color-brand-600, #0f4c81);
    color: var(--color-on-solid, #ffffff);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--color-brand-600, #0f4c81) 20%, transparent);
  }

  .btn--primary:hover:not(:disabled):not(.btn--loading) {
    background-color: var(--color-brand-700, #0a3356);
    filter: brightness(1.05);
  }

  /* ─── 2. Accent: 琥珀金高反差 (核心轉檔、加值功能) ─── */
  .btn--accent {
    background-color: var(--color-accent, #f59e0b);
    color: var(--color-on-accent, #0f172a);
    font-weight: var(--weight-bold, 700);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--color-accent, #f59e0b) 25%, transparent);
  }

  .btn--accent:hover:not(:disabled):not(.btn--loading) {
    background-color: var(--color-accent-hover, #d97706);
  }

  /* ─── 3. Ghost: 次要線框操作 (載入範例、清除、副操作) ─── */
  .btn--ghost {
    background-color: transparent;
    color: var(--color-text-secondary, #475569);
    border-color: var(--color-ghost-border, #cbd5e1);
    font-weight: var(--weight-medium, 500);
  }

  .btn--ghost:hover:not(:disabled):not(.btn--loading) {
    border-color: var(--color-brand-500, #1b6ca8);
    color: var(--color-text-primary, #0f172a);
    background-color: var(
      --color-brand-dim,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
    );
  }

  /* ─── 4. Danger: 刪除或破壞性按鈕 ─── */
  .btn--danger {
    background-color: var(--color-danger-solid, #dc2626);
    color: var(--color-on-solid, #ffffff);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--color-danger-solid, #dc2626) 20%, transparent);
  }

  .btn--danger:hover:not(:disabled):not(.btn--loading) {
    background-color: var(--color-danger-solid-hover, #b91c1c);
  }

  /* ─── 5. Success: 成功、確認或完成操作 ─── */
  .btn--success {
    background-color: var(--color-success-solid, #047857);
    color: var(--color-on-solid, #ffffff);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--color-success-solid, #047857) 20%, transparent);
  }

  .btn--success:hover:not(:disabled):not(.btn--loading) {
    background-color: var(--color-success-solid-hover, #065f46);
  }

  /* ─── 內容與插槽元素 ─── */
  .btn__prefix,
  .btn__suffix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .btn__label {
    display: inline-flex;
    align-items: center;
  }

  /* ─── 載入指示器 Spinner ─── */
  .btn__spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .btn__spinner svg {
    display: block;
    width: 1.15em;
    height: 1.15em;
  }

  /* Spinner 動畫由共用的 spinnerStyles（src/internal/spinner.ts）提供 */

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none !important;
      transform: none !important;
    }
  }
`})))()}function C(e){if(typeof e.attachInternals!=`function`)return null;let t=e.attachInternals();return typeof t.setFormValue==`function`&&typeof t.setValidity==`function`&&`form`in t?t:null}function w(e){let t=e.getAttribute(`form`);if(t){let n=e.getRootNode().getElementById?.(t);return n instanceof HTMLFormElement?n:null}return e.closest(`form`)}function T(){return(T=e((()=>{})))()}function E(e){return e instanceof HTMLInputElement?e.type===`submit`||e.type===`image`:e.type===`submit`}function D(e){return e instanceof HTMLInputElement?A.has(e.type):e.localName===`aui-input`&&!e.multiline}function O(e){let t=[...e.elements],n=t.find(E);if(n){if(n.matches(`:disabled`)||n.loading)return!1;let t=n instanceof HTMLButtonElement||n instanceof HTMLInputElement?n:void 0;return HTMLFormElement.prototype.requestSubmit.call(e,t),!0}return t.filter(D).length>1?!1:(HTMLFormElement.prototype.requestSubmit.call(e),!0)}function k(e,t){setTimeout(()=>{e.defaultPrevented||t()})}var A;function j(){return(j=e((()=>{A=new Set([`text`,`search`,`url`,`tel`,`email`,`password`,`date`,`month`,`week`,`time`,`datetime-local`,`number`])})))()}var M;function N(){return(N=e((()=>{a(),u(),c(),p(),S(),j(),m(),b(),M=class extends r{static{this.styles=[y,x]}static{this.shadowRootOptions={...r.shadowRootOptions,delegatesFocus:!0}}static{this.formAssociated=!0}[h](e){this.popupTrigger=e}constructor(){super(),this.variant=`primary`,this.size=`md`,this.type=`button`,this.disabled=!1,this.loading=!1,this.fullWidth=!1,this.hostDescribedBy=null,this.formDisabled=!1,this.popupTrigger=null,this.handleHostClick=e=>{g(e,this.isDisabled||this.loading)||(this.type===`submit`||this.type===`reset`)&&k(e,()=>{let e=this.form;e&&this.isConnected&&!this.isDisabled&&!this.loading&&(this.type===`submit`?HTMLFormElement.prototype.requestSubmit.call(e):this.type===`reset`&&HTMLFormElement.prototype.reset.call(e))})},this.internals=C(this),this.addEventListener(`click`,this.handleHostClick,{capture:!0})}get form(){return this.internals?this.internals.form:w(this)}formDisabledCallback(e){this.formDisabled=e}get isDisabled(){return this.disabled||this.formDisabled}get describedByElements(){let e=(this.hostDescribedBy??``).split(/\s+/).filter(Boolean),t=this.getRootNode();if(!e.length||!(t instanceof Document||t instanceof ShadowRoot))return null;let n=e.map(e=>t.getElementById(e)).filter(e=>e!==null);return n.length?n:null}render(){let e=this.isDisabled,t=e||this.loading,r=v(this.popupTrigger);return i`
      <button
        part="button"
        class=${s({btn:!0,[`btn--${this.variant}`]:!0,[`btn--${this.size}`]:!0,"btn--disabled":e,"btn--loading":this.loading})}
        type=${this.type}
        ?disabled=${e}
        aria-busy=${this.loading?`true`:`false`}
        aria-disabled=${t?`true`:`false`}
        aria-haspopup=${f(r.hasPopup)}
        aria-expanded=${f(r.expanded)}
        .ariaDescribedByElements=${this.describedByElements}
        .ariaControlsElements=${r.controls}
      >
        ${this.loading?i`
                <span class="btn__spinner" part="spinner" aria-hidden="true">${_}</span>
              `:i`
                <span class="btn__prefix" part="prefix">
                  <slot name="prefix"></slot>
                </span>
              `}

        <span class="btn__label" part="label">
          <slot></slot>
        </span>

        ${this.loading?n:i`
                <span class="btn__suffix" part="suffix">
                  <slot name="suffix"></slot>
                </span>
              `}
      </button>
    `}},l([d({type:String,reflect:!0})],M.prototype,`variant`,void 0),l([d({type:String,reflect:!0})],M.prototype,`size`,void 0),l([d({type:String,reflect:!0})],M.prototype,`type`,void 0),l([d({type:Boolean,reflect:!0})],M.prototype,`disabled`,void 0),l([d({type:Boolean,reflect:!0})],M.prototype,`loading`,void 0),l([d({type:Boolean,reflect:!0,attribute:`full-width`})],M.prototype,`fullWidth`,void 0),l([d({attribute:`aria-describedby`})],M.prototype,`hostDescribedBy`,void 0),l([o()],M.prototype,`formDisabled`,void 0),l([o()],M.prototype,`popupTrigger`,void 0),customElements.get(`aui-button`)||customElements.define(`aui-button`,M)})))()}function P(){return(P=e((()=>{N()})))()}export{C as a,O as i,k as n,w as o,j as r,T as s,P as t};