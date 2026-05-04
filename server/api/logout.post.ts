import { deleteCookie } from 'h3'
import { AUTH_COOKIE_NAME } from '../utils/authSession'

export default defineEventHandler((event) => {
  deleteCookie(event, AUTH_COOKIE_NAME, { path: '/' })
  return { ok: true }
})
