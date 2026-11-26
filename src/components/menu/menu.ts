import type { CSSResultGroup, LitElement } from 'lit';
import { AuiPopover } from '../popover/popover.js';
import { popoverStyles } from '../popover/popover.styles.js';
import { menuStyles } from './menu.styles.js';
import type { MenuSelectDetail } from './menu.types.js';

/** 在選單中移動焦點的按鍵（選取與首字跳轉另外處理） */
const NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End']);

/** 使用者自行指定、選單會保留的項目角色 */
const ITEM_ROLES = new Set(['menuitem', 'menuitemcheckbox', 'menuitemradio']);

/** 項目內的互動元素：從這些元素發出的點擊與按鍵不視為選取項目 */
const INTERACTIVE =
  'a[href], button, input, select, textarea, [contenteditable=""], [contenteditable="true"]';

/** 選單會改寫的項目屬性；項目移出選單時還原為原本的值 */
const MANAGED_ATTRIBUTES = ['role', 'tabindex', 'type', 'aria-disabled'] as const;

/** 選單管理中的項目（值皆為 MANAGED_ATTRIBUTES 的順序） */
interface ManagedItem {
  /** 使用端原本的屬性值：項目移出選單時還原 */
  original: (string | null)[];
  /** 選單上次同步後的屬性值：用來辨識使用端之後的修改 */
  written: (string | null)[];
}

const readManaged = (element: Element) =>
  MANAGED_ATTRIBUTES.map((name) => element.getAttribute(name));

const isSeparator = (element: Element) =>
  element.localName === 'hr' || element.getAttribute('role') === 'separator';

const isDisabled = (element: Element) =>
  element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';

/** 原生就會以 Enter 觸發點擊的元素：交給瀏覽器處理，保留 Shift 等修飾鍵的行為（如 Shift+Enter 以新視窗開啟連結） */
const activatesOnEnter = (element: Element) =>
  element.localName === 'button' || (element.localName === 'a' && element.hasAttribute('href'));

const isEditable = (element: EventTarget | undefined) =>
  element instanceof Element &&
  element.matches('input, select, textarea, [contenteditable=""], [contenteditable="true"]');

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
export class AuiMenu extends AuiPopover {
  static override styles: CSSResultGroup = [popoverStyles, menuStyles];

  protected override readonly popupRole = 'menu' as const;

  /** 下一次開啟時聚焦最後一個項目（以 ↑ 開啟） */
  private focusLastOnOpen = false;

  /** 選單改寫過的項目與其原本的屬性值（MANAGED_ATTRIBUTES 的順序） */
  private readonly managedItems = new Map<HTMLElement, ManagedItem>();

  /** 項目的 disabled 屬性改變時同步 aria-disabled（slotchange 不會因屬性改變觸發） */
  private disabledObserver?: MutationObserver;

  constructor() {
    super();
    this.addEventListener('keydown', this.handleMenuKeyDown);
    this.addEventListener('click', this.handleItemClick);
    this.addEventListener('pointermove', this.handlePointerMove);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof MutationObserver === 'undefined') return;
    this.disabledObserver ??= new MutationObserver(this.syncItems);
    this.disabledObserver.observe(this, {
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled'],
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disabledObserver?.disconnect();
  }

  override firstUpdated(): void {
    super.firstUpdated();
    // 項目增減時更新角色（slotchange 會冒泡到 shadow root）
    this.shadowRoot!.addEventListener('slotchange', this.syncItems);
    this.syncItems();
  }

  /** 選單項目（面板的直接子元素，不含分隔線），依文件順序 */
  get items(): HTMLElement[] {
    return this.panelChildren().filter((element) => !isSeparator(element));
  }

  /** 可以鍵盤巡覽的項目：原生 disabled 的元素無法聚焦，略過 */
  private get navigableItems(): HTMLElement[] {
    return this.items.filter((item) => !item.hasAttribute('disabled'));
  }

  private panelChildren(): HTMLElement[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    return (slot?.assignedElements({ flatten: true }) ?? []) as HTMLElement[];
  }

  /**
   * 為項目加上角色、roving 用的 tabindex 與停用狀態；已移出選單的項目還原為原本的屬性。
   * 第一次處理某個元素時記下其原本的屬性值（使用端之後的修改會更新它），
   * 停用狀態以原本的 aria-disabled 加上目前的 disabled 計算
   */
  private syncItems = (): void => {
    const children = this.panelChildren();
    for (const [element, managed] of this.managedItems) {
      if (!children.includes(element)) this.restoreItem(element, managed);
    }
    for (const element of children) {
      let managed = this.managedItems.get(element);
      if (!managed) {
        managed = { original: readManaged(element), written: readManaged(element) };
        this.managedItems.set(element, managed);
      } else {
        this.adoptUserChanges(element, managed);
      }
      const [role, , type, ariaDisabled] = managed.original;
      if (isSeparator(element)) {
        element.setAttribute('role', 'separator');
      } else {
        element.setAttribute('role', role && ITEM_ROLES.has(role) ? role : 'menuitem');
        element.tabIndex = -1;
        if (element.localName === 'button' && type === null) element.setAttribute('type', 'button');
        const disabled = element.hasAttribute('disabled') ? 'true' : ariaDisabled;
        if (disabled === null) element.removeAttribute('aria-disabled');
        else element.setAttribute('aria-disabled', disabled);
      }
      managed.written = readManaged(element);
    }
  };

  /**
   * 屬性的值與選單上次寫入的不同，代表使用端（如框架的繫結）之後改過：以新的值作為原本的值，
   * 否則下一次同步會把它改回第一次看到的值（例如動態設為 aria-disabled="true" 的項目又變成可選取）
   */
  private adoptUserChanges(element: HTMLElement, managed: ManagedItem): void {
    MANAGED_ATTRIBUTES.forEach((name, index) => {
      const current = element.getAttribute(name);
      if (current !== managed.written[index]) managed.original[index] = current;
    });
  }

  private restoreItem(element: HTMLElement, managed: ManagedItem): void {
    this.managedItems.delete(element);
    this.adoptUserChanges(element, managed);
    MANAGED_ATTRIBUTES.forEach((name, index) => {
      const value = managed.original[index];
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    });
  }

  /** 開啟時聚焦第一個（以 ↑ 開啟時為最後一個）項目；沒有項目時聚焦面板 */
  protected override async focusPanel(): Promise<void> {
    this.syncItems();
    const items = this.navigableItems;
    const target = this.focusLastOnOpen ? items.at(-1) : items[0];
    this.focusLastOnOpen = false;
    if (!target) {
      this.panel?.focus({ preventScroll: true });
      return;
    }
    // 尚未渲染的 Lit 元件（例如 <aui-button> 項目）要等渲染完成才能聚焦
    const pending = (target as Partial<Pick<LitElement, 'updateComplete'>>).updateComplete;
    if (pending) {
      await pending;
      if (!this.open) return;
    }
    target.focus({ preventScroll: true });
  }

  /** 目前聚焦的項目（以 :focus-within 判斷：焦點可能在項目的 Shadow DOM 內，項目也可能由其他元件轉插進來） */
  private get activeItem(): HTMLElement | null {
    return this.items.find((item) => item.matches(':focus-within')) ?? null;
  }

  private focusItem(item: HTMLElement | undefined): void {
    item?.focus({ preventScroll: true });
  }

  /** 項目的名稱（首字跳轉用）：aria-label 優先，否則為文字 */
  private itemLabel(item: HTMLElement): string {
    return (item.getAttribute('aria-label') ?? item.textContent ?? '').trim().toLocaleLowerCase();
  }

  private handleMenuKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const path = event.composedPath();
    const fromTrigger = !!this.triggerElement && path.includes(this.triggerElement);

    // 觸發元素：↓ / ↑ 開啟（Enter / Space 由原生點擊開啟）
    if (fromTrigger) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      if (this.open) {
        const items = this.navigableItems;
        this.focusItem(event.key === 'ArrowUp' ? items.at(-1) : items[0]);
      } else {
        this.focusLastOnOpen = event.key === 'ArrowUp';
        this.show();
        // 開啟被 aui-show 取消時不會聚焦項目：清除旗標，避免影響下一次開啟
        void this.updateComplete.then(() => (this.focusLastOnOpen = false));
      }
      return;
    }

