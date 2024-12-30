const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  role: {
    type: String,
    enum: ['admin', 'manager', 'technician', 'user'],
    default: 'user',
  },
})

module.exports = new mongoose.model('User', UserSchema)
