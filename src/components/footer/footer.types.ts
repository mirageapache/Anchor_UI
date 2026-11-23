/**
 * Anchor UI — Footer Types
 */

/**
 * 頁尾連結
 */
export interface FooterLink {
  /** 連結文字 */
  label: string;
  /** 連結網址 */
  href: string;
  /** 是否為外部連結：另開新視窗（`target="_blank"`、`rel="noopener noreferrer"`），並告知輔助科技 */
  external?: boolean;
}

/**
 * 多欄版型的一欄：標題與連結清單
 */
export interface FooterColumn {
  /** 欄位標題 */
  heading: string;
  /** 連結清單 */
  links: FooterLink[];
}

/**
 * 欄位標題的層級（1–6）。
 * 公開型別不可引用 src/internal（其型別不隨套件發布），因此在此獨立定義
 */
export type FooterHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
