export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const api = $fetch.create({
    credentials: 'include',
    async onResponseError({ response }) {
      if (response.status === 401) {
        try {
          await $fetch('/api/logout', { method: 'POST', credentials: 'include' })
        } catch {
          console.error('Failed to logout')
        }
        authStore.logout()
        await navigateTo('/login')
      }
    }
  })

  return {
    provide: { api }
  }
})
