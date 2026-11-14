import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

/**
 * Storybook 互動測試（TASK-213）：@storybook/addon-vitest 把每個 story 轉為一個 Vitest 測試，
 * 在 Chromium（Vitest browser mode + Playwright）中渲染並執行 play function。
 * 元件的單元測試仍由 web-test-runner 執行（pnpm test），此設定只包含 storybook 專案。
 *
 * 沿用 vite.config.ts（`@` alias、`__PKG_VERSION__`）；其中的 vite-plugin-dts 只在 build 時作用。
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [storybookTest({ configDir: resolve(import.meta.dirname, '.storybook') })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              // 以減少動畫模式執行：Modal / Alert / Toast 的轉場時長取自 computed style，
              // 減少動畫下為 0，互動測試不必等待動畫且結果穩定
              provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
              instances: [{ browser: 'chromium' }],
            },
            // 預設的 63315 位於 Windows 動態連接埠範圍，常被 Hyper-V / WinNAT 保留而 listen EACCES
            // （EACCES 不會觸發「改用下一個連接埠」）；改用動態範圍以外的連接埠，被占用時才往後找
            api: { port: 6100 },
          },
        },
      ],
    },
  }),
);
