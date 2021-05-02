const redis = require('@redis')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies
  if (!token)
    return res.status(401).json({ message: 'login required' })

  // ilk önce jwt verify ediliyor çünkü jwt expired ise boşuna redise command gitmesin
  const user = jwt.verify(token, process.env.JWT_SECRET)
  req.user = user

  // token'in identifier'i verilen kullanıcının mı
  const verifiedToken = await redis.hexists(user.username, user.identifier)
  if (!verifiedToken)
    return res.status(401).json({ message: 'login required' })

  next()
})

const mustNotBeAuthenticated = async (req, res, next) => {
  const { token } = req.cookies
  if (token)
    return res.status(403).json({ message: 'logout required' })
  next()
}

module.exports = isAuthenticated
module.exports.mustNotBeAuthenticated = mustNotBeAuthenticated