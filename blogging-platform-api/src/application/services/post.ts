import { PostNotFound } from '../../ports/errors/post.js'
import type { CreatePost, PostRepository, UpdatePost } from '../../ports/repositories/post.js'

export class PostService {
  constructor ( private repository: PostRepository ) { }

  async create ( data: CreatePost ) {
    return this.repository.create( data )
  }

  async findAll ( params?: { term: string } ) {
    return this.repository.findAll( params )
  }

  async findById ( params: { id: string } ) {
    const post = await this.repository.findById( { id: params.id } )

    if ( !post ) throw new PostNotFound( params.id )

    return post
  }

  async update ( params: { id: string }, data: UpdatePost ) {
    throw new PostNotFound( params.id )
  }

  async delete ( params: { id: string } ) {
    throw new PostNotFound( params.id )
  }
}
