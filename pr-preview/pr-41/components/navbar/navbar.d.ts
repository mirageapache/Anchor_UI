import { LitElement, PropertyValues } from 'lit';
import { NavbarPosition } from './navbar.types.js';
/**
 * Anchor UI — Navbar 元件 (`<aui-navbar>`)
 *
 * 站台頂部導覽列（64px）：品牌 Logo（含 Accent 圓點）、導覽選單、快捷搜尋鈕（內嵌 `⌘K` 鍵帽）
 * 與深淺主題切換開關。預設吸附於頂端（`position`），視窗捲動後顯示陰影（只偵測視窗捲動：
 * 放在自訂的捲動容器中時不會出現陰影）。外層為 `<header>`（banner landmark），一個頁面只應放一個。
 * 不綁定頁面版型、撐滿容器寬度；響應式斷點以 Navbar 自身寬度（container query）判斷，而非視窗寬度。
 *
 * - **窄版（寬度 < 768px）**：導覽選單隱藏，改顯示漢堡選單鈕（44×44px 觸控目標）；搜尋鈕只顯示圖示。
 * - **漢堡選單**：有導覽選單內容時於窄版顯示；設定 `menu-drawer` 而沒有導覽選單內容時，寬版也會顯示
 *   （抽屜是唯一的選單）。點擊時分派可取消的 `aui-menu-click`；設定 `menu-drawer`（與 Navbar 位於同一份文件
 *   或同一個 Shadow Root 的元素 id，通常為 `<aui-drawer>`，任何具備 `show()` 的元素皆可）時，未取消即開啟該元素，
 *   並依其 `aui-after-show` / `aui-after-hide` 同步 `aria-expanded`。抽屜為模態，開啟期間 Navbar 為 inert，
 *   關閉由抽屜自身的關閉鈕、ESC 或遮罩處理。
 * - **搜尋**：點擊搜尋鈕或按下快捷鍵（Apple 平台 ⌘K、其他平台 Ctrl+K）時分派 `aui-search`；
 *   搜尋介面由使用端實作。有其他 modal 開啟時（Navbar 被 inert）快捷鍵不作用。
 * - **主題**：開關反映 `<html data-theme>`（其他地方切換時同步更新）；點擊時分派可取消的 `aui-theme-change`，
 *   未取消即以 `setTheme()` 切換。要自行處理（例如保存偏好）時可在監聽器中 preventDefault 後自行呼叫 `setTheme()`。
 *
 * 內部組合 `<aui-kbd>`（搜尋鈕的鍵帽），載入本元件時會一併註冊。
 *
 * @element aui-navbar
 *
 * @slot - 導覽選單（通常為多個 `<a>`），位於 `<nav>` 內；窄版時隱藏
 * @slot logo - 品牌標誌（如 `<img>` 或 `<svg>`），放在品牌方塊內；未提供時顯示 `brand` 的第一個字
 * @slot actions - 右側的其他操作，位於搜尋鈕與主題開關之間
 *
 * @csspart base - 外層 `<header>`
 * @csspart inner - 內容容器（最大寬度 `--layout-max-width`）
 * @csspart menu-button - 漢堡選單鈕
 * @csspart brand - 品牌區（設定 `brand-href` 時為連結）
 * @csspart logo - 品牌方塊
 * @csspart brand-title - 品牌名稱
 * @csspart nav - 導覽選單的 `<nav>`
 * @csspart actions - 右側操作區
 * @csspart search-button - 搜尋鈕
 * @csspart theme-toggle - 主題切換開關
 *
 * @fires {CustomEvent<null>} aui-menu-click - 點擊漢堡選單鈕時觸發（可被 preventDefault 取消開啟 `menu-drawer`）
 * @fires {CustomEvent<NavbarSearchDetail>} aui-search - 點擊搜尋鈕或按下快捷鍵時觸發，`detail.source` 為 `click` 或 `shortcut`
 * @fires {CustomEvent<NavbarThemeChangeDetail>} aui-theme-change - 點擊主題開關時觸發（可被 preventDefault 取消切換），`detail.theme` 為即將切換到的主題
 */
export declare class AuiNavbar extends LitElement {
    static styles: import('lit').CSSResult;
    /** 品牌名稱 */
    brand: string;
    /**
     * 品牌區的連結網址（通常為首頁）；未設定時品牌區不是連結。
     * 只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定（如 `javascript:`）視為未設定
     */
    brandHref: string;
    /** 定位方式 */
    position: NavbarPosition;
    /** 漢堡選單要開啟的抽屜 id（與 Navbar 位於同一份文件或同一個 Shadow Root） */
    menuDrawer: string;
    /** 是否不顯示漢堡選單鈕 */
    noMenuButton: boolean;
    /** 是否不顯示搜尋鈕（快捷鍵也一併停用） */
    noSearch: boolean;
    /** 是否停用搜尋快捷鍵（⌘K / Ctrl+K） */
    noSearchShortcut: boolean;
    /** 是否不顯示主題切換開關 */
    noThemeToggle: boolean;
    /** 搜尋鈕的文字（同時為其無障礙名稱） */
    searchLabel: string;
    /** 導覽選單的無障礙名稱 */
    navLabel: string;
    /** 漢堡選單鈕的無障礙名稱 */
    menuLabel: string;
    /** 主題切換開關的無障礙名稱（開關開啟代表深色模式） */
    themeLabel: string;
    /** 目前頁面的主題（跟隨 `<html data-theme>`） */
    private theme;
    /** 頁面是否已捲動（顯示陰影） */
    private scrolled;
    /** `menu-drawer` 指定的抽屜是否開啟（同步漢堡鈕的 aria-expanded） */
    private menuExpanded;
    private readonly apple;
    private themeObserver?;
    /**
     * 目前開啟中的 `menu-drawer`：直接在它身上監聽關閉。抽屜開啟中被移出頁面時，
     * 補發的 aui-after-hide 分派在已脫離文件的元素上、傳不到 document，因此不能只靠 document 的監聽
     */
    private openDrawer;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changed: PropertyValues<this>): void;
    /** 依 id 在 Navbar 所在的文件（或 Shadow Root）中尋找抽屜 */
    private resolveMenuDrawer;
    private syncTheme;
    private handleScroll;
    /** 開始（或停止）追蹤開啟中的抽屜，並同步 aria-expanded */
    private trackOpenDrawer;
    /** 抽屜開啟完成（aui-after-show 為 composed，在 document 監聽即可收到；內容中其他浮層的同名事件不算） */
    private handleDrawerShown;
    /** 抽屜關閉完成（忽略抽屜內容中 Modal、Tooltip 等冒泡上來的同名事件） */
    private handleDrawerHidden;
    private handleMenuClick;
    private dispatchSearch;
    private handleSearchClick;
    private handleShortcut;
    private handleThemeToggle;
    private renderBrand;
    private renderSearch;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-navbar': AuiNavbar;
    }
}
//# sourceMappingURL=navbar.d.ts.map