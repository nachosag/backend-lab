import { describe, expect, it } from 'vitest'
import { aggregateEvents, formatMessage } from '../src/parser.js'

describe('aggregateEvents', () => {
  it('should group a single event by repo and type', () => {
    const mockEvent = [{
      type: 'newEvent',
      repo: {
        name: 'newRepo'
      },
      payload: {}
    }]
    const eventsGrouped = aggregateEvents(mockEvent)
    expect(eventsGrouped).toEqual({
      'newRepo': {
        'newEvent': { count: 1 }
      }
    })
  })

  it('should return an empty object for an empty array', () => {
    expect(aggregateEvents([])).toEqual({})
  })

  it('should group multiple events by repo and type', () => {
    const mockEvent = [{
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {}
    }, {
      type: 'eventType2',
      repo: {
        name: 'repo1'
      },
      payload: {}
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped).toEqual({
      'repo1': {
        'eventType1': { count: 1 },
        'eventType2': { count: 1 }
      }
    })
  })

  it('should group multiple events by repo and same type to increment count', () => {
    const mockEvent = [{
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {}
    }, {
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {}
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped).toEqual({
      'repo1': {
        'eventType1': { count: 2 }
      }
    })
  })

  it('should include action if available', () => {
    const mockEvent = [{
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {
        action: 'maybe a push'
      }
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped).toEqual({
      'repo1': {
        'eventType1': {
          'action': 'maybe a push',
          'count': 1
        }
      }
    })
  })

  it('should include ref if available', () => {
    const mockEvent = [{
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {
        ref: 'maybe a branch'
      }
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped).toEqual({
      'repo1': {
        'eventType1': {
          'ref': 'maybe a branch',
          'count': 1
        }
      }
    })
  })

  it('should include ref_type if available', () => {
    const mockEvent = [{
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {
        ref_type: 'something'
      }
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped).toEqual({
      'repo1': {
        'eventType1': {
          'ref_type': 'something',
          'count': 1
        }
      }
    })
  })

  it('should handle events from multiple repos', () => {
    const mockEvent = [{
      type: 'PushEvent',
      repo: { name: 'user/repo1' },
      payload: {}
    }, {
      type: 'WatchEvent',
      repo: { name: 'user/repo2' },
      payload: {}
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(Object.keys(eventsGrouped)).toEqual(['user/repo1', 'user/repo2'])
  })

  it('should overwrite action with last value for same event type', () => {
    const mockEvent = [{
      type: 'IssuesEvent',
      repo: { name: 'repo1' },
      payload: { action: 'opened' }
    }, {
      type: 'IssuesEvent',
      repo: { name: 'repo1' },
      payload: { action: 'closed' }
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped['repo1']['IssuesEvent'].action).toBe('closed')
  })
})

describe('formatMessage', () => {
  it('should replace a simple placeholder', () => {
    const template = 'Hi {name}, you have {count} messages'
    const data = { count: 2, name: 'nacho' }
    const message = formatMessage(template, data)
    expect(message).toEqual('Hi nacho, you have 2 messages')
  })

  it('should replace numeric placeholders', () => {
    const template = '{count} msgs'
    const data = { count: 5 }
    const message = formatMessage(template, data)
    expect(message).toEqual('5 msgs')
  })

  it('should capitalize action value if available', () => {
    const template = 'Hi {action}, you have {count} messages'
    const data = { count: 2, action: 'nacho' }
    const message = formatMessage(template, data)
    expect(message).toEqual('Hi Nacho, you have 2 messages')
  })

  it('should replace multiple placeholders in variable order', () => {
    const template = '{count} {name}'
    const data = { count: 2, name: 'x' }
    const message = formatMessage(template, data)
    expect(message).toEqual('2 x')
  })
})