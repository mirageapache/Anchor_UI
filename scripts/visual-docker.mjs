// TASK-203: 在 Playwright 官方 Docker 映像中執行視覺回歸測試，確保本機與 CI 的截圖環境一致。
//   node scripts/visual-docker.mjs            比對基準圖
//   node scripts/visual-docker.mjs --update   更新基準圖
//
// - 映像版本取自已安裝的 playwright 套件，避免版本不一致。
// - 容器內的 node_modules 與 pnpm store 使用具名 volume，不會覆寫本機（Windows / macOS）的 node_modules。
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const update = process.argv.includes('--update');

const playwrightVersion = JSON.parse(
  readFileSync(require.resolve('playwright/package.json', { paths: [root] }), 'utf-8'),
).version;
const image = `mcr.microsoft.com/playwright:v${playwrightVersion}-noble`;
const PNPM_VERSION = '11.26.0'; // 與 .github/workflows/ci.yml 一致

const inner = [
  `npm install -g pnpm@${PNPM_VERSION} --silent`,
  'pnpm config set store-dir /pnpm-store',
  // 只安裝根套件的相依，避免在掛載的 examples/ 中寫入 Linux 版 node_modules
  'pnpm install --frozen-lockfile --filter @anchor-ui/core --ignore-scripts --reporter=silent',
  'pnpm build:tokens',
  `pnpm test:visual${update ? ':update' : ''}`,
].join(' && ');

console.log(`[visual] 使用映像 ${image}${update ? '（更新基準圖）' : ''}`);
const result = spawnSync(
  'docker',
  [
    'run',
    '--rm',
    '--ipc=host',
    '-v',
    `${root.split('\\').join('/')}:/work`,
    '-v',
    'aui-visual-node-modules:/work/node_modules',
    '-v',
    'aui-visual-pnpm-store:/pnpm-store',
    '-w',
    '/work',
    '-e',
    'CI=true',
    image,
    'bash',
    '-c',
    inner,
  ],
  { stdio: 'inherit' },
);
process.exit(result.status ?? 1);
