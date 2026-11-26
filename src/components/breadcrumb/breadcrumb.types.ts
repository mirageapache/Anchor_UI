/**
 * Anchor UI — Breadcrumb Types
 */

/** 麵包屑的一層 */
export interface BreadcrumbItem {
  /** 顯示文字 */
  label: string;
  /**
   * 連結網址；只接受 http(s)、`mailto:`、`tel:` 與相對路徑，其他協定（如 `javascript:`）視為沒有連結。
   * 最後一層（目前頁面）可省略
   */
  href?: string;
}
