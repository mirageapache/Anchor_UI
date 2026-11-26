import { expect } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import { getTheme, setTheme, toggleTheme } from './theme.js';

describe('theme', () => {
  const html = document.documentElement;

  afterEach(() => {
    html.removeAttribute('data-theme');
    html.classList.remove('theme-transitioning');
  });

  it('switches between light and dark via <html data-theme>', () => {
    setTheme('dark');
    expect(html.getAttribute('data-theme')).to.equal('dark');
    expect(getTheme()).to.equal('dark');

    setTheme('light');
    expect(html.hasAttribute('data-theme')).to.be.false;
    expect(getTheme()).to.equal('light');
  });

  it('applies the transition class briefly by default', async () => {
    setTheme('dark');
    expect(html.classList.contains('theme-transitioning')).to.be.true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(html.classList.contains('theme-transitioning')).to.be.false;
  });

  it('keeps the transition class for the full duration after the last of several rapid toggles', async () => {
    setTheme('dark');
    await new Promise((resolve) => setTimeout(resolve, 150));
    setTheme('light');
    // 第一次切換的計時器（t=250）不可在第二次轉場進行到一半時移除 class
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(html.classList.contains('theme-transitioning'), 'at t=300').to.be.true;
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(html.classList.contains('theme-transitioning'), 'at t=450').to.be.false;
  });

  it('skips the transition class when transition is false', () => {
    setTheme('dark', { transition: false });
    expect(getTheme()).to.equal('dark');
    expect(html.classList.contains('theme-transitioning')).to.be.false;
  });

  it('toggles and returns the new theme', () => {
    expect(toggleTheme()).to.equal('dark');
    expect(toggleTheme()).to.equal('light');
    expect(getTheme()).to.equal('light');
  });

  describe('transition styles (dist/styles.css; run pnpm build first)', () => {
    let link: HTMLLinkElement;

    before(async () => {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/dist/styles.css';
      document.head.appendChild(link);
      await new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    });

    after(async () => {
      link.remove();
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    it('limits the transition to colour properties, and to 0.01ms under reduced motion', async () => {
      const probe = document.createElement('div');
      document.body.appendChild(probe);
      try {
        await emulateMedia({ reducedMotion: 'no-preference' });
        setTheme('dark');
        const animated = getComputedStyle(probe);
        expect(animated.transitionProperty).to.equal(
          'background-color, color, border-color, box-shadow',
        );
        expect(parseFloat(animated.transitionDuration)).to.be.above(0.1);

        await emulateMedia({ reducedMotion: 'reduce' });
        const reduced = getComputedStyle(probe);
        // 屬性清單不變（否則版面變更也會變成轉場），只有時長被壓到 0.01ms
        expect(reduced.transitionProperty).to.equal(
          'background-color, color, border-color, box-shadow',
        );
        const durations = reduced.transitionDuration.split(',').map((value) => parseFloat(value));
        expect(Math.max(...durations)).to.be.below(0.001);
      } finally {
        probe.remove();
      }
    });
  });
});
