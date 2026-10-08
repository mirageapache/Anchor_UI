import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { existsSync, readdirSync, readFileSync } from 'fs';

// L-01: Read version from package.json at build time so VERSION constant in
// index.ts is always in sync without manual updates.
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };

// TASK-201: 每個元件資料夾（具 index.ts 者）自動成為一個個別入口，
// 產出 dist/components/<name>/index.js，供消費端按需引用（@anchor-ui/core/<name>）。
const componentsDir = resolve(import.meta.dirname, 'src/components');
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(resolve(componentsDir, d.name, 'index.ts')))
    .map((d) => [`components/${d.name}/index`, resolve(componentsDir, d.name, 'index.ts')]),
);

export default defineConfig({
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      // 測試、stories 與測試工具不屬於發布內容
      exclude: ['src/**/*.test.ts', 'src/stories/**', 'src/test-utils/**'],
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
      // TASK-201: 全量入口（註冊所有元件）＋各元件個別入口（按需載入，支援 Tree-shaking）
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        ...componentEntries,
      },
      name: 'AnchorUI',
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // lit 由消費端提供；@floating-ui/dom 列於 dependencies，交由消費端打包以避免重複
      external: [/^lit/, /^@floating-ui\//],
      output: {
        // 保留原始碼的模組結構逐檔輸出（dist/components/button/button.js…），
        // 消費端打包工具才能以模組為單位 Tree-shaking，且 JS 與 .d.ts 路徑一致
        preserveModules: true,
        preserveModulesRoot: 'src',
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
