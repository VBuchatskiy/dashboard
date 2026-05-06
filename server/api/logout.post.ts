import { deleteCookie, getCookie } from "h3";
import { AUTH_COOKIE_NAME, cookieAuthOptions } from "~/utils/authSession";
import { destroySessionToken } from "~/utils/userRepository";

export default defineEventHandler((event) => {
  assertMethod(event, "POST");
  const token = getCookie(event, AUTH_COOKIE_NAME);
  destroySessionToken(token);
  deleteCookie(event, AUTH_COOKIE_NAME, cookieAuthOptions());
  return { ok: true };
});
