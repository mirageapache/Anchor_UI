// TASK-203: 視覺回歸測試設定。
// 基準圖必須在固定環境中產生與比對（Playwright 官方 Docker 映像），本機請使用：
//   pnpm test:visual:docker          比對
//   pnpm test:visual:docker:update   更新基準圖
// 詳見 note/03-visual-regression.md。
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';

// 作業系統的文字渲染不同會造成大量假差異：只允許在 Linux（容器 / CI）中執行
if (process.platform !== 'linux' && !process.env.AUI_VISUAL_ALLOW_HOST) {
  throw new Error(
    '視覺回歸測試只能在 Linux 容器中執行（基準圖於 Playwright 官方 Docker 映像中產生）。\n' +
      '請改用 pnpm test:visual:docker（比對）或 pnpm test:visual:docker:update（更新基準圖）。',
  );
}

export default {
  files: 'src/components/**/*.visual.test.ts',
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ ts: true, target: 'auto', tsconfig: 'tsconfig.json' }),
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
      baseDir: 'screenshots',
      // 單一像素的色差容許值（pixelmatch YIQ 距離）。預設 0.1 過於寬鬆：連 #047857 → #059669
      // 這種明顯不同的綠色都會被視為相同。0.01 可抓到 #0f4c81 → #0f4f86 這類細微的 token 調整；
      // 截圖在固定容器中逐位元一致，嚴格的容許值不會造成偶發失敗。反鋸齒像素仍由 pixelmatch 排除。
      diffOptions: { threshold: 0.01 },
      // 不同像素佔比超過 0.1% 即失敗（Phase 2 驗收條件）
      failureThreshold: 0.1,
      failureThresholdType: 'percent',
    }),
  ],
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
      // 固定視窗、像素密度、色彩配置與減少動畫，避免截圖尺寸與渲染差異
      createBrowserContext: ({ browser }) =>
        browser.newContext({
          viewport: { width: 1024, height: 768 },
          deviceScaleFactor: 1,
          colorScheme: 'light',
          reducedMotion: 'reduce',
        }),
    }),
  ],
  // 截圖比對對時序敏感，逐檔執行
  concurrency: 1,
  testFramework: { config: { ui: 'bdd', timeout: 20000 } },
};
