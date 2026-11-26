import { AlertOptions, ConfirmOptions, PromptOptions } from './alert.types.js';
/**
 * Anchor UI — Alert 命令式服務
 *
 * ```ts
 * await AlertService.alert('已儲存');
 * if (await AlertService.confirm({ title: '確定刪除？', destructive: true })) { ... }
 * const name = await AlertService.prompt({ title: '重新命名', defaultValue: 'draft' });
 * ```
 *
 * 只能在瀏覽器端使用：伺服器端渲染時回傳的 Promise 會以錯誤 reject（沒有人能回應對話框）。
 */
export declare const AlertService: {
    /**
     * 顯示提示，關閉後 resolve（不論以確定、ESC 或遮罩關閉）
     */
    alert(options: string | AlertOptions): Promise<void>;
    /**
     * 顯示確認對話框：確定為 true；取消、ESC 或點擊遮罩為 false
     */
    confirm(options: string | ConfirmOptions): Promise<boolean>;
    /**
     * 顯示輸入對話框：確定時為輸入值（可能為空字串）；取消為 null
     */
    prompt(options: string | PromptOptions): Promise<string | null>;
};
//# sourceMappingURL=alert-service.d.ts.map