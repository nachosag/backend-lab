import { describe, expect, it } from 'vitest'

import { aggregateEvents, formatMessage } from '../src/parser.js'

describe('aggregateEvents', () => {
  it('should group a single event by repo and type', () => {
    const input = [
      {
        type: 'newEvent',
        repo: { name: 'newRepo' },
        payload: {},
      },
    ]
    const result = aggregateEvents(input)
    expect(result).toEqual({
      newRepo: { newEvent: { count: 1 } },
    })
  })

  it('should return an empty object for an empty array', () => {
    expect(aggregateEvents([])).toEqual({})
  })

  it('should group multiple events by repo and type', () => {
    const input = [
      { type: 'eventType1', repo: { name: 'repo1' }, payload: {} },
      { type: 'eventType2', repo: { name: 'repo1' }, payload: {} },
    ]
    const result = aggregateEvents(input)
    expect(result).toEqual({
      repo1: { eventType1: { count: 1 }, eventType2: { count: 1 } },
    })
  })

  it('should group multiple events by repo and same type to increment count', () => {
    const input = [
      { type: 'eventType1', repo: { name: 'repo1' }, payload: {} },
      { type: 'eventType1', repo: { name: 'repo1' }, payload: {} },
    ]
    const result = aggregateEvents(input)
    expect(result).toEqual({
      repo1: { eventType1: { count: 2 } },
    })
  })

  it('should include action if available', () => {
    const input = [
      {
        type: 'PushEvent',
        repo: { name: 'repo1' },
        payload: { action: 'opened' },
      },
    ]
    const result = aggregateEvents(input)
    expect(result).toEqual({
      repo1: { PushEvent: { action: 'opened', count: 1 } },
    })
  })

  it('should include ref if available', () => {
    const input = [
      {
        type: 'PushEvent',
        repo: { name: 'repo1' },
        payload: { ref: 'main' },
      },
    ]
    const result = aggregateEvents(input)
    expect(result).toEqual({
      repo1: { PushEvent: { ref: 'main', count: 1 } },
    })
  })

  it('should include ref_type if available', () => {
    const input = [
      {
        type: 'CreateEvent',
        repo: { name: 'repo1' },
        payload: { ref_type: 'branch' },
      },
    ]
    const result = aggregateEvents(input)
    expect(result).toEqual({
      repo1: { CreateEvent: { ref_type: 'branch', count: 1 } },
    })
  })

  it('should handle events from multiple repos', () => {
    const input = [
      { type: 'PushEvent', repo: { name: 'user/repo1' }, payload: {} },
      { type: 'WatchEvent', repo: { name: 'user/repo2' }, payload: {} },
    ]
    const result = aggregateEvents(input)
    expect(Object.keys(result)).toEqual(['user/repo1', 'user/repo2'])
  })

  it('should overwrite action with last value for same event type', () => {
    const input = [
      {
        type: 'IssuesEvent',
        repo: { name: 'repo1' },
        payload: { action: 'opened' },
      },
      {
        type: 'IssuesEvent',
        repo: { name: 'repo1' },
        payload: { action: 'closed' },
      },
    ]
    const result = aggregateEvents(input)
    expect(result['repo1']['IssuesEvent'].action).toBe('closed')
  })
})

describe('formatMessage', () => {
  it('should replace a simple placeholder', () => {
    const template = 'Hi {name}, you have {count} messages'
    const data = { count: 2, name: 'nacho' }
    const result = formatMessage(template, data)
    expect(result).toEqual('Hi nacho, you have 2 messages')
  })

  it('should replace numeric placeholders', () => {
    const template = '{count} msgs'
    const data = { count: 5 }
    const result = formatMessage(template, data)
    expect(result).toEqual('5 msgs')
  })

  it('should capitalize action value if available', () => {
    const template = 'Hi {action}, you have {count} messages'
    const data = { count: 2, action: 'nacho' }
    const result = formatMessage(template, data)
    expect(result).toEqual('Hi Nacho, you have 2 messages')
  })

  it('should replace multiple placeholders in variable order', () => {
    const template = '{count} {name}'
    const data = { count: 2, name: 'x' }
    const result = formatMessage(template, data)
    expect(result).toEqual('2 x')
  })
})
