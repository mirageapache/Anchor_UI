import{s as e,t}from"./lit-MXP2jLr5.js";import{t as n}from"./segmented-B0m5SQ25.js";import{a as r,c as i,i as a,l as o,n as s,o as c,r as l,s as u,t as d}from"./play-utils-Cj5Kn2Rl.js";import{n as f,t as p}from"./alert-service-Lw4TfDAU.js";import{t as m}from"./modal-D7i1Cp2u.js";import{t as h}from"./button-DhL0lY_i.js";import{t as g}from"./input-Br5UZOpr.js";import{t as _}from"./alert-B233QQIC.js";import{t as v}from"./output-Dso8GA4N.js";import{t as y}from"./field-C1a6gQlg.js";import{n as b,r as x,t as S}from"./toast-CCBiYeG1.js";import{t as C}from"./rolldown-runtime-Dh6celcD.js";function w(e){let t=e.querySelector(`[name="name"]`),n=e.querySelector(`[name="email"]`),r=e.querySelector(`[name="plan"]`),i=e.querySelector(`#preview`);i.value=[t.value,n.value&&`<${n.value}>`,r.value&&`方案：${r.value}`].filter(Boolean).join(` `),i.status=n.value&&n.validity?.typeMismatch?`warning`:`success`}async function T(e){let t=b.loading(`儲存中…`,{id:`save`});await A(400),e?t.update({variant:`error`,title:`儲存失敗`,message:`連線逾時，請稍後再試`}):t.update({variant:`success`,title:``,message:`已儲存`})}var E,D,O,k,A,j,M,N,P,F;function I(){return(I=C((()=>{t(),_(),h(),y(),g(),m(),v(),n(),S(),f(),x(),r(),{expect:E,userEvent:D,waitFor:O}=__STORYBOOK_MODULE_TEST__,k={title:`Scenarios`,parameters:{docs:{description:{component:`表單與回饋元件的整合情境。每個情境都附有 play function（可於 Interactions 面板逐步檢視），並由 Storybook Test Runner 在 CI 中執行。`}}}},A=e=>new Promise(t=>setTimeout(t,e)),j=[{value:`free`,label:`Free`},{value:`pro`,label:`Pro`},{value:`team`,label:`Team`}],M={name:`註冊表單（驗證、預覽、送出、重設）`,render:()=>e`
      <form
        id="signup"
        style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;"
        @input=${e=>w(e.currentTarget)}
        @change=${e=>w(e.currentTarget)}
        @submit=${e=>{e.preventDefault();let t=e.target,n=Object.fromEntries(new FormData(t));t.querySelector(`#result`).textContent=JSON.stringify(n),b.success(`歡迎加入，${String(n.name)}！`,{id:`signup`})}}
        @reset=${e=>{let t=e.target;t.querySelector(`#result`).textContent=``,Promise.resolve().then(()=>w(t))}}
      >
        <aui-field label="名稱" description="2 至 20 個字元">
          <aui-input name="name" required minlength="2" maxlength="20"></aui-input>
        </aui-field>
        <aui-field label="Email">
          <aui-input name="email" type="email" required placeholder="name@example.com"></aui-input>
        </aui-field>
        <aui-field label="方案">
          <aui-segmented name="plan" required .options=${j}></aui-segmented>
        </aui-field>
        <aui-field label="備註">
          <aui-input name="notes" multiline rows="2"></aui-input>
        </aui-field>
        <aui-field label="預覽" copyable>
          <aui-output id="preview" placeholder="填寫後顯示摘要"></aui-output>
        </aui-field>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <aui-button id="reset" type="reset" variant="ghost">重設</aui-button>
          <aui-button id="submit" type="submit">送出</aui-button>
        </div>
        <pre id="result" style="margin: 0; font-family: var(--font-mono); font-size: 12px;"></pre>
      </form>
    `,play:async({canvasElement:e,step:t})=>{await b.closeAll();let n=c(e,`#signup`),r=c(n,`[name="name"]`),a=c(n,`[name="email"]`),l=c(n,`[name="plan"]`),f=c(n,`[name="notes"]`),p=c(n,`#preview`),m=c(n,`#result`);await t(`必填欄位未填時，送出會被原生驗證擋下`,async()=>{await s(c(n,`#submit`)),await E(m.textContent).toBe(``),await E(r.validity?.valueMissing).toBe(!0),await E(l.validity?.valueMissing).toBe(!0),await E(n.checkValidity()).toBe(!1)}),await t(`Email 格式不符時，預覽以警告呈現`,async()=>{await i(r,`Anchor`),await i(a,`anchor@`),await E(a.validity?.typeMismatch).toBe(!0),await E(p.status).toBe(`warning`)}),await t(`補齊欄位：鍵盤切換方案、填寫多行備註，預覽即時更新`,async()=>{await i(a,`example.com`),await d(l,0),await D.keyboard(`{ArrowRight}`),await E(l.value).toBe(`pro`),await i(f,`Line 1{Enter}Line 2`),await E(f.value).toBe(`Line 1
Line 2`),await E(p.status).toBe(`success`),await E(p.value).toBe(`Anchor <anchor@example.com> 方案：pro`)}),await t(`送出：FormData 帶出所有值，並以 Toast 通知`,async()=>{await s(c(n,`#submit`)),await E(JSON.parse(m.textContent)).toEqual({name:`Anchor`,email:`anchor@example.com`,plan:`pro`,notes:`Line 1
Line 2`});let e=u();await O(()=>E(o(e).map(e=>e.message)).toEqual([`歡迎加入，Anchor！`])),await E(o(e)[0].variant).toBe(`success`)}),await t(`重設：所有欄位還原，預覽清空`,async()=>{await s(c(n,`#reset`)),await O(()=>E(r.value).toBe(``)),await E(a.value).toBe(``),await E(l.value).toBe(``),await E(f.value).toBe(``),await E(p.value).toBe(``),await E(m.textContent).toBe(``)}),await b.closeAll()}},N={name:`非同步儲存（Loading 轉 Success / Error）`,render:()=>e`
    <div style="display: flex; gap: 8px;">
      <aui-button id="save" @click=${()=>T(!1)}>儲存</aui-button>
      <aui-button id="save-fail" variant="danger" @click=${()=>T(!0)}
        >儲存（模擬失敗）</aui-button
      >
    </div>
  `,play:async({canvasElement:e,step:t})=>{await b.closeAll(),await t(`儲存：先顯示 Loading，完成後原地更新為 Success`,async()=>{await s(c(e,`#save`));let t=u();await O(()=>E(o(t)).toHaveLength(1));let[n]=o(t);await E(n.variant).toBe(`loading`),await E(a(n,`[part~="icon"] .aui-spinner`)).toBeTruthy(),await E(a(n,`[part~="content"]`).getAttribute(`role`)).toBe(`status`),await O(()=>E(n.variant).toBe(`success`)),await E(n.message).toBe(`已儲存`),await E(o(t),`同一則通知被更新，而非新增`).toEqual([n])}),await t(`失敗：轉為 Error，並改以 alert live region 播報`,async()=>{await s(c(e,`#save-fail`));let t=u();await O(()=>E(o(t)[0]?.variant).toBe(`error`));let[n]=o(t);await E(n.heading).toBe(`儲存失敗`),await O(()=>E(a(n,`[part~="content"]`).getAttribute(`role`)).toBe(`alert`)),await E(a(n,`[part~="content"]`).textContent).toContain(`連線逾時`)}),await b.closeAll()}},P={name:`Modal 中確認刪除（Alert + Toast 疊加）`,render:()=>{let t=async e=>{let t=e.currentTarget.closest(`li`),n=t.dataset.name;await p.confirm({icon:`warning`,title:`刪除「${n}」？`,message:`刪除後無法復原。`,confirmText:`刪除`,destructive:!0})&&(t.remove(),b.success(`已刪除「${n}」`))};return e`
      <div class="scenario">
        <aui-button
          id="open"
          @click=${e=>{e.currentTarget.closest(`.scenario`).querySelector(`aui-modal`).open=!0}}
          >管理項目</aui-button
        >
        <aui-modal heading="項目">
          <ul
            style="display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none;"
          >
            ${[`報告.pdf`,`草稿.docx`].map(n=>e`
                <li
                  data-name=${n}
                  style="display: flex; justify-content: space-between; align-items: center;"
                >
                  <span>${n}</span>
                  <aui-button size="sm" variant="danger" @click=${t}>刪除</aui-button>
                </li>
              `)}
          </ul>
        </aui-modal>
      </div>
    `},play:async({canvasElement:e,step:t})=>{await b.closeAll();let n=c(e,`aui-modal`),r=e=>c(n,`li[data-name="${e}"] aui-button`),i=()=>document.body.querySelector(`:scope > aui-alert`);await t(`開啟 Modal`,async()=>{await s(c(e,`#open`)),await O(()=>E(a(n,`dialog`).open).toBe(!0))}),await t(`破壞性確認：初始焦點在取消鈕，按 Enter 取消，項目保留`,async()=>{await s(r(`報告.pdf`)),await O(()=>E(i()?.open).toBe(!0));let e=i(),t=a(a(e,`[part~="cancel-button"]`),`button`);await O(()=>E(l()).toBe(t)),await D.keyboard(`{Enter}`),await O(()=>E(i()).toBeNull()),await E(n.querySelector(`li[data-name="報告.pdf"]`)).toBeTruthy(),await E(n.open,`Modal 仍開啟`).toBe(!0)}),await t(`確認刪除：項目移除，Toast 出現在 Modal 之上`,async()=>{await s(r(`報告.pdf`)),await O(()=>E(i()?.open).toBe(!0)),await s(a(i(),`[part~="confirm-button"]`)),await O(()=>E(n.querySelector(`li[data-name="報告.pdf"]`)).toBeNull()),await O(()=>E(o(u()).map(e=>e.message)).toEqual([`已刪除「報告.pdf」`])),await E(u()?.parentElement).toBe(n)}),await t(`關閉 Modal：通知回到頁面，焦點返還至開啟按鈕`,async()=>{await D.click(a(n,`[part="close-button"]`)),await O(()=>E(n.open).toBe(!1)),await O(()=>E(u()?.parentElement).toBe(document.body)),await O(()=>E(l()).toBe(a(c(e,`#open`),`button`)))}),await b.closeAll()}},F=[`RegistrationForm`,`AsyncSave`,`ConfirmDeleteInModal`]})))()}I();export{N as AsyncSave,P as ConfirmDeleteInModal,M as RegistrationForm,F as __namedExportsOrder,k as default};