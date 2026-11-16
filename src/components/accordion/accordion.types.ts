/**
 * Anchor UI — Accordion Types
 */

/**
 * 預設排版：
 * - `doc`：使用指南／操作說明，獨立的大區塊（較寬的內距與圓角）
 * - `faq`：常見問題，較緊湊，適合多個項目連續堆疊
 */
export type AccordionVariant = 'doc' | 'faq';

/** `aui-toggle` 事件資料 */
export interface AccordionToggleDetail {
  /** 變更後是否為展開狀態 */
  open: boolean;
}
