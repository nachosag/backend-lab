import { describe, expect, it } from 'vitest'

import { PaymentStatus } from '../../../entities/payment-status.js'
import { createPayment, PaymentMethod } from '../../../entities/payment.js'
import { ConflictError, ValidationError } from '../../../shared/errors.js'

describe('createPayment', () => {
  it('should start with PENDING status', () => {
    const payment = createPayment({
      amount: 100,
      method: PaymentMethod.CASH,
      orderId: 'abc123',
    })

    expect(payment.status).toBe(PaymentStatus.PENDING)
  })
  it('should throw ValidationError when amount <= 0', () => {
    expect(() => {
      createPayment({
        amount: 0,
        method: PaymentMethod.CASH,
        orderId: 'abc123',
      })
    }).toThrow(ValidationError)
  })
})

describe('createPayment.markCompleted', () => {
  it('should transition from PENDING to COMPLETED', () => {
    const payment = createPayment({
      amount: 100,
      method: PaymentMethod.CASH,
      orderId: 'abc123',
    }).markCompleted()

    expect(payment.status).toBe(PaymentStatus.COMPLETED)
  })
  it('should throw ConflictError when has FAILED status', () => {
    expect(() => {
      createPayment({
        amount: 100,
        method: PaymentMethod.CASH,
        orderId: 'abc123',
      })
        .markFailed()
        .markCompleted()
    }).toThrow(ConflictError)
  })
})

describe('createPayment.markFailed', () => {
  it('should transition from PENDING to FAILED', () => {
    const payment = createPayment({
      amount: 100,
      method: PaymentMethod.CASH,
      orderId: 'abc123',
    }).markFailed()

    expect(payment.status).toBe(PaymentStatus.FAILED)
  })
})

describe('createPayment.refund', () => {
  it('should transition from COMPLETED to REFUNDED', () => {
    const payment = createPayment({
      amount: 100,
      method: PaymentMethod.CASH,
      orderId: 'abc123',
    })
      .markCompleted()
      .refund()

    expect(payment.status).toBe(PaymentStatus.REFUNDED)
  })
  it('should throw ConflictError when has PENDING status', () => {
    expect(() => {
      createPayment({
        amount: 100,
        method: PaymentMethod.CREDIT_CARD,
        orderId: 'abc123',
      }).refund()
    }).toThrow(ConflictError)
  })
})
