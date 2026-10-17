// TASK-213：以 Storybook Test Runner 對 build-storybook 的產物（storybook-static/）執行所有 story 與 play function。
//
// 不另外安裝靜態伺服器：以 node:http 提供 storybook-static，取得可用的 port 後執行 test-storybook，
// 結束時關閉伺服器並沿用 test-storybook 的結束代碼。須先執行 pnpm build-storybook。
//
// 用法：node scripts/test-storybook.mjs [傳給 test-storybook 的參數，例如 --maxWorkers=2]
import { spawn } from 'node:child_process';
import { existsSync, statSync, createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const staticDir = join(root, 'storybook-static');

if (!existsSync(join(staticDir, 'index.json'))) {
  console.error('找不到 storybook-static/index.json，請先執行 pnpm build-storybook');
  process.exit(1);
}

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  let file = normalize(join(staticDir, decodeURIComponent(pathname)));
  // 不允許跳出 storybook-static
  if (file !== staticDir && !file.startsWith(staticDir + sep)) {
    response.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(response);
});

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}`;
  console.log(`Storybook 靜態檔案：${url}`);

  const runner = spawn('pnpm', ['exec', 'test-storybook', '--url', url, ...process.argv.slice(2)], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  runner.on('exit', (code, signal) => {
    server.close();
    process.exit(code ?? (signal ? 1 : 0));
  });
});
