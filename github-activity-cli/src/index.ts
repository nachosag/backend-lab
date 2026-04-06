import { fetchUserEvents } from './api.js'
import { parseArgs } from './args.js'
import { displayEvents } from './output.js'
import { aggregateEvents } from './parser.js'

const username = parseArgs()

const events = await fetchUserEvents(username)

const formattedEvents = aggregateEvents(events)

displayEvents(formattedEvents)
