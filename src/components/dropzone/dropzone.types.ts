/**
 * Anchor UI — Dropzone Types
 */

/** 檔案的取得方式：拖放，或經由原生檔案選取器 */
export type DropzoneSource = 'drop' | 'picker';

/**
 * 檔案被拒絕的原因：
 * - `type`：不符合 `accept` 的格式限制
 * - `count`：未設定 `multiple` 卻一次提供多個檔案（只接受第一個符合的檔案）
 * - `directory`：拖入的是資料夾（無法作為檔案讀取）
 */
export type DropzoneRejectReason = 'type' | 'count' | 'directory';

/** 一個被拒絕的檔案與原因 */
export interface DropzoneRejection {
  file: File;
  reason: DropzoneRejectReason;
}

/** `aui-file-drop` 事件資料 */
export interface FileDropDetail {
  /** 通過格式與數量檢查的檔案 */
  files: File[];
  source: DropzoneSource;
}

/** `aui-file-reject` 事件資料 */
export interface FileRejectDetail {
  /** 被拒絕的檔案（與 `rejections` 順序一致） */
  files: File[];
  rejections: DropzoneRejection[];
  source: DropzoneSource;
}
