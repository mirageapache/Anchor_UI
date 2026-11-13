/**
 * Anchor UI — Segmented Control Types
 */

/**
 * 分段控制器的單一選項
 */
export interface SegmentedOption {
  /** 選取後的值（隨表單提交） */
  value: string;
  /** 顯示文字 */
  label: string;
  /** 是否停用（不可選取，鍵盤巡覽時略過） */
  disabled?: boolean;
}
