const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.send('Welcome to the API of iPROTECHS system task')
})

module.exports = router
