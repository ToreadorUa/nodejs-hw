const express = require('express') // framework for creating webserver
const logger = require('morgan') // log
const cors = require('cors') // middleware for correct request from other address
require("dotenv").config(); // loads environment variables from a .env file into process.env

const contactsRouter = require('./routes/api/contacts') // import page of webserver
 
const app = express() // create web server

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors()) // middleware for correct request from other address to web server
app.use(express.json()) // check all requests body, if its JSON - change to object

app.use('/api/contacts', contactsRouter) //anu request from 'api/contacts' will do in 'contactsRouter'

app.use((req, res) => {                         // if unknown address - 404
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {     // error handling
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({message});
})

module.exports = app
