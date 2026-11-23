/** 連結可使用的協定；相對路徑、`#錨點` 與 `?查詢` 視為 http(s) */
const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/** 只用來判斷協定的基準網址：相對路徑據此解析為 http:，不必依賴 `document` */
const BASE = 'http://anchor-ui.invalid/';

/**
 * 過濾連結網址：協定在允許清單內（或為相對路徑）時原樣回傳，否則回傳 `undefined`。
 *
 * 連結的 `href` 可能來自使用端無法完全信任的資料（CMS、API 回傳的選單）；`javascript:` 等協定
 * 一經點擊就會在頁面中執行，Lit 的屬性綁定不會過濾。以 `new URL()` 解析後比對協定，
 * 大小寫、前後空白與夾雜的控制字元（`java\tscript:`）都由瀏覽器的解析規則統一處理。
 *
 * 搭配 `ifDefined()` 使用：不安全的網址不輸出 `href`，元素成為沒有連結的文字。
 */
export function safeHref(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  try {
    return SAFE_LINK_PROTOCOLS.has(new URL(value, BASE).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}
