/**
 * Anchor UI — Header Types
 */
/**
 * 主標題的標題層級（對應 `<h1>` ~ `<h6>`）。
 * 公開型別不可引用 src/internal（其型別不隨套件發布），因此在此獨立定義。
 */
export type HeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** `aui-favorite-change` 事件資料 */
export interface HeaderFavoriteChangeDetail {
    /** 切換後是否為已收藏 */
    favorite: boolean;
}
//# sourceMappingURL=header.types.d.ts.map