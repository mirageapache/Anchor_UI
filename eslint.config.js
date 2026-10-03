import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';

export default tseslint.config(
  {
    // Ignore build output, generated files, and Storybook static output.
    // Config files (vite.config.ts, eslint.config.js, etc.) are intentionally NOT excluded
    // so their TypeScript errors are surfaced during linting.
    ignores: ['dist/**', 'node_modules/**', 'storybook-static/**', 'coverage/**', '**/*.d.ts'],
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
      // L-05: Align with tsconfig's noUnusedLocals / noUnusedParameters for consistent IDE feedback.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Chai-based testing uses property expressions like expect(x).to.be.true
    files: ['src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
);
