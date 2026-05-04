import { getCookie } from 'h3'
import { AUTH_COOKIE_NAME, userFromSessionToken } from '../utils/authSession'

export default defineEventHandler((event) => {
  const token = getCookie(event, AUTH_COOKIE_NAME)
  const user = userFromSessionToken(token)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
})
