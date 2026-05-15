import { ObjectId, type Db } from 'mongodb'
import type { Post } from '../../domain/entities/post.js'
import type { CreatePost, PostRepository, UpdatePost } from '../../domain/repositories/post.js'

export class MongoDB implements PostRepository {
  private connection: Db

  constructor ( connection: Db ) {
    this.connection = connection
  }

  async create ( data: CreatePost ): Promise<Post> {
    const creationDate = new Date()

    const result = await this.connection.collection( 'posts' ).insertOne( {
      ...data,
      updatedAt: creationDate,
      createdAt: creationDate
    } )

    return {
      id: result.insertedId.toString(),
      ...data,
      createdAt: creationDate,
      updatedAt: creationDate
    }
  }

  // TODO: find by term
  async findAll ( _params?: { term: string } ): Promise<Post[]> {
    const collection = this.connection.collection<PostDocument>( 'posts' )

    const results = await collection.find().toArray()

    return this.mapResultsToPosts( results )
  }

  async findById ( _params: { id: string } ): Promise<Post | null> {
    const _id = new ObjectId( _params.id )
    const collection = this.connection.collection<PostDocument>( 'posts' )

    const result = await collection.findOne( _id )
    if ( !result ) return null

    return this.mapResultToPost( result )
  }

  async update ( _params: { id: string }, _data: UpdatePost ): Promise<Post | null> {
    const _id = new ObjectId( _params.id )
    const collection = this.connection.collection<PostDocument>( 'posts' )

    await collection.updateOne( _id, { '$set': _data } )
    const findResult = await collection.findOne( _id )
    if ( !findResult ) return null

    return this.mapResultToPost( findResult )
  }

  async delete ( _params: { id: string } ): Promise<boolean> {
    const _id = new ObjectId( _params.id )
    const collection = this.connection.collection<PostDocument>( 'posts' )

    const deleteResult = await collection.deleteOne( _id )

    return deleteResult.deletedCount === 1
  }

  private mapResultsToPosts ( results: PostDocument[] ): Post[] {
    return results.map( ( post ) => {
      const { _id, ...rest } = post
      return {
        ...rest,
        id: post._id.toString()
      }
    } )
  }

  private mapResultToPost ( result: PostDocument ): Post {
    const { _id, ...rest } = result
    return {
      ...rest,
      id: result._id.toString()
    }
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
