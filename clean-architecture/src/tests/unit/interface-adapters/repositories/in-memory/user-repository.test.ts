import { beforeAll, describe, expect, it } from 'vitest'

import { InMemoryUserRepository } from '../../../../../interface-adapters/repositories/in-memory/user-repository.js'
import { ConflictError } from '../../../../../shared/errors.js'
import { aUser } from '../../../../factories/entities/user.factory.js'

describe('UserRepository', () => {
  let repo: InMemoryUserRepository
  let users: ReturnType<typeof aUser>[]

  beforeAll(async () => {
    repo = new InMemoryUserRepository()
    users = [
      aUser({ email: 'test1@example.com' }),
      aUser({ email: 'test2@example.com' }),
      aUser({ email: 'test3@example.com' }),
    ]
    await Promise.all(users.map((user) => repo.save(user)))
  })

  it('should round trip an user', async () => {
    const user = aUser()
    await repo.save(user)
    const found = await repo.findById(user.id)
    expect(found).toEqual(user)
  })
  it('should find an user by his email', async () => {
    expect(await repo.findByEmail(users[0]!.email)).toEqual(users[0])
  })
  it('should find an user by his id', async () => {
    expect(await repo.findById(users[0]!.id)).toEqual(users[0])
  })
  it('should throw ConflictError when saving with duplicate email', async () => {
    await expect(repo.save(aUser({ email: users[0]!.email }))).rejects.toThrow(
      ConflictError,
    )
  })
})
