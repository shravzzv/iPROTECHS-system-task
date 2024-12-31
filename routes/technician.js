const express = require('express')
const router = express.Router()
const technicianController = require('../controllers/technicianController')
const protect = require('../middleware/protect.middleware')

router.get('/tasks', protect, technicianController.tasks)

module.exports = router
