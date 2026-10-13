/**
 * 跨元件庫副本共用的全域狀態。
 *
 * 微前端同時載入多份 Anchor UI 時，每份模組都有自己的模組層級變數。
 * 背景捲動鎖定計數、modal 堆疊這類「整個頁面只能有一份」的狀態若各自保存，
 * 就會互相覆蓋（例如 A 副本解除了 B 副本仍需要的捲動鎖定）。
 * 因此改存放在 globalThis 上，以 Symbol.for() 取得同一個 key。
 *
 * key 帶有版本號：狀態結構變更時提升版本，避免新舊副本誤用不相容的結構。
 */
export function sharedState<T extends object>(key: string, create: () => T): T {
  const symbol = Symbol.for(`anchor-ui.${key}`);
  const store = globalThis as unknown as Record<symbol, T | undefined>;
  return (store[symbol] ??= create());
}
