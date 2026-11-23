import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a,u as o}from"./lit-DvaG8Cmk.js";import{i as s,p as c,r as l,t as u,u as d,v as f}from"./decorate-B5jhCMz7.js";import{a as p,o as m}from"./modal-dialog.styles-B0wl-jrL.js";import{n as h,t as g}from"./pausable-timer-L0kEwjgo.js";import{t as _}from"./button-DdPjZonN.js";import{t as v}from"./input-BHHuKE4l.js";import{t as y}from"./modal-JdvM5j2M.js";var b;function x(){return(x=e((()=>{a(),b=t`
  :host {
    display: contents;
  }

  /* ─── 以 Modal 為外框：較窄、置中、無頁首頁尾 ─── */
  aui-modal::part(panel) {
    max-width: 440px;
  }

  aui-modal::part(body) {
    padding: var(--space-xl, 40px) var(--space-lg, 24px);
    text-align: center;
  }

  /* ─── 狀態圖示（SweetAlert2 風格：圓環與符號依序描繪） ─── */
  .alert__icon {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto var(--space-md, 16px);
    animation: alert-icon-bounce 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .alert__icon--success {
    color: var(--color-success, #10b981);
  }

  .alert__icon--error {
    color: var(--color-danger, #ef4444);
  }

  .alert__icon--warning {
    color: var(--color-warning, #f59e0b);
  }

  .alert__icon--info {
    color: var(--color-info, #0284c7);
  }

  .alert__icon svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* pathLength="1" 讓描繪動畫不必依賴實際路徑長度 */
  .alert__ring,
  .alert__glyph {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .alert__ring {
    animation: alert-draw 400ms ease-out both;
  }

  .alert__glyph {
    animation: alert-draw 300ms ease-out 250ms both;
  }

  /* ─── 文字 ─── */
  .alert__title {
    margin: 0 0 var(--space-xs, 4px);
    font-size: var(--text-xl, 1.25rem);
    font-weight: var(--weight-bold, 700);
    line-height: var(--leading-snug, 1.375);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: break-word;
  }

  .alert__message {
    margin: 0 0 var(--space-lg, 24px);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  .alert__message--empty {
    display: none;
  }

  .alert__input {
    margin-bottom: var(--space-lg, 24px);
    text-align: start;
  }

  .alert__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm, 8px);
  }

  @keyframes alert-icon-bounce {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    70% {
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes alert-draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  /* ─── 無障礙動態降級：直接顯示完成狀態 ─── */
  @media (prefers-reduced-motion: reduce) {
    .alert__icon,
    .alert__ring,
    .alert__glyph {
      animation: none;
    }
  }
`})))()}var S,C,w,T;function E(){return(E=e((()=>{a(),d(),l(),x(),m(),h(),_(),v(),y(),S={success:o`<path class="alert__glyph" pathLength="1" d="M15 27 L23 35 L38 19"></path>`,error:o`<path class="alert__glyph" pathLength="1" d="M18 18 L34 34 M34 18 L18 34"></path>`,warning:o`<path class="alert__glyph" pathLength="1" d="M26 14 V30 M26 37 V38"></path>`,info:o`<path class="alert__glyph" pathLength="1" d="M26 14 V15 M26 22 V38"></path>`},C={success:`成功`,error:`錯誤`,warning:`警告`,info:`資訊`},w={alert:`提示`,confirm:`確認`,prompt:`輸入`},T=class extends r{static{this.styles=b}constructor(){super(),this.open=!1,this.mode=`alert`,this.heading=``,this.message=``,this.confirmText=`確定`,this.cancelText=`取消`,this.destructive=!1,this.inputValue=``,this.inputPlaceholder=``,this.inputLabel=``,this.closeOnBackdrop=!0,this.timer=0,this.decision=null,this.autoClose=new g(()=>this.closeByTimer()),this.syncing=Promise.resolve(),this.handleModalAfterHide=e=>{if(e.composedPath()[0]!==this.modal)return;let{reason:t}=e.detail,n=this.decision??{confirmed:!1,reason:t===`escape`||t===`backdrop`?t:`api`};this.decision=null,this.open=!1,n.confirmed?this.dispatchEvent(new CustomEvent(`aui-confirm`,{detail:{value:n.value},bubbles:!0,composed:!0})):this.dispatchEvent(new CustomEvent(`aui-cancel`,{detail:{reason:n.reason},bubbles:!0,composed:!0}))},this.handlePointerOver=e=>{this.isInPanel(e)?this.autoClose.pause():this.autoClose.resume()},this.handlePointerDown=e=>{this.isInPanel(e)&&this.autoClose.stop()},this.handleKeyDown=e=>{if(this.autoClose.stop(),e.key!==`Enter`)return;if(e.repeat){e.preventDefault();return}if(e.isComposing||e.keyCode===229)return;let t=e.composedPath()[0];t instanceof HTMLButtonElement||t instanceof HTMLTextAreaElement||(e.preventDefault(),this.confirm())},this.handleConfirmClick=()=>{this.confirm()},this.handleCancelClick=()=>{this.cancel()},this.addEventListener(`aui-after-hide`,this.handleModalAfterHide)}disconnectedCallback(){super.disconnectedCallback(),this.autoClose.stop()}async show(){this.open=!0,await this.transitionEnd()}async hide(){this.open=!1,await this.transitionEnd()}async transitionEnd(){if(!this.isConnected)return;let e=!1;for(;!e;)e=await this.updateComplete;let t=this.modal;t&&await(t.open?t.show():t.hide())}async getUpdateComplete(){let e=await super.getUpdateComplete();return await this.syncing,e&&!this.isUpdatePending}confirm(){this.open&&=(this.decision={confirmed:!0,value:this.mode===`prompt`?this.input?.value??``:``},!1)}cancel(){this.open&&=(this.decision={confirmed:!1,reason:`cancel-button`},!1)}updated(e){this.syncing=this.syncModal(e)}async syncModal(e){if(this.modal&&(e.has(`timer`)&&!e.has(`open`)&&this.open&&this.modal.open&&this.autoClose.start(this.timer),e.has(`open`))){if(this.open&&!this.modal.open){if(!this.isConnected){this.open=!1;return}this.decision=null,this.input&&(this.input.value=this.inputValue),this.modal.open=!0,await this.modal.updateComplete,this.modal.open?this.autoClose.start(this.timer):this.open=!1}else!this.open&&this.modal.open&&(this.autoClose.stop(),this.decision??={confirmed:!1,reason:`api`},this.modal.open=!1,await this.modal.updateComplete,this.modal.open&&(this.decision=null,this.open=!0))}}closeByTimer(){this.open&&this.modal.open&&(this.decision={confirmed:!1,reason:`timer`},this.open=!1)}isInPanel(e){return e.composedPath().some(e=>e instanceof HTMLElement&&e.getAttribute(`part`)===`panel`)}get accessibleName(){let e=this.icon?C[this.icon]:``;return this.heading?e?`${e}：${this.heading}`:this.heading:e||w[this.mode]}renderIcon(){return!this.icon||!S[this.icon]?n:i`
      <span part="icon" class="alert__icon alert__icon--${this.icon}" aria-hidden="true">
        <svg
          viewBox="0 0 52 52"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle class="alert__ring" pathLength="1" cx="26" cy="26" r="24"></circle>
          ${S[this.icon]}
        </svg>
      </span>
    `}render(){let e=this.mode!==`alert`,t=this.mode!==`prompt`&&!this.destructive,r=this.mode!==`prompt`&&this.destructive;return i`
      <aui-modal
        size="sm"
        dialog-role="alertdialog"
        no-close-button
        .label=${this.accessibleName}
        .description=${this.message}
        .closeOnBackdrop=${this.closeOnBackdrop}
        @keydown=${this.handleKeyDown}
        @pointerover=${this.handlePointerOver}
        @pointerdown=${this.handlePointerDown}
      >
        ${this.renderIcon()}
        ${this.heading?i`<h2 part="title" class="alert__title">${this.heading}</h2>`:n}
        <p
          part="message"
          class=${s({alert__message:!0,"alert__message--empty":!this.message})}
        >
          ${this.message}
        </p>
        <slot></slot>
        ${this.mode===`prompt`?i`
                <aui-input
                  part="input"
                  class="alert__input"
                  .value=${this.inputValue}
                  .placeholder=${this.inputPlaceholder}
                  .label=${this.inputLabel||this.heading||w.prompt}
                  autofocus
                ></aui-input>
              `:n}
        <div part="actions" class="alert__actions">
          ${e?i`
                  <aui-button
                    part="cancel-button"
                    variant="ghost"
                    ?autofocus=${r}
                    @click=${this.handleCancelClick}
                    >${this.cancelText}</aui-button
                  >
                `:n}
          <aui-button
            part="confirm-button"
            variant=${this.destructive?`danger`:`primary`}
            ?autofocus=${t}
            @click=${this.handleConfirmClick}
            >${this.confirmText}</aui-button
          >
        </div>
      </aui-modal>
    `}},u([c(`aui-modal`)],T.prototype,`modal`,void 0),u([c(`aui-input`)],T.prototype,`input`,void 0),u([f({type:Boolean,reflect:!0})],T.prototype,`open`,void 0),u([f({type:String,reflect:!0})],T.prototype,`mode`,void 0),u([f({type:String,reflect:!0})],T.prototype,`icon`,void 0),u([f({type:String})],T.prototype,`heading`,void 0),u([f({type:String})],T.prototype,`message`,void 0),u([f({type:String,attribute:`confirm-text`})],T.prototype,`confirmText`,void 0),u([f({type:String,attribute:`cancel-text`})],T.prototype,`cancelText`,void 0),u([f({type:Boolean,reflect:!0})],T.prototype,`destructive`,void 0),u([f({type:String,attribute:`input-value`})],T.prototype,`inputValue`,void 0),u([f({type:String,attribute:`input-placeholder`})],T.prototype,`inputPlaceholder`,void 0),u([f({type:String,attribute:`input-label`})],T.prototype,`inputLabel`,void 0),u([f({attribute:`close-on-backdrop`,converter:p})],T.prototype,`closeOnBackdrop`,void 0),u([f({type:Number})],T.prototype,`timer`,void 0),customElements.get(`aui-alert`)||customElements.define(`aui-alert`,T)})))()}function D(e,t){let n=document.createElement(`aui-alert`);return n.mode=e,n.heading=t.title??``,n.message=t.message??``,t.icon&&(n.icon=t.icon),t.confirmText&&(n.confirmText=t.confirmText),t.cancelText&&(n.cancelText=t.cancelText),n.destructive=t.destructive??!1,n.closeOnBackdrop=t.closeOnBackdrop??!0,n.inputValue=t.defaultValue??``,n.inputPlaceholder=t.placeholder??``,n.inputLabel=t.inputLabel??``,n.timer=t.timer??0,new Promise(e=>{let t=!1,r=r=>{t||(t=!0,n.remove(),e(r))};n.addEventListener(`aui-confirm`,e=>{r({confirmed:!0,value:e.detail.value})}),n.addEventListener(`aui-cancel`,()=>r({confirmed:!1,value:``})),document.body.appendChild(n),n.open=!0,(async()=>{let e=!1;for(;!e;)e=await n.updateComplete;n.open||r({confirmed:!1,value:``})})()})}var O,k;function A(){return(A=e((()=>{E(),O=e=>typeof e==`string`?{message:e}:e,k={async alert(e){await D(`alert`,O(e))},async confirm(e){return(await D(`confirm`,O(e))).confirmed},async prompt(e){let t=await D(`prompt`,O(e));return t.confirmed?t.value:null}}})))()}export{A as n,E as r,k as t};