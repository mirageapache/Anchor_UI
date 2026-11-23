# Changelog

## [1.0.0-beta.1](https://github.com/mirageapache/Anchor_UI/compare/v1.0.0-beta...v1.0.0-beta.1) (2026-11-23)


### ⚠ BREAKING CHANGES

* **tag:** <aui-tag> 不再套用 text-transform: lowercase。依賴自動轉小寫的標籤請改成直接寫小寫， 或自行加上 aui-tag::part(base) { text-transform: lowercase; }。

### 新功能

* **tag:** 標籤文字照原樣顯示，不再預設轉成小寫 ([287a7a5](https://github.com/mirageapache/Anchor_UI/commit/287a7a59ef8cebb2108ca83a476045b90d3b228c))


### 錯誤修正

* **favorite-btn,tooltip:** 收藏鈕的提示改用 aui-tooltip，提示與名稱相同時不重複作為描述 ([8830ab5](https://github.com/mirageapache/Anchor_UI/commit/8830ab5010206e0c3581b196f6f18e31bfdc9b9c))
* **tag:** 移除鈕不再顯示瀏覽器原生提示 ([881ab86](https://github.com/mirageapache/Anchor_UI/commit/881ab867af4555d06aa3e7fc9029a49f0b2c1a36))
* **tooltip:** block 模式下觸發容器的高度跟隨 host ([813ad25](https://github.com/mirageapache/Anchor_UI/commit/813ad2567edcdf21698e47ee8f5b48ba97c0e9ed))


### 發布

* **release:** 發布 1.0.0-beta.1 預覽版 ([75da6e2](https://github.com/mirageapache/Anchor_UI/commit/75da6e2b428c13a222039bb0f1da32fb815ab86c))

## [1.0.0-beta](https://github.com/mirageapache/Anchor_UI/compare/v0.3.0...v1.0.0-beta) (2026-11-23)


### 新功能

* **code-view:** 新增 &lt;aui-code-view&gt; 程式碼檢視區元件 (TASK-401) ([35e32ca](https://github.com/mirageapache/Anchor_UI/commit/35e32cac99578226ba934466a7afe0e51ccd05b4))
* **drawer:** 新增 &lt;aui-drawer&gt; 側邊抽屜元件 (TASK-402) ([970fe26](https://github.com/mirageapache/Anchor_UI/commit/970fe2655bc01392000aaa2879efb80fe397f677))
* **footer:** 新增 &lt;aui-footer&gt; 通用頁尾元件 (TASK-404) ([a6aeae3](https://github.com/mirageapache/Anchor_UI/commit/a6aeae3ff76f3b35bed2b9387a9d4d7c881b5b13))
* **modal,drawer:** 關閉鈕的名稱可用 close-label 設定 ([3a5c434](https://github.com/mirageapache/Anchor_UI/commit/3a5c434cbe88fb8c87669245993bc9ab084f82d6))
* **navbar:** 新增 &lt;aui-navbar&gt; 頂部導覽列元件 (TASK-403) ([3d63b24](https://github.com/mirageapache/Anchor_UI/commit/3d63b24dd7178765d4ae8ba33eb3c08ed36cb508))


### 錯誤修正

* **card,navbar,footer:** 連結只接受安全的協定 ([27d95f0](https://github.com/mirageapache/Anchor_UI/commit/27d95f0f0f5bbe6bc93b38c89eb98ed7fba521dc))
* **deps:** bump the runtime group with 2 updates ([c0bdadb](https://github.com/mirageapache/Anchor_UI/commit/c0bdadb39119bcea72b2783c962939958a5db2b0))
* **deps:** bump the runtime group with 2 updates ([a6a951f](https://github.com/mirageapache/Anchor_UI/commit/a6a951ff614d5fbf332a1a96d37ac029929a26ba))
* **icon-button:** 同源下載不再導走頁面，active 不被回饋狀態改寫 ([a8412b5](https://github.com/mirageapache/Anchor_UI/commit/a8412b5ffbec052add93cf356f580a7ed8a90584))
* **input,button:** 按 Enter 送出表單，表單動作可由 preventDefault 取消 ([27c0a28](https://github.com/mirageapache/Anchor_UI/commit/27c0a28089130cecfac2cd575cfca0f6d1fc0898))
* **theme:** 全域 focus 樣式不清除元素的陰影，連續切換主題不中斷轉場 ([48bb973](https://github.com/mirageapache/Anchor_UI/commit/48bb973bdbe791dca881edbcd3b980754d4030fa))
* **toast:** 重新提升浮層時不漏掉巢狀 Shadow DOM 內的 popover ([01638ce](https://github.com/mirageapache/Anchor_UI/commit/01638ce9b43fa19b742e3b266ba267f7cd6e8eae))
* **tokens:** 提亮深色主題的 --color-text-muted 以符合 WCAG AA ([4bdf541](https://github.com/mirageapache/Anchor_UI/commit/4bdf5414102b53e3aac0401b5c8627afeb291fb3))
* **tooltip:** 停用中設定 open 不再卡住，退場中被移除仍回報 aui-after-hide ([1fda912](https://github.com/mirageapache/Anchor_UI/commit/1fda91255953e77f7f4eeb7a5c7933997822aa46))
* 修正 code review 找到的元件狀態同步問題 ([d4e89b8](https://github.com/mirageapache/Anchor_UI/commit/d4e89b856beaf9f1023cb648ea0f35a55576419c))


### 效能改進

* **code-view:** 依原始行號分段，摺疊只更新受影響的分段 ([a5c1c10](https://github.com/mirageapache/Anchor_UI/commit/a5c1c101558d7690f953e2e3f8b3203aa1870c76))


### 發布

* **release:** 發布 1.0.0-beta 預覽版 ([8e9b8d0](https://github.com/mirageapache/Anchor_UI/commit/8e9b8d00225e737b727e7a32cc4535b65af4ab8a))

## [0.3.0](https://github.com/mirageapache/Anchor_UI/compare/v0.3.0-beta...v0.3.0) (2026-11-17)


### 發布

* **release:** 結束 0.3.0 的 beta 測試，發布正式版 ([c814e2c](https://github.com/mirageapache/Anchor_UI/commit/c814e2c63e90471aa193c01457cb87c93bcb02e6))
