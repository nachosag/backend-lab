import { type Events } from './api.js'

interface EventDetail {
  count: number
  action?: string
  ref?: string
  ref_type?: string
}

export type RepoStats = {
  [repo: string]: {
    [event: string]: EventDetail
  }
}

export function aggregateEvents (events: Events): RepoStats {
  const formattedEvents: RepoStats = events.reduce((acc: RepoStats, event) => {
    const repo = event.repo.name

    if (!acc[repo]) {
      acc[repo] = {}
    }

    const type = event.type

    if (!acc[repo][type]) {
      acc[repo][type] = { count: 0 }
    }

    acc[repo][type].count++

    if (event.payload.action) {
      acc[repo][type].action = event.payload.action
    }

    if (event.payload.ref) {
      acc[repo][type].ref = event.payload.ref
    }

    if (event.payload.ref_type) {
      acc[repo][type].ref_type = event.payload.ref_type
    }

    return acc
  }, {} as RepoStats)

  return formattedEvents
}

export const EVENT_MESSAGES = {
  PushEvent: { template: '- Pushed {count} commits to {repo}' },
  WatchEvent: { template: '- Starred {repo}' },
  IssuesEvent: { template: '- {action} an issue in {repo}' },
  PullRequestEvent: { template: '- {action} a PR in {repo}' },
  CreateEvent: { template: '- Created {count} {ref_type} {ref} in {repo}' },
  DeleteEvent: { template: '- Deleted {count} {ref_type} {ref} in {repo}' },
  ForkEvent: { template: '- Forked' },
  IssueCommentEvent: { template: '- Commented on issue in' },
  CommitCommentEvent: { template: '- Commented on commit in' },
  PullRequestReviewEvent: { template: '- Reviewed PR in' },
  PullRequestReviewCommentEvent: { template: '- Reviewed PR comment in' },
  ReleaseEvent: { template: '- {ref_type} release in' },
  MemberEvent: { template: '- Added collaborator to' },
  PublicEvent: { template: '- Made repo {repo} public' },
  DiscussionEvent: { template: '- {ref_type} discussion in' },
  GollumEvent: { template: '- Edited wiki in' }
} as const

export function formatMessage (template: string, data: Record<string, string | number>): string {
  let result = template

  for (const [key, value] of Object.entries(data)) {
    const stringValue = String(value)

    if (key === 'action') {
      result = result.replace(`{${key}}`, stringValue.charAt(0) + stringValue.slice(1))
    } else {
      result = result.replace(`{${key}}`, stringValue)
    }
  }

  return result
}