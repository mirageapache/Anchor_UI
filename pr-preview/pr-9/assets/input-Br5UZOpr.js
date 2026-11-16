import{h as e,i as t,n,s as r,t as i}from"./lit-MXP2jLr5.js";import{f as a,i as o,m as s,r as c,t as l,u}from"./decorate-BSUctFxX.js";import{t as d}from"./query-jFZ5EnhK.js";import{r as f,t as p}from"./if-defined-BrPPiKvf.js";import{r as m,t as h}from"./live-DpoR_L0T.js";import{n as g,t as _}from"./form-control-6Aml-KOf.js";import{t as v}from"./rolldown-runtime-Dh6celcD.js";var y;function b(){return(b=v((()=>{i(),y=e`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 輸入框本體（單行 input 與多行 textarea 共用） ─── */
  .control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 12px 14px;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-primary, #0f172a);
    background: var(--color-base, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    outline: none;
    overflow-wrap: break-word;
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      color var(--transition-theme, 200ms ease);
  }

  textarea.control {
    min-height: calc(1.5em + 26px); /* 至少一行文字 + 上下內距與邊框 */
    resize: vertical;
  }

  .control::placeholder {
    color: var(--color-text-muted, #64748b);
    opacity: 1;
  }

  /* ─── Focus 雙層光環：品牌色邊框 + 3px 淡色光暈 ─── */
  .control:focus {
    border-color: var(--color-brand-600, #0f4c81);
    box-shadow: 0 0 0 3px var(--color-brand-dim, color-mix(in srgb, #0f4c81 12%, transparent));
  }

  /* ─── 錯誤狀態：明確設定 invalid，或使用者操作後未通過驗證 ─── */
  .control--invalid,
  .control:user-invalid {
    border-color: var(--color-danger, #ef4444);
  }

  .control--invalid:focus,
  .control:user-invalid:focus {
    border-color: var(--color-danger, #ef4444);
    box-shadow: 0 0 0 3px var(--color-danger-dim, color-mix(in srgb, #ef4444 10%, transparent));
  }

  /* ─── 唯讀與停用 ─── */
  .control:read-only:not(:disabled) {
    background: var(--color-surface, #f1f5f9);
  }

  .control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    resize: none;
  }

  /* ─── 螢幕閱讀器專用文字（標題與描述的無障礙關聯） ─── */
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

  /* ─── 無障礙動態降級：減少動畫 ─── */
  @media (prefers-reduced-motion: reduce) {
    .control {
      transition: none;
    }
  }
`})))()}var x,S;function C(){return(C=v((()=>{i(),u(),c(),p(),h(),b(),g(),x=new Set([`text`,`email`,`url`,`search`,`tel`,`password`]),S=class extends n{constructor(...e){super(...e),this.formControl=new _(this,()=>this.formResetCallback()),this.currentValue=``,this.dirty=!1,this.customValidityMessage=``,this.formDisabled=!1,this.defaultValue=``,this.name=``,this.type=`text`,this.multiline=!1,this.rows=3,this.placeholder=``,this.label=``,this.description=``,this.disabled=!1,this.readOnly=!1,this.required=!1,this.invalid=!1,this.handleInput=e=>{this.value=e.target.value,this.syncValidity()},this.handleChange=e=>{this.value=e.target.value,this.dispatchEvent(new Event(`change`,{bubbles:!0}))}}static{this.styles=y}static{this.shadowRootOptions={...n.shadowRootOptions,delegatesFocus:!0}}static{this.formAssociated=!0}get internals(){return this.formControl.internals}get value(){return this.currentValue}set value(e){this.dirty=!0,this.applyValue(e)}get form(){return this.formControl.form}get validity(){return this.internals?.validity??this.control?.validity}get validationMessage(){return this.internals?.validationMessage??this.control?.validationMessage??``}get willValidate(){return this.internals?.willValidate??this.control?.willValidate??!1}checkValidity(){return this.internals?.checkValidity()??this.control?.checkValidity()??!0}reportValidity(){return this.internals?.reportValidity()??this.control?.reportValidity()??!0}setCustomValidity(e){this.customValidityMessage=e,this.syncValidity()}clear(){this.isDisabled||this.readOnly||!this.value||(this.value=``,this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0})))}formResetCallback(){this.dirty=!1,this.applyValue(this.defaultValue)}formDisabledCallback(e){this.formDisabled=e}formStateRestoreCallback(e){typeof e==`string`&&(this.value=e)}get isDisabled(){return this.disabled||this.formDisabled}applyValue(e){let t=this.currentValue;this.currentValue=String(e??``),this.formControl.setValue(this.currentValue),this.requestUpdate(`value`,t)}syncValidity(){let e=this.control;e&&(e.setCustomValidity(this.customValidityMessage),this.internals&&(e.validity.valid||!e.willValidate?this.internals.setValidity({}):this.internals.setValidity(e.validity,e.validationMessage,e)))}willUpdate(e){e.has(`defaultValue`)&&!this.dirty&&this.applyValue(this.defaultValue)}updated(){this.syncValidity()}render(){let e=this.isDisabled,n=o({control:!0,"control--invalid":this.invalid}),i=this.description?`description`:void 0,a=this.invalid?`true`:void 0,s=this.placeholder||void 0,c=this.multiline?r`
          <textarea
            id="control"
            part="control"
            class=${n}
            .value=${m(this.value)}
            rows=${this.rows}
            placeholder=${f(s)}
            minlength=${f(this.minLength)}
            maxlength=${f(this.maxLength)}
            autocomplete=${f(this.autocomplete)}
            aria-describedby=${f(i)}
            aria-invalid=${f(a)}
            ?disabled=${e}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            @input=${this.handleInput}
            @change=${this.handleChange}
          ></textarea>
        `:r`
          <input
            id="control"
            part="control"
            class=${n}
            type=${x.has(this.type)?this.type:`text`}
            .value=${m(this.value)}
            placeholder=${f(s)}
            minlength=${f(this.minLength)}
            maxlength=${f(this.maxLength)}
            pattern=${f(this.pattern)}
            autocomplete=${f(this.autocomplete)}
            aria-describedby=${f(i)}
            aria-invalid=${f(a)}
            ?disabled=${e}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            @input=${this.handleInput}
            @change=${this.handleChange}
          />
        `;return r`
      ${this.label?r`<label class="sr-only" for="control">${this.label}</label>`:t}
      ${c}
      ${this.description?r`<span id="description" class="sr-only">${this.description}</span>`:t}
    `}},l([d(`.control`)],S.prototype,`control`,void 0),l([a()],S.prototype,`formDisabled`,void 0),l([s({attribute:!1})],S.prototype,`value`,null),l([s({attribute:`value`})],S.prototype,`defaultValue`,void 0),l([s({type:String,reflect:!0})],S.prototype,`name`,void 0),l([s({type:String,reflect:!0})],S.prototype,`type`,void 0),l([s({type:Boolean,reflect:!0})],S.prototype,`multiline`,void 0),l([s({type:Number})],S.prototype,`rows`,void 0),l([s({type:String})],S.prototype,`placeholder`,void 0),l([s({type:String})],S.prototype,`label`,void 0),l([s({type:String})],S.prototype,`description`,void 0),l([s({type:Boolean,reflect:!0})],S.prototype,`disabled`,void 0),l([s({type:Boolean,reflect:!0,attribute:`readonly`})],S.prototype,`readOnly`,void 0),l([s({type:Boolean,reflect:!0})],S.prototype,`required`,void 0),l([s({type:Boolean,reflect:!0})],S.prototype,`invalid`,void 0),l([s({type:Number,attribute:`minlength`})],S.prototype,`minLength`,void 0),l([s({type:Number,attribute:`maxlength`})],S.prototype,`maxLength`,void 0),l([s({type:String})],S.prototype,`pattern`,void 0),l([s({type:String})],S.prototype,`autocomplete`,void 0),customElements.get(`aui-input`)||customElements.define(`aui-input`,S)})))()}function w(){return(w=v((()=>{C()})))()}export{w as t};