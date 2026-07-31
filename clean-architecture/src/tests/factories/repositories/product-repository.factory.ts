import { vi } from 'vitest'

import type { ProductRepository } from '../../../use-cases/interfaces/product-repository.interface.js'

export function makeProductRepository(): ProductRepository {
  return {
    delete: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findBySku: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  }
}
