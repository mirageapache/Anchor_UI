import { AuiTag } from './tag.js';
/**
 * 語意色彩變體：支援 7 種核心語意色與別名色彩
 */
export type TagVariant = 'brand' | 'success' | 'warning' | 'purple' | 'danger' | 'info' | 'neutral' | 'deep-blue' | 'green' | 'amber' | 'red' | 'blue' | 'accent';
/**
 * 尺寸規格階層
 */
export type TagSize = 'sm' | 'md' | 'lg';
/**
 * `aui-remove` 事件資料
 */
export interface TagRemoveDetail {
    /** 被點擊移除鈕的標籤。元件本身不會移除自己：由監聽者決定是否從畫面或資料中移除 */
    tag: AuiTag;
}
//# sourceMappingURL=tag.types.d.ts.map