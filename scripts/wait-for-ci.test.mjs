// scripts/wait-for-ci.mjs 的測試：以本機的假 GitHub API 伺服器驗證發布前的 CI 閘門。
//   pnpm test:scripts
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { promisify } from 'node:util';
import { evaluateChecks, requiredChecks } from './wait-for-ci.mjs';

const run = promisify(execFile);
const script = join(import.meta.dirname, 'wait-for-ci.mjs');

const rule = (...contexts) => ({
  type: 'required_status_checks',
  parameters: { required_status_checks: contexts.map((context) => ({ context })) },
});
const checkRun = (name, conclusion, startedAt = '2026-01-01T00:00:00Z') => ({
  name,
  status: conclusion ? 'completed' : 'in_progress',
  conclusion: conclusion ?? null,
  started_at: startedAt,
});

describe('requiredChecks', () => {
  it('collects the contexts of every required_status_checks rule without duplicates', () => {
    const rules = [{ type: 'deletion' }, rule('Lint', 'Build'), rule('Build', 'Test')];
    assert.deepEqual(requiredChecks(rules), ['Lint', 'Build', 'Test']);
  });
});

describe('evaluateChecks', () => {
  it('reports checks that have not run or not finished as pending', () => {
    const result = evaluateChecks(['Lint', 'Build'], [checkRun('Lint', null)]);
    assert.deepEqual(result, { failed: [], pending: ['Lint', 'Build'] });
  });

  it('treats every conclusion other than success as a failure, including skipped', () => {
    const runs = [
      checkRun('Lint', 'success'),
      checkRun('Build', 'skipped'),
      checkRun('Test', 'cancelled'),
    ];
    assert.deepEqual(evaluateChecks(['Lint', 'Build', 'Test'], runs), {
      failed: [
        { name: 'Build', conclusion: 'skipped' },
        { name: 'Test', conclusion: 'cancelled' },
      ],
      pending: [],
    });
  });

  it('uses the latest run of a check that ran more than once', () => {
    const rerunPassed = [
      checkRun('Lint', 'failure', '2026-01-01T00:00:00Z'),
      checkRun('Lint', 'success', '2026-01-01T01:00:00Z'),
    ];
    assert.deepEqual(evaluateChecks(['Lint'], rerunPassed), { failed: [], pending: [] });
    // 順序不影響：較新的一次仍在執行時，不採計較舊的成功結果
    const rerunRunning = [
      checkRun('Lint', null, '2026-01-01T01:00:00Z'),
      checkRun('Lint', 'success', '2026-01-01T00:00:00Z'),
    ];
    assert.deepEqual(evaluateChecks(['Lint'], rerunRunning), { failed: [], pending: ['Lint'] });
  });

  it('ignores runs that are not required', () => {
    const runs = [checkRun('Lint', 'success'), checkRun('CI Time Budget', 'failure')];
    assert.deepEqual(evaluateChecks(['Lint'], runs), { failed: [], pending: [] });
  });
});

describe('command line', () => {
  /** @type {string[]} */
  let requests;
  let rules;
  /** 每次查詢 check run 時依序回應的清單；用完後重複最後一個 */
  let checkRunResponses;
  let rulesStatus;
  let server;
  let env;

  before(async () => {
    server = createServer((request, response) => {
      requests.push(request.url);
      const url = new URL(request.url, 'http://localhost');
      const page = Number(url.searchParams.get('page') ?? 1);
      const perPage = Number(url.searchParams.get('per_page') ?? 30);
      const slice = (items) => items.slice((page - 1) * perPage, page * perPage);
      const send = (status, body) => {
        response.writeHead(status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(body));
      };
      if (request.headers.authorization !== 'Bearer test-token') return send(401, {});
      if (url.pathname === '/repos/o/r/rules/branches/main') {
        return rulesStatus === 200 ? send(200, slice(rules)) : send(rulesStatus, { message: 'x' });
      }
      if (url.pathname === '/repos/o/r/commits/abc1234/check-runs') {
        // 只有每一輪的第一頁才換到下一組回應
        const runs =
          page === 1 && checkRunResponses.length > 1
            ? checkRunResponses.shift()
            : checkRunResponses[0];
        return send(200, { total_count: runs.length, check_runs: slice(runs) });
      }
      send(404, {});
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    env = {
      ...process.env,
      GITHUB_TOKEN: 'test-token',
      GITHUB_REPOSITORY: 'o/r',
      GITHUB_SHA: 'abc1234',
      GITHUB_API_URL: `http://127.0.0.1:${server.address().port}`,
      WAIT_FOR_CI_POLL_SECONDS: '0.02',
    };
    delete env.GH_TOKEN;
  });

  after(() => server.close());

  beforeEach(() => {
    requests = [];
    rules = [rule('Lint', 'Build')];
    rulesStatus = 200;
    checkRunResponses = [[checkRun('Lint', 'success'), checkRun('Build', 'success')]];
  });

  const wait = (args = [], overrides = {}) =>
    run(process.execPath, [script, ...args], { env: { ...env, ...overrides } });
  const failure = async (args, overrides) => {
    const error = await wait(args, overrides).then(
      () => assert.fail('expected a non-zero exit code'),
      (reason) => reason,
    );
    assert.equal(error.code, 1);
    return error.stderr;
  };

  it('passes when every required check succeeded', async () => {
    const { stdout } = await wait();
    assert.match(stdout, /所有必要檢查皆已通過/);
  });

  it('fails at once when a required check failed, naming it', async () => {
    checkRunResponses = [[checkRun('Lint', 'success'), checkRun('Build', 'failure')]];
    assert.match(await failure(), /Build（failure）/);
  });

  it('keeps polling until pending checks finish', async () => {
    checkRunResponses = [
      [checkRun('Lint', 'success')],
      [checkRun('Lint', 'success'), checkRun('Build', null)],
      [checkRun('Lint', 'success'), checkRun('Build', 'success')],
    ];
    const { stdout } = await wait();
    assert.match(stdout, /等待中：Build/);
    assert.match(stdout, /所有必要檢查皆已通過/);
  });

  it('fails after the timeout when a required check never runs', async () => {
    checkRunResponses = [[checkRun('Lint', 'success')]];
    assert.match(await failure(['--timeout', '0.001']), /等待逾時.*Build/);
  });

  it('fails when the ruleset has no required checks', async () => {
    rules = [{ type: 'deletion' }];
    assert.match(await failure(), /沒有設定必要檢查/);
  });

  it('fails on an API error instead of treating it as nothing required', async () => {
    rulesStatus = 500;
    assert.match(await failure(), /回應 500/);
  });

  it('rejects a timeout that is not a positive number', async () => {
    assert.match(await failure(['--timeout', 'soon']), /--timeout/);
  });

  it('fails without a token', async () => {
    assert.match(await failure([], { GITHUB_TOKEN: '' }), /GITHUB_TOKEN/);
  });

  it('reads every page of rules and check runs', async () => {
    // 必要檢查在規則的第二頁，它的 check run 也在第二頁
    rules = [...Array.from({ length: 100 }, () => ({ type: 'deletion' })), rule('Late check')];
    checkRunResponses = [
      [
        ...Array.from({ length: 100 }, (_, index) => checkRun(`Other ${index}`, 'success')),
        checkRun('Late check', 'failure'),
      ],
    ];
    assert.match(await failure(), /Late check（failure）/);
    assert.ok(requests.some((url) => url.includes('/rules/branches/main') && /page=2/.test(url)));
    assert.ok(requests.some((url) => url.includes('/check-runs') && /page=2/.test(url)));
  });
});
