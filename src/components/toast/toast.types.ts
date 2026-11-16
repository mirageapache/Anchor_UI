/**
 * Anchor UI — Toast Types
 */

/**
 * 通知狀態
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

/**
 * 通知在視窗中的位置（`ToastService.configure({ placement })`）。
 * 寬度 480px 以下的螢幕（手機）一律顯示在中間上方，不受此設定影響。
 */
export type ToastPlacement =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * `ToastService.show()` 選項
 */
export interface ToastOptions {
  /**
   * 識別碼：與現有通知相同時改為更新該通知（避免重複堆疊，例如連續複製）；未指定時自動產生
   */
  id?: string;
  /** 狀態（預設 `info`） */
  variant?: ToastVariant;
  /** 標題 */
  title?: string;
  /** 訊息 */
  message?: string;
  /**
   * 自動關閉的等待時間（毫秒）；0 為不自動關閉。未指定時依狀態採用預設值（loading 預設不自動關閉）
   */
  duration?: number;
  /** 是否隱藏關閉鈕 */
  noCloseButton?: boolean;
}

/**
 * `ToastService.show()` 等方法回傳的控制器
 */
export interface ToastHandle {
  /** 通知的識別碼 */
  readonly id: string;
  /** 更新內容與狀態（例如 loading 轉 success），並重新開始自動關閉計時 */
  update(options: Omit<ToastOptions, 'id'>): void;
  /** 關閉通知 */
  close(): void;
  /** 通知關閉並移除後 resolve */
  readonly closed: Promise<void>;
}

/**
 * `ToastService.configure()` 設定
 */
export interface ToastConfig {
  /** 同時顯示的上限，超過的通知會排隊等候（預設 3） */
  maxVisible?: number;
  /**
   * 排隊等候的上限（預設 50）：超過時捨棄最舊的排隊通知（其 `closed` 照常 resolve），
   * 避免錯誤迴圈等情況無限累積；0 為不排隊，Infinity 為不限制
   */
  maxQueued?: number;
  /** 各狀態預設的自動關閉時間（毫秒） */
  durations?: Partial<Record<ToastVariant, number>>;
  /**
   * 通知的位置（預設 `bottom-right`）。新通知出現在靠近螢幕邊緣的一側：
   * 上方位置時最新的在最上面，下方位置時最新的在最下面。可隨時變更，顯示中的通知會一起移動。
   * 寬度 480px 以下的螢幕一律顯示在中間上方。
   */
  placement?: ToastPlacement;
}
