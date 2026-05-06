// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import type { LoginResponse } from '@/features/auth/types'

await setup({
  rootDir: fileURLToPath(new URL('../../..', import.meta.url))
})

describe('POST /api/auth/logout', () => {
  it('returns ok without session', async () => {
    const res = await $fetch<{ ok: boolean }>('/api/auth/logout', {
      method: 'POST'
    })
    expect(res).toEqual({ ok: true })
  })

  it('login then me then logout then me is 401', async () => {
    const loginRes = await fetch(url('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'secret' })
    })
    expect(loginRes.ok).toBe(true)
    const loginBody = (await loginRes.json()) as LoginResponse
    expect(loginBody.user.email).toBe('admin@example.com')

    const rawCookie = loginRes.headers.get('set-cookie') ?? ''
    const tokenMatch = rawCookie.match(/auth_token=([^;]+)/)
    expect(tokenMatch?.[1]).toBeDefined()
    const cookieHeader = `auth_token=${tokenMatch![1]}`

    const me1 = await fetch(url('/api/auth/me'), { headers: { Cookie: cookieHeader } })
    expect(me1.status).toBe(200)

    const logoutRes = await fetch(url('/api/auth/logout'), {
      method: 'POST',
      headers: { Cookie: cookieHeader }
    })
    expect(logoutRes.ok).toBe(true)
    expect(await logoutRes.json()).toEqual({ ok: true })

    const me2 = await fetch(url('/api/auth/me'), { headers: { Cookie: cookieHeader } })
    expect(me2.status).toBe(401)
  })
})
