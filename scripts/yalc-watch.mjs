// TASK-109: 監聽 src/ 變更 → 重新建置 → yalc push 到所有已 `yalc add` 的專案
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';

const DEBOUNCE_MS = 300;
let timer = null;
let running = false;
let pending = false;

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('close', (code) => resolve(code === 0));
  });
}

async function rebuildAndPush() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  console.log('\n[yalc-watch] 重新建置中…');
  if ((await run('pnpm', ['build'])) && (await run('pnpm', ['exec', 'yalc', 'push', '--no-scripts']))) {
    console.log('[yalc-watch] 已推送至所有已連結的專案');
  } else {
    console.error('[yalc-watch] 建置或推送失敗，等待下次變更');
  }
  running = false;
  if (pending) {
    pending = false;
    rebuildAndPush();
  }
}

watch('src', { recursive: true }, (_event, file) => {
  // 忽略測試與 stories，避免無謂重建
  if (file && /\.(test|stories)\.[tj]s$/.test(file)) return;
  clearTimeout(timer);
  timer = setTimeout(rebuildAndPush, DEBOUNCE_MS);
});

console.log('[yalc-watch] 監聽 src/ 中… (Ctrl+C 結束)');
rebuildAndPush();
