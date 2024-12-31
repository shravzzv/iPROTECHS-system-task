const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')

jest.mock('../models/user')

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      User.findOne.mockResolvedValue(null)
      User.prototype.save = jest.fn().mockResolvedValue({
        id: 'mockUserId',
        email: 'testuser@example.com',
        role: 'user',
      })
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword')
      jwt.sign = jest.fn().mockReturnValue('mockToken')

      const res = await request(app).post('/auth/signup').send({
        email: 'testuser@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'user',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('token', 'mockToken')
      expect(res.body).toHaveProperty('userId', 'mockUserId')
    })

    it('should not create a user with an existing email', async () => {
      User.findOne.mockResolvedValue({ id: 'existingUserId' })

      const res = await request(app).post('/auth/signup').send({
        email: 'testuser@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'user',
      })

      expect(res.statusCode).toEqual(401)
      expect(res.body[0]).toHaveProperty('msg', 'E-mail already in use.')
    })
  })

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      User.findOne.mockResolvedValue({
        id: 'mockUserId',
        email: 'testuser@example.com',
        password: 'hashedPassword',
      })
      bcrypt.compare = jest.fn().mockResolvedValue(true)
      jwt.sign = jest.fn().mockReturnValue('mockToken')

      const res = await request(app).post('/auth/login').send({
        email: 'testuser@example.com',
        password: 'password123',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('token', 'mockToken')
      expect(res.body).toHaveProperty('userId', 'mockUserId')
    })

    it('should not login with incorrect password', async () => {
      User.findOne.mockResolvedValue({
        id: 'mockUserId',
        email: 'testuser@example.com',
        password: 'hashedPassword',
      })
      bcrypt.compare = jest.fn().mockResolvedValue(false)

      const res = await request(app).post('/auth/login').send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      })

      expect(res.statusCode).toEqual(401)
      expect(res.body[0]).toHaveProperty('msg', 'Incorrect password.')
    })
  })
})
