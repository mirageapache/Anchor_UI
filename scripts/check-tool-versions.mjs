// 檢查各處的工具版本是否一致，避免升級時漏改造成環境分歧：
// - package.json 的 playwright 必須是精確版本（不可用 ^ 或 ~ 讓 lockfile 自動升級）
// - CI 視覺回歸使用的 Playwright 容器映像版本必須與 playwright 套件相同（瀏覽器版本須一致）
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
