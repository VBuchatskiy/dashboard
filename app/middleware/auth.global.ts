const PUBLIC_PATHS = ['/login', '/register']

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    const user = await fetchSessionUser()
    if (user) authStore.setUser(user)
  }

  const authed = authStore.isAuthenticated

  if (!authed && !PUBLIC_PATHS.includes(to.path)) {
    return navigateTo('/login')
  }

  if (authed && PUBLIC_PATHS.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})
