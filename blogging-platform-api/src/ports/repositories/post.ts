import type { Post } from "../entities/post.js"

export interface PostRepository {
  create ( data: CreatePost ): Promise<Post>

  update (
    params: { id: string },
    data: UpdatePost,
  ): Promise<Post | null>

  delete ( params: { id: string } ): Promise<boolean>

  findById ( params: { id: string } ): Promise<Post | null>

  findAll ( params?: { term: string } ): Promise<Post[]>
}

export type CreatePost = {
  title: string
  content: string
  category: string
  tags: string[]
}

export type UpdatePost = {
  title: string
  content: string
  category: string
  tags: string[]
}
