/**
 * 元素 CSS transition 的最長「時長 + 延遲」（毫秒）。
 *
 * 浮層（Tooltip、Modal）在退場動畫結束後才真正關閉；時長取自實際的 computed style，
 * 由 `--transition-*` token 或 `prefers-reduced-motion` 決定，避免在程式中寫死動畫時間。
 */
export function transitionTimeMs(element: Element): number {
  const style = getComputedStyle(element);
  const toMs = (value: string): number => {
    const amount = parseFloat(value);
    if (Number.isNaN(amount)) return 0;
    return value.trim().endsWith('ms') ? amount : amount * 1000;
  };
  const durations = style.transitionDuration.split(',').map(toMs);
  const delays = style.transitionDelay.split(',').map(toMs);
  return Math.max(0, ...durations.map((duration, i) => duration + delays[i % delays.length]));
}
