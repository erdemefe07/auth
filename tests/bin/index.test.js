const request = require('supertest');
const app = require('../../app')
const mongoose = require('mongoose')
let db

beforeAll(async () => {
  db = require('./db')
  await db.open()
  await require('../../bin/www') // bootstrap app
})

describe('Auth Route', () => {
  describe('Register Route', () => {
    test('Get /register, it must be post request so it should be fail', async () => {
      request(app)
        .get('/auth/register')
        .expect('Content-Type', /html/)
        .expect(404)
        .then(response => {
          expect(response.text).toMatch(/Cannot GET \/auth\/register/);
        })
        .catch(err => { throw err })
    })

    test('Post /register, DTO test', async () => {
      await request(app)
        .post('/auth/register')
        .send({ username: "", password: "" })
        .then(response => {
          expect(response.body.message).toBe('User validation failed: username: Username must be between 1 and 50 characters, password: Password must be between 8 and 50 characters. It must contain at least 1 lowercase, 1 uppercase and 1 number.')
        })
        .catch(err => { throw err })

      await request(app)
        .post('/auth/register')
        .send({ username: "erdemefe07", password: "" })
        .then(response => {
          expect(response.body.message).toBe('User validation failed: password: Password must be between 8 and 50 characters. It must contain at least 1 lowercase, 1 uppercase and 1 number.')
        })
        .catch(err => { throw err })

      await request(app)
        .post('/auth/register')
        .send({ username: "erdemefe07", password: "2691582Efe" })
        .then(response => {
          expect(response.body.status).toBe("ok")
        })
        .catch(err => { throw err })
    })
  })


  test('a', () => {
    expect(1 + 2).toBe(3)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  await db.stop()
})