import type { LoginResponse, RegisterResponse } from '@/features/auth/types'

export const loginRequest = (email: string, password: string) => {
  const { $api } = useNuxtApp()
  return $api<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  })
}

export const registerRequest = (email: string, password: string) => {
  const { $api } = useNuxtApp()
  return $api<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: { email, password }
  })
}

export const logoutRequest = () => {
  const { $api } = useNuxtApp()
  return $api('/api/auth/logout', {
    method: 'POST'
  })
}
