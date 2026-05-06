import { deleteCookie, getCookie } from 'h3'
import { AUTH_COOKIE_NAME } from '../utils/authSession'
import { destroySessionToken } from '../utils/userRepository'

export default defineEventHandler((event) => {
  const token = getCookie(event, AUTH_COOKIE_NAME)
  destroySessionToken(token)
  deleteCookie(event, AUTH_COOKIE_NAME, { path: '/' })
  return { ok: true }
})
