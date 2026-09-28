import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'AnchorUI',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [/^lit/],
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.names?.some((n) => n.endsWith('.css')) ||
            assetInfo.name?.endsWith('.css')
          ) {
            return 'styles.css';
          }
          return '[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
