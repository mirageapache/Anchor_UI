# Anchor UI — 版本與發布流程 (Release Guide)

> 對應任務：Phase 2 TASK-205「版本與發布產物規範」。Phase 4 TASK-405 導入 Changesets 後，本流程將改為自動化。
> 觀念說明見 [`note/06-semver-release.md`](../note/06-semver-release.md)。

---

## 一、版號規範

- 遵循 [SemVer 2.0.0](https://semver.org/lang/zh-TW/)，`package.json` 的 `version` 為唯一來源（`VERSION` 常數於建置時自動注入）。
- `package.json` 的版號代表「**最近一次發布的版本**」，只在發布時更新。
- 每個 Phase 結束時發布一個里程碑版本：

| 里程碑  | 版號           | 狀態                                                   |
| ------- | -------------- | ------------------------------------------------------ |
| Phase 0 | `v0.0.1`       | —                                                      |
| Phase 1 | `v0.1.0-alpha` | ✅ 已發布（PR #2 補記，tag 指向合併 commit `d4ea1dd`） |
| Phase 2 | `v0.2.0-beta`  | ✅ 已發布（PR #8，tag 指向合併 commit `4e71eb9`）      |
| Phase 3 | `v0.3.0`       | —                                                      |
| Phase 4 | `v1.0.0`       | —                                                      |

- Git Tag 名稱為 `v` + 版號（例如 `v0.2.0-beta`），並使用 annotated tag。
- **tag 只能建立在 `main` 上**，且該 commit 的 `package.json` 版號必須與 tag 一致（Release workflow 會檢查）。

---

## 二、發布步驟

### 1. 從 `main` 開 release PR

```bash
git fetch origin
git switch -c release/v0.2.0-beta origin/main     # main 須已包含此版本的所有變更
npm version 0.2.0-beta --no-git-tag-version       # 只更新 package.json
git commit -am "chore(release): v0.2.0-beta"
git push -u origin release/v0.2.0-beta
gh pr create --base main --title "chore(release): v0.2.0-beta"
```

> release PR 只修改版號，不夾帶其他變更，方便審查與回溯。

### 2. CI 通過後合併，並在合併 commit 建立 tag

```bash
git fetch origin main
git tag -a v0.2.0-beta origin/main -m "v0.2.0-beta — Phase 2：…（說明）"
git push origin v0.2.0-beta
```

### 3. 自動建立 GitHub Release

推送 `v*` tag 後，`.github/workflows/release.yml` 會自動：

1. 確認 tag 指向的 commit 位於 `main` 上。
2. 等待該 commit 在 `main` 上的必要 CI 檢查全部通過（清單取自 `main` 的 Ruleset，與合併所需的檢查相同；最多等 20 分鐘，任一失敗即中止發布）。
3. 執行 `pnpm release:pack`：建置 → `verify:package` → `size` → 版號與 tag 一致性檢查 → 打包（`scripts/pack.mjs`：於暫存目錄以 `npm pack` 產出 tarball，發布的 `package.json` 不含 `prepare` 等安裝時會執行的腳本）。
4. 建立 GitHub Release 並附上 tarball；版號含 `-`（`-alpha`、`-beta`）時標記為預覽版。

> 本機可先執行 `pnpm release:pack` 預演，tarball 會產生在 `release/`（不納入版控）。

### 4. 將 `main` 合併回 `develop`

```bash
git switch develop
git merge origin/main
git push origin develop
```

---

## 三、交付方式（Phase 4 導入 npm registry 之前）

| 情境                 | 方式                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 本機開發同步         | yalc：`pnpm yalc:publish`、`pnpm yalc:push`、`pnpm dev:yalc`（見 README）                                                        |
| 測試專案安裝特定版本 | 從 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 下載 tarball，`npm install ./anchor-ui-core-<版號>.tgz` |

tarball 由 `scripts/pack.mjs` 產出：檔案內容與 `npm pack` 相同，但發布的 `package.json` 已移除 `prepare` 等安裝時會執行的腳本。它就是實際交付的產物，因此也用來驗證發布產物本身（`exports`、`sideEffects`、`files`，見 `pnpm smoke`）。

> Phase 4（TASK-405）導入 registry 發布時，必須發布這個 tarball（`npm publish release/<檔名>.tgz`），不可直接在 repo 根目錄執行 `npm publish`：後者會發布未清理的 `package.json`。

---

## 四、發布前檢查清單

- [ ] 此版本的所有變更皆已合併進 `main`，且 `main` 的 CI 為綠燈。
- [ ] release PR 只修改 `package.json` 的版號。
- [ ] `pnpm release:pack` 於本機通過（建置、套件驗證、體積、版號）。
- [ ] `pnpm smoke` 於本機通過（以 tarball 安裝到 Vue 3 / Angular 專案並建置；PR 的 CI 也會執行）。
- [ ] `main` 的 Ruleset 已將 `Framework Smoke Test (vue3)` 與 `Framework Smoke Test (angular)` 列為必要檢查（Release workflow 只等待 Ruleset 中的必要檢查；未加入時冒煙測試失敗不會阻擋合併與發布）。
- [ ] tag 為 annotated tag，名稱為 `v<版號>`，建立在 release PR 的合併 commit 上。
- [ ] GitHub Release 已建立並附上 tarball，預覽版已標記為 Pre-release。
- [ ] `main` 已合併回 `develop`。

---

## 五、注意事項

- **Windows 路徑長度限制**：在很深的目錄（例如暫存資料夾下的 git worktree）執行 `pnpm install` 與建置時，`node_modules/.pnpm/…` 的路徑可能超過 260 字元，Vite 會因無法解析 `#module-sync-enabled` 而建置失敗。請在路徑較短的目錄中建置。
- **建置失敗時 `npm pack` 仍會產出 tarball**：手動打包時務必確認建置成功；`pnpm release:pack` 以 `&&` 串接，任一步驟失敗就不會打包。
