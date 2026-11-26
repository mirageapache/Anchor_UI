// TASK-501：Angular SSR 冒煙測試的執行期檢查（由 scripts/smoke-test.mjs 在 smoke/angular-ssr 建置後呼叫）。
//
// 1. 啟動建置出的 SSR 伺服器並請求首頁：伺服器端 import 元件庫與渲染都不出錯，
//    輸出的 HTML 帶有元件標籤、靜態 attribute 與 hydration 註記（ngh）。
// 2. 以 Chromium 載入同一頁：Angular 沿用伺服器輸出的 DOM（hydration，而非重新渲染），
//    元件完成升級，property 綁定、事件、表單雙向綁定與只在瀏覽器執行的 API 都正常，console 沒有錯誤。
//
// Playwright 由測試專案自己的相依提供（版本與根目錄的 playwright 及 CI 映像相同，見 scripts/check-tool-versions.mjs），
// 因此 CI 不需要安裝 workspace 的相依。
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const SERVER_ENTRY = 'dist/server/server.mjs';
const STARTUP_TIMEOUT_MS = 30_000;
const STEP_TIMEOUT_MS = 15_000;
/** 頁面上由伺服器輸出、hydration 後必須是同一個 DOM 節點的元件（見 smoke/angular-ssr/src/app/app.component.ts） */
const SERVER_RENDERED_TAGS = ['aui-field', 'aui-input', 'aui-segmented', 'aui-button', 'aui-card'];

/** 取得一個目前可用的連接埠 */
function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function startServer(project, port) {
  const child = spawn(process.execPath, [SERVER_ENTRY], {
    cwd: project,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  const server = { child, stderr: '', exited: false };
  child.stderr.on('data', (chunk) => (server.stderr += chunk));
  server.exit = new Promise((resolve) =>
    child.once('exit', () => {
      server.exited = true;
      resolve();
    }),
  );
  return server;
}

/** 結束伺服器並等待程序退出：Windows 上程序仍在執行時無法刪除測試專案的目錄 */
async function stopServer(server) {
  if (!server.exited) server.child.kill();
  await Promise.race([server.exit, delay(5000)]);
}

/** 等伺服器開始接受連線後回傳首頁的回應 */
async function fetchWhenReady(url, server) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (server.exited) {
      // 錯誤訊息由呼叫端附上伺服器的 stderr
      throw new Error(`SSR 伺服器啟動後結束（代碼 ${server.child.exitCode}）`);
    }
    try {
      return await fetch(url);
    } catch {
      await delay(200);
    }
  }
  throw new Error(`SSR 伺服器在 ${STARTUP_TIMEOUT_MS / 1000}s 內沒有回應`);
}

