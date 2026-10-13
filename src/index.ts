/**
 * Anchor UI — 前端共用元件庫 (Core Entry Point)
 *
 * @packageDocumentation
 */

import './styles.scss';

export * from './components/index.js';
export * from './theme.js';

/**
 * 套件版本號，由 Vite 於建置時從 package.json 自動注入。
 * 確保此常數永遠與發布版本一致，無需手動維護。(L-01)
 */
export const VERSION: string = __PKG_VERSION__;
