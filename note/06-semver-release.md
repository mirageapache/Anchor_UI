# 語意化版本 (SemVer) 與發布產物

> 對應任務：Phase 2 TASK-205「版本與發布產物規範」；Phase 4 TASK-405 將以 Changesets 自動化

## 1. SemVer 是什麼

**語意化版本（Semantic Versioning）**用 `主版號.次版號.修訂號`（`MAJOR.MINOR.PATCH`）表達「這次改了什麼程度」：

| 版號      | 何時遞增                             | 例子                   |
| --------- | ------------------------------------ | ---------------------- |
| **MAJOR** | 不相容的 API 變更（breaking change） | 移除屬性、改變事件名稱 |
| **MINOR** | 新增功能，向下相容                   | 新增元件、新增屬性     |
| **PATCH** | 修正錯誤，向下相容                   | 修 bug、調整樣式錯誤   |

使用者看到版號就知道升級風險：PATCH 可以放心升，MAJOR 要看遷移說明。

## 2. `0.x` 與預覽版號

- **`0.x.y`**：尚未穩定，SemVer 規定此階段「任何變更都可能不相容」。Anchor UI 在 v1.0.0 之前都屬於此階段。
- **預覽版（pre-release）**：在版號後加 `-` 與標籤，代表尚未正式發布：

| 版本          | 意義                                            | Anchor UI 里程碑 |
| ------------- | ----------------------------------------------- | ---------------- |
| `0.1.0-alpha` | 預覽版，API 可能大幅變動                        | Phase 1          |
| `0.2.0-beta`  | 功能大致齊全，進入測試                          | Phase 2          |
| `0.3.0`       | —                                               | Phase 3          |
| `1.0.0`       | 正式穩定版；之後的 breaking change 必須升 MAJOR | Phase 4          |

排序規則：`1.0.0-alpha < 1.0.0-beta < 1.0.0`（預覽版排在正式版之前）。

## 3. Git Tag：版本的「書籤」

Git Tag 把版本號固定在某個 commit 上，之後隨時能回答「這個版本的程式碼長什麼樣」：

```bash
git tag -a v0.1.0-alpha <commit> -m "Phase 1：最小可用原子元件"
git push origin v0.1.0-alpha

git log v0.1.0-alpha..v0.2.0-beta --oneline   # 比較兩個版本之間的變更
```

- 建議使用 **annotated tag**（`-a`），會記錄建立者、時間與說明。
- 慣例在版號前加 `v`。
- Anchor UI Phase 1 的完成節點為 PR #1 的合併 commit（`2f0f8b3`）。

## 4. 版號要放在哪裡

`package.json` 的 `version` 是唯一來源。Anchor UI 的 `VERSION` 常數由 Vite 在建置時從 `package.json` 注入（`__PKG_VERSION__`），不需要另外修改。

```bash
npm version 0.2.0-beta --no-git-tag-version   # 只改 package.json
```

## 5. 正式發布前的交付方式

正式發布到 npm registry 的自動化流程（Changesets）在 Phase 4 才建立。在那之前：

### yalc：本機開發同步

把本機的套件「發布」到電腦上的 yalc 倉庫，再安裝到測試專案，模擬真實安裝（比 `npm link` 更接近實際行為）。

```bash
# 元件庫
pnpm yalc:publish        # 建置並發布到本機 yalc 倉庫
# 測試專案
npx yalc add @anchor-ui/core
# 元件庫修改後
pnpm yalc:push           # 推送到所有已 add 的專案
```

### `npm pack`：產出真實的發布檔

```bash
npm pack                 # 產出 anchor-ui-core-0.2.0-beta.tgz
npm pack --dry-run       # 只列出會包含哪些檔案，不產出檔案
```

- 產出的 `.tgz` 與日後 `npm publish` 上傳的內容**完全相同**。
- 測試專案可直接安裝：`npm install ./anchor-ui-core-0.2.0-beta.tgz`。
- 適合用來驗證**發布產物本身**是否正確：`files` 有沒有漏、`exports` 路徑對不對、有沒有把測試檔一起發出去。

## 6. 發布前檢查清單

- [ ] `package.json` 版號已更新，且與 Git Tag 一致。
- [ ] `npm pack --dry-run` 不含測試、stories、`test-utils` 等檔案。
- [ ] 以 tarball 安裝到 Vue 3 / Angular 範例專案，生產建置成功。
- [ ] CHANGELOG（Phase 4 起由 Changesets 自動產生）記錄了這次的變更。

## 7. 在 Anchor UI 的實作（TASK-205）

- **v0.1.0-alpha 的補記方式**：Phase 1 完成時 `package.json` 仍為 `0.0.1`。為了讓「tag 指向的程式碼就是 Phase 1」且「該 commit 的版號與 tag 一致」，
  從 `main` 開 release PR（PR #2）只修改版號，合併後在合併 commit（`d4ea1dd`）建立 tag，再把 `main` 合併回 `develop`。
  - 若直接在 Phase 1 的 commit 打 tag，版號會對不上；若在 `develop` 改版號打 tag，tag 會包含 Phase 2 進行中的內容——兩者都不理想。
- **自動化**：推送 `v*` tag 後由 `.github/workflows/release.yml` 檢查 tag 位於 `main`、執行 `pnpm release:pack`（含 `scripts/verify-release.mjs` 的版號與 tag 一致性檢查），並建立附有 tarball 的 GitHub Release。
- **v0.1.0-alpha 是手動發布的**：該 tag 指向的 commit 還沒有 `release.yml`，因此由人工在乾淨的 worktree 中建置、`npm pack` 並建立 Release。自 v0.2.0-beta 起改由 workflow 自動處理。
- 完整流程見 [`doc/anchor-ui-release-guide.md`](../doc/anchor-ui-release-guide.md)。

### 發布時踩到的坑

- **Windows 路徑長度**：在暫存資料夾深處建立 worktree 建置時，Vite 因路徑超過 260 字元無法解析 `#module-sync-enabled` 而失敗；改到短路徑後成功。
- **建置失敗時 `npm pack` 照樣產出 tarball**：當時差點發布一個沒有完整建置產物的 tarball。手動打包務必確認建置成功；`pnpm release:pack` 以 `&&` 串接可避免這個問題。

## 8. Phase 4 之後：Changesets

[Changesets](https://github.com/changesets/changesets) 把「這次變更屬於 MAJOR / MINOR / PATCH」記錄在 PR 中，合併後自動：

1. 計算新版號並更新 `package.json`。
2. 產生 `CHANGELOG.md`。
3. 建立 Git Tag 並發布到 npm。

前面手動的流程（版號、Tag、檢查清單）就是在為這一步建立習慣。

## 參考資料

- [語意化版本 2.0.0（正體中文）](https://semver.org/lang/zh-TW/)
- npm：[`npm pack`](https://docs.npmjs.com/cli/commands/npm-pack)、[`npm version`](https://docs.npmjs.com/cli/commands/npm-version)
- [yalc（GitHub）](https://github.com/wclr/yalc)
- [Changesets（GitHub）](https://github.com/changesets/changesets)
