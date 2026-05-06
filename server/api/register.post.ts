import { setCookie } from 'h3'
import { AUTH_COOKIE_NAME, cookieAuthOptions } from '../utils/authSession'
import { createSessionToken, registerUser } from '../utils/userRepository'

const MIN_PASSWORD = 8

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  const { email, password } = await readBody<{ email?: string; password?: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }

  if (password.length < MIN_PASSWORD) {
    throw createError({
      statusCode: 400,
      statusMessage: `Password must be at least ${MIN_PASSWORD} characters`
    })
  }

  const user = registerUser(email, password)
  const token = createSessionToken(user.id)

  setCookie(event, AUTH_COOKIE_NAME, token, cookieAuthOptions())

  return { user }
})
