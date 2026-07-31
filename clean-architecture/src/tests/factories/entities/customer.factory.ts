import type { Customer } from '../../../entities/customer.js'
import { createCustomer } from '../../../entities/customer.js'

export function aCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    ...createCustomer({
      email: 'test@example.com',
      name: 'test',
      userId: 'test123',
      phone: '+54 9 11 2222 3333',
    }),
    ...overrides,
  }
}
