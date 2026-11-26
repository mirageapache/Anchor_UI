import { LitElement, PropertyValues } from 'lit';
/**
 * Anchor UI — Dropzone 元件 (`<aui-dropzone>`)
 *
 * 虛線框外觀的拖放式檔案上傳區：可拖入檔案，或點擊（Enter / Space）開啟原生檔案選取器。
 * 拖曳檔案懸浮於上方時，整塊染上 Accent 琥珀色並加亮邊框。
 *
 * 以 `accept` 限制檔案格式（語法同原生 `<input type="file" accept>`），並於框內顯示格式提示；
 * 拖放不受原生選取器的過濾，因此元件會自行檢查：符合的檔案由 `aui-file-drop` 送出，
 * 不符合的（包含拖入的資料夾）由 `aui-file-reject` 送出並在下方顯示錯誤訊息（`role="alert"`）。
 * 未設定 `multiple` 時只接受第一個符合的檔案。
 *
 * `accept` 建議使用副檔名（`.csv`）：以 MIME 類型比對時依賴瀏覽器回報的 `file.type`，
 * 該值因作業系統與已安裝的軟體而異，也可能是空字串（例如 Windows 上的 `.csv` 可能回報為 Excel 的類型）。
 *
 * 本元件只負責取得檔案，不參與表單送出，也不保留已選擇的檔案；請在 `aui-file-drop` 中自行處理。
 *
 * @element aui-dropzone
 *
 * @slot - 主要提示文字（未提供時使用 `heading` 屬性）
 * @slot hint - 輔助提示（未提供時使用 `hint` 屬性，或依 `accept` 自動產生格式提示）
 * @slot icon - 圖示（預設為上傳圖示）
 *
 * @csspart base - 虛線框（可聚焦的 `<button>`）
 * @csspart icon - 圖示容器
 * @csspart heading - 主要提示文字
 * @csspart hint - 輔助提示文字
 * @csspart error - 錯誤訊息（live region）
 *
 * @fires {CustomEvent<FileDropDetail>} aui-file-drop - 取得通過檢查的檔案時觸發；`detail.files` 為 File 陣列，`detail.source` 為 `drop` 或 `picker`
 * @fires {CustomEvent<FileRejectDetail>} aui-file-reject - 有檔案因格式、數量或為資料夾而被拒絕時觸發；`detail.rejections` 列出檔案與原因
 */
export declare class AuiDropzone extends LitElement {
    static styles: import('lit').CSSResult;
    /** 讓 host.focus() 落在內部的按鈕上 */
    static shadowRootOptions: ShadowRootInit;
    /** 允許的檔案格式，語法同原生 `<input type="file" accept>`（如 `.json,image/*`）；建議使用副檔名 */
    accept: string;
    /** 是否允許一次選擇多個檔案 */
    multiple: boolean;
    /** 是否停用 */
    disabled: boolean;
    /** 主要提示文字 */
    heading: string;
    /** 輔助提示文字；未設定且有 `accept` 時自動顯示格式提示 */
    hint: string;
    /** 自動產生的格式提示前綴 */
    acceptLabel: string;
    /** 檔案格式不符（或為資料夾）時的錯誤訊息前綴（後接檔名） */
    invalidTypeMessage: string;
    /** 未設定 `multiple` 卻提供多個檔案時的錯誤訊息 */
    tooManyMessage: string;
    /** 拖曳的檔案是否正懸浮於上方 */
    private dragging;
    /** 最近一次被拒絕時的錯誤訊息；重新選檔、重新拖入或下一次成功取得檔案時清除 */
    private errorMessage;
    private input?;
    /**
     * dragenter / dragleave 會在游標進出每個子元素時成對觸發，
     * 以計數判斷是否真的離開整個拖放區，避免經過圖示或文字時回饋閃爍。
     */
    private dragDepth;
    constructor();
    /** 開啟原生檔案選取器（需由使用者操作觸發，瀏覽器才會允許） */
    open(): void;
    disconnectedCallback(): void;
    protected willUpdate(changed: PropertyValues<this>): void;
    /**
     * 拖曳在其他地方結束（檔案被放在頁面別處，或頁面內的拖曳被取消）時，不一定會收到對應的 dragleave，
     * 以 window 層級的 drop / dragend 作為保險，確保回饋不會殘留。
     * 不以「relatedTarget 為 null 的 dragleave」判斷拖出視窗：部分瀏覽器在元素之間移動時也不提供 relatedTarget。
     */
    private handleWindowDragEnd;
    private startDrag;
    private resetDrag;
    private handleClick;
    /** 隱藏 input 的 click 會冒泡並穿出 Shadow DOM，外層會多收到一次 click；在此攔下 */
    private handleInputClick;
    private handleDragEnter;
    private handleDragOver;
    private handleDragLeave;
    private handleDrop;
    private handleInputChange;
    /** 依格式與數量分類檔案，分別送出 aui-file-drop 與 aui-file-reject */
    private receive;
    private describeRejections;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'aui-dropzone': AuiDropzone;
    }
}
//# sourceMappingURL=dropzone.d.ts.map