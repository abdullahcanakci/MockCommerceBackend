const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./controllers/users')
const productRouter = require('./controllers/products')
const loginRouter = require('./controllers/login')
const categoriesRouter = require('./controllers/categories')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const mongoose = require('mongoose')

logger.info('Server starting up')

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB ATLAS.')
  })
  .catch(error => {
    logger.error('Error while connecting to MongoDB: \n', error.message)
  })

app.use(express.static('static'))
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.get('/', async (request, response) => {
  response.sendFile('static/index.html')
})

app.use('/api/products', productRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/categories', categoriesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app