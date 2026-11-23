import { setCustomElementsManifest, type Preview } from '@storybook/web-components-vite';
import '../src/styles.scss';

// TASK-408：Docs 頁的 API 表（屬性、事件、slot、CSS part）取自 Custom Elements Manifest。
// custom-elements.json 是 pnpm analyze 產生的檔案（不提交），以 glob 載入：檔案不存在時（例如只跑 typecheck）
// 不會讓模組解析失敗，Docs 頁只是沒有 API 表。pnpm storybook / build-storybook / test:storybook 皆會先產生。
const manifests = import.meta.glob<{ default: object }>('../custom-elements.json', { eager: true });
const manifest = Object.values(manifests)[0]?.default;
if (manifest) setCustomElementsManifest(manifest);

const preview: Preview = {
  // 每個元件的 stories 檔都產生 Docs 頁（非元件的 Scenarios、Design Tokens 以 '!autodocs' 排除）
  tags: ['autodocs'],
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
    options: {
      storySort: { order: ['快速開始', 'Components', 'Design Tokens', 'Scenarios'] },
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
