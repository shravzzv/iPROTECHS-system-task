const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()

require('./config/db.config')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const managerRouter = require('./routes/manager')
const technicianRouter = require('./routes/technician')
const userRouter = require('./routes/user')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/manager', managerRouter)
app.use('/technician', technicianRouter)
app.use('/user', userRouter)

module.exports = app
