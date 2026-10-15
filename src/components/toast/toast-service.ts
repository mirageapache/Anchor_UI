import { adoptStyles } from 'lit';
import type { AuiToast } from './toast.js';
import { toastViewportStyles } from './toast.styles.js';
import type { ToastConfig, ToastHandle, ToastOptions, ToastVariant } from './toast.types.js';
import { PausableTimer } from '../../internal/pausable-timer.js';
import { sharedState } from '../../internal/shared-state.js';
import { followTopModal, MODAL_OVERLAY_SLOT, raisePopover } from '../../internal/top-layer.js';
import { transitionTimeMs } from '../../internal/transition.js';
import './toast.js';

/** 各狀態預設的自動關閉時間（毫秒）；loading 等待結果，不自動關閉 */
const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 6000,
  loading: 0,
};

const DEFAULT_MAX_VISIBLE = 3;

interface Entry {
  readonly id: string;
  readonly element: AuiToast;
  readonly timer: PausableTimer;
  readonly handle: ToastHandle;
  duration: number;
  state: 'queued' | 'visible' | 'leaving';
  resolveClosed: () => void;
}

/** 瀏覽器不支援 :popover-open 時 matches() 會拋錯，視為未開啟 */
function isPopoverOpen(element: HTMLElement): boolean {
  try {
    return element.matches(':popover-open');
  } catch {
    return false;
  }
}

/**
 * Toast 的佇列與 Viewport 管理（整個頁面只有一份，見 toastManager）。
 *
 * - Viewport 為 `<div popover="manual">`（以 Shadow DOM 套用樣式，不額外註冊元素），進入 Top Layer；
 *   新通知出現時重新提升至最上層，Modal / Alert 開啟期間透過 followTopModal 移入最上層 modal 的子樹，
 *   因為 modal dialog 以外的節點都會 inert，即使視覺上在上層也無法操作與播報。
 * - 同時顯示上限之外的通知排隊等候，有通知關閉時依序補上。
 * - 指標停在通知上或焦點位於通知內時暫停所有自動關閉（WCAG 2.2.1）。
 */
class ToastManager {
  private viewport: HTMLElement | null = null;
  private readonly entries = new Map<string, Entry>();
  private readonly order: Entry[] = [];
  private maxVisible = DEFAULT_MAX_VISIBLE;
  private durations: Record<ToastVariant, number> = { ...DEFAULT_DURATIONS };
  private hovering = false;
  /** 指標最後停留在通知上的位置，用於通知被移除後重新判斷是否仍停在通知上 */
  private lastPointer: { x: number; y: number } | null = null;
  private focused = false;
  private nextId = 0;

  configure(config: ToastConfig): void {
    if (config.maxVisible !== undefined)
      this.maxVisible = Math.max(1, Math.floor(config.maxVisible));
    if (config.durations) this.durations = { ...this.durations, ...config.durations };
    this.flush();
  }

  /** 還原預設設定（測試或重設用） */
  resetConfig(): void {
    this.maxVisible = DEFAULT_MAX_VISIBLE;
    this.durations = { ...DEFAULT_DURATIONS };
  }

  show(options: ToastOptions): ToastHandle {
    const existing = options.id ? this.entries.get(options.id) : undefined;
    if (existing && existing.state !== 'leaving') {
      this.update(existing, options);
      return existing.handle;
    }

    const id = options.id ?? `aui-toast-${++this.nextId}`;
    const element = document.createElement('aui-toast') as AuiToast;
    let resolveClosed!: () => void;
    const closed = new Promise<void>((resolve) => (resolveClosed = resolve));
    const entry: Entry = {
      id,
      element,
      timer: new PausableTimer(() => this.close(entry)),
      handle: {
        id,
        update: (next) => this.update(entry, next),
        close: () => this.close(entry),
        closed,
      },
      duration: 0,
      state: 'queued',
      resolveClosed,
    };
    this.apply(entry, { variant: 'info', ...options });
    this.entries.set(id, entry);
    this.order.push(entry);
    this.flush();
    return entry.handle;
  }

  updateById(id: string, options: Omit<ToastOptions, 'id'>): void {
    const entry = this.entries.get(id);
    if (entry && entry.state !== 'leaving') this.update(entry, options);
  }

