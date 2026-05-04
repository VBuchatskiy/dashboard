import { defineVitestConfig } from '@nuxt/test-utils/config'
import { resolve } from 'node:path'

export default defineVitestConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app')
    }
  },
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: '.'
      }
    },
    globals: true,
    include: ['app/**/*.spec.ts', 'server/**/*.spec.ts'],
  }
})
