import type { User } from '../../../entities/user.js'
import { ConflictError } from '../../../shared/errors.js'
import type { UserRepository } from '../../../use-cases/interfaces/user-repository.interface.js'

export class InMemoryUserRepository implements UserRepository {
  private store = new Map<string, User>()

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null
  }

  async save(user: User): Promise<User> {
    const result = await this.findByEmail(user.email)

    if (result) throw new ConflictError('Email already exists')

    this.store.set(user.id, user)
    return user
  }
}
