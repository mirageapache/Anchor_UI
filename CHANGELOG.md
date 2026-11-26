# Changelog

## [1.1.0-beta](https://github.com/mirageapache/Anchor_UI/compare/v1.0.0...v1.1.0-beta) (2026-11-26)


### 新功能

* **accordion:** 新增無外框變體 variant="plain"（TASK-503） ([67a625f](https://github.com/mirageapache/Anchor_UI/commit/67a625fe0e37c0d4168b26bc5bf1050a06f316ed))
* **breadcrumb:** 新增麵包屑導覽元件 &lt;aui-breadcrumb&gt;，Header 新增 breadcrumb slot（TASK-507） ([5d15ceb](https://github.com/mirageapache/Anchor_UI/commit/5d15cebd39187afda4aa85b4559ae9fd84c745b6))
* **card:** 新增 icon slot，支援左側圖示的 KPI 卡片（TASK-504） ([8e704f3](https://github.com/mirageapache/Anchor_UI/commit/8e704f3510cf51ae64d8aa46200952caa90fe894))
* **menu:** 新增下拉選單元件 &lt;aui-menu&gt;（TASK-506） ([de42f6d](https://github.com/mirageapache/Anchor_UI/commit/de42f6d3f8fe978751f814ce076a5b4d634eb7a8))
* **popover:** 新增彈出面板元件 &lt;aui-popover&gt;（TASK-505） ([ac6e477](https://github.com/mirageapache/Anchor_UI/commit/ac6e477feaa3c6f0ec25aab4f3f2812b99b70a81))
* **types:** 新增 Vue 與 React 的範本型別宣告（TASK-502） ([fe712df](https://github.com/mirageapache/Anchor_UI/commit/fe712df779f44d1916d82bc8a61c09695d4c2dca))
* 開放覆寫 Field、Output、Code View 的內建文字 ([8f1408b](https://github.com/mirageapache/Anchor_UI/commit/8f1408b11edaff19ebd58b8a20caffacaa41382a))


### 錯誤修正

* **alert:** 修正 Enter 誤確認，關閉中的 confirm() / cancel() 不再覆寫結果 ([d97d6cd](https://github.com/mirageapache/Anchor_UI/commit/d97d6cdc3954110d0036845110de61fb2e3df22e))
* **code-view:** 複製時以原始文字為準，方向鍵移動不再重新渲染所有行 ([d398021](https://github.com/mirageapache/Anchor_UI/commit/d3980216b486ac8d6046b7bfdb0c5ce9cb7d1902))
* **dropzone:** 拒絕訊息只列出前五個檔名 ([c5c9810](https://github.com/mirageapache/Anchor_UI/commit/c5c981040b57f9e7611e323d0b199d412cd8ac77))
* **favorite-btn:** 支援對 host 的點擊（el.click()） ([f526a86](https://github.com/mirageapache/Anchor_UI/commit/f526a86b4579e10ba2929fd21e42fada57179928))
* **field:** 清除鈕的停用判斷不再依賴 :defined 與 :disabled 選擇器 ([ed5062e](https://github.com/mirageapache/Anchor_UI/commit/ed5062e97827ab07c0fda7f0cf132d12424bbdce))
* **field:** 輸入框被外層 fieldset 停用時，清除鈕同步停用 ([a31cbb9](https://github.com/mirageapache/Anchor_UI/commit/a31cbb9270c41e528857892a7d35fcd36bf2ba42))
* **icon-button:** 回饋期間被移出頁面時結束回饋狀態 ([eefa751](https://github.com/mirageapache/Anchor_UI/commit/eefa7516b69e78d3e930347091f060c2f3e572e2))
* **input:** 修正 Safari 輸入法選字的 Enter 誤送出表單，密碼不再存為可還原的表單狀態 ([5993b2c](https://github.com/mirageapache/Anchor_UI/commit/5993b2c671d4b870e5e912f79c728ecb17a22295))
* **input:** 驗證被擋下後呈現錯誤狀態，補強退回方案的邊界情況 ([b9dda1c](https://github.com/mirageapache/Anchor_UI/commit/b9dda1cf9f1c0f40a67566f229f11f6a1d2956e7))
* **menu:** 保留項目加入選單後才變更的 aria-disabled 等屬性 ([e14b663](https://github.com/mirageapache/Anchor_UI/commit/e14b663c569c10958ed515a41949075e6644ab64))
* **modal:** 外層關閉時一併結束內層對話框，退場中重開補上 aui-after-hide ([ee33e54](https://github.com/mirageapache/Anchor_UI/commit/ee33e54355dc24b63c2a180d633bfe1694dbe054))
* **navbar:** 深色主題下顯示滑過與目前頁面的底色 ([1fb6080](https://github.com/mirageapache/Anchor_UI/commit/1fb60805391f27d71918a648d3c48e767850e826))
* **package:** 放寬選用 peer 的版本範圍，exports 補上 default 條件 ([1316d32](https://github.com/mirageapache/Anchor_UI/commit/1316d32fe7f54c3958959ea561d5305a7e98b319))
* **popover:** 補上離線時開啟與晚升級觸發元素的處理，選單攔下 Space 的 keyup ([9caf009](https://github.com/mirageapache/Anchor_UI/commit/9caf00904eeed07af40c73d72a5a892e7dbbf9cd))
* **segmented:** 支援空字串的選項值，帶修飾鍵的方向鍵不再被攔截 ([e50934f](https://github.com/mirageapache/Anchor_UI/commit/e50934f55cad144717e87a0b336fab7a946a8c2c))
* **tag:** 移除鈕的點擊範圍擴大到 24px 以上 ([9e27927](https://github.com/mirageapache/Anchor_UI/commit/9e279274f9c9077101b9d0db58b4e1ebeee4fb81))
* **theme:** 主題切換的過渡樣式不再蓋過減少動畫的設定 ([4735cb2](https://github.com/mirageapache/Anchor_UI/commit/4735cb2f3c68bd879ff2b32959b37d3006717b7f))
* **theme:** 主題過渡的計時器改存放在整頁共用的狀態 ([cfc546b](https://github.com/mirageapache/Anchor_UI/commit/cfc546bba07a9d569cbb09d39a494f277564457b))
* **theme:** 減少動畫時只壓低主題過渡的時長，保留轉場屬性清單 ([24420f7](https://github.com/mirageapache/Anchor_UI/commit/24420f780175589de27de5eafc6268cb9ce949d3))
* **toast,alert:** 伺服器端渲染時呼叫不再拋出 document is not defined ([f89a881](https://github.com/mirageapache/Anchor_UI/commit/f89a88133e6117ff7c1c686760461da12c762970))
* **toast:** 通知區被搬移或重新放回後，重新判斷暫停狀態與所在位置 ([112f424](https://github.com/mirageapache/Anchor_UI/commit/112f42472b4bb0054e244af9d9665aa2312c7f23))
* **tooltip,modal:** 收合時不再於 updated() 中觸發第二次更新 ([ea25aff](https://github.com/mirageapache/Anchor_UI/commit/ea25affbe78d7170ea8e4d4238b4d9159a5712cb))
* **tooltip:** 修正焦點與滑鼠觸發的開關判斷，重新插入時不再卡在開啟 ([e31d896](https://github.com/mirageapache/Anchor_UI/commit/e31d896ef7a2cffcb02f2166df35a2a3670b2e8d))
* **tooltip:** 沒有內容時不開啟，並支援晚出現的 for 目標 ([32207d9](https://github.com/mirageapache/Anchor_UI/commit/32207d9f25e1a08478beea49478e13c37cc8ebad))
* 提高元件對異常輸入的容錯 ([08776dd](https://github.com/mirageapache/Anchor_UI/commit/08776dd0d88bb65d36d008bb12606750bd19557a))
* 補上強制色彩（Windows 高對比）下的焦點與選取標示 ([9d722b5](https://github.com/mirageapache/Anchor_UI/commit/9d722b5af9d5cf02b5d3b9f89bfe308a8d5b3cc5))

## [1.0.0](https://github.com/mirageapache/Anchor_UI/compare/v1.0.0-beta.1...v1.0.0) (2026-11-23)


### 發布

* **release:** 發布 1.0.0 正式版 ([6acd47d](https://github.com/mirageapache/Anchor_UI/commit/6acd47d53be92c7f138c7097177e4e7a6b006773))

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
