import type { Db, ObjectId } from 'mongodb'
import type { Post } from '../../domain/entities/post.js'
import type { CreatePost, PostRepository, UpdatePost } from '../../domain/repositories/post.js'

export class MongoDB implements PostRepository {
  private connection: Db

  constructor ( connection: Db ) {
    this.connection = connection
  }

  async create ( data: CreatePost ): Promise<Post> {
    const creationDate = new Date()

    const results = await this.connection.collection( 'posts' ).insertOne( {
      ...data,
      updatedAt: creationDate,
      createdAt: creationDate
    } )

    return {
      id: results.insertedId.toString(),
      ...data,
      createdAt: creationDate,
      updatedAt: creationDate
    }
  }

  async findAll ( _params?: { term: string } ): Promise<Post[]> {
    const cursor = this.connection.collection<PostDocument>( 'posts' ).find()
    const results = await cursor.toArray()

    const posts = this.mapResultsToPosts( results )

    return posts
  }

  async findById ( _params: { id: string } ): Promise<Post | null> {
    throw new Error( 'Not implemented' )
  }

  async update ( _params: { id: string }, _data: UpdatePost ): Promise<Post | null> {
    throw new Error( 'Not implemented' )
  }

  async delete ( _params: { id: string } ): Promise<boolean> {
    throw new Error( 'Not implemented' )
  }

  private mapResultsToPosts ( results: PostDocument[] ): Post[] {
    return results.map( ( post ) => {
      const { _id, ...rest } = post
      return {
        ...rest, // Primero esparzo el documento
        id: post._id.toString() // Después piso el _id con id
        // El orden importa
      }
    } )
  }

}

type PostDocument = {
  _id: ObjectId
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
