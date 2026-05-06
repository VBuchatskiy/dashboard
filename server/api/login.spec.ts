// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import type { LoginResponse } from '@/features/auth/types'

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url))
})

describe('POST /api/login', () => {
  it('sets httpOnly cookie and returns user', async () => {
    const res = await fetch(url('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'secret' })
    })

    const body = (await res.json()) as LoginResponse
    expect(body.user.email).toBe('admin@example.com')
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toContain('auth_token=')
    expect(cookie.toLowerCase()).toContain('httponly')
  })

  it('401 on invalid password', async () => {
    await expect(
      $fetch('/api/login', {
        method: 'POST',
        body: { email: 'admin@example.com', password: 'wrong' }
      })
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('401 on invalid email', async () => {
    await expect(
      $fetch('/api/login', {
        method: 'POST',
        body: { email: 'other@example.com', password: 'secret' }
      })
    ).rejects.toMatchObject({ statusCode: 401 })
  })
})
