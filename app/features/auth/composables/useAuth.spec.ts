import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/features/auth/stores/authStore'
import { useAuth } from '~/features/auth/composables/useAuth'

vi.mock('~/features/auth/api/authApi', () => ({
  loginRequest: vi.fn().mockResolvedValue({
    user: { id: 1, email: 'admin@example.com' }
  }),
  registerRequest: vi.fn().mockResolvedValue({
    user: { id: 2, email: 'new@example.com' }
  }),
  logoutRequest: vi.fn().mockResolvedValue({ ok: true })
}))

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('login()', () => {
    it('calls setUser after successful loginRequest', async () => {
      const store = useAuthStore()
      const { login } = useAuth()

      await login('admin@example.com', 'secret')

      expect(store.user).toEqual({ id: 1, email: 'admin@example.com' })
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('register()', () => {
    it('calls setUser after successful registerRequest', async () => {
      const store = useAuthStore()
      const { register } = useAuth()

      await register('new@example.com', 'password12')

      expect(store.user).toEqual({ id: 2, email: 'new@example.com' })
      expect(store.isAuthenticated).toBe(true)
    })
  })
})