  closeById(id: string): void {
    const entry = this.entries.get(id);
    if (entry) this.close(entry);
  }

  /** 關閉所有通知（含排隊中的），全部移除後 resolve */
  async closeAll(): Promise<void> {
    const entries = [...this.order];
    for (const entry of entries) this.close(entry);
    await Promise.all(entries.map((entry) => entry.handle.closed));
  }

  private update(entry: Entry, options: Omit<ToastOptions, 'id'>): void {
    this.apply(entry, options);
    // 內容改變需要重新閱讀的時間：重新計時
    if (entry.state === 'visible') this.startTimer(entry);
  }

  /** 套用選項；狀態改變或指定 duration 時重新決定自動關閉時間 */
  private apply(entry: Entry, options: Omit<ToastOptions, 'id'>): void {
    const { element } = entry;
    if (options.variant !== undefined) element.variant = options.variant;
    if (options.title !== undefined) element.heading = options.title;
    if (options.message !== undefined) element.message = options.message;
    if (options.noCloseButton !== undefined) element.noCloseButton = options.noCloseButton;
    if (options.duration !== undefined) entry.duration = options.duration;
    else if (options.variant !== undefined) entry.duration = this.durations[options.variant] ?? 0;
  }

  private close(entry: Entry): void {
    if (entry.state === 'leaving') return;
    entry.timer.stop();

    if (entry.state === 'queued') {
      this.finalize(entry);
      return;
    }

    entry.state = 'leaving';
    entry.element.leaving = true;
    void entry.element.updateComplete.then(() => {
      const card = entry.element.shadowRoot?.querySelector('[part="base"]');
      window.setTimeout(
        () => {
          entry.element.remove();
          this.finalize(entry);
        },
        card ? transitionTimeMs(card) : 0,
      );
    });
    // 退場中的通知不佔用顯示名額，讓排隊的通知立即補上
    this.flush();
  }

  private finalize(entry: Entry): void {
    const index = this.order.indexOf(entry);
    if (index !== -1) this.order.splice(index, 1);
    if (this.entries.get(entry.id) === entry) this.entries.delete(entry.id);
    entry.resolveClosed();

    const viewport = this.viewport;
    if (viewport && !viewport.querySelector('aui-toast')) {
      if (isPopoverOpen(viewport)) viewport.hidePopover();
    }
    // 移除位於指標下或含焦點的通知時不會觸發 pointerout / focusout，依實際狀態重新判斷
    if (viewport) {
      this.hovering = this.isPointerOverToast();
      this.focused = viewport.matches(':focus-within');
      this.syncPause();
    }
    this.flush();
  }

  /** 依同時顯示上限，把排隊中的通知依序加入 Viewport */
  private flush(): void {
    let visible = this.order.filter((entry) => entry.state === 'visible').length;
    for (const entry of this.order) {
      if (visible >= this.maxVisible) break;
      if (entry.state !== 'queued') continue;
      this.mount(entry);
      visible++;
    }
  }

  private mount(entry: Entry): void {
    const viewport = this.ensureViewport();
    entry.state = 'visible';
    viewport.appendChild(entry.element);
    if (typeof viewport.showPopover === 'function') {
      if (!isPopoverOpen(viewport)) viewport.showPopover();
      // 之後才開啟的 popover（如 Tooltip）會蓋在上面：每則新通知都重新提升到最上層
      raisePopover(viewport);
    }
    this.startTimer(entry);
  }

  private startTimer(entry: Entry): void {
    entry.timer.start(entry.duration);
    if (this.hovering || this.focused) entry.timer.pause();
  }

  /**
   * 指標是否仍停在某則通知上。:hover 要等到下一次指標移動才會更新，
   * 因此改以最後的指標位置重新命中測試（Viewport 可能位於 modal 的 Shadow DOM 內，使用其所在的 root）
   */
  private isPointerOverToast(): boolean {
    const viewport = this.viewport;
    if (!this.hovering || !viewport || !this.lastPointer) return false;
    const root = viewport.getRootNode() as Document | ShadowRoot;
    const hit = root.elementFromPoint(this.lastPointer.x, this.lastPointer.y);
    return Boolean(hit && hit !== viewport && viewport.contains(hit));
  }

