import { expect, vi } from 'vitest'

import { PostService } from '../../../application/services/post.js'
import type { Post } from '../../../ports/entities/post.js'
import { PostNotFound } from '../../../ports/errors/post.js'
import type { PostRepository } from '../../../ports/repositories/post.js'

describe('PostService', () => {
  it('should create a post and return it', async () => {
    const expectedPost = aPost()

    const mockRepo = makeRepo()
    mockRepo.create.mockResolvedValue(expectedPost)

    const service = makeService(mockRepo)

    const data = {
      title: 'test-title',
      content: 'test-content',
      category: 'test-category',
      tags: ['test-tag-1', 'test-tag-2'],
    }

    const result = await service.create(data)

    expect(result).toEqual(expectedPost)
    expect(mockRepo.create).toHaveBeenCalledWith(data)
  })

  it('should return all existing posts', async () => {
    const expectedPost = aPost()

    const mockRepo = makeRepo()
    mockRepo.findAll.mockResolvedValue(expectedPost)

    const service = makeService(mockRepo)

    const result = await service.findAll()

    expect(result).toEqual(expectedPost)
  })

  it('should return post when exists', async () => {
    const expectedPost = aPost()

    const mockRepo = makeRepo()
    mockRepo.findById.mockResolvedValue(expectedPost)

    const service = makeService(mockRepo)

    const result = await service.findById({ id: 'abc123' })

    expect(result).toEqual(expectedPost)
    expect(mockRepo.findById).toHaveBeenCalledWith({ id: 'abc123' })
  })

  it('should throw PostNotFound when post does not exists', async () => {
    const mockRepo = makeRepo()
    mockRepo.findById.mockResolvedValue(null)

    const service = makeService(mockRepo)

    await expect(service.findById({ id: 'abc123' })).rejects.toThrow(
      PostNotFound,
    )
  })

  it('should update post if found', async () => {
    const currentPost = aPost({
      id: 'abc123',
      category: 'current-category',
      content: 'current-content',
      title: 'current-title',
      tags: ['current-tag'],
    })
    const updatedPost = aPost({
      id: 'abc123',
      category: 'new-category',
      content: 'new-content',
      title: 'new-title',
      tags: ['new-tag'],
    })

    const mockRepo = makeRepo()
    const service = makeService(mockRepo)

    mockRepo.findById.mockResolvedValue(currentPost)
    mockRepo.update.mockResolvedValue(updatedPost)

    const result = await service.update({ id: currentPost.id }, updatedPost)

    expect(result).toEqual(updatedPost)
    expect(mockRepo.update).toHaveBeenCalledWith(
      { id: updatedPost.id },
      updatedPost,
    )
  })

  it('should throw PostNotFound when post does not exists', async () => {
    const mockRepo = makeRepo()
    const service = makeService(mockRepo)

    mockRepo.findById.mockResolvedValue(null)

    await expect(
      service.update(
        { id: 'abc123' },
        {
          category: 'new-category',
          content: 'new-content',
          title: 'new-title',
          tags: ['new-tag'],
        },
      ),
    ).rejects.toThrow(PostNotFound)
  })

  it('should delete if post is found', async () => {
    const currentPost = aPost({
      id: 'abc123',
      category: 'current-category',
      content: 'current-content',
      title: 'current-title',
      tags: ['current-tag'],
    })

    const mockRepo = makeRepo()
    const service = makeService(mockRepo)

    mockRepo.findById.mockResolvedValue(currentPost)
    mockRepo.delete.mockResolvedValue(true)

    const result = await service.delete({ id: currentPost.id })

    expect(result).toBe(true)
    expect(mockRepo.delete).toHaveBeenCalledWith({ id: currentPost.id })
  })

  it('should throw PostNotFound when post does not exists', async () => {
    const mockRepo = makeRepo()
    const service = makeService(mockRepo)

    mockRepo.findById.mockResolvedValue(null)

    await expect(service.delete({ id: 'abc123' })).rejects.toThrow(PostNotFound)
  })
})

const makeRepo = () => ({
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
})

const makeService = (repo: PostRepository) => new PostService(repo)

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
