import { createProduct, type Product } from '../../../entities/product.js'

export function aProduct(overrides: Partial<Product> = {}): Product {
  return {
    ...createProduct({
      name: 'test',
      sku: 'test-prod',
      price: 1000,
      stock: 20,
    }),
    ...overrides,
  }
}
