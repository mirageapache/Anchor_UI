/**
 * Anchor UI — 主題切換（深淺模式）。
 * 透過 <html data-theme="dark"> 驅動 CSS Custom Properties。
 * 獨立成模組（不載入全域樣式），讓測試工具與其他模組可直接使用，不必重寫相同邏輯。
 */

export type Theme = 'light' | 'dark';

export interface SetThemeOptions {
  /**
   * 是否短暫套用 .theme-transitioning class，讓所有可視屬性平滑過渡（預設 true）。
   * 頁面初次載入或截圖測試等需要立即生效時可設為 false。
   */
  transition?: boolean;
}

/**
 * 設定目前頁面之視覺主題 ('light' | 'dark')
 * 透過於 document.documentElement 上設置 data-theme 屬性驅動 CSS Custom Properties。
 * 預設於切換前後短暫套用 .theme-transitioning class，確保所有元素平滑過渡（H-03）。
 */
export function setTheme(theme: Theme, options: SetThemeOptions = {}): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  const transition = options.transition ?? true;
  // 短暫套用 .theme-transitioning 讓所有可視屬性平滑切換
  if (transition) html.classList.add('theme-transitioning');
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }
  // 250ms 後移除過渡 class，避免影響後續一般互動動畫
  if (transition) setTimeout(() => html.classList.remove('theme-transitioning'), 250);
}

/**
 * 取得目前頁面所處之主題狀態
 */
export function getTheme(): Theme {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * 切換深淺主題狀態
 */
export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
