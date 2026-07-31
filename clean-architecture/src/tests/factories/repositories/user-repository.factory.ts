import { vi } from 'vitest'

import type { UserRepository } from '../../../use-cases/interfaces/user-repository.interface.js'

export function makeUserRepository(): UserRepository {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
  }
}
