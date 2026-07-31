import {
  createOrderItem,
  type OrderItem,
} from '../../../entities/order-item.js'

export function aOrderItem(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    ...createOrderItem({
      productId: 'test123',
      quantity: 10,
      unitPrice: 20,
    }),
    ...overrides,
  }
}
