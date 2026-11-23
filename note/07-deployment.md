# 部署與發布操作筆記

> 對應任務：Phase 2 TASK-205（發布）；Phase 3 TASK-308（Storybook 預覽部署）；Phase 4 TASK-405（自動發布流程 release-please；npm registry 發布尚未建置）
> 正式流程規範見 [`doc/anchor-ui-release-guide.md`](../doc/anchor-ui-release-guide.md)，版號觀念見 [06-semver-release.md](./06-semver-release.md)。本篇是「忘記怎麼做時照著做」的操作速查。

## 1. 這個專案的「部署」是什麼

Anchor UI 是元件庫，不是網站，所以沒有「部署到伺服器」這件事。目前的部署指的是**發布一個版本**：

| 項目                         | 現況                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| 版本發布                     | ✅ 合併 release-please 開的 release PR → 自動打 tag、建立 GitHub Release 並附上 tarball        |
| 交付給其他專案               | ✅ 以 Release 的 tarball 網址安裝（見第 3 節），或本機用 yalc                                  |
| Storybook 線上文件與 PR 預覽 | ✅ 已啟用（Phase 3 TASK-308，見第 6 節）：PR 預覽自動部署並留言連結，`main` 更新時發布線上文件 |
| 發布到 npm registry          | ❌ 尚未建置                                                                                    |

Phase 1 做過的那次部署，就是發布 `v0.1.0-alpha`（PR #2 + tag），產物在 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases)。

## 2. 發布一個版本

自 `v0.3.0-beta` 之後由 release-please 自動處理，不再手動改版號、打 tag（手動建立的版本會讓 release-please 的版號計算錯亂）。完整說明見 [`doc/anchor-ui-release-guide.md`](../doc/anchor-ui-release-guide.md) 第二節。

1. 變更照常經 `develop` → PR 合併進 `main`。
2. Release Please workflow 會開啟或更新唯一的 release PR「`chore(release): v<下一版>`」（版號一律是預覽版）。只有 `docs`、`ci`、`chore` 等不列入 CHANGELOG 的變更時不會開 PR。
3. 要發布時，檢查 release PR 的版號與 CHANGELOG（版號由 release-please 改，不要手動改）。CI 若停在等待核准，在 PR 頁面按「Approve workflows to run」；7 項檢查通過後合併。
4. 之後自動完成：打 tag → 草稿 Release → 等 CI、`pnpm release:pack` → 附上 tarball 並公開 → `main` 合併回 `develop`。本機記得 `git pull`。
5. 查看結果：

   ```bash
   gh run list --workflow release-please.yml --limit 3
   gh release view v<版號>
   ```

6. 預覽版測試通過、要發正式版時：在 `develop` 上 `git commit --allow-empty -m "chore(release): 發布 0.4.0 正式版" -m "Release-As: 0.4.0"`，經 PR 合併進 `main`，release PR 就會改成正式版號。type 與 scope 必須是 `chore(release)`（才會列入 CHANGELOG 並開出 release PR）；`"prerelease"` 固定為 `true`，不需修改也不需改回。
7. 發布後更新 `doc/anchor-ui-release-guide.md` 的里程碑表格。

（建議）合併 release PR 前在本機預演：`pnpm release:pack` 與 `pnpm smoke`。

## 3. 在其他專案導入元件庫

