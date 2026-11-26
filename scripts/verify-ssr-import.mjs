// TASK-501：在 Node（沒有瀏覽器 DOM 的環境）載入建置後的每個入口，確認伺服器端渲染（SSR）時 import 元件庫不會出錯。
//
//   pnpm build && pnpm verify:ssr
//
// SSR 框架（Angular SSR 等）會在 Node 執行應用程式的模組，元件庫因此也會在 Node 被 import。
// 元件只在瀏覽器升級（伺服器只輸出標籤），但模組頂層的程式碼兩邊都會執行：
// 在模組頂層存取 document / window / navigator 等瀏覽器 API，伺服器就會在載入時崩潰。
// Lit 3 在 Node 會載入 @lit-labs/ssr-dom-shim，提供 HTMLElement 與 customElements 的最小實作，
// 因此類別定義與 customElements.define() 可以執行。
//
// 透過套件自身的 exports（@anchor-ui/core/<name>）載入 dist/，與使用端的解析方式相同。
// 另外在 Node 呼叫 setTheme、ToastService、AlertService，確認伺服器端的行為（見 SERVER_API_CHECKS）。
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { listComponents } from './components.mjs';

const root = resolve(import.meta.dirname, '..');
/** SSR 框架常以這些全域變數是否存在判斷執行環境，元件庫不得自行補上 */
const BROWSER_GLOBALS = ['window', 'document', 'navigator', 'localStorage'];
const failures = [];

const presentGlobals = () =>
  BROWSER_GLOBALS.filter((name) => typeof globalThis[name] !== 'undefined');

// navigator 自 Node 21 起為內建全域變數，只檢查載入前後是否有變化
const before = new Set(presentGlobals());

const entries = listComponents(root).map((name) => ({
  specifier: `@anchor-ui/core/${name}`,
  tag: `aui-${name}`,
}));

// 個別入口各自在全新的 Node 程序載入：同一個程序共用一份 customElements，先載入的入口
// （如 alert 連帶註冊 button / input / modal）會讓之後的入口「已註冊」而檢查不到自己是否能獨立載入
const ENTRY_CHECK = `
const [specifier, tag] = process.argv.slice(1);
const GLOBALS = ${JSON.stringify(BROWSER_GLOBALS)};
const present = () => GLOBALS.filter((name) => typeof globalThis[name] !== 'undefined');
const before = present();
await import(specifier);
console.log(JSON.stringify({
  registered: Boolean(globalThis.customElements?.get(tag)),
  added: present().filter((name) => !before.includes(name)),
}));
`;
for (const { specifier, tag } of entries) {
  const child = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', ENTRY_CHECK, specifier, tag],
    { cwd: root, encoding: 'utf-8' },
  );
  if (child.status !== 0) {
    failures.push(`import '${specifier}' 失敗：${child.stderr.trim() || child.error}`);
    continue;
  }
  const { registered, added } = JSON.parse(child.stdout.trim().split('\n').at(-1));
  if (!registered) failures.push(`單獨 import '${specifier}' 後沒有註冊 ${tag}`);
  if (added.length) {
    failures.push(`import '${specifier}' 後出現瀏覽器全域變數：${added.join(', ')}`);
  }
}

// 全量入口在本程序載入（之後的伺服器端 API 檢查沿用）
try {
  await import('@anchor-ui/core');
  const unregistered = entries
    .map((entry) => entry.tag)
    .filter((tag) => !globalThis.customElements?.get(tag));
  if (unregistered.length) {
    failures.push(`import '@anchor-ui/core' 後沒有註冊：${unregistered.join(', ')}`);
  }
} catch (error) {
  failures.push(`import '@anchor-ui/core' 失敗：${error?.stack ?? error}`);
}

// 命令式 API 在伺服器端的行為：SSR 時同一段程式（如 Angular 的 ngOnInit）會在伺服器與瀏覽器各執行一次。
// setTheme / ToastService 在伺服器端不做任何事（由瀏覽器端那一次實際執行）；
// AlertService 需要使用者回應，伺服器端以明確的錯誤 reject（不拋出 ReferenceError、不保持 pending）
const SERVER_API_CHECKS = {
  'setTheme / getTheme / toggleTheme'({ setTheme, getTheme, toggleTheme }) {
    setTheme('dark');
    toggleTheme();
    if (getTheme() !== 'light') throw new Error('伺服器端的 getTheme() 應為 light');
  },
  async ToastService({ ToastService }) {
    ToastService.configure({ placement: 'top-center' });
    const handle = ToastService.loading('伺服器端');
    handle.update({ variant: 'success', message: '完成' });
    ToastService.update(handle.id, { message: '更新' });
    ToastService.close(handle.id);
    handle.close();
    await handle.closed;
    await ToastService.closeAll();
    ToastService.resetConfig();
  },
  async AlertService({ AlertService }) {
    // 呼叫本身不拋錯，回傳的 Promise 立即以說明用途的錯誤 reject（不以取消結束、不保持 pending）
    const timeout = Symbol('timeout');
    const outcomes = await Promise.all(
      [AlertService.alert('a'), AlertService.confirm('b'), AlertService.prompt('c')].map(
        (promise) =>
          Promise.race([
            promise.then(
              () => 'resolved',
              (error) => error,
            ),
            new Promise((done) => setTimeout(done, 50, timeout)),
          ]),
      ),
    );
    const unexpected = outcomes.filter(
      (outcome) => !(outcome instanceof Error && outcome.message.includes('只能在瀏覽器端使用')),
    );
    if (unexpected.length) {
      throw new Error(
        `伺服器端的對話框應以「只能在瀏覽器端使用」的錯誤 reject，實際為：${unexpected.map(String).join('、')}`,
      );
    }
  },
};
const core = await import('@anchor-ui/core').catch(() => null);
for (const [name, check] of Object.entries(core ? SERVER_API_CHECKS : {})) {
  try {
    await check(core);
  } catch (error) {
    failures.push(`伺服器端呼叫 ${name} 失敗：${error?.stack ?? error}`);
  }
}

const added = presentGlobals().filter((name) => !before.has(name));
if (added.length) {
  failures.push(
    `載入元件庫後出現瀏覽器全域變數：${added.join(', ')}（SSR 框架可能因此誤判為瀏覽器環境）`,
  );
}

if (failures.length) {
  console.error('✗ SSR 載入檢查失敗：');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `✓ SSR 載入檢查通過：在 Node 載入 ${entries.length} 個入口皆未出錯、元件皆已註冊，` +
    `伺服器端呼叫 ${Object.keys(SERVER_API_CHECKS).length} 組命令式 API 的行為正確`,
);
