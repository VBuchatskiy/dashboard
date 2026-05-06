// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import type { LoginResponse } from '@/features/auth/types'

await setup({
  rootDir: fileURLToPath(new URL('../../..', import.meta.url))
})

describe('POST /api/auth/register', () => {
  it('sets httpOnly cookie and returns user', async () => {
    const email = `new-${Date.now()}@example.com`
    const res = await fetch(url('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password12' })
    })

    const body = (await res.json()) as LoginResponse
    expect(body.user.email).toBe(email.toLowerCase())
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toContain('auth_token=')
    expect(cookie.toLowerCase()).toContain('httponly')
  })

  it('409 if email is already taken', async () => {
    const email = `dup-${Date.now()}@example.com`
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email, password: 'password12' }
    })
    await expect(
      $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password: 'password12' }
      })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('400 if password is less than 8 characters', async () => {
    await expect(
      $fetch('/api/auth/register', {
        method: 'POST',
        body: { email: `short-${Date.now()}@example.com`, password: 'short' }
      })
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
