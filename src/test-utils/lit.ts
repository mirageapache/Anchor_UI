import type { LitElement, PropertyValues } from 'lit';

/**
 * 記錄元素在 updated() 之後是否又排了一次更新（Lit 開發模式的 change-in-update 警告條件）。
 * Lit 對同一則警告整頁只印一次，無法用 console.warn 逐案驗證，因此直接檢查同樣的條件。
 * 回傳的陣列在每次發生時加入當次變更的屬性名稱。
 */
export function trackChangeInUpdate(el: LitElement): string[] {
  const hits: string[] = [];
  const target = el as unknown as {
    updated(changed: PropertyValues): void;
    isUpdatePending: boolean;
  };
  const original = target.updated.bind(target);
  target.updated = (changed) => {
    original(changed);
    if (target.isUpdatePending) hits.push([...changed.keys()].map(String).join(', '));
  };
  return hits;
}
