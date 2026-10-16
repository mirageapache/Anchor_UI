// TASK-214: CI 時間預算報告。讀取 workflow run 各 job 的耗時寫入 job summary，整體超過預算時發出警告。
//   node scripts/ci-time-report.mjs [--run <run id>] [--attempt <n>] [--repo owner/repo] [--budget 8]
//
// - 整體時間 = 這次執行（attempt）開始 → 最後一個已完成的 job 結束，即開發者實際等待的時間（含排隊）。
// - 於 CI 最後一個 job 中執行：自身尚未完成，不列入統計。
// - 只發出警告、不讓 CI 失敗：runner 偶爾變慢不該擋住合併，但超出預算時應在 PR 上看得到。
// - 環境變數：GITHUB_TOKEN（或 GH_TOKEN）、GITHUB_REPOSITORY、GITHUB_RUN_ID、GITHUB_RUN_ATTEMPT、
//   GITHUB_STEP_SUMMARY（有設定時寫入 job summary）、CI_TIME_BUDGET_MINUTES（預設 8）。
import { appendFileSync } from 'node:fs';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const repo = option('repo', process.env.GITHUB_REPOSITORY);
const runId = option('run', process.env.GITHUB_RUN_ID);
const attempt = option('attempt', process.env.GITHUB_RUN_ATTEMPT ?? '1');
const budgetMinutes = Number(option('budget', process.env.CI_TIME_BUDGET_MINUTES ?? '8'));

if (!token || !repo || !runId) {
  console.error(
    '✗ 需要 GITHUB_TOKEN（或 GH_TOKEN）、GITHUB_REPOSITORY（或 --repo）與 GITHUB_RUN_ID（或 --run）',
  );
  process.exit(1);
}

async function api(path) {
  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok)
    throw new Error(`GitHub API ${path} 回應 ${response.status}：${await response.text()}`);
  return response.json();
}

/** 秒數格式化為「1m 05s」 */
const formatDuration = (seconds) =>
  seconds >= 60
    ? `${Math.floor(seconds / 60)}m ${String(Math.round(seconds % 60)).padStart(2, '0')}s`
    : `${Math.round(seconds)}s`;

const run = await api(`/actions/runs/${runId}/attempts/${attempt}`);
const { jobs } = await api(`/actions/runs/${runId}/attempts/${attempt}/jobs?per_page=100`);
const runStart = Date.parse(run.run_started_at);

const finished = jobs
  .filter((job) => job.status === 'completed' && job.started_at && job.completed_at)
  .map((job) => {
    const started = Date.parse(job.started_at);
    const completed = Date.parse(job.completed_at);
    return {
      name: job.name,
      conclusion: job.conclusion,
      // 被略過的 job 開始與結束時間相同，耗時為 0
      seconds: Math.max(0, (completed - started) / 1000),
      startOffset: Math.max(0, (started - runStart) / 1000),
      completed,
    };
  })
  .sort((a, b) => a.startOffset - b.startOffset || a.name.localeCompare(b.name));

if (!finished.length) {
  console.error('✗ 這次執行還沒有已完成的 job');
  process.exit(1);
}

const lastCompleted = Math.max(...finished.map((job) => job.completed));
const totalSeconds = (lastCompleted - runStart) / 1000;
const budgetSeconds = budgetMinutes * 60;
const withinBudget = totalSeconds <= budgetSeconds;

const rows = finished.map(
  (job) =>
    `| ${job.name} | ${job.conclusion} | +${formatDuration(job.startOffset)} | ${formatDuration(job.seconds)} |`,
);
const summary = [
  `### CI 時間預算：${formatDuration(totalSeconds)} / ${budgetMinutes}m ${withinBudget ? '✅' : '⚠️ 超出預算'}`,
  '',
  '| Job | 結果 | 開始（相對於本次執行） | 耗時 |',
  '| --- | --- | --- | --- |',
  ...rows,
  '',
  '整體時間為本次執行開始到最後一個 job 結束（含排隊），不含此報告 job 本身。',
  '',
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);

if (!withinBudget) {
  const slowest = [...finished].sort((a, b) => b.seconds - a.seconds)[0];
  console.log(
    `::warning title=CI 時間預算::本次 CI 共 ${formatDuration(totalSeconds)}，超出 ${budgetMinutes} 分鐘預算（最慢的 job：${slowest.name}，${formatDuration(slowest.seconds)}）`,
  );
}
