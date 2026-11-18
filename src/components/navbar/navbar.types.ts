/**
 * Anchor UI — Navbar Types
 */

import type { Theme } from '../../theme.js';

/**
 * 定位方式
 * - `sticky`：隨頁面捲動到頂端後吸附（預設）
 * - `fixed`：固定於視窗頂端（頁面內容需自行預留 `--nav-height` 的上方空間）
 * - `static`：一般文件流，不吸附
 */
export type NavbarPosition = 'sticky' | 'fixed' | 'static';

/**
 * `aui-search` 事件資料：`source` 為觸發方式（點擊搜尋鈕或按下快捷鍵）
 */
export interface NavbarSearchDetail {
  source: 'click' | 'shortcut';
}

/**
 * `aui-theme-change` 事件資料：`theme` 為即將切換到的主題
 */
export interface NavbarThemeChangeDetail {
  theme: Theme;
}
