export const useAuth = () => {
  const store = useAuthStore()

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password)
    store.setUser(data.user)
  }

  const register = async (email: string, password: string) => {
    const data = await registerRequest(email, password)
    store.setUser(data.user)
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch {
      console.error('Failed to logout')
    } finally {
      store.logout()
      await navigateTo('/login')
    }
  }

  return { login, register, logout }
}
