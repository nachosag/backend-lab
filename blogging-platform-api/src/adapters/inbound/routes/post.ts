import { Router } from 'express'

import type { PostController } from '../controllers/post.js'

export function postRoutes(controller: PostController): Router {
  const router = Router()

  router.get('/posts', (req, res) => controller.findAll(req, res))
  router.get('/posts/:id', (req, res) => controller.findById(req, res))
  router.post('/posts', (req, res) => controller.create(req, res))
  router.put('/posts/:id', (req, res) => controller.update(req, res))
  router.delete('/posts/:id', (req, res) => controller.delete(req, res))

  return router
}
