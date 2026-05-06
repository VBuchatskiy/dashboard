import type { User } from '@/features/auth/types'

export async function fetchSessionUser(): Promise<User | null> {
  try {
    return await useRequestFetch()<User>('/api/auth/me')
  } catch {
    return null;
  }
}
