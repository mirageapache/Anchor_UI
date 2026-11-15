import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Storybook 9 起 controls / actions / backgrounds / viewport / interactions 等已內建於核心。
  // 目前沒有 MDX 文件或 autodocs，因此不載入 @storybook/addon-docs（需要時再加入）
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
