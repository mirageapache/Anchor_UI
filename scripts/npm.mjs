// 以子程序執行 npm 的共用工具（scripts/pack.mjs、scripts/smoke-test.mjs）。
import { execFileSync } from 'node:child_process';

const isWindows = process.platform === 'win32';

/**
 * Windows 上 npm 是 .cmd 檔，必須透過 shell 執行；此時 Node 只會以空白串接參數、不加引號，
 * 路徑含空白（例如 C:\Users\John Doe\…）就會被拆成兩個參數，因此自行為含空白的參數加上引號。
 */
const quote = (arg) =>
  isWindows && /[\s&|<>^]/.test(arg) ? `"${arg.replaceAll('"', '\\"')}"` : arg;

/**
 * 執行 npm 並回傳 stdout。失敗時拋出包含 stdout / stderr 的錯誤。
 * @param {string[]} args
 * @param {{ cwd?: string }} [options]
 */
export function npm(args, { cwd } = {}) {
  try {
    return execFileSync('npm', args.map(quote), {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWindows,
      // 建置輸出可能很長（Angular / Vite），預設的 1 MB 上限會以 ENOBUFS 失敗
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
    throw new Error(`npm ${args.join(' ')} 失敗：\n${output || error.message}`, { cause: error });
  }
}
