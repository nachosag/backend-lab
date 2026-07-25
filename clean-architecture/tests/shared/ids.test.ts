import { describe, expect, expectTypeOf, it } from 'vitest'

import { generateId } from '../../src/shared/ids'

describe('generateId', () => {
  it('should be a function', () => {
    expectTypeOf(generateId).toBeFunction()
  })
  it('should return a string', () => {
    expectTypeOf(generateId).returns.toBeString()
  })
  it('should be a valid UUID', () => {
    const UUID_V4 =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(generateId()).toMatch(UUID_V4)
  })
  it('should generate two different ids', () => {
    const first = generateId()
    const second = generateId()
    expect(first).not.toBe(second)
  })
})
