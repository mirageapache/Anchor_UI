import type { Placement } from '@floating-ui/dom';

/**
 * 浮層（Tooltip、Popover）進場縮放的原點：依 @floating-ui/dom 計算出的實際方位，朝觸發元素展開。
 */
export const TRANSFORM_ORIGINS: Readonly<Record<Placement, string>> = {
  top: 'bottom center',
  'top-start': 'bottom left',
  'top-end': 'bottom right',
  bottom: 'top center',
  'bottom-start': 'top left',
  'bottom-end': 'top right',
  left: 'right center',
  'left-start': 'right top',
  'left-end': 'right bottom',
  right: 'left center',
  'right-start': 'left top',
  'right-end': 'left bottom',
};
