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
    backgrounds: {
      default: 'theme-adaptive',
      values: [
        {
          name: 'theme-adaptive',
          value: 'var(--color-bg)',
        },
      ],
    },
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
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
      return story();
    },
  ],
};

export default preview;
