import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // aui- 開頭的標籤是自訂元素，不交給 Vue 解析
          isCustomElement: (tag) => tag.startsWith('aui-'),
        },
      },
    }),
  ],
});
