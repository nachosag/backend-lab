import { EVENT_MESSAGES, formatMessage, type RepoStats } from './parser.js'

export function displayEvents(stats: RepoStats) {
  for (const [repo, events] of Object.entries(stats)) {
    for (const [type, details] of Object.entries(events)) {
      const { template } = EVENT_MESSAGES[type as keyof typeof EVENT_MESSAGES]
      const data = {
        ...details,
        repo: repo,
      }

      const message = formatMessage(template, data)

      console.log(message)
    }
  }
}
