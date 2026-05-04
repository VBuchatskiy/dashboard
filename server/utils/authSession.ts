import type { User } from '~/features/auth/types'

/** Cookie name for session token (httpOnly). */
export const AUTH_COOKIE_NAME = 'auth_token'

/** Demo token — заменить на JWT при продакшене. */
export const DEMO_SESSION_TOKEN = 'hardcoded-token-replace-later'

export function userFromSessionToken(token: string | undefined): User | null {
  if (!token || token !== DEMO_SESSION_TOKEN) return null
  return { id: 1, email: 'admin@example.com' }
}
