/**
 * 元件停用或忙碌中時，於捕獲階段徹底攔截點擊：阻止預設行為並中斷後續所有監聽
 * （包含使用端掛在 host 上的 click 監聽）。Button 與 IconButton 共用。
 *
 * @returns 是否已攔截
 */
export function interceptInactiveClick(event: Event, inactive: boolean): boolean {
  if (!inactive) return false;
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}
