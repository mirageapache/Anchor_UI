/**
 * Code View 的文字處理：拆行、依縮排計算可摺疊的區塊、估算最長一行的顯示寬度。
 * 純函式，不依賴 DOM；行號一律為 0 起算的陣列索引。
 */
/** Tab 的顯示寬度（code-view.styles.ts 的 tab-size 取自此值） */
export declare const TAB_SIZE = 4;
/** 拆成行；結尾的單一換行不產生額外的空行（與編輯器開啟檔案時相同） */
export declare function splitLines(code: string): string[];
/**
 * 依縮排計算可摺疊的區塊（與 VS Code 預設的縮排摺疊相同）：
 * 一行之後的非空白行縮排更深時，該行可摺疊，範圍到縮排回到同層或更淺之前的最後一個非空白行
 * （區塊結尾的空白行不納入，因此 JSON 的結尾括號留在摺疊後的下一行）。
 *
 * 以堆疊在 O(n) 內完成，萬行也只需數毫秒。
 *
 * @returns 起始行 → 結束行（皆為 0 起算的索引），依起始行排序
 */
export declare function computeFoldRanges(lines: readonly string[]): Map<number, number>;
/**
 * 最長一行的顯示欄數（以 `ch` 為單位的估計值）：Tab 展開為 TAB_SIZE，全形字與 emoji 算兩欄。
 * 寧可高估：用於撐開內容寬度，低估會讓過長的行被分段渲染的繪製範圍裁切
 */
export declare function maxColumns(lines: readonly string[]): number;
//# sourceMappingURL=fold-ranges.d.ts.map