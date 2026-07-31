import { vi } from 'vitest'

import type { PaymentRepository } from '../../../use-cases/interfaces/payment-repository.interface.js'

export function makePaymentRepository(): PaymentRepository {
  return {
    findById: vi.fn(),
    findByOrderId: vi.fn(),
    save: vi.fn(),
  }
}
