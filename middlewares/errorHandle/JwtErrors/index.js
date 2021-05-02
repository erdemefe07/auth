const jwt = require('jsonwebtoken')
const redis = require('@redis')

const JwtError = async (err, req, res, next) => {
  if (err.name == 'TokenExpiredError') {
    const { username, identifier } = jwt.decode(req.cookies.token)
    res.cookie('token', '', { maxAge: 0 })
    redis.hdel(username, identifier)
  }

  return res.status(401).json({ message: 'login required' })
}

module.exports = JwtError