import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { displayEvents } from '../src/output'

describe('displayEvents', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should use template for PushEvent', () => {
    const input = { 'user/repo': { PushEvent: { count: 1 } } }
    displayEvents(input)
    expect(consoleSpy).toHaveBeenCalledWith('- Pushed 1 commits to user/repo')
  })

  it('should use template for WatchEvent', () => {
    const input = { 'user/repo': { WatchEvent: { count: 1 } } }
    displayEvents(input)
    expect(consoleSpy).toHaveBeenCalledWith('- Starred user/repo')
  })

  it('should use template for IssuesEvent', () => {
    const input = {
      'user/repo': { IssuesEvent: { count: 1, action: 'opened' } },
    }
    displayEvents(input)
    expect(consoleSpy).toHaveBeenCalledWith('- Opened an issue in user/repo')
  })

  it('should use template for CreateEvent', () => {
    const input = {
      'user/repo': {
        CreateEvent: { count: 1, ref_type: 'something', ref: 'something' },
      },
    }
    displayEvents(input)
    expect(consoleSpy).toHaveBeenCalledWith(
      '- Created 1 something something in user/repo',
    )
  })

  it('should include repo name in output', () => {
    const input = {
      'nachosag/my-repo': {
        WatchEvent: {
          count: 1,
        },
      },
    }
    displayEvents(input)
    expect(consoleSpy).toHaveBeenCalledWith('- Starred nachosag/my-repo')
  })

  it('should fail on unknown event types', () => {
    const input = {
      'user/repo': {
        UnknownEvent: { count: 1 },
      },
    }

    expect(() => displayEvents(input)).toThrow()
  })

  it('should throw on unknown event type', () => {
    const input = { 'user/repo': { UnknownEvent: { count: 1 } } }
    expect(() => displayEvents(input)).toThrow()
  })

  it('should iterate over multiple repos', () => {
    const input = {
      'user/repo1': { PushEvent: { count: 1 } },
      'user/repo2': { WatchEvent: { count: 1 } },
    }

    displayEvents(input)
    expect(consoleSpy).toHaveBeenCalledTimes(2)
  })
})
