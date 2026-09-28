import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'storybook-static/**', '**/*.d.ts', '*.config.*'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: {
      lit: litPlugin,
    },
    rules: {
      ...litPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
);
