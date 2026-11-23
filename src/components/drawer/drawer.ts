import { property } from 'lit/decorators.js';
import { drawerStyles } from './drawer.styles.js';
import { ModalDialogElement } from '../../internal/modal-dialog.js';
import { dialogBaseStyles } from '../../internal/modal-dialog.styles.js';
import type { DrawerPlacement } from './drawer.types.js';

/**
 * Anchor UI — Drawer 元件 (`<aui-drawer>`)
 *
 * 可收合的側邊抽屜（Off-canvas Drawer）：從視窗左側或右側滑入的全高面板，常用於行動版導覽選單、
 * 篩選面板或設定欄。不綁定頁面版型，放在頁面任何位置皆可。
 *
 * 與 `<aui-modal>` 共用開關的生命週期（`src/internal/modal-dialog.ts`），行為相同：
 * - **模態**：以原生 `<dialog>.showModal()` 進入 Top Layer，背景變為 inert 並顯示遮罩。
 * - **關閉**：ESC、點擊遮罩（皆可關閉設定）、頁首關閉鈕或 `hide()`；`aui-hide` 可取消並帶有關閉原因。
 * - **捲動與焦點**：開啟時鎖定背景捲動，關閉後焦點返還至觸發元素；內容中帶 `autofocus` 的元素取得初始焦點，
 *   否則聚焦面板本身。
 * - **巢狀浮層**：開啟期間 Toast 等浮層會移入 dialog 內的 `overlay` slot，保持可互動。
 * - **事件冒泡**：下列事件皆 `bubbles` + `composed`，內容中 Tooltip、Modal 的同名事件也會傳到這裡；
 *   只處理自身事件時請先檢查 `event.target === event.currentTarget`。
 *
 * @element aui-drawer
 *
 * @slot - 內容（Body）
 * @slot header - 頁首的額外內容（排在 `heading` 標題之後）
 * @slot footer - 頁尾內容
 * @slot overlay - 內部使用：開啟期間收容 Toast 等需保持可互動的外部浮層
 *
 * @csspart dialog - 原生 `<dialog>`（`::part(dialog)::backdrop` 可調整遮罩）
 * @csspart panel - 抽屜面板
 * @csspart header - 頁首
 * @csspart title - 標題（`heading`）
 * @csspart close-button - 頁首關閉鈕
 * @csspart body - 內容區（超出高度時可捲動）
 * @csspart footer - 頁尾
 *
 * @cssprop [--aui-drawer-width=280px] - 面板寬度（不超過視窗寬度的 85%）
 *
 * @fires aui-show - 開始開啟前觸發（可被 preventDefault 取消）
 * @fires aui-after-show - 完全開啟且進場動畫結束後觸發
 * @fires aui-hide - 開始關閉前觸發（可被 preventDefault 取消），`detail.reason` 為關閉原因
 * @fires aui-after-hide - 完全關閉且退場動畫結束後觸發，`detail.reason` 為關閉原因
 */
export class AuiDrawer extends ModalDialogElement {
  static override styles = [dialogBaseStyles('drawer'), drawerStyles];

  /**
   * 滑出方向
   */
  @property({ type: String, reflect: true })
  placement: DrawerPlacement = 'left';

  override render() {
    return this.renderDialog({
      prefix: 'drawer',
      panelClass: `drawer__panel--${this.placement === 'right' ? 'right' : 'left'}`,
    });
  }
}

// 跨微前端 / 多重載入防禦註冊
if (!customElements.get('aui-drawer')) {
  customElements.define('aui-drawer', AuiDrawer);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-drawer': AuiDrawer;
  }
}
