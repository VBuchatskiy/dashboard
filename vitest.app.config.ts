import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineVitestConfig({
  test: {
    name: 'app',
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: root
      }
    },
    globals: true,
    include: ['app/**/*.spec.ts']
  }
})
