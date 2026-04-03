const args = process.argv.slice(2)
const username = args[0]

if (!username) {
  console.error('Error: Username is required')
  process.exit(1)
}

const response = await fetch(`https://api.github.com/users/${username}/events`)

if (!response.ok) {
  console.error('Error fetching data from GitHub API:', response.statusText)
  process.exit(1)
}

const events = await response.json()

interface EventDetail {
  count: number,
  action?: string,
  ref: string
  ref_type?: string
}

type RepoStats = {
  [repo: string]: {
    [event: string]: EventDetail
  }
}

const formattedEvents: RepoStats = events.reduce((acc: any, event: any) => {
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
}, {})

const EVENT_MESSAGES = {
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

function formatMessage (template: string, data: Record<string, string | number>): string {
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

for (const [repo, events] of Object.entries(formattedEvents)) {
  for (const [type, details] of Object.entries(events)) {
    const { template } = EVENT_MESSAGES[type as keyof typeof EVENT_MESSAGES]
    const data = {
      ...details,
      repo: repo
    }

    const message = formatMessage(template, data)

    console.log(message)
  }
}
