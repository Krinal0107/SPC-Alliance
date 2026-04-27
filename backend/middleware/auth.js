const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    let token

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    // Also check cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password -refreshToken')

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' })
    }

    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' })
  }
}

module.exports = { protect }
