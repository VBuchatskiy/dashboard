import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['./vitest.app.config.ts', './vitest.server.config.ts']
  }
})
