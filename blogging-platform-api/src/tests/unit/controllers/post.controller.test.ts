import type { Response, Request } from 'express'
import { it, describe, expect, vi } from 'vitest'

import { PostController } from '../../../adapters/inbound/controllers/post.js'
import { PostService } from '../../../application/services/post.js'
import type { Post } from '../../../ports/entities/post.js'
import { PostNotFound } from '../../../ports/errors/post.js'

describe('PostController', () => {
  it('should be a function', () => {
    expect(PostController).toBeInstanceOf(Function)
  })
  it('should have a create method', () => {
    expect(typeof PostController.prototype.create).toBe('function')
  })
  it('should have a findAll method', () => {
    expect(typeof PostController.prototype.findAll).toBe('function')
  })
  it('should have a findById method', () => {
    expect(typeof PostController.prototype.findById).toBe('function')
  })
  it('should have a update method', () => {
    expect(typeof PostController.prototype.update).toBe('function')
  })
  it('should have a delete method', () => {
    expect(typeof PostController.prototype.delete).toBe('function')
  })
})

describe('PostController.create', () => {
  it('should create a post and respond with 201 code', async () => {
    const expectedPost = aPost()
    const service = makeService()
    service.create.mockResolvedValue(expectedPost)

    const body = {
      title: 'test',
      content: 'test',
      category: 'cat',
      tags: ['t'],
    }
    const req = makeReq(body)
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)

    await controller.create(req, res)

    expect(service.create).toHaveBeenCalledWith(body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expectedPost)
  })
})

describe('PostController.findById', () => {
  it('should find a post by id and respond with 200', async () => {
    const expectedPost = aPost()
    const service = makeService()
    service.findById.mockResolvedValue(expectedPost)

    const req = makeReq({}, { id: 'abc123' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.findById(req, res)

    expect(service.findById).toHaveBeenCalledWith({ id: 'abc123' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expectedPost)
  })

  it('should respond with 404 when post is not found', async () => {
    const service = makeService()
    service.findById.mockRejectedValue(new PostNotFound('abc123'))

    const req = makeReq({}, { id: 'abc123' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.findById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Post with id abc123 was not found',
    })
  })
})

describe('PostController.findAll', () => {
  it('should find all posts and respond with 200', async () => {
    const expectedPosts = [aPost()]
    const service = makeService()
    service.findAll.mockResolvedValue(expectedPosts)

    const req = makeReq({}, {}, {})
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.findAll(req, res)

    expect(service.findAll).toHaveBeenCalledWith()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expectedPosts)
  })

  it('should forward term when query.term is present', async () => {
    const expectedPosts = [aPost()]
    const service = makeService()
    service.findAll.mockResolvedValue(expectedPosts)

    const req = makeReq({}, {}, { term: 'typescript' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.findAll(req, res)

    expect(service.findAll).toHaveBeenCalledWith({ term: 'typescript' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expectedPosts)
  })
})

describe('PostController.update', () => {
  it('should update a post and respond with 200', async () => {
    const expectedPost = aPost({ title: 'updated-title' })
    const service = makeService()
    service.update.mockResolvedValue(expectedPost)

    const body = { title: 'updated-title' }
    const req = makeReq(body, { id: 'abc123' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.update(req, res)

    expect(service.update).toHaveBeenCalledWith({ id: 'abc123' }, body)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expectedPost)
  })

  it('should respond with 404 when post to update is not found', async () => {
    const service = makeService()
    service.update.mockRejectedValue(new PostNotFound('abc123'))

    const body = { title: 'updated-title' }
    const req = makeReq(body, { id: 'abc123' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.update(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Post with id abc123 was not found',
    })
  })
})

describe('PostController.delete', () => {
  it('should delete a post and respond with 204', async () => {
    const service = makeService()
    service.delete.mockResolvedValue(true)

    const req = makeReq({}, { id: 'abc123' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.delete(req, res)

    expect(service.delete).toHaveBeenCalledWith({ id: 'abc123' })
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.end).toHaveBeenCalled()
  })

  it('should respond with 404 when post to delete is not found', async () => {
    const service = makeService()
    service.delete.mockRejectedValue(new PostNotFound('abc123'))

    const req = makeReq({}, { id: 'abc123' })
    const res = makeRes()

    const controller = new PostController(service as unknown as PostService)
    await controller.delete(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Post with id abc123 was not found',
    })
  })
})

const makeService = () => ({
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
})

const makeRes = () =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    end: vi.fn(),
  }) as unknown as Response

const makeReq = (
  body: Record<string, unknown> = {},
  params: Record<string, string> = {},
  query: Record<string, string> = {},
) =>
  ({
    body,
    params,
    query,
  }) as Request

const aPost = (overrides: Partial<Post> = {}): Post => {
  const testDate = new Date()
  return {
    id: 'abc123',
    title: 'test-title',
    content: 'test-content',
    category: 'test-category',
    tags: ['test-tag-1'],
    createdAt: testDate,
    updatedAt: testDate,
    ...overrides,
  }
}
