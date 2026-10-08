/**
 * Anchor UI — 前端共用元件庫 (Core Entry Point)
 *
 * @packageDocumentation
 */

import './styles.scss';

export * from './components/index.js';

/**
 * 套件版本號，由 Vite 於建置時從 package.json 自動注入。
 * 確保此常數永遠與發布版本一致，無需手動維護。(L-01)
 */
export const VERSION: string = __PKG_VERSION__;

/**
 * 設定目前頁面之視覺主題 ('light' | 'dark')
 * 透過於 document.documentElement 上設置 data-theme 屬性驅動 CSS Custom Properties。
 * 切換前後短暫套用 .theme-transitioning class，確保所有元素平滑過渡（H-03）。
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    // 短暫套用 .theme-transitioning 讓所有可視屬性平滑切換
    html.classList.add('theme-transitioning');
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    // 250ms 後移除過渡 class，避免影響後續一般互動動畫
    setTimeout(() => html.classList.remove('theme-transitioning'), 250);
  }
}

/**
 * 取得目前頁面所處之主題狀態
 */
export function getTheme(): 'light' | 'dark' {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * 切換深淺主題狀態
 */
export function toggleTheme(): 'light' | 'dark' {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
