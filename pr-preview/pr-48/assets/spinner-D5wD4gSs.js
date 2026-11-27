import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,s as n,t as r}from"./lit-DvaG8Cmk.js";function i(e,t){return t?(e.preventDefault(),e.stopImmediatePropagation(),!0):!1}function a(){return(a=e((()=>{})))()}function o(e,t){p.has(e)&&p.set(e,t),u(e)?e[l](t):(e.localName.includes(`-`)&&!e.matches(`:defined`)&&!p.has(e)&&(p.set(e,t),customElements.whenDefined(e.localName).then(()=>{let t=p.get(e)??null;p.delete(e),u(e)&&(s(e,null),t&&e[l](t))})),s(e,t))}function s(e,t){let n=e;if(t){f.has(e)||f.set(e,d.map(t=>e.getAttribute(t)));let{hasPopup:r,expanded:i,controls:a}=c(t);e.setAttribute(`aria-haspopup`,r),e.setAttribute(`aria-expanded`,i),n.ariaControlsElements=a;return}let r=f.get(e);f.delete(e),d.forEach((t,n)=>{let i=r?.[n]??null;i===null?e.removeAttribute(t):e.setAttribute(t,i)}),n.ariaControlsElements=null}function c(e){return{hasPopup:e?.hasPopup,expanded:e?String(e.expanded):void 0,controls:e?.controls?[e.controls]:null}}var l,u,d,f,p;function m(){return(m=e((()=>{l=Symbol.for(`anchor-ui.popup-trigger`),u=e=>typeof e[l]==`function`,d=[`aria-haspopup`,`aria-expanded`],f=new WeakMap,p=new WeakMap})))()}var h,g;function _(){return(_=e((()=>{r(),h=n`
  <svg
    class="aui-spinner"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
  </svg>
`,g=t`
  .aui-spinner {
    animation: aui-spin 0.8s linear infinite;
  }

  @keyframes aui-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* 減少動畫：Spinner 保留但放慢，讓忙碌狀態仍可被感知 */
  @media (prefers-reduced-motion: reduce) {
    .aui-spinner {
      animation-duration: 2s;
    }
  }
`})))()}export{m as a,a as c,l as i,i as l,h as n,c as o,g as r,o as s,_ as t};