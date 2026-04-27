const express = require('express')
const router = express.Router()
const Point = require('../models/Point')
const Purchase = require('../models/Purchase')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

// ── GET /points — Public marketplace listing ──────────────
router.get('/', async (req, res) => {
  try {
    const { state, verified, search, sort = 'recent', page = 1, limit = 20 } = req.query

    const filter = { isActive: true }
    if (state && state !== 'All States') filter.state = state
    if (verified === 'true') filter.verified = true
    if (search) {
      filter.$or = [
        { pointId: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { county: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const sortMap = {
      recent: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { purchaseCount: -1 },
    }

    const points = await Point.find(filter)
      .populate('owner', 'firmName name email')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Point.countDocuments(filter)

    res.json({ success: true, points, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /points/:id ───────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const point = await Point.findOne({ pointId: req.params.id })
      .populate('owner', 'firmName name email walletAddress')
    if (!point) return res.status(404).json({ success: false, message: 'Point not found.' })
    res.json({ success: true, point })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /points — Upload a point (auth required) ─────────
router.post('/', protect, async (req, res) => {
  try {
    const {
      northing, easting, elevation, state, zone, county,
      description, datum, equipment, accuracy, tags, price,
    } = req.body

    if (!northing || !easting || !state) {
      return res.status(400).json({ success: false, message: 'northing, easting, and state are required.' })
    }

    const point = await Point.create({
      northing, easting, elevation,
      state, zone, county, description,
      datum: datum || 'NAD83(2011)',
      equipment, accuracy,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      price: parseFloat(price) || 10,
      owner: req.user._id,
      // Mock HCS recording for demo
      hcsTxHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      hcsTopicId: `0.0.${Math.floor(Math.random() * 900000 + 100000)}`,
    })

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalPointsUploaded: 1 } })

    await point.populate('owner', 'firmName name')
    res.status(201).json({ success: true, point })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /points/:id/purchase ─────────────────────────────
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const point = await Point.findOne({ pointId: req.params.id }).populate('owner')
    if (!point) return res.status(404).json({ success: false, message: 'Point not found.' })
    if (point.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot buy your own point.' })
    }

    // Revenue split: 70% owner, 15% verifier (to platform if unverified), 15% platform
    const ownerEarning    = point.price * 0.70
    const verifierEarning = point.price * 0.15
    const platformEarning = point.price * 0.15

    // Create purchase record
    const purchase = await Purchase.create({
      buyer: req.user._id,
      point: point._id,
      amount: point.price,
      ownerEarning,
      verifierEarning,
      platformEarning,
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    })

    // Update point stats
    point.purchaseCount += 1
    point.totalRevenue += point.price
    await point.save()

    // Credit owner earnings
    await User.findByIdAndUpdate(point.owner._id, {
      $inc: { totalEarnings: ownerEarning, walletBalance: ownerEarning },
    })

    res.json({ success: true, purchase, message: 'Purchase successful! Coordinates unlocked.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /points/my/uploads — My uploaded points ───────────
router.get('/my/uploads', protect, async (req, res) => {
  try {
    const points = await Point.find({ owner: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, points })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /points/my/purchases — Points I purchased ─────────
router.get('/my/purchases', protect, async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user._id })
      .populate({ path: 'point', populate: { path: 'owner', select: 'firmName' } })
      .sort({ createdAt: -1 })
    res.json({ success: true, purchases })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
