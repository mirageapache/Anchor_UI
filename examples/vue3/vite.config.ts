/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // TASK-107: 設定 compilerOptions.isCustomElement 排除自訂元素檢查
          isCustomElement: (tag) => tag.startsWith('aui-'),
        },
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
