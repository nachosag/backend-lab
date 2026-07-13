import type { Request, Response } from 'express'

import { PostService } from '../../../application/services/post.js'
import { PostNotFound } from '../../../ports/errors/post.js'

export class PostController {
  constructor(private service: PostService) {
    if (!service) throw new TypeError('Missing Dependency')
  }

  async create(req: Request, res: Response) {
    const post = await this.service.create(req.body)
    return res.status(201).json(post)
  }

  async findById(req: Request, res: Response) {
    try {
      const id = req.params.id as string
      const post = await this.service.findById({ id })
      return res.status(200).json(post)
    } catch (error) {
      if (error instanceof PostNotFound) {
        return res.status(404).json({ error: error.message })
      }
      throw error
    }
  }

  async findAll(req: Request, res: Response) {
    const term = req.query.term as string | undefined
    const posts = term
      ? await this.service.findAll({ term })
      : await this.service.findAll()
    return res.status(200).json(posts)
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string
      const post = await this.service.update({ id }, req.body)
      return res.status(200).json(post)
    } catch (error) {
      if (error instanceof PostNotFound) {
        return res.status(404).json({ error: error.message })
      }
      throw error
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string
      await this.service.delete({ id })
      return res.status(204).end()
    } catch (error) {
      if (error instanceof PostNotFound) {
        return res.status(404).json({ error: error.message })
      }
      throw error
    }
  }
}
