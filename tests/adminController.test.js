const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')

jest.mock('../models/user')

describe('Admin Controller', () => {
  let token

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const user = {
      id: 'mockUserId',
      email: 'testadmin@example.com',
      role: 'admin',
    }
    User.findById.mockResolvedValue(user)
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    User.find.mockResolvedValue([user])
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('GET /admin/users', () => {
    it('should get the list of users', async () => {
      const res = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toHaveProperty('email', 'testadmin@example.com')
    })

    it('should not get users for non-admin role', async () => {
      const res = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer invalidtoken`)

      expect(res.statusCode).toEqual(401)
    })
  })
})
