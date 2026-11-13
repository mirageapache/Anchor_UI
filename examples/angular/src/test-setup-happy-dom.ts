/**
 * happy-dom + zone.js 相容性修正（須在 zone.js 之前載入）。
 *
 * zone.js 以 `for...in` 列舉原生 MutationObserver 實例的方法來包裝它；瀏覽器依 WebIDL 定義的方法可列舉，
 * 但 happy-dom 以一般 JS class 實作（方法位於父類別 MutationObserverImplementation 上且不可列舉），
 * 包裝後會缺少 observe / disconnect，導致使用 MutationObserver 的元件（如 <aui-field>）在測試中拋錯。
 * 真實瀏覽器不受影響。
 */
for (
  let prototype = MutationObserver.prototype;
  prototype && prototype !== Object.prototype;
  prototype = Object.getPrototypeOf(prototype)
) {
  for (const key of Object.getOwnPropertyNames(prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    if (key === 'constructor' || !descriptor || descriptor.enumerable) continue;
    Object.defineProperty(prototype, key, { ...descriptor, enumerable: true });
  }
}
