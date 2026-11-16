// TASK-307: 產出發布用的 tarball（release/anchor-ui-core-<版號>.tgz）。
//   node scripts/pack.mjs            打包（需先 pnpm build）
//
// 與直接執行 `npm pack` 的差別：發布的 package.json 不帶「安裝時會執行的生命週期腳本」。
// 根目錄的 `prepare: husky` 是本元件庫開發用的 Git hook，若隨套件發布，消費端以 tarball 或
// 網址安裝時套件管理器會提示有腳本待核准（核准後還會因找不到 husky 而失敗）。
//
// 做法是把要發布的檔案複製到暫存目錄、寫入清理後的 package.json 再打包，
// 全程不修改工作目錄中的 package.json（中途失敗也不會留下變更）。
// 由 `pnpm release:pack` 與 `pnpm smoke`（scripts/smoke-test.mjs）共用。
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { npm } from './npm.mjs';

const root = resolve(import.meta.dirname, '..');

/** 安裝套件時可能被套件管理器執行的生命週期腳本；不可出現在發布的 package.json 中 */
export const INSTALL_LIFECYCLE_SCRIPTS = [
  'preinstall',
  'install',
  'postinstall',
  'prepublish',
  'preprepare',
  'prepare',
  'postprepare',
];

/** 依 package.json 的 files 設定，列出 npm 實際會打包的檔案（相對於套件根目錄） */
function publishedFiles(cwd) {
  const [packed] = JSON.parse(npm(['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd }));
  return packed.files.map((file) => file.path).sort();
}

/**
 * 打包並回傳 tarball 的絕對路徑。
 * @param {{ destination?: string }} [options] destination 預設為 <root>/release
 */
export function pack({ destination = join(root, 'release') } = {}) {
  if (!existsSync(join(root, 'dist/index.js'))) {
    throw new Error('找不到 dist/index.js，請先執行 pnpm build');
  }

  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
  const files = publishedFiles(root);

  const staging = mkdtempSync(join(tmpdir(), 'aui-pack-'));
  try {
    for (const file of files) {
      if (file === 'package.json') continue;
      const target = join(staging, file);
      mkdirSync(dirname(target), { recursive: true });
      cpSync(join(root, file), target);
    }

    const scripts = { ...pkg.scripts };
    for (const name of INSTALL_LIFECYCLE_SCRIPTS) delete scripts[name];
    writeFileSync(
      join(staging, 'package.json'),
      `${JSON.stringify({ ...pkg, scripts }, null, 2)}\n`,
    );

    // 暫存目錄打包出的檔案清單必須與原本完全相同，確保只有 package.json 的內容不同
    const staged = publishedFiles(staging);
    if (JSON.stringify(staged) !== JSON.stringify(files)) {
      const missing = files.filter((file) => !staged.includes(file));
      const extra = staged.filter((file) => !files.includes(file));
      throw new Error(
        `暫存目錄的打包內容與原始設定不一致（缺少 ${missing.length} 個、多出 ${extra.length} 個檔案）`,
      );
    }

    mkdirSync(destination, { recursive: true });
    const [packed] = JSON.parse(
      npm(['pack', '--json', '--ignore-scripts', '--pack-destination', destination], {
        cwd: staging,
      }),
    );
    return join(destination, packed.filename);
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

// 以實際路徑比對：repo 經由符號連結開啟時，import.meta.url 是解析後的路徑而 argv[1] 不是
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(`✓ 已產出 ${pack()}`);
  } catch (error) {
    console.error(`✗ 打包失敗：${error.message}`);
    process.exit(1);
  }
}
