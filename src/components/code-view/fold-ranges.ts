/**
 * Code View 的文字處理：拆行、依縮排計算可摺疊的區塊、估算最長一行的顯示寬度。
 * 純函式，不依賴 DOM；行號一律為 0 起算的陣列索引。
 */

/** Tab 的顯示寬度（須與 code-view.styles.ts 的 tab-size 一致） */
export const TAB_SIZE = 4;

/** 拆成行；結尾的單一換行不產生額外的空行（與編輯器開啟檔案時相同） */
export function splitLines(code: string): string[] {
  if (!code) return [];
  const lines = code.split(/\r\n|\r|\n/);
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** 行首縮排的欄數（Tab 對齊到 TAB_SIZE 的倍數）；空白行回傳 -1 */
function indentOf(line: string): number {
  let columns = 0;
  for (const char of line) {
    if (char === ' ') columns++;
    else if (char === '\t') columns += TAB_SIZE - (columns % TAB_SIZE);
    else return columns;
  }
  return -1;
}

/**
 * 依縮排計算可摺疊的區塊（與 VS Code 預設的縮排摺疊相同）：
 * 一行之後的非空白行縮排更深時，該行可摺疊，範圍到縮排回到同層或更淺之前的最後一個非空白行
 * （區塊結尾的空白行不納入，因此 JSON 的結尾括號留在摺疊後的下一行）。
 *
 * 以堆疊在 O(n) 內完成，萬行也只需數毫秒。
 *
 * @returns 起始行 → 結束行（皆為 0 起算的索引），依起始行排序
 */
export function computeFoldRanges(lines: readonly string[]): Map<number, number> {
  const ranges = new Map<number, number>();
  const stack: Array<{ indent: number; line: number }> = [];
  let lastContent = -1;

  const close = (minIndent: number) => {
    while (stack.length && stack[stack.length - 1].indent >= minIndent) {
      const { line } = stack.pop()!;
      if (lastContent > line) ranges.set(line, lastContent);
    }
  };

  lines.forEach((text, i) => {
    const indent = indentOf(text);
    if (indent < 0) return;
    close(indent);
    stack.push({ indent, line: i });
    lastContent = i;
  });
  close(-1);
  // 堆疊依「結束」的順序產生（內層先），改依起始行排序
  return new Map([...ranges].sort(([a], [b]) => a - b));
}

/** 全形字（CJK、全形符號）與常以 emoji 呈現的符號的 Unicode 範圍，約佔兩個半形欄位 */
const WIDE_RANGES: Array<[number, number]> = [
  [0x1100, 0x115f], // 韓文字母
  [0x2300, 0x23ff], // 技術符號（⌘、⏱ 等）
  [0x2600, 0x27bf], // 雜項符號與裝飾符號（☀、✅ 等）
  [0x2b00, 0x2bff], // 雜項符號與箭頭（⭐ 等）
  [0x2e80, 0xa4cf], // CJK 部首、符號、假名、漢字、彝文
  [0xac00, 0xd7a3], // 韓文音節
  [0xf900, 0xfaff], // CJK 相容漢字
  [0xfe30, 0xfe4f], // CJK 相容形式
  [0xff00, 0xff60], // 全形 ASCII
  [0xffe0, 0xffe6], // 全形符號
];

/** 字元的顯示欄數：全形字與 BMP 以外的字元（多為 emoji）算兩欄 */
function charColumns(codePoint: number): number {
  if (codePoint > 0xffff) return 2;
  return WIDE_RANGES.some(([from, to]) => codePoint >= from && codePoint <= to) ? 2 : 1;
}

/**
 * 最長一行的顯示欄數（以 `ch` 為單位的估計值）：Tab 展開為 TAB_SIZE，全形字與 emoji 算兩欄。
 * 寧可高估：用於撐開內容寬度，低估會讓過長的行被分段渲染的繪製範圍裁切
 */
export function maxColumns(lines: readonly string[]): number {
  let max = 0;
  for (const line of lines) {
    // 快速路徑：只含可見 ASCII 的行，長度即為欄數（Tab、全形字與其他字元才需要逐字計算）
    let columns = line.length;
    if (/[^\x20-\x7e]/.test(line)) {
      columns = 0;
      for (const char of line) {
        columns +=
          char === '\t' ? TAB_SIZE - (columns % TAB_SIZE) : charColumns(char.codePointAt(0)!);
      }
    }
    if (columns > max) max = columns;
  }
  return max;
}
