import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  canTransition,
  assertValidTransition,
  PaymentStatus,
} from '../../../src/entities/payment-status'
import { ConflictError } from '../../../src/shared/errors'

describe('canTransition', () => {
  it('should be a function', () => {
    expectTypeOf(canTransition).toBeFunction()
  })
  it('should accept two PaymentStatus parameters', () => {
    expectTypeOf(canTransition).parameters.toEqualTypeOf<
      [PaymentStatus, PaymentStatus]
    >()
  })
  it('should return a boolean', () => {
    expectTypeOf(canTransition).returns.toBeBoolean()
  })
})

describe('assertValidTransition', () => {
  it('should be a function', () => {
    expectTypeOf(assertValidTransition).toBeFunction()
  })
  it('should accept two PaymentStatus parameters', () => {
    expectTypeOf(assertValidTransition).parameters.toEqualTypeOf<
      [PaymentStatus, PaymentStatus]
    >()
  })
  it('should return void', () => {
    expectTypeOf(assertValidTransition).returns.toBeVoid()
  })
  it('should throw a ConflictError if transition is invalid', () => {
    expect(() => assertValidTransition('REFUNDED', 'COMPLETED')).toThrow(
      ConflictError,
    )
  })
})

describe('PaymentStatus state machine', () => {
  it('PENDING → COMPLETED is valid', () => {
    expect(canTransition('PENDING', 'COMPLETED')).toBe(true)
  })
  it('PENDING → FAILED is valid', () => {
    expect(canTransition('PENDING', 'FAILED')).toBe(true)
  })
  it('COMPLETED → REFUNDED is valid', () => {
    expect(canTransition('COMPLETED', 'REFUNDED')).toBe(true)
  })
  it('FAILED → COMPLETED throws ConflictError', () => {
    expect(() => assertValidTransition('FAILED', 'COMPLETED')).toThrow(
      ConflictError,
    )
  })
  it('REFUNDED → COMPLETED throws ConflictError', () => {
    expect(() => assertValidTransition('REFUNDED', 'COMPLETED')).toThrow(
      ConflictError,
    )
  })
})
