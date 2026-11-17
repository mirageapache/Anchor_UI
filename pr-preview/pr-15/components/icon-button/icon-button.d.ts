import { LitElement, TemplateResult } from 'lit';
import { IconButtonAction, IconButtonColor, IconButtonPreset, IconButtonShape, IconButtonSize, IconButtonStatus, IconButtonVariant } from './icon-button.types.js';
import { TooltipPlacement } from '../tooltip/tooltip.types.js';
/**
 * Anchor UI — Icon Button 元件 (`<aui-icon-button>`)
 *
 * 專為複製 (Copy)、下載 (Download)、關閉、重新整理等動作打造之 32×32px 方形微型操作鈕。
 * 具備 Active 成功回饋狀態（背景與圖示變換為 Success 翠綠色）、平滑淡入淡出切換、
 * 深度結合 `<aui-tooltip>` 與螢幕閱讀器無障礙標籤播報。
 *
 * @element aui-icon-button
 *
 * @slot - 預設自訂圖示內容
 * @slot icon - 明確指定之閒置圖示
 * @slot success-icon - 自訂成功回饋圖示（預設為彈出打勾符號）
 * @slot loading-icon - 自訂載入中圖示（預設為 Spinner）
 *
 * @csspart button - 內部原生 `<button>` 元素容器
 * @csspart tooltip - 內建 `<aui-tooltip>` 浮層容器
 * @csspart icon-wrapper - 圖示定位容器
 * @csspart idle-icon - 閒置狀態圖示層
 * @csspart success-icon - 成功回饋狀態圖示層
 * @csspart loading-icon - 載入中狀態圖示層
 *
 * @fires aui-copy - 複製文字至剪貼簿成功時觸發
 * @fires aui-copy-error - 剪貼簿存取失敗或沒有可複製內容（copy-value 為空）時觸發
 * @fires aui-download - 觸發下載行為時分派（可被 preventDefault 取消以自行接手下載）
 * @fires aui-download-error - download-url 使用不允許的協定（如 javascript:）而拒絕下載時觸發
 * @fires aui-status-change - 元件狀態發生改變時觸發
 */
export declare class AuiIconButton extends LitElement {
    static styles: import('lit').CSSResult[];
    static shadowRootOptions: ShadowRootInit;
    private feedbackTimer;
    private tooltipElement?;
    /**
     * 樣式風格變體
     */
    variant: IconButtonVariant;
    /**
     * 語意色彩與懸停控制（預設 'brand'，支援 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral'）
     */
    color: IconButtonColor;
    /**
     * 尺寸規格（sm: 28px, md: 32px, lg: 40px，預設 32px 觸控盒）
     */
    size: IconButtonSize;
    /**
     * 外觀幾何形狀（rounded: 6px 圓角, circle: 圓形, square: 直角）
     */
    shape: IconButtonShape;
    /**
     * 內建預設圖示名（例如 'copy', 'download', 'close', 'check', 'refresh', 'external', 'more'）
     */
    preset?: IconButtonPreset;
    /**
     * 按鈕點擊行為模式 ('copy' | 'download' | 'custom' | 'none')
     */
    action: IconButtonAction;
    /**
     * 複製至剪貼簿之目標文字（設定後預設點擊即複製該字串）
     */
    copyValue: string;
    /**
     * 觸發下載之檔案連結 URL
     */
    downloadUrl: string;
    /**
     * 觸發下載之指定檔名
     */
    downloadFilename: string;
    /**
     * 浮動氣泡提示文字（空字串時自動依 preset 提供預設提示）
     */
    tooltip: string;
    /**
     * 成功回饋時切換顯示之氣泡提示文字（預設複製為 "已複製！"，下載為 "已下載！"）
     */
    successTooltip: string;
    /**
     * 氣泡提示顯示方位（預設 'top'）
     */
    tooltipPlacement: TooltipPlacement;
    /**
     * 是否強制隱藏 Tooltip 氣泡
     */
    noTooltip: boolean;
    /**
     * 無障礙 aria-label 標籤文字（若無指定則自動回退至 tooltip 內容）
     */
    label: string;
    /**
     * 是否處於停用狀態
     */
    disabled: boolean;
    /**
     * 是否處於載入運算中（顯示旋轉 Spinner 並阻止重複點擊）
     */
    loading: boolean;
    /**
     * 是否處於啟動/成功高亮狀態（反映 is-active 翠綠 Success 視覺）。
     * 僅為視覺高亮，不代表切換按鈕（toggle）的按下狀態，因此不輸出 aria-pressed。
     */
    active: boolean;
    /**
     * 當前運作狀態 ('idle' | 'loading' | 'success' | 'error')
     */
    status: IconButtonStatus;
    /**
     * 成功/錯誤反饋動態維持時間（毫秒，預設 2000ms）
     */
    feedbackDuration: number;
    /**
     * 螢幕閱讀器即時播報文字
     */
    private announcement;
    constructor();
    disconnectedCallback(): void;
    /**
     * 計算目前生效之動作類別。
     * 優先順序：明確的 action → preset（copy / download）→ 由 copy-value / download-url 推斷。
     * preset 須優先於推斷，否則 preset 切到 download 時，仍綁定著的 copy-value 會讓點擊變成複製。
     */
    private computeEffectiveAction;
    /**
     * 計算成功狀態提示文字
     */
    private computeSuccessTooltip;
    /**
     * 計算閒置狀態之提示文字
     */
    private computeIdleTooltip;
    /**
     * 計算無障礙 aria-label。
     * 名稱不隨成功／錯誤狀態改變：狀態只透過 live region 播報，避免重複播報。
     */
    private computeAriaLabel;
    /**
     * 是否忙碌中：loading 屬性與 status="loading" 視為同一狀態
     */
    private get isBusy();
    /**
     * 是否啟用 Tooltip 氣泡
     */
    private get hasTooltip();
    /**
     * 點擊事件處理常式
     */
    private handleHostClick;
    /**
     * 執行複製行為並觸發微動態反饋
     */
    copy(): Promise<boolean>;
    /**
     * 執行下載行為並觸發微動態反饋。
     *
     * - 先分派可取消的 `aui-download`；使用端 `preventDefault()` 即可自行接手下載。
     * - 未設定 `download-url` 時只分派事件、不回報成功，由使用端自行處理並呼叫 `triggerFeedback()`。
     * - 僅允許 http(s) / blob / data 協定；其他協定（如 `javascript:`）會被拒絕並分派 `aui-download-error`。
     * - 跨來源網址的 `download` 屬性會被瀏覽器忽略，改以新分頁開啟，避免整頁被導走。
     *
     * @returns 是否已由元件啟動下載
     */
    download(): Promise<boolean>;
    /**
     * 主動觸發狀態反饋（支援 'success' 或 'error'）
     */
    triggerFeedback(type?: 'success' | 'error'): void;
    /**
     * 取消並重設反饋狀態（與 feedback-duration 到期時相同，會分派 aui-status-change）
     */
    resetFeedback(): void;
    private clearFeedbackTimer;
    /**
     * 回饋狀態的唯一轉換點：同步 active、播報文字，並在狀態實際改變時分派 aui-status-change
     */
    private setStatus;
    private showTooltipTemporarily;
    private hideTooltipIfShown;
    /**
     * 渲染閒置圖示本體（支援 preset 或 slots）
     */
    private renderIdleIcon;
    /**
     * 渲染成功打勾反饋圖示
     */
    private renderSuccessIcon;
    /**
     * 渲染載入中圖示
     */
    private renderLoadingIcon;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-icon-button': AuiIconButton;
    }
}
//# sourceMappingURL=icon-button.d.ts.map