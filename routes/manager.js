const express = require('express')
const router = express.Router()
const managerController = require('../controllers/managerController')
const protect = require('../middleware/protect.middleware')

router.post('/tasks', protect, managerController.tasks)

module.exports = router
