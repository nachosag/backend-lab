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
  if (!Number.isFinite(input.quantity) || input.quantity <= 0)
    throw new ValidationError('Quantity must be a positive finite number')
  if (!Number.isFinite(input.unitPrice) || input.unitPrice <= 0)
    throw new ValidationError('Unit price must be a positive finite number')
  return {
    id: generateId(),
    ...input,
    subtotal: input.quantity * input.unitPrice,
  }
}
