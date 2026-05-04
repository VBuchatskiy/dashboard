import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/features/auth/stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('начальное состояние пустое', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('setUser сохраняет пользователя', () => {
    const store = useAuthStore()
    store.setUser({ id: 1, email: 'admin@example.com' })
    expect(store.user).toEqual({ id: 1, email: 'admin@example.com' })
    expect(store.isAuthenticated).toBe(true)
  })

  it('logout сбрасывает состояние', () => {
    const store = useAuthStore()
    store.setUser({ id: 1, email: 'admin@example.com' })
    store.logout()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
