import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.set('view engine', 'ejs')

// Middleware para parsear la request a json
app.use(express.json())

// Middleware para manejar las cookies
app.use(cookieParser())

// Middleware para verificar la sesion en la cookie del usuario
app.use((req, res, next) => {
  const token = req.cookies.access_token
  let data = null

  req.session = { user: null }

  try {
    data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data    
  } catch {}

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session

  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, {
      expiresIn: '1h'
    })
    res
    .cookie('access_token', token, {
      httpOnly: true, // la cookie solo se puede acceder en el servidor
      secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
      sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
      maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
    })
    .send({ user, token })
  } catch (error) {
    res.status(401).send('incorrect credentials')
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send('username is already being used')
  }
})

app.post('/logout', (req, res) => {
  res
  .clearCookie('access_token')
  .json({ message: 'Logout successful' })
 })

app.get('/protected', (req, res) => {
  const { user } = req.session

  if (!user) return res.status(403).send('Access not authorized')

  res.render('protected', user)
  
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})