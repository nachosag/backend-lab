import { vi } from 'vitest'

import type { CustomerRepository } from '../../../use-cases/interfaces/customer-repository.interface.js'

export function makeCustomerRepository(): CustomerRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByUserId: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  }
}
