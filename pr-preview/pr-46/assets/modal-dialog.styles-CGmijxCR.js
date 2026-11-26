import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{_ as t,h as n,i as r,n as i,s as a,t as o}from"./lit-DvaG8Cmk.js";import{g as s,i as c,p as l,r as u,t as d,u as f,v as p}from"./decorate-B5jhCMz7.js";import{r as m,t as h}from"./if-defined-BTZAmkBp.js";import{r as g}from"./focus-return-Wn_O2faU.js";import{a as _,c as v,d as y,r as b,t as x}from"./top-layer-BK5O3D4l.js";import{n as S}from"./transition-B7KgZIOq.js";var C;function w(){return(w=e((()=>{C={fromAttribute:e=>e!==`false`,toAttribute:e=>e?null:`false`}})))()}function T(){let e=document.documentElement;if(E.count===0){let t=window.innerWidth-e.clientWidth,n=getComputedStyle(e).scrollbarGutter.includes(`stable`);if(E.saved={overflow:e.style.overflow,paddingRight:e.style.paddingRight},t>0&&!n){let n=parseFloat(getComputedStyle(e).paddingRight)||0;e.style.paddingRight=`${n+t}px`}e.style.overflow=`hidden`}E.count++;let t=!1;return()=>{t||(t=!0,E.count=Math.max(0,E.count-1),E.count===0&&E.saved&&(e.style.overflow=E.saved.overflow,e.style.paddingRight=E.saved.paddingRight,E.saved=null))}}var E;function D(){return(D=e((()=>{E=y(`scroll-lock@1`,()=>({count:0,saved:null}))})))()}function O(e,t){let n=e;for(;n;){if(n===t)return!0;n=n.parentNode??(n instanceof ShadowRoot?n.host:null)}return!1}var k,A,j;function M(){return(M=e((()=>{o(),f(),u(),h(),w(),D(),_(),k=`aui-modal, aui-drawer, aui-alert`,A=Symbol.for(`aui.modal-dialog.force-close`),j=class extends i{constructor(...e){super(...e),this.open=!1,this.heading=``,this.label=``,this.description=``,this.closeOnEscape=!0,this.closeOnBackdrop=!0,this.noCloseButton=!1,this.closeLabel=`關閉`,this.isLeaving=!1,this.hasHeaderSlot=!1,this.hasFooterSlot=!1,this.isShown=!1,this.transitionId=0,this.transitionSettled=Promise.resolve(),this.settleTransition=()=>{},this.pendingReason=`api`,this.hidingReason=`api`,this.pointerDownOnBackdrop=!1,this.releaseScroll=null,this.restoreFocus=null,this.popLayer=null,this.handleCancel=e=>{e.preventDefault(),this.closeOnEscape&&this.requestClose(`escape`)},this.handleNativeClose=()=>{if(this.dialog.open||!this.isShown&&!this.open)return;this.beginTransition();let e=this.isShown;this.isShown=!1,this.isLeaving=!1,this.open=!1,e&&this.dispatchHide(`escape`,{cancelable:!1}),this.closeNestedDialogs(),this.releaseResources({restoreFocus:!0}),this.dispatchAfterHide(`escape`),this.settleTransition()},this.handlePointerDown=e=>{this.pointerDownOnBackdrop=e.target===this.dialog},this.handleClick=e=>{let t=this.pointerDownOnBackdrop&&e.target===this.dialog;this.pointerDownOnBackdrop=!1,t&&this.closeOnBackdrop&&this.requestClose(`backdrop`)},this.handleCloseButton=()=>{this.requestClose(`close-button`)},this.handleSlotChange=e=>{let t=e.target,n=t.assignedNodes({flatten:!0}).length>0;t.name===`header`?this.hasHeaderSlot=n:t.name===`footer`&&(this.hasFooterSlot=n)}}async show(){this.open=!0,await this.transitionEnd()}async hide(){this.requestClose(`api`),await this.transitionEnd()}async transitionEnd(){if(!this.isConnected)return;let e=!1;for(;!e;)e=await this.updateComplete;await this.transitionSettled}beginTransition(){return this.settleTransition(),this.transitionSettled=new Promise(e=>this.settleTransition=e),++this.transitionId}disconnectedCallback(){super.disconnectedCallback(),this[A]()}[A](){if(!this.isShown&&!this.dialog?.open)return;let e=this.isShown,t=e?this.pendingReason:this.hidingReason;this.pendingReason=`api`,this.beginTransition(),this.isShown=!1,this.isLeaving=!1,this.open=!1,this.dialog.close(),this.releaseResources({restoreFocus:!1}),e&&this.dispatchHide(t,{cancelable:!1}),this.dispatchAfterHide(t),this.settleTransition()}closeNestedDialogs(){for(let e of b().reverse())e!==this&&O(e,this)&&e[A]?.()}requestClose(e){this.open&&=(this.pendingReason=e,!1)}willUpdate(e){if(super.willUpdate(e),!this.hasUpdated){let e=[...this.children].map(e=>e.slot);this.hasHeaderSlot=e.includes(`header`),this.hasFooterSlot=e.includes(`footer`)}if(!e.has(`open`))return;let t=this.pendingReason;this.pendingReason=`api`,!this.open&&this.isShown?this.startHide(t):this.open&&!this.isShown&&this.dialog?.open&&this.startShow()}updated(e){super.updated(e),e.has(`open`)&&this.open&&!this.isShown&&this.startShow()}startShow(){if(!this.isConnected){this.open=!1;return}let e=new CustomEvent(`aui-show`,{bubbles:!0,composed:!0,cancelable:!0});if(this.dispatchEvent(e),e.defaultPrevented||!this.isConnected){this.open=!1;return}let t=this.dialog.open;if(t)this.dispatchAfterHide(this.hidingReason);else{let e=g(),t=T();try{this.dialog.showModal()}catch(e){throw t(),this.open=!1,e}this.restoreFocus=e,this.releaseScroll=t,this.popLayer=v(this)}let n=this.beginTransition();this.isShown=!0,t||this.applyInitialFocus(n),this.isLeaving=!1,this.updateComplete.then(()=>{window.setTimeout(()=>{n===this.transitionId&&(this.dispatchEvent(new CustomEvent(`aui-after-show`,{bubbles:!0,composed:!0})),this.settleTransition())},S(this.panel))})}startHide(e){if(!this.dispatchHide(e,{cancelable:!0})){this.open=!0;return}let t=this.beginTransition();this.isShown=!1,this.isLeaving=!0,this.hidingReason=e,this.closeNestedDialogs(),this.updateComplete.then(()=>{window.setTimeout(()=>{t===this.transitionId&&(this.dialog.close(),this.isLeaving=!1,this.releaseResources({restoreFocus:!0}),this.dispatchAfterHide(e),this.settleTransition())},S(this.panel))})}applyInitialFocus(e){let t=[...this.querySelectorAll(`[autofocus]`)].find(e=>e.closest(k)===this);if(!t){this.panel.focus();return}if(t.focus(),t.matches(`:focus-within`))return;this.panel.focus();let n=t.updateComplete;n&&n.then(()=>{e===this.transitionId&&this.isShown&&t.focus()})}releaseResources({restoreFocus:e}){this.popLayer?.(),this.releaseScroll?.(),e&&this.restoreFocus?.(),this.popLayer=this.releaseScroll=this.restoreFocus=null}dispatchHide(e,{cancelable:t}){return this.dispatchEvent(new CustomEvent(`aui-hide`,{detail:{reason:e},bubbles:!0,composed:!0,cancelable:t}))}dispatchAfterHide(e){this.dispatchEvent(new CustomEvent(`aui-after-hide`,{detail:{reason:e},bubbles:!0,composed:!0}))}renderDialog({prefix:e,panelClass:t,role:n}){let i=!!this.heading||this.hasHeaderSlot,o=!this.heading&&this.label?this.label:void 0;return a`
      <dialog
        part="dialog"
        class=${c({[e]:!0,[`${e}--leaving`]:this.isLeaving})}
        aria-labelledby=${m(this.heading?`title`:void 0)}
        aria-label=${m(o)}
        aria-describedby=${m(this.description?`description`:void 0)}
        role=${m(n)}
        @cancel=${this.handleCancel}
        @close=${this.handleNativeClose}
        @pointerdown=${this.handlePointerDown}
        @click=${this.handleClick}
      >
        <div part="panel" class="${e}__panel ${t}" tabindex="-1">
          <div
            part="header"
            class=${c({[`${e}__header`]:!0,[`${e}__header--empty`]:!i})}
          >
            ${this.heading?a`<h2 part="title" id="title" class="${e}__title">${this.heading}</h2>`:r}
            <slot name="header" @slotchange=${this.handleSlotChange}></slot>
            ${this.renderCloseButton(`${e}__close`)}
          </div>
          <div part="body" class="${e}__body">
            <slot></slot>
          </div>
          <div
            part="footer"
            class=${c({[`${e}__footer`]:!0,[`${e}__footer--empty`]:!this.hasFooterSlot})}
          >
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
        <slot name=${x}></slot>
        ${this.renderDescription()}
      </dialog>
    `}renderCloseButton(e){return this.noCloseButton?r:a`
      <button
        part="close-button"
        class=${e}
        type="button"
        aria-label=${this.closeLabel||`關閉`}
        @click=${this.handleCloseButton}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `}renderDescription(){return this.description?a`<span id="description" hidden>${this.description}</span>`:r}},d([l(`dialog`)],j.prototype,`dialog`,void 0),d([l(`[part="panel"]`)],j.prototype,`panel`,void 0),d([p({type:Boolean,reflect:!0})],j.prototype,`open`,void 0),d([p({type:String})],j.prototype,`heading`,void 0),d([p({type:String})],j.prototype,`label`,void 0),d([p({type:String})],j.prototype,`description`,void 0),d([p({attribute:`close-on-escape`,converter:C})],j.prototype,`closeOnEscape`,void 0),d([p({attribute:`close-on-backdrop`,converter:C})],j.prototype,`closeOnBackdrop`,void 0),d([p({type:Boolean,attribute:`no-close-button`})],j.prototype,`noCloseButton`,void 0),d([p({type:String,attribute:`close-label`})],j.prototype,`closeLabel`,void 0),d([s()],j.prototype,`isLeaving`,void 0),d([s()],j.prototype,`hasHeaderSlot`,void 0),d([s()],j.prototype,`hasFooterSlot`,void 0)})))()}function N(e){let r=t(e);return n`
    :host {
      display: contents;
    }

    /*
     * ─── dialog：撐滿整個視窗的透明層 ───
     * 點擊面板以外的區域即為點擊遮罩（事件目標皆為 dialog 本身）
     */
    .${r} {
      box-sizing: border-box;
      position: fixed;
      inset: 0;
      width: 100%;
      max-width: none;
      height: 100%;
      max-height: none;
      margin: 0;
      color: inherit;
      background: transparent;
      border: 0;
      overflow: hidden;
    }

    /*
     * 進場以 @starting-style 定義起始狀態：showModal() 讓 dialog 從 display: none 開始渲染時，
     * 瀏覽器自動從起始樣式轉場到一般樣式，不需要 JS 延後一幀切換 class。
     * 退場則由元件加上 --leaving，轉場結束後才 close()。
     */

    /* ─── 遮罩：淡入淡出 ─── */
    .${r}::backdrop {
      background: var(--color-backdrop, rgb(15 23 42 / 65%));
      opacity: 1;
    }

    .${r}--leaving::backdrop {
      opacity: 0;
    }

    @starting-style {
      .${r}[open]::backdrop {
        opacity: 0;
      }
    }

    /* ─── 面板 ─── */
    .${r}__panel {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      font-family: var(
        --font-ui,
        'Inter',
        system-ui,
        -apple-system,
        'Segoe UI',
        Roboto,
        sans-serif
      );
      color: var(--color-text-primary, #0f172a);
      background: var(--color-base, #ffffff);
      overflow: hidden;
      outline: none;
      transform: none;
    }

    /* ─── 頁首 ─── */
    .${r}__header {
      display: flex;
      flex: none;
      align-items: center;
      gap: var(--space-sm, 8px);
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }

    .${r}__title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-weight: var(--weight-semibold, 600);
      line-height: var(--leading-snug, 1.375);
      color: var(--color-text-primary, #0f172a);
      overflow-wrap: break-word;
    }

    .${r}__close {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin: 0 calc(var(--space-xs, 4px) * -1) 0 auto;
      padding: 0;
      color: var(--color-text-secondary, #475569);
      background: transparent;
      border: 0;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
      transition:
        background-color var(--transition-base, 150ms ease),
        color var(--transition-base, 150ms ease);
    }

    .${r}__close:hover {
      color: var(--color-text-primary, #0f172a);
      background: var(--color-surface, #f1f5f9);
    }

    .${r}__close:focus-visible {
      outline: 2px solid var(--color-brand-500, #1b6ca8);
      outline-offset: 2px;
    }

    .${r}__close svg {
      width: 18px;
      height: 18px;
    }

    /* ─── 內容 ─── */
    .${r}__body {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      font-size: var(--text-sm, 0.875rem);
      line-height: var(--leading-normal, 1.5);
      color: var(--color-text-secondary, #475569);
      overflow-wrap: break-word;
    }

    /* ─── 頁尾 ─── */
    .${r}__footer {
      display: flex;
      flex: none;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-sm, 8px);
      padding: var(--space-md, 16px) var(--space-lg, 24px);
      background: var(--color-surface, #f1f5f9);
      border-top: 1px solid var(--color-border, #e2e8f0);
    }

    /* 沒有內容的頁首與頁尾不顯示（須寫在頁首 / 頁尾的規則之後才能覆蓋 display） */
    .${r}__header--empty, .${r}__footer--empty {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .${r}__close {
        transition: none;
      }
    }
  `}function P(){return(P=e((()=>{o()})))()}export{C as a,M as i,P as n,w as o,j as r,N as t};