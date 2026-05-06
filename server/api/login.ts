import { setCookie } from 'h3'
import { AUTH_COOKIE_NAME, cookieAuthOptions } from '../utils/authSession'
import { createSessionToken, verifyCredentials } from '../utils/userRepository'

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  const { email, password } = await readBody<{ email?: string; password?: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }

  const user = verifyCredentials(email, password)
  const token = createSessionToken(user.id)

  setCookie(event, AUTH_COOKIE_NAME, token, cookieAuthOptions())

  return { user }
})
