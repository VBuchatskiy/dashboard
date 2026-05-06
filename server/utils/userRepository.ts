import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { User } from "~/features/auth/types";

type UserRow = { id: number; email: string; passwordHash: string };

let nextId = 1;
const byEmail = new Map<string, UserRow>();
const byId = new Map<number, UserRow>();
/** session token -> userId */
const sessions = new Map<string, number>();

const SCRYPT_KEYLEN = 64;

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [saltHex, hashHex] = parts;
  try {
    const salt = Buffer.from(saltHex ?? "", "hex");
    const expected = Buffer.from(hashHex ?? "", "hex");
    const derived = scryptSync(password, salt, SCRYPT_KEYLEN);

    return (
      derived.length === expected.length && timingSafeEqual(derived, expected)
    );
  } catch {
    return false;
  }
}

function seedAdmin() {
  const email = "admin@example.com";
  if (byEmail.has(email)) return;
  const passwordHash = hashPassword("secret");
  const row: UserRow = { id: nextId++, email, passwordHash };
  byEmail.set(email, row);
  byId.set(row.id, row);
}

seedAdmin();

export function registerUser(emailRaw: string, password: string): User {
  const email = emailRaw.trim().toLowerCase();
  if (byEmail.has(email)) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email already registered",
    });
  }
  const passwordHash = hashPassword(password);
  const row: UserRow = { id: nextId++, email, passwordHash };
  byEmail.set(email, row);
  byId.set(row.id, row);
  return { id: row.id, email: row.email };
}

export function verifyCredentials(emailRaw: string, password: string): User {
  const email = emailRaw.trim().toLowerCase();
  const row = byEmail.get(email);
  if (!row || !verifyPassword(password, row.passwordHash)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
  return { id: row.id, email: row.email };
}

export function createSessionToken(userId: number): string {
  const token = randomUUID();
  sessions.set(token, userId);
  return token;
}

export function destroySessionToken(token: string | undefined) {
  if (!token) return;
  sessions.delete(token);
}

export function getUserForSessionToken(token: string | undefined): User | null {
  if (!token) return null;
  const userId = sessions.get(token);
  if (userId === undefined) return null;
  const row = byId.get(userId);
  if (!row) return null;
  return { id: row.id, email: row.email };
}
