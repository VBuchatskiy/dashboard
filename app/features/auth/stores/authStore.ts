import { defineStore } from 'pinia'
import type { User } from '@/features/auth/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),

  getters: {
    isAuthenticated: state => !!state.user
  },

  actions: {
    setUser(user: User) {
      this.user = user
    },

    logout() {
      this.user = null
    }
  }
})
