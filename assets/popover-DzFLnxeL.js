import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,n,s as r,t as i}from"./lit-DvaG8Cmk.js";import{g as a,i as o,p as s,r as c,t as l,u,v as d}from"./decorate-B5jhCMz7.js";import{r as f,t as p}from"./if-defined-BTZAmkBp.js";import{a as m,s as h}from"./spinner-D5wD4gSs.js";import{t as g}from"./focus-return-Wn_O2faU.js";import{n as _}from"./transition-B7KgZIOq.js";import{a as v,c as y,i as b,l as x,n as S,o as C,r as w,s as T}from"./tooltip-BA93hCnH.js";var E;function D(){return(D=e((()=>{i(),E=t`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  .popover__trigger {
    display: inline-flex;
    vertical-align: middle;
  }

  /* ─── 面板：原生 Popover API 進入 Top Layer，位置由 @floating-ui/dom 計算 ─── */
  .popover__panel {
    position: fixed;
    inset: unset;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: max-content;
    min-width: 10rem;
    max-width: min(22.5rem, calc(100vw - 16px));
    max-height: calc(100vh - 16px);
    margin: 0;
    padding: var(--space-sm, 8px);
    overflow: auto;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    background-color: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    box-shadow: var(--shadow-popover, 0 4px 12px rgb(0 0 0 / 28%));
    opacity: 0;
    transform: scale(0.95);
    transform-origin: var(--_aui-popover-origin, top left);
    /* 時長來自 motion token；popover.ts 讀取計算後的時長決定何時關閉 popover */
    transition:
      opacity var(--transition-base, 150ms ease),
      transform var(--transition-base, 150ms ease);
  }

  .popover__panel--visible {
    opacity: 1;
    transform: scale(1);
  }

  /* 內容沒有可聚焦元素時焦點落在面板本身：面板不在 Tab 順序中也不可操作，不畫焦點框（同 Modal 面板） */
  .popover__panel:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .popover__panel {
      transition: none !important;
      transform: none !important;
    }
  }
`})))()}var O,k,A;function j(){return(j=e((()=>{i(),u(),c(),p(),T(),w(),m(),D(),O=new Set([`aui-popover`,`aui-modal`,`aui-drawer`,`aui-alert`]),k=`a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable="true"]`,A=class extends n{static{this.styles=E}constructor(){super(),this.open=!1,this.placement=`bottom-start`,this.distance=8,this.skidding=0,this.label=``,this.isVisible=!1,this.popupRole=`dialog`,this.triggerElement=null,this.isShowing=!1,this.isHiding=!1,this.transitionId=0,this.pendingReason=`api`,this.hideReason=`api`,this.focusWasInside=!1,this.cleanupAutoUpdate=null,this.handleTriggerSlotChange=()=>{this.syncTrigger()},this.handleTriggerClick=()=>{this.open?this.close(`trigger`):this.show()},this.handleKeyDown=e=>{e.key===`Escape`&&this.open&&!e.defaultPrevented&&(e.preventDefault(),this.close(`escape`))},this.handleFocusOut=e=>{if(!this.isShowing)return;let t=e.relatedTarget;t&&!this.containsDeep(t)&&this.close(`focus-out`)},this.handleDocumentPointerDown=e=>{this.isShowing&&!e.composedPath().includes(this)&&(this.focusWasInside=this.containsDeep(g()),this.close(`outside`))},this.addEventListener(`keydown`,this.handleKeyDown),this.addEventListener(`focusout`,this.handleFocusOut)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&(this.syncTrigger(),this.open&&!this.isShowing&&this.requestUpdate(`open`,void 0))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),this.stopAutoUpdate(),this.triggerElement&&h(this.triggerElement,null),this.transitionId++;let e=this.isShowing,t=this.isHiding;this.isShowing=!1,this.isHiding=!1,this.isVisible=!1,e&&(this.open=!1,this.hideReason=`api`,this.dispatchEvent(new CustomEvent(`aui-hide`,this.hideEventInit(!1)))),(e||t)&&this.dispatchEvent(new CustomEvent(`aui-after-hide`,this.hideEventInit(!1)))}firstUpdated(){this.syncTrigger()}willUpdate(e){if(super.willUpdate(e),e.has(`open`)){if(!this.open&&this.isShowing)this.startHide();else if(this.open&&!this.isShowing&&this.isConnected){this.isHiding&&this.finishHide();let e=new CustomEvent(`aui-show`,{bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)||(this.open=!1)}}}updated(e){super.updated(e),e.has(`open`)&&this.open&&!this.isShowing&&this.isConnected?this.startShow(e.get(`open`)!==void 0):this.isShowing&&(e.has(`placement`)||e.has(`distance`)||e.has(`skidding`))&&this.reposition(),e.has(`label`)&&this.syncPanelName()}show(){this.open=!0}hide(){this.close(`api`)}toggle(){this.open?this.hide():this.show()}close(e){this.open&&=(this.pendingReason=e,!1)}async focusPanel(){let e=this.transitionId,t=this.panelElements().filter(e=>!this.inNestedOverlay(e)),n=t.find(e=>e.hasAttribute(`autofocus`)),r=n?.updateComplete;if(r&&(await r,e!==this.transitionId))return;let i=n?[n,...t]:t;for(let e of i)if((e.matches(k)||e.localName.includes(`-`))&&!e.matches(`[disabled], [tabindex="-1"]`)&&(e.focus({preventScroll:!0}),e.matches(`:focus-within`)))return;this.panel?.focus({preventScroll:!0})}inNestedOverlay(e){for(let t=e.parentElement;t&&t!==this;t=t.parentElement){if(!O.has(t.localName))continue;let n=e.closest(`[slot="trigger"]`);return t.localName!==`aui-popover`||n?.parentElement!==t}return!1}panelElements(){return((this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]).flatMap(e=>[e,...e.querySelectorAll(`*`)])}containsDeep(e){let t=e;for(;t;){if(this.contains(t)||this.shadowRoot?.contains(t))return!0;let e=t.getRootNode();t=e instanceof ShadowRoot?e.host:null}return!1}syncTrigger(){let e=(this.shadowRoot?.querySelector(`slot[name="trigger"]`))?.assignedElements({flatten:!0})[0]??null;e!==this.triggerElement&&this.triggerElement&&h(this.triggerElement,null),this.triggerElement=e,this.syncTriggerState(),this.syncPanelName(),this.isShowing&&this.startAutoUpdate()}syncTriggerState(){this.triggerElement&&h(this.triggerElement,{expanded:this.isShowing,hasPopup:this.popupRole,controls:this})}syncPanelName(){this.panel&&(this.panel.ariaLabelledByElements=!this.label&&this.triggerElement?[this.triggerElement]:null)}startShow(e){let t=++this.transitionId;this.isShowing=!0,this.isHiding=!1;try{this.panel.showPopover?.()}catch{}this.syncTriggerState(),this.startAutoUpdate(),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),e&&this.focusPanel(),requestAnimationFrame(()=>{t===this.transitionId&&(this.isVisible=!0,this.dispatchEvent(new CustomEvent(`aui-after-show`,{bubbles:!0,composed:!0})))})}startHide(){let e=this.pendingReason;if(this.pendingReason=`api`,this.hideReason=e,!this.dispatchEvent(new CustomEvent(`aui-hide`,this.hideEventInit(!0)))){this.open=!0;return}let t=++this.transitionId;this.isShowing=!1,this.isHiding=!0,this.isVisible=!1,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),this.syncTriggerState(),this.restoreFocus(e),window.setTimeout(()=>{t===this.transitionId&&this.finishHide()},_(this.panel))}finishHide(){this.transitionId++;try{this.panel.hidePopover?.()}catch{}this.stopAutoUpdate(),this.isHiding=!1,this.dispatchEvent(new CustomEvent(`aui-after-hide`,this.hideEventInit(!1)))}hideEventInit(e){return{detail:{reason:this.hideReason},bubbles:!0,composed:!0,cancelable:e}}restoreFocus(e){let t=this.triggerElement;if(t&&e!==`focus-out`){if(e===`outside`){if(!this.focusWasInside)return;window.setTimeout(()=>{let e=g();(!e||e===document.body||this.containsDeep(e))&&t.focus({preventScroll:!0})})}else this.containsDeep(g())&&t.focus({preventScroll:!0})}}async reposition(){let e=this.triggerElement??this.shadowRoot?.querySelector(`.popover__trigger`);if(!e||!this.panel)return;let{x:t,y:n,placement:r}=await v(e,this.panel,{placement:this.placement,strategy:`fixed`,middleware:[y({mainAxis:this.distance,crossAxis:this.skidding}),C({fallbackAxisSideDirection:`start`,padding:8}),x({padding:8})]});this.panel.style.left=`${Math.round(t)}px`,this.panel.style.top=`${Math.round(n)}px`,this.panel.setAttribute(`data-placement`,r),this.panel.style.setProperty(`--_aui-popover-origin`,S[r])}startAutoUpdate(){this.stopAutoUpdate();let e=this.triggerElement??this.shadowRoot?.querySelector(`.popover__trigger`);e&&this.panel&&(this.cleanupAutoUpdate=b(e,this.panel,()=>void this.reposition()))}stopAutoUpdate(){this.cleanupAutoUpdate?.(),this.cleanupAutoUpdate=null}render(){return r`
      <div class="popover__trigger" part="trigger" @click=${this.handleTriggerClick}>
        <slot name="trigger" @slotchange=${this.handleTriggerSlotChange}></slot>
      </div>
      <div
        class=${o({popover__panel:!0,"popover__panel--visible":this.isVisible})}
        part="panel"
        popover="manual"
        role=${this.popupRole}
        tabindex="-1"
        aria-label=${f(this.label||void 0)}
      >
        <slot></slot>
      </div>
    `}},l([d({type:Boolean,reflect:!0})],A.prototype,`open`,void 0),l([d({type:String,reflect:!0})],A.prototype,`placement`,void 0),l([d({type:Number})],A.prototype,`distance`,void 0),l([d({type:Number})],A.prototype,`skidding`,void 0),l([d({type:String})],A.prototype,`label`,void 0),l([a()],A.prototype,`isVisible`,void 0),l([s(`.popover__panel`)],A.prototype,`panel`,void 0),customElements.get(`aui-popover`)||customElements.define(`aui-popover`,A)})))()}export{E as i,j as n,D as r,A as t};