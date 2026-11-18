# Anchor UI 升級遷移手冊

> 給在專案中使用 `@anchor-ui/core` 的開發者：如何升級到新版本，以及各版本需要注意的變更。
> 安裝與框架設定見 [README 的「在其他專案中導入」](../README.md#在其他專案中導入-installation)。

---

## 一、版本規則

| 版本形式                | 例子         | 意義                                                           |
| ----------------------- | ------------ | -------------------------------------------------------------- |
| `x.y.z-beta`、`-beta.n` | `1.1.0-beta` | 預覽版：功能已完成、仍在測試，供先行驗證。正式專案請等正式版。 |
| `x.y.z`                 | `1.1.0`      | 正式版。                                                       |

- 版號遵循 [SemVer](https://semver.org/lang/zh-TW/)。`1.0.0` 起：
  - **修補版**（`1.0.0` → `1.0.1`）只有錯誤修正，可直接升級。
  - **次要版**（`1.0.x` → `1.1.0`）新增功能，保持相容。
  - **主要版**（`1.x` → `2.0.0`）含不相容的變更，本手冊會列出遷移步驟。
- `1.0.0` 以前的 `0.x` 版本任何一版都可能有不相容的變更。
- 每一版的變更列在 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 與 [`CHANGELOG.md`](../CHANGELOG.md)。

---

## 二、升級步驟

1. 到 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 找到要升級的版本，閱讀變更說明與本手冊對應的段落。
2. 以新版本的 tarball 網址重新安裝（把兩處版號換成新版本）：

   ```bash
   npm install https://github.com/mirageapache/Anchor_UI/releases/download/v1.0.0/anchor-ui-core-1.0.0.tgz
   # 或
   pnpm add https://github.com/mirageapache/Anchor_UI/releases/download/v1.0.0/anchor-ui-core-1.0.0.tgz
   ```

   以網址安裝的相依不會被 `npm update` 自動升級，版本完全由網址決定。

3. 確認 `package.json` 與 lockfile 都已更新，並一起提交。
4. 重新建置並檢查：

   - [ ] 型別檢查與正式建置通過（`vue-tsc` / `ng build` 等）。
   - [ ] 用到的元件畫面正常，深淺兩種主題都看過。
   - [ ] 表單元件（`<aui-input>`、`<aui-segmented>`）的雙向綁定與送出仍正常。
   - [ ] 有監聽 `aui-` 事件的地方行為不變。

若要回到舊版，以舊版本的網址重新安裝即可。

---

## 三、各版本注意事項

### `0.3.0` 之後的下一版（Phase 4）

> 尚未發布。Phase 4 結束時預計以 `1.0.0-beta`、`1.0.0` 發布；實際版號以 Releases 為準。

新增功能，沒有不相容的變更：

- **新元件**：`<aui-drawer>`（側邊抽屜）、`<aui-navbar>`（頂部導覽列）、`<aui-footer>`（頁尾）、`<aui-code-view>`（程式碼檢視區）。
  按需載入時從各自的入口引用，例如 `import '@anchor-ui/core/drawer'`。
- **新 Design Token**：`--shadow-drawer`。自行覆寫 tokens 的專案不需要改動，未覆寫時使用預設值。
- **深色主題的 `--color-text-muted` 提亮**（`#64748b` → `#8494ab`）：原值在深色底上對比只有 3.1:1，
  未達 WCAG AA；影響深色主題下的 placeholder 與使用這個 token 的文字。自行覆寫此 token 的專案不受影響。
- **Modal 的內部重構**：`<aui-modal>` 的開關邏輯移到與 Drawer 共用的基底類別，屬性、事件、slot 與 CSS part 都沒有改變。
  只有一個型別層面的差異：`AuiModal` 的父類別由 `LitElement` 變為 `ModalDialogElement`（仍繼承自 `LitElement`）。
  一般使用不受影響；若專案自行繼承 `AuiModal` 並宣告了與基底同名的成員，需要改名。
- **關閉鈕的名稱可設定**：`<aui-modal>`、`<aui-drawer>` 新增 `close-label`（預設「關閉」），供多語系頁面使用。
- **授權**：套件附上 MIT `LICENSE`。

行為修正（多數專案不需要改動，下列情況請檢查）：

- **`<aui-input>` 按 Enter 會送出表單**：單行輸入框現在與原生 `<input>` 相同，按 Enter 會送出所屬表單
  （有送出按鈕時等同點擊它；沒有時僅在表單只有一個單行欄位時送出）。先前按 Enter 沒有反應。
  若專案自行監聽 `keydown` 在 Enter 時送出，會變成送出兩次：移除自己的處理，或在監聽器中 `preventDefault()`。
- **`<aui-button type="submit">` / `"reset"` 的表單動作改在點擊事件分派完畢後執行**：與原生按鈕相同，
  在 `click` 監聽器中 `preventDefault()` 可以取消送出（先前擋不住）。
  影響：呼叫 `button.click()` 之後，`submit` 事件不再同步觸發，而是在下一個 task；
  測試中點擊後請等待一次（例如 `await new Promise((r) => setTimeout(r))`）再檢查結果。
- **`<fieldset disabled>` 會停用其中的 `<aui-button>`**（先前只對 `<aui-input>`、`<aui-segmented>` 有效）。
- **`<aui-icon-button>` 的 `active` 不再被回饋狀態改寫**：複製 / 下載成功時的高亮改由 `status="success"` 呈現，
  `active` 屬性維持使用端設定的值。先前成功時 `active` 會變成 `true`、回饋結束後一律重設為 `false`；
  以 `[active]` 選取成功狀態的樣式請改用 `[status='success']`。
- **`<aui-icon-button>` 下載同源檔案不再導走頁面**：未設定 `download-filename` 時也一律以下載處理。
- **連結只接受安全的協定**：`<aui-card href>`、`<aui-navbar brand-href>` 與 `<aui-footer>` 的 `columns[].links[].href`
  只接受 http(s)、`mailto:`、`tel:` 與相對路徑。其他協定（`javascript:`、`data:` 等）不會輸出 `href`，
  該元素顯示為沒有連結的內容。
- **`<aui-tag>` 移除鈕不再有 `title` 屬性**：滑鼠懸停的提示改放在圖示的 SVG `<title>`，
  避免螢幕閱讀器把名稱念兩次。以 `[title]` 選取移除鈕的樣式或測試請改用 `::part(remove-button)`。
- **`<aui-tooltip>` 停用中設定 `open` 會被撤回**：先前會停在 `open` 為 true 卻沒有顯示的狀態，
  解除停用後也無法再開啟。
- **全域樣式（`styles.css`）不再清除非鍵盤聚焦元素的 `box-shadow`**：先前滑鼠點擊可聚焦的元素後，
  它自己的陰影會消失到失焦為止。若專案依賴這個行為來移除點擊後的陰影，請自行加上樣式。

### `0.3.0-beta` / `0.3.0`

新增功能，沒有不相容的變更（`0.3.0` 與 `0.3.0-beta` 內容相同）：

- **新元件**：`<aui-card>`（含 `.card-grid` 格線）、`<aui-accordion>`、`<aui-dropzone>`、`<aui-favorite-btn>`、
  `<aui-header>`、`<aui-kbd>`。
- **Toast 位置**：可以用 `ToastService.configure({ placement })` 設定六種位置，預設仍為右下角（`bottom-right`）。
  行為改變：手機（寬度 ≤ 480px，或橫放且高度 ≤ 480px）一律顯示在中間上方，不受設定影響。
- **Kbd**：`size="sm"` 略為放大，避免符號貼到邊框。

### `0.2.0-beta` 以前

- 這些版本的 tarball 帶有元件庫開發用的 `prepare: husky` 腳本，安裝時套件管理器可能提示有腳本待核准
  （npm `install-scripts`、pnpm「Ignored build scripts」）。**不需要核准**，消費端用不到；之後的版本已不含此腳本。
