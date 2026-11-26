import { ToastConfig, ToastHandle, ToastOptions } from './toast.types.js';
type VariantOptions = Omit<ToastOptions, 'variant' | 'message'>;
/**
 * Anchor UI — Toast 命令式服務（單例）
 *
 * ```ts
 * ToastService.success('複製成功');
 * const upload = ToastService.loading('上傳中…');
 * upload.update({ variant: 'success', message: '上傳完成' });
 * ToastService.error('連線逾時', { title: '上傳失敗', duration: 0 });
 * ToastService.configure({ placement: 'top-center' }); // 位置：六選一，預設 bottom-right
 * ```
 *
 * 伺服器端渲染時不顯示通知，`show()` 等方法回傳不作用的控制器（`closed` 立即 resolve）。
 */
export declare const ToastService: {
    /** 顯示通知；`id` 與現有通知相同時改為更新該通知 */
    show(options: ToastOptions): ToastHandle;
    success(message: string, options?: VariantOptions): ToastHandle;
    error(message: string, options?: VariantOptions): ToastHandle;
    warning(message: string, options?: VariantOptions): ToastHandle;
    info(message: string, options?: VariantOptions): ToastHandle;
    /** 載入中通知：預設不自動關閉，完成後以 `handle.update()` 轉為 success / error */
    loading(message: string, options?: VariantOptions): ToastHandle;
    /** 依識別碼更新通知 */
    update(id: string, options: Omit<ToastOptions, "id">): void;
    /** 依識別碼關閉通知 */
    close(id: string): void;
    /** 關閉所有通知（含排隊中的），全部移除後 resolve */
    closeAll(): Promise<void>;
    /** 設定通知的位置、同時顯示上限、排隊上限與各狀態預設的自動關閉時間 */
    configure(config: ToastConfig): void;
    /** 還原預設設定 */
    resetConfig(): void;
};
export {};
//# sourceMappingURL=toast-service.d.ts.map