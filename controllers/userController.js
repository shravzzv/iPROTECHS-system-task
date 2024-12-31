const asyncHandler = require('express-async-handler')
const User = require('../models/user')

exports.profile = asyncHandler(async (req, res) => {
  if (req?.user?.role !== 'user')
    return res.json('Invalid: This route is for users only')

  const profile = await User.find({ _id: req.user.id })
  res.json(profile)
})
