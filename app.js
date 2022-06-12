const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
const {DB_HOST} = require('./env')

const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

mongoose.connect(DB_HOST)
.then(() => console.log("Database connection successful"))
.catch((e)=>process.exit(1));

const contactsRouter = require('./routes/api/contacts')
const authRouter = require('./routes/api/auth')


app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())


app.use('/api/contacts', contactsRouter)
app.use('/api/auth', authRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app;