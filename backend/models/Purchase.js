const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  point: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Point',
    required: true,
  },
  amount: { type: Number, required: true },
  ownerEarning:    { type: Number },
  verifierEarning: { type: Number },
  platformEarning: { type: Number },
  txHash: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'completed',
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Purchase', purchaseSchema)
