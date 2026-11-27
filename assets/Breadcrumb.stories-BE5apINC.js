import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{t as o,u as s,v as c}from"./decorate-B5jhCMz7.js";import{a as l,o as u}from"./play-utils-DUto8Om5.js";import{n as d,t as f}from"./safe-href-Y2YYGJ9Z.js";import{t as p}from"./header-B6PlkzdM.js";var m;function h(){return(h=e((()=>{a(),m=t`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* 以行內文字排列：空間不足時像句子一樣換行，過長的名稱在字內斷行 */
  .breadcrumb__list {
    display: block;
    margin: 0;
    padding: 0;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    list-style: none;
  }

  /* 中文名稱不在字與字之間斷行（優先在分隔符號前後換行）；過長的英文字串仍可斷行 */
  .breadcrumb__item {
    display: inline;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  /* 可被選取：複製整條路徑時保留層級之間的「 / 」 */
  .breadcrumb__separator {
    color: var(--color-text-muted, #64748b);
  }

  .breadcrumb__link {
    color: inherit;
    text-decoration: none;
    border-radius: var(--radius-sm, 6px);
    transition: color var(--transition-fast, 100ms ease);
  }

  .breadcrumb__link:hover {
    color: var(--color-brand-text, #0f4c81);
    text-decoration: underline;
  }

  .breadcrumb__link:focus-visible {
    outline: 2px solid var(--color-brand-500, #1b6ca8);
    outline-offset: 2px;
  }

  /* 目前頁面（是連結時懸停也維持原本的顏色） */
  [aria-current='page'],
  .breadcrumb__link[aria-current='page']:hover {
    font-weight: var(--weight-medium, 500);
    color: var(--color-text-primary, #0f172a);
  }

  @media (prefers-reduced-motion: reduce) {
    .breadcrumb__link {
      transition: none;
    }
  }
`})))()}var g,_;function v(){return(v=e((()=>{a(),s(),f(),h(),g=e=>typeof e==`object`&&!!e&&typeof e.label==`string`&&e.label.trim()!==``,_=class extends r{constructor(...e){super(...e),this.items=[],this.label=`麵包屑`,this.separator=`/`}static{this.styles=m}renderLevel(e,t){let r=typeof e.href==`string`?d(e.href):void 0,a=t?`page`:n;return r===void 0?i`<span part=${t?`text current`:`text`} aria-current=${a}>${e.label}</span>`:i`<a class="breadcrumb__link" part=${t?`link current`:`link`} href=${r} aria-current=${a}
      >${e.label}</a
    >`}render(){let e=Array.isArray(this.items)?this.items.filter(g):[];if(!e.length)return n;let t=e.length-1,r=i`<span class="breadcrumb__separator" part="separator" aria-hidden="true"> ${this.separator} </span>`,a=e.map((e,a)=>{let o=a>0?r:n,s=this.renderLevel(e,a===t);return i`<li class="breadcrumb__item" part="item">${o}${s}</li>`});return i`<nav part="base" aria-label=${this.label}><ol class="breadcrumb__list" part="list">${a}</ol></nav>`}},o([c({attribute:!1})],_.prototype,`items`,void 0),o([c({type:String})],_.prototype,`label`,void 0),o([c({type:String})],_.prototype,`separator`,void 0),customElements.get(`aui-breadcrumb`)||customElements.define(`aui-breadcrumb`,_)})))()}function y(){return(y=e((()=>{v()})))()}var b,x,S,C,w,T;function E(){return(E=e((()=>{a(),y(),p(),l(),{expect:b}=__STORYBOOK_MODULE_TEST__,x=[{label:`首頁`,href:`#home`},{label:`開發工具`,href:`#tools`},{label:`JSON 格式化`}],S={title:`Components/Breadcrumb`,component:`aui-breadcrumb`,parameters:{docs:{description:{component:'\n**Anchor UI — Breadcrumb 麵包屑導覽 (`<aui-breadcrumb>`)**\n\n頁首的階層導覽：以 `items`（`{ label, href }` 陣列）傳入從首頁到目前頁面的各層，最後一層為目前頁面。\n\n- `<nav>` landmark（名稱取自 `label`）內的有序清單；目前頁面帶 `aria-current="page"`，分隔符號不會被讀出。\n- `href` 只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定與省略 `href` 的層級為純文字。\n- 空間不足時在分隔符號前後換行；可放進 `<aui-header>` 的 `breadcrumb` slot。\n'}}},argTypes:{label:{control:`text`,description:`導覽區的無障礙名稱`},separator:{control:`text`,description:`分隔符號（不會被讀出）`}},args:{label:`麵包屑`,separator:`/`}},C={render:e=>i`
    <aui-breadcrumb
      .items=${x}
      label=${e.label}
      separator=${e.separator}
    ></aui-breadcrumb>
  `,play:async({canvasElement:e})=>{let t=u(e,`aui-breadcrumb`).shadowRoot.querySelectorAll(`[aria-current="page"]`);await b(t).toHaveLength(1),await b(t[0].textContent).toBe(`JSON 格式化`)}},w={render:()=>i`
    <div style="max-width: 640px;">
      <aui-header
        heading="JSON 格式化"
        description="格式化、驗證與壓縮 JSON，所有運算都在瀏覽器內完成。"
      >
        <aui-breadcrumb slot="breadcrumb" .items=${x}></aui-breadcrumb>
      </aui-header>
    </div>
  `},T=[`Default`,`InHeader`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <aui-breadcrumb
      .items=\${trail}
      label=\${args.label}
      separator=\${args.separator}
    ></aui-breadcrumb>
  \`,
  play: async ({
    canvasElement
  }) => {
    const breadcrumb = query(canvasElement, 'aui-breadcrumb');
    const current = breadcrumb.shadowRoot!.querySelectorAll('[aria-current="page"]');
    await expect(current).toHaveLength(1);
    await expect(current[0].textContent).toBe('JSON 格式化');
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="max-width: 640px;">
      <aui-header
        heading="JSON 格式化"
        description="格式化、驗證與壓縮 JSON，所有運算都在瀏覽器內完成。"
      >
        <aui-breadcrumb slot="breadcrumb" .items=\${trail}></aui-breadcrumb>
      </aui-header>
    </div>
  \`
}`,...w.parameters?.docs?.source},description:{story:`放進工具頁標頭的 breadcrumb slot`,...w.parameters?.docs?.description}}}})))()}E();export{C as Default,w as InHeader,T as __namedExportsOrder,S as default};