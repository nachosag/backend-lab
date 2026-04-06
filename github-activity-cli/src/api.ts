import { z } from 'zod'

export const EventSchema = z.object({
  type: z.string(),
  repo: z.object({
    name: z.string()
  }),
  payload: z.object({
    action: z.string().optional(),
    ref: z.string().optional(),
    ref_type: z.string().optional()
  })
})

export const EventsSchema = z.array(EventSchema)

export type Events = z.infer<typeof EventsSchema>

export async function fetchUserEvents (username: string): Promise<Events> {
  const response = await fetch(`https://api.github.com/users/${username}/events`)

  if (!response.ok) {
    throw new Error('Error fetching data')
  }

  const events = await response.json()

  const result = EventsSchema.safeParse(events)

  if (!result.success) {
    throw new Error(`Invalid response from GitHub API: ${result.error.message}`)
  }

  return result.data
}
