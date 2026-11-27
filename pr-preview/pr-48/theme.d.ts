/**
 * Anchor UI — 主題切換（深淺模式）。
 * 透過 <html data-theme="dark"> 驅動 CSS Custom Properties。
 * 獨立成模組（不載入全域樣式），讓測試工具與其他模組可直接使用，不必重寫相同邏輯。
 */
export type Theme = 'light' | 'dark';
export interface SetThemeOptions {
    /**
     * 是否短暫套用 .theme-transitioning class，讓所有可視屬性平滑過渡（預設 true）。
     * 頁面初次載入或截圖測試等需要立即生效時可設為 false。
     */
    transition?: boolean;
}
/**
 * 設定目前頁面之視覺主題 ('light' | 'dark')
 * 透過於 document.documentElement 上設置 data-theme 屬性驅動 CSS Custom Properties。
 * 預設於切換前後短暫套用 .theme-transitioning class，確保所有元素平滑過渡（H-03）。
 */
export declare function setTheme(theme: Theme, options?: SetThemeOptions): void;
/**
 * 取得目前頁面所處之主題狀態。
 * 只看 `<html>` 的 `data-theme`：在頁面的某個區塊上另外設定 `data-theme="dark"` 雖然會套用深色的 token，
 * 但不是受支援的用法，`getTheme()` / `setTheme()` 與跟隨主題的元件（如 Navbar 的主題切換）都不會反映它
 */
export declare function getTheme(): Theme;
/**
 * 切換深淺主題狀態
 */
export declare function toggleTheme(): Theme;
//# sourceMappingURL=theme.d.ts.map