const { verifyToken } = require('@clerk/express')

// Middleware to verify token and extract userId
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Please sign in.' 
      })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token with Clerk using the verifyToken utility
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })
    
    if (!payload || !payload.sub) {
      return res.status(401).json({ 
        error: 'Invalid token. Please sign in again.' 
      })
    }

    // Attach userId to request for use in routes
    req.userId = payload.sub
    next()

  } catch (err) {
    console.error('Auth error:', err.message)
    return res.status(401).json({ 
      error: 'Authentication failed. Please sign in again.' 
    })
  }
}

module.exports = { authenticate }
