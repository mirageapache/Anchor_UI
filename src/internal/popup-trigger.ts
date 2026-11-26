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
export const POPUP_TRIGGER: unique symbol = Symbol.for('anchor-ui.popup-trigger');

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

type AriaControlsTarget = Element & { ariaControlsElements?: Element[] | null };

const isPopupTrigger = (element: Element): element is Element & PopupTrigger =>
  typeof (element as Partial<PopupTrigger>)[POPUP_TRIGGER] === 'function';

const MANAGED_ATTRIBUTES = ['aria-haspopup', 'aria-expanded'] as const;

/** 一般元素作為觸發元素前原有的屬性值：不再作為觸發元素時還原，不覆蓋使用者自己的設定 */
const originalAttributes = new WeakMap<Element, (string | null)[]>();

/**
 * 尚未定義（升級）的自訂元素觸發元素與它最新的狀態。元件分開載入時，`<aui-button>` 可能比 Popover 晚定義：
 * 當下只能把屬性寫在 host 上，升級後須改交給 POPUP_TRIGGER，並清掉 host 上沒有作用的屬性
 */
const awaitingUpgrade = new WeakMap<Element, PopupTriggerState | null>();

/** 更新觸發元素的展開狀態；`state` 為 `null` 時還原為作為觸發元素之前的屬性 */
export function setPopupTriggerState(trigger: Element, state: PopupTriggerState | null): void {
  if (awaitingUpgrade.has(trigger)) awaitingUpgrade.set(trigger, state);
  if (isPopupTrigger(trigger)) {
    trigger[POPUP_TRIGGER](state);
    return;
  }
  if (
    trigger.localName.includes('-') &&
    !trigger.matches(':defined') &&
    !awaitingUpgrade.has(trigger)
  ) {
    awaitingUpgrade.set(trigger, state);
    void customElements.whenDefined(trigger.localName).then(() => {
      const latest = awaitingUpgrade.get(trigger) ?? null;
      awaitingUpgrade.delete(trigger);
      if (!isPopupTrigger(trigger)) return;
      writePlainAttributes(trigger, null);
      if (latest) trigger[POPUP_TRIGGER](latest);
    });
  }
  writePlainAttributes(trigger, state);
}

/** 一般元素：直接寫入屬性 */
function writePlainAttributes(trigger: Element, state: PopupTriggerState | null): void {
  const target = trigger as AriaControlsTarget;
  if (state) {
    if (!originalAttributes.has(trigger)) {
      originalAttributes.set(
        trigger,
        MANAGED_ATTRIBUTES.map((name) => trigger.getAttribute(name)),
      );
    }
    const { hasPopup, expanded, controls } = popupTriggerAttributes(state);
    trigger.setAttribute('aria-haspopup', hasPopup!);
    trigger.setAttribute('aria-expanded', expanded!);
    target.ariaControlsElements = controls;
    return;
  }
  const original = originalAttributes.get(trigger);
  originalAttributes.delete(trigger);
  MANAGED_ATTRIBUTES.forEach((name, index) => {
    const value = original?.[index] ?? null;
    if (value === null) trigger.removeAttribute(name);
    else trigger.setAttribute(name, value);
  });
  target.ariaControlsElements = null;
}

/** 觸發元素實作 POPUP_TRIGGER 時，寫到內部按鈕上的屬性值（供 Lit 範本綁定） */
export function popupTriggerAttributes(state: PopupTriggerState | null): {
  hasPopup: string | undefined;
  expanded: string | undefined;
  controls: Element[] | null;
} {
  return {
    hasPopup: state?.hasPopup,
    expanded: state ? String(state.expanded) : undefined,
    controls: state?.controls ? [state.controls] : null,
  };
}
