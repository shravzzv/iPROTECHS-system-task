const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const protect = require('../middleware/protect.middleware')

router.get('/profile', protect, userController.profile)

module.exports = router
