import { describe, it, vi, expect } from 'vitest'

import type { PostController } from '../../../adapters/inbound/controllers/post.js'
import { postRoutes } from '../../../adapters/inbound/routes/post.js'

describe('PostRoutes', () => {
  it('should be a function', () => {
    expect(postRoutes).toBeInstanceOf(Function)
  })
  it('should recieve one parameter', () => {
    expect(postRoutes.length).toBe(1)
  })
  it('should return a router with 5 routes', () => {
    const controller = makeController()
    const router = postRoutes(controller)

    expect(router).toBeDefined()
    expect(router.stack.length).toBe(5)
  })
})

const makeController = () =>
  ({
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }) as unknown as PostController
