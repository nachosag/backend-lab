import { ValidationError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'
import { assertValidTransition, PaymentStatus } from './payment-status.js'

export const PaymentMethod = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
} as const

export type PaymentMethod = keyof typeof PaymentMethod

export interface Payment {
  id: string
  orderId: string
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  createdAt: Date
  markCompleted(): Payment
  markFailed(): Payment
  refund(): Payment
}

export function createPayment(input: {
  orderId: string
  amount: number
  method: PaymentMethod
}): Payment {
  if (input.amount <= 0) throw new ValidationError('Amount must be positive')

  return {
    id: generateId(),
    orderId: input.orderId,
    amount: input.amount,
    status: PaymentStatus.PENDING,
    method: input.method,
    createdAt: new Date(),
    markCompleted(): Payment {
      assertValidTransition(this.status, 'COMPLETED')
      return {
        ...this,
        status: PaymentStatus.COMPLETED,
      }
    },
    markFailed(): Payment {
      assertValidTransition(this.status, 'FAILED')
      return {
        ...this,
        status: PaymentStatus.FAILED,
      }
    },
    refund(): Payment {
      assertValidTransition(this.status, 'REFUNDED')
      return {
        ...this,
        status: PaymentStatus.REFUNDED,
      }
    },
  }
}
