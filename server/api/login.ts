import { setCookie } from 'h3'
import {
  AUTH_COOKIE_NAME,
  DEMO_SESSION_TOKEN,
  userFromSessionToken
} from '../utils/authSession'

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  const { email, password } = await readBody<{ email?: string; password?: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }

  if (email !== 'admin@example.com' || password !== 'secret') {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const user = userFromSessionToken(DEMO_SESSION_TOKEN)!
  const secure = process.env.NODE_ENV === 'production'

  setCookie(event, AUTH_COOKIE_NAME, DEMO_SESSION_TOKEN, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/'
  })

  return { user }
})
