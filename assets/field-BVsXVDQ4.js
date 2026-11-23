import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{g as o,i as s,r as c,t as l,u,v as d}from"./decorate-B5jhCMz7.js";import{r as f,t as p}from"./if-defined-BTZAmkBp.js";import{t as m}from"./icon-button-D_dhJfw8.js";var h;function g(){return(g=e((()=>{a(),h=t`
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
`})))()}var _,v,y;function b(){return(b=e((()=>{a(),u(),c(),p(),g(),m(),_=new Set([`aui-input`,`aui-output`,`aui-segmented`]),v=e=>e?.localName===`aui-input`,y=class extends r{constructor(...e){super(...e),this.label=``,this.description=``,this.copyable=!1,this.clearable=!1,this.control=null,this.clearDisabled=!0,this.hasSlottedActions=!1,this.controlObserver=new MutationObserver(()=>this.syncClearDisabled()),this.handleDefaultSlotChange=e=>{this.linkControl(e.target.assignedElements({flatten:!0}))},this.handleActionsSlotChange=e=>{this.hasSlottedActions=e.target.assignedNodes().length>0},this.handleLabelClick=()=>{this.control?.focus()},this.handleCopy=e=>{let t=e.currentTarget;t.copyValue=this.control?.value??``,t.copy()},this.handleClear=()=>{let e=this.control;v(e)&&(e.clear(),e.focus())}}static{this.styles=h}connectedCallback(){super.connectedCallback(),this.control&&(this.observeControl(this.control),this.syncClearDisabled())}disconnectedCallback(){super.disconnectedCallback(),this.controlObserver.disconnect()}observeControl(e){this.controlObserver.observe(e,{attributes:!0,attributeFilter:[`disabled`,`readonly`]})}syncClearDisabled(){let e=this.control;this.clearDisabled=!v(e)||e.disabled||e.readOnly}linkControl(e){let t=e.find(e=>_.has(e.localName))??null;if(t===this.control)return;let n=this.control;n&&(this.label&&n.label===this.label&&(n.label=``),this.description&&n.description===this.description&&(n.description=``)),this.controlObserver.disconnect(),this.control=t,t&&this.observeControl(t),this.syncClearDisabled()}willUpdate(){if(!this.hasUpdated){let e=[...this.children];this.hasSlottedActions=e.some(e=>e.slot===`actions`),this.linkControl(e.filter(e=>!e.slot))}}updated(e){let t=this.control;t&&(this.pushText(t,`label`,e),this.pushText(t,`description`,e))}pushText(e,t,n){if(!n.has(`control`)&&!n.has(t))return;let r=this[t],i=n.get(t);r?e[t]=r:i&&e[t]===i&&(e[t]=``)}render(){let e=this.control?`true`:void 0,t=!!this.label||this.copyable||this.clearable||this.hasSlottedActions,r=this.label?` ${this.label}`:``;return i`
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
                    label=${`複製${r}`}
                    success-tooltip="已複製！"
                    @click=${this.handleCopy}
                  ></aui-icon-button>
                `:n}
          ${this.clearable?i`
                  <aui-icon-button
                    part="clear-button"
                    preset="close"
                    tooltip="清除"
                    label=${`清除${r}`}
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
    `}},l([d({type:String})],y.prototype,`label`,void 0),l([d({type:String})],y.prototype,`description`,void 0),l([d({type:Boolean,reflect:!0})],y.prototype,`copyable`,void 0),l([d({type:Boolean,reflect:!0})],y.prototype,`clearable`,void 0),l([o()],y.prototype,`control`,void 0),l([o()],y.prototype,`clearDisabled`,void 0),l([o()],y.prototype,`hasSlottedActions`,void 0),customElements.get(`aui-field`)||customElements.define(`aui-field`,y)})))()}function x(){return(x=e((()=>{b()})))()}export{x as t};