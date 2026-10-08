import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

/**
 * 透過 Chromium DevTools Protocol 取得元素「實際計算後」的無障礙名稱與描述。
 * 用來驗證 aria-describedby 等 IDREF 關聯是否真的被瀏覽器解析
 * （例如跨 Shadow DOM 邊界的 IDREF 屬性字串存在，但瀏覽器並不會解析）。
 * 瀏覽器端請使用 src/test-utils/ax.ts 的 getAxNode()。
 */
function axNodePlugin() {
  return {
    name: 'ax-node-command',
    async executeCommand({ command, payload, session }) {
      if (command !== 'ax-node') return undefined;
      if (session.browser.type !== 'playwright') {
        throw new Error('ax-node command is only supported on the Playwright launcher');
      }
      const page = session.browser.getPage(session.id);
      const cdp = await page.context().newCDPSession(page);
      try {
        await cdp.send('Accessibility.enable');
        const { result } = await cdp.send('Runtime.evaluate', { expression: payload.expression });
        if (!result.objectId) throw new Error(`ax-node: "${payload.expression}" is not an element`);
        const { nodes } = await cdp.send('Accessibility.getPartialAXTree', {
          objectId: result.objectId,
          fetchRelatives: false,
        });
        const node = nodes[0];
        return {
          role: node?.role?.value ?? '',
          name: node?.name?.value ?? '',
          description: node?.description?.value ?? '',
        };
      } finally {
        await cdp.detach();
      }
    },
  };
}

export default {
  files: 'src/components/**/*.test.ts',
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'auto',
      tsconfig: 'tsconfig.json',
    }),
    axNodePlugin(),
  ],
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    }),
  ],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 6000,
    },
  },
  coverage: process.argv.includes('--coverage'),
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    // TASK-110: lcov 供 Codecov 上傳，text-summary 顯示於 CI 日誌
    reporters: ['lcov', 'text-summary'],
    include: ['src/components/**/*.ts', 'src/internal/**/*.ts'],
    exclude: [
      'src/components/**/*.test.ts',
      'src/components/**/*.types.ts',
      'src/components/**/index.ts',
    ],
    threshold: {
      statements: 85,
      branches: 75,
      functions: 85,
      lines: 85,
    },
  },
};
