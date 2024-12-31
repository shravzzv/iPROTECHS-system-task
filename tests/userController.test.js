const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')

jest.mock('../models/user')

describe('User Controller', () => {
  let token

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const user = {
      id: 'mockUserId',
      email: 'testuser2@example.com',
      role: 'user',
    }
    User.findById.mockResolvedValue(user)
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('GET /user/profile', () => {
    it('should get the user profile', async () => {
      const res = await request(app)
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('id', 'mockUserId')
      expect(res.body).toHaveProperty('email', 'testuser2@example.com')
    })

    it('should not get the profile for non-user role', async () => {
      const res = await request(app)
        .get('/user/profile')
        .set('Authorization', `Bearer invalidtoken`)

      expect(res.statusCode).toEqual(401)
    })
  })
})
