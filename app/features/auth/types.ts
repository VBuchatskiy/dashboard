// features/auth/types.ts
export type User = {
  id: number
  email: string
}

export type LoginResponse = {
  user: User
}
