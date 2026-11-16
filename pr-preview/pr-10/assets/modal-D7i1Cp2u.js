import{h as e,i as t,n,s as r,t as i}from"./lit-MXP2jLr5.js";import{f as a,i as o,m as s,r as c,t as l,u}from"./decorate-BSUctFxX.js";import{t as d}from"./query-jFZ5EnhK.js";import{r as f,t as p}from"./if-defined-BrPPiKvf.js";import{a as m,c as h,r as g,t as _}from"./top-layer-D9FIDDvl.js";import{n as v}from"./transition-Dn7zseV4.js";import{t as y}from"./rolldown-runtime-Dh6celcD.js";var b;function x(){return(x=y((()=>{b={fromAttribute:e=>e!==`false`,toAttribute:e=>e?null:`false`}})))()}var S;function C(){return(C=y((()=>{i(),S=e`
  :host {
    display: contents;
  }

  /*
   * ─── dialog：撐滿整個視窗的透明層，面板置中 ───
   * 點擊面板以外的區域即為點擊遮罩（事件目標皆為 dialog 本身）
   */
  .modal {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: var(--space-md, 16px);
    color: inherit;
    background: transparent;
    border: 0;
    overflow: hidden;
  }

  .modal[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /*
   * 進場以 @starting-style 定義起始狀態：showModal() 讓 dialog 從 display: none 開始渲染時，
   * 瀏覽器自動從起始樣式轉場到一般樣式，不需要 JS 延後一幀切換 class。
   * 退場則由元件加上 .modal--leaving，轉場結束後才 close()。
   */

  /* ─── 遮罩：模糊背景，淡入淡出 ─── */
  .modal::backdrop {
    background: var(--color-backdrop, rgb(15 23 42 / 65%));
    backdrop-filter: blur(4px);
    opacity: 1;
    transition: opacity 180ms ease-out;
  }

  .modal--leaving::backdrop {
    opacity: 0;
  }

  @starting-style {
    .modal[open]::backdrop {
      opacity: 0;
    }
  }

  /* ─── 面板：縮放彈出 ─── */
  .modal__panel {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    max-height: 100%;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-xl, 16px);
    box-shadow: var(--shadow-modal, 0 25px 50px -12px rgb(0 0 0 / 35%));
    overflow: hidden;
    outline: none;
    opacity: 1;
    transform: none;
    transition:
      opacity 180ms ease-out,
      transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal--leaving .modal__panel {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }

  @starting-style {
    .modal[open] .modal__panel {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
  }

  .modal__panel--sm {
    max-width: 420px;
  }

  .modal__panel--md {
    max-width: 600px;
  }

  .modal__panel--lg {
    max-width: 840px;
  }

  /* ─── 頁首 ─── */
  .modal__header {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--space-sm, 8px);
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    border-bottom: 1px solid var(--color-border, #e2e8f0);
  }

  .modal__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: var(--text-lg, 1.125rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: break-word;
  }

  .modal__close {
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

  .modal__close:hover {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  .modal__close:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .modal__close svg {
    width: 18px;
    height: 18px;
  }

  /* ─── 內容 ─── */
  .modal__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--space-lg, 24px);
    overflow-y: auto;
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
  }

  /* ─── 頁尾 ─── */
  .modal__footer {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-sm, 8px);
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    background: var(--color-surface, #f1f5f9);
    border-top: 1px solid var(--color-border, #e2e8f0);
  }

  /* ─── 螢幕閱讀器專用文字（description） ─── */
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

  /* 沒有內容的頁首與頁尾不顯示（須寫在 .modal__header / .modal__footer 之後才能覆蓋 display） */
  .modal__header--empty,
  .modal__footer--empty {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .modal::backdrop,
    .modal__panel,
    .modal__close {
      transition: none;
    }

    .modal__panel {
      transform: none;
    }
  }
`})))()}function w(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function T(){let e=w();return()=>{e&&e!==document.body&&e.isConnected&&e.focus?.()}}function E(){let e=document.documentElement;if(D.count===0){let t=window.innerWidth-e.clientWidth,n=getComputedStyle(e).scrollbarGutter.includes(`stable`);if(D.saved={overflow:e.style.overflow,paddingRight:e.style.paddingRight},t>0&&!n){let n=parseFloat(getComputedStyle(e).paddingRight)||0;e.style.paddingRight=`${n+t}px`}e.style.overflow=`hidden`}D.count++;let t=!1;return()=>{t||(t=!0,D.count=Math.max(0,D.count-1),D.count===0&&D.saved&&(e.style.overflow=D.saved.overflow,e.style.paddingRight=D.saved.paddingRight,D.saved=null))}}var D;function O(){return(O=y((()=>{D=h(`scroll-lock@1`,()=>({count:0,saved:null}))})))()}var k;function A(){return(A=y((()=>{i(),u(),c(),p(),C(),x(),O(),g(),k=class extends n{constructor(...e){super(...e),this.open=!1,this.size=`md`,this.heading=``,this.label=``,this.description=``,this.dialogRole=`dialog`,this.closeOnEscape=!0,this.closeOnBackdrop=!0,this.noCloseButton=!1,this.isLeaving=!1,this.hasHeaderSlot=!1,this.hasFooterSlot=!1,this.isShown=!1,this.transitionId=0,this.transitionSettled=Promise.resolve(),this.settleTransition=()=>{},this.pendingReason=`api`,this.hidingReason=`api`,this.pointerDownOnBackdrop=!1,this.releaseScroll=null,this.restoreFocus=null,this.popLayer=null,this.handleCancel=e=>{e.preventDefault(),this.closeOnEscape&&this.requestClose(`escape`)},this.handleNativeClose=()=>{if(this.dialog.open||!this.isShown&&!this.open)return;this.beginTransition();let e=this.isShown;this.isShown=!1,this.isLeaving=!1,this.open=!1,e&&this.dispatchEvent(new CustomEvent(`aui-hide`,{detail:{reason:`escape`},bubbles:!0,composed:!0})),this.releaseResources({restoreFocus:!0}),this.dispatchAfterHide(`escape`),this.settleTransition()},this.handlePointerDown=e=>{this.pointerDownOnBackdrop=e.target===this.dialog},this.handleClick=e=>{let t=this.pointerDownOnBackdrop&&e.target===this.dialog;this.pointerDownOnBackdrop=!1,t&&this.closeOnBackdrop&&this.requestClose(`backdrop`)},this.handleCloseButton=()=>{this.requestClose(`close-button`)},this.handleSlotChange=e=>{let t=e.target,n=t.assignedNodes({flatten:!0}).length>0;t.name===`header`?this.hasHeaderSlot=n:t.name===`footer`&&(this.hasFooterSlot=n)}}static{this.styles=S}async show(){this.open=!0,await this.transitionEnd()}async hide(){this.requestClose(`api`),await this.transitionEnd()}async transitionEnd(){if(!this.isConnected)return;let e=!1;for(;!e;)e=await this.updateComplete;await this.transitionSettled}beginTransition(){return this.settleTransition(),this.transitionSettled=new Promise(e=>this.settleTransition=e),++this.transitionId}disconnectedCallback(){if(super.disconnectedCallback(),!this.isShown&&!this.dialog?.open)return;let e=this.isShown,t=e?this.pendingReason:this.hidingReason;this.pendingReason=`api`,this.beginTransition(),this.isShown=!1,this.isLeaving=!1,this.open=!1,this.dialog.close(),this.releaseResources({restoreFocus:!1}),e&&this.dispatchEvent(new CustomEvent(`aui-hide`,{detail:{reason:t},bubbles:!0,composed:!0})),this.dispatchAfterHide(t),this.settleTransition()}requestClose(e){this.open&&=(this.pendingReason=e,!1)}willUpdate(){if(!this.hasUpdated){let e=[...this.children].map(e=>e.slot);this.hasHeaderSlot=e.includes(`header`),this.hasFooterSlot=e.includes(`footer`)}}updated(e){if(!e.has(`open`))return;let t=this.pendingReason;this.pendingReason=`api`,this.open&&!this.isShown?this.startShow():!this.open&&this.isShown&&this.startHide(t)}startShow(){if(!this.isConnected){this.open=!1;return}let e=new CustomEvent(`aui-show`,{bubbles:!0,composed:!0,cancelable:!0});if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}let t=this.dialog.open;if(!t){let e=T(),t=E();try{this.dialog.showModal()}catch(e){throw t(),this.open=!1,e}this.restoreFocus=e,this.releaseScroll=t,this.popLayer=m(this)}let n=this.beginTransition();this.isShown=!0,t||this.applyInitialFocus(n),this.isLeaving=!1,this.updateComplete.then(()=>{window.setTimeout(()=>{n===this.transitionId&&(this.dispatchEvent(new CustomEvent(`aui-after-show`,{bubbles:!0,composed:!0})),this.settleTransition())},v(this.panel))})}startHide(e){let t=new CustomEvent(`aui-hide`,{detail:{reason:e},bubbles:!0,composed:!0,cancelable:!0});if(this.dispatchEvent(t),t.defaultPrevented){this.open=!0;return}let n=this.beginTransition();this.isShown=!1,this.isLeaving=!0,this.hidingReason=e,this.updateComplete.then(()=>{window.setTimeout(()=>{n===this.transitionId&&(this.dialog.close(),this.isLeaving=!1,this.releaseResources({restoreFocus:!0}),this.dispatchAfterHide(e),this.settleTransition())},v(this.panel))})}applyInitialFocus(e){let t=[...this.querySelectorAll(`[autofocus]`)].find(e=>e.closest(`aui-modal`)===this);if(!t){this.panel.focus();return}t.focus();let n=t.updateComplete;n&&!t.matches(`:focus-within`)&&(this.panel.focus(),n.then(()=>{e===this.transitionId&&this.isShown&&t.focus()}))}releaseResources({restoreFocus:e}){this.popLayer?.(),this.releaseScroll?.(),e&&this.restoreFocus?.(),this.popLayer=this.releaseScroll=this.restoreFocus=null}dispatchAfterHide(e){this.dispatchEvent(new CustomEvent(`aui-after-hide`,{detail:{reason:e},bubbles:!0,composed:!0}))}render(){let e=!!this.heading||this.hasHeaderSlot,n=!this.heading&&this.label?this.label:void 0;return r`
      <dialog
        part="dialog"
        class=${o({modal:!0,"modal--leaving":this.isLeaving})}
        aria-labelledby=${f(this.heading?`title`:void 0)}
        aria-label=${f(n)}
        aria-describedby=${f(this.description?`description`:void 0)}
        role=${f(this.dialogRole===`alertdialog`?`alertdialog`:void 0)}
        @cancel=${this.handleCancel}
        @close=${this.handleNativeClose}
        @pointerdown=${this.handlePointerDown}
        @click=${this.handleClick}
      >
        <div part="panel" class="modal__panel modal__panel--${this.size}" tabindex="-1">
          <div
            part="header"
            class=${o({modal__header:!0,"modal__header--empty":!e})}
          >
            ${this.heading?r`<h2 part="title" id="title" class="modal__title">${this.heading}</h2>`:t}
            <slot name="header" @slotchange=${this.handleSlotChange}></slot>
            ${this.noCloseButton?t:r`
                    <button
                      part="close-button"
                      class="modal__close"
                      type="button"
                      aria-label="關閉"
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
                  `}
          </div>
          <div part="body" class="modal__body">
            <slot></slot>
          </div>
          <div
            part="footer"
            class=${o({modal__footer:!0,"modal__footer--empty":!this.hasFooterSlot})}
          >
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
        <slot name=${_}></slot>
        ${this.description?r`<span id="description" class="sr-only">${this.description}</span>`:t}
      </dialog>
    `}},l([d(`dialog`)],k.prototype,`dialog`,void 0),l([d(`.modal__panel`)],k.prototype,`panel`,void 0),l([s({type:Boolean,reflect:!0})],k.prototype,`open`,void 0),l([s({type:String,reflect:!0})],k.prototype,`size`,void 0),l([s({type:String})],k.prototype,`heading`,void 0),l([s({type:String})],k.prototype,`label`,void 0),l([s({type:String})],k.prototype,`description`,void 0),l([s({type:String,attribute:`dialog-role`})],k.prototype,`dialogRole`,void 0),l([s({attribute:`close-on-escape`,converter:b})],k.prototype,`closeOnEscape`,void 0),l([s({attribute:`close-on-backdrop`,converter:b})],k.prototype,`closeOnBackdrop`,void 0),l([s({type:Boolean,attribute:`no-close-button`})],k.prototype,`noCloseButton`,void 0),l([a()],k.prototype,`isLeaving`,void 0),l([a()],k.prototype,`hasHeaderSlot`,void 0),l([a()],k.prototype,`hasFooterSlot`,void 0),customElements.get(`aui-modal`)||customElements.define(`aui-modal`,k)})))()}function j(){return(j=y((()=>{A()})))()}export{b as n,x as r,j as t};