import { describe, expect, it } from 'vitest'

import { OrderStatus } from '../../../entities/order-status.js'
import { createOrder } from '../../../entities/order.js'
import { ConflictError, NotFoundError } from '../../../shared/errors.js'

describe('createOrder.addItem', () => {
  it('should start in DRAFT status', () => {
    expect(createOrder({ customerId: 'abc123' }).status).toBe(OrderStatus.DRAFT)
  })
  it('should add an item and recalculate the total', () => {
    const order = createOrder({ customerId: 'abc123' }).addItem({
      productId: 'prod1',
      quantity: 1,
      unitPrice: 5,
    })
    expect(order.status).toBe(OrderStatus.DRAFT)
    expect(order.total).toBe(5)
  })
  it('should reject adding items when the order is not in DRAFT', () => {
    expect(() =>
      createOrder({ customerId: 'abc123' })
        .addItem({
          productId: 'prod1',
          quantity: 1,
          unitPrice: 5,
        })
        .submit()
        .addItem({
          productId: 'prod1',
          quantity: 1,
          unitPrice: 5,
        }),
    ).toThrow(ConflictError)
  })
  it('should correctly accumulate the total for multiple items', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .addItem({
        productId: 'prod2',
        quantity: 2,
        unitPrice: 10,
      })
    expect(order.total).toBe(25)
  })
})

describe('createOrder.removeItem', () => {
  it('should remove an existing item and recalculate the total', () => {
    const orderWithItem = createOrder({ customerId: 'abc123' }).addItem({
      productId: 'prod1',
      quantity: 1,
      unitPrice: 5,
    })
    const itemId = orderWithItem.items[0]!.id
    const order = orderWithItem.removeItem(itemId)
    expect(order.items.length).toBe(0)
    expect(order.total).toBe(0)
  })
  it('should reject removing items when the order is not in DRAFT', () => {
    expect(() => {
      createOrder({ customerId: 'abc123' })
        .addItem({
          productId: 'prod1',
          quantity: 1,
          unitPrice: 5,
        })
        .submit()
        .removeItem('prod1')
    }).toThrow(ConflictError)
  })
  it('should throw when the item does not exist', () => {
    expect(() =>
      createOrder({ customerId: 'abc123' }).removeItem('test'),
    ).toThrow(NotFoundError)
  })
})

describe('Order transitions', () => {
  it('should transition from DRAFT to PENDING when submitted', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .submit()
    expect(order.status).toBe(OrderStatus.PENDING)
  })
  it('should transition from PENDING to CONFIRMED', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .submit()
      .confirm()
    expect(order.status).toBe(OrderStatus.CONFIRMED)
  })
  it('should transition from CONFIRMED to SHIPPED', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .submit()
      .confirm()
      .ship()
    expect(order.status).toBe(OrderStatus.SHIPPED)
  })
  it('should transition from SHIPPED to DELIVERED', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .submit()
      .confirm()
      .ship()
      .deliver()
    expect(order.status).toBe(OrderStatus.DELIVERED)
  })
  it('should transition from PENDING to CANCELLED', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .submit()
      .cancel()
    expect(order.status).toBe(OrderStatus.CANCELLED)
  })
  it('should transition from CONFIRMED to CANCELLED', () => {
    const order = createOrder({ customerId: 'abc123' })
      .addItem({
        productId: 'prod1',
        quantity: 1,
        unitPrice: 5,
      })
      .submit()
      .confirm()
      .cancel()
    expect(order.status).toBe(OrderStatus.CANCELLED)
  })
})
