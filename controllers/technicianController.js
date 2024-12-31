const asyncHandler = require('express-async-handler')
const Task = require('../models/task')

exports.tasks = asyncHandler(async (req, res) => {
  if (req?.user?.role !== 'technician')
    return res.json('Invalid: This route is for technicians only')

  const tasks = await Task.find({ assignee: req.user.id })
  res.json(tasks)
})
