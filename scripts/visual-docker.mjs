// TASK-203: 在 Playwright 官方 Docker 映像中執行視覺回歸測試，確保本機與 CI 的截圖環境一致。
//   node scripts/visual-docker.mjs            比對基準圖
//   node scripts/visual-docker.mjs --update   更新基準圖
//
// - 映像版本取自已安裝的 playwright 套件，避免版本不一致。
// - 容器內的 node_modules 與 pnpm store 使用具名 volume，不會覆寫本機（Windows / macOS）的 node_modules。
// - 容器以 root 執行；在 Linux 主機上，結束前會把寫入的 dist/ 與 screenshots/ 改回主機使用者擁有，
//   避免之後在主機上建置時出現權限錯誤（Windows / macOS 的 Docker Desktop 不受影響）。
// - 更新基準圖後，於主機上執行 scripts/visual-baseline-diff.mjs 列出變更並產生差異圖供審查。
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
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
// pnpm 版本取自 package.json 的 packageManager 欄位（與 CI 相同來源）
const PNPM_VERSION = pkg.packageManager.replace(/^pnpm@/, '');

const steps = [
  `npm install -g pnpm@${PNPM_VERSION} --silent`,
  'pnpm config set store-dir /pnpm-store',
  // 只安裝根套件的相依，避免在掛載的 examples/ 中寫入 Linux 版 node_modules
  'pnpm install --frozen-lockfile --filter @anchor-ui/core --ignore-scripts --reporter=silent',
  'pnpm build:tokens',
  `pnpm test:visual${update ? ':update' : ''}`,
].join(' && ');

// Linux 主機：保留測試結果的結束碼，再把容器（root）寫入的檔案改回主機使用者
const hostUser =
  process.platform === 'linux' && process.getuid ? `${process.getuid()}:${process.getgid()}` : null;
const containerCommand = hostUser
  ? `${steps}; status=$?; chown -R ${hostUser} dist screenshots 2>/dev/null; exit $status`
  : steps;

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
    containerCommand,
  ],
  { stdio: 'inherit' },
);

if (update && result.status === 0) {
  // 列出這次更新改了哪些基準圖，並產生 before / after / diff 供提交前檢視
  spawnSync('node', [resolve(root, 'scripts/visual-baseline-diff.mjs')], { stdio: 'inherit' });
}
process.exit(result.status ?? 1);
