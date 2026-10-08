# Anchor UI 技術筆記

> 記錄 Anchor UI 開發過程中用到的工具與技術觀念。每份筆記一個主題，包含「是什麼、為什麼需要、怎麼做、常見陷阱」，並附上在 Anchor UI 中的實際應用。

| #   | 主題                                                  | 一句話說明                                           | 對應任務 |
| --- | ----------------------------------------------------- | ---------------------------------------------------- | -------- |
| 01  | [Tree-shaking 與套件副作用](./01-tree-shaking.md)     | 讓消費端只打包「用到的」元件                         | TASK-201 |
| 02  | [Size Limit 體積門禁](./02-size-limit.md)             | 在 CI 量測並限制套件體積，防止不知不覺變胖           | TASK-202 |
| 03  | [視覺回歸測試](./03-visual-regression.md)             | 截圖逐像素比對，抓出「外觀被改壞」                   | TASK-203 |
| 04  | [Top Layer、dialog 與 Popover API](./04-top-layer.md) | 瀏覽器原生的「最上層」，以及 modal 造成的 inert 邊界 | TASK-204 |
| 05  | [共用浮層基礎模組](./05-overlay-foundation.md)        | 背景捲動鎖定與焦點返還，Modal / Alert / Drawer 共用  | TASK-204 |
| 06  | [語意化版本與發布產物](./06-semver-release.md)        | SemVer、預覽版號、Git Tag、`npm pack` 與 yalc        | TASK-205 |

另見：[`doc/Lit_note.md`](../doc/Lit_note.md)（Lit 語法與 Web Component 開發指南）。
