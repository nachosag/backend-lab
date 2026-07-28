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
  if (input.price <= 0) throw new ValidationError('Price must be positive')
  if (input.stock < 0) throw new ValidationError('Stock cannot be negative')
  if (!input.name) throw new ValidationError('Product must have a name')
  if (!input.sku) throw new ValidationError('Product must have a sku')

  return {
    id: generateId(),
    ...input,
    createdAt: new Date(),
    deductStock(quantity) {
      if (quantity <= 0) throw new ValidationError('quantity must be positive')
      if (this.stock < quantity) throw new ConflictError('Insufficient stock')

      return {
        ...this,
        stock: this.stock - quantity,
      }
    },
    restoreStock(quantity) {
      if (quantity <= 0) throw new ValidationError('quantity must be positive')
      return {
        ...this,
        stock: this.stock + quantity,
      }
    },
  }
}
