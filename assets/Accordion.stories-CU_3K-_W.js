import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{t as r}from"./accordion-BWMnCmax.js";import{a as i,i as a}from"./play-utils-DUto8Om5.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),r(),i(),{expect:o,userEvent:s,waitFor:c}=__STORYBOOK_MODULE_TEST__,l={title:`Components/Accordion`,component:`aui-accordion`,parameters:{docs:{description:{component:'\n**Anchor UI — Accordion 手風琴說明與 FAQ (`<aui-accordion>`)**\n\n以原生 `<details>` / `<summary>` 封裝的內容收折區塊，用於工具下方的操作說明、限制規範或常見問題。\n展開時外框平滑高亮、標題箭頭旋轉；鍵盤操作（Enter / Space）沿用原生行為。\n\n- `variant="doc"`（預設）：使用指南的大區塊排版；`variant="faq"`：較緊湊，適合多個項目連續堆疊。\n- 設定相同 `name` 的手風琴互斥（一次只展開一個）；未設定時各自獨立開闔。\n- 展開狀態改變時觸發 `aui-toggle`（`detail.open`）；事件會冒泡，巢狀使用時請比對 `event.target`。\n'}}},argTypes:{heading:{control:`text`,description:`標題文字（或使用 heading slot）`},open:{control:`boolean`,description:`是否展開`,table:{defaultValue:{summary:`false`}}},name:{control:`text`,description:`互斥群組名稱：同名的手風琴一次只展開一個`},variant:{control:`inline-radio`,options:[`doc`,`faq`],description:`預設排版`,table:{defaultValue:{summary:`doc`}}}},args:{heading:`使用說明`,open:!0,name:``,variant:`doc`}},u={render:e=>t`
    <div style="max-width: 560px;">
      <aui-accordion
        heading=${e.heading}
        ?open=${e.open}
        name=${e.name}
        .variant=${e.variant}
        @aui-toggle=${e=>console.log(`aui-toggle`,e.detail)}
      >
        <p>貼上 JSON 後按下「格式化」，即可取得排版後的結果。</p>
        <ul>
          <li>支援最大 5 MB 的文件</li>
          <li>所有運算皆在瀏覽器內完成，資料不會離開你的裝置</li>
        </ul>
        <p>格式錯誤時會標示錯誤所在的行與欄。</p>
      </aui-accordion>
    </div>
  `},d={render:()=>t`
    <div style="display: grid; gap: 16px; max-width: 560px;">
      <aui-accordion heading="使用說明" open>
        <p>貼上 JSON 後按下「格式化」，即可取得排版後的結果。</p>
        <ol>
          <li>在輸入框貼上內容</li>
          <li>選擇縮排寬度</li>
          <li>複製或下載結果</li>
        </ol>
      </aui-accordion>
      <aui-accordion heading="限制規範">
        <ul>
          <li>不支援 JSON5 與註解</li>
          <li>單一文件上限為 5 MB</li>
        </ul>
      </aui-accordion>
    </div>
  `},f={render:()=>t`
    <div style="display: grid; gap: 8px; max-width: 560px;">
      <aui-accordion heading="資料會上傳到伺服器嗎？" variant="faq" name="faq" open>
        <p>不會，所有運算皆在本機完成。</p>
      </aui-accordion>
      <aui-accordion heading="支援哪些瀏覽器？" variant="faq" name="faq">
        <p>最新兩個版本的 Chrome、Edge、Firefox 與 Safari。</p>
      </aui-accordion>
      <aui-accordion heading="可以離線使用嗎？" variant="faq" name="faq">
        <p>可以，載入頁面後不需要網路連線。</p>
      </aui-accordion>
    </div>
  `,play:async({canvasElement:e,step:t})=>{let[n,r]=[...e.querySelectorAll(`aui-accordion`)];await t(`展開第二題時，第一題自動收合`,async()=>{await s.click(a(r,`summary`)),await c(()=>o(r.open).toBe(!0)),await c(()=>o(n.open).toBe(!1))}),await t(`再次點擊可收合，群組可全部收合`,async()=>{await s.click(a(r,`summary`)),await c(()=>o(r.open).toBe(!1)),await o(n.open).toBe(!1)}),await t(`還原初始狀態`,async()=>{n.open=!0,await c(()=>o(a(n,`details`).open).toBe(!0))})}},p={render:()=>t`
    <div style="max-width: 560px;">
      <aui-accordion>
        <span slot="heading">以 <code>heading</code> slot 自訂標題</span>
        <p>標題可包含行內標記；內容區的段落與清單會套用預設的間距與縮排。</p>
      </aui-accordion>
    </div>
  `},m=[`Default`,`DocGuide`,`FaqGroup`,`SlottedHeading`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <div style="max-width: 560px;">
      <aui-accordion
        heading=\${args.heading}
        ?open=\${args.open}
        name=\${args.name}
        .variant=\${args.variant}
        @aui-toggle=\${(event: CustomEvent) => console.log('aui-toggle', event.detail)}
      >
        <p>貼上 JSON 後按下「格式化」，即可取得排版後的結果。</p>
        <ul>
          <li>支援最大 5 MB 的文件</li>
          <li>所有運算皆在瀏覽器內完成，資料不會離開你的裝置</li>
        </ul>
        <p>格式錯誤時會標示錯誤所在的行與欄。</p>
      </aui-accordion>
    </div>
  \`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: grid; gap: 16px; max-width: 560px;">
      <aui-accordion heading="使用說明" open>
        <p>貼上 JSON 後按下「格式化」，即可取得排版後的結果。</p>
        <ol>
          <li>在輸入框貼上內容</li>
          <li>選擇縮排寬度</li>
          <li>複製或下載結果</li>
        </ol>
      </aui-accordion>
      <aui-accordion heading="限制規範">
        <ul>
          <li>不支援 JSON5 與註解</li>
          <li>單一文件上限為 5 MB</li>
        </ul>
      </aui-accordion>
    </div>
  \`
}`,...d.parameters?.docs?.source},description:{story:`使用指南排版：各區塊獨立開闔`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: grid; gap: 8px; max-width: 560px;">
      <aui-accordion heading="資料會上傳到伺服器嗎？" variant="faq" name="faq" open>
        <p>不會，所有運算皆在本機完成。</p>
      </aui-accordion>
      <aui-accordion heading="支援哪些瀏覽器？" variant="faq" name="faq">
        <p>最新兩個版本的 Chrome、Edge、Firefox 與 Safari。</p>
      </aui-accordion>
      <aui-accordion heading="可以離線使用嗎？" variant="faq" name="faq">
        <p>可以，載入頁面後不需要網路連線。</p>
      </aui-accordion>
    </div>
  \`,
  play: async ({
    canvasElement,
    step
  }) => {
    const [first, second] = [...canvasElement.querySelectorAll<AuiAccordion>('aui-accordion')];
    await step('展開第二題時，第一題自動收合', async () => {
      await userEvent.click(inShadow(second, 'summary'));
      await waitFor(() => expect(second.open).toBe(true));
      await waitFor(() => expect(first.open).toBe(false));
    });
    await step('再次點擊可收合，群組可全部收合', async () => {
      await userEvent.click(inShadow(second, 'summary'));
      await waitFor(() => expect(second.open).toBe(false));
      await expect(first.open).toBe(false);
    });
    await step('還原初始狀態', async () => {
      first.open = true;
      await waitFor(() => expect(inShadow<HTMLDetailsElement>(first, 'details').open).toBe(true));
    });
  }
}`,...f.parameters?.docs?.source},description:{story:`FAQ 排版：相同 name 的項目互斥，一次只展開一個`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="max-width: 560px;">
      <aui-accordion>
        <span slot="heading">以 <code>heading</code> slot 自訂標題</span>
        <p>標題可包含行內標記；內容區的段落與清單會套用預設的間距與縮排。</p>
      </aui-accordion>
    </div>
  \`
}`,...p.parameters?.docs?.source}}}})))()}h();export{u as Default,d as DocGuide,f as FaqGroup,p as SlottedHeading,m as __namedExportsOrder,l as default};