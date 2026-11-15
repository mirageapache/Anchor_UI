// scripts/pr-preview-comment.mjs 的測試：以本機的假 GitHub API 伺服器驗證留言的建立、更新與略過。
//   pnpm test:scripts
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { promisify } from 'node:util';
import { MARKER, pagesBaseUrl, renderComment } from './pr-preview-comment.mjs';

const run = promisify(execFile);
const script = join(import.meta.dirname, 'pr-preview-comment.mjs');

describe('pagesBaseUrl', () => {
  it('lower-cases the owner, keeps the repo name and ends with a slash', () => {
    assert.equal(
      pagesBaseUrl('MirageApache/Anchor_UI'),
      'https://mirageapache.github.io/Anchor_UI/',
    );
  });

  it('honours an override such as a custom domain', () => {
    assert.equal(pagesBaseUrl('o/r', 'https://ui.example.com'), 'https://ui.example.com/');
    assert.equal(
      pagesBaseUrl('o/r', 'https://ui.example.com/docs/'),
      'https://ui.example.com/docs/',
    );
  });
});

describe('renderComment', () => {
  it('includes the marker, the preview URL and the short commit for a deployment', () => {
    const body = renderComment({
      state: 'deployed',
      url: 'https://o.github.io/r/pr-preview/pr-12/',
      sha: '0123456789abcdef',
    });
    assert.ok(body.startsWith(MARKER));
    assert.match(body, /https:\/\/o\.github\.io\/r\/pr-preview\/pr-12\//);
    assert.match(body, /`0123456`/);
    assert.doesNotMatch(body, /89abcdef/);
  });

  it('keeps the marker and drops the link once the preview is removed', () => {
    const body = renderComment({ state: 'removed' });
    assert.ok(body.startsWith(MARKER));
    assert.doesNotMatch(body, /https?:\/\//);
  });
});

describe('command line', () => {
  /** @type {{ method: string, url: string, body: any, auth: string | undefined }[]} */
  let requests;
  /** @type {{ id: number, body: string }[]} */
  let comments;
  let server;
  /** 下一次寫入要回應的錯誤狀態碼（0 表示正常） */
  let failNextWrite = 0;
  let env;

  before(async () => {
    server = createServer((request, response) => {
      let raw = '';
      request.on('data', (chunk) => (raw += chunk));
      request.on('end', () => {
        const body = raw ? JSON.parse(raw) : undefined;
        requests.push({
          method: request.method,
          url: request.url,
          body,
          auth: request.headers.authorization,
        });
        response.setHeader('Content-Type', 'application/json');
        if (request.method !== 'GET' && failNextWrite) {
          response.statusCode = failNextWrite;
          failNextWrite = 0;
          response.end(JSON.stringify({ message: 'Resource not accessible by integration' }));
          return;
        }
        if (request.method === 'GET') {
          const page = Number(new URL(request.url, 'http://x').searchParams.get('page'));
          response.end(JSON.stringify(comments.slice((page - 1) * 100, page * 100)));
        } else {
          response.end(JSON.stringify({ id: 999 }));
        }
      });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    env = {
      ...process.env,
      GITHUB_TOKEN: 'test-token',
      GITHUB_REPOSITORY: 'MirageApache/Anchor_UI',
      GITHUB_API_URL: `http://127.0.0.1:${server.address().port}`,
      PAGES_BASE_URL: '',
    };
  });
  after(() => new Promise((resolve) => server.close(resolve)));
  beforeEach(() => {
    requests = [];
    comments = [];
  });

  const cli = (...args) => run(process.execPath, [script, ...args], { env });
  const writes = () => requests.filter((request) => request.method !== 'GET');

  it('creates a comment with the preview link on first deployment', async () => {
    await cli(
      '--pr',
      '12',
      '--state',
      'deployed',
      '--sha',
      'abcdef1234',
      '--path',
      'pr-preview/pr-12',
    );

    assert.equal(writes().length, 1);
    const [request] = writes();
    assert.equal(request.method, 'POST');
    assert.equal(request.url, '/repos/MirageApache/Anchor_UI/issues/12/comments');
    assert.equal(request.auth, 'Bearer test-token');
    assert.ok(request.body.body.includes(MARKER));
    assert.ok(
      request.body.body.includes('https://mirageapache.github.io/Anchor_UI/pr-preview/pr-12/'),
    );
  });

  it('updates the existing comment instead of posting another one', async () => {
    comments = [
      { id: 1, body: 'unrelated review comment' },
      {
        id: 42,
        body: `${MARKER}\nold preview`,
        user: { login: 'github-actions[bot]', type: 'Bot' },
      },
    ];
    await cli(
      '--pr',
      '12',
      '--state',
      'deployed',
      '--sha',
      'fedcba9876',
      '--path',
      'pr-preview/pr-12',
    );

    assert.equal(writes().length, 1);
    assert.equal(writes()[0].method, 'PATCH');
    assert.equal(writes()[0].url, '/repos/MirageApache/Anchor_UI/issues/comments/42');
    assert.match(writes()[0].body.body, /`fedcba9`/);
  });

  it('finds the existing comment beyond the first page', async () => {
    comments = Array.from({ length: 150 }, (_, index) => ({ id: index + 1, body: 'noise' }));
    comments[130] = {
      id: 131,
      body: `${MARKER}\nold preview`,
      user: { login: 'github-actions[bot]', type: 'Bot' },
    };
    await cli(
      '--pr',
      '12',
      '--state',
      'deployed',
      '--sha',
      'abcdef1234',
      '--path',
      'pr-preview/pr-12',
    );

    assert.equal(writes()[0].method, 'PATCH');
    assert.equal(writes()[0].url, '/repos/MirageApache/Anchor_UI/issues/comments/131');
  });

  it('ignores a comment by someone else that contains the marker', async () => {
    // 公開 repo 上任何人都能貼含標記的留言；機器人不可把預覽連結寫進別人擁有的留言
    comments = [
      { id: 7, body: `${MARKER}\nfake preview`, user: { login: 'someone', type: 'User' } },
    ];
    await cli(
      '--pr',
      '12',
      '--state',
      'deployed',
      '--sha',
      'abcdef1234',
      '--path',
      'pr-preview/pr-12',
    );

    assert.equal(writes().length, 1);
    assert.equal(writes()[0].method, 'POST');
    assert.equal(writes()[0].url, '/repos/MirageApache/Anchor_UI/issues/12/comments');
  });

  it('uses PAGES_BASE_URL for the link when a custom domain is configured', async () => {
    await run(
      process.execPath,
      [
        script,
        '--pr',
        '12',
        '--state',
        'deployed',
        '--sha',
        'abcdef1234',
        '--path',
        'pr-preview/pr-12',
      ],
      { env: { ...env, PAGES_BASE_URL: 'https://ui.example.com' } },
    );
    assert.ok(writes()[0].body.body.includes('https://ui.example.com/pr-preview/pr-12/'));
  });

  it('marks the preview as removed when the PR is closed', async () => {
    comments = [
      {
        id: 42,
        body: `${MARKER}\nold preview`,
        user: { login: 'github-actions[bot]', type: 'Bot' },
      },
    ];
    await cli('--pr', '12', '--state', 'removed');

    assert.equal(writes()[0].method, 'PATCH');
    assert.match(writes()[0].body.body, /已移除/);
  });

  it('does not comment on close when no preview was ever posted', async () => {
    await cli('--pr', '12', '--state', 'removed');
    assert.equal(writes().length, 0);
  });

  it('reports API failures (for example a token without permission)', async () => {
    failNextWrite = 403;
    await assert.rejects(
      cli('--pr', '12', '--state', 'deployed', '--sha', 'abcdef1234', '--path', 'pr-preview/pr-12'),
      /403/,
    );
  });

  it('rejects invalid arguments without calling the API', async () => {
    for (const args of [
      ['--pr', 'abc', '--state', 'deployed', '--sha', 'x', '--path', 'p'],
      ['--pr', '12', '--state', 'unknown'],
      ['--pr', '12', '--state', 'deployed'],
    ]) {
      await assert.rejects(cli(...args), /預覽留言失敗/);
    }
    assert.equal(requests.length, 0);
  });
});
