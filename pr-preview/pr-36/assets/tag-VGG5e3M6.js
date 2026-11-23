import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{i as o,r as s,t as c,u as l,v as u}from"./decorate-B5jhCMz7.js";var d;function f(){return(f=e((()=>{a(),d=t`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 標籤本體容器 ─── */
  .tag {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-none, 1);
    letter-spacing: 0.02em;
    text-transform: lowercase; /* 全小寫標籤規範 (TASK-102) */
    white-space: nowrap;
    user-select: none;
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-surface, #f1f5f9);
    color: var(--color-text-secondary, #475569);
    transition:
      background-color var(--transition-fast, 100ms ease),
      border-color var(--transition-fast, 100ms ease),
      color var(--transition-fast, 100ms ease),
      box-shadow var(--transition-fast, 100ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  /* ─── 大小寫保留例外開關 ─── */
  :host([preserve-case]) .tag,
  .tag--preserve-case {
    text-transform: none;
  }

  /* ─── 尺寸規格 (Sizes) ─── */
  .tag--sm {
    min-height: 20px;
    padding: 2px 8px;
    font-size: var(--text-2xs, 0.6875rem);
    gap: var(--space-xs, 4px);
  }

  .tag--md {
    min-height: 24px;
    padding: 3px 10px;
    font-size: var(--text-xs, 0.75rem);
    gap: 6px;
  }

  .tag--lg {
    min-height: 28px;
    padding: 4px 12px;
    font-size: var(--text-sm, 0.875rem);
    gap: 6px;
  }

  /* ─── 膠囊圓角形狀 (Pill Shape) ─── */
  :host([pill]) .tag,
  .tag--pill {
    border-radius: var(--radius-pill, 9999px);
  }

  /* ─── 7 種語意色彩變體與相容別名 ─── */
  /* 1. Brand (Navy / Deep Blue 品牌深海軍藍) */
  .tag--brand,
  .tag--deep-blue {
    color: var(--color-brand-text, #0f4c81);
    background-color: var(--color-brand-dim, rgba(15, 76, 129, 0.12));
    border-color: var(--color-brand-border, rgba(15, 76, 129, 0.25));
  }

  /* 2. Success (Emerald / Green) */
  .tag--success,
  .tag--green {
    color: var(--color-success-text, #047857);
    background-color: var(--color-success-dim, rgba(16, 185, 129, 0.1));
    border-color: var(--color-success-border, rgba(16, 185, 129, 0.28));
  }

  /* 3. Warning (Amber / Accent) */
  .tag--warning,
  .tag--amber,
  .tag--accent {
    color: var(--color-warning-text, #92400e);
    background-color: var(--color-warning-dim, rgba(245, 158, 11, 0.14));
    border-color: var(--color-warning-border, rgba(245, 158, 11, 0.3));
  }

  /* 4. Purple (Violet) */
  .tag--purple {
    color: var(--color-purple-text, #6d28d9);
    background-color: var(--color-purple-dim, rgba(139, 92, 246, 0.12));
    border-color: var(--color-purple-border, rgba(139, 92, 246, 0.25));
  }

  /* 5. Danger (Red) */
  .tag--danger,
  .tag--red {
    color: var(--color-danger-text, #b91c1c);
    background-color: var(--color-danger-dim, rgba(239, 68, 68, 0.1));
    border-color: var(--color-danger-border, rgba(239, 68, 68, 0.25));
  }

  /* 6. Info (Blue / Sky Blue 天空藍、資訊藍) */
  .tag--info,
  .tag--blue {
    color: var(--color-info-text, #0369a1);
    background-color: var(--color-info-dim, rgba(2, 132, 199, 0.12));
    border-color: var(--color-info-border, rgba(2, 132, 199, 0.25));
  }

  /* 7. Neutral (Slate) */
  .tag--neutral {
    color: var(--color-neutral-text, #334155);
    background-color: var(--color-neutral-dim, rgba(100, 116, 139, 0.1));
    border-color: var(--color-neutral-border, rgba(100, 116, 139, 0.22));
  }

  /* ─── 互動式標籤 (Interactive / Clickable Filter Tag) ─── */
  :host([interactive]) {
    cursor: pointer;
    outline: none;
  }

  .tag--interactive {
    cursor: pointer;
  }

  /*
   * 懸停時以文字色（currentColor）在底色上疊一層淡色：
   * 淺色主題文字深 → 變深、深色主題文字亮 → 變亮，不需 :host-context()（Firefox / Safari 不支援）
   */
  .tag--interactive:hover {
    background-image: linear-gradient(
      color-mix(in srgb, currentColor 8%, transparent),
      color-mix(in srgb, currentColor 8%, transparent)
    );
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  .tag--interactive:active {
    transform: scale(0.97);
  }

  /* 焦點位於 shadow 內的 action 元素，焦點環畫在整顆標籤外框上 */
  .tag:has(.tag__action:focus-visible) {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* ─── 內容與插槽佈局 ─── */
  .tag__action {
    display: inline-flex;
    align-items: center;
    gap: inherit;
    outline: none;
  }

  .tag__prefix,
  .tag__suffix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1;
  }

  .tag__content {
    display: inline-flex;
    align-items: center;
    line-height: inherit;
  }

  /* ─── 可移除按鈕 (Remove Button) ─── */
  .tag__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    padding: 0;
    margin: 0 -2px 0 2px;
    border: none;
    border-radius: var(--radius-sm, 6px);
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    line-height: 1;
    opacity: 0.65;
    outline: none;
    transition:
      opacity var(--transition-fast, 100ms ease),
      background-color var(--transition-fast, 100ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  .tag--md .tag__remove {
    width: 16px;
    height: 16px;
    margin: 0 -3px 0 2px;
  }

  .tag--lg .tag__remove {
    width: 18px;
    height: 18px;
    margin: 0 -4px 0 4px;
  }

  .tag__remove:hover {
    opacity: 1;
    background-color: color-mix(in srgb, currentColor 20%, transparent);
  }

  .tag__remove:active {
    transform: scale(0.9);
  }

  .tag__remove:focus-visible {
    opacity: 1;
    outline: 1px solid currentColor;
    outline-offset: 1px;
  }

  .tag__remove svg {
    display: block;
    width: 0.75em;
    height: 0.75em;
  }

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .tag,
    .tag__remove {
      transition: none !important;
      transform: none !important;
    }
  }
`})))()}var p;function m(){return(m=e((()=>{a(),l(),s(),f(),p=class extends r{constructor(...e){super(...e),this.variant=`neutral`,this.size=`sm`,this.pill=!1,this.preserveCase=!1,this.removable=!1,this.interactive=!1,this.removeLabel=`移除標籤`,this.handleActionKeyDown=e=>{this.interactive&&!e.repeat&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.click())},this.handleRemoveClick=e=>{e.stopPropagation();let t=new CustomEvent(`aui-remove`,{bubbles:!0,composed:!0,cancelable:!0,detail:{tag:this}});this.dispatchEvent(t)}}static{this.styles=d}static{this.shadowRootOptions={...r.shadowRootOptions,delegatesFocus:!0}}render(){return i`
      <span
        part="base"
        class=${o({tag:!0,[`tag--${this.variant}`]:!!this.variant,[`tag--${this.size}`]:!!this.size,"tag--pill":this.pill,"tag--preserve-case":this.preserveCase,"tag--interactive":this.interactive,"tag--removable":this.removable})}
      >
        <span
          class="tag__action"
          part="action"
          role=${this.interactive?`button`:n}
          tabindex=${this.interactive?`0`:n}
          @keydown=${this.handleActionKeyDown}
        >
          <span class="tag__prefix" part="prefix">
            <slot name="prefix"></slot>
          </span>

          <span class="tag__content" part="content">
            <slot></slot>
          </span>

          <span class="tag__suffix" part="suffix">
            <slot name="suffix"></slot>
          </span>
        </span>

        ${this.removable?i`
                <button
                  type="button"
                  class="tag__remove"
                  part="remove-button"
                  aria-label=${this.removeLabel}
                  @click=${this.handleRemoveClick}
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <title>${this.removeLabel}</title>
                    <rect width="16" height="16" fill="transparent" />
                    <path
                      d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
                    />
                  </svg>
                </button>
              `:n}
      </span>
    `}},c([u({type:String,reflect:!0})],p.prototype,`variant`,void 0),c([u({type:String,reflect:!0})],p.prototype,`size`,void 0),c([u({type:Boolean,reflect:!0})],p.prototype,`pill`,void 0),c([u({type:Boolean,reflect:!0,attribute:`preserve-case`})],p.prototype,`preserveCase`,void 0),c([u({type:Boolean,reflect:!0})],p.prototype,`removable`,void 0),c([u({type:Boolean,reflect:!0})],p.prototype,`interactive`,void 0),c([u({type:String,attribute:`remove-label`})],p.prototype,`removeLabel`,void 0),customElements.get(`aui-tag`)||customElements.define(`aui-tag`,p)})))()}function h(){return(h=e((()=>{m()})))()}export{h as t};