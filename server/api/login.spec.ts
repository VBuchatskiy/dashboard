// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import type { LoginResponse } from '../../app/features/auth/types'

describe('POST /api/login', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../..', import.meta.url))
  })

  it('sets httpOnly cookie and returns user', async () => {
    const res = await $fetch.raw('/api/login', {
      method: 'POST',
      body: { email: 'admin@example.com', password: 'secret' }
    })

    const body = res._data as LoginResponse
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
