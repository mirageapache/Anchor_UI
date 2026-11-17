# Anchor UI — 版本與發布流程 (Release Guide)

> 對應任務：Phase 2 TASK-205「版本與發布產物規範」、Phase 4 TASK-405「CD 自動化發布管線」。
> TASK-405 原規劃使用 Changesets，實作時改用 [release-please](https://github.com/googleapis/release-please)：專案已以 commitlint 強制 Conventional Commits，版號與 CHANGELOG 可直接由 commit 訊息產生，不需在每個 PR 另寫變更說明檔。
> 觀念說明見 [`note/06-semver-release.md`](../note/06-semver-release.md)。

---

## 一、版號規範

- 遵循 [SemVer 2.0.0](https://semver.org/lang/zh-TW/)，`package.json` 的 `version` 為唯一來源（`VERSION` 常數於建置時自動注入）。
- `package.json` 的版號代表「**最近一次發布的版本**」，只由 release PR 更新（同時更新 `.release-please-manifest.json`），請勿手動修改。
- 每個 Phase 先發布預覽版（`-beta`）供導入專案試用，測試通過後再發布正式版：

| 里程碑  | 版號           | 狀態                                                                 |
| ------- | -------------- | -------------------------------------------------------------------- |
| Phase 0 | `v0.0.1`       | —                                                                    |
| Phase 1 | `v0.1.0-alpha` | ✅ 已發布（PR #2 補記，tag 指向合併 commit `d4ea1dd`）               |
| Phase 2 | `v0.2.0-beta`  | ✅ 已發布（PR #8，tag 指向合併 commit `4e71eb9`）                    |
| Phase 3 | `v0.3.0-beta`  | ✅ 已發布（PR #11，tag 指向合併 commit `c8af105`；最後一次手動發布） |
| Phase 3 | `v0.3.0`       | — beta 測試通過後發布正式版（見第二節第 3 點）                       |
| Phase 4 | `v1.0.0`       | —                                                                    |

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

| 情況                                         | 預覽模式（目前設定）                                                   | 正式模式              |
| -------------------------------------------- | ---------------------------------------------------------------------- | --------------------- |
| 上一版是預覽版（例如 `0.3.0-beta`）          | 預覽編號加一：`0.3.0-beta.1`、`0.3.0-beta.2`…                          | 去掉預覽標籤：`0.3.0` |
| 上一版是正式版，有 `feat`                    | 下一個 minor 的預覽版：`0.3.0` → `0.4.0-beta`                          | `0.3.0` → `0.4.0`     |
| 上一版是正式版，只有 `fix`、`perf` 等        | 下一個 patch 的預覽版：`0.3.0` → `0.3.1-beta`                          | `0.3.0` → `0.3.1`     |
| 破壞性變更（`feat!:` 或 `BREAKING CHANGE:`） | `1.0.0` 之前與 `feat` 相同（`bump-minor-pre-major`），不會跳到 `1.0.0` | 同左                  |

- 任何符合 Conventional Commits 的 commit 都會讓 release PR 出現或更新；CHANGELOG 只列出 `feat`（新功能）、`fix`（錯誤修正）、`perf`（效能改進）與 `revert`（還原），`docs`、`chore`、`ci` 等不列入。
- `Merge pull request …` 這類合併 commit 不符合格式，會被略過；`develop` 上的各個 commit 仍會被逐一讀取。
- **commit 訊息就是 CHANGELOG 的內容**，請寫成使用者看得懂的描述。
- 想指定版號時，在 commit 訊息最後加上 footer `Release-As: <版號>`（例如 `Release-As: 1.0.0-beta`）。

### 2. 發布：合併 release PR

1. 檢查 release PR 的版號與 CHANGELOG。release PR 會一直開著，之後合併進 `main` 的變更會持續累積進去，每次都以最新的 `main` 重建並重新執行 CI。
2. CI 通過後合併。之後全部自動完成：
   - 在合併 commit 打 tag `v<版號>`，建立草稿 Release。
   - `release.yml` 確認 tag 在 `main` 上、等待該 commit 的必要 CI 檢查（清單取自 `main` 的 Ruleset，最多 20 分鐘）、執行 `pnpm release:pack`（建置 → `verify:package` → `size` → 版號與 tag 一致性 → `scripts/pack.mjs` 打包），附上 tarball 後公開 Release；版號含 `-` 時標記為 Pre-release。
   - 把 `main` 合併回 `develop`（`chore(release): 將 v<版號> 合併回 develop`）。之後本機請先 `git pull` 再繼續開發。
3. 查看結果：`gh run list --workflow release-please.yml --limit 3`、`gh release view v<版號>`。

> release PR 的內容由 release-please 產生，每次 `main` 更新都會被覆蓋，請勿手動修改；要調整 CHANGELOG 的文字，請修正 commit 訊息的寫法或在下一版補充。

### 3. 預覽版 → 正式版

`release-please-config.json` 的 `"prerelease"` 決定模式：

- **`true`（預覽模式，目前設定）**：發布 `-beta` 預覽版，Release 標記為 Pre-release。
- **`false`（正式模式）**：發布正式版。

beta 測試通過、要發布正式版時：

1. 開一個 PR（經 `develop` 合併進 `main`）把 `"prerelease"` 改為 `false`，commit 訊息例如 `chore(release): 結束 0.3.0 的 beta 測試`。
2. release PR 會改為正式版號（例如 `0.3.0-beta.2` → `0.3.0`），合併即發布正式版。
3. 開始下一輪開發時，再把 `"prerelease"` 改回 `true`，下一個 `feat` 就會發布 `0.4.0-beta`。

正式版的程式碼應與測試過的預覽版相同：從預覽版到正式版之間，`main` 只合併 bug 修正，新功能先留在 `develop`。

### 4. 發布失敗時

| 狀況                                       | 處理方式                                                                                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Publish release` job 失敗                 | Release 仍是草稿，消費端看不到。修正原因後重跑該 workflow 的失敗 job，或在 Actions → Release → Run workflow 輸入 tag 手動執行；Release 已存在時只會覆蓋上傳 tarball 並公開。 |
| `Merge main back into develop` job 失敗    | 有衝突或 `develop` 在這期間被更新。手動執行 `git switch develop && git pull && git merge origin/main && git push`。                                                          |
| release PR 沒有執行 CI                     | 在 Actions → CI → Run workflow 選擇 release PR 的分支（名稱以 `release-please--branches--main` 開頭），或重跑最近一次的 Release Please workflow。                            |
| release PR 顯示落後 `main`                 | 按 PR 的「Update branch」，或重跑 Release Please workflow 重建。                                                                                                             |
| release-please 沒有開 PR，log 顯示權限錯誤 | 尚未完成第三節的一次性設定。                                                                                                                                                 |

---

## 三、一次性設定

- **允許 Actions 建立 PR**：Settings → Actions → General → Workflow permissions，勾選「Allow GitHub Actions to create and approve pull requests」。等同：

  ```bash
  gh api -X PUT repos/mirageapache/Anchor_UI/actions/permissions/workflow \
    -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
  ```

- **Ruleset 不需修改**：release PR 的必要檢查由 `workflow_dispatch` 執行的 CI 提供（以 `GITHUB_TOKEN` 更新的 PR 不會觸發 `pull_request` 事件，但 `workflow_dispatch` 是例外），檢查掛在 release PR 分支最新的 commit 上。
- **不需要額外的 secret**：全程使用 `GITHUB_TOKEN`。以 `GITHUB_TOKEN` 建立的 tag 不會觸發其他 workflow，因此 `release.yml` 改由 `release-please.yml` 直接呼叫（`workflow_call`），不再以推送 tag 觸發。

---

## 四、交付方式（Phase 4 導入 npm registry 之前）

| 情境                 | 方式                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 本機開發同步         | yalc：`pnpm yalc:publish`、`pnpm yalc:push`、`pnpm dev:yalc`（見 README）                                                        |
| 測試專案安裝特定版本 | 從 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases) 下載 tarball，`npm install ./anchor-ui-core-<版號>.tgz` |

tarball 由 `scripts/pack.mjs` 產出：檔案內容與 `npm pack` 相同，但發布的 `package.json` 已移除 `prepare` 等安裝時會執行的腳本。它就是實際交付的產物，因此也用來驗證發布產物本身（`exports`、`sideEffects`、`files`，見 `pnpm smoke`）。

> 之後導入 registry 發布時，必須發布這個 tarball（`npm publish release/<檔名>.tgz`），不可直接在 repo 根目錄執行 `npm publish`：後者會發布未清理的 `package.json`。

---

## 五、合併 release PR 前的檢查清單

- [ ] 版號符合預期（預覽模式或正式模式見第二節第 3 點）。
- [ ] CHANGELOG 列出的變更完整、描述可讀。
- [ ] release PR 的 CI（7 項必要檢查）全部通過。
- [ ] 要發布正式版時，`main` 上的程式碼與測試過的預覽版相同（只多了 bug 修正）。
- [ ] （建議）本機 `pnpm release:pack` 與 `pnpm smoke` 預演通過。

---

## 六、注意事項

- **Windows 路徑長度限制**：在很深的目錄（例如暫存資料夾下的 git worktree）執行 `pnpm install` 與建置時，`node_modules/.pnpm/…` 的路徑可能超過 260 字元，Vite 會因無法解析 `#module-sync-enabled` 而建置失敗。請在路徑較短的目錄中建置。
- **建置失敗時 `npm pack` 仍會產出 tarball**：手動打包時務必確認建置成功；`pnpm release:pack` 以 `&&` 串接，任一步驟失敗就不會打包。
- **不要再手動建立 tag 或 Release**：手動建立的版本不會更新 `.release-please-manifest.json` 與 `package.json`，release-please 的版號計算會因此錯亂。
