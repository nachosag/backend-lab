import { PostNotFound } from '../../ports/errors/post.js'
import type { CreatePost, PostRepository, UpdatePost } from '../../ports/repositories/post.js'

export class PostService {
  constructor ( private repository: PostRepository ) { }

  async create ( data: CreatePost ) {
    return this.repository.create( data )
  }

  async findAll ( params?: { term: string } ) {
    throw new Error( 'Not implemented method yet' )
  }

  async findById ( params: { id: string } ) {
    throw new PostNotFound( params.id )
  }

  async update ( params: { id: string }, data: UpdatePost ) {
    throw new PostNotFound( params.id )
  }

  async delete ( params: { id: string } ) {
    throw new PostNotFound( params.id )
  }
}
