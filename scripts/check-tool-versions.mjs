// 檢查各處的工具版本是否一致，避免升級時漏改造成環境分歧：
// - package.json 的 playwright 必須是精確版本（不可用 ^ 或 ~ 讓 lockfile 自動升級）
// - CI 使用的 Playwright 容器映像版本必須與 playwright 套件相同（瀏覽器版本須一致）
// - smoke/ 測試專案自帶的 playwright 須與根目錄相同（在同一個映像中執行）
// - pnpm 版本只以 package.json 的 packageManager 為唯一來源，workflow 不得另外寫死
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
const failures = [];
const EXACT = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

const playwright = pkg.devDependencies?.playwright;
if (!EXACT.test(playwright ?? '')) {
  failures.push(`package.json 的 playwright 必須是精確版本（目前為「${playwright}」）`);
}

// smoke/ 的測試專案（不在 workspace 內，以 npm 安裝）若自帶 playwright，會在同一個 Playwright 映像中執行：
// package.json 與 package-lock.json 的版本都必須與根目錄相同，否則找不到映像內預先安裝的瀏覽器
const smokeDir = join(root, 'smoke');
for (const project of readdirSync(smokeDir, { withFileTypes: true })) {
  if (!project.isDirectory()) continue;
  const dir = join(smokeDir, project.name);
  const smokePkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'));
  const declared = smokePkg.dependencies?.playwright ?? smokePkg.devDependencies?.playwright;
  if (declared === undefined) continue;
  const lock = JSON.parse(readFileSync(join(dir, 'package-lock.json'), 'utf-8'));
  const locked = lock.packages?.['node_modules/playwright']?.version;
  if (declared !== playwright || locked !== playwright) {
    failures.push(
      `smoke/${project.name} 的 playwright 為「${declared}」（lockfile：${locked}），須與根目錄的 ${playwright} 相同`,
    );
  }
}

if (!/^pnpm@\d+\.\d+\.\d+$/.test(pkg.packageManager ?? '')) {
  failures.push(
    `package.json 須以 packageManager 指定精確的 pnpm 版本（目前為「${pkg.packageManager}」）`,
  );
}

const workflowsDir = join(root, '.github/workflows');
for (const file of readdirSync(workflowsDir).filter((f) => /\.ya?ml$/.test(f))) {
  const source = readFileSync(join(workflowsDir, file), 'utf-8');
  for (const [, version] of source.matchAll(/mcr\.microsoft\.com\/playwright:v([\d.]+)-/g)) {
    if (version !== playwright) {
      failures.push(
        `${file} 的 Playwright 映像為 v${version}，與 playwright 套件 ${playwright} 不一致`,
      );
    }
  }
  if (/pnpm\/action-setup@[^\n]*\n\s+with:\n\s+version:/.test(source)) {
    failures.push(`${file} 在 pnpm/action-setup 寫死了 version，請改由 packageManager 提供`);
  }
}

if (failures.length) {
  console.error('✗ 工具版本檢查失敗：');
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`✓ 工具版本一致：playwright ${playwright}、${pkg.packageManager}`);
