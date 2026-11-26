// TASK-205: 發布前確認 tag 指向的 commit 已通過 main 的所有必要 CI 檢查。
//   node scripts/wait-for-ci.mjs [--sha <commit>] [--branch main] [--timeout 20]
//
// - 必要檢查清單取自該分支 Ruleset 的「Require status checks」，與「合併所需的檢查」為同一來源。
// - CI 仍在執行時每 20 秒輪詢一次，直到全部完成或逾時；任一檢查失敗即立刻結束。
// - 只看 check run（GitHub Actions 的 job）。Ruleset 若加入以 commit status 回報的檢查，
//   這裡找不到對應的 check run，會等到逾時後失敗（寧可擋下發布，也不放行）。
// - 環境變數：GITHUB_TOKEN（或 GH_TOKEN）、GITHUB_REPOSITORY（owner/repo）；未指定 --sha 時使用 GITHUB_SHA；
//   GITHUB_API_URL（選用，預設 https://api.github.com）、WAIT_FOR_CI_POLL_SECONDS（選用，輪詢間隔）。
//
// 測試：scripts/wait-for-ci.test.mjs（pnpm test:scripts）
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PER_PAGE = 100;

/** 分支 Ruleset 中所有必要檢查的名稱（不重複） */
export function requiredChecks(rules) {
  return [
    ...new Set(
      rules
        .filter((rule) => rule.type === 'required_status_checks')
        .flatMap((rule) => rule.parameters.required_status_checks.map((check) => check.context)),
    ),
  ];
}

/**
 * 依 check run 判斷必要檢查的狀態。同名檢查可能跑過多次（例如重跑），以最新的一次為準。
 * `skipped`、`cancelled`、`neutral` 等任何不是 `success` 的結論都算未通過。
 *
 * @returns {{ failed: { name: string, conclusion: string }[], pending: string[] }}
 */
export function evaluateChecks(required, runs) {
  const latest = new Map();
  for (const run of runs) {
    const previous = latest.get(run.name);
    if (!previous || new Date(run.started_at) > new Date(previous.started_at)) {
      latest.set(run.name, run);
    }
  }
  const failed = [];
  const pending = [];
  for (const name of required) {
    const run = latest.get(name);
    if (run?.status !== 'completed') pending.push(name);
    else if (run.conclusion !== 'success') failed.push({ name, conclusion: run.conclusion });
  }
  return { failed, pending };
}

async function main() {
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
  if (!Number.isFinite(timeoutMinutes) || timeoutMinutes <= 0) {
    // NaN 會讓期限永遠不到期，一路輪詢到 job 逾時
    throw new Error('--timeout 須為大於 0 的分鐘數');
  }
  const pollSeconds = Number(process.env.WAIT_FOR_CI_POLL_SECONDS ?? 20);

  if (!token || !repo || !sha) {
    throw new Error(
      '需要 GITHUB_TOKEN（或 GH_TOKEN）、GITHUB_REPOSITORY（或 --repo）與 commit（--sha 或 GITHUB_SHA）',
    );
  }

  const base = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  async function api(path) {
    const response = await fetch(`${base}/repos/${repo}${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API ${path} 回應 ${response.status}：${await response.text()}`);
    }
    return response.json();
  }

  /** 逐頁讀取：少讀一頁會漏掉規則或 check run（漏掉的檢查會被當成尚未執行，等到逾時） */
  async function paginate(path, pick = (body) => body) {
    const items = [];
    for (let page = 1; ; page++) {
      const separator = path.includes('?') ? '&' : '?';
      const batch = pick(await api(`${path}${separator}per_page=${PER_PAGE}&page=${page}`));
      items.push(...batch);
      if (batch.length < PER_PAGE) return items;
    }
  }

  // 必要檢查清單：取自分支 Ruleset（GET /rules/branches/{branch}）
  const required = requiredChecks(await paginate(`/rules/branches/${branch}`));
  if (!required.length) {
    throw new Error(`${branch} 的 Ruleset 沒有設定必要檢查，無法確認 CI 狀態`);
  }
  console.log(
    `[wait-for-ci] ${sha.slice(0, 7)} 須通過 ${branch} 的必要檢查：${required.join('、')}`,
  );

  const deadline = Date.now() + timeoutMinutes * 60_000;
  for (;;) {
    const runs = await paginate(`/commits/${sha}/check-runs`, (body) => body.check_runs);
    const { failed, pending } = evaluateChecks(required, runs);
    if (failed.length) {
      throw new Error(
        `必要檢查未通過：${failed.map(({ name, conclusion }) => `${name}（${conclusion}）`).join('、')}`,
      );
    }
    if (!pending.length) {
      console.log('✓ 所有必要檢查皆已通過');
      return;
    }
    if (Date.now() > deadline) {
      throw new Error(
        `等待逾時（${timeoutMinutes} 分鐘），仍未完成或尚未執行：${pending.join('、')}`,
      );
    }
    console.log(`[wait-for-ci] 等待中：${pending.join('、')}`);
    await new Promise((resolve) => setTimeout(resolve, pollSeconds * 1000));
  }
}

// 以實際路徑比對（同 pack.mjs）：守衛不成立時腳本會以結束碼 0 靜默通過，發布就少了這道檢查
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`✗ ${error.message}`);
    process.exit(1);
  });
}
