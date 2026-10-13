import { expect } from '@open-wc/testing';
import { isScrollLocked, lockScroll } from './scroll-lock.js';

describe('internal/scroll-lock', () => {
  const html = document.documentElement;
  let spacer: HTMLDivElement;
  let classicScrollbar: HTMLStyleElement;

  beforeEach(() => {
    // 讓頁面可捲動，才會出現捲軸
    spacer = document.createElement('div');
    spacer.style.height = '3000px';
    document.body.appendChild(spacer);
    // headless Chromium 預設為不佔版面的 overlay 捲軸；強制使用佔 17px 的傳統捲軸，捲軸補償才測得出來
    classicScrollbar = document.createElement('style');
    classicScrollbar.textContent = 'html::-webkit-scrollbar { width: 17px; }';
    document.head.appendChild(classicScrollbar);
  });

  afterEach(() => {
    spacer.remove();
    classicScrollbar.remove();
    html.removeAttribute('style');
  });

  it('locks background scrolling and restores it on release', () => {
    expect(isScrollLocked()).to.be.false;
    const release = lockScroll();
    expect(isScrollLocked()).to.be.true;
    expect(getComputedStyle(html).overflow).to.equal('hidden');

    release();
    expect(isScrollLocked()).to.be.false;
    expect(getComputedStyle(html).overflow).to.not.equal('hidden');
  });

  it('keeps the lock until every nested lock is released', () => {
    const releaseModal = lockScroll();
    const releaseAlert = lockScroll();

    releaseAlert();
    expect(isScrollLocked(), 'modal is still open').to.be.true;
    expect(getComputedStyle(html).overflow).to.equal('hidden');

    releaseModal();
    expect(isScrollLocked()).to.be.false;
  });

  it('ignores repeated calls to the same release function', () => {
    const releaseModal = lockScroll();
    const releaseAlert = lockScroll();

    releaseAlert();
    releaseAlert(); // 重複呼叫不可多扣計數，否則會把 Modal 的鎖一起解除
    expect(isScrollLocked()).to.be.true;

    releaseModal();
    expect(isScrollLocked()).to.be.false;
  });

  it('compensates for the scrollbar width to avoid layout shift', () => {
    // 前提：捲軸確實佔用版面寬度，否則此測試沒有意義
    expect(window.innerWidth - html.clientWidth, 'scrollbar width').to.equal(17);
    const widthBefore = document.body.getBoundingClientRect().width;
    const release = lockScroll();
    expect(document.body.getBoundingClientRect().width).to.equal(widthBefore);
    release();
    expect(document.body.getBoundingClientRect().width).to.equal(widthBefore);
  });

  it('restores the inline styles that were present before locking', () => {
    html.style.overflow = 'clip';
    html.style.paddingRight = '3px';

    const release = lockScroll();
    release();

    expect(html.style.overflow).to.equal('clip');
    expect(html.style.paddingRight).to.equal('3px');
  });
});
