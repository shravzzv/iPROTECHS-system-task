const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')
const Task = require('../models/task')

jest.mock('../models/user')
jest.mock('../models/task')

describe('Technician Controller', () => {
  let token

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const user = {
      id: 'mockUserId',
      email: 'testtech@example.com',
      role: 'technician',
    }
    User.findById.mockResolvedValue(user)
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    Task.find.mockResolvedValue([
      {
        title: 'Test Task',
        description: 'Test Task Description',
        deadline: new Date(),
        assignor: user.id,
        assignee: user.id,
      },
    ])
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('GET /technician/tasks', () => {
    it('should get the tasks assigned to the technician', async () => {
      const res = await request(app)
        .get('/technician/tasks')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toHaveProperty('title', 'Test Task')
    })

    it('should not get tasks for non-technician role', async () => {
      const res = await request(app)
        .get('/technician/tasks')
        .set('Authorization', `Bearer invalidtoken`)

      expect(res.statusCode).toEqual(401)
    })
  })
})
