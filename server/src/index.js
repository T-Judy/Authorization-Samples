import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import basicRoutes from './routes/basic.js'
import bearerRoutes from './routes/bearer.js'
import jwtRoutes from './routes/jwt.js'

const app = express()
const PORT = process.env.PORT || 3000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/basic', basicRoutes)
app.use('/api/bearer', bearerRoutes)
app.use('/api/jwt', jwtRoutes)

// Fallback JSON 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Auth demo server listening on http://localhost:${PORT}`)
  console.log(`Accepting requests from ${CLIENT_ORIGIN}`)
})
