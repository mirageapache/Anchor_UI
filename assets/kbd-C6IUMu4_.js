import{h as e,n as t,s as n,t as r}from"./lit-MXP2jLr5.js";import{i,m as a,r as o,t as s,u as c}from"./decorate-BSUctFxX.js";import{t as l}from"./rolldown-runtime-Dh6celcD.js";var u;function d(){return(d=l((()=>{r(),u=e`
  :host {
    /* inline-flex：host 的大小等於鍵帽本身，不受所在行的字級與行高影響 */
    display: inline-flex;
    vertical-align: middle;
    /*
     * 鍵帽不參與行高計算：設計系統的標準內文為 14px × 1.5 = 21px，
     * 沒有負的區塊外距時，含鍵帽的那幾行會被撐高，多行段落的行距就不一致。
     */
    margin-block: -2px;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ─── 鍵帽本體 ─── */
  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    margin: 0;
    font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', 'Menlo', monospace);
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
    line-height: var(--leading-none, 1);
    white-space: nowrap;
    color: var(--color-text-secondary, #475569);
    background-color: var(--color-surface, #f1f5f9);
    border: 1px solid var(--color-ghost-border, #cbd5e1);
    /* 微立體：下緣加厚的邊框模擬鍵帽厚度 */
    border-bottom-width: 2px;
    border-radius: var(--radius-sm, 6px);
  }

  .kbd--sm {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    font-size: var(--text-2xs, 0.6875rem);
  }
`})))()}var f,p;function m(){return(m=l((()=>{r(),c(),o(),d(),f=new Set([`sm`,`md`]),p=class extends t{static{this.styles=u}constructor(){super(),this.size=`md`,this.label=``,this.internals=typeof this.attachInternals==`function`?this.attachInternals():null}willUpdate(e){e.has(`label`)&&this.applyLabel()}applyLabel(){let e=this.label.trim();if(this.internals){this.internals.role=e?`img`:null,this.internals.ariaLabel=e||null;return}e?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,e)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`))}render(){let e=f.has(this.size)?this.size:`md`;return n`<kbd class=${i({kbd:!0,[`kbd--${e}`]:!0})} part="base"
      ><slot></slot
    ></kbd>`}},s([a({type:String,reflect:!0})],p.prototype,`size`,void 0),s([a({type:String})],p.prototype,`label`,void 0),customElements.get(`aui-kbd`)||customElements.define(`aui-kbd`,p)})))()}function h(){return(h=l((()=>{m()})))()}export{h as t};