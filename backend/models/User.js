const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  firmName: {
    type: String,
    trim: true,
    default: '',
  },
  role: {
    type: String,
    enum: ['owner', 'surveyor', 'technician', 'admin'],
    default: 'surveyor',
  },
  // Google OAuth
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: '',
  },
  // Wallet
  walletAddress: {
    type: String,
    default: '',
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  // Account status
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Stats
  totalPointsUploaded: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  // Tokens
  refreshToken: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
})

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate fake wallet address for demo
userSchema.methods.generateWallet = function () {
  const chars = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)]
  this.walletAddress = addr
}

module.exports = mongoose.model('User', userSchema)
