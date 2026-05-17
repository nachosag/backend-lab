import { PostService } from '../../../application/services/post.js'
import { expect, vi } from 'vitest'


describe( 'PostService', () => {
  it( 'should create a post and return it', async () => {
    const testDate = new Date( '2026-01-01' )
    const expectedPost = {
      id: 'abc123',
      title: 'test-title',
      content: 'test-content',
      category: 'test-category',
      tags: [ 'test-tag-1', 'test-tag-2' ],
      createdAt: testDate,
      updatedAt: testDate
    }

    const mockRepo = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    mockRepo.create.mockResolvedValue( expectedPost )

    const service = new PostService( mockRepo )

    const data = {
      title: 'test-title',
      content: 'test-content',
      category: 'test-category',
      tags: [ 'test-tag-1', 'test-tag-2' ]
    }

    const result = await service.create( data )

    expect( result ).toEqual( expectedPost )
    expect( mockRepo.create ).toHaveBeenCalledWith( data )
  } )
} )
