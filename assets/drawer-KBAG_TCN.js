import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,t as n}from"./lit-DvaG8Cmk.js";import{t as r,u as i,v as a}from"./decorate-B5jhCMz7.js";import{i as o,n as s,r as c,t as l}from"./modal-dialog.styles-CGmijxCR.js";var u;function d(){return(d=e((()=>{n(),u=t`
  /* ─── dialog：面板貼齊左側或右側 ─── */
  .drawer {
    padding: 0;
  }

  /* ─── 遮罩 ─── */
  .drawer::backdrop {
    backdrop-filter: blur(2px);
    transition: opacity 200ms ease-out;
  }

  /* ─── 面板：全高，從所在側滑入 ─── */
  .drawer__panel {
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--aui-drawer-width, 280px);
    max-width: 85%;
    /* 瀏海與圓角螢幕的安全區域（左右側只需處理所在的一側） */
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    box-shadow: var(--shadow-drawer, 0 8px 30px rgb(0 0 0 / 25%));
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer__panel--left {
    left: 0;
    padding-left: env(safe-area-inset-left, 0px);
    border-right: 1px solid var(--color-border, #e2e8f0);
    --aui-drawer-offscreen: -100%;
  }

  .drawer__panel--right {
    right: 0;
    padding-right: env(safe-area-inset-right, 0px);
    border-left: 1px solid var(--color-border, #e2e8f0);
    --aui-drawer-offscreen: 100%;
  }

  .drawer--leaving .drawer__panel {
    transform: translateX(var(--aui-drawer-offscreen));
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  @starting-style {
    .drawer[open] .drawer__panel {
      transform: translateX(var(--aui-drawer-offscreen));
    }
  }

  /* ─── 頁首：與導覽列同高 ─── */
  .drawer__header {
    box-sizing: border-box;
    min-height: var(--nav-height, 64px);
    padding: var(--space-sm, 8px) var(--space-lg, 24px);
  }

  .drawer__title {
    font-size: var(--text-base, 1rem);
  }

  /* ─── 內容 ─── */
  .drawer__body {
    padding: var(--space-md, 16px) var(--space-lg, 24px);
    overscroll-behavior: contain;
  }

  @media (prefers-reduced-motion: reduce) {
    .drawer::backdrop,
    .drawer__panel {
      transition: none;
    }
  }
`})))()}var f;function p(){return(p=e((()=>{i(),d(),o(),s(),f=class extends c{constructor(...e){super(...e),this.placement=`left`}static{this.styles=[l(`drawer`),u]}render(){return this.renderDialog({prefix:`drawer`,panelClass:`drawer__panel--${this.placement===`right`?`right`:`left`}`})}},r([a({type:String,reflect:!0})],f.prototype,`placement`,void 0),customElements.get(`aui-drawer`)||customElements.define(`aui-drawer`,f)})))()}function m(){return(m=e((()=>{p()})))()}export{m as t};