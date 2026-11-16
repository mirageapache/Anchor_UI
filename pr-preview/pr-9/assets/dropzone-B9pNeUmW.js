import{h as e,i as t,n,s as r,t as i}from"./lit-MXP2jLr5.js";import{f as a,i as o,m as s,r as c,t as l,u}from"./decorate-BSUctFxX.js";import{t as d}from"./query-jFZ5EnhK.js";import{r as f,t as p}from"./if-defined-BrPPiKvf.js";import{n as m,r as h,t as g}from"./slot-byr6JIFV.js";import{t as _}from"./rolldown-runtime-Dh6celcD.js";var v;function y(){return(y=_((()=>{i(),v=e`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  /* ─── 虛線框（按鈕，同時是拖放目標） ─── */
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs, 4px);
    box-sizing: border-box;
    width: 100%;
    padding: var(--space-xl, 40px) var(--space-md, 16px);
    margin: 0;
    font: inherit;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    text-align: center;
    color: var(--color-text-secondary, #475569);
    background-color: var(--color-base, #ffffff);
    /* 規格為 --color-border，但淺色主題下在白底上幾乎看不見虛線；改用較清晰的 ghost-border */
    border: 1px dashed var(--color-ghost-border, #cbd5e1);
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      border-color var(--transition-base, 150ms ease),
      background-color var(--transition-base, 150ms ease);
  }

  /* 拖曳中不套用懸停的品牌色邊框，讓琥珀色的回饋優先 */
  .dropzone:hover:not(:disabled, .is-dragging) {
    border-color: var(--color-brand-500, #1b6ca8);
  }

  .dropzone:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 拖曳檔案懸浮：整塊染上 Accent 琥珀色，邊框加亮 ─── */
  .dropzone.is-dragging {
    border-color: var(--color-accent, #f59e0b);
    background-color: var(--color-accent-dim, rgba(245, 158, 11, 0.14));
  }

  /* 拖曳時子元素不接收指標事件，避免游標經過圖示與文字時反覆觸發 dragenter / dragleave */
  .dropzone.is-dragging > * {
    pointer-events: none;
  }

  /*
   * 拖曳時的底色是半透明的琥珀色，實際對比取決於元件背後的顏色；
   * 提示文字改用主要文字色，確保放在較亮的深色容器（如卡片、彈窗）內仍符合對比。
   */
  .dropzone.is-dragging .dropzone__hint,
  .dropzone.is-dragging .dropzone__icon {
    color: var(--color-text-primary, #0f172a);
  }

  /*
   * 停用：按鈕不接收指標事件，讓拖放事件落在外層容器上
   * （停用的表單控制項在部分瀏覽器不會收到事件），游標樣式也改由容器提供。
   */
  .dropzone:disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  .dropzone-area.is-disabled {
    cursor: not-allowed;
  }

  /* ─── 內容 ─── */
  .dropzone__icon {
    display: inline-flex;
    color: var(--color-text-secondary, #475569);
  }

  .dropzone__icon svg {
    display: block;
    width: 28px;
    height: 28px;
  }

  .dropzone__heading {
    max-width: 100%;
    font-weight: var(--weight-medium, 500);
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: anywhere;
  }

  .dropzone__hint {
    max-width: 100%;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: anywhere;
  }

  /* ─── 錯誤訊息 ─── */
  .dropzone__error {
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-danger-text, #b91c1c);
    overflow-wrap: anywhere;
  }

  /* 沒有訊息時容器高度為 0，只有出現訊息才加上與虛線框的間距 */
  .dropzone__error.has-message {
    margin-top: var(--space-xs, 4px);
  }

  /* 原生檔案輸入框：僅作為開啟選取器的媒介，不顯示也不可聚焦 */
  .dropzone__input {
    display: none;
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .dropzone {
      transition: none !important;
    }
  }
`})))()}function b(e){return e.startsWith(`.`)?e.length>1:w.has(e)?!0:/^[^/*\s]+\/[^/*\s]+$/.test(e)}function x(e){return e.split(`,`).map(e=>e.trim().toLowerCase()).filter(b)}function S(e,t){if(t.length===0)return!0;let n=e.name.toLowerCase(),r=e.type.toLowerCase();return t.some(e=>e.startsWith(`.`)?n.endsWith(e):e.endsWith(`/*`)?r.startsWith(e.slice(0,-1)):r===e)}function C(e){let t=new Set;for(let n of Array.from(e?.items??[]))if(n.kind===`file`&&n.webkitGetAsEntry?.()?.isDirectory){let e=n.getAsFile();e&&t.add(e)}return t}var w,T,E;function D(){return(D=_((()=>{i(),u(),c(),p(),h(),y(),w=new Set([`audio/*`,`video/*`,`image/*`]),T=e=>Array.from(e.dataTransfer?.types??[]).includes(`Files`),E=class extends n{static{this.styles=v}static{this.shadowRootOptions={...n.shadowRootOptions,delegatesFocus:!0}}constructor(){super(),this.accept=``,this.multiple=!1,this.disabled=!1,this.heading=`拖放檔案到此處，或點擊選擇檔案`,this.hint=``,this.acceptLabel=`支援格式：`,this.invalidTypeMessage=`不支援的檔案格式：`,this.tooManyMessage=`一次只能選擇一個檔案，已使用第一個檔案`,this.dragging=!1,this.errorMessage=``,this.dragDepth=0,this.handleWindowDragEnd=()=>{this.resetDrag()},this.handleClick=()=>this.open(),this.handleInputClick=e=>e.stopPropagation(),this.handleDragEnter=e=>{T(e)&&(e.preventDefault(),this.dragDepth++,this.disabled||(this.startDrag(),this.errorMessage=``))},this.handleDragOver=e=>{T(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=this.disabled?`none`:`copy`),this.disabled||this.startDrag())},this.handleDragLeave=()=>{this.dragDepth!==0&&(this.dragDepth--,this.dragDepth===0&&this.resetDrag())},this.handleDrop=e=>{T(e)&&(e.preventDefault(),this.resetDrag(),!this.disabled&&this.receive(Array.from(e.dataTransfer?.files??[]),`drop`,C(e.dataTransfer)))},this.handleInputChange=()=>{let e=this.input;if(!e)return;let t=Array.from(e.files??[]);e.value=``,!this.disabled&&this.receive(t,`picker`)},new g(this)}open(){this.disabled||(this.errorMessage=``,this.input?.click())}disconnectedCallback(){super.disconnectedCallback(),this.resetDrag()}willUpdate(e){e.has(`disabled`)&&this.disabled&&(this.dragging=!1)}startDrag(){if(!this.dragging){this.dragging=!0;for(let e of[`drop`,`dragend`])window.addEventListener(e,this.handleWindowDragEnd,!0)}}resetDrag(){this.dragDepth=0,this.dragging=!1;for(let e of[`drop`,`dragend`])window.removeEventListener(e,this.handleWindowDragEnd,!0)}receive(e,t,n=new Set){if(e.length===0)return;let r=x(this.accept),i=[],a=[];for(let t of e)n.has(t)?a.push({file:t,reason:`directory`}):S(t,r)?!this.multiple&&i.length>0?a.push({file:t,reason:`count`}):i.push(t):a.push({file:t,reason:`type`});this.errorMessage=this.describeRejections(a),i.length>0&&this.dispatchEvent(new CustomEvent(`aui-file-drop`,{detail:{files:i,source:t},bubbles:!0,composed:!0})),a.length>0&&this.dispatchEvent(new CustomEvent(`aui-file-reject`,{detail:{files:a.map(({file:e})=>e),rejections:a,source:t},bubbles:!0,composed:!0}))}describeRejections(e){let t=[],n=e.filter(({reason:e})=>e!==`count`);return n.length>0&&t.push(this.invalidTypeMessage+n.map(({file:e})=>e.name).join(`、`)),e.some(({reason:e})=>e===`count`)&&t.push(this.tooManyMessage),t.join(` `)}render(){let e=x(this.accept),n=this.hint||(e.length>0?this.acceptLabel+e.join(`、`):``),i=!!n||m(this,`hint`);return r`
      <div
        class=${o({"dropzone-area":!0,"is-disabled":this.disabled})}
        @dragenter=${this.handleDragEnter}
        @dragover=${this.handleDragOver}
        @dragleave=${this.handleDragLeave}
        @drop=${this.handleDrop}
      >
        <button
          type="button"
          class=${o({dropzone:!0,"is-dragging":this.dragging})}
          part="base"
          ?disabled=${this.disabled}
          aria-labelledby="heading"
          aria-describedby="hint error"
          @click=${this.handleClick}
        >
          <span class="dropzone__icon" part="icon" aria-hidden="true">
            <slot name="icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
            </slot>
          </span>
          <span class="dropzone__heading" part="heading" id="heading">
            <!-- 不使用 slot 的 fallback：host 內的換行空白也會被指派到預設 slot，使 fallback 不顯示 -->
            <slot></slot>${m(this)?t:this.heading}
          </span>
          <span class="dropzone__hint" part="hint" id="hint" ?hidden=${!i}>
            <slot name="hint">${n}</slot>
          </span>
        </button>
        <!-- live region 需常駐於 DOM 並維持顯示，訊息出現時才會被播報；沒有訊息時不佔版面 -->
        <div
          class=${o({dropzone__error:!0,"has-message":!!this.errorMessage})}
          part="error"
          id="error"
          role="alert"
        >
          ${this.errorMessage}
        </div>
      </div>
      <input
        class="dropzone__input"
        type="file"
        tabindex="-1"
        aria-hidden="true"
        accept=${f(this.accept||void 0)}
        ?multiple=${this.multiple}
        ?disabled=${this.disabled}
        @click=${this.handleInputClick}
        @change=${this.handleInputChange}
      />
    `}},l([s({type:String})],E.prototype,`accept`,void 0),l([s({type:Boolean,reflect:!0})],E.prototype,`multiple`,void 0),l([s({type:Boolean,reflect:!0})],E.prototype,`disabled`,void 0),l([s({type:String})],E.prototype,`heading`,void 0),l([s({type:String})],E.prototype,`hint`,void 0),l([s({type:String,attribute:`accept-label`})],E.prototype,`acceptLabel`,void 0),l([s({type:String,attribute:`invalid-type-message`})],E.prototype,`invalidTypeMessage`,void 0),l([s({type:String,attribute:`too-many-message`})],E.prototype,`tooManyMessage`,void 0),l([a()],E.prototype,`dragging`,void 0),l([a()],E.prototype,`errorMessage`,void 0),l([d(`input`)],E.prototype,`input`,void 0),customElements.get(`aui-dropzone`)||customElements.define(`aui-dropzone`,E)})))()}function O(){return(O=_((()=>{D()})))()}export{O as t};