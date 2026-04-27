const mongoose = require('mongoose')

const connectWithUri = async (uri) => {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  })
}

const isSrvLookupError = (error) => {
  const message = `${error?.message || ''} ${error?.cause?.message || ''}`
  return message.includes('querySrv') || message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')
}

const connectDB = async () => {
  try {
    const conn = await connectWithUri(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    if (isSrvLookupError(error) && process.env.MONGO_URI_DIRECT) {
      console.warn('SRV lookup failed. Retrying MongoDB with direct hosts...')
      try {
        const conn = await connectWithUri(process.env.MONGO_URI_DIRECT)
        console.log(`MongoDB Connected via direct hosts: ${conn.connection.host}`)
        return
      } catch (directError) {
        console.error(`MongoDB Direct Connection Error: ${directError.message}`)
        process.exit(1)
      }
    }

    console.error(`MongoDB Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
