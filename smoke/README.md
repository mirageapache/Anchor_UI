# 跨框架冒煙測試專案 (TASK-307)

這裡的小型專案用來驗證「實際發布的產物」能被外部專案安裝並通過正式建置：

- `vue3/`：Vue 3 + Vite（`vue-tsc` 型別檢查含 SFC 範本，`vite build`）
- `angular/`：Angular + Vite（AnalogJS 外掛，AOT 編譯）

它們**刻意不在 pnpm workspace 內**，也不在 `package.json` 中宣告 `@anchor-ui/core`：
元件庫只會由 `scripts/smoke-test.mjs` 以 `npm pack` 產出的 tarball 安裝進來，
與外部專案取得套件的方式相同。因此在這裡直接開啟檔案時，編輯器會回報找不到 `@anchor-ui/core`，屬於正常現象。

執行方式（於 repo 根目錄）：

```bash
pnpm build
pnpm smoke            # 兩個框架
pnpm smoke vue3       # 單一框架
pnpm smoke --keep     # 保留暫存的專案目錄以便檢查
```

測試會把專案複製到系統暫存目錄後才安裝與建置，不會在這裡產生 `node_modules`。

## 檢查內容

1. 以 tarball 安裝後的套件：版號正確、沒有安裝時會執行的生命週期腳本、不含測試與 stories、
   `exports` 指向的檔案都存在、`dist/` 引用的外部套件都列在 `dependencies`。
2. 型別檢查（`skipLibCheck: false`）：測試時會產生 `src/all-entry-types.ts`，引用全量入口與每個元件入口的型別宣告。
3. 正式建置成功（Vue SFC 編譯／Angular AOT），且產物確實包含應用程式本身。
4. Tree-shaking：只引用 button、input、field、card、toast，打包結果不得包含其他元件。

## 維護

- 相依版本由各專案的 `package-lock.json` 鎖定（`npm ci --ignore-scripts`；Dependabot 不會更新這兩份 lockfile）。更新相依時，在該專案目錄執行
  `npm install --package-lock-only` 後提交 lockfile。
- 新增要驗證的元件入口時，同步更新 `src/` 的引用與 `scripts/smoke-test.mjs` 的 `IMPORTED_ENTRIES`。
- 範本中的「Installed from the tarball」是檢查應用程式有被編譯進產物的標記，請勿移除。
