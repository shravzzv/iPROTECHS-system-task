const asyncHandler = require('express-async-handler')
const User = require('../models/user')

exports.users = asyncHandler(async (req, res) => {
  if (req?.user?.role !== 'admin')
    return res.json('Invalid: This route is for admins only')

  const users = await User.find()
  res.json(users)
})
