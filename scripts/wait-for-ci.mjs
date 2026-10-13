// TASK-205: 發布前確認 tag 指向的 commit 已通過 main 的所有必要 CI 檢查。
//   node scripts/wait-for-ci.mjs [--sha <commit>] [--branch main] [--timeout 20]
//
// - 必要檢查清單取自該分支 Ruleset 的「Require status checks」，與「合併所需的檢查」為同一來源。
// - CI 仍在執行時每 20 秒輪詢一次，直到全部完成或逾時；任一檢查失敗即立刻結束。
// - 環境變數：GITHUB_TOKEN（或 GH_TOKEN）、GITHUB_REPOSITORY（owner/repo）；未指定 --sha 時使用 GITHUB_SHA。
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const repo = option('repo', process.env.GITHUB_REPOSITORY);
const sha = option('sha', process.env.GITHUB_SHA);
const branch = option('branch', 'main');
const timeoutMinutes = Number(option('timeout', '20'));
const POLL_SECONDS = Number(process.env.WAIT_FOR_CI_POLL_SECONDS ?? 20);

if (!token || !repo || !sha) {
  console.error(
    '✗ 需要 GITHUB_TOKEN（或 GH_TOKEN）、GITHUB_REPOSITORY（或 --repo）與 commit（--sha 或 GITHUB_SHA）',
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

// 必要檢查清單：取自分支 Ruleset（GET /rules/branches/{branch}）
const rules = await api(`/rules/branches/${branch}`);
const required = [
  ...new Set(
    rules
      .filter((rule) => rule.type === 'required_status_checks')
      .flatMap((rule) => rule.parameters.required_status_checks.map((check) => check.context)),
  ),
];
if (!required.length) {
  console.error(`✗ ${branch} 的 Ruleset 沒有設定必要檢查，無法確認 CI 狀態`);
  process.exit(1);
}
console.log(`[wait-for-ci] ${sha.slice(0, 7)} 須通過 ${branch} 的必要檢查：${required.join('、')}`);

const deadline = Date.now() + timeoutMinutes * 60_000;
for (;;) {
  const { check_runs: runs } = await api(`/commits/${sha}/check-runs?per_page=100`);
  // 同名檢查可能跑過多次（例如重跑），取最新的一次
  const latest = new Map();
  for (const run of runs) {
    const previous = latest.get(run.name);
    if (!previous || new Date(run.started_at) > new Date(previous.started_at))
      latest.set(run.name, run);
  }

  const failed = required.filter((name) => {
    const run = latest.get(name);
    return run?.status === 'completed' && run.conclusion !== 'success';
  });
  if (failed.length) {
    console.error(
      `✗ 必要檢查未通過：${failed.map((name) => `${name}（${latest.get(name).conclusion}）`).join('、')}`,
    );
    process.exit(1);
  }

  const pending = required.filter((name) => latest.get(name)?.status !== 'completed');
  if (!pending.length) {
    console.log('✓ 所有必要檢查皆已通過');
    process.exit(0);
  }
  if (Date.now() > deadline) {
    console.error(
      `✗ 等待逾時（${timeoutMinutes} 分鐘），仍未完成或尚未執行：${pending.join('、')}`,
    );
    process.exit(1);
  }
  console.log(`[wait-for-ci] 等待中：${pending.join('、')}`);
  await new Promise((resolve) => setTimeout(resolve, POLL_SECONDS * 1000));
}
