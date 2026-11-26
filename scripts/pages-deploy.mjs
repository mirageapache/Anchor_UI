// TASK-308: 把建置好的靜態網站（Storybook）發布到 GitHub Pages 使用的分支（預設 gh-pages）。
//
//   node scripts/pages-deploy.mjs --source storybook-static --target pr-preview/pr-12
//       部署到子目錄（PR 預覽）：只取代該目錄，其他內容不動
//   node scripts/pages-deploy.mjs --source storybook-static --target .
//       部署到站台根目錄（main 的線上文件）：取代根目錄的內容，但保留 --keep 指定的項目（預設 pr-preview 與 CNAME）
//   node scripts/pages-deploy.mjs --remove pr-preview/pr-12
//       移除子目錄（PR 關閉時清除預覽）
//
// 其他選項：
//   --branch <name>   目標分支（預設 gh-pages；不存在時建立沒有歷史的新分支）
//   --remote <url>    目標 remote（預設 origin；測試時可指向本機的 bare repo）
//   --keep <names>    部署到根目錄時保留的頂層項目，以逗號分隔（預設 pr-preview,CNAME）
//   --message <text>  commit 訊息
//
// 不使用第三方 action：部署會把 contents: write 的權杖交給執行的程式，
// 以 repo 內可審查的腳本完成，並且能在本機對暫存的 repo 測試（scripts/pages-deploy.test.mjs）。
//
// 以獨立的暫存 clone 操作（不影響呼叫端的工作目錄）。多個部署同時進行時 push 可能被拒絕，
// 此時重新取得最新的分支內容再套用一次變更並重試。workflow 不以 concurrency 讓部署排隊：
// GitHub 的 concurrency 群組只保留一個等候中的 run，較早排隊的部署（或 PR 關閉時的清除）會被取消。
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_ATTEMPTS = 6;

/**
 * 部署到站台根目錄時預設保留的頂層項目：
 * - pr-preview：各 PR 的預覽
 * - CNAME：設定自訂網域時 GitHub 會把它寫入此分支，刪除後自訂網域會失效
 */
export const DEFAULT_KEEP = ['pr-preview', 'CNAME'];

/** 驗證部署目標是位於站台內的相對路徑，回傳以 / 分隔的正規化路徑（根目錄為 '.'） */
export function normalizeTarget(target) {
  const parts = String(target ?? '')
    .replace(/\\/g, '/')
    .split('/')
    .filter((part) => part && part !== '.');
  if (parts.some((part) => part === '..' || part === '.git')) {
    throw new Error(`部署目標不可包含 ".." 或 ".git"：${target}`);
  }
  if (/^[a-zA-Z]:/.test(parts[0] ?? '') || String(target).startsWith('/')) {
    throw new Error(`部署目標必須是相對路徑：${target}`);
  }
  return parts.length ? parts.join('/') : '.';
}

/** 遮蔽網址中的帳號密碼（CI 以 https://x-access-token:<token>@github.com/… 推送，不可出現在錯誤訊息中） */
export const redact = (text) => String(text).replace(/(https?:\/\/)[^/@\s]+@/g, '$1***@');

function git(cwd, args) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
      // 憑證錯誤時直接失敗，不開啟互動式的帳號密碼提示（本機執行時會卡住）
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    }).trim();
  } catch (error) {
    // Node 的錯誤訊息包含完整的指令列（含 remote 網址），改以遮蔽後的內容重新拋出
    const detail = redact(`${error.stderr ?? ''}`.trim() || error.message);
    throw new Error(`git ${redact(args.join(' '))} 失敗：${detail}`);
  }
}

/**
 * 推送被拒絕是否因為分支已被其他部署更新（可重試）。
 * 權限不足、網路錯誤等其他失敗重試也不會成功，應立即回報。
 */
const isPushRace = (message) =>
  /\[rejected\]|\[remote rejected\]|non-fast-forward|fetch first|cannot lock ref|failed to update ref|pre-receive hook declined/i.test(
    message,
  );

/** 等待指定的毫秒數（同步；部署腳本沒有其他並行的工作） */
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/** remote 上是否已有該分支 */
function remoteBranchExists(remote, branch) {
  // 以完整的 ref 名稱查詢：只給分支名稱時會比對路徑結尾，backup/gh-pages 也會被當成 gh-pages
  return git(process.cwd(), ['ls-remote', remote, `refs/heads/${branch}`]) !== '';
}

/** 取得目標分支最新內容的工作目錄；分支不存在時建立沒有歷史的新分支 */
function checkoutBranch(workdir, remote, branch) {
  rmSync(workdir, { recursive: true, force: true });
  if (remoteBranchExists(remote, branch)) {
    git(process.cwd(), ['clone', '--quiet', '--depth', '1', '--branch', branch, remote, workdir]);
  } else {
    git(process.cwd(), ['init', '--quiet', workdir]);
    git(workdir, ['checkout', '--quiet', '--orphan', branch]);
    git(workdir, ['remote', 'add', 'origin', remote]);
  }
  // CI 的 runner 沒有設定身分；commit 以 GitHub Actions 的機器人帳號記錄
  git(workdir, ['config', 'user.name', process.env.GIT_AUTHOR_NAME ?? 'github-actions[bot]']);
  git(workdir, [
    'config',
    'user.email',
    process.env.GIT_AUTHOR_EMAIL ?? '41898282+github-actions[bot]@users.noreply.github.com',
  ]);
}

