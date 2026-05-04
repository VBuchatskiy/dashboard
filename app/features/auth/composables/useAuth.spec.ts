import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/features/auth/stores/authStore'
import { useAuth } from '~/features/auth/composables/useAuth'

vi.mock('~/features/auth/api/authApi', () => ({
  loginRequest: vi.fn().mockResolvedValue({
    user: { id: 1, email: 'admin@example.com' }
  }),
  logoutRequest: vi.fn().mockResolvedValue({ ok: true })
}))

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('login()', () => {
    it('вызывает setUser после успешного loginRequest', async () => {
      const store = useAuthStore()
      const { login } = useAuth()

      await login('admin@example.com', 'secret')

      expect(store.user).toEqual({ id: 1, email: 'admin@example.com' })
      expect(store.isAuthenticated).toBe(true)
    })
  })
})
