import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

await connectCloudinary()

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
app.use(express.json())

if (process.env.CLERK_SECRET_KEY) {
  app.use('/api', clerkMiddleware())
} else {
  app.use('/api', (req, res, next) => next())
}

app.get('/', (req, res) => res.send('Server is Live!'))

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on port', PORT)
  })
}

export default (req, res) => app(req, res)
