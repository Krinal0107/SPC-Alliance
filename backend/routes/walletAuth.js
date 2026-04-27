const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

/**
 * @route POST /auth/wallet/verify
 * @desc Verify wallet signature and create/update user
 */
router.post('/wallet/verify', async (req, res) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields: address, signature, message' });
    }

    // Verify the signature
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Check if signature matches the claimed address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ error: 'Signature does not match wallet address' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: address.toLowerCase() });

    if (!user) {
      // Create new user
      user = new User({
        walletAddress: address.toLowerCase(),
        username: `user_${address.slice(2, 8)}`, // Generate default username
        email: `${address.toLowerCase()}@blockchain.local`, // Placeholder email
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, address: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error('Wallet verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /auth/wallet/:address
 * @desc Get nonce for signing (to prevent replay attacks)
 */
router.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Generate a nonce for this signing session
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const message = `Sign this message to authenticate with SPC Alliance:\n\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

    res.json({
      message,
      nonce,
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /auth/wallet/link
 * @desc Link wallet to existing user account (requires authentication)
 */
router.post('/wallet/link', async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    const userId = req.user?.id; // From JWT middleware

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!address || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify signature
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ error: 'Signature does not match wallet address' });
    }

    // Update user with wallet address
    const user = await User.findByIdAndUpdate(
      userId,
      { walletAddress: address.toLowerCase() },
      { new: true }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error('Wallet linking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
