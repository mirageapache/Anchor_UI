# Size Limit 體積門禁

> 對應任務：Phase 2 TASK-202「Bundle 體積門禁監控」
> 本筆記內容依據 size-limit **v14** 撰寫。

## 1. 是什麼

[**size-limit**](https://github.com/ai/size-limit) 是量測「消費端實際要付出多少體積」的工具。它會模擬使用者引用你的套件、實際打包，計算壓縮後的大小，超過設定的預算（limit）就回報失敗。

**體積門禁（gate）**：把 size-limit 放進 CI，PR 讓體積超出預算時 CI 失敗；搭配分支保護，超標的 PR 就無法合併。

## 2. 為什麼需要

體積是「慢慢變胖」的：多加一個 SVG 圖示、引入一個工具函式庫，每次只多幾 KB，沒人會注意。等到發現時已經很難追溯是哪次變更造成的。門禁的價值在於**每個 PR 當下就看到影響**。

對元件庫特別重要：元件庫的體積會轉嫁到所有使用它的專案上。

## 3. 安裝與設定

```bash
pnpm add -D size-limit @size-limit/preset-small-lib
```

- `@size-limit/preset-small-lib`：適合小型函式庫的預設組合，包含打包（v14 使用 rolldown）與檔案體積量測。
- 若只想量測檔案本身、不重新打包，可改用 `@size-limit/file`。

設定檔 `.size-limit.json`（也可寫在 `package.json` 的 `"size-limit"` 欄位）：

```json
[
  {
    "name": "Button",
    "path": "dist/button.js",
    "ignore": ["lit"],
    "gzip": true,
    "limit": "3.5 KB"
  },
  {
    "name": "只 import AuiButton（從全量入口）",
    "path": "dist/index.js",
    "import": "{ AuiButton }",
    "ignore": ["lit"],
    "gzip": true,
    "limit": "4 KB"
  }
]
```

### 常用選項

| 選項     | 說明                                                                        |
| -------- | --------------------------------------------------------------------------- |
| `path`   | 要量測的檔案（可用 glob）                                                   |
| `limit`  | 預算，例如 `"3.5 KB"`；超過即失敗                                           |
| `import` | 只引用特定 export，例如 `"{ AuiButton }"`，可量測 **tree-shaking 後**的體積 |
| `ignore` | 不計入的相依套件，例如消費端自備的 `lit`                                    |
| `gzip`   | `true` 時以 gzip 計算                                                       |
| `brotli` | **v14 預設使用 brotli 壓縮**；設 `false` 則不壓縮                           |
| `name`   | 報告中顯示的名稱                                                            |

> ⚠️ **壓縮演算法要一致**：size-limit 預設用 brotli，數字通常比 gzip 小。若預算是用 gzip 量出來的（例如 Anchor UI 筆記中的實測值），設定檔就要加 `"gzip": true`，否則會拿 brotli 結果去比 gzip 預算。

## 4. 執行

```bash
npx size-limit           # 量測並與 limit 比較，超標時 exit code 非 0
npx size-limit --json    # 輸出 JSON，方便其他工具讀取
```

## 5. 接到 CI 與 PR 報告

[`andresz1/size-limit-action`](https://github.com/andresz1/size-limit-action) 會比較 PR 與目標分支的體積差異，並在 PR 留言列出表格：

```yaml
size:
  runs-on: ubuntu-latest
  permissions:
    pull-requests: write # 需要寫入權限才能留言
  steps:
    - uses: actions/checkout@v4
    - uses: andresz1/size-limit-action@v1
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
```

> 實際設定（例如 pnpm 安裝、建置指令）以導入時的 action 文件為準。

## 6. 如何訂預算

**不要憑空訂一個漂亮的數字。** Anchor UI 原本規劃「單一原子元件 gzip < 3 KB」，實測後發現最簡單的 Button（3.2 KB）、Tag（3.4 KB）就已超標，預算形同虛設或必須立刻放寬。

建議做法：

1. 先完成建置架構（TASK-201），讓產物結構穩定。
2. 實測每個入口的體積作為**基準**。
3. 預算 = 基準 **+10%**：允許合理成長，擋下異常膨脹。
4. 新元件第一次合併時建立基準。
5. 刻意的大幅成長（例如新增功能）要在 PR 中說明理由並同步調整預算。

Phase 1 結束時的實測參考（gzip、不含 `lit`）：

| 元件       | 體積    | 備註                                                     |
| ---------- | ------- | -------------------------------------------------------- |
| Button     | 3.2 KB  |                                                          |
| Tag        | 3.4 KB  |                                                          |
| Tooltip    | 11.1 KB | 含 `@floating-ui/dom`（TASK-201 改為 external 後會變小） |
| IconButton | 16.8 KB | 含 Tooltip 與 floating-ui                                |

## 7. 在 Anchor UI 的實作（TASK-202）

- 設定檔為 `.size-limit.mjs`（JS 設定可程式化產生檢查項目）：
  - 自動為 `src/components/*` 的每個元件建立檢查，另含全量入口。
  - 基準值寫在 `BASELINES`，預算由程式計算為 **基準 × 1.1**；新元件沒有基準時設定檔直接報錯，避免漏設。
  - `gzip: true`、`ignore: ['lit']`；`@floating-ui/dom` 會隨套件安裝並由消費端打包，所以**計入**使用它的元件。
- 指令：`pnpm size`（需先 `pnpm build`）。
- CI 分成兩部分：
  - **門禁**：放在既有的 `Build & Package Verification` job（已是分支保護的必要檢查），超出預算就無法合併，不需要另外修改 Ruleset。
  - **PR 報告**：獨立的 `Size Report` job 使用 `andresz1/size-limit-action` 留言比較差異，僅供參考（步驟設為 `continue-on-error`）。
    此 action 會在目標分支上也執行 size-limit，**目標分支尚未導入 size-limit 時（首次導入的 PR）無法比較而失敗**，屬預期情況。

建立時的基準（gzip）：

| 入口          | 基準     | 預算     |
| ------------- | -------- | -------- |
| 全量入口      | 20,838 B | 22,922 B |
| `button`      | 3,189 B  | 3,508 B  |
| `tag`         | 3,390 B  | 3,729 B  |
| `tooltip`     | 10,807 B | 11,888 B |
| `icon-button` | 16,704 B | 18,375 B |

## 8. 常見陷阱

- **壓縮演算法不一致**（見上方說明）。
- **沒排除 peer 相依**：`lit` 由消費端提供，沒 `ignore` 會讓每個元件都多算一份 lit。
- **只量全量入口**：全量入口的體積無法反映「按需載入」是否正常，要逐一量測個別入口，並用 `import` 選項驗證 tree-shaking。
- **預算訂太寬**：門禁形同虛設；訂太緊：每個 PR 都在調預算。+10% 是個實用的起點。
- **體積「變小」也可能是警訊**：size-limit 只會擋「變大」。Anchor UI 曾因建置設定錯誤，IconButton 從 16.7 KB 掉到 6.7 KB——原因是相依的 Tooltip 沒被打包進去（元件壞掉了）。體積異常下降時要追查原因；這類問題由 `pnpm verify:package` 的 Tree-shaking 檢查負責攔截。

## 參考資料

- [size-limit（GitHub）](https://github.com/ai/size-limit)
- [size-limit-action（GitHub）](https://github.com/andresz1/size-limit-action)
