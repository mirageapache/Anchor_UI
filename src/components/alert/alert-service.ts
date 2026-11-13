import type { AuiAlert } from './alert.js';
import type {
  AlertConfirmDetail,
  AlertMode,
  AlertOptions,
  ConfirmOptions,
  PromptOptions,
} from './alert.types.js';
import './alert.js';

type Result = { confirmed: boolean; value: string };

/** 字串視為訊息內容 */
const normalize = <T extends AlertOptions>(options: string | T): T =>
  (typeof options === 'string' ? { message: options } : options) as T;

/**
 * 建立一次性的 <aui-alert>，開啟並等待使用者回應；關閉後自動移除。
 * 加在 <body> 上即可：showModal() 的 dialog 不論位於何處都會成為最上層，
 * 因此也能在已開啟的 Modal 之上再開啟。
 */
function open(mode: AlertMode, options: PromptOptions): Promise<Result> {
  const alert = document.createElement('aui-alert') as AuiAlert;
  alert.mode = mode;
  alert.heading = options.title ?? '';
  alert.message = options.message ?? '';
  if (options.icon) alert.icon = options.icon;
  if (options.confirmText) alert.confirmText = options.confirmText;
  if (options.cancelText) alert.cancelText = options.cancelText;
  alert.destructive = options.destructive ?? false;
  alert.closeOnBackdrop = options.closeOnBackdrop ?? true;
  alert.inputValue = options.defaultValue ?? '';
  alert.inputPlaceholder = options.placeholder ?? '';
  alert.inputLabel = options.inputLabel ?? '';
  alert.timer = options.timer ?? 0;

  return new Promise<Result>((resolve) => {
    const settle = (result: Result) => {
      alert.remove();
      resolve(result);
    };
    alert.addEventListener('aui-confirm', (event) => {
      settle({ confirmed: true, value: (event as CustomEvent<AlertConfirmDetail>).detail.value });
    });
    alert.addEventListener('aui-cancel', () => settle({ confirmed: false, value: '' }));

    document.body.appendChild(alert);
    alert.open = true;
    // aui-show 被取消時不會開啟，視同取消
    void alert.updateComplete.then(async () => {
      await alert.updateComplete;
      if (!alert.open && alert.isConnected) settle({ confirmed: false, value: '' });
    });
  });
}

/**
 * Anchor UI — Alert 命令式服務
 *
 * ```ts
 * await AlertService.alert('已儲存');
 * if (await AlertService.confirm({ title: '確定刪除？', destructive: true })) { ... }
 * const name = await AlertService.prompt({ title: '重新命名', defaultValue: 'draft' });
 * ```
 */
export const AlertService = {
  /**
   * 顯示提示，關閉後 resolve（不論以確定、ESC 或遮罩關閉）
   */
  async alert(options: string | AlertOptions): Promise<void> {
    await open('alert', normalize(options));
  },

  /**
   * 顯示確認對話框：確定為 true；取消、ESC 或點擊遮罩為 false
   */
  async confirm(options: string | ConfirmOptions): Promise<boolean> {
    return (await open('confirm', normalize(options))).confirmed;
  },

  /**
   * 顯示輸入對話框：確定時為輸入值（可能為空字串）；取消為 null
   */
  async prompt(options: string | PromptOptions): Promise<string | null> {
    const result = await open('prompt', normalize(options));
    return result.confirmed ? result.value : null;
  },
};