> 完整說明與各框架的程式碼範例見 [README「在其他專案中導入」](../README.md#在其他專案中導入-installation)。本節是操作清單與踩過的坑。
> 以下流程已於 2026-11-15 用 `v0.2.0-beta` 實測：在全新的 Vite + TypeScript 專案以網址安裝、建置成功，只引用 Button 時打包結果不含 Modal、Toast、Tooltip 與 floating-ui。

### 導入清單

1. **確認前置條件**：專案有打包工具（Vite、Angular CLI、webpack），TypeScript 的 `moduleResolution` 為 `bundler` / `node16` / `nodenext`。
2. **安裝**（以 Release 附檔網址，repo 公開不需登入）：
   ```bash
   npm install https://github.com/mirageapache/Anchor_UI/releases/download/v0.2.0-beta/anchor-ui-core-0.2.0-beta.tgz
   ```
   網址格式固定為 `.../releases/download/v<版號>/anchor-ui-core-<版號>.tgz`。
3. **載入樣式**（二擇一）：新專案用 `@anchor-ui/core/styles.css`（tokens + 全域 reset）；已有自己 reset 的專案只用 `@anchor-ui/core/tokens.css`。
4. **載入字型**：Inter 與 JetBrains Mono 需自行引入（README「載入字型」）。
5. **註冊元件**：按需 `import '@anchor-ui/core/button';`，或全量 `import '@anchor-ui/core';`。
6. **框架設定**：
   - Vue 3：`vite.config.ts` 設定 `compilerOptions.isCustomElement: (tag) => tag.startsWith('aui-')`。
   - Angular：元件加 `schemas: [CUSTOM_ELEMENTS_SCHEMA]`；樣式加進 `angular.json` 的 `styles`（`node_modules/@anchor-ui/core/dist/styles.css`）；表單雙向綁定需加 `ngDefaultControl`。
7. **確認**：畫面上 `<aui-button>` 有樣式、切換 `<html data-theme="dark">` 會變深色。

### 導入時的注意事項

| 狀況                                                    | 原因與處理                                                                                                                                                                                                                 |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 安裝時提示 `@anchor-ui/core` 有 `prepare: husky` 待核准 | 只發生在 `v0.2.0-beta`（含）以前的 tarball：發布的 `package.json` 帶著本元件庫開發用的 `prepare` 腳本。**不要核准**，略過即可，安裝本身已成功。之後的版本由 `scripts/pack.mjs` 打包，已不含此腳本（`pnpm smoke` 會檢查）。 |
| TypeScript 對 CSS import 報 `TS2882`                    | 缺少 Vite 的 CSS 型別宣告，加上 `/// <reference types="vite/client" />`（Vite 範本的 `src/vite-env.d.ts` 預設已有）。                                                                                                      |
| 同時載入 `tokens.css` 與 `styles.css`                   | `styles.css` 已包含 tokens，重複載入無害但多餘，只留一個。                                                                                                                                                                 |
| 只想按需載入，卻需要切換主題                            | `setTheme` 等函式只在全量入口，引用會註冊所有元件。改為直接設定 `document.documentElement.dataset.theme = 'dark'`。                                                                                                        |
| 放進 `<aui-field>` 的 `<aui-input>` 沒有作用            | Field 只自動註冊自己渲染的 `<aui-icon-button>`，放進去的 Input / Output / Segmented 要另外 import。                                                                                                                        |
| Vue 出現「Failed to resolve component: aui-xxx」        | 沒有設定 `isCustomElement`。                                                                                                                                                                                               |
| Angular 範本報「'aui-xxx' is not a known element」      | 該元件沒有加 `CUSTOM_ELEMENTS_SCHEMA`。                                                                                                                                                                                    |
| `npm update` 沒有升級元件庫                             | 以網址安裝的相依版本由網址決定，升級要用新版網址重新 `npm install`。                                                                                                                                                       |

### 本機開發時即時同步（yalc）

```bash
# 在 Anchor UI
pnpm yalc:publish

# 在消費端專案
npx yalc add @anchor-ui/core && pnpm install

# 回到 Anchor UI，邊改邊同步
pnpm dev:yalc
```

結束後在消費端執行 `npx yalc remove @anchor-ui/core`，避免把 `file:.yalc` 提交進版控。

## 4. 常見陷阱

| 狀況                                         | 原因與處理                                                                                                                                                                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 手動建立了 tag 或 Release                    | 不要這樣做：release-please 不知道這個版本，版號計算與 CI 的 `release:verify --all-tags` 都會出錯。刪除該 Release 與 tag（`gh release delete <tag> --cleanup-tag --yes`、`git tag -d <tag>`），改走 release PR。            |
| release-please 沒有開 release PR             | Settings → Actions → General 未勾選「Allow GitHub Actions to create and approve pull requests」（log 會顯示權限錯誤）；或自上次發布以來沒有會列入 CHANGELOG 的 commit（log 顯示 `No user facing commits found`，正常）。   |
| release PR 無法合併（`Merging was blocked`） | 必要檢查還沒通過。CI 停在等待核准時按「Approve workflows to run」；完全沒有 CI 時 Close → Reopen 該 PR。手動 Run workflow 的檢查不算進 PR。                                                                                |
| CHANGELOG 同一筆出現兩次                     | develop → main 的 PR 標題用了 Conventional Commits 格式，被寫進合併 commit 的內文而再讀一次。這類 PR 標題改用一般描述（例如 `合併 develop：Phase 4 Drawer`），並以「Create a merge commit」合併（發布指南第二節第 1 點）。 |
| `Publish release` job 失敗                   | Release 仍是草稿，消費端看不到。修正後重跑失敗的 job，或 Actions → Release → Run workflow 輸入 tag；Release 已存在時只會覆蓋上傳 tarball 並公開。                                                                          |
| `Merge main back into develop` job 失敗      | 有衝突或 `develop` 剛好被更新。手動 `git switch develop && git pull && git merge origin/main && git push`。                                                                                                                |
| Windows 建置時找不到 `#module-sync-enabled`  | 目錄太深超過 260 字元路徑限制，換到路徑較短的目錄建置。                                                                                                                                                                    |
| 手動 `npm pack` 產出壞掉的 tarball           | 建置失敗時 `npm pack` 仍會打包。一律用 `pnpm release:pack`，任一步驟失敗就不會打包。                                                                                                                                       |
| 發布後切回 `develop` 時 `package.json` 擋住  | commit 時 lint-staged 的 prettier 改寫了換行符號，內容沒變；`git diff` 確認無實質差異後 `git restore package.json`。                                                                                                       |

## 5. 之後會改變的部分

- **發布到 npm registry / GitHub Packages**：在 `release.yml` 公開 Release 後加上 `npm publish release/<檔名>.tgz`（必須發布 `scripts/pack.mjs` 產出的 tarball）。

## 6. Storybook 線上文件與 PR 預覽（GitHub Pages）

由 `.github/workflows/storybook-preview.yml` 自動處理，平常不需要手動操作：

| 事件                             | 結果                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| 以 `main` 為目標的 PR 開啟／推送 | 建置 Storybook，部署到 `pr-preview/pr-<編號>/`，並在 PR 留言預覽連結（重新部署時更新同一則留言） |
| PR 關閉（合併或放棄）            | 移除該 PR 的預覽，留言改為「已移除」                                                             |
| `main` 更新                      | 部署到站台根目錄（線上元件文件），各 PR 的預覽保留                                               |

網址（`<owner>` 為小寫的帳號名稱）：

- 線上文件：`https://<owner>.github.io/Anchor_UI/`
- PR 預覽：`https://<owner>.github.io/Anchor_UI/pr-preview/pr-<編號>/`

### 一次性設定：啟用 GitHub Pages

workflow 會把網站推送到 `gh-pages` 分支，但要在 repo 啟用 Pages 之後網址才會生效：

1. 先讓 workflow 跑過一次（開一個以 `main` 為目標的 PR，或合併到 `main`），產生 `gh-pages` 分支。
2. 到 repo 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `gh-pages`、資料夾選 `/ (root)`，儲存。
   也可以用指令：
   ```bash
   gh api -X POST repos/<owner>/Anchor_UI/pages -f "source[branch]=gh-pages" -f "source[path]=/"
   ```
3. 約一分鐘後開啟上面的網址確認。

> Pages 站台是公開的。repo 為公開時沒有額外影響；若日後改為私有，預覽內容仍可能公開（視方案而定），需重新評估。

### 運作方式與限制

- **權限分離**：建置 job 只有讀取權限；只有部署／清除 job 取得 `contents: write` 與 `pull-requests: write`，
  而且只執行 `scripts/pages-deploy.mjs` 與 `scripts/pr-preview-comment.mjs`，不安裝任何相依。
- **協作者可經由 PR 改寫站台**：deploy job 執行的是 PR 分支上的部署腳本，能在本 repo 開分支的人可以不經審查改寫 `gh-pages`（包含線上文件）。單人維護時可接受；多人協作時請留意。
- **PR 關閉時的清除**由 `pull_request_target` 觸發，執行的是 `main` 上的腳本（不執行 PR 的程式碼），PR 有合併衝突時也會執行。
- **自訂網域**：部署到根目錄時會保留 `CNAME`；另在 repo 的 Variables 設定 `PAGES_BASE_URL`，PR 留言才會使用自訂網域的網址。
- **部署頻率**：以分支為來源的 Pages 每小時約可建置 10 次（軟性限制），短時間內大量推送時較新的內容可能延後出現。
- **來自 fork 的 PR 不會有預覽**：fork 的 PR 取得的權杖是唯讀的，無法推送也無法留言；Storybook 仍會建置，可從 artifact 下載。
- **同時部署**：多個 PR 同時推送 `gh-pages` 時，腳本會重新取得最新內容後重試，不會互相覆蓋。
- **Pages 的延遲**：推送後約一分鐘才會反映，剛部署完看到舊版或 404 屬正常。
- **本機測試**：`pnpm test:scripts` 以本機的暫存 repo 與假的 API 伺服器測試部署與留言腳本。也可以手動演練：
  ```bash
  pnpm build-storybook
  git init --bare /tmp/pages.git
  node scripts/pages-deploy.mjs --source storybook-static --target pr-preview/pr-1 --remote /tmp/pages.git
  ```

### 常見狀況

| 狀況                    | 原因與處理                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 預覽連結是 404          | Pages 尚未啟用（見上方一次性設定），或剛部署完還沒反映（等一分鐘）。                                                                                 |
| PR 沒有出現預覽留言     | PR 來自 fork；或 PR 的目標分支不是 `main`（workflow 只處理以 `main` 為目標的 PR）。                                                                  |
| PR 關閉後預覽還在       | 清除 job 失敗或被取消，或 PR 關閉後有人重新執行了舊的部署。手動執行：`node scripts/pages-deploy.mjs --remove pr-preview/pr-<編號>`（需有推送權限）。 |
| `gh-pages` 分支越來越大 | 每次部署都是一個 commit。必要時可刪除分支後重新部署 `main`（預覽會在各 PR 下次推送時重建）。                                                         |
| 部署 job 顯示推送失敗   | 連續重試後仍被拒絕（極少見）。重新執行該 job 即可。                                                                                                  |
