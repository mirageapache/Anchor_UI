import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'src/components/**/*.test.ts',
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'auto',
      tsconfig: 'tsconfig.json',
    }),
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
    include: ['src/components/**/*.ts'],
    exclude: ['src/components/**/*.test.ts', 'src/components/**/*.types.ts', 'src/components/**/index.ts'],
    threshold: {
      statements: 85,
      branches: 75,
      functions: 85,
      lines: 85,
    },
  },
};
