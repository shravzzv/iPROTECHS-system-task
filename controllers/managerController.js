const asyncHandler = require('express-async-handler')
const Task = require('../models/task')
const { body, validationResult, matchedData } = require('express-validator')

exports.tasks = [
  (req, res, next) => {
    if (req?.user?.role !== 'manager')
      return res.json('Invalid: This route is for managers only')
    else next()
  },

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title must not be empty.')
    .bail()
    .isLength({ min: 3, max: 32 })
    .withMessage('Title must be 3-32 characters long.')
    .escape(),

  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Description must not be empty.')
    .bail()
    .isLength({ min: 3, max: 250 })
    .withMessage('Description must be 3-250 characters long.')
    .escape(),

  body('deadline')
    .trim()
    .notEmpty()
    .withMessage('Deadline must not be empty.')
    .bail()
    .isISO8601()
    .withMessage('Deadline must be a valid date.')
    .toDate(),

  body('assignee')
    .trim()
    .notEmpty()
    .withMessage('Assignee must not be empty.')
    .bail()
    .isMongoId()
    .withMessage('Assignee must be a valid user ID.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    const { title, description, deadline, assignee } = matchedData(req, {
      onlyValidData: false,
    })

    const newTask = new Task({
      title,
      description,
      deadline,
      assignor: req.user.id,
      assignee,
    })

    if (errors.isEmpty()) {
      await newTask.save()
      res.json(newTask)
    } else {
      res.status(401).json(errors.array())
    }
  }),
]
