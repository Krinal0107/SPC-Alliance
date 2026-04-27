const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_REDIRECT_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: profile.id })

    if (user) {
      return done(null, user)
    }

    // Check if email already registered
    const email = profile.emails?.[0]?.value
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() })
      if (user) {
        // Link Google ID to existing account
        user.googleId = profile.id
        user.avatar = profile.photos?.[0]?.value || ''
        await user.save()
        return done(null, user)
      }
    }

    // Create new user
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: email?.toLowerCase() || '',
      firmName: '',
      avatar: profile.photos?.[0]?.value || '',
      isVerified: true, // Google accounts are pre-verified
    })
    newUser.generateWallet()
    await newUser.save()

    return done(null, newUser)
  } catch (err) {
    return done(err, null)
  }
}))

module.exports = passport
