import { fileURLToPath } from 'node:url'

const appDir = fileURLToPath(new URL('./app', import.meta.url))
const serverDir = fileURLToPath(new URL('./server', import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    binanceRestUrl:
      process.env.BINANCE_REST_URL?.trim() || 'https://api.binance.com'
  },

  alias: {
    '#app': appDir,
    '#server': serverDir
  },

  nitro: {
    alias: {
      '~': serverDir,
      '@': appDir
    }
  },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vee-validate/nuxt'],

  'vee-validate': {
    typedSchemaPackage: 'valibot',
    autoImports: true
  },

  components: [
    { path: '@/features/auth/ui', prefix: 'Auth' },
    { path: '@/shared/ui', prefix: 'Base' }
  ],

  imports: {
    dirs: [
      'features/auth/api',
      'features/auth/stores',
      'features/auth/composables',
      'features/market/api',
      'features/market/composables',
      'shared/lib',
      'shared/composables'
    ]
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['vitest/globals']
      }
    }
  }
})
