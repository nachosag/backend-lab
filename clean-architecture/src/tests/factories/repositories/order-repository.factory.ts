import { vi } from 'vitest'

import type { OrderRepository } from '../../../use-cases/interfaces/order-repository.interface.js'

export function makeOrderRepository(): OrderRepository {
  return {
    findAll: vi.fn(),
    findByCustomerId: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
  }
}
