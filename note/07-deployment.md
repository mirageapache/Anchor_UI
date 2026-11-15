# 部署與發布操作筆記

> 對應任務：Phase 2 TASK-205（發布）；Phase 3 TASK-308（Storybook 預覽部署，尚未建置）；Phase 4 TASK-405（npm registry 自動發布，尚未建置）
> 正式流程規範見 [`doc/anchor-ui-release-guide.md`](../doc/anchor-ui-release-guide.md)，版號觀念見 [06-semver-release.md](./06-semver-release.md)。本篇是「忘記怎麼做時照著做」的操作速查。

## 1. 這個專案的「部署」是什麼

Anchor UI 是元件庫，不是網站，所以沒有「部署到伺服器」這件事。目前的部署指的是**發布一個版本**：

| 項目                | 現況                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| 版本發布            | ✅ 推送 `v*` tag → GitHub Actions 自動建立 GitHub Release 並附上 tarball |
| 交付給其他專案      | ✅ 以 Release 的 tarball 網址安裝（見第 3 節），或本機用 yalc            |
| Storybook 線上預覽  | ❌ 尚未建置（Phase 3 TASK-308），GitHub Pages 也還沒啟用                 |
| 發布到 npm registry | ❌ 尚未建置（Phase 4 TASK-405，Changesets）                              |

Phase 1 做過的那次部署，就是發布 `v0.1.0-alpha`（PR #2 + tag），產物在 [GitHub Releases](https://github.com/mirageapache/Anchor_UI/releases)。

## 2. 發布一個版本（以 `v0.2.0-beta` 為例）

整體流程：`develop` → PR 合併進 `main` → release PR 改版號 → 打 tag → 自動產生 Release → `main` 合併回 `develop`。

### 步驟 0：確認前置條件

- 這個版本的所有變更都已合併進 `main`。
- `main` 最新 commit 的 CI 是綠燈：`gh run list --branch main --limit 3`。
- （建議）本機預演：`pnpm release:pack`。此時版號還沒改，只是確認建置、套件驗證與體積都能通過。

### 步驟 1：從 `main` 開 release PR（只改版號）

```bash
git fetch origin
git switch -c release/v0.2.0-beta origin/main
npm version 0.2.0-beta --no-git-tag-version
git commit -am "chore(release): v0.2.0-beta"
git push -u origin release/v0.2.0-beta
gh pr create --base main --title "chore(release): v0.2.0-beta"
```

等 PR 的 CI 通過後合併。

### 步驟 2：在合併 commit 上打 tag

```bash
git fetch origin main
git tag -a v0.2.0-beta origin/main -m "v0.2.0-beta — Phase 2：高頻互動控制項、核心回饋與視覺回歸"
git push origin v0.2.0-beta
```

必須是 annotated tag（`-a`），名稱是 `v` + `package.json` 的版號。

### 步驟 3：等 Release workflow 跑完

推送 tag 會觸發 `.github/workflows/release.yml`，它會依序：

1. 確認 tag 指向的 commit 在 `main` 上。
2. 等該 commit 的必要 CI 檢查全部通過（最多 20 分鐘，任一失敗就中止）。
3. 執行 `pnpm release:pack`（建置 → `verify:package` → `size` → 版號與 tag 一致性 → `npm pack`）。
4. 建立 GitHub Release 並附上 tarball；版號含 `-` 時標記為 Pre-release。

查看結果：

```bash
gh run list --workflow release.yml --limit 3
gh release view v0.2.0-beta
```

### 步驟 4：把 `main` 合併回 `develop`

```bash
git switch develop
git merge origin/main
git push origin develop
```

### 步驟 5：更新文件

- `doc/anchor-ui-release-guide.md` 的里程碑表格，把該版本改成「已發布」。
- `doc/anchor-ui-development-schedule.md` 勾選「版本與 Git Tag 對齊里程碑」的驗收條件。

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
4. **載入字型**：Inter 與 JetBrains Mono 需自行引入（README「字體載入」）。
5. **註冊元件**：按需 `import '@anchor-ui/core/button';`，或全量 `import '@anchor-ui/core';`。
6. **框架設定**：
   - Vue 3：`vite.config.ts` 設定 `compilerOptions.isCustomElement: (tag) => tag.startsWith('aui-')`。
   - Angular：元件加 `schemas: [CUSTOM_ELEMENTS_SCHEMA]`；樣式加進 `angular.json` 的 `styles`（`node_modules/@anchor-ui/core/dist/styles.css`）；表單雙向綁定需加 `ngDefaultControl`。
