import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import type { LoginResponse } from '~/features/auth/types'

describe('POST /api/register', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../..', import.meta.url))
  })

  it('sets httpOnly cookie and returns user', async () => {
    const email = `new-${Date.now()}@example.com`
    const res = await $fetch.raw('/api/register', {
      method: 'POST',
      body: { email, password: 'password12' }
    })

    const body = res._data as LoginResponse
    expect(body.user.email).toBe(email.toLowerCase())
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toContain('auth_token=')
    expect(cookie.toLowerCase()).toContain('httponly')
  })

  it('409 if email is already taken', async () => {
    const email = `dup-${Date.now()}@example.com`
    await $fetch('/api/register', {
      method: 'POST',
      body: { email, password: 'password12' }
    })
    await expect(
      $fetch('/api/register', {
        method: 'POST',
        body: { email, password: 'password12' }
      })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('400 if password is less than 8 characters', async () => {
    await expect(
      $fetch('/api/register', {
        method: 'POST',
        body: { email: `short-${Date.now()}@example.com`, password: 'short' }
      })
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
