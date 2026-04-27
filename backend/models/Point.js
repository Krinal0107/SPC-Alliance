const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
  pointId: {
    type: String,
    unique: true,
  },
  northing: { type: Number, required: true },
  easting:  { type: Number, required: true },
  elevation: { type: Number, default: 0 },
  state:    { type: String, required: true },
  zone:     { type: String, default: '' },
  county:   { type: String, default: '' },
  description: { type: String, default: '' },
  datum:    { type: String, default: 'NAD83(2011)' },
  equipment:{ type: String, default: '' },
  accuracy: { type: String, default: '' },
  tags:     [String],
  price:    { type: Number, required: true, default: 10 },
  // Ownership
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Verification
  verified: { type: Boolean, default: false },
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },
  // Stats
  purchaseCount: { type: Number, default: 0 },
  totalRevenue:  { type: Number, default: 0 },
  // HCS
  hcsTopicId:   { type: String, default: '' },
  hcsTxHash:    { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
}, {
  timestamps: true,
})

// Auto-generate point ID before save
pointSchema.pre('save', async function (next) {
  if (!this.pointId) {
    const stateCode = this.state.slice(0, 2).toUpperCase()
    const count = await mongoose.model('Point').countDocuments()
    this.pointId = `SPC-${stateCode}-${String(count + 1).padStart(3, '0')}`
  }
  next()
})

module.exports = mongoose.model('Point', pointSchema)
