import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Storybook 9 起 controls / actions / backgrounds / viewport / interactions 等已內建於核心。
  // addon-docs（TASK-408）：每個元件的 Docs 頁（autodocs，見 preview.ts）與 MDX 文件頁；
  // API 表取自 custom-elements.json（pnpm analyze 由元件的 JSDoc 產生）
  addons: ['@storybook/addon-vitest', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
