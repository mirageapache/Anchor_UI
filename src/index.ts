/**
 * Anchor UI — 前端共用元件庫 (Core Entry Point)
 *
 * @packageDocumentation
 */

import './styles.scss';

export const VERSION = '0.0.1';

/**
 * 設定目前頁面之視覺主題 ('light' | 'dark')
 * 透過於 document.documentElement 上設置 data-theme 屬性驅動 CSS Custom Properties
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
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
