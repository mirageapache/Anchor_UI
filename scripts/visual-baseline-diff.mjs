// TASK-203: 比較工作目錄的視覺回歸基準圖與指定 git ref 的版本，為「更新基準圖」的變更產生差異圖供審查。
//   node scripts/visual-baseline-diff.mjs                 與 HEAD 比較（本機更新基準圖後檢視變更）
//   node scripts/visual-baseline-diff.mjs --base <ref>    與指定 ref 比較（CI 中為 PR 的目標分支）
//
// 每張變更的基準圖會輸出 <name>-before.png、<name>-after.png 與 <name>-diff.png 至
// screenshots/Chromium/changes/（不納入版控）；於 GitHub Actions 中另寫入 job summary。
// 結束碼：0 = 無變更，0 且印出清單 = 有變更（是否接受由審查者決定），1 = 執行錯誤。
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const root = resolve(import.meta.dirname, '..');
const BASELINE_DIR = 'screenshots/Chromium/baseline';
const OUT_DIR = join(root, 'screenshots/Chromium/changes');
const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex === -1 ? 'HEAD' : args[baseIndex + 1];

const git = (...gitArgs) =>
  execFileSync('git', gitArgs, { cwd: root, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });

// 以 git diff 取得與 base 相比的變更（含尚未 commit 的工作目錄變更與新增檔案）
const tracked = git('diff', '--name-status', base, '--', BASELINE_DIR).toString().trim();
const untracked = git('ls-files', '--others', '--exclude-standard', '--', BASELINE_DIR)
  .toString()
  .trim();
const changes = [
  ...tracked
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t'))
    .map(([status, path]) => ({ status: status[0], path })),
  ...untracked
    .split('\n')
    .filter(Boolean)
    .map((path) => ({ status: 'A', path })),
];

rmSync(OUT_DIR, { recursive: true, force: true });
if (!changes.length) {
  console.log(`✓ 視覺回歸基準圖與 ${base} 相同，沒有變更`);
  process.exit(0);
}
mkdirSync(OUT_DIR, { recursive: true });

const rows = [];
for (const { status, path } of changes) {
  const name = basename(path, '.png');
  if (status === 'D') {
    rows.push({ name, change: '刪除' });
    continue;
  }
  const after = readFileSync(join(root, path));
  writeFileSync(join(OUT_DIR, `${name}-after.png`), after);
  if (status === 'A') {
    rows.push({ name, change: '新增' });
    continue;
  }
  const before = git('show', `${base}:${path}`);
  writeFileSync(join(OUT_DIR, `${name}-before.png`), before);
  const [a, b] = [PNG.sync.read(before), PNG.sync.read(after)];
  if (a.width !== b.width || a.height !== b.height) {
    rows.push({ name, change: `尺寸改變（${a.width}×${a.height} → ${b.width}×${b.height}）` });
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.01 });
  writeFileSync(join(OUT_DIR, `${name}-diff.png`), PNG.sync.write(diff));
  const percent = ((pixels / (a.width * a.height)) * 100).toFixed(2);
  rows.push({ name, change: `修改（${pixels} 個像素不同，${percent}%）` });
}

const table = [
  `| 基準圖 | 變更 |`,
  `| --- | --- |`,
  ...rows.map(({ name, change }) => `| \`${name}\` | ${change} |`),
].join('\n');
console.log(`視覺回歸基準圖與 ${base} 相比有 ${rows.length} 張變更：`);
for (const { name, change } of rows) console.log(`  - ${name}：${change}`);
console.log(`差異圖已輸出至 ${join('screenshots/Chromium/changes')}/（before / after / diff）`);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## 視覺回歸基準圖變更\n\n與 \`${base}\` 相比：\n\n${table}\n\n` +
      '差異圖請下載 `visual-baseline-changes` artifact 檢視（before / after / diff）。\n',
  );
}
if (process.env.GITHUB_OUTPUT && existsSync(OUT_DIR)) {
  appendFileSync(process.env.GITHUB_OUTPUT, 'changed=true\n');
}
