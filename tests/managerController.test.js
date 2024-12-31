const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')
const Task = require('../models/task')

jest.mock('../models/user')
jest.mock('../models/task')

describe('Manager Controller', () => {
  let token

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const user = {
      id: 'mockUserId',
      email: 'testmanager@example.com',
      role: 'manager',
    }
    User.findById.mockResolvedValue(user)
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('POST /manager/tasks', () => {
    it('should create a new task', async () => {
      Task.prototype.save = jest.fn().mockResolvedValue({
        title: 'New Task',
        description: 'New Task Description',
        deadline: new Date(),
        assignor: 'mockUserId',
        assignee: 'mockAssigneeId',
      })

      const res = await request(app)
        .post('/manager/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          deadline: new Date(),
          assignee: mongoose.Types.ObjectId(),
        })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('title', 'New Task')
    })

    it('should not create a task with invalid data', async () => {
      const res = await request(app)
        .post('/manager/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          description: '',
          deadline: '',
          assignee: '',
        })

      expect(res.statusCode).toEqual(401)
    })
  })
})
