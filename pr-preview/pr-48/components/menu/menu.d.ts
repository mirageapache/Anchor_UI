import { CSSResultGroup } from 'lit';
import { AuiPopover } from '../popover/popover.js';
/**
 * Anchor UI — Dropdown Menu 元件 (`<aui-menu>`)
 *
 * 基於 `<aui-popover>` 的操作選單，依 WAI-ARIA Menu Button 模式實作，例如導覽列的使用者選單、表格列的「更多」操作。
 *
 * - 面板（`role="menu"`）的直接子元素為選單項目（`role="menuitem"`；已指定 `menuitemcheckbox` / `menuitemradio` 者保留），
 *   建議使用 `<button>` 或連結 `<a href>`；`<hr>` 為分隔線。`<button>` 項目沒有 `type` 時設為 `button`（放在表單內也不會送出）。
 *   項目移出選單時，選單加上的屬性會還原。項目內請勿再放其他互動元素（不支援子選單）。
 * - `aria-disabled="true"` 的項目可聚焦但不可選取（APG 建議）；原生 `disabled` 的項目無法聚焦，鍵盤巡覽時略過。
 * - 觸發元素：Enter、Space 或 ↓ 開啟並聚焦第一個項目，↑ 開啟並聚焦最後一個項目。
 * - 選單中：↑ ↓ 移動（頭尾循環）、Home / End 移到第一個／最後一個、輸入字元跳到名稱以該字開頭的項目
 *   （以輸入法組字的文字不支援）；滑鼠移到項目上時焦點跟著移動。
 *   Enter、Space 或點擊選取項目，分派 `aui-select` 後關閉並把焦點還給觸發元素；ESC 關閉；Tab / Shift+Tab 關閉並移動焦點。
 * - `aui-select` 可取消：取消時不關閉選單（例如切換型的項目）。
 * - 其餘屬性與事件同 `<aui-popover>`；`aui-hide` 的 `detail.reason` 在選取項目時為 `select`。
 *
 * @element aui-menu
 *
 * @slot - 選單項目（`<button>`、`<a href>` 等），`<hr>` 為分隔線
 * @slot trigger - 觸發元素（建議使用 `<aui-button>`、`<aui-icon-button>` 或原生 `<button>`）
 *
 * @csspart trigger - 觸發元素的包裝容器
 * @csspart panel - 選單面板
 *
 * @fires {CustomEvent<MenuSelectDetail>} aui-select - 選取項目時觸發（可被 preventDefault 取消，取消時不關閉選單）
 * @fires {CustomEvent<null>} aui-show - 開始開啟前觸發（可被 preventDefault 取消）
 * @fires {CustomEvent<null>} aui-after-show - 完全開啟且進場動畫結束後觸發
 * @fires {CustomEvent<PopoverHideDetail>} aui-hide - 開始關閉前觸發（可被 preventDefault 取消），`detail.reason` 為關閉原因
 * @fires {CustomEvent<PopoverHideDetail>} aui-after-hide - 完全關閉且退場動畫結束後觸發，`detail.reason` 為關閉原因
 */
export declare class AuiMenu extends AuiPopover {
    static styles: CSSResultGroup;
    protected readonly popupRole: "menu";
    /** 下一次開啟時聚焦最後一個項目（以 ↑ 開啟） */
    private focusLastOnOpen;
    /** 已用 Space 的 keydown 選取，接下來的 keyup 不可再觸發點擊 */
    private swallowSpaceKeyUp;
    /** 選單改寫過的項目與其原本的屬性值（MANAGED_ATTRIBUTES 的順序） */
    private readonly managedItems;
    /** 項目的 disabled 屬性改變時同步 aria-disabled（slotchange 不會因屬性改變觸發） */
    private disabledObserver?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    /** 選單項目（面板的直接子元素，不含分隔線），依文件順序 */
    get items(): HTMLElement[];
    /** 可以鍵盤巡覽的項目：原生 disabled 的元素無法聚焦，略過 */
    private get navigableItems();
    private panelChildren;
    /**
     * 為項目加上角色、roving 用的 tabindex 與停用狀態；已移出選單的項目還原為原本的屬性。
     * 第一次處理某個元素時記下其原本的屬性值（使用端之後的修改會更新它），
     * 停用狀態以原本的 aria-disabled 加上目前的 disabled 計算
     */
    private syncItems;
    /**
     * 屬性的值與選單上次寫入的不同，代表使用端（如框架的繫結）之後改過：以新的值作為原本的值，
     * 否則下一次同步會把它改回第一次看到的值（例如動態設為 aria-disabled="true" 的項目又變成可選取）
     */
    private adoptUserChanges;
    private restoreItem;
    /** 開啟時聚焦第一個（以 ↑ 開啟時為最後一個）項目；沒有項目時聚焦面板 */
    protected focusPanel(): Promise<void>;
    /** 目前聚焦的項目（以 :focus-within 判斷：焦點可能在項目的 Shadow DOM 內，項目也可能由其他元件轉插進來） */
    private get activeItem();
    private focusItem;
    /** 項目的名稱（首字跳轉用）：aria-label 優先，否則為文字 */
    private itemLabel;
    private handleMenuKeyDown;
    /**
     * 以 Space 選取後放開按鍵：攔下 keydown 並不保證瀏覽器不在 keyup 時觸發按鈕的點擊（Firefox），
     * 選取被取消而焦點留在項目上時會選取第二次，因此一併攔下這次 keyup
     */
    private handleMenuKeyUp;
    /** 滑鼠移到項目上時焦點跟著移動（APG 範例的行為），只會有一個項目呈現選取中的樣式 */
    private handlePointerMove;
    private handleItemClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-menu': AuiMenu;
    }
}
//# sourceMappingURL=menu.d.ts.map