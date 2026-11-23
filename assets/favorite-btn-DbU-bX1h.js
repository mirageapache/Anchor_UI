import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,n,s as r,t as i}from"./lit-DvaG8Cmk.js";import{i as a,p as o,r as s,t as c,u as l,v as u}from"./decorate-B5jhCMz7.js";var d;function f(){return(f=e((()=>{i(),d=t`
  :host {
    /* inline-flex：host 的大小等於按鈕本身，不受所在行的字級與行高影響（例如放在大標題旁） */
    display: inline-flex;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 按鈕本體 ─── */
  .fav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: var(--space-xs, 4px);
    margin: 0;
    font: inherit;
    /* 規格為 text-muted；改用 text-secondary，讓未收藏的線條在深色主題的容器（--color-base）上仍達 3:1 */
    color: var(--color-text-secondary, #475569);
    background: transparent;
    border: none;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition:
      color var(--transition-fast, 100ms ease),
      transform var(--transition-fast, 100ms ease);
  }

  /*
   * 已收藏：線條為加深的琥珀色（accent-hover，同規格的 #d97706），填色為 accent。
   * 懸停：規格的線條色 #f59e0b 在白底上對比只有 2.15:1（WCAG 1.4.11 需 3:1），同樣改用 accent-hover。
   */
  .fav-btn.is-favorite {
    color: var(--color-accent-hover, #d97706);
  }

  /* 只在支援懸停的裝置套用：觸控裝置點擊後 :hover 會殘留，取消收藏後仍顯示放大的琥珀色外框 */
  @media (hover: hover) {
    .fav-btn:hover:not(:disabled) {
      color: var(--color-accent-hover, #d97706);
      transform: scale(1.1);
    }
  }

  .fav-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .fav-btn:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  .fav-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* ─── 星號圖示 ─── */
  .fav-btn__icon {
    display: block;
    width: 20px;
    height: 20px;
    transition: fill var(--transition-fast, 100ms ease);
  }

  .fav-btn--sm .fav-btn__icon {
    width: 16px;
    height: 16px;
  }

  .fav-btn--lg .fav-btn__icon {
    width: 24px;
    height: 24px;
  }

  /* 已收藏：實心琥珀色 */
  .fav-btn.is-favorite .fav-btn__icon {
    fill: var(--color-accent, #f59e0b);
  }

  /* 切換時的微縮放彈跳以 Web Animations API 播放（見 favorite-btn.ts） */

  /* ─── 無障礙動態降級 ─── */
  @media (prefers-reduced-motion: reduce) {
    .fav-btn,
    .fav-btn__icon {
      transition: none !important;
      transform: none !important;
    }
  }
`})))()}var p,m,h,g,_;function v(){return(v=e((()=>{i(),l(),s(),f(),p=[{transform:`scale(1)`},{transform:`scale(1.3)`,offset:.4},{transform:`scale(0.92)`,offset:.7},{transform:`scale(1)`}],m=320,h=`我的最愛`,g=new Set([`sm`,`md`,`lg`]),_=class extends n{constructor(...e){super(...e),this.favorite=!1,this.disabled=!1,this.size=`md`,this.label=h,this.handleClick=()=>{if(this.disabled)return;let e=!this.favorite;this.favorite=e,this.dispatchEvent(new CustomEvent(`aui-change`,{detail:{favorite:e},bubbles:!0,composed:!0})),this.favorite===e&&this.bounce()}}static{this.styles=d}static{this.shadowRootOptions={...n.shadowRootOptions,delegatesFocus:!0}}bounce(){this.icon?.animate&&(window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches||(this.bounceAnimation?.cancel(),this.bounceAnimation=this.icon.animate(p,{duration:m,easing:`ease`})))}render(){let e=g.has(this.size)?this.size:`md`,t=this.label||h;return r`
      <button
        type="button"
        class=${a({"fav-btn":!0,[`fav-btn--${e}`]:!0,"is-favorite":this.favorite})}
        part="base"
        aria-pressed=${this.favorite?`true`:`false`}
        aria-label=${t}
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      >
        <svg
          class="fav-btn__icon"
          part="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <title>${t}</title>
          <rect width="24" height="24" fill="transparent" stroke="none" />
          <path
            d="M12 3.5l2.63 5.33 5.87.86-4.25 4.14 1 5.85L12 16.92l-5.25 2.76 1-5.85L3.5 9.69l5.87-.86L12 3.5z"
          />
        </svg>
      </button>
    `}},c([u({type:Boolean,reflect:!0})],_.prototype,`favorite`,void 0),c([u({type:Boolean,reflect:!0})],_.prototype,`disabled`,void 0),c([u({type:String,reflect:!0})],_.prototype,`size`,void 0),c([u({type:String})],_.prototype,`label`,void 0),c([o(`.fav-btn__icon`)],_.prototype,`icon`,void 0),customElements.get(`aui-favorite-btn`)||customElements.define(`aui-favorite-btn`,_)})))()}function y(){return(y=e((()=>{v()})))()}export{y as t};