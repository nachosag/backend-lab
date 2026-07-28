import { describe, expect, it } from 'vitest'

import {
  assertValidTransition,
  canTransition,
  VALID_TRANSITIONS,
  type OrderStatus,
} from '../../../entities/order-status.js'
import { ConflictError } from '../../../shared/errors.js'

const ALL_STATUSES = Object.keys(VALID_TRANSITIONS) as OrderStatus[]

const validTransitions: Array<[OrderStatus, OrderStatus]> = Object.entries(
  VALID_TRANSITIONS,
).flatMap(([from, tos]) =>
  (tos as readonly OrderStatus[]).map(
    (to) => [from as OrderStatus, to] as [OrderStatus, OrderStatus],
  ),
)

const invalidTransitions: Array<[OrderStatus, OrderStatus]> = ALL_STATUSES.flatMap(
  (from) =>
    ALL_STATUSES
      .filter((to) => !VALID_TRANSITIONS[from].includes(to))
      .map((to) => [from, to] as [OrderStatus, OrderStatus]),
)

describe('OrderStatus state machine', () => {
  it.each(validTransitions)('%s → %s is valid', (from, to) => {
    expect(canTransition(from, to)).toBe(true)
  })

  it.each(invalidTransitions)(
    '%s → %s throws ConflictError',
    (from, to) => {
      expect(() => assertValidTransition(from, to)).toThrow(ConflictError)
    },
  )
})
