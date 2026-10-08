import { expect } from '@open-wc/testing';
import type { CSSResultGroup } from 'lit';
import { AuiButton } from './button/button.js';
import { AuiIconButton } from './icon-button/icon-button.js';
import { AuiTag } from './tag/tag.js';
import { AuiTooltip } from './tooltip/tooltip.js';

/**
 * 元件樣式中的 var(--token, fallback) fallback 必須等於該 token 的淺色主題值：
 * 未載入 tokens.css 時元件才會呈現與設計一致的外觀。
 * 需先執行 pnpm build 產生 dist/tokens.css（與 a11y 測試相同）。
 */

interface VarReference {
  name: string;
  fallback: string;
}

/** 解析 CSS 中所有 var(--name, fallback)（支援 fallback 內的巢狀括號） */
function parseVarReferences(cssText: string): VarReference[] {
  const refs: VarReference[] = [];
  let index = 0;
  while ((index = cssText.indexOf('var(--', index)) !== -1) {
    const start = index + 'var('.length;
    let depth = 1;
    let comma = -1;
    let cursor = start;
    for (; cursor < cssText.length && depth > 0; cursor++) {
      const char = cssText[cursor];
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (char === ',' && depth === 1 && comma === -1) comma = cursor;
    }
    if (comma !== -1) {
      refs.push({
        name: cssText.slice(start, comma).trim(),
        fallback: cssText.slice(comma + 1, cursor - 1).trim(),
      });
    }
    index = start;
  }
  return refs;
}

function cssTextOf(styles: CSSResultGroup | undefined): string {
  const flatten = (group: CSSResultGroup | undefined): string[] =>
    Array.isArray(group) ? group.flatMap((item) => flatten(item)) : [String(group ?? '')];
  return flatten(styles)
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * 以探針元素取得瀏覽器計算後的色值，轉為 [r, g, b, a]（0–255 / 0–1）。
 * 計算結果可能是 rgb()/rgba() 或 color(srgb r g b / a)（color-mix 的序列化），兩者皆處理。
 */
function toRgba(value: string): number[] {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  const numbers = (resolved.match(/-?[\d.]+(e-?\d+)?/g) ?? []).map(Number);
  if (resolved.startsWith('color(srgb')) {
    const [r, g, b, a = 1] = numbers;
    return [r * 255, g * 255, b * 255, a];
  }
  const [r, g, b, a = 1] = numbers;
  return [r, g, b, a];
}

/** 兩個色值是否相同（容許序列化造成的捨入誤差） */
function sameColor(a: string, b: string): boolean {
  const [x, y] = [toRgba(a), toRgba(b)];
  return x.every((channel, i) => Math.abs(channel - y[i]) <= (i === 3 ? 0.01 : 1));
}

describe('Design token fallbacks', () => {
  before(async () => {
    document.documentElement.removeAttribute('data-theme');
    if (!document.getElementById('aui-tokens')) {
      const link = document.createElement('link');
      link.id = 'aui-tokens';
      link.rel = 'stylesheet';
      link.href = '/dist/tokens.css';
      document.head.appendChild(link);
      await new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    }
  });

  const components = {
    'aui-button': AuiButton,
    'aui-icon-button': AuiIconButton,
    'aui-tag': AuiTag,
    'aui-tooltip': AuiTooltip,
  };

  for (const [tagName, ctor] of Object.entries(components)) {
    it(`${tagName}: color fallbacks match the light-theme token values`, () => {
      const rootStyle = getComputedStyle(document.documentElement);
      expect(
        rootStyle.getPropertyValue('--color-brand-600').trim(),
        'tokens.css loaded',
      ).to.not.equal('');

      const mismatches: string[] = [];
      for (const { name, fallback } of parseVarReferences(cssTextOf(ctor.styles))) {
        const tokenValue = rootStyle.getPropertyValue(name).trim();
        // 元件內部變數（--aui-*）、非色彩或巢狀 var() 的 fallback 不在此檢查範圍
        if (!tokenValue || fallback.includes('var(') || !CSS.supports('color', fallback)) continue;
        if (!CSS.supports('color', tokenValue)) continue;
        if (!sameColor(fallback, tokenValue)) {
          mismatches.push(`${name}: fallback ${fallback} ≠ token ${tokenValue}`);
        }
      }
      expect(mismatches, mismatches.join('\n')).to.deep.equal([]);
    });
  }
});
