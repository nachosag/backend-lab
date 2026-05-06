import { afterEach, describe, expect, it, vi } from 'vitest'

import { parseArgs } from '../src/args'

describe('parseArgs', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return valid username', () => {
    vi.stubGlobal('process', {
      argv: ['node', 'script', 'nachosag'],
    })

    const result = parseArgs()
    expect(result).toBe('nachosag')
  })

  it('should throw error if no username is provided', () => {
    vi.stubGlobal('process', {
      argv: ['node', 'script'],
    })

    expect(parseArgs).toThrow('Username is required')
  })

  it('should ignore aditional arguments', () => {
    vi.stubGlobal('process', {
      argv: ['node', 'script', 'user', 'extra'],
    })

    const result = parseArgs()
    expect(result).toBe('user')
  })

  it('should throw error if arg is empty string', () => {
    vi.stubGlobal('process', {
      argv: ['node', 'script', ''],
    })

    expect(parseArgs).toThrow('Username is required')
  })
})