  private syncPause(): void {
    const paused = this.hovering || this.focused;
    for (const entry of this.order) {
      if (entry.state !== 'visible') continue;
      if (paused) entry.timer.pause();
      else entry.timer.resume();
    }
  }

  private ensureViewport(): HTMLElement {
    if (this.viewport) {
      // 頁面被整個重建（例如 SPA 換頁清空 body）時重新放回
      if (!this.viewport.isConnected) document.body.appendChild(this.viewport);
      return this.viewport;
    }

    const viewport = document.createElement('div');
    viewport.setAttribute('popover', 'manual');
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', '通知');
    viewport.setAttribute('data-aui-toast-viewport', '');
    const root = viewport.attachShadow({ mode: 'open' });
    adoptStyles(root, [toastViewportStyles]);
    root.appendChild(document.createElement('slot'));

    viewport.addEventListener('aui-close', (event) => {
      const entry = this.order.find((item) => item.element === event.target);
      if (entry) this.close(entry);
    });
    viewport.addEventListener('pointerover', (event) => {
      this.hovering = true;
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.syncPause();
    });
    viewport.addEventListener('pointerout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (next && viewport.contains(next)) return;
      this.hovering = false;
      this.syncPause();
    });
    viewport.addEventListener('focusin', () => {
      this.focused = true;
      this.syncPause();
    });
    viewport.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (next && viewport.contains(next)) return;
      this.focused = false;
      this.syncPause();
    });

    document.body.appendChild(viewport);
    // Modal / Alert 開啟期間移入最上層 modal 的 overlay slot，保持可見、可操作且可被播報
    followTopModal(viewport, { slot: MODAL_OVERLAY_SLOT });
    this.viewport = viewport;
    return viewport;
  }
}

/** 整個頁面共用的單例：存在 globalThis[Symbol.for('anchor-ui.toast@1')]，微前端載入多份元件庫時只有一個 Viewport */
const toastManager = sharedState('toast@1', () => new ToastManager());

type VariantOptions = Omit<ToastOptions, 'variant' | 'message'>;

/**
 * Anchor UI — Toast 命令式服務（單例）
 *
 * ```ts
 * ToastService.success('複製成功');
 * const upload = ToastService.loading('上傳中…');
 * upload.update({ variant: 'success', message: '上傳完成' });
 * ToastService.error('連線逾時', { title: '上傳失敗', duration: 0 });
 * ```
 */
export const ToastService = {
  /** 顯示通知；`id` 與現有通知相同時改為更新該通知 */
  show(options: ToastOptions): ToastHandle {
    return toastManager.show(options);
  },
  success(message: string, options: VariantOptions = {}): ToastHandle {
    return toastManager.show({ ...options, message, variant: 'success' });
  },
  error(message: string, options: VariantOptions = {}): ToastHandle {
    return toastManager.show({ ...options, message, variant: 'error' });
  },
  warning(message: string, options: VariantOptions = {}): ToastHandle {
    return toastManager.show({ ...options, message, variant: 'warning' });
  },
  info(message: string, options: VariantOptions = {}): ToastHandle {
    return toastManager.show({ ...options, message, variant: 'info' });
  },
  /** 載入中通知：預設不自動關閉，完成後以 `handle.update()` 轉為 success / error */
  loading(message: string, options: VariantOptions = {}): ToastHandle {
    return toastManager.show({ ...options, message, variant: 'loading' });
  },
  /** 依識別碼更新通知 */
  update(id: string, options: Omit<ToastOptions, 'id'>): void {
    toastManager.updateById(id, options);
  },
  /** 依識別碼關閉通知 */
  close(id: string): void {
    toastManager.closeById(id);
  },
  /** 關閉所有通知（含排隊中的），全部移除後 resolve */
  closeAll(): Promise<void> {
    return toastManager.closeAll();
  },
  /** 設定同時顯示上限與各狀態預設的自動關閉時間 */
  configure(config: ToastConfig): void {
    toastManager.configure(config);
  },
  /** 還原預設設定 */
  resetConfig(): void {
    toastManager.resetConfig();
  },
};
