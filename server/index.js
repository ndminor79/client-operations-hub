import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

const app = express()
const port = Number(process.env.PORT || 4000)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: clientOrigin, credentials: true }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'offline' })
})

app.get('/api/config', (_req, res) => {
  res.json({ appName: 'Client Operations Hub', environment: process.env.NODE_ENV || 'development' })
})

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))
app.use((error, _req, res, _next) => {
  console.error('Unhandled server error', error)
  res.status(500).json({ error: 'Something went wrong' })
})

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 1500 })
      console.log('MongoDB connected')
    } catch {
      console.warn('MongoDB unavailable; running in API demo mode')
    }
  }
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
}

start()
