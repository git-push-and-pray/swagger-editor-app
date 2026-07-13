import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      'next/navigation': `${__dirname}node_modules/next/navigation.js`,
      'next/server': `${__dirname}node_modules/next/server.js`,
    },
  },
  test: {
    exclude: ['node_modules', '.next', 'out', 'dist'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup-tests.ts',
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/**/*.test.{js,jsx,ts,tsx}', 'src/__tests__/*', 'src/**/*.d.ts'],
      thresholds: {
        global: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
