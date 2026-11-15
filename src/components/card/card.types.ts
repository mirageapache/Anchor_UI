/**
 * Anchor UI — Card Types
 */

/**
 * 卡片名稱的標題層級（對應 `<h1>` ~ `<h6>`），依卡片所在頁面的標題階層選擇。
 * 公開型別不可引用 src/internal（其型別不隨套件發布），因此在此獨立定義。
 */
export type CardHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** 連結卡片的開啟目標（同原生 `<a target>`）：內建關鍵字或具名的瀏覽內容 */
// (string & {}) 保留關鍵字的自動完成，同時允許任意名稱
export type CardTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {});
