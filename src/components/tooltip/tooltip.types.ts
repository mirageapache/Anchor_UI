/**
 * Tooltip 支援的 12 種浮動方位
 */
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * 觸發展開之互動行為（支援空格分隔組合，例如 'hover focus'）
 */
export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';
