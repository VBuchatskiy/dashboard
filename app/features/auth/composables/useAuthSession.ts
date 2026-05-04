import type { User } from '~/features/auth/types'

/** Загружает пользователя по httpOnly cookie (SSR и клиент). */
export async function fetchSessionUser(): Promise<User | null> {
  try {
    return await useRequestFetch()<User>('/api/me')
  } catch {
    return null
  }
}
