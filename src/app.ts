import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config.js'

import { dbConnect } from './infrastructure/db'
import { brokerConnect } from './infrastructure/broker/'
import userRouter from './infrastructure/routers/user.router.js'
import authRouter from './infrastructure/routers/auth.router.js'

import { ErrorMiddleware } from './infrastructure/middlewares/error.middleware.js'

const app = express()
const PORT = process.env.PORT

// dbs
await dbConnect()
await brokerConnect()

app.use
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:8080',
  }),
)

// API
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.use(ErrorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
