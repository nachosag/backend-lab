import { describe, expect, it } from 'vitest'

import {
  createPostSchema,
  updatePostSchema,
} from '../../../adapters/inbound/validation/post.js'
import type { CreatePost } from '../../../ports/repositories/post.js'

describe('createPostSchema', () => {
  it('should be a function', () => {
    expect(createPostSchema).toBeInstanceOf(Function)
  })

  it('should accept an argument', () => {
    expect(createPostSchema.length).toBe(1)
  })

  it('should return a boolean', () => {
    const result = createPostSchema(validPost())
    expect(result).toBeTypeOf('boolean')
  })

  it('should return false if data is not valid', () => {
    const post = validPost()
    const result = createPostSchema({
      category: post.category,
      title: post.title,
      content: post.content,
    })
    expect(result).toBe(false)
  })

  it('should not have an empty title', () => {
    expect(createPostSchema(validPost({ title: '' }))).toBe(false)
  })

  it('should not have a title with more than 200 characters', () => {
    expect(createPostSchema(validPost({ title: 'a'.repeat(201) }))).toBe(false)
  })

  it('should not have an empty content', () => {
    expect(createPostSchema(validPost({ content: '' }))).toBe(false)
  })

  it('should not have a content with more than 10000 characters', () => {
    expect(createPostSchema(validPost({ content: 'a'.repeat(10001) }))).toBe(
      false,
    )
  })

  it('should not have an empty category', () => {
    expect(createPostSchema(validPost({ category: '' }))).toBe(false)
  })

  it('should not have a category with more than 50 characters', () => {
    expect(createPostSchema(validPost({ category: 'a'.repeat(51) }))).toBe(
      false,
    )
  })

  it('should not have empty tags', () => {
    expect(createPostSchema(validPost({ tags: [] }))).toBe(false)
  })
})

describe('updatePostSchema', () => {
  it('should be a function', () => {
    expect(updatePostSchema).toBeInstanceOf(Function)
  })

  it('should accept an argument', () => {
    expect(updatePostSchema.length).toBe(1)
  })

  it('should return a boolean', () => {
    const result = updatePostSchema({})
    expect(result).toBeTypeOf('boolean')
  })

  it('should not have an empty title', () => {
    expect(updatePostSchema({ title: '' })).toBe(false)
  })

  it('should not have a title with more than 200 characters', () => {
    expect(updatePostSchema({ title: 'a'.repeat(201) })).toBe(false)
  })

  it('should not have an empty content', () => {
    expect(updatePostSchema({ content: '' })).toBe(false)
  })

  it('should not have a content with more than 10000 characters', () => {
    expect(updatePostSchema({ content: 'a'.repeat(10001) })).toBe(false)
  })

  it('should not have an empty category', () => {
    expect(updatePostSchema({ category: '' })).toBe(false)
  })

  it('shoud not have a category with more than 50 characters', () => {
    expect(updatePostSchema({ category: 'a'.repeat(51) })).toBe(false)
  })

  it('should have at least one tag', () => {
    expect(updatePostSchema({ tags: [] })).toBe(false)
  })
})

const validPost = (overrides: Partial<CreatePost> = {}) => {
  return {
    title: 'test-title',
    content: 'test-content',
    category: 'test-category',
    tags: ['test-tag-1'],
    ...overrides,
  }
}