7. **確認**：畫面上 `<aui-button>` 有樣式、切換 `<html data-theme="dark">` 會變深色。

### 導入時的注意事項

| 狀況                                                    | 原因與處理                                                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 安裝時提示 `@anchor-ui/core` 有 `prepare: husky` 待核准 | 發布的 `package.json` 帶著本元件庫開發用的 `prepare` 腳本。**不要核准**，略過即可，安裝本身已成功。（之後可考慮在打包時移除此腳本） |
| TypeScript 對 CSS import 報 `TS2882`                    | 缺少 Vite 的 CSS 型別宣告，加上 `/// <reference types="vite/client" />`（Vite 範本的 `src/vite-env.d.ts` 預設已有）。               |
| 同時載入 `tokens.css` 與 `styles.css`                   | `styles.css` 已包含 tokens，重複載入無害但多餘，只留一個。                                                                          |
| 只想按需載入，卻需要切換主題                            | `setTheme` 等函式只在全量入口，引用會註冊所有元件。改為直接設定 `document.documentElement.dataset.theme = 'dark'`。                 |
| 放進 `<aui-field>` 的 `<aui-input>` 沒有作用            | Field 只自動註冊自己渲染的 `<aui-icon-button>`，放進去的 Input / Output / Segmented 要另外 import。                                 |
| Vue 出現「Failed to resolve component: aui-xxx」        | 沒有設定 `isCustomElement`。                                                                                                        |
| Angular 範本報「'aui-xxx' is not a known element」      | 該元件沒有加 `CUSTOM_ELEMENTS_SCHEMA`。                                                                                             |
| `npm update` 沒有升級元件庫                             | 以網址安裝的相依版本由網址決定，升級要用新版網址重新 `npm install`。                                                                |

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

| 狀況                                        | 原因與處理                                                                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Release workflow 在版號檢查失敗             | tag 名稱與該 commit 的 `package.json` 版號不一致。tag 要打在 release PR 的**合併 commit**上，不是之前的 commit。     |
| Release workflow 說 tag 不在 `main` 上      | tag 打在 release 分支或 `develop` 上了。刪除 tag 後重新打在 `origin/main`。                                          |
| Release workflow 等 CI 逾時或中止           | `main` 上該 commit 的 CI 失敗或還沒跑完。修好後重跑 workflow；Release 已存在時只會覆蓋上傳 tarball。                 |
| 打錯 tag 要重來                             | `git tag -d v0.2.0-beta`、`git push origin :refs/tags/v0.2.0-beta`，若 Release 已建立也要一併刪除。                  |
| Windows 建置時找不到 `#module-sync-enabled` | 目錄太深超過 260 字元路徑限制，換到路徑較短的目錄建置。                                                              |
| 手動 `npm pack` 產出壞掉的 tarball          | 建置失敗時 `npm pack` 仍會打包。一律用 `pnpm release:pack`，任一步驟失敗就不會打包。                                 |
| release PR 夾帶其他變更                     | release PR 只改 `package.json` 版號；其他變更走一般 PR 先進 `main`。                                                 |
| 工作區還有其他未 commit 的修改              | `git commit -am` 會把它們一起帶進 release PR，改用 `git commit package.json -m "..."` 只提交版號。                   |
| 發布後切回 `develop` 時 `package.json` 擋住 | commit 時 lint-staged 的 prettier 改寫了換行符號，內容沒變；`git diff` 確認無實質差異後 `git restore package.json`。 |

## 5. 之後會改變的部分

- **Phase 3 TASK-308**：PR 自動部署 Storybook 預覽並留言連結，`main` 更新時發布線上文件站。完成後在本篇補上操作方式。
- **Phase 4 TASK-405**：導入 Changesets，版號、CHANGELOG、tag 與 `npm publish` 全自動，第 2 節的手動流程屆時作廢。
