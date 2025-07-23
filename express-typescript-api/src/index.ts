import express from 'express'
import diaryRouter from './routes/diaries'

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json()) // middleware que transforma la req.body
app.use('/api/diaries', diaryRouter)

app.get('/ping', (_, res) => {
  console.log('Someone pinged here!!')
  res.send('pong')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
