import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{c as t,h as n,i as r,m as i,n as a,s as o,t as s}from"./lit-DvaG8Cmk.js";import{a as c,i as l}from"./iframe-ClyznfeB.js";import{c as u,g as d,i as f,o as p,r as m,s as h,t as g,u as _,v}from"./decorate-B5jhCMz7.js";import{n as ee,t as te}from"./pausable-timer-L0kEwjgo.js";import{n as y,r as b,t as x}from"./spinner-D5wD4gSs.js";import{a as S,d as C,i as w,l as T,n as E,o as D,s as O,t as k}from"./top-layer-BK5O3D4l.js";import{n as A}from"./transition-B7KgZIOq.js";import{n as j,r as ne,t as re}from"./status-icons-DHpDVKuy.js";var M;function N(){return(N=e((()=>{t(),u(),l(),M=p(class extends h{constructor(){super(...arguments),this.key=r}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(c(e),this.key=t),n}})})))()}function P(){return(P=e((()=>{N()})))()}var F,I;function L(){return(L=e((()=>{s(),F=n`
  :host {
    display: block;
    pointer-events: auto;
  }

  :host([hidden]) {
    display: none !important;
  }

  .toast {
    display: flex;
    align-items: flex-start;
    gap: var(--space-ms, 12px);
    box-sizing: border-box;
    width: 100%;
    padding: 12px 14px;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    text-align: start;
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    box-shadow: var(--shadow-toast, 0 10px 25px -5px rgb(0 0 0 / 15%));
    animation: toast-slide-in 220ms cubic-bezier(0.16, 1, 0.3, 1);
    transition:
      opacity 150ms ease-in,
      transform 150ms ease-in;
  }

  /* 已完成進場：之後被移動（例如隨 Modal 移入其子樹）時不再重播進場動畫 */
  .toast--entered {
    animation: none;
  }

  /* 退場：淡出並往螢幕邊緣滑出（方向由 Viewport 提供；單獨使用時往右） */
  :host([leaving]) .toast {
    opacity: 0;
    transform: translate(var(--_aui-toast-exit-x, 16px), var(--_aui-toast-exit-y, 0)) scale(0.97);
  }

  /* ─── 狀態圖示 ─── */
  .toast__icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    height: calc(var(--leading-normal, 1.5) * 1em);
  }

  .toast__icon svg {
    width: 18px;
    height: 18px;
  }

  .toast--success .toast__icon {
    color: var(--color-success-text, #047857);
  }

  .toast--error .toast__icon {
    color: var(--color-danger, #ef4444);
  }

  .toast--warning .toast__icon {
    color: var(--color-warning, #f59e0b);
  }

  .toast--info .toast__icon {
    color: var(--color-info, #0284c7);
  }

  .toast--loading .toast__icon {
    color: var(--color-brand-600, #0f4c81);
  }

  /* ─── 內容（live region） ─── */
  .toast__content {
    flex: 1;
    min-width: 0;
    overflow-wrap: break-word;
  }

  .toast__title {
    font-weight: var(--weight-semibold, 600);
    color: var(--color-text-primary, #0f172a);
  }

  .toast__title + .toast__message {
    color: var(--color-text-secondary, #475569);
  }

  /* ─── 關閉鈕 ─── */
  .toast__close {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: -1px -4px 0 0;
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

  .toast__close:hover {
    color: var(--color-text-primary, #0f172a);
    background: var(--color-surface, #f1f5f9);
  }

  .toast__close:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .toast__close svg {
    width: 16px;
    height: 16px;
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

  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: translateY(var(--_aui-toast-enter-y, 12px)) scale(0.95);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toast {
      animation: none;
      transition: none;
    }
  }
`,I=n`
  :host {
    --_aui-toast-edge: var(--space-lg, 24px);
    --_aui-toast-width: min(380px, calc(100vw - 32px));

    position: fixed;
    display: flex;
    gap: var(--space-sm, 8px);
    box-sizing: border-box;
    width: var(--_aui-toast-width);
    max-height: calc(100dvh - 2 * var(--_aui-toast-edge));
    margin: 0;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    overflow: visible;
    pointer-events: none;
  }

  :host(:not(:popover-open)) {
    display: none;
  }

  :host,
  :host([data-placement^='bottom']) {
    top: auto;
    bottom: var(--_aui-toast-edge);
    flex-direction: column;
    justify-content: flex-end;

    --_aui-toast-enter-y: 12px;
  }

  :host([data-placement^='top']) {
    top: var(--_aui-toast-edge);
    bottom: auto;
    flex-direction: column-reverse;
    justify-content: flex-end;

    --_aui-toast-enter-y: -12px;
  }

  :host,
  :host([data-placement$='right']) {
    right: var(--_aui-toast-edge);
    left: auto;

    --_aui-toast-exit-x: 16px;
    --_aui-toast-exit-y: 0px;
  }

  :host([data-placement$='left']) {
    right: auto;
    left: var(--_aui-toast-edge);

    --_aui-toast-exit-x: -16px;
    --_aui-toast-exit-y: 0px;
  }

  :host([data-placement$='center']) {
    right: auto;
    left: calc((100% - var(--_aui-toast-width)) / 2);

    --_aui-toast-exit-x: 0px;
  }

  :host([data-placement='top-center']) {
    --_aui-toast-exit-y: -12px;
  }

  :host([data-placement='bottom-center']) {
    --_aui-toast-exit-y: 12px;
  }

  @media (max-width: 480px), (max-height: 480px) and (orientation: landscape) {
    :host,
    :host([data-placement]) {
      --_aui-toast-edge: var(--space-md, 16px);

      top: max(var(--_aui-toast-edge), env(safe-area-inset-top, 0px));
      right: auto;
      bottom: auto;
      left: calc((100% - var(--_aui-toast-width)) / 2);
      flex-direction: column-reverse;
      justify-content: flex-end;

      --_aui-toast-enter-y: -12px;
      --_aui-toast-exit-x: 0px;
      --_aui-toast-exit-y: -12px;
    }
  }

  @media (max-width: 480px) {
    :host,
    :host([data-placement]) {
      right: var(--_aui-toast-edge);
      left: var(--_aui-toast-edge);
      width: auto;
    }
  }
`})))()}var R,z;function B(){return(B=e((()=>{s(),_(),m(),P(),L(),x(),ne(),R=new Set([`success`,`error`,`warning`,`info`,`loading`]),z=class extends a{constructor(...e){super(...e),this.variant=`info`,this.heading=``,this.message=``,this.noCloseButton=!1,this.leaving=!1,this.announced=!1,this.entered=!1,this.announceScheduled=!1,this.handleAnimationEnd=e=>{e.target===e.currentTarget&&(this.entered=!0)},this.handleClose=()=>{this.dispatchEvent(new CustomEvent(`aui-close`,{bubbles:!0,composed:!0}))}}static{this.styles=[b,F]}connectedCallback(){super.connectedCallback(),this.announced||this.announceScheduled||(this.announceScheduled=!0,requestAnimationFrame(()=>requestAnimationFrame(()=>{this.announced=!0})))}get resolvedVariant(){return R.has(this.variant)?this.variant:`info`}renderContent(e){if(!this.announced)return r;let t=e===`loading`?`載入中`:j[e];return o`
      <span class="sr-only">${t}：</span>
      ${this.heading?o`<div part="title" class="toast__title">${this.heading}</div>`:r}
      <div part="message" class="toast__message">${this.message}<slot></slot></div>
    `}render(){let e=this.resolvedVariant,t=e===`error`?`alert`:`status`;return o`
      <div
        part="base"
        class=${f({toast:!0,[`toast--${e}`]:!0,"toast--entered":this.entered})}
        @animationend=${this.handleAnimationEnd}
      >
        <span part="icon" class="toast__icon" aria-hidden="true">
          ${e===`loading`?y:re[e]}
        </span>
        ${M(t,o`
              <div part="content" class="toast__content" role=${t} aria-atomic="true">
                ${this.renderContent(e)}
              </div>
            `)}
        ${this.noCloseButton?r:o`
                <button
                  part="close-button"
                  class="toast__close"
                  type="button"
                  aria-label="關閉通知"
                  @click=${this.handleClose}
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
    `}},g([v({type:String,reflect:!0})],z.prototype,`variant`,void 0),g([v({type:String})],z.prototype,`heading`,void 0),g([v({type:String})],z.prototype,`message`,void 0),g([v({type:Boolean,attribute:`no-close-button`})],z.prototype,`noCloseButton`,void 0),g([v({type:Boolean,reflect:!0})],z.prototype,`leaving`,void 0),g([d()],z.prototype,`announced`,void 0),g([d()],z.prototype,`entered`,void 0),customElements.get(`aui-toast`)||customElements.define(`aui-toast`,z)})))()}var V,H,U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{s(),L(),ee(),S(),B(),V={success:3e3,info:4e3,warning:5e3,error:6e3,loading:0},H=3,U=50,W=`bottom-right`,G=new Set([`top-left`,`top-center`,`top-right`,`bottom-left`,`bottom-center`,`bottom-right`]),K=e=>typeof e==`string`&&G.has(e),q=e=>typeof e==`string`&&Object.hasOwn(V,e),J=e=>typeof e==`number`&&e>=0,Y=class{constructor(){this.viewport=null,this.entries=new Map,this.order=[],this.maxVisible=H,this.maxQueued=U,this.durations={...V},this.placement=W,this.hovering=!1,this.lastPointer=null,this.focused=!1,this.nextId=0}configure(e){let{maxVisible:t,maxQueued:n,durations:r,placement:i}=e;K(i)&&this.setPlacement(i),typeof t==`number`&&Number.isFinite(t)&&(this.maxVisible=Math.max(1,Math.floor(t))),typeof n==`number`&&n>=0&&(this.maxQueued=Math.floor(n));for(let[e,t]of Object.entries(r??{}))q(e)&&J(t)&&(this.durations[e]=t);this.flush(),this.trimQueue()}resetConfig(){this.maxVisible=H,this.maxQueued=U,this.durations={...V},this.setPlacement(W)}setPlacement(e){this.placement=e;let t=this.viewport;t&&t.getAttribute(`data-placement`)!==e&&(t.setAttribute(`data-placement`,e),this.hovering=this.isPointerOverToast(),this.syncPause())}show(e){if(typeof document>`u`)return{id:e.id??`aui-toast-${++this.nextId}`,update:()=>{},close:()=>{},closed:Promise.resolve()};let t=e.id?this.entries.get(e.id):void 0;if(t&&t.state!==`leaving`)return this.update(t,e),t.handle;let n=e.id??`aui-toast-${++this.nextId}`,r=document.createElement(`aui-toast`),i,a=new Promise(e=>i=e),o={id:n,element:r,timer:new te(()=>this.close(o)),handle:{id:n,update:e=>this.update(o,e),close:()=>this.close(o),closed:a},duration:0,state:`queued`,resolveClosed:i};return this.apply(o,{...e,variant:e.variant??`info`}),this.entries.set(n,o),this.order.push(o),this.flush(),this.trimQueue(),o.handle}updateById(e,t){let n=this.entries.get(e);n&&n.state!==`leaving`&&this.update(n,t)}closeById(e){let t=this.entries.get(e);t&&this.close(t)}async closeAll(){let e=[...this.order];for(let t of e)this.close(t);await Promise.all(e.map(e=>e.handle.closed))}update(e,t){this.apply(e,t),e.state===`visible`&&this.startTimer(e)}apply(e,t){let{element:n}=e,r=t.variant===void 0?void 0:q(t.variant)?t.variant:`info`;r!==void 0&&(n.variant=r),t.title!==void 0&&(n.heading=t.title),t.message!==void 0&&(n.message=t.message),t.noCloseButton!==void 0&&(n.noCloseButton=t.noCloseButton),J(t.duration)?e.duration=t.duration:r!==void 0&&(e.duration=this.durations[r])}close(e){e.state!==`leaving`&&(e.timer.stop(),e.state===`queued`?this.finalize(e):(e.state=`leaving`,e.element.leaving=!0,e.element.updateComplete.then(()=>{let t=e.element.shadowRoot?.querySelector(`[part="base"]`);window.setTimeout(()=>{e.element.remove(),this.finalize(e)},t?A(t):0)}),this.flush()))}finalize(e){let t=this.order.indexOf(e);t!==-1&&this.order.splice(t,1),this.entries.get(e.id)===e&&this.entries.delete(e.id),e.resolveClosed();let n=this.viewport;n&&!n.querySelector(`aui-toast`)&&D(n)&&n.hidePopover(),this.refreshPause(),this.flush()}refreshPause(){let e=this.viewport;e&&(this.hovering=this.isPointerOverToast(),this.focused=e.matches(`:focus-within`),this.syncPause())}trimQueue(){let e=this.order.filter(e=>e.state===`queued`),t=e.length-this.maxQueued;for(let n of e.slice(0,Math.max(0,t)))this.close(n)}flush(){let e=this.order.filter(e=>e.state===`visible`).length;for(let t of this.order){if(e>=this.maxVisible)break;t.state===`queued`&&(this.mount(t),e++)}}mount(e){let t=this.ensureViewport();e.state=`visible`,t.appendChild(e.element),typeof t.showPopover==`function`&&(D(t)||t.showPopover(),T(t)),this.startTimer(e)}startTimer(e){e.timer.start(e.duration),this.paused&&e.timer.pause()}isPointerOverToast(){let e=this.viewport;if(!this.hovering||!e||!this.lastPointer)return!1;let t=e.getRootNode().elementFromPoint(this.lastPointer.x,this.lastPointer.y);return!!(t&&t!==e&&e.contains(t))}get paused(){return this.hovering||this.focused||document.visibilityState===`hidden`}syncPause(){let e=this.paused;for(let t of this.order)t.state===`visible`&&(e?t.timer.pause():t.timer.resume())}ensureViewport(){if(this.viewport){if(!this.viewport.isConnected){let e=w();e&&(this.viewport.slot=k),(e??document.body).appendChild(this.viewport),this.refreshPause()}return this.viewport}let e=document.createElement(`div`);e.setAttribute(`popover`,`manual`),e.setAttribute(`role`,`region`),e.setAttribute(`aria-label`,`通知`),e.setAttribute(`data-aui-toast-viewport`,``),e.setAttribute(`data-placement`,this.placement);let t=e.attachShadow({mode:`open`});return i(t,[I]),t.appendChild(document.createElement(`slot`)),e.addEventListener(`aui-close`,e=>{let t=this.order.find(t=>t.element===e.target);t&&this.close(t)}),e.addEventListener(`pointerover`,e=>{this.hovering=!0,this.lastPointer={x:e.clientX,y:e.clientY},this.syncPause()}),e.addEventListener(`pointerout`,t=>{let n=t.relatedTarget;n&&e.contains(n)||(this.hovering=!1,this.syncPause())}),e.addEventListener(`focusin`,()=>{this.focused=!0,this.syncPause()}),e.addEventListener(`focusout`,t=>{let n=t.relatedTarget;n&&e.contains(n)||(this.focused=!1,this.syncPause())}),document.addEventListener(`visibilitychange`,()=>this.syncPause()),this.viewport=e,document.body.appendChild(e),E(e,{slot:k}),O(()=>this.refreshPause()),e}},X=C(`toast@1`,()=>new Y),Z={show(e){return X.show(e)},success(e,t={}){return X.show({...t,message:e,variant:`success`})},error(e,t={}){return X.show({...t,message:e,variant:`error`})},warning(e,t={}){return X.show({...t,message:e,variant:`warning`})},info(e,t={}){return X.show({...t,message:e,variant:`info`})},loading(e,t={}){return X.show({...t,message:e,variant:`loading`})},update(e,t){X.updateById(e,t)},close(e){X.closeById(e)},closeAll(){return X.closeAll()},configure(e){X.configure(e)},resetConfig(){X.resetConfig()}}})))()}function $(){return($=e((()=>{B(),Q()})))()}export{Z as n,Q as r,$ as t};