import { beforeAll, describe, expect, it } from 'vitest'

import { InMemoryUserRepository } from '../../../../../interface-adapters/repositories/in-memory/user-repository.js'
import { aUser } from '../../../../factories/entities/user.factory.js'

describe('UserRepository', () => {
  let repo: InMemoryUserRepository
  let users: ReturnType<typeof aUser>[]

  beforeAll(async () => {
    repo = new InMemoryUserRepository()
    users = [aUser(), aUser(), aUser()]
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
})
