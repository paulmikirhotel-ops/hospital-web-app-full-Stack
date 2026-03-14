const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token

  // Check Authorization header first (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // Fallback to cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Login required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    console.log('Verified user:', decoded)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid session' })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: Admins only' })
  }
}


module.exports = { verifyToken, isAdmin }