/**
 * 彈出式元件（`<aui-popover>` 等）與觸發元素之間的約定。
 *
 * 觸發元素需標示 `aria-expanded`、`aria-haspopup` 與 `aria-controls`（WAI-ARIA Disclosure / Menu Button）。
 * 實際取得焦點的可能是 Shadow DOM 內的 `<button>`（`<aui-button>`、`<aui-icon-button>`）：
 * 屬性寫在沒有角色的 host 上不會生效，axe 也會判定為不允許的屬性。
 * 因此支援的元件實作 `POPUP_TRIGGER` 方法，自行把狀態寫到內部的按鈕；其他元素（原生 `<button>` 等）直接寫入屬性。
 *
 * 以 `Symbol.for` 建立：頁面上載入多份元件庫時，彼此的元件仍能互相辨識。
 */
export declare const POPUP_TRIGGER: unique symbol;
export interface PopupTriggerState {
    /** 彈出內容是否展開（aria-expanded） */
    expanded: boolean;
    /** 彈出內容的類型（aria-haspopup） */
    hasPopup: 'dialog' | 'menu';
    /**
     * aria-controls 指向的元素。以元素參照（ariaControlsElements）設定：
     * IDREF 無法指向其他 Shadow DOM 內的元素，參照則可指向同一棵或外層 tree 的元素
     */
    controls: Element | null;
}
/** 實作此方法的觸發元素會自行把狀態寫到實際取得焦點的元素上；`null` 代表不再作為觸發元素 */
export interface PopupTrigger {
    [POPUP_TRIGGER](state: PopupTriggerState | null): void;
}
/** 更新觸發元素的展開狀態；`state` 為 `null` 時還原為作為觸發元素之前的屬性 */
export declare function setPopupTriggerState(trigger: Element, state: PopupTriggerState | null): void;
/** 觸發元素實作 POPUP_TRIGGER 時，寫到內部按鈕上的屬性值（供 Lit 範本綁定） */
export declare function popupTriggerAttributes(state: PopupTriggerState | null): {
    hasPopup: string | undefined;
    expanded: string | undefined;
    controls: Element[] | null;
};
//# sourceMappingURL=popup-trigger.d.ts.map