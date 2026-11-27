import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{g as o,i as s,p as c,r as l,t as u,u as d,v as f}from"./decorate-B5jhCMz7.js";import{r as p,t as m}from"./if-defined-BTZAmkBp.js";import{i as h,n as g,r as _}from"./button-CQ6kAZlu.js";import{r as v,t as y}from"./live-DcZNRN_b.js";import{n as b,t as x}from"./form-control-DFn712E6.js";var S;function C(){return(C=e((()=>{a(),S=t`
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

  /*
   * 強制色彩（Windows 高對比）：box-shadow 會被移除、邊框顏色被統一成系統色，
   * 焦點光環因此消失，改以 outline 呈現（WCAG 2.4.7）
   */
  @media (forced-colors: active) {
    .control:focus {
      outline: 2px solid Highlight;
      outline-offset: 1px;
    }
  }
`})))()}var w,T;function E(){return(E=e((()=>{a(),d(),l(),m(),y(),C(),b(),_(),w=new Set([`text`,`email`,`url`,`search`,`tel`,`password`]),T=class extends r{static{this.styles=S}static{this.shadowRootOptions={...r.shadowRootOptions,delegatesFocus:!0}}static{this.formAssociated=!0}constructor(){super(),this.formControl=new x(this,()=>this.formResetCallback()),this.currentValue=``,this.dirty=!1,this.customValidityMessage=``,this.formDisabled=!1,this.userInvalid=!1,this.defaultValue=``,this.name=``,this.type=`text`,this.multiline=!1,this.rows=3,this.placeholder=``,this.label=``,this.description=``,this.disabled=!1,this.readOnly=!1,this.required=!1,this.invalid=!1,this.handleInvalid=()=>{this.userInvalid=!0},this.handleInput=e=>{this.value=e.target.value,this.syncValidity()},this.handleChange=e=>{this.value=e.target.value,this.dispatchEvent(new Event(`change`,{bubbles:!0}))},this.handleKeydown=e=>{e.key!==`Enter`||e.isComposing||e.keyCode===229||e.shiftKey||e.ctrlKey||e.altKey||e.metaKey||g(e,()=>{let e=this.form;e&&this.isConnected&&!this.isDisabled&&h(e)})},this.addEventListener(`invalid`,this.handleInvalid)}get internals(){return this.formControl.internals}get value(){return this.currentValue}set value(e){this.dirty=!0,this.applyValue(e)}get form(){return this.formControl.form}get validity(){return this.internals?.validity??this.control?.validity}get validationMessage(){return this.internals?.validationMessage??this.control?.validationMessage??``}get willValidate(){return this.internals?.willValidate??this.control?.willValidate??!1}checkValidity(){return this.internals?.checkValidity()??this.control?.checkValidity()??!0}reportValidity(){return this.internals?.reportValidity()??this.control?.reportValidity()??!0}setCustomValidity(e){this.customValidityMessage=e,this.syncValidity()}clear(){this.isDisabled||this.readOnly||!this.value||(this.value=``,this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0})))}formResetCallback(){this.dirty=!1,this.userInvalid=!1,this.applyValue(this.defaultValue)}formDisabledCallback(e){this.formDisabled=e}formStateRestoreCallback(e){typeof e==`string`&&(this.value=e)}get isDisabled(){return this.disabled||this.formDisabled}applyValue(e){let t=this.currentValue;this.currentValue=String(e??``),this.syncFormValue();let n=this.control;n&&n.value!==this.currentValue&&(n.value=this.currentValue),this.syncValidity(),this.requestUpdate(`value`,t)}syncFormValue(){let e=this.type!==`password`&&this.autocomplete!==`off`;this.formControl.setValue(this.currentValue,e)}syncValidity(){let e=this.control;e&&(e.setCustomValidity(this.customValidityMessage),(e.validity.valid||!e.willValidate)&&(this.userInvalid=!1),this.internals&&(e.validity.valid||!e.willValidate?this.internals.setValidity({}):this.internals.setValidity(e.validity,e.validationMessage,e)))}willUpdate(e){e.has(`defaultValue`)&&!this.dirty?this.applyValue(this.defaultValue):(e.has(`type`)||e.has(`autocomplete`))&&this.syncFormValue()}updated(){this.syncValidity()}render(){let e=this.isDisabled,t=s({control:!0,"control--invalid":this.invalid||this.userInvalid}),r=this.description?`description`:void 0,a=this.invalid||this.userInvalid?`true`:void 0,o=this.placeholder||void 0,c=this.multiline?i`
          <textarea
            id="control"
            part="control"
            class=${t}
            .value=${v(this.value)}
            rows=${this.rows}
            placeholder=${p(o)}
            minlength=${p(this.minLength)}
            maxlength=${p(this.maxLength)}
            autocomplete=${p(this.autocomplete)}
            aria-describedby=${p(r)}
            aria-invalid=${p(a)}
            ?disabled=${e}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @invalid=${this.handleInvalid}
          ></textarea>
        `:i`
          <input
            id="control"
            part="control"
            class=${t}
            type=${w.has(this.type)?this.type:`text`}
            .value=${v(this.value)}
            placeholder=${p(o)}
            minlength=${p(this.minLength)}
            maxlength=${p(this.maxLength)}
            pattern=${p(this.pattern)}
            autocomplete=${p(this.autocomplete)}
            aria-describedby=${p(r)}
            aria-invalid=${p(a)}
            ?disabled=${e}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @invalid=${this.handleInvalid}
            @keydown=${this.handleKeydown}
          />
        `;return i`
      ${this.label?i`<label class="sr-only" for="control">${this.label}</label>`:n}
      ${c}
      ${this.description?i`<span id="description" class="sr-only">${this.description}</span>`:n}
    `}},u([c(`.control`)],T.prototype,`control`,void 0),u([o()],T.prototype,`formDisabled`,void 0),u([o()],T.prototype,`userInvalid`,void 0),u([f({attribute:!1})],T.prototype,`value`,null),u([f({attribute:`value`})],T.prototype,`defaultValue`,void 0),u([f({type:String,reflect:!0})],T.prototype,`name`,void 0),u([f({type:String,reflect:!0})],T.prototype,`type`,void 0),u([f({type:Boolean,reflect:!0})],T.prototype,`multiline`,void 0),u([f({type:Number})],T.prototype,`rows`,void 0),u([f({type:String})],T.prototype,`placeholder`,void 0),u([f({type:String})],T.prototype,`label`,void 0),u([f({type:String})],T.prototype,`description`,void 0),u([f({type:Boolean,reflect:!0})],T.prototype,`disabled`,void 0),u([f({type:Boolean,reflect:!0,attribute:`readonly`})],T.prototype,`readOnly`,void 0),u([f({type:Boolean,reflect:!0})],T.prototype,`required`,void 0),u([f({type:Boolean,reflect:!0})],T.prototype,`invalid`,void 0),u([f({type:Number,attribute:`minlength`})],T.prototype,`minLength`,void 0),u([f({type:Number,attribute:`maxlength`})],T.prototype,`maxLength`,void 0),u([f({type:String})],T.prototype,`pattern`,void 0),u([f({type:String})],T.prototype,`autocomplete`,void 0),customElements.get(`aui-input`)||customElements.define(`aui-input`,T)})))()}function D(){return(D=e((()=>{E()})))()}export{D as t};