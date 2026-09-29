import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { readFileSync } from 'fs';

// L-01: Read version from package.json at build time so VERSION constant in
// index.ts is always in sync without manual updates.
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };

export default defineConfig({
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      // M-05: 本套件為純 ESM 格式（intentionally ESM-only）。
      // Web Components / Lit 本身即 ESM-native，不提供 CJS 輸出。
      // 若消費端使用 CommonJS 環境（如部分 Jest / Angular SSR 設定），
      // 請在 bundler 設定中將 @anchor-ui/core 加入 esmExternals 或轉換清單。
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'AnchorUI',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [/^lit/],
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.names?.some((n) => n.endsWith('.css')) ||
            assetInfo.name?.endsWith('.css')
          ) {
            return 'styles.css';
          }
          return '[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
