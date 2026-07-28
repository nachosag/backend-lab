import { describe, expect, it } from 'vitest'

import {
  assertValidTransition,
  canTransition,
  VALID_TRANSITIONS,
  type PaymentStatus,
} from '../../../entities/payment-status.js'
import { ConflictError } from '../../../shared/errors.js'

const ALL_STATUSES = Object.keys(VALID_TRANSITIONS) as PaymentStatus[]

const validTransitions: Array<[PaymentStatus, PaymentStatus]> = Object.entries(
  VALID_TRANSITIONS,
).flatMap(([from, tos]) =>
  (tos as readonly PaymentStatus[]).map(
    (to) => [from as PaymentStatus, to] as [PaymentStatus, PaymentStatus],
  ),
)

const invalidTransitions: Array<[PaymentStatus, PaymentStatus]> =
  ALL_STATUSES.flatMap((from) =>
    ALL_STATUSES
      .filter((to) => !VALID_TRANSITIONS[from].includes(to))
      .map((to) => [from, to] as [PaymentStatus, PaymentStatus]),
  )

describe('PaymentStatus state machine', () => {
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
