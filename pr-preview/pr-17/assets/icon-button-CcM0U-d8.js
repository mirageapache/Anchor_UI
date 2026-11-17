import{h as e,n as t,s as n,t as r}from"./lit-MXP2jLr5.js";import{f as i,i as a,m as o,r as s,t as c,u as l}from"./decorate-BSUctFxX.js";import{t as u}from"./query-jFZ5EnhK.js";import{a as d,n as f,r as p,t as m}from"./spinner-B9tcva8l.js";import{t as h}from"./tooltip-BphZVHjf.js";import{t as g}from"./rolldown-runtime-Dh6celcD.js";var _;function v(){return(v=g((()=>{r(),_=e`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin: 0;
    flex-shrink: 0;

    /* ─── 預設懸停色彩變數 (可透過 color 屬性或 CSS 變數覆寫) ─── */
    --aui-icon-btn-color-dim: var(
      --color-brand-dim,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-brand-border,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 22%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-brand-text, #0f4c81);
  }

  :host([size='sm']) {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
    max-width: 28px;
    max-height: 28px;
  }

  :host([size='md']) {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }

  :host([size='lg']) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* 內建 aui-tooltip 包裝器自動填滿宿主容器且維持等比例 */
  aui-tooltip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
  }

  aui-tooltip::part(trigger) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
  }

  /* ─── 核心圖示按鈕 (.icon-btn) ─── */
  .icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    margin: 0;
    padding: 0 !important;
    line-height: 1;
    font-size: 0;
    font-family: inherit;
    border: 1px solid transparent;
    border-radius: var(--radius-sm, 6px);
    background: transparent;
    color: var(--color-text-secondary, #475569);
    cursor: pointer;
    user-select: none;
    outline: none;
    flex-shrink: 0;
    overflow: hidden;
    transition:
      background-color var(--transition-base, 150ms ease),
      border-color var(--transition-base, 150ms ease),
      box-shadow var(--transition-base, 150ms ease),
      color var(--transition-base, 150ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  /* 尺寸精準等比控制 (Strict 1:1 Size Overrides) */
  .icon-btn--sm {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
    max-width: 28px;
    max-height: 28px;
  }

  .icon-btn--md {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }

  .icon-btn--lg {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }

  /* ─── 形狀變體 (Shape Variations) ─── */
  .icon-btn--rounded {
    border-radius: var(--radius-sm, 6px);
  }

  .icon-btn--circle {
    border-radius: 50% !important;
  }

  .icon-btn--square {
    border-radius: 0 !important;
  }

  /* ─── 點擊反饋 (Active State - 保持穩定等比例無縮放變形) ─── */
  .icon-btn:active:not(:disabled):not(.is-disabled):not(.is-loading) {
    transform: none;
  }

  /* ─── 樣式變體 (Variants) 與清晰 Hover 回饋 ─── */

  /* 1. Ghost (預設：透明底、懸停高可視度半透明背景與線框) */
  .icon-btn--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--color-text-secondary, #475569);
  }

  .icon-btn--ghost:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(
      --aui-icon-btn-hover-bg,
      var(
        --aui-icon-btn-color-dim,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
      )
    );
    border-color: var(
      --aui-icon-btn-hover-border,
      var(
        --aui-icon-btn-color-border,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 22%, transparent)
      )
    );
    color: var(
      --aui-icon-btn-hover-color,
      var(--aui-icon-btn-color-text, var(--color-brand-text, #0f4c81))
    );
  }

  /* 2. Subtle (淺次級底色、懸停深色襯底) */
  .icon-btn--subtle {
    background: var(--color-surface, #f1f5f9);
    border-color: var(--color-border, #e2e8f0);
    color: var(--color-text-secondary, #475569);
  }

  .icon-btn--subtle:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(
      --aui-icon-btn-hover-bg,
      var(
        --aui-icon-btn-color-dim,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 14%, transparent)
      )
    );
    border-color: var(
      --aui-icon-btn-hover-border,
      var(
        --aui-icon-btn-color-border,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 28%, transparent)
      )
    );
    color: var(
      --aui-icon-btn-hover-color,
      var(--aui-icon-btn-color-text, var(--color-brand-text, #0f4c81))
    );
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  /* 3. Outline (清晰線框與微白底) */
  .icon-btn--outline {
    background: var(--color-base, #ffffff);
    border-color: var(--color-ghost-border, #cbd5e1);
    color: var(--color-text-secondary, #475569);
  }

  .icon-btn--outline:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    border-color: var(
      --aui-icon-btn-hover-border,
      var(--aui-icon-btn-color-border, var(--color-brand-500, #1b6ca8))
    );
    background: var(
      --aui-icon-btn-hover-bg,
      var(
        --aui-icon-btn-color-dim,
        color-mix(in srgb, var(--color-brand-600, #0f4c81) 10%, transparent)
      )
    );
    color: var(
      --aui-icon-btn-hover-color,
      var(--aui-icon-btn-color-text, var(--color-brand-text, #0f4c81))
    );
    box-shadow: var(--shadow-sm, 0 1px 3px rgb(0 0 0 / 8%));
  }

  /* 4. Primary (海軍藍實心底、懸停加亮與發光) */
  .icon-btn--primary {
    background: var(--color-brand-600, #0f4c81);
    color: var(--color-on-solid, #ffffff);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--color-brand-600, #0f4c81) 20%, transparent);
  }

  .icon-btn--primary:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(--color-brand-700, #0a3356);
    filter: brightness(1.1);
    box-shadow: 0 2px 6px color-mix(in srgb, var(--color-brand-600, #0f4c81) 35%, transparent);
  }

  /* 5. Danger (破壞性操作) */
  .icon-btn--danger {
    background: transparent;
    border-color: transparent;
    color: var(--color-danger, #ef4444);
  }

  .icon-btn--danger:hover:not(:disabled):not(.is-disabled):not(.is-active) {
    background: var(
      --aui-icon-btn-hover-bg,
      var(--color-danger-dim, color-mix(in srgb, #ef4444 10%, transparent))
    );
    border-color: var(
      --aui-icon-btn-hover-border,
      var(--color-danger-border, color-mix(in srgb, #ef4444 25%, transparent))
    );
    color: var(--aui-icon-btn-hover-color, var(--color-danger-hover, #dc2626));
  }

  /* ─── 色彩語意控制 (Color Attribute & Semantic Theme Hooks) ─── */
  /* 支援 color="brand" | "accent" | "success" | "warning" | "danger" | "info" | "purple" | "neutral" */
  :host([color='brand']),
  .icon-btn--color-brand {
    --aui-icon-btn-color-dim: var(
      --color-brand-dim,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 12%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-brand-border,
      color-mix(in srgb, var(--color-brand-600, #0f4c81) 22%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-brand-text, #0f4c81);
  }

  :host([color='accent']),
  .icon-btn--color-accent {
    --aui-icon-btn-color-dim: var(--color-accent-dim, color-mix(in srgb, #f59e0b 14%, transparent));
    --aui-icon-btn-color-border: var(
      --color-accent-border,
      color-mix(in srgb, #f59e0b 30%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-accent-text, #92400e);
  }

  :host([color='warning']),
  .icon-btn--color-warning {
    --aui-icon-btn-color-dim: var(
      --color-warning-dim,
      color-mix(in srgb, #f59e0b 14%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-warning-border,
      color-mix(in srgb, #f59e0b 30%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-warning-text, #92400e);
  }

  :host([color='success']),
  .icon-btn--color-success {
    --aui-icon-btn-color-dim: var(
      --color-success-dim,
      color-mix(in srgb, #10b981 10%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-success-border,
      color-mix(in srgb, #10b981 28%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-success-text, #047857);
  }

  :host([color='danger']),
  .icon-btn--color-danger {
    --aui-icon-btn-color-dim: var(--color-danger-dim, color-mix(in srgb, #ef4444 10%, transparent));
    --aui-icon-btn-color-border: var(
      --color-danger-border,
      color-mix(in srgb, #ef4444 25%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-danger-text, #b91c1c);
  }

  :host([color='info']),
  .icon-btn--color-info {
    --aui-icon-btn-color-dim: var(--color-info-dim, color-mix(in srgb, #0284c7 12%, transparent));
    --aui-icon-btn-color-border: var(
      --color-info-border,
      color-mix(in srgb, #0284c7 25%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-info-text, #0369a1);
  }

  :host([color='purple']),
  .icon-btn--color-purple {
    --aui-icon-btn-color-dim: var(--color-purple-dim, color-mix(in srgb, #8b5cf6 12%, transparent));
    --aui-icon-btn-color-border: var(
      --color-purple-border,
      color-mix(in srgb, #8b5cf6 25%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-purple-text, #6d28d9);
  }

  :host([color='neutral']),
  .icon-btn--color-neutral {
    --aui-icon-btn-color-dim: var(
      --color-neutral-dim,
      color-mix(in srgb, var(--color-text-secondary, #475569) 14%, transparent)
    );
    --aui-icon-btn-color-border: var(
      --color-neutral-border,
      color-mix(in srgb, var(--color-text-secondary, #475569) 24%, transparent)
    );
    --aui-icon-btn-color-text: var(--color-neutral-text, #334155);
  }

  /* ─── 成功回饋狀態 (Active & Success Feedback - 翡翠綠 Success 主題) ─── */
  .icon-btn.is-active,
  .icon-btn.is-success {
    background: var(--color-success-dim, color-mix(in srgb, #10b981 10%, transparent)) !important;
    color: var(--color-success-text, #047857) !important;
    border-color: var(
      --color-success-border,
      color-mix(in srgb, #10b981 28%, transparent)
    ) !important;
    box-shadow: 0 0 0 3px
      color-mix(
        in srgb,
        var(--color-success-border, color-mix(in srgb, #10b981 28%, transparent)) 40%,
        transparent
      ) !important;
    animation: pulse-ring 600ms cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* 錯誤反饋狀態 */
  .icon-btn.is-error {
    background: var(--color-danger-dim, color-mix(in srgb, #ef4444 10%, transparent)) !important;
    color: var(--color-danger, #ef4444) !important;
    border-color: var(
      --color-danger-border,
      color-mix(in srgb, #ef4444 25%, transparent)
    ) !important;
  }

  /* ─── Focus 雙層無障礙焦點環 ─── */
  .icon-btn:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-500, #1b6ca8) 25%, transparent);
  }

  .icon-btn:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }

  /* ─── 停用狀態 ─── */
  .icon-btn:disabled,
  .icon-btn.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
    transform: none;
  }

  /* ─── 圖示容器與尺寸 (Icon Sizing) ─── */
  .icon-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    max-width: 18px;
    max-height: 18px;
    aspect-ratio: 1 / 1;
    margin: 0;
    padding: 0;
    pointer-events: none;
    flex-shrink: 0;
  }

  .icon-btn--sm .icon-wrapper {
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    max-width: 14px;
    max-height: 14px;
  }

  .icon-btn--md .icon-wrapper {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    max-width: 18px;
    max-height: 18px;
  }

  .icon-btn--lg .icon-wrapper {
    width: 22px;
    height: 22px;
    min-width: 22px;
    min-height: 22px;
    max-width: 22px;
    max-height: 22px;
  }

  .icon-wrapper svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: block;
    flex-shrink: 0;
  }

  .icon-wrapper ::slotted(*) {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: block;
    box-sizing: border-box;
  }

  /* ─── 狀態分層動畫 (State Layers & Smooth Cross-fade) ─── */
  .icon-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    transition: opacity var(--transition-base, 150ms ease);
  }

  /* 靜態閒置圖示 (Idle) */
  .icon-layer--idle {
    opacity: 1;
  }

  .icon-layer--idle.is-hidden {
    opacity: 0;
    pointer-events: none;
  }

  /* 成功微動態圖示 (Success Checkmark) */
  .icon-layer--success {
    opacity: 0;
    pointer-events: none;
  }

  .icon-layer--success.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* 載入中 Spinner 圖示 */
  .icon-layer--loading {
    opacity: 0;
    pointer-events: none;
  }

  .icon-layer--loading.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* Spinner 動畫由共用的 spinnerStyles（src/internal/spinner.ts）提供 */

  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 var(--color-success-border, color-mix(in srgb, #10b981 28%, transparent));
    }
    60% {
      box-shadow: 0 0 0 6px transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  /* ─── 螢幕閱讀器專用即時播報 (Screen Reader Only) ─── */
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
    .icon-btn,
    .icon-layer {
      transition: none !important;
    }

    .icon-btn.is-active,
    .icon-btn.is-success {
      animation: none !important;
    }
  }
`})))()}function y(e){try{let t=new URL(e,document.baseURI);return S.has(t.protocol)?t:null}catch{return null}}var b,x,S,C;function w(){return(w=g((()=>{r(),l(),s(),v(),m(),h(),b={copy:{label:`複製`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
      </svg>
    `},download:{label:`下載`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    `},check:{label:`確認`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `},close:{label:`關閉`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `},refresh:{label:`重新整理`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
      </svg>
    `},external:{label:`另開新視窗`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    `},more:{label:`更多選項`,icon:n`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="1.5"></circle>
        <circle cx="19" cy="12" r="1.5"></circle>
        <circle cx="5" cy="12" r="1.5"></circle>
      </svg>
    `}},x={copy:`已複製！`,download:`已下載！`},S=new Set([`http:`,`https:`,`blob:`,`data:`]),C=class extends t{static{this.styles=[p,_]}static{this.shadowRootOptions={...t.shadowRootOptions,delegatesFocus:!0}}constructor(){super(),this.feedbackTimer=null,this.variant=`ghost`,this.color=`brand`,this.size=`md`,this.shape=`rounded`,this.action=`none`,this.copyValue=``,this.downloadUrl=``,this.downloadFilename=``,this.tooltip=``,this.successTooltip=``,this.tooltipPlacement=`top`,this.noTooltip=!1,this.label=``,this.disabled=!1,this.loading=!1,this.active=!1,this.status=`idle`,this.feedbackDuration=2e3,this.announcement=``,this.handleHostClick=async e=>{if(d(e,this.disabled||this.isBusy))return;let t=this.computeEffectiveAction();t===`copy`?(e.preventDefault(),await this.copy()):t===`download`&&(e.preventDefault(),await this.download())},this.addEventListener(`click`,this.handleHostClick,{capture:!0})}disconnectedCallback(){super.disconnectedCallback(),this.clearFeedbackTimer()}computeEffectiveAction(){return this.action&&this.action!==`none`?this.action:this.preset===`copy`||this.preset===`download`?this.preset:this.copyValue?`copy`:this.downloadUrl?`download`:`none`}computeSuccessTooltip(){return this.successTooltip||x[this.computeEffectiveAction()]||`操作成功！`}computeIdleTooltip(){return this.tooltip||(this.preset?b[this.preset]?.label:``)||``}computeAriaLabel(){return this.label||this.computeIdleTooltip()||`按鈕`}get isBusy(){return this.loading||this.status===`loading`}get hasTooltip(){return!this.noTooltip&&!!(this.tooltip||this.preset)}async copy(){if(this.disabled||this.isBusy)return!1;let e=this.copyValue;try{if(!e)throw Error(`沒有可複製的內容：copy-value 為空`);if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(e);else{let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.left=`-9999px`,t.style.top=`-9999px`,t.setAttribute(`readonly`,``),document.body.appendChild(t),t.select();let n=document.execCommand(`copy`);if(document.body.removeChild(t),!n)throw Error(`execCommand copy failed`)}return this.triggerFeedback(`success`),this.dispatchEvent(new CustomEvent(`aui-copy`,{detail:{value:e},bubbles:!0,composed:!0})),!0}catch(e){return this.triggerFeedback(`error`),this.dispatchEvent(new CustomEvent(`aui-copy-error`,{detail:{error:e},bubbles:!0,composed:!0})),!1}}async download(){if(this.disabled||this.isBusy)return!1;let e=this.downloadUrl,t=e?y(e):null;if(e&&!t)return this.triggerFeedback(`error`),this.dispatchEvent(new CustomEvent(`aui-download-error`,{detail:{url:e,error:Error(`不允許的下載網址協定：${e}`)},bubbles:!0,composed:!0})),!1;let n=new CustomEvent(`aui-download`,{detail:{url:e,filename:this.downloadFilename},bubbles:!0,composed:!0,cancelable:!0});if(this.dispatchEvent(n),n.defaultPrevented||!t)return!1;let r=document.createElement(`a`);return r.href=t.href,(t.protocol===`http:`||t.protocol===`https:`)&&t.origin!==window.location.origin?(r.target=`_blank`,r.rel=`noopener noreferrer`):this.downloadFilename&&(r.download=this.downloadFilename),document.body.appendChild(r),r.click(),document.body.removeChild(r),this.triggerFeedback(`success`),!0}triggerFeedback(e=`success`){this.clearFeedbackTimer(),this.setStatus(e),this.hasTooltip&&this.showTooltipTemporarily(),this.feedbackTimer=window.setTimeout(()=>this.resetFeedback(),this.feedbackDuration)}resetFeedback(){this.clearFeedbackTimer(),this.setStatus(`idle`),this.hideTooltipIfShown()}clearFeedbackTimer(){this.feedbackTimer&&=(window.clearTimeout(this.feedbackTimer),null)}setStatus(e){let t=this.status;this.status=e,this.active=e===`success`,this.announcement=e===`success`?this.computeSuccessTooltip():e===`error`?`操作失敗`:``,t!==e&&this.dispatchEvent(new CustomEvent(`aui-status-change`,{detail:{status:e,previousStatus:t},bubbles:!0,composed:!0}))}showTooltipTemporarily(){this.tooltipElement&&!this.tooltipElement.disabled&&this.tooltipElement.show()}hideTooltipIfShown(){this.tooltipElement?.hide()}renderIdleIcon(){return this.preset&&b[this.preset]?b[this.preset].icon:n`
      <slot name="icon">
        <slot></slot>
      </slot>
    `}renderSuccessIcon(){return n` <slot name="success-icon"> ${b.check.icon} </slot> `}renderLoadingIcon(){return n` <slot name="loading-icon"> ${f} </slot> `}render(){let e=this.isBusy,t=this.disabled||e,r=this.status===`success`,i=this.status===`error`,o=r?this.computeSuccessTooltip():this.computeIdleTooltip(),s=this.computeAriaLabel(),c=n`
      <button
        part="button"
        class=${a({"icon-btn":!0,[`icon-btn--${this.variant}`]:!0,[`icon-btn--${this.size}`]:!0,[`icon-btn--${this.shape}`]:!0,[`icon-btn--color-${this.color}`]:!!this.color,"is-active":this.active||r,"is-success":r,"is-error":i,"is-loading":e,"is-disabled":this.disabled})}
        type="button"
        ?disabled=${this.disabled}
        aria-label=${s}
        aria-busy=${e?`true`:`false`}
        aria-disabled=${t?`true`:`false`}
      >
        <span class="icon-wrapper" part="icon-wrapper">
          <!-- 1. 閒置圖示層 -->
          <span
            part="idle-icon"
            class=${a({"icon-layer":!0,"icon-layer--idle":!0,"is-hidden":r||e})}
            aria-hidden="true"
          >
            ${this.renderIdleIcon()}
          </span>

          <!-- 2. 成功打勾圖示層 -->
          <span
            part="success-icon"
            class=${a({"icon-layer":!0,"icon-layer--success":!0,"is-visible":r})}
            aria-hidden="true"
          >
            ${this.renderSuccessIcon()}
          </span>

          <!-- 3. 載入中 Spinner 圖示層 -->
          <span
            part="loading-icon"
            class=${a({"icon-layer":!0,"icon-layer--loading":!0,"is-visible":e})}
            aria-hidden="true"
          >
            ${this.renderLoadingIcon()}
          </span>
        </span>
      </button>
    `,l=n`
      <span class="sr-only" role="status" aria-live="polite">${this.announcement}</span>
    `;return this.hasTooltip&&o?n`
        <aui-tooltip
          part="tooltip"
          .content=${o}
          .placement=${this.tooltipPlacement}
          ?disabled=${this.disabled}
        >
          ${c}
        </aui-tooltip>
        ${l}
      `:n`${c}${l}`}},c([u(`aui-tooltip`)],C.prototype,`tooltipElement`,void 0),c([o({type:String,reflect:!0})],C.prototype,`variant`,void 0),c([o({type:String,reflect:!0})],C.prototype,`color`,void 0),c([o({type:String,reflect:!0})],C.prototype,`size`,void 0),c([o({type:String,reflect:!0})],C.prototype,`shape`,void 0),c([o({type:String,reflect:!0})],C.prototype,`preset`,void 0),c([o({type:String,reflect:!0})],C.prototype,`action`,void 0),c([o({type:String,attribute:`copy-value`})],C.prototype,`copyValue`,void 0),c([o({type:String,attribute:`download-url`})],C.prototype,`downloadUrl`,void 0),c([o({type:String,attribute:`download-filename`})],C.prototype,`downloadFilename`,void 0),c([o({type:String})],C.prototype,`tooltip`,void 0),c([o({type:String,attribute:`success-tooltip`})],C.prototype,`successTooltip`,void 0),c([o({type:String,attribute:`tooltip-placement`})],C.prototype,`tooltipPlacement`,void 0),c([o({type:Boolean,attribute:`no-tooltip`})],C.prototype,`noTooltip`,void 0),c([o({type:String,reflect:!0})],C.prototype,`label`,void 0),c([o({type:Boolean,reflect:!0})],C.prototype,`disabled`,void 0),c([o({type:Boolean,reflect:!0})],C.prototype,`loading`,void 0),c([o({type:Boolean,reflect:!0})],C.prototype,`active`,void 0),c([o({type:String,reflect:!0})],C.prototype,`status`,void 0),c([o({type:Number,attribute:`feedback-duration`})],C.prototype,`feedbackDuration`,void 0),c([i()],C.prototype,`announcement`,void 0),customElements.get(`aui-icon-button`)||customElements.define(`aui-icon-button`,C)})))()}function T(){return(T=g((()=>{w()})))()}export{T as t};