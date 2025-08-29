import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['tests/setup/env.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
    include: ['**/*.{test,spec}.ts?(x)'],
    exclude: ['node_modules', 'dist', '.next']
  }
});

