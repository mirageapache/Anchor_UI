import type { ComplexAttributeConverter } from 'lit';

/**
 * 預設為 true 的布林屬性 converter：只有字串 "false" 視為 false（例如 `close-on-escape="false"`）。
 * 原生布林屬性只能以「有沒有屬性」表示，無法在 HTML 中關閉預設為 true 的選項，因此改用此慣例。
 */
export const defaultTrue: ComplexAttributeConverter<boolean> = {
  fromAttribute: (value: string | null) => value !== 'false',
  toAttribute: (value: boolean) => (value ? null : 'false'),
};
