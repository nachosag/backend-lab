import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  canTransition,
  assertValidTransition,
  OrderStatus,
} from '../../src/entities/order-status'
import { ConflictError } from '../../src/shared/errors'

describe('canTransition', () => {
  it('should be a function', () => {
    expectTypeOf(canTransition).toBeFunction()
  })
  it('should accept two OrderStatus parameters', () => {
    expectTypeOf(canTransition).parameters.toEqualTypeOf<
      [OrderStatus, OrderStatus]
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
  it('should accept two OrderStatus parameters', () => {
    expectTypeOf(assertValidTransition).parameters.toEqualTypeOf<
      [OrderStatus, OrderStatus]
    >()
  })
  it('should return void', () => {
    expectTypeOf(assertValidTransition).returns.toBeVoid()
  })
})

describe('OrderStatus state machine', () => {
  it('DRAFT → PENDING is valid', () => {
    expect(canTransition('DRAFT', 'PENDING')).toBe(true)
  })
  it(' PENDING → CONFIRMED is valid', () => {
    expect(canTransition('PENDING', 'CONFIRMED')).toBe(true)
  })
  it(' PENDING → CANCELLED is valid', () => {
    expect(canTransition('PENDING', 'CANCELLED')).toBe(true)
  })
  it(' CONFIRMED → SHIPPED is valid', () => {
    expect(canTransition('CONFIRMED', 'SHIPPED')).toBe(true)
  })
  it(' CONFIRMED → CANCELLED is valid', () => {
    expect(canTransition('CONFIRMED', 'CANCELLED')).toBe(true)
  })
  it(' SHIPPED → DELIVERED is valid', () => {
    expect(canTransition('SHIPPED', 'DELIVERED')).toBe(true)
  })
  it('DRAFT → CONFIRMED throws ConflictError', () => {
    expect(() => assertValidTransition('DRAFT', 'CONFIRMED')).toThrow(
      ConflictError,
    )
  })
  it('CANCELLED → DRAFT throws ConflictError', () => {
    expect(() => assertValidTransition('CANCELLED', 'DRAFT')).toThrow(
      ConflictError,
    )
  })
  it('DELIVERED → CANCELLED throws ConflictError', () => {
    expect(() => assertValidTransition('DELIVERED', 'CANCELLED')).toThrow(
      ConflictError,
    )
  })
})
