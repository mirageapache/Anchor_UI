/**
 * Anchor UI — Tag / Badge Types
 */

import type { AuiTag } from './tag.js';

/**
 * 語意色彩變體：支援 7 種核心語意色與別名色彩
 */
export type TagVariant =
  | 'brand'
  | 'success'
  | 'warning'
  | 'purple'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'deep-blue'
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'accent';

/**
 * 尺寸規格階層
 */
export type TagSize = 'sm' | 'md' | 'lg';

/**
 * `aui-remove` 事件資料
 */
export interface TagRemoveDetail {
  /** 被移除的標籤（事件可取消，取消時不移除） */
  tag: AuiTag;
}
