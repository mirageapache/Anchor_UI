# Anchor UI — 版本與發布流程 (Release Guide)

> 對應任務：Phase 2 TASK-205「版本與發布產物規範」、Phase 4 TASK-405「CD 自動化發布管線」。
> TASK-405 原規劃使用 Changesets，實作時改用 [release-please](https://github.com/googleapis/release-please)：專案已以 commitlint 強制 Conventional Commits，版號與 CHANGELOG 可直接由 commit 訊息產生，不需在每個 PR 另寫變更說明檔。
> 觀念說明見 [`note/06-semver-release.md`](../note/06-semver-release.md)。

---

## 一、版號規範

- 遵循 [SemVer 2.0.0](https://semver.org/lang/zh-TW/)，`package.json` 的 `version` 為唯一來源（`VERSION` 常數於建置時自動注入）。
- `package.json` 的版號代表「**最近一次發布的版本**」，只由 release PR 更新（同時更新 `.release-please-manifest.json`），請勿手動修改。
- 每個 Phase 先發布預覽版（`-beta`）供導入專案試用，測試通過後再發布正式版：

| 里程碑  | 版號           | 狀態                                                                                 |
| ------- | -------------- | ------------------------------------------------------------------------------------ |
| Phase 0 | `v0.0.1`       | —                                                                                    |
| Phase 1 | `v0.1.0-alpha` | ✅ 已發布（PR #2 補記，tag 指向合併 commit `d4ea1dd`）                               |
| Phase 2 | `v0.2.0-beta`  | ✅ 已發布（PR #8，tag 指向合併 commit `4e71eb9`）                                    |
| Phase 3 | `v0.3.0-beta`  | ✅ 已發布（PR #11，tag 指向合併 commit `c8af105`；最後一次手動發布）                 |
| Phase 3 | `v0.3.0`       | ✅ 已發布（PR #17，第一次由 release-please 自動發布，tag 指向合併 commit `84ed768`） |
| Phase 4 | `v1.0.0`       | — 以 `Release-As: 1.0.0` 發布（見第二節第 3 點）                                     |

- Git Tag 名稱為 `v` + 版號（例如 `v0.3.0-beta`）。`v0.3.0-beta` 以前是手動建立的 annotated tag，之後由 release-please 自動建立（lightweight tag）。
- **tag 只能建立在 `main` 上**，且該 commit 的 `package.json` 版號必須與 tag 一致（Release workflow 與 CI 的 `release:verify --all-tags` 都會檢查）。

---

## 二、自動發布流程

```text
develop ──PR──▶ main（CI 通過後合併）
                  │
                  ▼  Release Please workflow（.github/workflows/release-please.yml）
                     開啟或更新唯一的 release PR「chore(release): v<下一版>」：
                     更新 package.json、.release-please-manifest.json、CHANGELOG.md，並在該分支執行 CI
                  │
        決定發布時，合併 release PR
                  │
                  ▼  1. release-please 在合併 commit 打 tag、建立草稿 Release（說明取自 CHANGELOG）
                     2. release.yml：確認 tag 在 main 上 → 等待必要 CI → pnpm release:pack → 附上 tarball → 公開 Release
                     3. 把 main 合併回 develop
```

### 1. 平常開發：commit 訊息決定版號

照常在 `develop` 開發，透過 PR 合併進 `main`。合併後 release-please 會依自上次發布以來的 commit 計算下一個版號，並開啟或更新 release PR。

`release-please-config.json` 的 `"prerelease"` 固定為 `true`（請勿修改），自動計算的版號**一律是預覽版**：

| 情況                                         | 下一版                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| 上一版是預覽版（例如 `0.4.0-beta`）          | 預覽編號加一：`0.4.0-beta.1`、`0.4.0-beta.2`…                          |
| 上一版是正式版，有 `feat`                    | 下一個 minor 的預覽版：`0.3.0` → `0.4.0-beta`                          |
| 上一版是正式版，只有 `fix`、`perf` 等        | 下一個 patch 的預覽版：`0.3.0` → `0.3.1-beta`                          |
| 破壞性變更（`feat!:` 或 `BREAKING CHANGE:`） | `1.0.0` 之前與 `feat` 相同（`bump-minor-pre-major`），不會跳到 `1.0.0` |

正式版只透過 `Release-As` 發布（第 3 點）。忘記加時只會多發一個預覽版，不會誤發正式版。

- CHANGELOG 只列出 `feat`（新功能）、`fix`（錯誤修正）、`perf`（效能改進）、`revert`（還原）與 `chore(release)`（發布），其他的 `chore`、`docs`、`ci` 等不列入。
- **只有會列入 CHANGELOG 的 commit 才會讓 release PR 出現**：自上次發布以來若只有 `docs`、`ci`、`chore` 等，release-please 會略過（log 顯示 `No user facing commits found … skipping`），不開 PR；已開啟的 release PR 仍會以最新的 `main` 重建。
- `chore(release)` 保留給發布相關的 commit（例如第 3 點的發布正式版），不要用在其他地方：它會列入 CHANGELOG，並觸發新的預覽版。
- `Merge pull request …` 這類合併 commit 不符合格式，會被略過；`develop` 上的各個 commit 仍會被逐一讀取。但 release-please 也會讀合併 commit 的**內文**：GitHub 把 PR 標題寫進內文（repo 的合併 commit 設定為「Default message」），標題符合格式時（例如 `feat: …`、`chore(release): …`）會被重複列入 CHANGELOG。因此：
  - **develop → main 的 PR 標題不要用 Conventional Commits 格式**，例如 `合併 develop：Phase 4 Drawer`。
  - 以「Create a merge commit」合併，不要用 Squash：squash 會把 `develop` 的各個 commit 壓成一個，CHANGELOG 只剩 PR 標題。
  - 「標題 `Merge pull request #…` + 內文留空」可以根本避免重複，但 GitHub 不接受這個組合（只接受網頁上的三個選項），其他兩個選項會把 PR 標題放進合併 commit 的標題，同樣會被讀到。
  - 忘記時只會在 CHANGELOG 多一筆重複項目，不影響版號；在 release PR 上就看得到。
- **commit 訊息就是 CHANGELOG 的內容**，請寫成使用者看得懂的描述。
- 想指定版號時，在 commit 訊息最後加上 footer `Release-As: <版號>`，見第 3 點。

### 2. 發布：合併 release PR

1. 檢查 release PR 的版號與 CHANGELOG（PR 的「Files changed」：`package.json`、`.release-please-manifest.json`、`CHANGELOG.md`，皆由 release-please 修改，不需手動改版號）。release PR 會一直開著，之後合併進 `main` 的變更會持續累積進去，每次都以最新的 `main` 重建。
2. release PR 由 `github-actions[bot]` 開啟，repo 對首次貢獻者的 PR 要求核准才執行 workflow，CI 可能停在等待核准：在 PR 頁面按「Approve workflows to run」。7 項必要檢查通過前無法合併（按下會顯示 `Merging was blocked due to rule violation errors`）。
3. CI 通過後合併。之後全部自動完成：
   - 在合併 commit 打 tag `v<版號>`，建立草稿 Release。
   - `release.yml` 確認 tag 在 `main` 上、等待該 commit 的必要 CI 檢查（清單取自 `main` 的 Ruleset，最多 20 分鐘）、執行 `pnpm release:pack`（建置 → `verify:package` → `size` → 版號與 tag 一致性 → `scripts/pack.mjs` 打包），附上 tarball 後公開 Release；版號含 `-` 時標記為 Pre-release。
   - 把 `main` 合併回 `develop`（`Merge v<版號> from main into develop`；刻意不用 Conventional Commits 格式，避免列入下一版的 CHANGELOG）。之後本機請先 `git pull` 再繼續開發。
4. 查看結果：`gh run list --workflow release-please.yml --limit 3`、`gh release view v<版號>`，或 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases)。`Publish release` 要等合併 commit 的 CI 跑完，公開前 Release 會顯示為草稿。

> release PR 的內容由 release-please 產生，每次 `main` 更新都會被覆蓋，請勿手動修改；要調整 CHANGELOG 的文字，請修正 commit 訊息的寫法或在下一版補充。

### 3. 預覽版 → 正式版（`Release-As`）

beta 測試通過、要發布正式版時，不需修改任何設定，只要一個帶 `Release-As` footer 的 commit：

1. 在 `develop` 上建立 commit（不需改檔案，可用空 commit）：

   ```bash
   git commit --allow-empty -m "chore(release): 發布 0.4.0 正式版" -m "Release-As: 0.4.0"
   ```

   - footer 的版號就是要發布的版號；`Release-As` 優先於自動計算，不受 `"prerelease"` 影響。
   - **type 與 scope 必須是 `chore(release)`**：從預覽版到正式版之間通常沒有新的功能或修正，只有這個 commit 會列入 CHANGELOG，否則 release-please 會因沒有可見的變更而不開 PR（`Release-As` 也一樣會被略過）。

2. 推送後經 `develop` → `main` 的 PR 合併。release PR 會改為指定的版號（例如 `0.4.0-beta.2` → `0.4.0`），確認後合併即發布正式版。
3. 不需要改回任何設定：`Release-As` 只對上次發布以來的 commit 有效，發布後下一個 `feat` 自動回到預覽版（`0.5.0-beta`）。

- 版號打錯時，在 release PR 合併前再補一個 `Release-As` commit 即可；有多個時以最新的為準。
- Phase 4 結束時的 `1.0.0` 也用同樣方式：先 `Release-As: 1.0.0-beta` 發布預覽版，測試後再 `Release-As: 1.0.0`。之後的預覽版依第 1 點自動計算（`1.0.0` 之後 `feat` 才會正常升 minor）。

正式版的程式碼應與測試過的預覽版相同：從預覽版到正式版之間，`main` 只合併 bug 修正，新功能先留在 `develop`。

### 4. 發布失敗時

| 狀況                                                              | 處理方式                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Publish release` job 失敗                                        | Release 仍是草稿，消費端看不到。修正原因後重跑該 workflow 的失敗 job，或在 Actions → Release → Run workflow 輸入 tag 手動執行；Release 仍是草稿時會覆蓋上傳 tarball 並公開。已公開的 Release 不會被覆蓋（重新建置的檔案與原本不同，以雜湊鎖定的使用端會安裝失敗）；確實需要時勾選 `overwrite-published`。 |
| `Merge main back into develop` job 失敗                           | 有衝突或 `develop` 在這期間被更新。手動執行 `git switch develop && git pull && git merge origin/main && git push`。                                                                                                                                                                                       |
| release PR 的 CI 停在等待核准（`action_required`）                | 在 PR 頁面按「Approve workflows to run」。                                                                                                                                                                                                                                                                |
| release PR 的必要檢查一直是「Expected」（沒有任何 CI）            | 關閉後重新開啟 release PR（Close → Reopen），由你觸發的 `pull_request` 事件會執行 CI。不要用 Actions → CI → Run workflow：手動執行的檢查不算進 PR 的必要檢查。                                                                                                                                            |
| release PR 是預覽版號，但想發正式版                               | 補一個 `Release-As` commit（第二節第 3 點）。                                                                                                                                                                                                                                                             |
| release PR 顯示落後 `main`                                        | 按 PR 的「Update branch」，或重跑 Release Please workflow 重建。                                                                                                                                                                                                                                          |
| release-please 沒有開 PR，log 顯示權限錯誤                        | 尚未完成第三節的一次性設定。                                                                                                                                                                                                                                                                              |
| release-please 沒有開 PR，log 顯示 `No user facing commits found` | 正常：自上次發布以來沒有會列入 CHANGELOG 的 commit（見第二節第 1 點）。                                                                                                                                                                                                                                   |

---

## 三、一次性設定

- **允許 Actions 建立 PR**：Settings → Actions → General → Workflow permissions，勾選「Allow GitHub Actions to create and approve pull requests」。等同：

  ```bash
  gh api -X PUT repos/mirageapache/Anchor_UI/actions/permissions/workflow \
    -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
  ```

- **合併 commit 的預設訊息維持「Default message」**（Settings → General → Pull Requests → Allow merge commits）：另外兩個選項會把 PR 標題放進合併 commit 的標題；理想的「內文留空」組合 GitHub 不接受（API 回傳 `invalid_merge_commit_setting_combo`）。改以 PR 標題的寫法避免重複，見第二節第 1 點。
- **Ruleset 不需修改**：release PR 的必要檢查由它自己的 `pull_request` CI 提供（可能需要先核准，見第二節第 2 點）。以 `workflow_dispatch` 執行的 CI 雖然掛在同一個 commit 上，GitHub 不會算進 PR 的必要檢查。
- **不需要額外的 secret**：全程使用 `GITHUB_TOKEN`。以 `GITHUB_TOKEN` 建立的 tag 不會觸發其他 workflow，因此 `release.yml` 改由 `release-please.yml` 直接呼叫（`workflow_call`），不再以推送 tag 觸發。

---

## 四、交付方式（Phase 4 導入 npm registry 之前）

| 情境                 | 方式                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 本機開發同步         | yalc：`pnpm yalc:publish`、`pnpm yalc:push`、`pnpm dev:yalc`（見 [開發指南](development.md)）                                    |
| 測試專案安裝特定版本 | 從 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 下載 tarball，`npm install ./anchor-ui-core-<版號>.tgz` |

tarball 由 `scripts/pack.mjs` 產出：檔案內容與 `npm pack` 相同，但發布的 `package.json` 已移除 `prepare` 等安裝時會執行的腳本。它就是實際交付的產物，因此也用來驗證發布產物本身（`exports`、`sideEffects`、`files`，見 `pnpm smoke`）。

> 之後導入 registry 發布時，必須發布這個 tarball（`npm publish release/<檔名>.tgz`），不可直接在 repo 根目錄執行 `npm publish`：後者會發布未清理的 `package.json`。

---

## 五、合併 release PR 前的檢查清單

- [ ] 版號符合預期（正式版需要 `Release-As`，見第二節第 3 點）。
- [ ] CHANGELOG 列出的變更完整、描述可讀。
- [ ] release PR 的 CI（7 項必要檢查）全部通過。
- [ ] 要發布正式版時，`main` 上的程式碼與測試過的預覽版相同（只多了 bug 修正）。
- [ ] （建議）本機 `pnpm release:pack` 與 `pnpm smoke` 預演通過。

---

## 六、注意事項

- **Windows 路徑長度限制**：在很深的目錄（例如暫存資料夾下的 git worktree）執行 `pnpm install` 與建置時，`node_modules/.pnpm/…` 的路徑可能超過 260 字元，Vite 會因無法解析 `#module-sync-enabled` 而建置失敗。請在路徑較短的目錄中建置。
- **建置失敗時 `npm pack` 仍會產出 tarball**：手動打包時務必確認建置成功；`pnpm release:pack` 以 `&&` 串接，任一步驟失敗就不會打包。
- **不要再手動建立 tag 或 Release**：手動建立的版本不會更新 `.release-please-manifest.json` 與 `package.json`，release-please 的版號計算會因此錯亂。
