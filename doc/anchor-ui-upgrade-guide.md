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
- **Modal 的內部重構**：`<aui-modal>` 的開關邏輯移到與 Drawer 共用的基底類別，屬性、事件、slot 與 CSS part 都沒有改變。
  只有一個型別層面的差異：`AuiModal` 的父類別由 `LitElement` 變為 `ModalDialogElement`（仍繼承自 `LitElement`）。
  一般使用不受影響；若專案自行繼承 `AuiModal` 並宣告了與基底同名的成員，需要改名。
- **授權**：套件附上 MIT `LICENSE`。

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
