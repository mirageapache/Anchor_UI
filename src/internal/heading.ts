import { html, type TemplateResult } from 'lit';

/** 標題層級：對應 `<h1>` ~ `<h6>` */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** 將任意輸入正規化為合法的標題層級（非 1–6 的值退回 fallback） */
export function normalizeHeadingLevel(value: unknown, fallback: HeadingLevel): HeadingLevel {
  const level = Number(value);
  return Number.isInteger(level) && level >= 1 && level <= 6 ? (level as HeadingLevel) : fallback;
}

/**
 * 依層級渲染原生標題元素（h1–h6）。
 * Lit 的 html 範本無法動態切換標籤名稱，且原生標題比 role="heading" + aria-level 有更好的相容性，
 * 因此逐一列出六種範本。
 */
export function renderHeading(
  level: HeadingLevel,
  attrs: { className: string; part: string; id: string },
  content: unknown,
): TemplateResult {
  const { className, part, id } = attrs;
  switch (level) {
    case 1:
      return html`<h1 class=${className} part=${part} id=${id}>${content}</h1>`;
    case 2:
      return html`<h2 class=${className} part=${part} id=${id}>${content}</h2>`;
    case 3:
      return html`<h3 class=${className} part=${part} id=${id}>${content}</h3>`;
    case 4:
      return html`<h4 class=${className} part=${part} id=${id}>${content}</h4>`;
    case 5:
      return html`<h5 class=${className} part=${part} id=${id}>${content}</h5>`;
    default:
      return html`<h6 class=${className} part=${part} id=${id}>${content}</h6>`;
  }
}
