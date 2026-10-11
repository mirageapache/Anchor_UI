import { visualDiff } from '@web/test-runner-visual-regression';

/**
 * 視覺回歸測試的共用環境設定（TASK-203）。
 * 目標是消除所有「環境造成的假差異」：字型、主題 token、動畫與版面尺寸。
 * 詳見 note/03-visual-regression.md。
 */

/** 元件庫不打包字型，測試環境自行載入（@fontsource，OFL 授權） */
const FONT_STYLESHEETS = [400, 500, 600, 700].flatMap((weight) => [
  `/node_modules/@fontsource/inter/${weight}.css`,
  `/node_modules/@fontsource/jetbrains-mono/${weight}.css`,
]);

const FONT_FACES = [400, 500, 600, 700].flatMap((weight) => [
  `${weight} 16px Inter`,
  `${weight} 16px "JetBrains Mono"`,
]);

function loadStylesheet(href: string): Promise<void> {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`無法載入樣式表：${href}`));
    document.head.appendChild(link);
  });
}

let prepared: Promise<void> | null = null;

/** 載入 tokens、字型與基底樣式（每個測試檔只會執行一次） */
export function prepareVisualEnvironment(): Promise<void> {
  prepared ??= (async () => {
    await Promise.all(['/dist/tokens.css', ...FONT_STYLESHEETS].map(loadStylesheet));

    const base = document.createElement('style');
    base.textContent = `
      html, body { margin: 0; }
      body {
        background-color: var(--color-bg, #f8fafc);
        color: var(--color-text-primary, #0f172a);
        font-family: var(--font-ui, sans-serif);
      }
      .visual-frame {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background-color: var(--color-bg, #f8fafc);
      }
    `;
    document.head.appendChild(base);

    // 明確觸發每個字型的下載，再等待全部完成；否則尚未使用的字型不會被載入
    await Promise.all(FONT_FACES.map((font) => document.fonts.load(font)));
    await document.fonts.ready;
  })();
  return prepared;
}

/** 切換主題（與 setTheme() 相同：操作 <html data-theme>） */
export function setVisualTheme(theme: 'light' | 'dark'): void {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/**
 * 將所有進行中的動畫（含 Shadow DOM 內，例如 Spinner 旋轉）暫停並歸零。
 * 減少動畫設定只會讓 Spinner 變慢、不會停止，截圖前必須凍結才能穩定。
 */
function freezeAnimations(): void {
  for (const animation of document.getAnimations()) {
    animation.pause();
    animation.currentTime = 0;
  }
}

/** 等待渲染穩定後截圖並與基準圖比對 */
export async function snapshot(element: Element, name: string): Promise<void> {
  await nextFrame();
  await nextFrame();
  freezeAnimations();
  await nextFrame();
  await visualDiff(element, name);
}
