import { describe, expect, it } from 'vitest'

import { isValidEmail } from '../../../shared/email.js'

describe('isValidEmail', () => {
  it('returns true for a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })
  it('returns true for a valid email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })
  it('returns true for a valid email with plus addressing', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true)
  })
  it('returns false for an email without @', () => {
    expect(isValidEmail('notanemail')).toBe(false)
  })
  it('returns false for an email without domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })
  it('returns false for an email without TLD', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })
  it('returns false for an email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false)
  })
  it('returns false for an empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
})
