import { describe, it, expect, expectTypeOf } from 'vitest'

import { createUser, type User } from '../../../entities/user.js'
import { ValidationError } from '../../../shared/errors.js'

describe('createUser', () => {
  it('should accept an object as parameter', () => {
    expectTypeOf(createUser)
      .parameter(0)
      .toMatchObjectType<{ email: string; passwordHash: string }>()
  })
  it('should return a user', () => {
    expectTypeOf(createUser).returns.toEqualTypeOf<User>()
  })
  it('should return a valid user', () => {
    const input = {
      email: 'test@email.com',
      passwordHash: 'hashedPassword',
    }

    const user = createUser(input)

    expect(user).toEqual({
      id: expect.any(String),
      email: input.email,
      passwordHash: input.passwordHash,
      createdAt: expect.any(Date),
    })
  })
  it('should throw an error if email is invalid', () => {
    expect(() =>
      createUser({ email: 'notanemail', passwordHash: 'hashedPassword' }),
    ).toThrow(ValidationError)
  })
})
