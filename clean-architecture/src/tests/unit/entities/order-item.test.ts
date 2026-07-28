import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  createOrderItem,
  type OrderItem,
} from '../../../entities/order-item.js'
import { ValidationError } from '../../../shared/errors.js'

describe('createOrderItem', () => {
  it('should be a function', () => {
    expectTypeOf(createOrderItem).toBeFunction()
  })
  it('should accept an object as parameter', () => {
    expectTypeOf(createOrderItem).parameter(0).toMatchObjectType<{
      productId: string
      quantity: number
      unitPrice: number
    }>()
  })
  it('should return a order item', () => {
    expectTypeOf(createOrderItem).returns.toEqualTypeOf<OrderItem>()
  })
  it('should throw a ValidationError when quantity = 0', () => {
    expect(() =>
      createOrderItem({
        productId: 'abc123',
        quantity: 0,
        unitPrice: 1,
      }),
    ).toThrow(ValidationError)
  })
  it('should throw a ValidationError when quantity < 0', () => {
    expect(() => {
      createOrderItem({
        productId: 'abc123',
        quantity: -1,
        unitPrice: 1,
      })
    }).toThrow(ValidationError)
  })
  it('should calculate subtotal correctly', () => {
    expect(
      createOrderItem({
        productId: 'abc123',
        quantity: 2,
        unitPrice: 10,
      }).subtotal,
    ).toBe(20)
  })
  it('should throw a ValidationError when unitPrice = 0', () => {
    expect(() =>
      createOrderItem({ productId: 'abc123', quantity: 1, unitPrice: 0 }),
    ).toThrow(ValidationError)
  })
  it('should throw a ValidationError when unitPrice is negative', () => {
    expect(() =>
      createOrderItem({ productId: 'abc123', quantity: 1, unitPrice: -10 }),
    ).toThrow(ValidationError)
  })
})
