import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{g as o,i as s,r as c,t as l,u,v as d}from"./decorate-B5jhCMz7.js";import{r as f,t as p}from"./if-defined-BTZAmkBp.js";import{t as m}from"./icon-button-CYg_hecX.js";var h;function g(){return(g=e((()=>{a(),h=t`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 標題列：左側標題、右側快捷操作鈕 ─── */
  .field__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm, 8px);
    min-height: 32px; /* 保持包含操作鈕時高度一致，避免晃動 */
    margin-bottom: var(--space-xs, 4px);
  }

  .field__head--empty {
    display: none;
  }

  .field__label {
    display: block;
    min-width: 0;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-normal, 1.5);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
    transition: color var(--transition-theme, 200ms ease);
  }

  .field__actions {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: var(--space-xs, 4px);
    margin-left: auto;
  }

  /* ─── 次要描述 ─── */
  .field__description {
    margin-top: var(--space-xs, 4px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: break-word;
    transition: color var(--transition-theme, 200ms ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .field__label,
    .field__description {
      transition: none;
    }
  }
`})))()}function _(e){for(let t=e.closest(`fieldset`);t;t=t.parentElement?.closest(`fieldset`)??null)if(t.disabled&&!t.querySelector(`:scope > legend`)?.contains(e))return!0;return!1}var v,y,b,x;function S(){return(S=e((()=>{a(),u(),c(),p(),g(),m(),v=new Set([`aui-input`,`aui-output`,`aui-segmented`]),y=e=>customElements.get(e.localName)!==void 0,b=e=>e?.localName===`aui-input`,x=class extends r{constructor(...e){super(...e),this.label=``,this.description=``,this.copyable=!1,this.clearable=!1,this.copyLabel=`複製`,this.copiedLabel=`已複製！`,this.clearLabel=`清除`,this.control=null,this.clearDisabled=!0,this.hasSlottedActions=!1,this.controlObserver=new MutationObserver(()=>this.syncClearDisabled()),this.handleDefaultSlotChange=e=>{this.linkControl(e.target.assignedElements({flatten:!0}))},this.handleActionsSlotChange=e=>{this.hasSlottedActions=e.target.assignedNodes().length>0},this.handleLabelClick=()=>{this.control?.focus()},this.handleCopy=e=>{let t=e.currentTarget;t.copyValue=this.control?.value??``,t.copy()},this.handleClear=()=>{let e=this.control;b(e)&&(e.clear(),e.focus())}}static{this.styles=h}connectedCallback(){super.connectedCallback(),this.control&&(this.observeControl(this.control),this.syncClearDisabled())}disconnectedCallback(){super.disconnectedCallback(),this.controlObserver.disconnect()}observeControl(e){let t={attributes:!0,attributeFilter:[`disabled`,`readonly`]};this.controlObserver.observe(e,t);for(let n=e.closest(`fieldset`);n;n=n.parentElement?.closest(`fieldset`)??null)this.controlObserver.observe(n,t);y(e)||customElements.whenDefined(e.localName).then(()=>{this.control===e&&this.syncClearDisabled()})}syncClearDisabled(){let e=this.control;this.clearDisabled=!b(e)||!y(e)||e.disabled||_(e)||e.readOnly}linkControl(e){let t=e.find(e=>v.has(e.localName))??null;if(t===this.control)return;let n=this.control;n&&(this.label&&n.label===this.label&&(n.label=``),this.description&&n.description===this.description&&(n.description=``)),this.controlObserver.disconnect(),this.control=t,t&&this.observeControl(t),this.syncClearDisabled()}willUpdate(){if(!this.hasUpdated){let e=[...this.children];this.hasSlottedActions=e.some(e=>e.slot===`actions`),this.linkControl(e.filter(e=>!e.slot))}}updated(e){let t=this.control;t&&(this.pushText(t,`label`,e),this.pushText(t,`description`,e))}pushText(e,t,n){if(!n.has(`control`)&&!n.has(t))return;let r=this[t],i=n.get(t);r?e[t]=r:i&&e[t]===i&&(e[t]=``)}render(){let e=this.control?`true`:void 0,t=!!this.label||this.copyable||this.clearable||this.hasSlottedActions,r=this.label?` ${this.label}`:``;return i`
      <div part="head" class=${s({field__head:!0,"field__head--empty":!t})}>
        ${this.label?i`
                <span
                  part="label"
                  class="field__label"
                  aria-hidden=${f(e)}
                  @click=${this.handleLabelClick}
                  >${this.label}</span
                >
              `:n}
        <div part="actions" class="field__actions">
          <slot name="actions" @slotchange=${this.handleActionsSlotChange}></slot>
          ${this.copyable?i`
                  <aui-icon-button
                    part="copy-button"
                    preset="copy"
                    action="custom"
                    label=${`${this.copyLabel||`複製`}${r}`}
                    success-tooltip=${this.copiedLabel||`已複製！`}
                    @click=${this.handleCopy}
                  ></aui-icon-button>
                `:n}
          ${this.clearable?i`
                  <aui-icon-button
                    part="clear-button"
                    preset="close"
                    tooltip=${this.clearLabel||`清除`}
                    label=${`${this.clearLabel||`清除`}${r}`}
                    ?disabled=${this.clearDisabled}
                    @click=${this.handleClear}
                  ></aui-icon-button>
                `:n}
        </div>
      </div>
      <slot @slotchange=${this.handleDefaultSlotChange}></slot>
      ${this.description?i`
              <div
                part="description"
                class="field__description"
                aria-hidden=${f(e)}
              >
                ${this.description}
              </div>
            `:n}
    `}},l([d({type:String})],x.prototype,`label`,void 0),l([d({type:String})],x.prototype,`description`,void 0),l([d({type:Boolean,reflect:!0})],x.prototype,`copyable`,void 0),l([d({type:Boolean,reflect:!0})],x.prototype,`clearable`,void 0),l([d({type:String,attribute:`copy-label`})],x.prototype,`copyLabel`,void 0),l([d({type:String,attribute:`copied-label`})],x.prototype,`copiedLabel`,void 0),l([d({type:String,attribute:`clear-label`})],x.prototype,`clearLabel`,void 0),l([o()],x.prototype,`control`,void 0),l([o()],x.prototype,`clearDisabled`,void 0),l([o()],x.prototype,`hasSlottedActions`,void 0),customElements.get(`aui-field`)||customElements.define(`aui-field`,x)})))()}function C(){return(C=e((()=>{S()})))()}export{C as t};