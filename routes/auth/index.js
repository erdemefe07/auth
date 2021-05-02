const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('@models')
const { authMiddleware } = require('@middlewares')
const { validate } = require('@helpers')
const { RegisterDTO } = require('./dtos')
const ms = require('ms')
const redis = require('@redis')
const requestIp = require('request-ip')
const { nanoid } = require('nanoid')

router.post('/register', validate([RegisterDTO.username, RegisterDTO.password]), asyncHandler(async (req, res) => {
  const { username, password } = req.body

  const user = new User({
    username,
    password
  })
  await user.save()

  res.status(201).end()
}))

router.post('/login', authMiddleware.mustNotBeAuthenticated, validate([RegisterDTO.username, RegisterDTO.password]), asyncHandler(async (req, res, next) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  if (!user)
    return res.status(400).json({ message: "username or password wrong" })

  const isPasswordSame = await bcrypt.compare(password, user.password);
  if (!isPasswordSame)
    return res.status(400).json({ message: "username or password wrong" })

  const identifier = nanoid()
  const token = jwt.sign({ username, identifier }, process.env.JWT_SECRET, { expiresIn: '1y' })
  res.cookie('token', token, { maxAge: ms('1y') })


  await redis.hset(username, identifier, JSON.stringify({
    ipaddress: requestIp.getClientIp(req),
    userAgent: req.get('user-agent'),
    last: Date.now()
  }))
  res.status(200).end()
}))

router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  const username = req.user.username
  const identifier = req.user.identifier

  const result = await redis.hdel(username, identifier)
  res.status(200).json({ result })
}))

// birisini logout ettir
router.post('/logout/:identifier', [authMiddleware, validate([RegisterDTO.identifier])], asyncHandler(async (req, res) => {
  const { identifier } = req.params
  const userIdentifier = req.user.identifier

  if (identifier == userIdentifier)
    return res.status(409).json({ message: 'cant log out yourself' })

  const username = req.user.username

  const result = await redis.hdel(username, identifier)
  res.status(200).json({ result })
}))

router.post('/change', [authMiddleware, validate([RegisterDTO.newPassword])], asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body
  if (password == newPassword) {
    return res.status(400).json({ message: "New password cannot be equal to current password" })
  }

  const username = req.user.username
  const user = await User.findOne({ username })

  const isPasswordSame = await bcrypt.compare(password, user.password);
  if (!isPasswordSame)
    return res.status(400).json({ message: "password is not valid" })

  user.password = newPassword
  await user.save()

  await redis.del(username)

  const identifier = nanoid()
  const token = jwt.sign({ username, identifier }, process.env.JWT_SECRET, { expiresIn: '1y' })
  res.cookie('token', token, { maxAge: ms('1y') })
  
  await redis.hset(username, identifier, JSON.stringify({
    ipaddress: requestIp.getClientIp(req),
    userAgent: req.get('user-agent'),
    last: Date.now()
  }))

  res.status(200).end()
}))

router.post('/sessions', authMiddleware, asyncHandler(async (req, res) => {
  const userIdentifier = req.user.identifier
  const sessions = await redis.hgetall('erdemefe07')
  for (const identifier in sessions) {
    if (identifier == userIdentifier)
      delete sessions[identifier]
  }

  res.send(sessions)
}))

router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  res.status(200).json({ username: req.user.username })
}))

module.exports = router