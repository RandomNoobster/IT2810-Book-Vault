import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/bookvault',
    defaultCommandTimeout: 14000,
  },
});
