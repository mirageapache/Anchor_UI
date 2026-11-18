// TASK-406：發布套件的相依性漏洞門檻。
//
// 只檢查會隨套件安裝到使用端的 runtime 相依（根目錄 package.json 的 dependencies 及其遞移相依，
// 目前為 lit 與 @floating-ui/dom），High / Critical 即失敗。
// examples/ 與開發工具的漏洞不進入發布產物，由 Dependabot 追蹤更新、不阻擋（見 TASK-406）。
//
// 做法：`pnpm audit --prod --json` 會稽核整個 workspace（含 examples），因此另以
// `pnpm ls --prod --depth Infinity` 取得根專案的 runtime 相依樹，只保留版本落在這棵樹內的漏洞。
//
// 寧可失敗也不放行：pnpm 無法執行、輸出不是預期的 JSON 格式（沒有 advisories）或稽核本身出錯
// （例如 registry 無法連線）時一律失敗，避免漏洞在格式改變時被默默略過。
//
// 用法：node scripts/audit-runtime.mjs（pnpm audit:runtime）
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** 會讓檢查失敗的嚴重程度 */
export const BLOCKING_SEVERITIES = new Set(['high', 'critical']);

/** 套件版本的識別字串 */
const packageKey = (name, version) => `${name}@${version}`;

/**
 * 由 `pnpm ls --prod --json --depth Infinity` 的結果收集根專案 runtime 相依樹中的所有套件版本。
 * 在 workspace 根目錄執行時結果也包含其他 workspace 專案（examples），只取名稱為 `rootName` 者。
 * 根專案的 optionalDependencies 也會安裝到使用端，一併計入。
 * @param {Array<{ name?: string, dependencies?: Record<string, unknown>, optionalDependencies?: Record<string, unknown> }>} lsResult
 * @param {string} rootName 根目錄 package.json 的 name
 * @returns {Set<string>} `name@version`
 */
export function collectRuntimePackages(lsResult, rootName) {
  const packages = new Set();
  const visit = (deps = {}) => {
    for (const [name, info] of Object.entries(deps)) {
      const key = packageKey(name, info.version);
      if (packages.has(key)) continue;
      packages.add(key);
      visit(info.dependencies);
    }
  };
  const root = lsResult.find((project) => project.name === rootName);
  if (!root) throw new Error(`pnpm ls 的結果中找不到 ${rootName}`);
  visit(root.dependencies);
  visit(root.optionalDependencies);
  return packages;
}

/**
 * 篩出影響 runtime 相依樹的漏洞。
 * @param {{ advisories?: Record<string, { module_name: string, severity: string, title: string, url: string, findings?: Array<{ version: string }> }> }} audit
 * @param {Set<string>} packages collectRuntimePackages() 的結果
 * @returns {Array<{ name: string, version: string, severity: string, title: string, url: string }>}
 */
export function runtimeAdvisories(audit, packages) {
  if (audit?.error) throw new Error(`pnpm audit 失敗：${audit.error.message ?? audit.error.code}`);
  if (typeof audit?.advisories !== 'object' || audit.advisories === null) {
    throw new Error(
      'pnpm audit 的輸出沒有 advisories：格式可能已改變，請更新 scripts/audit-runtime.mjs',
    );
  }
  const result = [];
  for (const advisory of Object.values(audit.advisories)) {
    for (const { version } of advisory.findings ?? []) {
      if (!packages.has(packageKey(advisory.module_name, version))) continue;
      result.push({
        name: advisory.module_name,
        version,
        severity: advisory.severity,
        title: advisory.title,
        url: advisory.url,
      });
    }
  }
  return result;
}

/** 執行 pnpm 並解析 JSON 輸出（pnpm audit 發現漏洞時結束碼非 0，仍有正常的 JSON） */
function pnpmJson(args) {
  // Windows 的 pnpm 為 .cmd，需經由 shell 執行（與 verify-package.mjs 相同）
  const result = spawnSync('pnpm', args, {
    encoding: 'utf-8',
    shell: process.platform === 'win32',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw new Error(`無法執行 pnpm ${args.join(' ')}：${result.error.message}`);
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`pnpm ${args.join(' ')} 沒有輸出 JSON：\n${result.stderr || result.stdout}`);
  }
}

function main() {
  const { name } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
  const packages = collectRuntimePackages(
    pnpmJson(['ls', '--prod', '--json', '--depth', 'Infinity']),
    name,
  );
  const audit = pnpmJson(['audit', '--prod', '--json']);

  const findings = runtimeAdvisories(audit, packages).map((f) => ({
    ...f,
    blocking: BLOCKING_SEVERITIES.has(f.severity),
  }));
  const blocking = findings.filter((f) => f.blocking);
  const total = Object.values(audit.metadata?.vulnerabilities ?? {}).reduce((a, b) => a + b, 0);

  for (const f of findings) {
    const mark = f.blocking ? '✗' : '·';
    console.log(`${mark} [${f.severity}] ${f.name}@${f.version}：${f.title}（${f.url}）`);
  }
  console.log(
    `runtime 相依 ${packages.size} 個套件；其中漏洞 ${findings.length} 項（High / Critical ${blocking.length} 項）。` +
      `整個 workspace 共 ${total} 項，其餘來自 examples 或開發工具，不在發布產物中。`,
  );
  if (blocking.length) {
    console.error('✗ 發布套件的 runtime 相依有 High / Critical 漏洞，請升級相依後再發布');
    process.exit(1);
  }
  console.log('✓ 發布套件的 runtime 相依沒有 High / Critical 漏洞');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
