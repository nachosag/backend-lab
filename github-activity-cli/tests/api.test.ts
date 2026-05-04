import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUserEvents } from '../src/api'


describe('fetchUserEvents', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ type: 'PushEvent', repo: { name: 'user/repo' }, payload: {} }]
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return parsed events', async () => {
    const result = await fetchUserEvents('nachosag')
    expect(result).toHaveLength(1)
    expect(result[0].payload).toEqual({})
    expect(result[0].repo).toEqual({ 'name': 'user/repo' })
    expect(result[0].type).toBe('PushEvent')
  })

  it('should throw error (404)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404
    } as Response)

    await expect(fetchUserEvents('noRealUser')).rejects.toThrow('Error fetching data')
  })

  it('should throw error on rate limit (403)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403
    } as Response)

    await expect(fetchUserEvents('nachosag')).rejects.toThrow('Error fetching data')
  })

  it('should throw a validation error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Not Found' })
    } as Response)

    await expect(fetchUserEvents('nachosag')).rejects.toThrow('Invalid response from GitHub API')
  })

  it('should throw error if an event a missing field', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ type: 'PushEvent', payload: {} }]
    } as Response)

    await expect(fetchUserEvents('nachosag')).rejects.toThrow('Invalid response from GitHub API')
  })
})