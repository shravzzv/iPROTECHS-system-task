const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: {type: Date, required: true},
  assignor: { type: Schema.Types.ObjectId, ref: 'User' },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = new mongoose.model('Task', taskSchema)
