// scripts/pages-deploy.mjs 的測試：對本機的 bare repo 實際執行部署，驗證 gh-pages 分支的內容。
//   node --test scripts/     （pnpm test:scripts）
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, beforeEach, describe, it } from 'node:test';
import { deploy, normalizeTarget, redact } from './pages-deploy.mjs';

const sandbox = mkdtempSync(join(tmpdir(), 'aui-pages-test-'));
after(() => rmSync(sandbox, { recursive: true, force: true }));

const git = (cwd, args) =>
  execFileSync('git', args, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

let remote;
let counter = 0;

/** 建立一個靜態網站目錄；files 為 { 相對路徑: 內容 } */
function site(files) {
  const dir = join(sandbox, `site-${++counter}`);
  for (const [path, content] of Object.entries({ 'index.html': '<h1>site</h1>', ...files })) {
    const target = join(dir, ...path.split('/'));
    mkdirSync(join(target, '..'), { recursive: true });
    writeFileSync(target, content);
  }
  return dir;
}

/** 取得 remote 上 gh-pages 分支目前的檔案清單（排序後） */
function published(branch = 'gh-pages') {
  return git(remote, ['ls-tree', '-r', '--name-only', branch]).split('\n').filter(Boolean).sort();
}

const show = (path, branch = 'gh-pages') => git(remote, ['show', `${branch}:${path}`]);
const commitCount = (branch = 'gh-pages') => Number(git(remote, ['rev-list', '--count', branch]));

beforeEach(() => {
  remote = join(sandbox, `remote-${++counter}.git`);
  git(sandbox, ['init', '--quiet', '--bare', remote]);
});

describe('normalizeTarget', () => {
  it('normalizes separators and treats empty or "." as the site root', () => {
    assert.equal(normalizeTarget('pr-preview/pr-12'), 'pr-preview/pr-12');
    assert.equal(normalizeTarget('pr-preview\\pr-12/'), 'pr-preview/pr-12');
    assert.equal(normalizeTarget('./pr-preview/./pr-12'), 'pr-preview/pr-12');
    assert.equal(normalizeTarget('.'), '.');
    assert.equal(normalizeTarget(''), '.');
  });

  it('rejects paths that could escape the site or touch .git', () => {
    for (const target of [
      '../outside',
      'pr-preview/../../x',
      '.git',
      'a/.git/hooks',
      '/abs',
      'C:/x',
    ]) {
      assert.throws(() => normalizeTarget(target), /部署目標/, target);
    }
  });
});

describe('redact', () => {
  it('hides credentials embedded in remote URLs', () => {
    assert.equal(
      redact('fatal: unable to access https://x-access-token:ghs_secret@github.com/o/r.git/'),
      'fatal: unable to access https://***@github.com/o/r.git/',
    );
    assert.equal(redact('https://github.com/o/r.git'), 'https://github.com/o/r.git');
  });

  it('does not leak the token when a deploy fails', () => {
    // 連線到本機未開啟的連接埠：立即失敗，不依賴 DNS 或外部網路
    const remoteWithToken = 'http://x-access-token:ghs_secret@127.0.0.1:1/o/r.git';
    assert.throws(
      () => deploy({ remove: 'pr-preview/pr-1', remote: remoteWithToken }),
      (error) => !error.message.includes('ghs_secret') && error.message.includes('***@'),
    );
    assert.throws(
      () => deploy({ source: site({}), target: 'pr-preview/pr-1', remote: remoteWithToken }),
      (error) => !error.message.includes('ghs_secret'),
    );
  });
});

describe('deploy', () => {
  it('creates the branch on first deploy and adds .nojekyll', () => {
    const changed = deploy({ source: site({ 'assets/app.js': 'app' }), target: '.', remote });
    assert.equal(changed, true);
    assert.deepEqual(published(), ['.nojekyll', 'assets/app.js', 'index.html']);
    assert.equal(commitCount(), 1);
  });

  it('deploys a PR preview into its own directory without touching the rest', () => {
    deploy({ source: site({ 'main.js': 'main' }), target: '.', remote });
    deploy({ source: site({ 'index.html': 'pr 12' }), target: 'pr-preview/pr-12', remote });
    deploy({ source: site({ 'index.html': 'pr 13' }), target: 'pr-preview/pr-13', remote });

    assert.deepEqual(published(), [
      '.nojekyll',
      'index.html',
      'main.js',
      'pr-preview/pr-12/index.html',
      'pr-preview/pr-13/index.html',
    ]);
    assert.equal(show('pr-preview/pr-12/index.html'), 'pr 12');
    assert.equal(show('index.html'), '<h1>site</h1>');
  });

  it('replaces a preview completely on redeploy (stale files are removed)', () => {
    deploy({ source: site({ 'old.js': 'old' }), target: 'pr-preview/pr-12', remote });
    deploy({ source: site({ 'new.js': 'new' }), target: 'pr-preview/pr-12', remote });
    assert.deepEqual(published(), [
      '.nojekyll',
      'pr-preview/pr-12/index.html',
      'pr-preview/pr-12/new.js',
    ]);
  });

  it('replaces the site root but keeps existing PR previews', () => {
    deploy({ source: site({ 'old.js': 'old' }), target: '.', remote });
    deploy({ source: site({ 'index.html': 'pr 12' }), target: 'pr-preview/pr-12', remote });
    deploy({ source: site({ 'index.html': 'v2', 'new.js': 'new' }), target: '.', remote });

    assert.deepEqual(published(), [
      '.nojekyll',
      'index.html',
      'new.js',
      'pr-preview/pr-12/index.html',
    ]);
    assert.equal(show('index.html'), 'v2');
    assert.equal(show('pr-preview/pr-12/index.html'), 'pr 12');
  });

  it('does not let a root deploy overwrite the kept directory from its own source', () => {
    deploy({ source: site({ 'index.html': 'pr 12' }), target: 'pr-preview/pr-12', remote });
    deploy({ source: site({ 'pr-preview/pr-12/index.html': 'hijacked' }), target: '.', remote });
    assert.equal(show('pr-preview/pr-12/index.html'), 'pr 12');
  });

  it('removes a preview and leaves other content alone', () => {
    deploy({ source: site({}), target: '.', remote });
    deploy({ source: site({ 'index.html': 'pr 12' }), target: 'pr-preview/pr-12', remote });
    deploy({ source: site({ 'index.html': 'pr 13' }), target: 'pr-preview/pr-13', remote });

    assert.equal(deploy({ remove: 'pr-preview/pr-12', remote }), true);
    assert.deepEqual(published(), ['.nojekyll', 'index.html', 'pr-preview/pr-13/index.html']);
  });

  it('is a no-op when nothing changes', () => {
    const source = site({ 'app.js': 'app' });
    deploy({ source, target: 'pr-preview/pr-12', remote });
    const before = commitCount();

    assert.equal(deploy({ source, target: 'pr-preview/pr-12', remote }), false);
    assert.equal(deploy({ remove: 'pr-preview/pr-99', remote }), false);
    assert.equal(commitCount(), before);
  });

  it('does nothing when asked to remove a preview before the branch exists', () => {
    // 例如來自 fork 的 PR 從未部署過預覽就被關閉：不應為此建立分支
    assert.equal(deploy({ remove: 'pr-preview/pr-12', remote }), false);
    assert.equal(git(remote, ['branch', '--list', 'gh-pages']), '');
  });

  it('supports a custom branch and commit message', () => {
    deploy({ source: site({}), target: '.', remote, branch: 'pages', message: 'docs: publish' });
    assert.deepEqual(published('pages'), ['.nojekyll', 'index.html']);
    assert.equal(git(remote, ['log', '-1', '--format=%s', 'pages']), 'docs: publish');
  });

  it('re-applies the change on top of a deploy that landed in between', () => {
    deploy({ source: site({}), target: '.', remote });

    // 在第一次推送之前，讓另一個 PR 的部署先完成：第一次推送因分支已前進而被拒絕，
    // 重試時必須以最新的分支內容為基礎，兩個預覽才會同時存在
    const attempts = [];
    const changed = deploy({
      source: site({ 'index.html': 'pr 21' }),
      target: 'pr-preview/pr-21',
      remote,
      retryDelayMs: 0,
      beforePush: (attempt) => {
        attempts.push(attempt);
        if (attempt === 1) {
          deploy({ source: site({ 'index.html': 'pr 20' }), target: 'pr-preview/pr-20', remote });
        }
      },
    });

    assert.equal(changed, true);
    assert.deepEqual(attempts, [1, 2], 'the first push was rejected and retried once');
    assert.deepEqual(published(), [
      '.nojekyll',
      'index.html',
      'pr-preview/pr-20/index.html',
      'pr-preview/pr-21/index.html',
    ]);
    assert.equal(show('pr-preview/pr-20/index.html'), 'pr 20');
    assert.equal(show('pr-preview/pr-21/index.html'), 'pr 21');
  });

  it('does not let a cleanup resurrect or drop a concurrent deploy', () => {
    deploy({ source: site({ 'index.html': 'pr 20' }), target: 'pr-preview/pr-20', remote });
    deploy({ source: site({ 'index.html': 'pr 21' }), target: 'pr-preview/pr-21', remote });

    // 清除 pr-20 的同時，pr-21 重新部署了新內容
    deploy({
      remove: 'pr-preview/pr-20',
      remote,
      retryDelayMs: 0,
      beforePush: (attempt) => {
        if (attempt === 1) {
          deploy({
            source: site({ 'index.html': 'pr 21 v2' }),
            target: 'pr-preview/pr-21',
            remote,
          });
        }
      },
    });

    assert.deepEqual(published(), ['.nojekyll', 'pr-preview/pr-21/index.html']);
    assert.equal(show('pr-preview/pr-21/index.html'), 'pr 21 v2');
  });

  it('gives up after repeated rejections and cleans up its temporary clone', () => {
    deploy({ source: site({}), target: '.', remote });
    const before = readdirSync(tmpdir()).filter((name) => name.startsWith('aui-pages-')).length;

    // 每次推送前都有其他部署先完成：永遠追不上
    let competing = 0;
    assert.throws(
      () =>
        deploy({
          source: site({ 'index.html': 'never lands' }),
          target: 'pr-preview/pr-30',
          remote,
          retryDelayMs: 0,
          beforePush: () => {
            deploy({
              source: site({ 'index.html': `other ${++competing}` }),
              target: 'pr-preview/pr-31',
              remote,
            });
          },
        }),
      /已嘗試 6 次/,
    );
    assert.equal(competing, 6);
    assert.ok(!published().includes('pr-preview/pr-30/index.html'));
    const after = readdirSync(tmpdir()).filter((name) => name.startsWith('aui-pages-')).length;
    assert.equal(after, before, 'no temporary clone left behind');
  });

  it('fails fast when the push fails for a reason other than a moved branch', () => {
    deploy({ source: site({}), target: '.', remote });
    const attempts = [];
    assert.throws(
      () =>
        deploy({
          source: site({ 'index.html': 'pr 40' }),
          target: 'pr-preview/pr-40',
          remote,
          retryDelayMs: 0,
          beforePush: (attempt) => {
            attempts.push(attempt);
            // 推送前 remote 消失：模擬權限或連線這類重試也不會成功的錯誤
            rmSync(remote, { recursive: true, force: true });
          },
        }),
      /git push/,
    );
    assert.deepEqual(attempts, [1], 'not retried');
  });

  it('keeps CNAME on root deploys so a custom domain survives', () => {
    deploy({ source: site({ CNAME: 'ui.example.com' }), target: '.', remote, keep: [] });
    assert.equal(show('CNAME'), 'ui.example.com');

    // 之後的根目錄部署（來源不含 CNAME）不可把它刪掉
    deploy({ source: site({ 'index.html': 'v2' }), target: '.', remote });
    assert.equal(show('CNAME'), 'ui.example.com');
    assert.equal(show('index.html'), 'v2');
  });

  it('is not confused by another branch whose name ends with the target branch', () => {
    // 先建立 backup/gh-pages；gh-pages 本身還不存在
    deploy({ source: site({}), target: '.', remote, branch: 'backup/gh-pages' });
    assert.equal(deploy({ remove: 'pr-preview/pr-1', remote }), false);

    deploy({ source: site({ 'index.html': 'real' }), target: '.', remote });
    assert.equal(show('index.html'), 'real');
  });

  it('publishes files even when the site ships a .gitignore that would exclude them', () => {
    deploy({
      source: site({ '.gitignore': 'assets/\n', 'assets/app.js': 'app' }),
      target: 'pr-preview/pr-50',
      remote,
    });
    assert.ok(published().includes('pr-preview/pr-50/assets/app.js'));
  });

  it('rejects invalid input', () => {
    assert.throws(
      () => deploy({ source: join(sandbox, 'missing'), target: '.', remote }),
      /來源目錄/,
    );
    assert.throws(() => deploy({ source: site({}), target: 'pr-preview', remote }), /保留目錄/);
    assert.throws(() => deploy({ remove: '.', remote }), /根目錄/);
    assert.throws(() => deploy({ source: site({}), target: '../x', remote }), /部署目標/);

    const empty = join(sandbox, `empty-${++counter}`);
    mkdirSync(empty);
    assert.throws(() => deploy({ source: empty, target: '.', remote }), /index\.html/);
  });
});
