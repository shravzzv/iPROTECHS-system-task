const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const protect = require('../middleware/protect.middleware')

router.get('/users', protect, adminController.users)

module.exports = router