    if (!this.open || isEditable(path[0])) return;

    // APG：Tab / Shift+Tab 關閉選單並照常移動焦點（Shift+Tab 回到觸發元素時，焦點仍在元件內，須明確關閉）
    if (event.key === 'Tab') {
      this.close('focus-out');
      return;
    }

    const items = this.navigableItems;
    const current = this.activeItem;
    const index = current ? items.indexOf(current) : -1;

    if (NAVIGATION_KEYS.has(event.key)) {
      event.preventDefault();
      const last = items.length - 1;
      const next = {
        ArrowDown: index < last ? index + 1 : 0,
        ArrowUp: index > 0 ? index - 1 : last,
        Home: 0,
        End: last,
      }[event.key as 'ArrowDown' | 'ArrowUp' | 'Home' | 'End'];
      this.focusItem(items[next]);
      return;
    }

    if (!current) return;
    // 選取一律經由點擊處理（handleItemClick），只有一處分派 aui-select：
    // Enter 在原生按鈕與連結上由瀏覽器觸發點擊；Space 一律攔下並觸發點擊
    // （按鈕原本在放開 Space 時才點擊，而選取後焦點已移回觸發元素）
    if (event.key === 'Enter' && !activatesOnEnter(path[0] as Element)) {
      event.preventDefault();
      current.click();
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      current.click();
      return;
    }

    // 首字跳轉：從目前項目之後開始，找第一個名稱以該字元開頭的項目（循環）
    if (event.key.length === 1 && event.key.trim()) {
      const char = event.key.toLocaleLowerCase();
      const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
      const match = ordered.find((item) => this.itemLabel(item).startsWith(char));
      if (match) {
        event.preventDefault();
        this.focusItem(match);
      }
    }
  };

  /** 滑鼠移到項目上時焦點跟著移動（APG 範例的行為），只會有一個項目呈現選取中的樣式 */
  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.open) return;
    const path = event.composedPath();
    const item = this.navigableItems.find((candidate) => path.includes(candidate));
    if (item && !item.matches(':focus-within')) this.focusItem(item);
  };

  private handleItemClick = (event: MouseEvent): void => {
    if (!this.open) return;
    const path = event.composedPath();
    const item = this.items.find((candidate) => path.includes(candidate));
    if (!item) return;
    // 項目內其他互動元素的點擊不是選取項目
    const origin = path[0];
    if (origin instanceof Element && origin !== item && item.contains(origin)) {
      const interactive = origin.closest(INTERACTIVE);
      if (interactive && interactive !== item) return;
    }
    if (isDisabled(item)) {
      // 停用的連結項目不導覽
      event.preventDefault();
      return;
    }
    const value = item.getAttribute('value') ?? (item.textContent ?? '').trim();
    const selected = this.dispatchEvent(
      new CustomEvent<MenuSelectDetail>('aui-select', {
        detail: { item, value },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    if (selected) this.close('select');
  };
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-menu')) {
  customElements.define('aui-menu', AuiMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-menu': AuiMenu;
  }
}
