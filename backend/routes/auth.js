const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

// ── Helpers ──────────────────────────────────────────────
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

const sendTokens = (res, user, statusCode = 200) => {
  const { accessToken, refreshToken } = generateTokens(user._id)

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      firmName: user.firmName,
      role: user.role,
      avatar: user.avatar,
      walletAddress: user.walletAddress,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      totalPointsUploaded: user.totalPointsUploaded,
      isVerified: user.isVerified,
    },
  })
}

// ── POST /auth/signup ─────────────────────────────────────
router.post('/signup', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('firmName').notEmpty().withMessage('Firm name required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password, firmName, role, name } = req.body

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' })
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
      firmName,
      name: name || firmName,
      role: role || 'owner',
    })

    // Generate Web3 wallet
    user.generateWallet()

    await user.save()

    sendTokens(res, user, 201)
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ success: false, message: 'Server error during signup.' })
  }
})

// ── POST /auth/signin ─────────────────────────────────────
router.post('/signin', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email.' })
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in. Please use Google.' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' })
    }

    sendTokens(res, user)
  } catch (err) {
    console.error('Signin error:', err)
    res.status(500).json({ success: false, message: 'Server error during signin.' })
  }
})

// ── POST /auth/refresh ────────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token.' })

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' })

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
    res.json({ success: true, accessToken })
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' })
  }
})

// ── POST /auth/logout ─────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ success: true, message: 'Logged out.' })
})

// ── GET /auth/me ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user })
})

// ── GOOGLE OAUTH ──────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed` }),
  (req, res) => {
    const { accessToken } = generateTokens(req.user._id)
    // Redirect to frontend with token in URL (frontend will store it)
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`)
  }
)

// ── POST /auth/forgot-password ────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal whether user exists
      return res.json({ success: true, message: 'If this email exists, a reset link was sent.' })
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    // In production: send email with nodemailer
    console.log(`Password reset token for ${email}: ${resetToken}`)

    res.json({ success: true, message: 'If this email exists, a reset link was sent.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ── POST /auth/reset-password ─────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset link invalid or expired.' })
    }

    user.password = newPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    res.json({ success: true, message: 'Password reset successfully. Please sign in.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

module.exports = router
