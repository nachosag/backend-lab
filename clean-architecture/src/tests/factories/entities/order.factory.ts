import { createOrder, type Order } from '../../../entities/order.js'

export function aOrder(overrides: Partial<Order> = {}): Order {
  return {
    ...createOrder({
      customerId: 'test123',
    }),
    ...overrides,
  }
}
