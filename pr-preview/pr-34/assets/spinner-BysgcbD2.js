import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{h as t,s as n,t as r}from"./lit-Bfdqhiqf.js";function i(e,t){return t?(e.preventDefault(),e.stopImmediatePropagation(),!0):!1}function a(){return(a=e((()=>{})))()}var o,s;function c(){return(c=e((()=>{r(),o=n`
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
`,s=t`
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
`})))()}export{i as a,a as i,o as n,s as r,c as t};