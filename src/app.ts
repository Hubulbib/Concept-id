import express from 'express'
import { dbConnect } from './infrastructure/db'
import 'dotenv/config.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRouter from './infrastructure/routers/UserRouter/user.router.js'
import authRouter from './infrastructure/routers/AuthRouter/auth.router.js'
import { ErrorMiddleware } from './infrastructure/middlewares/ErrorMiddleware/error.middleware.js'

const app = express()
const PORT = process.env.PORT

// dbs
await dbConnect()

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
