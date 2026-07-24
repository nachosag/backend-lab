import { describe, expect, it } from 'vitest'

import {
  canTransition,
  assertValidTransition,
} from '../../src/entities/payment-status'
import { ConflictError } from '../../src/shared/errors'

describe('canTransition', () => {
  it('should be a function', () => {
    expect(canTransition).toBeInstanceOf(Function)
  })
  it('should accept two parameters', () => {
    expect(canTransition.length).toBe(2)
  })
  it('should return a boolean', () => {
    expect(canTransition('PENDING', 'COMPLETED')).toBeTypeOf('boolean')
  })
})

describe('assertValidTransition', () => {
  it('should be a function', () => {
    expect(assertValidTransition).toBeInstanceOf(Function)
  })
  it('should accept to parameters', () => {
    expect(assertValidTransition.length).toBe(2)
  })
  it('should throw a ConflicError if transition is invalid', () => {
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
