import express from 'express'

import { PostController } from './adapters/inbound/controllers/post.js'
import { errorHandler } from './adapters/inbound/middlewares/error-handler.js'
import { postRoutes } from './adapters/inbound/routes/post.js'
import { Connection } from './adapters/outbound/database/mongodb.js'
import { MongoDB } from './adapters/outbound/repositories/mongodb.js'
import { PostService } from './application/services/post.js'

const connection = await new Connection().getConnection()
const repo = new MongoDB(connection)
await repo.init()
const service = new PostService(repo)
const controller = new PostController(service)
const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use('/api', postRoutes(controller))
app.use(errorHandler)

app.listen(Number(PORT), () => {
  console.log('Server running...')
})
