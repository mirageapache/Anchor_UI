/**
 * Anchor UI — Alert Types
 */

/**
 * 狀態圖示（SweetAlert2 風格）
 */
export type AlertIcon = 'success' | 'error' | 'warning' | 'info';

/**
 * 對話框模式
 * - `alert`：提示，只有確定鈕
 * - `confirm`：確認，取消與確定鈕
 * - `prompt`：輸入，輸入框與取消、確定鈕
 */
export type AlertMode = 'alert' | 'confirm' | 'prompt';

/**
 * 取消原因
 * - `cancel-button`：點擊取消鈕
 * - `escape`：按下 ESC
 * - `backdrop`：點擊遮罩
 * - `timer`：`timer` 設定的時間到而自動關閉
 * - `api`：以程式關閉（`hide()` 或將 `open` 設為 false），或開啟中被移出頁面
 */
export type AlertCancelReason = 'cancel-button' | 'escape' | 'backdrop' | 'timer' | 'api';

/**
 * `aui-confirm` 事件資料
 */
export interface AlertConfirmDetail {
  /** prompt 模式的輸入值；其他模式為空字串 */
  value: string;
}

/**
 * `aui-cancel` 事件資料
 */
export interface AlertCancelDetail {
  reason: AlertCancelReason;
}

/**
 * `AlertService.alert()` 選項
 */
export interface AlertOptions {
  /** 標題 */
  title?: string;
  /** 訊息內容 */
  message?: string;
  /** 狀態圖示 */
  icon?: AlertIcon;
  /** 確定鈕文字（預設「確定」） */
  confirmText?: string;
  /** 是否允許點擊遮罩關閉（預設 true，關閉視同取消） */
  closeOnBackdrop?: boolean;
  /**
   * 自動關閉的等待時間（毫秒，例如 3000 為 3 秒）；時間到視同取消。
   * 滑鼠停在對話框上時暫停，使用者以鍵盤操作或點擊對話框內容後不再自動關閉。
   */
  timer?: number;
}

/**
 * `AlertService.confirm()` 選項
 */
export interface ConfirmOptions extends AlertOptions {
  /** 取消鈕文字（預設「取消」） */
  cancelText?: string;
  /** 破壞性操作：確定鈕改為危險樣式，初始焦點落在取消鈕 */
  destructive?: boolean;
}

/**
 * `AlertService.prompt()` 選項
 */
export interface PromptOptions extends ConfirmOptions {
  /** 輸入框預設值 */
  defaultValue?: string;
  /** 輸入框佔位提示 */
  placeholder?: string;
  /** 輸入框的無障礙名稱（預設為標題） */
  inputLabel?: string;
}
