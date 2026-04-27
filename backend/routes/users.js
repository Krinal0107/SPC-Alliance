const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Point = require('../models/Point')
const Purchase = require('../models/Purchase')
const { protect } = require('../middleware/auth')

// ── GET /users/dashboard ──────────────────────────────────
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    const [uploadedPoints, purchases, recentPurchases] = await Promise.all([
      Point.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(10),
      Purchase.find({ buyer: req.user._id })
        .populate({ path: 'point', select: 'pointId state county price' })
        .sort({ createdAt: -1 }).limit(10),
      Purchase.find({ buyer: req.user._id }).countDocuments(),
    ])

    res.json({
      success: true,
      dashboard: {
        user,
        uploadedPoints,
        purchases,
        stats: {
          totalUploaded: user.totalPointsUploaded,
          totalEarnings: user.totalEarnings,
          walletBalance: user.walletBalance,
          totalPurchased: recentPurchases,
        },
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PUT /users/profile — Update profile ───────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, firmName, role } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, firmName, role },
      { new: true, runValidators: true }
    ).select('-password')
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PUT /users/change-password ────────────────────────────
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
    }

    user.password = newPassword
    await user.save()
    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /users/stats — Platform stats (public) ────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalPoints, totalUsers, totalPurchases] = await Promise.all([
      Point.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Purchase.countDocuments({ status: 'completed' }),
    ])
    res.json({ success: true, stats: { totalPoints, totalUsers, totalPurchases } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
