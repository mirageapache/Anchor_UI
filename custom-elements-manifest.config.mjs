// TASK-408：由元件原始碼的 JSDoc（@element、@slot、@csspart、@cssprop、@fires）與 Lit 的屬性宣告
// 產生 Custom Elements Manifest（custom-elements.json），供 Storybook 的 Docs 頁自動列出 API 表。
// TASK-502：建置時也由它產生框架的模板型別宣告（scripts/generate-framework-types.mjs），
// 事件型別取自 @fires {CustomEvent<Detail>}。
// 產物為建置時產生的檔案，不提交也不發布（見 .gitignore）；pnpm build / storybook / build-storybook / test:storybook 會先產生。

/** 類別自己以 JSDoc 宣告的事件型別：declarationKey →（事件名稱 → 型別） */
const ownEventTypes = new Map();
const declarationKey = (modulePath, declaration) => `${modulePath}#${declaration.name}`;

export default {
  globs: [
    'src/components/**/*.ts',
    // Modal 與 Drawer 繼承的共用基底：讓繼承的屬性、方法與事件也列入兩者的 API 表
    'src/internal/modal-dialog.ts',
  ],
  exclude: ['src/**/*.test.ts', 'src/**/*.styles.ts', 'src/**/*.types.ts'],
  outdir: '.',
  litelement: true,
  // 不在 package.json 寫入 customElements 欄位：manifest 不隨套件發布，寫入會指向不存在的檔案
  packagejson: false,
  plugins: [
    {
      // 繼承事件時，analyzer 會以基底從程式碼推斷的型別（只有 CustomEvent，沒有 detail）覆寫子類別
      // 以 JSDoc 宣告的 CustomEvent<Detail>（Modal / Drawer 的 aui-hide 等）。
      // 在合併繼承之前記下子類別自己的型別，合併後再還原
      name: 'anchor-ui-keep-own-event-types',
      moduleLinkPhase({ moduleDoc }) {
        for (const declaration of moduleDoc.declarations ?? []) {
          const types = new Map(
            (declaration.events ?? [])
              .filter((event) => event.name && event.type?.text)
              .map((event) => [event.name, event.type.text]),
          );
          if (types.size) ownEventTypes.set(declarationKey(moduleDoc.path, declaration), types);
        }
      },
      packageLinkPhase({ customElementsManifest }) {
        for (const mod of customElementsManifest.modules) {
          for (const declaration of mod.declarations ?? []) {
            const types = ownEventTypes.get(declarationKey(mod.path, declaration));
            for (const event of declaration.events ?? []) {
              const own = types?.get(event.name);
              if (own && event.inheritedFrom) event.type = { text: own };
            }
          }
        }
      },
    },
    {
      name: 'anchor-ui-storybook-api-table',
      packageLinkPhase({ customElementsManifest }) {
        for (const mod of customElementsManifest.modules) {
          for (const declaration of mod.declarations ?? []) {
            // 抽象基底（ModalDialogElement）沒有標籤，不是可用的自訂元素
            if (declaration.customElement && !declaration.tagName) delete declaration.customElement;
            if (!declaration.members) continue;

            // 只列公開成員：移除 private / protected、# 私有欄位與 static（Lit 的 shadowRootOptions、
            // formAssociated 等內部設定），含從基底繼承而來的
            declaration.members = declaration.members.filter(
              (member) =>
                member.privacy !== 'private' &&
                member.privacy !== 'protected' &&
                !member.static &&
                !member.name.startsWith('#'),
            );

            // 有對應 HTML attribute 的 property 只列一次：Storybook 以名稱合併 story 的 argTypes（camelCase），
            // 因此保留 property（說明與控制項才會合併在同一列），並在說明中註明 attribute 名稱
            const mirrored = new Set();
            for (const member of declaration.members) {
              if (
                member.kind !== 'field' ||
                !member.attribute ||
                member.attribute === member.name
              ) {
                continue;
              }
              mirrored.add(member.attribute);
              const note = `HTML attribute：\`${member.attribute}\``;
              member.description = member.description ? `${member.description}\n\n${note}` : note;
            }
            if (declaration.attributes) {
              declaration.attributes = declaration.attributes.filter((a) => !mirrored.has(a.name));
            }
          }
        }
      },
    },
  ],
};
