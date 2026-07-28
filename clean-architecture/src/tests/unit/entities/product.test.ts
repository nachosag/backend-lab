import { describe, expect, expectTypeOf, it } from 'vitest'

import { createProduct, type Product } from '../../../entities/product.js'
import { ConflictError, ValidationError } from '../../../shared/errors.js'

describe('createProduct', () => {
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
  it('should throw ValidationError when price is NaN', () => {
    expect(() =>
      createProduct({ name: 'test', price: NaN, sku: 'test', stock: 1 }),
    ).toThrow(ValidationError)
  })
  it('should throw ValidationError when price is Infinity', () => {
    expect(() =>
      createProduct({ name: 'test', price: Infinity, sku: 'test', stock: 1 }),
    ).toThrow(ValidationError)
  })
  it('should throw ValidationError when stock < 0', () => {
    expect(() =>
      createProduct({ name: 'test', price: 1, sku: 'test', stock: -1 }),
    ).toThrow(ValidationError)
  })
  it('should throw ValidationError when stock is NaN', () => {
    expect(() =>
      createProduct({ name: 'test', price: 1, sku: 'test', stock: NaN }),
    ).toThrow(ValidationError)
  })
  it('should throw ValidationError when name is empty', () => {
    expect(() =>
      createProduct({ name: '', price: 1, sku: 'test', stock: 1 }),
    ).toThrow(ValidationError)
  })
  it('should throw ValidationError when sku is empty', () => {
    expect(() =>
      createProduct({ name: 'test', price: 1, sku: '', stock: 1 }),
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
  it('should not mutate the original product', () => {
    const original = createProduct({
      name: 'Widget',
      price: 10,
      sku: 'WDG-001',
      stock: 10,
    })
    const updated = original.deductStock(3)
    expect(original.stock).toBe(10)
    expect(updated).not.toBe(original)
  })
  it('should preserve all other fields when deducting stock', () => {
    const original = createProduct({
      name: 'Widget',
      price: 10,
      sku: 'WDG-001',
      stock: 10,
    })
    const updated = original.deductStock(3)
    expect(updated).toMatchObject({
      id: original.id,
      name: 'Widget',
      price: 10,
      sku: 'WDG-001',
      createdAt: original.createdAt,
    })
    expect(updated.stock).toBe(7)
  })
  it('should throw ValidationError when quantity is NaN', () => {
    expect(() => {
      createProduct({
        name: 'test',
        price: 5,
        sku: 'test',
        stock: 5,
      }).deductStock(NaN)
    }).toThrow(ValidationError)
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
  it('should throw ValidationError when quantity = 0', () => {
    expect(() => {
      createProduct({
        name: 'test',
        price: 5,
        sku: 'test',
        stock: 5,
      }).restoreStock(0)
    }).toThrow(ValidationError)
  })
  it('should throw ValidationError when quantity is negative', () => {
    expect(() => {
      createProduct({
        name: 'test',
        price: 5,
        sku: 'test',
        stock: 5,
      }).restoreStock(-1)
    }).toThrow(ValidationError)
  })
  it('should throw ValidationError when quantity is NaN', () => {
    expect(() => {
      createProduct({
        name: 'test',
        price: 5,
        sku: 'test',
        stock: 5,
      }).restoreStock(NaN)
    }).toThrow(ValidationError)
  })
})
