import { describe, expect, expectTypeOf, it } from 'vitest'

import { createProduct, type Product } from '../../../entities/product.js'
import { ConflictError, ValidationError } from '../../../shared/errors.js'

describe('createProduct', () => {
  it('should be a function', () => {
    expectTypeOf(createProduct).toBeFunction()
  })
  it('should accept an object as parameter', () => {
    expectTypeOf(createProduct).parameter(0).toMatchObjectType<{
      sku: string
      name: string
      price: number
      stock: number
    }>()
  })
  it('should return a product', () => {
    expectTypeOf(createProduct).returns.toEqualTypeOf<Product>()
  })
  it('should throw ValidationError when price <= 0', () => {
    expect(() =>
      createProduct({ name: 'test', price: 0, sku: 'test', stock: 1 }),
    ).toThrow(ValidationError)
  })
  it('should throw ValidationError when stock < 0', () => {
    expect(() =>
      createProduct({ name: 'test', price: 1, sku: 'test', stock: -1 }),
    ).toThrow(ValidationError)
  })
})

describe('deductStock', () => {
  it('should reduce stock correctly', () => {
    expect(
      createProduct({
        name: 'test',
        price: 2,
        sku: 'test',
        stock: 10,
      }).deductStock(5).stock,
    ).toBe(5)
  })
  it('should throw ConflictError when there is insufficient stock', () => {
    expect(() => {
      createProduct({
        name: 'test',
        price: 5,
        sku: 'test',
        stock: 10,
      }).deductStock(11)
    }).toThrow(ConflictError)
  })
})

describe('restoreStock', () => {
  it('should restore stock correctly', () => {
    expect(
      createProduct({
        name: 'test',
        price: 5,
        sku: 'test',
        stock: 5,
      }).restoreStock(5).stock,
    ).toBe(10)
  })
})
