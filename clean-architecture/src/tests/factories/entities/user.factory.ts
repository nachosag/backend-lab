import { createUser, type User } from '../../../entities/user.js'

export function aUser(overrides: Partial<User> = {}): User {
  return {
    ...createUser({
      email: 'test@example.com',
      passwordHash: 'hashedPassword',
    }),
    ...overrides,
  }
}
