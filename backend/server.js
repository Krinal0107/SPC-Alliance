require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
require('./config/passport') // Initialize passport strategies

const app = express()
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// ── Connect Database ──────────────────────────────────────
connectDB()

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Routes ────────────────────────────────────────────────
app.use('/auth',   require('./routes/auth'))
app.use('/points', require('./routes/points'))
app.use('/users',  require('./routes/users'))

// ── Health check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🗺️ SPC Alliance API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup:         'POST /auth/signup',
        signin:         'POST /auth/signin',
        logout:         'POST /auth/logout',
        refresh:        'POST /auth/refresh',
        me:             'GET  /auth/me',
        google:         'GET  /auth/google',
        forgotPassword: 'POST /auth/forgot-password',
        resetPassword:  'POST /auth/reset-password',
      },
      points: {
        list:      'GET  /points',
        get:       'GET  /points/:id',
        upload:    'POST /points',
        purchase:  'POST /points/:id/purchase',
        myUploads: 'GET  /points/my/uploads',
        myBought:  'GET  /points/my/purchases',
      },
      users: {
        dashboard:      'GET  /users/dashboard',
        updateProfile:  'PUT  /users/profile',
        changePassword: 'PUT  /users/change-password',
        stats:          'GET  /users/stats',
      },
    },
  })
})

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` })
})

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack)
  res.status(500).json({ success: false, message: err.message || 'Internal server error' })
})

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`\n🚀 SPC Alliance Backend running at http://localhost:${PORT}`)
  console.log(`📡 MongoDB: ${process.env.MONGO_URI?.split('@')[1] || 'connected'}`)
  console.log(`🌐 CORS allowed from: ${process.env.CLIENT_URL}`)
  console.log(`\nEndpoints ready:`)
  console.log(`  POST http://localhost:${PORT}/auth/signup`)
  console.log(`  POST http://localhost:${PORT}/auth/signin`)
  console.log(`  GET  http://localhost:${PORT}/auth/google`)
  console.log(`  GET  http://localhost:${PORT}/points\n`)
})
