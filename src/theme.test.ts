import { expect } from '@open-wc/testing';
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
});
