export const useAuth = () => {
  const store = useAuthStore()

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password)
    store.setUser(data.user)
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } catch {
      // сеть / сервер — всё равно чистим локальное состояние
    } finally {
      store.logout()
      await navigateTo('/login')
    }
  }

  return { login, logout }
}
