import { ValidationError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export function createOrderItem(input: {
  productId: string
  quantity: number
  unitPrice: number
}): OrderItem {
  if (input.quantity <= 0)
    throw new ValidationError('Quantity must be positive')
  return {
    id: generateId(),
    ...input,
    subtotal: input.quantity * input.unitPrice,
  }
}
