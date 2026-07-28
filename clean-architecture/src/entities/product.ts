import { ConflictError, ValidationError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'

export interface Product {
  id: string
  sku: string
  name: string
  price: number
  stock: number
  createdAt: Date
  deductStock(quantity: number): Product
  restoreStock(quantity: number): Product
}

export function createProduct(input: {
  sku: string
  name: string
  price: number
  stock: number
}): Product {
  if (!Number.isFinite(input.price) || input.price <= 0)
    throw new ValidationError('Price must be a positive finite number')
  if (!Number.isFinite(input.stock) || input.stock < 0)
    throw new ValidationError('Stock must be a non-negative finite number')
  if (!input.name) throw new ValidationError('Product must have a name')
  if (!input.sku) throw new ValidationError('Product must have a sku')

  return {
    id: generateId(),
    ...input,
    createdAt: new Date(),
    deductStock(quantity) {
      if (!Number.isFinite(quantity) || quantity <= 0)
        throw new ValidationError('quantity must be a positive finite number')
      if (this.stock < quantity) throw new ConflictError('Insufficient stock')

      return {
        ...this,
        stock: this.stock - quantity,
      }
    },
    restoreStock(quantity) {
      if (!Number.isFinite(quantity) || quantity <= 0)
        throw new ValidationError('quantity must be a positive finite number')
      return {
        ...this,
        stock: this.stock + quantity,
      }
    },
  }
}
