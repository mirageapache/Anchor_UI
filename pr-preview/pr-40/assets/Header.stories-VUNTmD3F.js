import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{s as t,t as n}from"./lit-DvaG8Cmk.js";import{a as r,i,o as a}from"./play-utils-DUto8Om5.js";import{t as o}from"./button-DdPjZonN.js";import{t as s}from"./tag-CQtnWGOn.js";import{t as c}from"./header-BIrsNO-e.js";var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),o(),c(),s(),r(),{expect:l,userEvent:u,waitFor:d}=__STORYBOOK_MODULE_TEST__,f={title:`Components/Header`,component:`aui-header`,parameters:{docs:{description:{component:"\n**Anchor UI — Header 頁面工具標頭列 (`<aui-header>`)**\n\n工具頁面頂部的複合展示列：分類標籤、HOT 推薦徽標、主標題（預設為 `<h1>`）、我的最愛收藏鈕與簡述文字，\n提供統一的頁首層次與字級節奏。\n\n- 內部組合 `<aui-tag>`（HOT 徽標）與 `<aui-favorite-btn>`（收藏鈕），載入本元件時會一併註冊。\n- 純展示與事件轉發：使用者切換收藏鈕時觸發 `aui-favorite-change`（`detail.favorite`），是否保存由使用端決定；\n  在事件中把 `favorite` 設回原值即可取消變更。\n- 一個頁面應只有一個 `<h1>`；在其他位置使用時以 `heading-level` 調整層級。\n"}}},argTypes:{heading:{control:`text`,description:`主標題（或使用 heading slot）`},description:{control:`text`,description:`簡述文字（或使用預設 slot）`},headingLevel:{control:`inline-radio`,options:[1,2,3,4,5,6],description:`主標題的標題層級`,table:{defaultValue:{summary:`1`}}},hot:{control:`boolean`,description:`是否顯示 HOT 推薦徽標`,table:{defaultValue:{summary:`false`}}},hotLabel:{control:`text`,description:`HOT 徽標文字`,table:{defaultValue:{summary:`HOT`}}},favoritable:{control:`boolean`,description:`是否顯示我的最愛收藏鈕`,table:{defaultValue:{summary:`false`}}},favorite:{control:`boolean`,description:`是否已收藏（需搭配 favoritable）`,table:{defaultValue:{summary:`false`}}}},args:{heading:`JSON Formatter`,description:`格式化、驗證並壓縮 JSON 文件，所有運算皆在瀏覽器內完成。`,headingLevel:1,hot:!0,hotLabel:`HOT`,favoritable:!0,favorite:!1}},p={render:e=>t`
    <aui-header
      heading=${e.heading}
      description=${e.description}
      .headingLevel=${e.headingLevel}
      ?hot=${e.hot}
      hot-label=${e.hotLabel}
      ?favoritable=${e.favoritable}
      ?favorite=${e.favorite}
      @aui-favorite-change=${e=>console.log(`aui-favorite-change`,e.detail)}
    >
      <aui-tag slot="tags" variant="brand">json</aui-tag>
      <aui-tag slot="tags">format</aui-tag>
    </aui-header>
  `},m={render:()=>t`
    <div style="display: grid; gap: 12px;">
      <aui-header
        heading="UUID Generator"
        heading-level="2"
        description="產生 v4 / v7 UUID。"
        favoritable
        @aui-favorite-change=${e=>{let t=e.currentTarget.nextElementSibling;t.textContent=e.detail.favorite?`已加入我的最愛`:`尚未收藏`}}
      >
        <aui-tag slot="tags" variant="purple">uuid</aui-tag>
      </aui-header>
      <span data-testid="status" style="font-size: 14px; color: var(--color-text-secondary);"
        >尚未收藏</span
      >
    </div>
  `,play:async({canvasElement:e,step:t})=>{let n=a(e,`aui-header`),r=a(e,`[data-testid="status"]`),o=i(n,`aui-favorite-btn`);await o.updateComplete,await t(`點擊收藏鈕：Header 的 favorite 與外部狀態同步更新`,async()=>{await u.click(i(o,`button`)),await l(n.favorite).toBe(!0),await l(r.textContent).toBe(`已加入我的最愛`),await d(()=>l(n.hasAttribute(`favorite`)).toBe(!0))}),await t(`再次點擊取消收藏`,async()=>{await u.click(i(o,`button`)),await l(n.favorite).toBe(!1),await l(r.textContent).toBe(`尚未收藏`)})}},h={render:()=>t`
    <aui-header
      heading="Base64"
      heading-level="2"
      description="編碼與解碼 Base64 文字與檔案。"
      favoritable
      favorite
    >
      <aui-tag slot="tags" variant="success">encode</aui-tag>
      <aui-button slot="actions" variant="ghost" size="sm">分享</aui-button>
    </aui-header>
  `},g={render:()=>t`
    <div style="display: grid; gap: 32px;">
      <aui-header heading="只有標題" heading-level="2"></aui-header>
      <aui-header heading-level="2">
        <span slot="heading">以 <code>heading</code> slot 自訂標題</span>
        預設 slot 放入簡述，可包含 <strong>行內標記</strong>。
      </aui-header>
    </div>
  `},_=[`Default`,`FavoriteForwarding`,`WithActions`,`Minimal`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => html\`
    <aui-header
      heading=\${args.heading}
      description=\${args.description}
      .headingLevel=\${args.headingLevel}
      ?hot=\${args.hot}
      hot-label=\${args.hotLabel}
      ?favoritable=\${args.favoritable}
      ?favorite=\${args.favorite}
      @aui-favorite-change=\${(event: CustomEvent<HeaderFavoriteChangeDetail>) => console.log('aui-favorite-change', event.detail)}
    >
      <aui-tag slot="tags" variant="brand">json</aui-tag>
      <aui-tag slot="tags">format</aui-tag>
    </aui-header>
  \`
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: grid; gap: 12px;">
      <aui-header
        heading="UUID Generator"
        heading-level="2"
        description="產生 v4 / v7 UUID。"
        favoritable
        @aui-favorite-change=\${(event: CustomEvent<HeaderFavoriteChangeDetail>) => {
    const status = (event.currentTarget as HTMLElement).nextElementSibling!;
    status.textContent = event.detail.favorite ? '已加入我的最愛' : '尚未收藏';
  }}
      >
        <aui-tag slot="tags" variant="purple">uuid</aui-tag>
      </aui-header>
      <span data-testid="status" style="font-size: 14px; color: var(--color-text-secondary);"
        >尚未收藏</span
      >
    </div>
  \`,
  play: async ({
    canvasElement,
    step
  }) => {
    const header = query<AuiHeader>(canvasElement, 'aui-header');
    const status = query(canvasElement, '[data-testid="status"]');
    const favorite = inShadow<AuiFavoriteBtn>(header, 'aui-favorite-btn');
    await favorite.updateComplete;
    await step('點擊收藏鈕：Header 的 favorite 與外部狀態同步更新', async () => {
      await userEvent.click(inShadow(favorite, 'button'));
      await expect(header.favorite).toBe(true);
      await expect(status.textContent).toBe('已加入我的最愛');
      await waitFor(() => expect(header.hasAttribute('favorite')).toBe(true));
    });
    await step('再次點擊取消收藏', async () => {
      await userEvent.click(inShadow(favorite, 'button'));
      await expect(header.favorite).toBe(false);
      await expect(status.textContent).toBe('尚未收藏');
    });
  }
}`,...m.parameters?.docs?.source},description:{story:`切換收藏：Header 轉發為 aui-favorite-change，並同步 favorite 屬性`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <aui-header
      heading="Base64"
      heading-level="2"
      description="編碼與解碼 Base64 文字與檔案。"
      favoritable
      favorite
    >
      <aui-tag slot="tags" variant="success">encode</aui-tag>
      <aui-button slot="actions" variant="ghost" size="sm">分享</aui-button>
    </aui-header>
  \`
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display: grid; gap: 32px;">
      <aui-header heading="只有標題" heading-level="2"></aui-header>
      <aui-header heading-level="2">
        <span slot="heading">以 <code>heading</code> slot 自訂標題</span>
        預設 slot 放入簡述，可包含 <strong>行內標記</strong>。
      </aui-header>
    </div>
  \`
}`,...g.parameters?.docs?.source}}}})))()}v();export{p as Default,m as FavoriteForwarding,g as Minimal,h as WithActions,_ as __namedExportsOrder,f as default};