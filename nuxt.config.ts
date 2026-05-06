// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  components: [
    { path: '~/features/auth/ui', prefix: 'Auth' },
    { path: '~/shared/ui', prefix: 'Base' }
  ],

  imports: {
    dirs: [
      'features/auth/api',
      'features/auth/stores',
      'features/auth/composables',
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
