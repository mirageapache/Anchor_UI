// Vite 的型別宣告（如 import.meta.env、靜態資源匯入）
/// <reference types="vite/client" />
// TASK-502：aui-* 元件在 Vue 範本中的屬性與事件型別（vue-tsc 檢查範本時使用）
/// <reference types="@anchor-ui/core/vue" />

// 讓 TypeScript 認得 .vue 單檔元件的匯入（SFC 內部的型別檢查需改用 vue-tsc）
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
