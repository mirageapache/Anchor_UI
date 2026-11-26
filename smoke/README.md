# 跨框架冒煙測試專案 (TASK-307 / TASK-501 / TASK-508)

這裡的小型專案用來驗證「實際發布的產物」能被外部專案安裝並通過正式建置：

- `vue3/`：Vue 3 + Vite（`vue-tsc` 型別檢查含 SFC 範本，`vite build`）
- `angular/`：Angular + Vite（AnalogJS 外掛，AOT 編譯）
- `react/`：React 19 + Vite（`tsc` 型別檢查含 JSX 的 `@anchor-ui/core/react` 型別）
- `angular-ssr/`：Angular CLI + `@angular/ssr`（伺服器端渲染與 hydration，見下方「Angular SSR」）

它們**刻意不在 pnpm workspace 內**，也不在 `package.json` 中宣告 `@anchor-ui/core`：
元件庫只會由 `scripts/smoke-test.mjs` 以 `npm pack` 產出的 tarball 安裝進來，
與外部專案取得套件的方式相同。因此在這裡直接開啟檔案時，編輯器會回報找不到 `@anchor-ui/core`，屬於正常現象。

執行方式（於 repo 根目錄）：

```bash
pnpm build
pnpm smoke            # 所有框架
pnpm smoke vue3       # 單一框架（vue3 / angular / react / angular-ssr）
pnpm smoke --keep     # 保留暫存的專案目錄以便檢查
```

測試會把專案複製到系統暫存目錄後才安裝與建置，不會在這裡產生 `node_modules`。

## 檢查內容

1. 以 tarball 安裝後的套件：版號正確、沒有安裝時會執行的生命週期腳本、不含測試與 stories、
   `exports` 指向的檔案都存在、`dist/` 引用的外部套件都列在 `dependencies`。
2. 型別檢查（`skipLibCheck: false`）：測試時會產生 `src/all-entry-types.ts`，引用全量入口與每個元件入口的型別宣告；`vue3/` 另以 `src/TemplateTypes.vue`、`react/` 以 `src/TemplateTypes.tsx` 檢查發布的範本型別（`@anchor-ui/core/vue`、`@anchor-ui/core/react`）。
3. 正式建置成功（Vue SFC 編譯／Angular AOT），且產物確實包含應用程式本身。
4. Tree-shaking：只引用 button、input、field、card、toast，打包結果不得包含其他元件。

### Angular SSR

`angular-ssr/` 在元件檔中載入全量入口（伺服器的 bundle 也會載入元件庫），不檢查 Tree-shaking 與型別宣告（由另外三個專案負責）。
建置後由 `scripts/smoke-ssr.mjs` 啟動 SSR 伺服器並檢查：

1. 伺服器輸出的 HTML 由伺服器端渲染（`ng-server-context="ssr"`、hydration 註記），帶有元件標籤與靜態 attribute，伺服器沒有輸出錯誤。
2. 以 Chromium 載入：元件完成升級，且是伺服器輸出的同一個 DOM 節點（hydration 沿用 DOM，而非重新渲染）。
3. property 綁定（`[options]`、`[headingLevel]`）、`ngModel`、`(click)` 與 `ngOnInit` 中的 `ToastService` 正常，console 沒有錯誤。

需要瀏覽器：Playwright 由專案自己的 `devDependencies` 提供，版本必須與根目錄的 `playwright` 相同（`pnpm check:versions` 檢查），
本機使用根目錄已安裝的 Chromium，CI 在 Playwright 映像中執行（`Framework Smoke Test (angular-ssr)` job）。

## 維護

- 相依版本由各專案的 `package-lock.json` 鎖定（`npm ci --ignore-scripts`；Dependabot 不會更新這些 lockfile）。更新相依時，在該專案目錄執行
  `npm install --package-lock-only` 後提交 lockfile。
- 新增要驗證的元件入口時，同步更新 `src/` 的引用與 `scripts/smoke-test.mjs` 的 `IMPORTED_ENTRIES`。
- 範本中的「Installed from the tarball」是檢查應用程式有被編譯進產物的標記，請勿移除。
