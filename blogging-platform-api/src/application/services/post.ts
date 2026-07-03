import { PostNotFound } from '../../ports/errors/post.js'
import type {
  CreatePost,
  PostRepository,
  UpdatePost,
} from '../../ports/repositories/post.js'

export class PostService {
  constructor(private repository: PostRepository) {}

  async create(data: CreatePost) {
    return this.repository.create(data)
  }

  async findAll(params?: { term: string }) {
    return this.repository.findAll(params)
  }

  async findById(params: { id: string }) {
    const post = await this.repository.findById({ id: params.id })

    if (!post) throw new PostNotFound(params.id)

    return post
  }

  async update(params: { id: string }, data: UpdatePost) {
    const post = await this.repository.findById(params)

    if (!post) throw new PostNotFound(params.id)

    return this.repository.update(params, data)
  }

  async delete(params: { id: string }) {
    const post = await this.repository.findById(params)

    if (!post) throw new PostNotFound(params.id)

    const result = await this.repository.delete({ id: params.id })

    return result
  }
}
