const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://guzolmihailova:DwJ-MV9ihCrWMGf@cluster0.jcpcd.mongodb.net/db-contacts?retryWrites=true&w=majority')
.then(() => console.log("Database connection successful"))
.catch((e)=>process.exit(1));

const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app;