import { ConflictError } from '../shared/errors.js'

export const OrderStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const

export type OrderStatus = keyof typeof OrderStatus

export const VALID_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  DRAFT: ['DRAFT', 'PENDING'],
  PENDING: ['PENDING', 'CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CONFIRMED', 'SHIPPED', 'CANCELLED'],
  SHIPPED: ['SHIPPED', 'DELIVERED'],
  DELIVERED: ['DELIVERED'],
  CANCELLED: ['CANCELLED'],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}

export function assertValidTransition(
  from: OrderStatus,
  to: OrderStatus,
): void {
  if (!canTransition(from, to)) {
    throw new ConflictError(`Cannot transition from ${from} to ${to}`)
  }
}