/** 檢查伺服器輸出的 HTML */
function checkServerHtml(html, appMarker) {
  const failures = [];
  const expect = (condition, message) => condition || failures.push(message);

  // Angular 在伺服器端渲染的根元素加上 ng-server-context="ssr"，並為 hydration 加上 ngh 註記
  expect(
    /<app-root[^>]*ng-server-context="ssr"/.test(html),
    'HTML 不是由伺服器端渲染（缺少 ng-server-context="ssr"）',
  );
  expect(/\sngh="/.test(html), 'HTML 缺少 hydration 註記（ngh）');
  expect(html.includes(appMarker), 'HTML 不含應用程式的範本內容');
  for (const tag of SERVER_RENDERED_TAGS) {
    expect(html.includes(`<${tag}`), `HTML 缺少 <${tag}>`);
  }
  // 範本中的靜態 attribute 應原樣輸出（property 綁定只會在瀏覽器套用，不在此檢查）
  expect(/<aui-button[^>]*\svariant="primary"/.test(html), '<aui-button> 缺少 variant="primary"');
  expect(/<aui-field[^>]*\slabel="Name"/.test(html), '<aui-field> 缺少 label="Name"');
  expect(/<aui-card[^>]*\sheading="Card"/.test(html), '<aui-card> 缺少 heading="Card"');
  // setTheme() 放在 afterNextRender，伺服器端不會執行
  expect(
    !/<html[^>]*data-theme/.test(html),
    '伺服器輸出的 <html> 帶有 data-theme（setTheme 在伺服器端執行了）',
  );
  return failures;
}

/** 以 Chromium 檢查 hydration 與元件行為 */
async function checkHydration(project, url) {
  const require = createRequire(join(project, 'package.json'));
  // playwright 是 CommonJS 套件：以 import() 載入時匯出的物件在 default
  const playwright = await import(pathToFileURL(require.resolve('playwright')).href);
  const { chromium } = playwright.default ?? playwright;
  const failures = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const consoleProblems = [];
    page.on('pageerror', (error) => consoleProblems.push(`未捕捉的錯誤：${error.message}`));
    page.on('console', (message) => {
      // Angular 的 hydration 問題（NG05xx）有些只以 warning 回報
      if (message.type() === 'error' || /NG0\d{3}/.test(message.text())) {
        consoleProblems.push(`console.${message.type()}：${message.text()}`);
      }
    });

    // HTML 解析完成（readyState 變為 interactive）時，JS 模組都還沒執行：記下此時伺服器輸出的元件節點，
    // 之後比對是否為同一個節點，以確認 Angular 沿用了伺服器的 DOM，而不是捨棄後重新渲染
    await page.addInitScript((tags) => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'interactive') {
          window.__auiServerNodes = tags.map((tag) => document.querySelector(tag));
        }
      });
    }, SERVER_RENDERED_TAGS);

    const step = async (name, action) => {
      try {
        await action();
      } catch (error) {
        failures.push(`${name}：${error.message.split('\n')[0]}`);
      }
    };

    await page.goto(url);
    // hydration 完成後 Angular 會移除 ngh 註記；afterNextRender 只在瀏覽器渲染後執行
    await step('等待 hydration 完成', () =>
      page.waitForFunction(
        () => !document.querySelector('[ngh]') && document.documentElement.dataset.theme === 'dark',
        null,
        { timeout: STEP_TIMEOUT_MS },
      ),
    );

    const nodes = await page.evaluate(
      (tags) =>
        tags.map((tag, index) => {
          const element = document.querySelector(tag);
          return {
            tag,
            defined: !!customElements.get(tag),
            upgraded: !!element?.shadowRoot,
            reused: !!element && element === window.__auiServerNodes?.[index],
          };
        }),
      SERVER_RENDERED_TAGS,
    );
    for (const { tag, defined, upgraded, reused } of nodes) {
      if (!defined) failures.push(`<${tag}> 沒有註冊`);
      else if (!upgraded) failures.push(`<${tag}> 沒有升級（沒有 Shadow Root）`);
      if (!reused) failures.push(`<${tag}> 不是伺服器輸出的節點（hydration 沒有沿用 DOM）`);
    }

    // property 綁定：只能在瀏覽器套用的值（陣列、數字）
    await step('[options] 綁定', () =>
      page.waitForFunction(
        () =>
          document.querySelector('aui-segmented')?.shadowRoot?.querySelectorAll('[role="radio"]')
            .length === 3,
        null,
        { timeout: STEP_TIMEOUT_MS },
      ),
    );
    await step('[headingLevel] 綁定', () =>
      page.waitForFunction(
        () =>
          document.querySelector('aui-card')?.shadowRoot?.querySelector('[part="heading"]')
            ?.tagName === 'H2',
        null,
        { timeout: STEP_TIMEOUT_MS },
      ),
    );

    const expectText = (selector, text) =>
      page.waitForFunction(
        ([target, expected]) => document.querySelector(target)?.textContent?.trim() === expected,
        [selector, text],
        { timeout: STEP_TIMEOUT_MS },
      );

    // 表單雙向綁定（ngModel + ngDefaultControl）；field 的標題要能成為 input 的無障礙名稱
    await step('aui-input 的 ngModel', async () => {
      await page.getByRole('textbox', { name: 'Name' }).fill('SSR', { timeout: STEP_TIMEOUT_MS });
      await expectText('#name-value', 'SSR');
    });
    await step('aui-segmented 的 ngModel', async () => {
      await page.getByRole('radio', { name: 'Large' }).click({ timeout: STEP_TIMEOUT_MS });
      await expectText('#size-value', 'lg');
    });
    // ngOnInit 中的 ToastService：伺服器端不做任何事（伺服器 log 沒有錯誤），瀏覽器端顯示
    await step('ngOnInit 的 ToastService', () =>
      page.getByText('Welcome').waitFor({ timeout: STEP_TIMEOUT_MS }),
    );
    // 事件綁定
    await step('(click) 與 ToastService', async () => {
      await page.getByRole('button', { name: 'Notify' }).click({ timeout: STEP_TIMEOUT_MS });
      await page.getByText('SSR / lg').waitFor({ timeout: STEP_TIMEOUT_MS });
    });

    failures.push(...consoleProblems);
  } finally {
    await browser.close();
  }
  return failures;
}

/**
 * 啟動 smoke/angular-ssr 建置出的 SSR 伺服器並檢查伺服器輸出與瀏覽器端的 hydration。
 * @param {string} project 已安裝並建置完成的測試專案目錄
 * @param {{ appMarker: string }} options appMarker：應用程式範本中的文字，出現在 HTML 中代表應用程式確實由伺服器渲染
 * @returns {Promise<string[]>} 失敗訊息
 */
export async function checkServerRendering(project, { appMarker }) {
  const port = await freePort();
  const url = `http://localhost:${port}/`;
  const server = startServer(project, port);
  const failures = [];
  try {
    const response = await fetchWhenReady(url, server);
    const html = await response.text();
    if (response.ok) {
      failures.push(...checkServerHtml(html, appMarker));
      failures.push(...(await checkHydration(project, url)));
    } else {
      failures.push(`SSR 伺服器回應 ${response.status}`);
    }
  } catch (error) {
    failures.push(error.message);
  } finally {
    await stopServer(server);
  }
  // 伺服器端渲染的錯誤只會寫入伺服器的 log：例如在伺服器端存取瀏覽器 API 時回應 500；
  // Host 不在 allowedHosts 時則改為回傳客戶端渲染的頁面（仍是 200）
  if (server.stderr.trim()) {
    failures.push(`SSR 伺服器輸出了錯誤：\n${server.stderr.trim()}`);
  }
  return failures;
}
