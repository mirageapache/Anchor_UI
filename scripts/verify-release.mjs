// TASK-205: 發布前檢查版號規範。
//   node scripts/verify-release.mjs                 只檢查 package.json 版號格式
//   node scripts/verify-release.mjs --tag v0.2.0-beta   另檢查 tag 與 package.json 版號一致
// 於 GitHub Actions 的 tag 觸發中，未指定 --tag 時會自動讀取 GITHUB_REF_NAME。
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const failures = [];

// SemVer 2.0.0：MAJOR.MINOR.PATCH，可選的預覽標籤（-alpha、-beta.1…）與建置資訊（+…）
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

if (!SEMVER.test(version)) {
  failures.push(`package.json 的 version「${version}」不是合法的 SemVer（例如 0.2.0-beta、1.0.0）`);
}

const tagIndex = process.argv.indexOf('--tag');
const tag =
  tagIndex !== -1
    ? (process.argv[tagIndex + 1] ?? '') // 有 --tag 卻沒給值時視為空字串，交由下方報錯
    : process.env.GITHUB_REF_TYPE === 'tag'
      ? process.env.GITHUB_REF_NAME
      : undefined;

if (tag !== undefined) {
  if (!tag) failures.push('--tag 需要指定 tag 名稱，例如 --tag v0.2.0-beta');
  else if (tag !== `v${version}`) {
    failures.push(`Git Tag「${tag}」與 package.json 版號「${version}」不一致（應為 v${version}）`);
  }
}

if (failures.length) {
  console.error('✗ 版號檢查失敗：');
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
const prerelease = version.includes('-');
console.log(
  `✓ 版號檢查通過：${version}${prerelease ? '（預覽版）' : ''}${tag ? `，與 tag ${tag} 一致` : ''}`,
);
