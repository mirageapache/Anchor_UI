# Top Layer、`<dialog>` 與 Popover API

> 對應任務：Phase 2 TASK-204「共用浮層基礎模組」，並影響 TASK-210（Modal）、TASK-211（Alert）、TASK-212（Toast）
> Anchor UI 的 Tooltip 已使用 Popover API 進入 Top Layer。

## 1. 是什麼

**Top Layer** 是瀏覽器原生提供的「最上層」：放進 Top Layer 的元素會顯示在整個頁面之上，而且：

- **不受 `z-index` 影響**：不需要再比誰的 z-index 大。
- **不受祖先的 `overflow: hidden`、`transform` 等裁切與定位影響**：即使元素寫在一個 `overflow: hidden` 的容器裡，也不會被裁掉。

傳統做法是把浮層「搬到 `<body>` 底下」並設很大的 z-index，Top Layer 讓這些技巧不再需要。

## 2. 哪些元素會進入 Top Layer

| 方式                            | 說明                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `<dialog>.showModal()`          | **模態**對話框：附帶 `::backdrop` 遮罩、ESC 觸發 `cancel` 事件、**對話框以外的內容變成 inert** |
| Popover API：`el.showPopover()` | 帶有 `popover` 屬性的元素；不會讓其他內容 inert                                                |
| Fullscreen API                  | 全螢幕元素                                                                                     |

> 注意：`<dialog>.show()`（非模態）**不會**進入 Top Layer。

### Popover 的兩種模式

| 屬性值                   | 行為                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `popover="auto"`（預設） | 點擊外部或按 ESC 自動關閉（light dismiss）；開啟另一個 auto popover 時會關閉前一個 |
| `popover="manual"`       | 完全由程式控制開關；Tooltip、Toast 這類需要自己管理的浮層使用此模式                |

## 3. 堆疊順序：越晚進入越上層

Top Layer 中的元素依**進入的先後順序**堆疊，越晚進入的顯示在越上面。

要讓一個已經在 Top Layer 的元素「回到最上面」，可以先移出再放回：

```ts
popover.hidePopover();
popover.showPopover(); // 重新進入 → 位於最上層
```

## 4. ⚠️ 重點：modal dialog 造成的 inert 邊界

`showModal()` 開啟後，**對話框（含其子孫）以外的所有內容都會變成 inert**：

- 無法聚焦、無法點擊。
- 從無障礙樹中移除——螢幕閱讀器讀不到，live region 也不會播報。

關鍵是：**這個 inert 是依 DOM 結構判定的，不是依視覺上誰在上面。** 以下是在 Chromium 實測的結果（Anchor UI，2026-10）：

| 情境                                     | 視覺上         | 能否聚焦／互動  |
| ---------------------------------------- | -------------- | --------------- |
| dialog 內的按鈕                          | —              | ✅ 可以         |
| popover 在 dialog **之前**顯示           | 在 dialog 下方 | ❌ 不行         |
| popover 在 dialog **之後**顯示           | 在 dialog 上方 | ❌ **仍然不行** |
| 先顯示的 popover 重新提升（hide → show） | 在 dialog 上方 | ❌ **仍然不行** |

也就是說，「重新提升到 Top Layer 最上層」只能解決**看得到**，無法解決**能操作**與**能被播報**。

### 對 Toast 的影響與對策

Toast 容器若是 dialog 以外的 popover，Modal 開啟期間的通知會「看得到但點不到關閉鈕、螢幕閱讀器也聽不到」。

可行的對策：**Modal 開啟時，把 Toast 容器移入最上層 modal 的 DOM 子樹中**（例如由 `<aui-modal>` 在 `<dialog>` 內提供一個專用 slot，把 Toast 容器以 light DOM 子元素的形式掛進去；關閉時移回原處）。如此 Toast 屬於 dialog 的子孫，不會被 inert。

> 另一個選項是不用 `showModal()`、改用非模態 `<dialog>` 並自行對其他內容設定 `inert`，但這樣就失去原生模態行為的保證，維護成本較高，不建議。

## 5. `inert` 屬性

`inert` 也可以手動加在任何元素上，效果相同：無法聚焦、無法點擊、從無障礙樹移除。

```html
<main inert>…</main>
```

適用於非 dialog 的情境，例如抽屜開啟時讓主內容不可操作。

## 6. 在 Anchor UI 的應用

| 元件              | 作法                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| Tooltip（已完成） | `popover="manual"` + `@floating-ui/dom` 定位                                           |
| Modal / Alert     | `<dialog>.showModal()`：取得 Top Layer、背景 inert、ESC（`cancel` 事件）、`::backdrop` |
| Toast             | `popover="manual"`；新通知時重新提升；**Modal 開啟時移入 modal 子樹**（見第 4 節）     |

## 7. 常見陷阱

- 以為放到 Top Layer 最上面就能互動——見第 4 節。
- `<dialog>.show()`（非模態）不會進 Top Layer，仍受 z-index 與裁切影響。
- ESC 關閉 modal dialog 時，會先觸發 `cancel` 事件（可 `preventDefault()` 阻止），再觸發 `close`。
- `::backdrop` 是 dialog 的偽元素，樣式要寫在 dialog 所在的 Shadow DOM 中。

## 參考資料

- MDN：[Top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)
- MDN：[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- MDN：[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- MDN：[`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
