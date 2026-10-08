# 視覺回歸測試 (Visual Regression Testing)

> 對應任務：Phase 2 TASK-203「視覺回歸測試建置」
> 工具：[`@web/test-runner-visual-regression`](https://modern-web.dev/docs/test-runner/plugins/visual-regression/)（沿用專案現有的 Web Test Runner + Playwright）

## 1. 是什麼

對元件**截圖**，和事先存好的**基準圖（baseline）**逐像素比對。差異超過門檻就判定失敗，並產出一張標出差異位置的**差異圖（diff）**。

**回歸（regression）**的意思是「原本正常的東西被改壞了」。視覺回歸測試專門抓「外觀被改壞」。

## 2. 為什麼需要

一般的單元測試檢查「行為」與「計算後的樣式值」，但抓不到這類問題：

- 改了一個共用 token，結果另一個元件的 padding 跑掉。
- 深色模式下某個邊框消失。
- 調整 Tag 的 hover 效果，不小心影響到 IconButton。

Anchor UI 的外觀高度依賴 design tokens 與雙主題，一個 token 的改動可能波及所有元件，人工逐一檢查每個元件、每個變體、兩種主題並不實際。

## 3. 運作流程

```
第一次執行（或指定更新）──▶ 截圖存成 baseline
之後每次執行 ──▶ 截圖 ──▶ 與 baseline 逐像素比對
                              ├── 差異 ≤ 門檻 ──▶ 通過
                              └── 差異 > 門檻 ──▶ 失敗，輸出 failed 圖與 diff 圖
```

比對使用 [pixelmatch](https://github.com/mapbox/pixelmatch)，有兩層門檻：

| 門檻                                        | 意義                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| `diffOptions.threshold`（pixelmatch）       | 單一像素的顏色差多少才算「不同」（0～1，越小越敏感）                             |
| `failureThreshold` + `failureThresholdType` | 「不同的像素」佔多少才算失敗；`'percent'` 為 0～100 的百分比，`'pixel'` 為像素數 |

## 4. 安裝與設定

```bash
pnpm add -D @web/test-runner-visual-regression
```

```js
// web-test-runner.config.mjs（示意）
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';

export default {
  plugins: [
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
      failureThreshold: 0.1, // 差異超過 0.1% 即失敗
      failureThresholdType: 'percent',
    }),
  ],
};
```

測試寫法：

```ts
import { fixture, html } from '@open-wc/testing';
import { visualDiff } from '@web/test-runner-visual-regression';

it('primary button – dark', async () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  const el = await fixture(html`<aui-button variant="primary">Save</aui-button>`);
  await visualDiff(el, 'button-primary-dark');
});
```

更新基準圖：

```bash
pnpm wtr --update-visual-baseline
```

## 5. 最大的敵人：環境造成的假差異

截圖比對對環境極度敏感。**偶發失敗（flaky）會讓團隊不再相信這個檢查**，所以「穩定」比「敏感」更重要。

| 假差異來源       | 說明                                                                     | 對策                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **字型**         | Anchor UI 刻意不打包字型；Windows 本機與 CI 的 Ubuntu 會用不同的後備字型 | 測試環境自行以 `@font-face` 載入 Inter 與 JetBrains Mono（OFL 授權，可放入測試資源），截圖前 `await document.fonts.ready`                                               |
| **作業系統渲染** | 文字反鋸齒、次像素渲染各平台不同                                         | 一律在固定的 [Playwright 官方 Docker 映像](https://playwright.dev/docs/docker)中截圖，版本與專案的 Playwright 一致（例如 `mcr.microsoft.com/playwright:v1.63.0-noble`） |
| **動畫與轉場**   | Tooltip 淡入、Spinner 旋轉、Toast 滑入                                   | 以 `emulateMedia({ reducedMotion: 'reduce' })` 停用，或注入 `* { animation: none !important; transition: none !important; }`                                            |
| **輸入游標**     | 文字輸入框的游標會閃爍                                                   | 截圖時設定 `caret-color: transparent`                                                                                                                                   |
| **視窗與縮放**   | 不同 viewport、devicePixelRatio 會改變截圖尺寸                           | 固定瀏覽器 viewport 與縮放比例                                                                                                                                          |

> 重點：**基準圖在哪個環境產生，就只能在同一個環境比對。** 不要在本機 Windows 產生基準圖再拿到 CI 比對。

## 6. 基準圖的管理流程

1. 基準圖（PNG）提交到 repo。元件截圖通常只有幾 KB；數量多到影響 repo 大小時再考慮 Git LFS。
2. **刻意修改外觀時**：在 Docker 容器中執行更新指令，把新的基準圖隨 PR 一起提交。
3. **審查**：GitHub 的 PR 頁面可以直接比對前後圖片，審查者確認變化是刻意的。
4. **非刻意的差異**：CI 失敗並保留 failed / diff 圖（建議以 artifact 上傳），開發者下載查看哪裡被改壞。

## 7. 截圖範圍的取捨

- **以元件為單位截圖**，不要截整頁：範圍越大，任何小改動都會讓大量測試失敗。
- 每個元件涵蓋**所有變體 × 淺色／深色主題**。
- 互動狀態（hover、focus、open）視需要補拍；需要穩定觸發的狀態才拍，例如用 `open` 屬性開啟 Tooltip，而不是模擬滑鼠移入。

## 8. 常見陷阱

- 本機與 CI 環境不同 → 大量假差異（見第 5 節）。
- 門檻設太嚴（0 像素）→ 反鋸齒的微小差異就失敗；設太寬 → 抓不到真正的問題。0.1% 是常見起點。
- 忘記等字型載入完成 → 有時截到後備字型、有時截到正式字型，造成偶發失敗。
- 把 failed / diff 圖也提交進 repo → 應加入 `.gitignore`，只提交 baseline。

## 參考資料

- [@web/test-runner-visual-regression](https://modern-web.dev/docs/test-runner/plugins/visual-regression/)
- [pixelmatch](https://github.com/mapbox/pixelmatch)
- [Playwright Docker](https://playwright.dev/docs/docker)
