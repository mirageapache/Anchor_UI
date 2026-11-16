// TASK-308: 在 PR 留言 Storybook 預覽連結（每個 PR 只維護一則留言，重新部署時更新同一則）。
//
//   node scripts/pr-preview-comment.mjs --pr 12 --state deployed --sha <commit> --path pr-preview/pr-12
//   node scripts/pr-preview-comment.mjs --pr 12 --state removed
//
// 環境變數（GitHub Actions 皆已提供）：
//   GITHUB_TOKEN        具 pull-requests: write 權限的權杖
//   GITHUB_REPOSITORY   owner/repo
//   PAGES_BASE_URL      （選用）Pages 站台網址；未設定時為 https://<owner>.github.io/<repo>/（使用自訂網域時設定）
//   GITHUB_API_URL      （選用）預設 https://api.github.com
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';
import { parseArgs } from 'node:util';

/** 用來辨識這則留言的隱藏標記（不可更動，否則會找不到既有留言而重複留言） */
export const MARKER = '<!-- anchor-ui:storybook-preview -->';

/** GitHub Pages 專案站台的預設網址：owner 一律小寫，repo 名稱保留大小寫 */
export function pagesBaseUrl(repository, override) {
  if (override) return override.endsWith('/') ? override : `${override}/`;
  const [owner, repo] = repository.split('/');
  return `https://${owner.toLowerCase()}.github.io/${repo}/`;
}

/** 產生留言內容 */
export function renderComment({ state, url, sha }) {
  if (state === 'removed') {
    return [MARKER, '### 📕 Storybook 預覽', '', '此 PR 已關閉，預覽站台已移除。'].join('\n');
  }
  return [
    MARKER,
    '### 📘 Storybook 預覽',
    '',
    `**${url}**`,
    '',
    `對應 commit：\`${sha.slice(0, 7)}\`。每次推送會重新部署並更新這則留言；PR 關閉後預覽會自動移除。`,
    '',
    '> GitHub Pages 需要約一分鐘才會反映最新內容，剛部署完若看到舊版或 404，請稍候再重新整理。',
  ].join('\n');
}

async function api(path, { method = 'GET', body } = {}) {
  const base = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(
      `GitHub API ${method} ${path} 失敗（${response.status}）：${await response.text()}`,
    );
  }
  return response.json();
}

/** 找出這個 PR 上既有的預覽留言（逐頁查詢） */
async function findComment(repository, pr) {
  for (let page = 1; ; page++) {
    const comments = await api(
      `/repos/${repository}/issues/${pr}/comments?per_page=100&page=${page}`,
    );
    // 只認機器人帳號的留言：公開 repo 上任何人都能貼一則含標記的留言，
    // 若不檢查作者，之後的預覽連結就會被寫進那則由他人擁有（可再編輯）的留言裡
    const found = comments.find(
      (comment) => comment.user?.type === 'Bot' && comment.body?.includes(MARKER),
    );
    if (found) return found;
    if (comments.length < 100) return undefined;
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      pr: { type: 'string' },
      state: { type: 'string' },
      sha: { type: 'string' },
      path: { type: 'string' },
    },
  });
  const repository = process.env.GITHUB_REPOSITORY;
  if (!process.env.GITHUB_TOKEN || !repository) {
    throw new Error('需要 GITHUB_TOKEN 與 GITHUB_REPOSITORY 環境變數');
  }
  if (!/^\d+$/.test(values.pr ?? '')) throw new Error('--pr 必須是 PR 編號');
  if (!['deployed', 'removed'].includes(values.state)) {
    throw new Error('--state 必須是 deployed 或 removed');
  }
  if (values.state === 'deployed' && (!values.sha || !values.path)) {
    throw new Error('--state deployed 需要 --sha 與 --path');
  }

  const existing = await findComment(repository, values.pr);
  // 從未部署過預覽的 PR 關閉時，不需要另外留言說「已移除」
  if (values.state === 'removed' && !existing) {
    console.log('✓ 沒有既有的預覽留言，不需更新');
    return;
  }

  const url =
    values.state === 'deployed'
      ? `${pagesBaseUrl(repository, process.env.PAGES_BASE_URL)}${values.path.replace(/^\/+|\/+$/g, '')}/`
      : undefined;
  const body = renderComment({ state: values.state, url, sha: values.sha });

  if (existing) {
    await api(`/repos/${repository}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: { body },
    });
    console.log(`✓ 已更新 PR #${values.pr} 的預覽留言`);
  } else {
    await api(`/repos/${repository}/issues/${values.pr}/comments`, {
      method: 'POST',
      body: { body },
    });
    console.log(`✓ 已在 PR #${values.pr} 留言預覽連結`);
  }
  if (url) console.log(`  ${url}`);
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`✗ 預覽留言失敗：${error.message}`);
    process.exit(1);
  });
}
