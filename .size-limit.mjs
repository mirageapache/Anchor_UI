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
  index: 61866, // Phase 5 Popover、Menu、Breadcrumb（Menu 後為 61213；Popover 後為 59752；之前為 56004：Phase 4 Drawer、Navbar、Footer、Code View；Footer 後為 53238；Navbar 後為 51400；Drawer 後為 47682；Phase 3 的 6 款元件與 Toast 位置設定後為 45950；Phase 2 結束時 35507，Phase 1 為 20838）
  button: 3634, // 作為 Popover 等彈出式元件的觸發元素（內部按鈕的 aria-expanded 等，實測 3462 → 3634；原基準 3189）
  'icon-button': 16933, // 含相依的 Tooltip 與 @floating-ui/dom；作為彈出式元件的觸發元素（原 16704）
  tag: 3390,
  tooltip: 10807, // 含 @floating-ui/dom（約 6 KB）
  input: 3622, // Enter 隱式送出表單（+414；原 3208）
  field: 18058, // 含相依的 Icon Button、Tooltip 與 @floating-ui/dom
  output: 2501,
  segmented: 3722,
  modal: 5276, // 範本與樣式改由 internal/modal-dialog 產生（單一入口 +228，全量入口因共用而 -527；原 5021）
  alert: 12574, // 含相依的 Modal、Button 與 Input（Modal 範本共用後 +309；Input 的 Enter 送出、Button 的表單動作與 fieldset 停用後 +1124；原 11141）
  toast: 6437, // 新增 placement（六種位置與對應的堆疊、動畫方向；原 5750）
  card: 3384, // TASK-301
  accordion: 2665, // TASK-302
  dropzone: 4616, // TASK-303
  'favorite-btn': 12693, // 提示改用內建的 Tooltip，含相依的 Tooltip 與 @floating-ui/dom（原 2423）
  header: 17034, // 含相依的 Favorite Btn（連同 Tooltip 與 @floating-ui/dom）與 Tag（原 6503）
  kbd: 1494, // TASK-306
  drawer: 5376, // TASK-402（與 Modal 共用 internal/modal-dialog 的範本與樣式；原 5150）
  navbar: 6096, // TASK-403（含相依的 Kbd）
  footer: 3575, // TASK-404
  'code-view': 3934, // TASK-401
  popover: 9951, // TASK-505（含 @floating-ui/dom）
  menu: 11532, // TASK-506（含相依的 Popover 與 @floating-ui/dom）
  breadcrumb: 1669, // TASK-507
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
