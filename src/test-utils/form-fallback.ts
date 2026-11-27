/**
 * 模擬不支援 ElementInternals 表單參與的測試環境，讓表單元件的退回方案（隱藏 input、以 DOM 查找表單擁有者）
 * 在真實瀏覽器中也能測試：
 *
 * - happy-dom：沒有 `attachInternals`。
 * - jsdom（28 ~ 31）：有 `attachInternals`，但回傳的 ElementInternals 只有 `shadowRoot`、`labels`、`role` 與
 *   `aria*` 屬性，沒有 `setFormValue`、`setValidity`、`form`、`validity`。
 */
export interface FormFallbackEnvironment {
  name: string;
  attachInternals: ((this: HTMLElement) => unknown) | undefined;
}

export const FORM_FALLBACK_ENVIRONMENTS: readonly FormFallbackEnvironment[] = [
  { name: 'without attachInternals (e.g. happy-dom)', attachInternals: undefined },
  {
    name: 'with ARIA-only ElementInternals (e.g. jsdom)',
    attachInternals() {
      return { shadowRoot: this.shadowRoot, labels: [], role: null, ariaLabel: null };
    },
  },
];

/** 以指定環境的 `attachInternals` 取代瀏覽器的實作，回傳還原函式（只影響之後建立的元素） */
export function emulateFormFallback(environment: FormFallbackEnvironment): () => void {
  const proto = HTMLElement.prototype as { attachInternals?: unknown };
  const original = proto.attachInternals;
  proto.attachInternals = environment.attachInternals;
  return () => {
    proto.attachInternals = original;
  };
}
