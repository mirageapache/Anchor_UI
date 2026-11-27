import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{f as o,g as s,i as c,r as l,t as u,u as d,v as f}from"./decorate-B5jhCMz7.js";import{r as p,t as m}from"./if-defined-BTZAmkBp.js";import{n as h,t as g}from"./form-control-DFn712E6.js";var _;function v(){return(v=e((()=>{a(),_=t`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 膠囊軌道 ─── */
  .segmented {
    display: inline-flex;
    gap: 2px;
    box-sizing: border-box;
    max-width: 100%;
    margin: 0;
    padding: 3px;
    background: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-lg, 12px);
    transition:
      background-color var(--transition-theme, 200ms ease),
      border-color var(--transition-theme, 200ms ease);
  }

  .segmented--disabled {
    opacity: 0.5;
  }

  /* ─── 選項 ─── */
  .option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: 32px;
    margin: 0;
    padding: 0 var(--space-ms, 12px);
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    white-space: nowrap;
    background: transparent;
    border: 0;
    border-radius: var(--radius-md, 8px);
    outline: none;
    cursor: pointer;
    transition:
      background-color var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease);
  }

  .option:hover:not(:disabled):not([aria-checked='true']) {
    color: var(--color-text-primary, #0f172a);
  }

  /* 選中態：品牌色實心高亮 */
  .option[aria-checked='true'] {
    font-weight: var(--weight-semibold, 600);
    color: var(--color-on-solid, #ffffff);
    background: var(--color-brand-600, #0f4c81);
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
  }

  .option:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .option:disabled {
    cursor: not-allowed;
  }

  /* 個別停用的選項（整組停用時由軌道統一降低透明度，避免重複疊加） */
  .segmented:not(.segmented--disabled) .option:disabled:not([aria-checked='true']) {
    opacity: 0.5;
  }

  /*
   * 選中時字重變粗會撐寬選項，切換時軌道會跳動；
   * 以隱藏的粗體文字預留寬度（visibility: hidden 不列入無障礙名稱）
   */
  .option__label {
    display: inline-grid;
  }

  .option__label::after {
    content: attr(data-text);
    height: 0;
    overflow: hidden;
    font-weight: var(--weight-semibold, 600);
    visibility: hidden;
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

  @media (prefers-reduced-motion: reduce) {
    .segmented,
    .option {
      transition: none;
    }
  }

  /*
   * 強制色彩（Windows 高對比）：背景與文字顏色被統一成系統色，選中項只剩字重的差異。
   * 改用系統的選取色，並讓焦點外框與選中項的底色有所區別
   */
  @media (forced-colors: active) {
    .option[aria-checked='true'] {
      forced-color-adjust: none;
      color: HighlightText;
      background: Highlight;
    }

    .option:focus-visible {
      outline-color: CanvasText;
    }
  }
`})))()}function y(){if(b===void 0){let e=document.createElement(`input`);e.type=`radio`,e.required=!0,b=e.validationMessage||`請選擇其中一個選項。`}return b}var b,x,S,C,w;function T(){return(T=e((()=>{a(),d(),l(),m(),v(),h(),x=e=>typeof e==`object`&&!!e,S=e=>x(e)&&typeof e.value==`string`,C=e=>typeof e.value==`string`?e:{...e,value:String(e.value??``)},w=class extends r{constructor(...e){super(...e),this.formControl=new g(this,()=>this.formResetCallback()),this.currentValue=``,this.dirty=!1,this.customValidityMessage=``,this.formDisabled=!1,this.optionItems=[],this.defaultValue=``,this.name=``,this.label=``,this.description=``,this.disabled=!1,this.required=!1,this.handleClick=e=>{let t=e.target.closest(`.option`);t&&this.selectByUser(Number(t.dataset.index))},this.handleKeyDown=e=>{let t=e.target.closest(`.option`);if(!t||this.isDisabled||e.altKey||e.ctrlKey||e.metaKey)return;let n=Number(t.dataset.index),r=getComputedStyle(this).direction===`rtl`,i=e=>e===`ArrowDown`||e===(r?`ArrowLeft`:`ArrowRight`),a=e=>e===`ArrowUp`||e===(r?`ArrowRight`:`ArrowLeft`),o;if(i(e.key))o=this.step(n,1);else if(a(e.key))o=this.step(n,-1);else if(e.key===`Home`)o=this.step(this.options.length-1,1);else if(e.key===`End`)o=this.step(0,-1);else return;e.preventDefault(),this.selectByUser(o)}}static{this.styles=_}static{this.formAssociated=!0}get options(){return this.optionItems}set options(e){let t=this.optionItems,n=Array.isArray(e)?e:[];this.optionItems=n.every(S)?n:n.filter(x).map(C),this.syncFormValue(),this.requestUpdate(`options`,t)}get value(){return this.currentValue}set value(e){this.dirty=!0,this.applyValue(e)}get form(){return this.formControl.form}get validity(){return this.formControl.internals?.validity}get validationMessage(){return this.formControl.internals?.validationMessage??this.validityProblem?.message??``}get willValidate(){return this.formControl.internals?.willValidate??!this.isDisabled}checkValidity(){return this.formControl.internals?.checkValidity()??!this.validityProblem}reportValidity(){return this.formControl.internals?.reportValidity()??!this.validityProblem}setCustomValidity(e){this.customValidityMessage=e,this.syncValidity()}focus(e){this.optionButtons[this.tabStopIndex]?.focus(e)}formResetCallback(){this.dirty=!1,this.applyValue(this.defaultValue)}formDisabledCallback(e){this.formDisabled=e}formStateRestoreCallback(e){typeof e==`string`&&(this.value=e)}get isDisabled(){return this.disabled||this.formDisabled}get selectedIndex(){return this.options.findIndex(e=>e.value===this.currentValue)}get tabStopIndex(){let e=this.selectedIndex;return e>=0&&!this.options[e].disabled?e:this.options.findIndex(e=>!e.disabled)}get validityProblem(){return this.isDisabled?null:this.customValidityMessage?{flags:{customError:!0},message:this.customValidityMessage}:this.required&&this.selectedIndex<0?{flags:{valueMissing:!0},message:y()}:null}applyValue(e){let t=this.currentValue;this.currentValue=String(e??``),this.syncFormValue(),this.syncValidity(),this.requestUpdate(`value`,t)}syncFormValue(){this.formControl.setValue(this.selectedIndex>=0?this.currentValue:null)}syncValidity(){let e=this.formControl.internals;if(!e)return;let t=this.validityProblem;t?e.setValidity(t.flags,t.message,this.optionButtons[this.tabStopIndex]):e.setValidity({})}step(e,t){let n=this.options.length;for(let r=1;r<=n;r++){let i=(e+t*r+n)%n;if(!this.options[i].disabled)return i}return e}selectByUser(e){let t=this.options[e];!t||t.disabled||this.isDisabled||(this.optionButtons[e]?.focus(),t.value!==this.currentValue&&(this.value=t.value,this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0}))))}willUpdate(e){e.has(`defaultValue`)&&!this.dirty?this.applyValue(this.defaultValue):e.has(`options`)&&this.syncFormValue()}updated(){this.syncValidity()}render(){let e=this.isDisabled,t=this.selectedIndex,r=this.tabStopIndex;return i`
      <div
        part="base"
        class=${c({segmented:!0,"segmented--disabled":e})}
        role="radiogroup"
        aria-label=${p(this.label||void 0)}
        aria-describedby=${p(this.description?`description`:void 0)}
        aria-required=${p(this.required?`true`:void 0)}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        ${this.options.map((n,a)=>{let o=a===t,s=[`option`,o&&`option-checked`,n.disabled&&`option-disabled`];return i`
            <button
              type="button"
              part=${s.filter(Boolean).join(` `)}
              class="option"
              role="radio"
              aria-checked=${o?`true`:`false`}
              tabindex=${a===r?0:-1}
              data-index=${a}
              ?disabled=${e||!!n.disabled}
            >
              <span class="option__label" data-text=${n.label}>${n.label}</span>
            </button>
          `})}
      </div>
      ${this.description?i`<span id="description" class="sr-only">${this.description}</span>`:n}
    `}},u([o(`.option`)],w.prototype,`optionButtons`,void 0),u([s()],w.prototype,`formDisabled`,void 0),u([f({type:Array})],w.prototype,`options`,null),u([f({attribute:!1})],w.prototype,`value`,null),u([f({attribute:`value`})],w.prototype,`defaultValue`,void 0),u([f({type:String,reflect:!0})],w.prototype,`name`,void 0),u([f({type:String})],w.prototype,`label`,void 0),u([f({type:String})],w.prototype,`description`,void 0),u([f({type:Boolean,reflect:!0})],w.prototype,`disabled`,void 0),u([f({type:Boolean,reflect:!0})],w.prototype,`required`,void 0),customElements.get(`aui-segmented`)||customElements.define(`aui-segmented`,w)})))()}function E(){return(E=e((()=>{T()})))()}export{E as t};