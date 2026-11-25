import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hasLightContent, LightContentController } from '../../internal/slot.js';
import { dropzoneStyles } from './dropzone.styles.js';
import type {
  DropzoneRejection,
  DropzoneSource,
  FileDropDetail,
  FileRejectDetail,
} from './dropzone.types.js';

/** 原生 accept 允許的類型萬用字元（其他如 text/* 不是合法的 accept 值） */
const WILDCARD_TYPES = new Set(['audio/*', 'video/*', 'image/*']);

/** 是否為合法的 accept 條件：副檔名、完整的 MIME 類型，或 audio/* / video/* / image/* */
function isValidAcceptToken(token: string): boolean {
  if (token.startsWith('.')) return token.length > 1;
  if (WILDCARD_TYPES.has(token)) return true;
  return /^[^/*\s]+\/[^/*\s]+$/.test(token);
}

/**
 * 將 accept 字串拆成個別的格式條件（小寫、去除空白）。
 * 與原生相同，不合法的條件（如 `json`、`*`、`*\/*`）會被忽略；全部不合法時等同沒有限制。
 */
function parseAccept(accept: string): string[] {
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(isValidAcceptToken);
}

/**
 * 檔案是否符合 accept 條件：副檔名（`.json`）、MIME 類型（`application/json`）或類型萬用字元（`image/*`）。
 * 原生檔案選取器只是「建議」過濾，使用者可切換為所有檔案；拖放則完全不過濾，因此需自行檢查。
 */
function matchesAccept(file: File, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

/** 拖曳的內容是否包含檔案（拖曳文字或連結時不應顯示可放下的回饋） */
const hasFiles = (event: DragEvent): boolean =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files');

/**
 * 找出拖放內容中的資料夾。資料夾在 dataTransfer.files 中是一個無法讀取內容的 File，
 * 只能透過對應的 item 判斷（webkitGetAsEntry 為各瀏覽器皆支援的非標準 API）。
 */
function droppedDirectories(dataTransfer: DataTransfer | null): Set<File> {
  const directories = new Set<File>();
  for (const item of Array.from(dataTransfer?.items ?? [])) {
    if (item.kind !== 'file') continue;
    if (item.webkitGetAsEntry?.()?.isDirectory) {
      const file = item.getAsFile();
      if (file) directories.add(file);
    }
  }
  return directories;
}

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
export class AuiDropzone extends LitElement {
  static override styles = dropzoneStyles;

  /** 讓 host.focus() 落在內部的按鈕上 */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** 允許的檔案格式，語法同原生 `<input type="file" accept>`（如 `.json,image/*`）；建議使用副檔名 */
  @property({ type: String })
  accept = '';

  /** 是否允許一次選擇多個檔案 */
  @property({ type: Boolean, reflect: true })
  multiple = false;

  /** 是否停用 */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** 主要提示文字 */
  @property({ type: String })
  heading = '拖放檔案到此處，或點擊選擇檔案';

  /** 輔助提示文字；未設定且有 `accept` 時自動顯示格式提示 */
  @property({ type: String })
  hint = '';

  /** 自動產生的格式提示前綴 */
  @property({ type: String, attribute: 'accept-label' })
  acceptLabel = '支援格式：';

  /** 檔案格式不符（或為資料夾）時的錯誤訊息前綴（後接檔名） */
  @property({ type: String, attribute: 'invalid-type-message' })
  invalidTypeMessage = '不支援的檔案格式：';

  /** 未設定 `multiple` 卻提供多個檔案時的錯誤訊息 */
  @property({ type: String, attribute: 'too-many-message' })
  tooManyMessage = '一次只能選擇一個檔案，已使用第一個檔案';

  /** 拖曳的檔案是否正懸浮於上方 */
  @state() private dragging = false;

  /** 最近一次被拒絕時的錯誤訊息；重新選檔、重新拖入或下一次成功取得檔案時清除 */
  @state() private errorMessage = '';

  @query('input')
  private input?: HTMLInputElement;

  /**
   * dragenter / dragleave 會在游標進出每個子元素時成對觸發，
   * 以計數判斷是否真的離開整個拖放區，避免經過圖示或文字時回饋閃爍。
   */
  private dragDepth = 0;

  constructor() {
    super();
    // light DOM 變動時重新渲染，讓「是否有自訂提示文字」的判斷保持最新
    new LightContentController(this);
  }

  /** 開啟原生檔案選取器（需由使用者操作觸發，瀏覽器才會允許） */
  open(): void {
    if (this.disabled) return;
    // 先清除上一次的錯誤訊息：之後即使出現相同的訊息，live region 的內容也有變化，會再次被播報
    this.errorMessage = '';
    this.input?.click();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resetDrag();
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // 拖曳途中被停用：立即移除可放下的回饋
    if (changed.has('disabled') && this.disabled) this.dragging = false;
  }

  /**
   * 拖曳在其他地方結束（檔案被放在頁面別處，或頁面內的拖曳被取消）時，不一定會收到對應的 dragleave，
   * 以 window 層級的 drop / dragend 作為保險，確保回饋不會殘留。
   * 不以「relatedTarget 為 null 的 dragleave」判斷拖出視窗：部分瀏覽器在元素之間移動時也不提供 relatedTarget。
   */
  private handleWindowDragEnd = (): void => {
    this.resetDrag();
  };

  private startDrag(): void {
    if (this.dragging) return;
    this.dragging = true;
    for (const type of ['drop', 'dragend'] as const) {
      window.addEventListener(type, this.handleWindowDragEnd, true);
    }
  }

  private resetDrag(): void {
    this.dragDepth = 0;
    this.dragging = false;
    for (const type of ['drop', 'dragend'] as const) {
      window.removeEventListener(type, this.handleWindowDragEnd, true);
    }
  }

  private handleClick = (): void => this.open();

  /** 隱藏 input 的 click 會冒泡並穿出 Shadow DOM，外層會多收到一次 click；在此攔下 */
  private handleInputClick = (event: Event): void => event.stopPropagation();

  private handleDragEnter = (event: DragEvent): void => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    this.dragDepth++;
    if (!this.disabled) {
      this.startDrag();
      this.errorMessage = '';
    }
  };

  private handleDragOver = (event: DragEvent): void => {
    if (!hasFiles(event)) return;
    // 必須取消預設行為，瀏覽器才會把這裡視為可放下的目標。
    // 停用時也要取消（並標示為不可放下），否則放下檔案會讓瀏覽器直接開啟該檔案而離開頁面。
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = this.disabled ? 'none' : 'copy';
    // 拖曳途中由停用恢復為啟用時，補上回饋
    if (!this.disabled) this.startDrag();
  };

  private handleDragLeave = (): void => {
    // 不檢查是否為檔案：部分瀏覽器在 dragleave 不提供 types，檢查會讓計數無法歸零
    if (this.dragDepth === 0) return;
    this.dragDepth--;
    if (this.dragDepth === 0) this.resetDrag();
  };

  private handleDrop = (event: DragEvent): void => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    this.resetDrag();
    if (this.disabled) return;
    this.receive(
      Array.from(event.dataTransfer?.files ?? []),
      'drop',
      droppedDirectories(event.dataTransfer),
    );
  };

  private handleInputChange = (): void => {
    const input = this.input;
    if (!input) return;
    const files = Array.from(input.files ?? []);
    // 清空選取，之後再次選擇同一個檔案時仍會觸發 change
    input.value = '';
    if (this.disabled) return;
    this.receive(files, 'picker');
  };

  /** 依格式與數量分類檔案，分別送出 aui-file-drop 與 aui-file-reject */
  private receive(files: File[], source: DropzoneSource, directories = new Set<File>()): void {
    if (files.length === 0) return;

    const tokens = parseAccept(this.accept);
    const accepted: File[] = [];
    const rejections: DropzoneRejection[] = [];
    for (const file of files) {
      if (directories.has(file)) rejections.push({ file, reason: 'directory' });
      else if (!matchesAccept(file, tokens)) rejections.push({ file, reason: 'type' });
      else if (!this.multiple && accepted.length > 0) rejections.push({ file, reason: 'count' });
      else accepted.push(file);
    }

    this.errorMessage = this.describeRejections(rejections);

    if (accepted.length > 0) {
      this.dispatchEvent(
        new CustomEvent<FileDropDetail>('aui-file-drop', {
          detail: { files: accepted, source },
          bubbles: true,
          composed: true,
        }),
      );
    }
    if (rejections.length > 0) {
      this.dispatchEvent(
        new CustomEvent<FileRejectDetail>('aui-file-reject', {
          detail: { files: rejections.map(({ file }) => file), rejections, source },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private describeRejections(rejections: DropzoneRejection[]): string {
    const messages: string[] = [];
    const unsupported = rejections.filter(({ reason }) => reason !== 'count');
    if (unsupported.length > 0) {
      messages.push(this.invalidTypeMessage + unsupported.map(({ file }) => file.name).join('、'));
    }
    if (rejections.some(({ reason }) => reason === 'count')) {
      messages.push(this.tooManyMessage);
    }
    return messages.join(' ');
  }

  override render() {
    const tokens = parseAccept(this.accept);
    const hint = this.hint || (tokens.length > 0 ? this.acceptLabel + tokens.join('、') : '');
    const hasHint = !!hint || hasLightContent(this, 'hint');

    // 拖放事件掛在外層容器而不是 <button>：停用的表單控制項在部分瀏覽器不會收到事件，
    // 掛在容器上才能確保停用時仍能攔下拖放（避免瀏覽器直接開啟被放下的檔案）。
    return html`
      <div
        class=${classMap({ 'dropzone-area': true, 'is-disabled': this.disabled })}
        @dragenter=${this.handleDragEnter}
        @dragover=${this.handleDragOver}
        @dragleave=${this.handleDragLeave}
        @drop=${this.handleDrop}
      >
        <button
          type="button"
          class=${classMap({ dropzone: true, 'is-dragging': this.dragging })}
          part="base"
          ?disabled=${this.disabled}
          aria-labelledby="heading"
          aria-describedby="hint error"
          @click=${this.handleClick}
        >
          <span class="dropzone__icon" part="icon" aria-hidden="true">
            <slot name="icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
            </slot>
          </span>
          <span class="dropzone__heading" part="heading" id="heading">
            <!-- 不使用 slot 的 fallback：host 內的換行空白也會被指派到預設 slot，使 fallback 不顯示 -->
            <slot></slot>${hasLightContent(this) ? nothing : this.heading}
          </span>
          <span class="dropzone__hint" part="hint" id="hint" ?hidden=${!hasHint}>
            <slot name="hint">${hint}</slot>
          </span>
        </button>
        <!-- live region 需常駐於 DOM 並維持顯示，訊息出現時才會被播報；沒有訊息時不佔版面 -->
        <div
          class=${classMap({ dropzone__error: true, 'has-message': !!this.errorMessage })}
          part="error"
          id="error"
          role="alert"
        >
          ${this.errorMessage}
        </div>
      </div>
      <input
        class="dropzone__input"
        type="file"
        tabindex="-1"
        aria-hidden="true"
        accept=${ifDefined(this.accept || undefined)}
        ?multiple=${this.multiple}
        ?disabled=${this.disabled}
        @click=${this.handleInputClick}
        @change=${this.handleInputChange}
      />
    `;
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-dropzone')) {
  customElements.define('aui-dropzone', AuiDropzone);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-dropzone': AuiDropzone;
  }
}
