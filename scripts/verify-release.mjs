// TASK-205: 檢查版號規範。
//   node scripts/verify-release.mjs                     檢查 package.json 版號格式
//   node scripts/verify-release.mjs --tag v0.2.0-beta   另檢查 tag 與 package.json 版號一致（亦可寫成 --tag=…）
//   node scripts/verify-release.mjs --all-tags          檢查每個既有 v* tag 所指 commit 的版號都與 tag 一致
// 於 GitHub Actions 的 tag 觸發中，未指定 --tag 時會自動讀取 GITHUB_REF_NAME。
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const args = process.argv.slice(2);
const failures = [];

// SemVer 2.0.0：MAJOR.MINOR.PATCH，可選的預覽標籤（-alpha、-beta.1…）與建置資訊（+…）
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/** 是否為預覽版：只看建置資訊（+ 之後）以外的部分是否含預覽標籤，例如 1.0.0+build-5 是正式版 */
export const isPrerelease = (value) => value.split('+')[0].includes('-');

/** 讀取 --name value 或 --name=value；有旗標卻沒給值時回傳空字串 */
function readOption(name) {
  const inline = args.find((arg) => arg.startsWith(`--${name}=`));
  if (inline !== undefined) return inline.slice(name.length + 3);
  const index = args.indexOf(`--${name}`);
  if (index === -1) return undefined;
  const value = args[index + 1];
  return value === undefined || value.startsWith('--') ? '' : value;
}

if (!SEMVER.test(version)) {
  failures.push(`package.json 的 version「${version}」不是合法的 SemVer（例如 0.2.0-beta、1.0.0）`);
}

const tagOption = readOption('tag');
const tag =
  tagOption !== undefined
    ? tagOption
    : process.env.GITHUB_REF_TYPE === 'tag'
      ? process.env.GITHUB_REF_NAME
      : undefined;

if (tag !== undefined) {
  if (!tag) failures.push('--tag 需要指定 tag 名稱，例如 --tag v0.2.0-beta');
  else if (tag !== `v${version}`) {
    failures.push(`Git Tag「${tag}」與 package.json 版號「${version}」不一致（應為 v${version}）`);
  }
}

// 既有 tag 的一致性：每個 v* tag 所指 commit 的 package.json 版號都必須與 tag 相同
let checkedTags = [];
if (args.includes('--all-tags')) {
  const git = (...gitArgs) => execFileSync('git', gitArgs, { cwd: root, encoding: 'utf-8' });
  checkedTags = git('tag', '--list', 'v*').split('\n').filter(Boolean);
  for (const name of checkedTags) {
    let tagged;
    try {
      tagged = JSON.parse(git('show', `${name}:package.json`)).version;
    } catch {
      failures.push(`無法讀取 tag ${name} 所指 commit 的 package.json`);
      continue;
    }
    if (`v${tagged}` !== name) {
      failures.push(`tag ${name} 所指 commit 的 package.json 版號為「${tagged}」，與 tag 不一致`);
    }
  }
}

if (failures.length) {
  console.error('✗ 版號檢查失敗：');
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `✓ 版號檢查通過：${version}${isPrerelease(version) ? '（預覽版）' : ''}` +
    (tag ? `，與 tag ${tag} 一致` : '') +
    (args.includes('--all-tags') ? `；既有 tag ${checkedTags.length} 個皆一致` : ''),
);
