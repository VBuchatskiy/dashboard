import type { User } from '@/features/auth/types'
import { getUserForSessionToken } from '~/utils/userRepository'

/** Cookie name for session token (httpOnly). */
export const AUTH_COOKIE_NAME = 'auth_token'

export function userFromSessionToken(token: string | undefined): User | null {
  return getUserForSessionToken(token)
}

export function cookieAuthOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  }
}
