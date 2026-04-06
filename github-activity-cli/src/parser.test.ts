import { describe, expect, it } from 'vitest'
import { aggregateEvents, formatMessage } from './parser.js'

describe('aggregateEvents', () => {
  it('should group a single event by repo and type', () => {
    // 1. crear un array con UN solo evento (con type, repo.name y payload)
    const mockEvent = [{
      type: 'newEvent',
      repo: {
        name: 'newRepo'
      },
      payload: {}
    }]
    // 2. Llamá a aggregateEvents con ese array
    const eventsGrouped = aggregateEvents(mockEvent)
    // 3. Verficá que el resultado tenga la estructura correcta
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

  it('should group multiple events by repo and same type', () => {
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


  it('should include action, ref or ref_type if available', () => {
    const mockEvent = [{
      type: 'eventType1',
      repo: {
        name: 'repo1'
      },
      payload: {
        action: 'maybe a push',
        ref: 'maybe a branch',
        ref_type: 'someType'
      }
    }]

    const eventsGrouped = aggregateEvents(mockEvent)

    expect(eventsGrouped).toEqual({
      "repo1": {
        "eventType1": {
          "action": "maybe a push",
          "count": 1,
          "ref": "maybe a branch",
          "ref_type": "someType",
        }
      }
    })
  })
})

describe('formatMessage', () => {
  it('should replace a template', () => {
    const template = 'Hi {name}, you have {count} messages'
    const mockedDict = { count: 2, name: 'nacho' }
    const formattedMessage = formatMessage(template, mockedDict)
    expect(formattedMessage).toEqual('Hi nacho, you have 2 messages')
  })

  it('should capitalize if action is available', () => {
    const template = 'Hi {action}, you have {count} messages'
    const mockedDict = { count: 2, action: 'nacho' }
    const formattedMessage = formatMessage(template, mockedDict)
    expect(formattedMessage).toEqual('Hi Nacho, you have 2 messages')
  })
})