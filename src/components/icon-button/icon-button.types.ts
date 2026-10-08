export type { TooltipPlacement } from '../tooltip/tooltip.types.js';

/**
 * Anchor UI — Icon Button 變體類型
 */
export type IconButtonVariant = 'ghost' | 'subtle' | 'outline' | 'primary' | 'danger';

/**
 * Anchor UI — Icon Button 語意色彩控制（支援懸停與互動色彩變換）
 */
export type IconButtonColor =
  'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';

/**
 * Anchor UI — Icon Button 尺寸規格
 */
export type IconButtonSize = 'sm' | 'md' | 'lg';

/**
 * Anchor UI — Icon Button 外觀形狀
 */
export type IconButtonShape = 'rounded' | 'circle' | 'square';

/**
 * Anchor UI — Icon Button 內建預設圖示集
 */
export type IconButtonPreset =
  'copy' | 'download' | 'close' | 'check' | 'refresh' | 'external' | 'more';

/**
 * Anchor UI — Icon Button 點擊行為模式
 */
export type IconButtonAction = 'copy' | 'download' | 'custom' | 'none';

/**
 * Anchor UI — Icon Button 當前運作狀態
 */
export type IconButtonStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 複製完成事件資料
 */
export interface CopyDetail {
  value: string;
}

/**
 * 下載觸發事件資料
 */
export interface DownloadDetail {
  url?: string;
  filename?: string;
}

/**
 * 下載失敗事件資料（例如 download-url 使用了不允許的協定）
 */
export interface DownloadErrorDetail {
  url: string;
  error: Error;
}

/**
 * 狀態變更事件資料
 */
export interface StatusChangeDetail {
  status: IconButtonStatus;
  previousStatus: IconButtonStatus;
}
