import { LitElement } from 'lit';
import { OutputStatus } from './output.types.js';
/**
 * Anchor UI — Output 元件 (`<aui-output>`)
 *
 * 展示運算或轉換結果的等寬文字框，左側帶 4px 語意邊條（翠綠成功／琥珀警告／珊瑚紅錯誤）。
 * 長文字保留換行並可於任意位置斷行，不產生橫向溢位。
 * 狀態除顏色外，另以圖示與螢幕閱讀器前綴文字（「成功：」／「警告：」／「錯誤：」）傳達；
 * 結果框為 `role="status"` 的 live region，結果更新時以禮貌模式播報，不打斷使用者輸入。
 * 沒有內容時顯示 `placeholder`，不套用狀態。
 *
 * 可置於 `<aui-field>` 內，由 field 帶入標題與描述並提供複製鈕。
 *
 * @element aui-output
 *
 * @csspart base - 結果框容器（live region）
 * @csspart icon - 狀態圖示
 * @csspart text - 結果文字（或 placeholder）
 */
export declare class AuiOutput extends LitElement {
    static styles: import('lit').CSSResult;
    /**
     * 結果文字（保留換行與空白）
     */
    value: string;
    /**
     * 結果狀態
     */
    status: OutputStatus;
    /**
     * 狀態的文字（僅供螢幕閱讀器，念在結果之前，讓狀態不只依賴圖示與顏色）。
     * 未設定時依 `status` 使用預設的「成功：」「警告：」「錯誤：」；設定後原樣使用，請自行包含標點（如 `Error:`）
     */
    statusLabel: string;
    /**
     * 沒有結果時顯示的提示文字
     */
    placeholder: string;
    /**
     * 無障礙名稱（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的標題自動帶入
     */
    label: string;
    /**
     * 無障礙描述（僅供螢幕閱讀器，不顯示）；置於 `<aui-field>` 內時由 field 的描述自動帶入
     */
    description: string;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-output': AuiOutput;
    }
}
//# sourceMappingURL=output.d.ts.map