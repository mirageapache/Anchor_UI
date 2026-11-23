import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,t as n}from"./lit-Bfdqhiqf.js";import{m as r,t as i,u as a}from"./decorate-mVVnLxoL.js";import{i as o,n as s,r as c,t as l}from"./modal-dialog.styles-6_LhyQwY.js";var u;function d(){return(d=e((()=>{n(),u=t`
  /* ─── dialog：面板置中 ─── */
  .modal {
    padding: var(--space-md, 16px);
  }

  .modal[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ─── 遮罩：模糊背景 ─── */
  .modal::backdrop {
    backdrop-filter: blur(4px);
    transition: opacity 180ms ease-out;
  }

  /* ─── 面板：縮放彈出 ─── */
  .modal__panel {
    width: 100%;
    max-height: 100%;
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: var(--radius-xl, 16px);
    box-shadow: var(--shadow-modal, 0 25px 50px -12px rgb(0 0 0 / 35%));
    opacity: 1;
    transition:
      opacity 180ms ease-out,
      transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal--leaving .modal__panel {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }

  @starting-style {
    .modal[open] .modal__panel {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
  }

  .modal__panel--sm {
    max-width: 420px;
  }

  .modal__panel--md {
    max-width: 600px;
  }

  .modal__panel--lg {
    max-width: 840px;
  }

  /* ─── 頁首、內容、頁尾 ─── */
  .modal__header {
    padding: var(--space-md, 16px) var(--space-lg, 24px);
  }

  .modal__title {
    font-size: var(--text-lg, 1.125rem);
  }

  .modal__body {
    padding: var(--space-lg, 24px);
  }

  .modal__footer {
    justify-content: flex-end;
  }

  @media (prefers-reduced-motion: reduce) {
    .modal::backdrop,
    .modal__panel {
      transition: none;
    }

    .modal__panel {
      transform: none;
    }
  }
`})))()}var f;function p(){return(p=e((()=>{a(),d(),o(),s(),f=class extends c{constructor(...e){super(...e),this.size=`md`,this.dialogRole=`dialog`}static{this.styles=[l(`modal`),u]}render(){return this.renderDialog({prefix:`modal`,panelClass:`modal__panel--${this.size}`,role:this.dialogRole===`alertdialog`?`alertdialog`:void 0})}},i([r({type:String,reflect:!0})],f.prototype,`size`,void 0),i([r({type:String,attribute:`dialog-role`})],f.prototype,`dialogRole`,void 0),customElements.get(`aui-modal`)||customElements.define(`aui-modal`,f)})))()}function m(){return(m=e((()=>{p()})))()}export{m as t};