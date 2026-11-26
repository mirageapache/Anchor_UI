/**
 * Anchor UI — 主題切換（深淺模式）。
 * 透過 <html data-theme="dark"> 驅動 CSS Custom Properties。
 * 獨立成模組（不載入全域樣式），讓測試工具與其他模組可直接使用，不必重寫相同邏輯。
 */

import { sharedState } from './internal/shared-state.js';

export type Theme = 'light' | 'dark';

export interface SetThemeOptions {
  /**
   * 是否短暫套用 .theme-transitioning class，讓所有可視屬性平滑過渡（預設 true）。
   * 頁面初次載入或截圖測試等需要立即生效時可設為 false。
   */
  transition?: boolean;
}

/**
 * 移除 .theme-transitioning 的計時器：連續切換時以最後一次為準。
 * class 加在整頁共用的 <html> 上，因此計時器也存放在整頁共用的狀態：頁面上有多份元件庫時，
 * 一份的計時器不會在另一份的轉場進行到一半時把 class 移除
 */
const transitionState = sharedState<{ timer?: ReturnType<typeof setTimeout> }>(
  'theme@1',
  () => ({}),
);

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
  // 250ms 後移除過渡 class，避免影響後續一般互動動畫。
  // 先取消前一次的計時器：否則快速連續切換時，較早的計時器會在後一次轉場進行到一半時移除 class，畫面瞬間跳變
  if (transition) {
    clearTimeout(transitionState.timer);
    transitionState.timer = setTimeout(() => html.classList.remove('theme-transitioning'), 250);
  }
}

/**
 * 取得目前頁面所處之主題狀態。
 * 只看 `<html>` 的 `data-theme`：在頁面的某個區塊上另外設定 `data-theme="dark"` 雖然會套用深色的 token，
 * 但不是受支援的用法，`getTheme()` / `setTheme()` 與跟隨主題的元件（如 Navbar 的主題切換）都不會反映它
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
