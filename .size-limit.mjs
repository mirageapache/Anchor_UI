// TASK-202: Bundle 體積門禁。逐一量測各元件入口「消費端實際要付出」的體積。
//
// - 以 gzip 計算（size-limit v14 預設為 brotli，須明確指定），不含消費端自備的 lit。
// - @floating-ui/dom 雖為 external，但會隨套件相依安裝並由消費端打包，故計入使用它的元件。
// - 預算 = 基準 × (1 + 10%)：允許合理成長、擋下異常膨脹。
//
// 更新基準：刻意的體積變化（例如新增功能）請在 PR 中說明理由，
// 並以 `pnpm size --json` 的實測值更新下方 BASELINES。新元件首次合併時須補上基準。
import { listComponents } from './scripts/components.mjs';

/** 各入口的體積基準（bytes，gzip；TASK-202 建立於 2026-10-09） */
const BASELINES = {
  index: 20838,
  button: 3189,
  'icon-button': 16704, // 含相依的 Tooltip 與 @floating-ui/dom
  tag: 3390,
  tooltip: 10807, // 含 @floating-ui/dom（約 6 KB）
};

const TOLERANCE = 0.1;

const components = listComponents(import.meta.dirname);

const missing = components.filter((name) => !(name in BASELINES));
if (missing.length) {
  throw new Error(
    `.size-limit.mjs：元件 ${missing.join(', ')} 尚未設定體積基準，請以 pnpm size --json 的實測值補上 BASELINES`,
  );
}

/** 產生一筆 size-limit 檢查設定 */
const sizeEntry = (name, path, baseline) => ({
  name,
  path,
  gzip: true,
  ignore: ['lit'],
  limit: `${Math.ceil(baseline * (1 + TOLERANCE))} B`,
});

export default [
  sizeEntry('@anchor-ui/core（全量入口）', 'dist/index.js', BASELINES.index),
  ...components.map((name) =>
    sizeEntry(`@anchor-ui/core/${name}`, `dist/components/${name}/index.js`, BASELINES[name]),
  ),
];
