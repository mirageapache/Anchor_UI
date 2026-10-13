import { sharedState } from './shared-state.js';

/**
 * 背景捲動鎖定（Modal、Alert、Drawer 共用）。
 *
 * - **巢狀計數**：Modal 中再開 Alert 時，Alert 關閉不可解除 Modal 的鎖定；計數歸零才真正解除。
 * - **捲軸補償**：`overflow: hidden` 會讓捲軸消失、內容往右跳動，因此補上原本捲軸的寬度。
 * - **還原原狀**：解除時還原鎖定前 `<html>` 上的 inline 樣式。
 *
 * 詳見 note/05-overlay-foundation.md。
 */

interface ScrollLockState {
  count: number;
  saved: { overflow: string; paddingRight: string } | null;
}

const state = sharedState<ScrollLockState>('scroll-lock@1', () => ({ count: 0, saved: null }));

/**
 * 鎖定背景捲動，回傳解除函式。
 * 解除函式可安全地重複呼叫（只會扣一次計數）。
 */
export function lockScroll(): () => void {
  const html = document.documentElement;

  if (state.count === 0) {
    // 須在隱藏捲軸前量測捲軸寬度
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    // 頁面已用 scrollbar-gutter: stable 保留捲軸空間時，overflow: hidden 後空間仍在，不可再補 padding
    const gutterReserved = getComputedStyle(html).scrollbarGutter.includes('stable');
    state.saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    if (scrollbarWidth > 0 && !gutterReserved) {
      const paddingRight = parseFloat(getComputedStyle(html).paddingRight) || 0;
      html.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }
    html.style.overflow = 'hidden';
  }
  state.count++;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count = Math.max(0, state.count - 1);
    if (state.count === 0 && state.saved) {
      html.style.overflow = state.saved.overflow;
      html.style.paddingRight = state.saved.paddingRight;
      state.saved = null;
    }
  };
}

/** 目前是否有任何浮層鎖定背景捲動 */
export function isScrollLocked(): boolean {
  return state.count > 0;
}
