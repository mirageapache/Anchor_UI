import { property } from 'lit/decorators.js';
import { modalStyles } from './modal.styles.js';
import { ModalDialogElement } from '../../internal/modal-dialog.js';
import { dialogBaseStyles } from '../../internal/modal-dialog.styles.js';
import type { ModalRole, ModalSize } from './modal.types.js';

/**
 * Anchor UI — Modal 元件 (`<aui-modal>`)
 *
 * 通用彈窗外框容器：以原生 `<dialog>.showModal()` 進入 Top Layer，背景自動變為 inert，
 * 並以 `::backdrop` 呈現模糊遮罩。提供 sm / md / lg 三種寬度，以及 Header / Body / Footer 插槽；
 * 沒有內容的頁首與頁尾不會顯示。開關的生命週期與 `<aui-drawer>` 共用（`src/internal/modal-dialog.ts`）。
 *
 * - **關閉**：ESC、點擊遮罩（皆可關閉設定）、頁首關閉鈕或 `hide()`；`aui-hide` 可取消並帶有關閉原因。
 * - **捲動與焦點**：開啟時鎖定背景捲動（巢狀開啟正確計數），關閉後焦點返還至觸發元素（可穿透 Shadow DOM）。
 * - **初始焦點**：聚焦內容中帶有 `autofocus` 屬性的元素，否則聚焦面板本身。
 * - **巢狀浮層**：開啟期間登記為最上層 modal，Toast 等浮層會移入 dialog 內的 `overlay` slot，
 *   避免被 modal 的 inert 邊界擋住（見 note/04-top-layer.md）。
 * - **事件冒泡**：下列事件皆 `bubbles` + `composed`，內容中 Tooltip 或巢狀 Modal 的同名事件也會傳到這裡
 *   （且不一定帶有 `detail.reason`）；只處理自身事件時請先檢查 `event.target === event.currentTarget`。
 *
 * @element aui-modal
 *
 * @slot - 內容（Body）
 * @slot header - 頁首的額外內容（排在 `heading` 標題之後）
 * @slot footer - 頁尾內容，通常為操作按鈕（靠右排列）
 * @slot overlay - 內部使用：開啟期間收容 Toast 等需保持可互動的外部浮層
 *
 * @csspart dialog - 原生 `<dialog>`（`::part(dialog)::backdrop` 可調整遮罩）
 * @csspart panel - 對話框面板
 * @csspart header - 頁首
 * @csspart title - 標題（`heading`）
 * @csspart close-button - 頁首關閉鈕
 * @csspart body - 內容區（超出高度時可捲動）
 * @csspart footer - 頁尾
 *
 * @fires aui-show - 開始開啟前觸發（可被 preventDefault 取消）
 * @fires aui-after-show - 完全開啟且進場動畫結束後觸發
 * @fires aui-hide - 開始關閉前觸發（可被 preventDefault 取消），`detail.reason` 為關閉原因
 * @fires aui-after-hide - 完全關閉且退場動畫結束後觸發，`detail.reason` 為關閉原因
 */
export class AuiModal extends ModalDialogElement {
  static override styles = [dialogBaseStyles('modal'), modalStyles];

  /**
   * 尺寸規格
   */
  @property({ type: String, reflect: true })
  size: ModalSize = 'md';

  /**
   * 對話框角色；需要使用者立即回應的確認對話框使用 `alertdialog`
   */
  @property({ type: String, attribute: 'dialog-role' })
  dialogRole: ModalRole = 'dialog';

  override render() {
    return this.renderDialog({
      prefix: 'modal',
      panelClass: `modal__panel--${this.size}`,
      role: this.dialogRole === 'alertdialog' ? 'alertdialog' : undefined,
    });
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-modal')) {
  customElements.define('aui-modal', AuiModal);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-modal': AuiModal;
  }
}
