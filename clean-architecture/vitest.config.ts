import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable global APIs — no need to import describe/it/expect
    globals: true,

    // Backend project — no DOM
    environment: 'node',

    // Where your test files live
    include: ['src/tests/**/*.test.ts'],

    // Clean state between tests
    clearMocks: true,
    restoreMocks: true,

    // Coverage (opt-in via --coverage flag)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/tests/**', 'src/index.ts'],
    },
  },
});
