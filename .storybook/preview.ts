import type { Preview } from '@storybook/web-components';
import '../src/styles.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Fix M-02: Storybook's backgrounds addon cannot resolve CSS custom properties.
    // Theme background is driven by the decorator below via data-theme attribute,
    // so we disable the built-in backgrounds panel to avoid confusion.
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Anchor UI Visual Theme Switcher',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light Mode (Slate-50)' },
          { value: 'dark', icon: 'moon', title: 'Dark Mode (Slate-900)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        // Apply theme-transitioning class for smooth switch (H-03)
        html.classList.add('theme-transitioning');
        if (theme === 'dark') {
          html.setAttribute('data-theme', 'dark');
        } else {
          html.removeAttribute('data-theme');
        }
        setTimeout(() => html.classList.remove('theme-transitioning'), 250);
      }
      return story();
    },
  ],
};

export default preview;
