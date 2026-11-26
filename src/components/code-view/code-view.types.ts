/**
 * Anchor UI — Code View Types
 */

/**
 * 可摺疊的區塊：起訖行號（從 1 起算，含兩端）。
 * 起始行保持顯示，摺疊時隱藏第 `start + 1` 到 `end` 行
 *
 * @deprecated 元件沒有任何屬性、方法或事件使用這個型別（摺疊範圍由縮排自動計算，不對外提供），將於下一個主版號移除
 */
export interface CodeFoldRange {
  start: number;
  end: number;
}