/** 把變更套用到工作目錄 */
function applyChange(workdir, { source, target, remove, keep }) {
  if (remove) {
    rmSync(join(workdir, ...remove.split('/')), { recursive: true, force: true });
    return;
  }

  if (target === '.') {
    // 根目錄：移除既有內容（保留 .git 與 keep 指定的目錄），再放入新的網站
    for (const entry of readdirSync(workdir)) {
      if (entry === '.git' || keep.includes(entry)) continue;
      rmSync(join(workdir, entry), { recursive: true, force: true });
    }
    cpSync(source, workdir, {
      recursive: true,
      // 來源中與保留目錄同名的頂層項目不可覆蓋既有的預覽
      filter: (from) => {
        const relative = from.slice(source.length).split(sep).filter(Boolean);
        return !(relative.length > 0 && keep.includes(relative[0]));
      },
    });
  } else {
    const destination = join(workdir, ...target.split('/'));
    rmSync(destination, { recursive: true, force: true });
    cpSync(source, destination, { recursive: true });
  }
}

/**
 * 部署或移除，回傳是否產生了新的 commit（內容沒有變化時不 commit、不 push）。
 * @param {{ source?: string, target?: string, remove?: string, branch?: string, remote?: string, keep?: string[], message?: string }} options
 */
export function deploy(options) {
  const branch = options.branch ?? 'gh-pages';
  const remote = options.remote ?? git(process.cwd(), ['remote', 'get-url', 'origin']);
  const keep = options.keep ?? DEFAULT_KEEP;
  const remove = options.remove === undefined ? undefined : normalizeTarget(options.remove);
  const target = remove === undefined ? normalizeTarget(options.target) : undefined;
  const source = options.source === undefined ? undefined : resolve(options.source);

  if (remove === '.') throw new Error('不可移除站台根目錄');
  if (remove === undefined) {
    if (!source || !existsSync(join(source, 'index.html'))) {
      throw new Error(`來源目錄不存在或缺少 index.html：${options.source ?? '(未指定)'}`);
    }
    if (target !== '.' && keep.includes(target)) {
      throw new Error(`不可直接部署到保留目錄 ${target}，請指定其下的子目錄`);
    }
  }

  const message =
    options.message ??
    (remove ? `chore(pages): remove ${remove}` : `chore(pages): deploy ${target}`);
  // 分支尚未建立時沒有東西可移除（例如從未部署過預覽的 PR 被關閉），不為此建立分支
  if (remove !== undefined && !remoteBranchExists(remote, branch)) return false;

  const workdir = mkdtempSync(join(tmpdir(), 'aui-pages-'));

  try {
    for (let attempt = 1; ; attempt++) {
      checkoutBranch(workdir, remote, branch);
      applyChange(workdir, { source, target, remove, keep });
      // Pages 預設以 Jekyll 處理，會略過底線開頭的檔案與目錄；.nojekyll 關閉這個行為
      writeFileSync(join(workdir, '.nojekyll'), '');

      // --force：網站內容即使符合 .gitignore（來源自帶的，或執行者的全域設定）也要發布
      git(workdir, ['add', '--all', '--force']);
      if (git(workdir, ['status', '--porcelain']) === '') return false;
      git(workdir, ['commit', '--quiet', '-m', message]);

      // 測試用：在推送前插入動作，模擬其他部署先一步完成
      options.beforePush?.(attempt);

      try {
        git(workdir, ['push', '--quiet', 'origin', `HEAD:refs/heads/${branch}`]);
        return true;
      } catch (error) {
        // 只有「分支已被其他部署更新」才重試；權限或網路錯誤重試也不會成功
        if (!isPushRace(error.message)) throw error;
        if (attempt >= MAX_ATTEMPTS) {
          throw new Error(`推送 ${branch} 失敗（已嘗試 ${MAX_ATTEMPTS} 次）：${error.message}`);
        }
        // 稍候後重新取得最新的分支內容，再套用一次變更
        sleep(options.retryDelayMs ?? 1000 * attempt);
      }
    }
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index++) {
    const name = argv[index];
    if (!name.startsWith('--')) throw new Error(`無法辨識的參數：${name}`);
    const value = argv[++index];
    if (value === undefined || value.startsWith('--')) throw new Error(`${name} 需要一個值`);
    const key = name.slice(2);
    if (!['source', 'target', 'remove', 'branch', 'remote', 'keep', 'message'].includes(key)) {
      throw new Error(`無法辨識的選項：${name}`);
    }
    options[key] = key === 'keep' ? value.split(',').filter(Boolean) : value;
  }
  if ((options.remove === undefined) === (options.target === undefined)) {
    throw new Error('請指定 --target（搭配 --source）或 --remove 其中之一');
  }
  return options;
}

// 以實際路徑比對（同 pack.mjs）：經由符號連結執行時若不成立，腳本會什麼都不做卻以結束碼 0 結束
if (process.argv[1] && realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url)) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const changed = deploy(options);
    const subject = options.remove ? `移除 ${options.remove}` : `部署至 ${options.target}`;
    console.log(changed ? `✓ 已${subject}` : `✓ ${subject}：內容沒有變化，未產生新的 commit`);
  } catch (error) {
    console.error(`✗ Pages 部署失敗：${error.message}`);
    process.exit(1);
  }
}
