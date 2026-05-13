import type { Post } from "../entities/post.js"

export interface PostRepository {
  create ( data: {
    title: string
    content: string
    category: string
    tags: string[]
  } ): Promise<Post>

  update (
    params: { id: string },
    data: { title: string; content: string; category: string; tags: string[] },
  ): Promise<Post | null>

  delete ( params: { id: string } ): Promise<boolean>

  findById ( params: { id: string } ): Promise<Post | null>

  findAll ( params?: { term: string } ): Promise<Post[]>
}
